// Supabase Edge Function: Lookbooks CRUD Persistence
// Runtime: Deno
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Supabase credentials missing on Edge runtime' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. GET: Lấy danh sách lookbooks
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('lookbooks')
      .select('*')
      .order('inserted_at', { ascending: false });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const formatted = (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      createdAt: row.created_at,
      outfit: typeof row.outfit_data === 'string' ? JSON.parse(row.outfit_data) : row.outfit_data,
      score: typeof row.score_data === 'string' ? JSON.parse(row.score_data) : row.score_data,
      aiNote: row.ai_note,
      thumbnailUrl: row.thumbnail_url
    }));

    return new Response(JSON.stringify(formatted), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // 2. POST: Lưu Lookbook mới
  if (req.method === 'POST') {
    try {
      const item = await req.json();
      if (!item || !item.id || !item.outfit) {
        return new Response(JSON.stringify({ error: 'Dữ liệu Lookbook không hợp lệ' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { data, error } = await supabase
        .from('lookbooks')
        .upsert({
          id: item.id,
          title: item.title || 'Bản Phối Cổ Phục',
          created_at: item.createdAt || new Date().toISOString(),
          outfit_data: item.outfit,
          score_data: item.score || {},
          ai_note: item.aiNote || null,
          thumbnail_url: item.thumbnailUrl || null
        })
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify(item), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  // 3. DELETE: Xóa Lookbook theo ID
  if (req.method === 'DELETE') {
    const url = new URL(req.url);
    let id = url.searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // Không có body
      }
    }

    if (!id) {
      // Thử lấy từ path (ví dụ /lookbooks/lb_123)
      const segments = url.pathname.split('/').filter(Boolean);
      id = segments[segments.length - 1];
    }

    if (!id || id === 'lookbooks') {
      return new Response(JSON.stringify({ error: 'Missing id parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { error } = await supabase
      .from('lookbooks')
      .delete()
      .eq('id', id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders });
});
