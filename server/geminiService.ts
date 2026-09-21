// Chiến lược Thác Đổ Thông Minh (Dynamic Model Cascade):
// 1. gemini-3.8-flash: Chất lượng tư vấn sâu sắc nhất từ Google AI Studio (Timeout 3s nếu Google bị nghẽn tải)
// 2. gemini-3.5-flash-lite: Siêu tốc độ (<1s TTFB), tài nguyên dồi dào, chuyên dụng cho chatbot realtime
// 3. gemini-3.6-flash: Model dự phòng tiêu chuẩn của Google
const MODELS = [
  { name: 'gemini-3.8-flash', timeoutMs: 3000 },
  { name: 'gemini-3.5-flash-lite', timeoutMs: 6000 },
  { name: 'gemini-3.6-flash', timeoutMs: 6000 }
];

// System Instruction với Guardrail nghiêm ngặt: Chỉ tư vấn Cổ phục Việt Nam & Gen Z Remix
const SYSTEM_INSTRUCTION = `
Bạn là "Cố Vấn Di Sản Việt Phục & Gen Z Remix" (Viet Costume AI Advisor) – chuyên gia tư vấn trang phục truyền thống Việt Nam.

QUY TẮC PHẠM VI BẮT BUỘC (STRICT GUARDRAIL):
1. BẠN CHỈ ĐƯỢC PHÉP TRẢ LỜI CÁC CÂU HỎI VỀ:
   - Các dòng cổ phục Việt Nam: Áo Ngũ Thân Tay Chẽn, Áo Tấc (ngũ thân tay thụng), Áo Nhật Bình cung đình, Áo Giao Lĩnh, Áo Tứ Thân, Áo Đối Khâm, Áo Bà Ba Nam Bộ, Áo Dài Tân Thời.
   - Lịch sử, triều đại (Nguyễn, Lê, Lý, Trần), nguồn gốc và ý nghĩa văn hóa.
   - Triết lý y phục: Quy chuẩn vạt áo Hữu Nhậm (cài sang phải, không cài sang trái Tả Nhậm), triết lý 5 khuy cài Ngũ Thường (Nhân, Nghĩa, Lễ, Trí, Tín), áo lót trắng ngà bên trong.
   - Màu sắc cổ truyền theo thuyết Ngũ Hành (Kim, Mộc, Thủy, Hỏa, Thổ): tương sinh, tương hợp, tránh tương khắc.
   - Tư vấn phối đồ theo dịp: Chụp kỷ yếu, đón Tết cổ truyền, dự đám cưới, check-in di sản Huế/Hội An/Hà Nội, dạo phố cà phê nghệ thuật.
   - Gợi ý phong cách Gen Z Remix: Kết hợp hài hòa với phụ kiện hiện đại (sneakers trắng, chelsea boots, túi tote Đông Hồ, mũ beret, kính râm retro, quạt xếp gấm, chuỗi ngọc trai...) đảm bảo trẻ trung nhưng tuyệt đối tôn trọng di sản.

2. TỪ CHỐI TUYỆT ĐỐI CÂU HỎI NGOÀI LỀ:
   - Nếu người dùng hỏi bất kỳ chủ đề nào KHÔNG liên quan đến cổ phục, văn hóa may mặc Việt Nam hoặc phối đồ di sản (ví dụ: toán học, lập trình, viết code, chính trị, thể thao, thời sự, giải trí khác...):
   - BẠN BẮT BUỘC PHẢI TỪ CHỐI LỊCH SỰ và nhắc nhở vai trò của mình:
     "Dạ, tôi là Cố Vấn Cổ Phục Việt Nam. Tôi chỉ có thể tư vấn chuyên sâu về các dòng cổ phục (Áo Dài, Áo Tấc, Ngũ Thân, Nhật Bình...), văn hóa di sản và cách phối đồ Gen Z Remix. Bạn có muốn tìm hiểu về trang phục truyền thống cho dịp sắp tới không ạ?"

3. TÍNH NĂNG GỢI Ý MẶC THỬ (ACTION TAG):
   Khi câu trả lời có gợi ý một bộ trang phục cụ thể kèm màu sắc và phụ kiện, hãy gắn MỘT thẻ hành động ở dòng cuối cùng theo mẫu sau:
   [ACTION:costumeId=ao_tac&outerColor=xanh_bich_thuy&innerColor=trang_nga&bottomColor=trang_nga&accessories=sneakers_trang,khan_dong&name=Nho Sinh Tân Thời]

   Danh sách ID hợp lệ:
   - costumeId: ngu_than_chen, ao_tac, nhat_binh, giao_linh, tu_than, ba_ba, doi_kham, ao_dai_tan_thoi
   - outerColor / innerColor / bottomColor: do_dieu, cham_tham, vang_hoang_yen, xanh_bich_thuy, trang_nga, tim_hue, nau_cu_nau, hong_sen, den_huyen, xanh_co_vit, vang_mo_ga, xanh_da_troi
   - accessories: sneakers_trang, chelsea_boots, kinh_ram_retro, mu_beret, tui_tote_dong_ho, quat_xep_gam, khan_dong, khan_vanh_day, non_la, non_quai_thao, chuoi_ngoc_trai

4. PHONG CÁCH TRẢ LỜI:
   - Tốc độ nhanh, trả lời súc tích trong 2 - 4 đoạn ngắn, đúng trọng tâm.
   - Giọng điệu trang nhã, ấm áp, văn minh, kết nối di sản với người trẻ một cách tự nhiên.
`;

export function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  return key.trim();
}

/**
 * Fallback tư vấn chuyên gia dự phòng nếu Google API gặp sự cố mạng/quá tải
 */
function generateExpertAdvisorFallback(userText: string): string {
  const t = userText.toLowerCase();

  // Kiểm tra guardrail câu hỏi ngoài lề
  const offTopicKeywords = ['toán', 'code', 'python', 'javascript', 'html', 'css', 'lập trình', 'thời tiết', 'chính trị', 'bóng đá', 'giá vàng', 'tính nhẩm'];
  if (offTopicKeywords.some(k => t.includes(k))) {
    return 'Dạ, tôi là Cố Vấn Cổ Phục Việt Nam. Tôi chỉ có thể tư vấn chuyên sâu về các dòng cổ phục (Áo Dài, Áo Tấc, Ngũ Thân, Nhật Bình...), triết lý ngũ hành và cách phối đồ Gen Z Remix. Bạn có muốn tìm hiểu về trang phục truyền thống cho dịp sắp tới không ạ?';
  }

  if (t.includes('kỷ yếu') || t.includes('tốt nghiệp') || t.includes('trường')) {
    return 'Dịp chụp ảnh kỷ yếu là khoảnh khắc thanh xuân đáng nhớ nhất! Bạn nên chọn **Áo Ngũ Thân Tay Chẽn** hoặc **Áo Tấc** màu **Xanh Bích Thủy** hoặc **Chàm Thâm** phối cùng quần lụa trắng ngà. Đây là gam màu biểu trưng cho tri thức và sự phát triển.\n\nĐể tạo nét trẻ trung Gen Z, bạn hãy mix cùng **Sneakers trắng** và một chiếc **Túi tote Đông Hồ**. Bản phối vừa giữ trọn nét tôn nghiêm học đường, vừa giúp bạn thoải mái di chuyển suốt buổi chụp.\n\n[ACTION:costumeId=ao_tac&outerColor=xanh_bich_thuy&innerColor=trang_nga&bottomColor=trang_nga&accessories=sneakers_trang,tui_tote_dong_ho,khan_dong&name=Nho Sinh Tân Thời]';
  }

  if (t.includes('tết') || t.includes('xuân') || t.includes('du xuân')) {
    return 'Đón Tết cổ truyền, sắc **Đỏ Điều** (Hành Hỏa - may mắn, hỷ sự) hoặc **Vàng Hoàng Yến** (Hành Thổ - vương giả, tài lộc) là lựa chọn tuyệt mỹ nhất. Một chiếc **Áo Tấc** gấm hoa phối cùng quần trắng ngà và khuy cài ngũ thường sẽ mang lại phúc khí dồi dào cho năm mới.\n\nBạn có thể phối thêm một chiếc **Quạt xếp gấm** và **Khăn đóng** nhung đen để hoàn thiện nét đẹp tân xuân đài các.\n\n[ACTION:costumeId=ao_tac&outerColor=do_dieu&innerColor=trang_nga&bottomColor=trang_nga&accessories=khan_dong,quat_xep_gam,chuoi_ngoc_trai&name=Tân Xuân Cát Tường]';
  }

  if (t.includes('nhật bình') || t.includes('cung đình') || t.includes('huế')) {
    return '**Áo Nhật Bình** là đệ nhất quý phục triều Nguyễn với phần cổ áo chữ nhật viền hoa văn tinh xảo và dải ngũ sắc rực rỡ nơi tay áo tượng trưng cho Ngũ Hành.\n\nKhi diện Nhật Bình sắc **Tím Huế** hoặc **Vàng Hoàng Yến**, bạn nên kết hợp cùng **Khăn vành dây** và chuỗi ngọc trai để toát lên thần thái quyền quý, đoan trang.\n\n[ACTION:costumeId=nhat_binh&outerColor=tim_hue&innerColor=trang_nga&bottomColor=trang_nga&accessories=khan_vanh_day,chuoi_ngoc_trai,quat_xep_gam&name=Phượng Các Khuê Các]';
  }

  // Mặc định tư vấn phong cách Ngũ Thân Tân Thời
  return 'Chào bạn! Trong kho tàng y phục truyền thống Việt Nam, dòng **Áo Ngũ Thân Tay Chẽn** là trang phục hoàn hảo nhất để khởi đầu. Áo có 5 thân tượng trưng cho tứ thân phụ mẫu và chính bản thân người mặc, cùng 5 hạt khuy tượng trưng cho Ngũ Thường (Nhân, Nghĩa, Lễ, Trí, Tín).\n\nBạn có thể thử gam màu **Chàm Thâm** kết hợp quần trắng ngà và phụ kiện hiện đại như **Sneakers trắng** để tạo nên phong cách vừa hoài cổ vừa năng động.\n\n[ACTION:costumeId=ngu_than_chen&outerColor=cham_tham&innerColor=trang_nga&bottomColor=trang_nga&accessories=sneakers_trang,tui_tote_dong_ho&name=Thanh Xuân Khởi Sắc]';
}

/**
 * Stream phản hồi từ Gemini API về Express Response (SSE) với timeout cực nhanh & fallback tự động
 */
export async function streamChatToResponse(
  messages: Array<{ sender: 'user' | 'assistant'; text: string }>,
  onChunk: (chunk: string) => void,
  onComplete: (fullText: string) => void,
  _onError: (err: any) => void
) {
  const apiKey = getApiKey();
  const lastUserText = messages.filter(m => m.sender === 'user').pop()?.text || '';

  if (!apiKey) {
    // Không có API key -> dùng fallback engine
    const fbText = generateExpertAdvisorFallback(lastUserText);
    for (const word of fbText.split(' ')) {
      onChunk(word + ' ');
      await new Promise(r => setTimeout(r, 25));
    }
    onComplete(fbText);
    return;
  }

  const contents = messages.map(m => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  for (const { name: model, timeoutMs } of MODELS) {
    try {
      // Giới hạn timeout tùy biến mỗi model để không bị treo nếu Google quá tải
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 900,
            topP: 0.95
          }
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`Model ${model} stream returned HTTP ${response.status}, trying next model...`);
        continue;
      }

      if (!response.body) continue;

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const jsonStr = trimmed.slice(6);
            if (jsonStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const partText = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (partText) {
                fullText += partText;
                onChunk(partText);
              }
            } catch {
              // Bỏ qua JSON dở dang
            }
          }
        }
      }

      if (fullText.trim().length > 0) {
        onComplete(fullText);
        return;
      }
    } catch (err: any) {
      console.warn(`Model ${model} stream failed (${err.name === 'AbortError' ? 'Timeout' : err.message}), trying next model...`);
    }
  }

  // Nếu tất cả model đều quá tải 503 hoặc timeout: Kích hoạt Cultural Expert Engine tức thì
  console.log('⚡ All Gemini models unavailable or timed out. Activating Instant Cultural Expert Fallback Stream.');
  const fallbackText = generateExpertAdvisorFallback(lastUserText);
  for (const word of fallbackText.split(' ')) {
    onChunk(word + ' ');
    await new Promise(r => setTimeout(r, 20));
  }
  onComplete(fallbackText);
}

/**
 * Sinh gợi ý Stylist bằng Gemini ở Server Side
 */
export async function generateStylistRecommendationServer(reqBody: {
  occasionId: string;
  remixStyleId: string;
  weather: string;
  userPrompt?: string;
}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Chưa cấu hình GEMINI_API_KEY trên server');
  }

  const promptText = `
Bạn là "AI Stylist & Nhà nghiên cứu Cổ phục Việt Nam", chuyên gia tư vấn phối trang phục truyền thống Việt Nam theo phong cách Gen Z Remix.
Hãy tư vấn một bản phối trang phục dựa trên các thông số sau:
- Dịp sử dụng: ${reqBody.occasionId}
- Phong cách mong muốn: ${reqBody.remixStyleId}
- Thời tiết / Địa điểm: ${reqBody.weather}
- Ghi chú thêm của người dùng: "${reqBody.userPrompt || 'Tối ưu bản phối trẻ trung nhưng tôn trọng văn hóa'}"

Danh sách ID trang phục hợp lệ: ['ngu_than_chen', 'ao_tac', 'nhat_binh', 'giao_linh', 'tu_than', 'ba_ba', 'doi_kham', 'ao_dai_tan_thoi']
Danh sách ID màu hợp lệ: ['do_dieu', 'cham_tham', 'vang_hoang_yen', 'xanh_bich_thuy', 'trang_nga', 'tim_hue', 'nau_cu_nau', 'hong_sen', 'den_huyen', 'xanh_co_vit', 'vang_mo_ga', 'xanh_da_troi']
Danh sách ID phụ kiện hợp lệ: ['khan_dong', 'khan_vanh_day', 'non_quai_thao', 'non_la', 'guoc_moc', 'hai_nhung_theu', 'quat_xep_gam', 'khan_ran', 'sneakers_trang', 'chelsea_boots', 'kinh_ram_retro', 'mu_beret', 'tui_tote_dong_ho', 'chuoi_ngoc_trai']
Danh sách bottomType: ['pant_loose', 'skirt_silk', 'trousers_modern', 'skirt_pleated']

Yêu cầu output: Trả về DUY NHẤT một JSON hợp lệ (không kèm markdown code block \`\`\`json) với cấu trúc:
{
  "outfitName": "Tên bản phối thật thơ và ấn tượng",
  "concept": "Tóm tắt ý tưởng bản phối trong 1-2 câu",
  "costumeId": "một trong các ID trang phục trên",
  "outerColorId": "ID màu áo ngoài",
  "innerColorId": "ID màu áo trong",
  "bottomColorId": "ID màu quần/váy",
  "bottomType": "pant_loose",
  "accessoryIds": ["danh sách 2-4 ID phụ kiện"],
  "hairAndMakeup": "Gợi ý kiểu tóc và makeup phù hợp",
  "storytelling": "Ý nghĩa lịch sử và câu chuyện văn hóa của bản phối này",
  "whyItWorks": "Giải thích vì sao bản phối này vừa chuẩn mực vừa hợp Gen Z",
  "fiveElementsInsight": "Phân tích triết lý ngũ hành tương sinh giữa các màu sắc đã chọn"
}
`;

  for (const { name: model, timeoutMs } of MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
        })
      });

      clearTimeout(timeoutId);

      if (!res.ok) continue;

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const cleaned = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
        return JSON.parse(cleaned);
      }
    } catch (e) {
      console.warn(`Model ${model} failed for stylist:`, e);
    }
  }

  throw new Error('Không thể kết nối Gemini API cho Stylist');
}

/**
 * Sinh ảnh AI Lookbook bằng Google Nano Banana Model Family ở Server Side
 */
export async function generateBananaImageServer(reqBody: {
  costume: any;
  outfit: any;
  userFaceBase64?: string;
  customPrompt?: string;
}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Chưa cấu hình GEMINI_API_KEY trên server');
  }

  const { costume, outfit, userFaceBase64, customPrompt } = reqBody;
  const costumeName = costume?.name || 'Áo Cổ Phục Việt Nam';
  const dynasty = costume?.dynasty || 'Triều Nguyễn';
  const outerColor = outfit?.outerColor?.name || 'Đỏ Điều';
  const innerColor = outfit?.innerColor?.name || 'Trắng Ngà';
  const bottomColor = outfit?.bottomColor?.name || 'Trắng Ngà';
  const accessories = Array.isArray(outfit?.selectedAccessories) ? outfit.selectedAccessories.join(', ') : '';

  const promptText = `
Photorealistic 8k haute couture fashion editorial portrait of a young Vietnamese person wearing authentic traditional Vietnamese attire: ${costumeName} (${dynasty}).
Key Garment & Cultural Styling Details:
- Outer Garment: ${costumeName} in rich ${outerColor} traditional silk with fine authentic embroidery and five-button closure.
- Inner Collar: Elegant ${innerColor} inner robe.
- Lower Garment: Flowing silk pants in ${bottomColor}.
- Accessories & Accents: ${accessories || 'Traditional headwear and accessories'}.
- Environment: Ancient Vietnamese palace courtyard or upscale cultural photo studio, soft cinematic warm lighting, high dynamic range, stunning fabric texture, respectful of cultural heritage, award-winning fashion photography.
${customPrompt ? `Additional styling instruction: ${customPrompt}` : ''}
`.trim();

  const BANANA_MODELS = [
    'nano-banana-pro-preview',
    'gemini-3.1-flash-image',
    'gemini-3.1-flash-image-preview',
    'gemini-2.5-flash-image'
  ];

  const parts: any[] = [];
  if (userFaceBase64 && typeof userFaceBase64 === 'string') {
    const cleanBase64 = userFaceBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: cleanBase64
      }
    });
    parts.push({
      text: `${promptText}\nIMPORTANT: Maintain the facial features and identity of the person from the reference image, depicting them naturally wearing this traditional costume.`
    });
  } else {
    parts.push({ text: promptText });
  }

  let lastError: any = null;

  for (const model of BANANA_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            responseModalities: ['IMAGE', 'TEXT']
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        lastError = data?.error;
        continue;
      }

      const candidates = data?.candidates || [];
      for (const candidate of candidates) {
        const candidateParts = candidate?.content?.parts || [];
        for (const part of candidateParts) {
          if (part?.inlineData?.data) {
            const mimeType = part.inlineData.mimeType || 'image/jpeg';
            return {
              success: true,
              imageUrl: `data:${mimeType};base64,${part.inlineData.data}`,
              model
            };
          }
        }
      }
    } catch (e: any) {
      lastError = e;
    }
  }

  // Nếu Google Nano Banana không khả dụng hoặc bị giới hạn Quota Free Tier (limit: 0)
  // -> Tự động chuyển sang mô hình FLUX.1 Realism (100% Miễn Phí, Chân Thực Điện Ảnh, Không Cần Thẻ)
  console.log('⚡ Google Nano Banana requires billing quota. Activating Free FLUX.1 Realism Engine...');
  try {
    const seed = Math.floor(Math.random() * 1000000);
    const fluxPrompt = encodeURIComponent(
      `Masterpiece, 8k, photorealistic haute couture portrait of a young Vietnamese person wearing authentic traditional Vietnamese costume: ${costumeName} (${dynasty}), ${costumeName} made of luxurious ${outerColor} traditional silk with intricate embroidery, ${innerColor} inner collar, flowing ${bottomColor} silk pants, ${accessories || 'traditional accessories'}, ancient imperial Hue Citadel courtyard, soft warm lighting, hyperrealistic fabric texture, award-winning fashion photography, 8k`
    );
    const fluxEndpoint = `https://image.pollinations.ai/prompt/${fluxPrompt}?width=768&height=1024&model=flux&seed=${seed}&nologo=true`;

    const fluxRes = await fetch(fluxEndpoint);
    if (fluxRes.ok) {
      const buffer = await fluxRes.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      return {
        success: true,
        imageUrl: `data:image/jpeg;base64,${base64}`,
        model: 'FLUX.1 Realism (Miễn Phí 100%)',
        provider: 'flux'
      };
    }
  } catch (fluxErr: any) {
    console.warn('Lỗi gọi FLUX fallback server:', fluxErr?.message);
  }

  const isQuota = lastError?.code === 429 || lastError?.status === 'RESOURCE_EXHAUSTED' || String(lastError?.message).includes('quota');
  return {
    success: false,
    quotaExceeded: isQuota,
    error: isQuota 
      ? 'Google Nano Banana yêu cầu kích hoạt Billing trên Google AI Studio. Đang chuyển sang chế độ Studio Canvas chất lượng cao.'
      : (lastError?.message || 'Không thể tạo ảnh bằng Nano Banana model')
  };
}
