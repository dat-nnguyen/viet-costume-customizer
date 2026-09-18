const PRIMARY_MODEL = 'gemini-3.7-flash';
const FALLBACK_MODEL = 'gemini-3.5-flash';

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
 * Stream phản hồi từ Gemini API về Express Response (SSE)
 */
export async function streamChatToResponse(
  messages: Array<{ sender: 'user' | 'assistant'; text: string }>,
  onChunk: (chunk: string) => void,
  onComplete: (fullText: string) => void,
  onError: (err: any) => void
) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Chưa cấu hình GEMINI_API_KEY trên server');
  }

  const contents = messages.map(m => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  const models = [PRIMARY_MODEL, FALLBACK_MODEL];

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      if (!response.ok) {
        console.warn(`Model ${model} stream error:`, response.status);
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

      onComplete(fullText);
      return;
    } catch (err) {
      console.warn(`Streaming with ${model} failed, trying next model:`, err);
    }
  }

  onError(new Error('Tất cả model Gemini đều không phản hồi'));
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

  const models = [PRIMARY_MODEL, FALLBACK_MODEL];
  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
        })
      });

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
