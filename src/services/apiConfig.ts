/**
 * Cấu hình Endpoint kết nối Backend:
 * - Ưu tiên 1: Supabase Cloud (Edge Functions) nếu có VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
 * - Ưu tiên 2: Local Express Server (/api/*) khi chạy phát triển cục bộ
 */

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const SUPABASE_URL = rawSupabaseUrl.replace(/\/+$/, '');
export const SUPABASE_ANON_KEY = rawAnonKey.trim();

export const isUsingSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export function getChatEndpoint(): string {
  if (isUsingSupabase) {
    return `${SUPABASE_URL}/functions/v1/chat`;
  }
  return '/api/chat';
}

export function getStylistEndpoint(): string {
  if (isUsingSupabase) {
    return `${SUPABASE_URL}/functions/v1/stylist`;
  }
  return '/api/stylist';
}

export function getLookbooksEndpoint(id?: string): string {
  if (isUsingSupabase) {
    const base = `${SUPABASE_URL}/functions/v1/lookbooks`;
    return id ? `${base}?id=${encodeURIComponent(id)}` : base;
  }
  return id ? `/api/lookbooks/${encodeURIComponent(id)}` : '/api/lookbooks';
}

export function getApiHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders
  };

  if (isUsingSupabase) {
    headers['apikey'] = SUPABASE_ANON_KEY;
    headers['Authorization'] = `Bearer ${SUPABASE_ANON_KEY}`;
  }

  return headers;
}
