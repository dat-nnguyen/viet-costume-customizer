// Supabase Edge Function: AI Chat Streaming SSE & Heritage Advisor
// Runtime: Deno
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const MODELS = [
  { name: 'gemini-3.8-flash', timeoutMs: 3000 },
  { name: 'gemini-3.5-flash-lite', timeoutMs: 6000 },
  { name: 'gemini-3.6-flash', timeoutMs: 6000 }
];

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

function generateExpertAdvisorFallback(userText: string): string {
  const t = userText.toLowerCase();

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

  return 'Chào bạn! Trong kho tàng y phục truyền thống Việt Nam, dòng **Áo Ngũ Thân Tay Chẽn** là trang phục hoàn hảo nhất để khởi đầu. Áo có 5 thân tượng trưng cho tứ thân phụ mẫu và chính bản thân người mặc, cùng 5 hạt khuy tượng trưng cho Ngũ Thường (Nhân, Nghĩa, Lễ, Trí, Tín).\n\nBạn có thể thử gam màu **Chàm Thâm** kết hợp quần trắng ngà và phụ kiện hiện đại như **Sneakers trắng** để tạo nên phong cách vừa hoài cổ vừa năng động.\n\n[ACTION:costumeId=ngu_than_chen&outerColor=cham_tham&innerColor=trang_nga&bottomColor=trang_nga&accessories=sneakers_trang,tui_tote_dong_ho&name=Thanh Xuân Khởi Sắc]';
}

Deno.serve(async (req) => {
  // Xử lý CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Khởi tạo Supabase client kết nối database
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';
  const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

  // Hỗ trợ GET lịch sử chat theo sessionId
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('sessionId') || 'default_session';

    if (!supabase) {
      return new Response(JSON.stringify({ history: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ history: data || [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
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

  const { messages, sessionId = 'default_session' } = body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'messages array is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const lastUserMsg = messages[messages.length - 1];
  const lastUserText = lastUserMsg?.text || '';

  // Lưu tin nhắn user vào database bất đồng bộ
  if (supabase && lastUserMsg && lastUserMsg.sender === 'user') {
    supabase.from('chat_messages').insert({
      id: 'msg_u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      session_id: sessionId,
      sender: 'user',
      text: lastUserText,
      created_at: Date.now()
    }).then(({ error }) => {
      if (error) console.warn('Lỗi lưu tin nhắn user vào Supabase DB:', error.message);
    });
  }

  const apiKey = (Deno.env.get('GEMINI_API_KEY') || Deno.env.get('VITE_GEMINI_API_KEY') || '').trim();

  // Khởi tạo TransformStream cho Server-Sent Events (SSE)
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Xử lý stream ngầm
  (async () => {
    try {
      if (!apiKey) {
        // Fallback tức thì khi chưa cấu hình API key
        const fbText = generateExpertAdvisorFallback(lastUserText);
        for (const word of fbText.split(' ')) {
          await writer.write(encoder.encode(`data: ${JSON.stringify({ text: word + ' ' })}\n\n`));
          await new Promise(r => setTimeout(r, 20));
        }
        await writer.write(encoder.encode('data: [DONE]\n\n'));
        await writer.close();
        return;
      }

      const contents = messages.map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      let fullText = '';
      let streamSuccess = false;

      for (const { name: model, timeoutMs } of MODELS) {
        try {
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

          if (!response.ok || !response.body) {
            console.warn(`Model ${model} stream HTTP status ${response.status}, cascading...`);
            continue;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let buffer = '';

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
                    await writer.write(encoder.encode(`data: ${JSON.stringify({ text: partText })}\n\n`));
                  }
                } catch {
                  // Bỏ qua JSON dở dang
                }
              }
            }
          }

          if (fullText.trim().length > 0) {
            streamSuccess = true;
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${model} failed (${err.name === 'AbortError' ? 'Timeout' : err.message}), trying next model...`);
        }
      }

      // Nếu tất cả model quá tải hoặc timeout -> Kích hoạt Cultural Expert Fallback
      if (!streamSuccess) {
        console.log('⚡ All Gemini models unavailable. Activating Instant Cultural Expert Fallback Stream.');
        const fallbackText = generateExpertAdvisorFallback(lastUserText);
        for (const word of fallbackText.split(' ')) {
          await writer.write(encoder.encode(`data: ${JSON.stringify({ text: word + ' ' })}\n\n`));
          await new Promise(r => setTimeout(r, 20));
        }
        fullText = fallbackText;
      }

      // Lưu tin nhắn assistant vào Supabase DB
      if (supabase && fullText.trim().length > 0) {
        supabase.from('chat_messages').insert({
          id: 'msg_a_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          session_id: sessionId,
          sender: 'assistant',
          text: fullText,
          created_at: Date.now()
        }).then(({ error }) => {
          if (error) console.warn('Lỗi lưu tin nhắn assistant vào Supabase DB:', error.message);
        });
      }

      await writer.write(encoder.encode('data: [DONE]\n\n'));
      await writer.close();
    } catch (streamErr: any) {
      console.error('Lỗi khi streaming SSE:', streamErr);
      try {
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: streamErr.message || 'Lỗi xử lý AI' })}\n\n`));
        await writer.close();
      } catch {
        // Stream đã đóng
      }
    }
  })();

  return new Response(readable, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    }
  });
});
