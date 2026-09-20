// Supabase Edge Function: AI Stylist & Gen Z Remix Recommender
// Runtime: Deno
import { corsHeaders } from '../_shared/cors.ts';

const MODELS = [
  { name: 'gemini-3.8-flash', timeoutMs: 4000 },
  { name: 'gemini-3.5-flash-lite', timeoutMs: 6000 },
  { name: 'gemini-3.6-flash', timeoutMs: 6000 }
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Body JSON không hợp lệ' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const { occasionId, remixStyleId, weather, userPrompt = '' } = body;
  const apiKey = (Deno.env.get('GEMINI_API_KEY') || Deno.env.get('VITE_GEMINI_API_KEY') || '').trim();

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Chưa cấu hình GEMINI_API_KEY trong Supabase Secrets' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const promptText = `
Bạn là "AI Stylist & Nhà nghiên cứu Cổ phục Việt Nam", chuyên gia tư vấn phối trang phục truyền thống Việt Nam theo phong cách Gen Z Remix.
Hãy tư vấn một bản phối trang phục dựa trên các thông số sau:
- Dịp sử dụng: ${occasionId}
- Phong cách mong muốn: ${remixStyleId}
- Thời tiết / Địa điểm: ${weather}
- Ghi chú thêm của người dùng: "${userPrompt || 'Tối ưu bản phối trẻ trung nhưng tôn trọng văn hóa'}"

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

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
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
        const parsed = JSON.parse(cleaned);
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } catch (e: any) {
      console.warn(`Model ${model} failed for stylist:`, e?.message);
    }
  }

  return new Response(JSON.stringify({ error: 'Không thể kết nối Gemini API để tạo bản phối' }), {
    status: 503,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
