import { ChatMessage, ChatActionPayload, CostumeId } from '../types';

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

// Phân tích action tag từ text
export function parseActionTag(text: string): { cleanText: string; actionPayload?: ChatActionPayload } {
  const actionRegex = /\[ACTION:([^\]]+)\]/i;
  const match = text.match(actionRegex);

  if (!match) {
    return { cleanText: text };
  }

  const rawParams = match[1];
  const cleanText = text.replace(actionRegex, '').trim();
  const params = new URLSearchParams(rawParams);

  const costumeId = (params.get('costumeId') || undefined) as CostumeId | undefined;
  const outerColorId = params.get('outerColor') || undefined;
  const innerColorId = params.get('innerColor') || undefined;
  const bottomColorId = params.get('bottomColor') || undefined;
  const name = params.get('name') || undefined;
  const rawAccessories = params.get('accessories');
  const accessories = rawAccessories ? rawAccessories.split(',').filter(Boolean) : undefined;

  return {
    cleanText,
    actionPayload: {
      costumeId,
      outerColorId,
      innerColorId,
      bottomColorId,
      accessories,
      name
    }
  };
}

/**
 * Gửi tin nhắn đến Gemini API với cơ chế Streaming (Server-Sent Events) để có độ trễ cực thấp.
 * Sử dụng trực tiếp API key của dự án từ VITE_GEMINI_API_KEY.
 */
export async function streamGeminiChatResponse(
  messages: ChatMessage[],
  onChunk: (currentText: string, actionPayload?: ChatActionPayload) => void
): Promise<{ text: string; actionPayload?: ChatActionPayload }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    const errorMsg = '⚠️ Chưa cấu hình VITE_GEMINI_API_KEY trong file `.env`. Vui lòng thêm khóa Google Gemini API để kích hoạt Chatbot tư vấn trực tiếp!';
    onChunk(errorMsg);
    return { text: errorMsg };
  }

  // Chuyển đổi lịch sử chat sang định dạng của Gemini API (contents)
  const contents = messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  const modelsToTry = [PRIMARY_MODEL, FALLBACK_MODEL];

  for (const model of modelsToTry) {
    try {
      // 1. Gọi API dạng Streaming (Server-Sent Events) với model hiện tại
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey.trim()}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 900,
            topP: 0.95
          }
        })
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.warn(`Gemini stream API (${model}) error:`, response.status, errBody);
        continue; // Thử model tiếp theo
      }

      if (!response.body) {
        continue;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedRaw = '';

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
                accumulatedRaw += partText;
                const { cleanText, actionPayload } = parseActionTag(accumulatedRaw);
                onChunk(cleanText, actionPayload);
              }
            } catch {
              // bỏ qua chunk JSON chưa hoàn chỉnh
            }
          }
        }
      }

      const { cleanText, actionPayload } = parseActionTag(accumulatedRaw);
      return { text: cleanText, actionPayload };
    } catch (streamErr) {
      console.warn(`Model ${model} streaming error:`, streamErr);
      // Tiếp tục vòng lặp sang fallback model
    }
  }

  // 2. Dự phòng: Thử Non-streaming request nếu SSE bị ngắt
  for (const model of modelsToTry) {
    try {
      const fallbackRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 900
          }
        })
      });

      if (!fallbackRes.ok) continue;

      const data = await fallbackRes.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) {
        const { cleanText, actionPayload } = parseActionTag(reply);
        onChunk(cleanText, actionPayload);
        return { text: cleanText, actionPayload };
      }
    } catch (nonStreamErr) {
      console.warn(`Model ${model} non-streaming error:`, nonStreamErr);
    }
  }

  const failMsg = 'Dạ, hệ thống tư vấn đang kết nối bận một chút. Bạn vui lòng thử lại sau vài giây nhé!';
  onChunk(failMsg);
  return { text: failMsg };
}
