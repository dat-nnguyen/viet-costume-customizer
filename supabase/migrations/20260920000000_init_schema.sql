-- Migration: Initialize Schema for Viet Costume Customizer
-- Description: Creates lookbooks and chat_messages tables with Row Level Security (RLS)

-- 1. Bảng Lookbooks: Lưu các bản phối cổ phục do người dùng thiết kế
CREATE TABLE IF NOT EXISTS public.lookbooks (
    id VARCHAR(64) PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TEXT NOT NULL,
    outfit_data JSONB NOT NULL,
    score_data JSONB NOT NULL,
    ai_note TEXT,
    thumbnail_url TEXT,
    inserted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index sắp xếp lookbooks theo thời gian tạo mới nhất
CREATE INDEX IF NOT EXISTS idx_lookbooks_inserted_at ON public.lookbooks(inserted_at DESC);

-- 2. Bảng Chat Messages: Lưu lịch sử hội thoại với Cố Vấn Di Sản AI
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL,
    sender VARCHAR(16) NOT NULL CHECK (sender IN ('user', 'assistant')),
    text TEXT NOT NULL,
    action_payload JSONB,
    created_at BIGINT NOT NULL,
    inserted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index tìm kiếm tin nhắn theo session_id và sắp xếp theo created_at
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON public.chat_messages(created_at ASC);

-- 3. Cấu hình Row Level Security (RLS)
ALTER TABLE public.lookbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Xóa policies cũ nếu đã tồn tại để tránh conflict
DROP POLICY IF EXISTS "Public select lookbooks" ON public.lookbooks;
DROP POLICY IF EXISTS "Public insert lookbooks" ON public.lookbooks;
DROP POLICY IF EXISTS "Public delete lookbooks" ON public.lookbooks;
DROP POLICY IF EXISTS "Public select chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Public insert chat_messages" ON public.chat_messages;

-- Policy cho phép mọi người dùng (anon) đọc, thêm và xóa Lookbook
CREATE POLICY "Public select lookbooks"
    ON public.lookbooks
    FOR SELECT
    USING (true);

CREATE POLICY "Public insert lookbooks"
    ON public.lookbooks
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public delete lookbooks"
    ON public.lookbooks
    FOR DELETE
    USING (true);

-- Policy cho phép đọc và ghi tin nhắn chat theo session
CREATE POLICY "Public select chat_messages"
    ON public.chat_messages
    FOR SELECT
    USING (true);

CREATE POLICY "Public insert chat_messages"
    ON public.chat_messages
    FOR INSERT
    WITH CHECK (true);
