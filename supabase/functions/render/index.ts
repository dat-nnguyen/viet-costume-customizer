// Supabase Edge Function: AI Image Generation via Google "Nano Banana" Model Family
// Runtime: Deno
import { corsHeaders } from '../_shared/cors.ts';

// Danh sách các model trong gia đình "Nano Banana" của Google theo thứ tự ưu tiên:
const BANANA_MODELS = [
  'nano-banana-pro-preview',
  'gemini-3.1-flash-image',
  'gemini-3.1-flash-image-preview',
  'gemini-2.5-flash-image'
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

  const { costume, outfit, userFaceBase64, customPrompt = '' } = body;

  const apiKey = (Deno.env.get('GEMINI_API_KEY') || Deno.env.get('VITE_GEMINI_API_KEY') || '').trim();
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Chưa cấu hình GEMINI_API_KEY trên Supabase Secrets' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const costumeName = costume?.name || 'Áo Cổ Phục Việt Nam';
  const dynasty = costume?.dynasty || 'Triều Nguyễn';
  const outerColor = outfit?.outerColor?.name || 'Đỏ Điều';
  const innerColor = outfit?.innerColor?.name || 'Trắng Ngà';
  const bottomColor = outfit?.bottomColor?.name || 'Trắng Ngà';
  const accessories = Array.isArray(outfit?.selectedAccessories) ? outfit.selectedAccessories.join(', ') : '';

  // Xây dựng prompt chi tiết cho Nano Banana
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

  // Xây dựng contents payload cho Gemini API
  const parts: any[] = [];

  // Nếu người dùng có gửi kèm ảnh khuôn mặt (Face-to-Image)
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
        console.warn(`Model ${model} error:`, data?.error?.message || data?.error?.status);
        continue;
      }

      // Tìm dữ liệu ảnh trả về từ candidates
      const candidates = data?.candidates || [];
      for (const candidate of candidates) {
        const candidateParts = candidate?.content?.parts || [];
        for (const part of candidateParts) {
          if (part?.inlineData?.data) {
            const mimeType = part.inlineData.mimeType || 'image/jpeg';
            const imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
            return new Response(JSON.stringify({
              success: true,
              imageUrl,
              model,
              prompt: promptText
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        }
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} fetch failed:`, err?.message);
    }
  }

  // Google Nano Banana yêu cầu Billing Account (hoặc $300 GCP Free Credit) do Google quy định limit: 0 trên Free Tier
  const isQuota = lastError?.code === 429 || lastError?.status === 'RESOURCE_EXHAUSTED' || String(lastError?.message).includes('quota');

  return new Response(JSON.stringify({
    success: false,
    quotaExceeded: isQuota,
    error: isQuota 
      ? 'Google AI Studio áp dụng hạn mức limit: 0 cho model tạo ảnh trên gói Free API. Để kích hoạt Google Nano Banana Pro, bạn có thể liên kết dự án với $300 Credit miễn phí của Google Cloud. Ứng dụng tự động giữ nguyên ảnh chụp Studio Người Mẫu Thật chuẩn di sản.'
      : (lastError?.message || 'Không thể tạo ảnh bằng Nano Banana model')
  }), {
    status: isQuota ? 429 : 500,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
