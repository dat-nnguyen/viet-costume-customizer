# Hướng Dẫn Triển Khai Backend & AI Lên Supabase

Tài liệu này hướng dẫn chi tiết cách triển khai toàn bộ Backend (Edge Functions) và Cơ sở dữ liệu (PostgreSQL Database) của dự án **Việt Cổ Phục Remix & Cố Vấn AI** lên nền tảng **Supabase Cloud**.

Sau khi triển khai:
- AI Chatbot streaming SSE (`chat`) và AI Stylist (`stylist`) chạy trực tiếp trên Supabase Edge Functions toàn cầu.
- Lookbook và lịch sử chat được lưu trữ trên Supabase PostgreSQL Database.
- Gemini API Key được bảo mật an toàn 100% trong Supabase Secrets, không lộ ở Client.
- Không cần thuê VPS hay duy trì Node.js Express server.

---

## Chuẩn Bị
1. Tài khoản [Supabase](https://supabase.com/) (hoàn toàn miễn phí).
2. Tạo một Project mới trên Supabase Dashboard (ví dụ tên: `viet-costume-customizer`).
3. Khóa Google Gemini API (Lấy miễn phí tại [Google AI Studio](https://aistudio.google.com/app/apikey)).

---

## 6 Bước Triển Khai Nhanh

### Bước 1: Đăng nhập Supabase CLI
Chạy lệnh sau tại thư mục gốc dự án:
```bash
npx supabase login
```
*Trình duyệt sẽ mở ra để bạn xác thực tài khoản Supabase.*

---

### Bước 2: Liên kết với Project Supabase
Lấy **Project Reference ID** từ Supabase Dashboard:
- Xem trên thanh URL trình duyệt: `https://supabase.com/dashboard/project/<project-ref>`
- Hoặc vào **Project Settings** -> **General** -> **Reference ID**

Chạy lệnh liên kết:
```bash
npx supabase link --project-ref <project-ref-cua-ban>
```
*(Nếu được hỏi mật khẩu database, nhập mật khẩu bạn đã tạo khi tạo project trên Supabase).*

---

### Bước 3: Đẩy Database Schema (Tạo bảng dữ liệu & RLS)
Chạy lệnh push migration lên PostgreSQL Supabase:
```bash
npx supabase db push
```
Lệnh này sẽ tự động:
- Tạo bảng `public.lookbooks` (kèm index sắp xếp).
- Tạo bảng `public.chat_messages` (kèm index session và thời gian).
- Cấu hình Row Level Security (RLS) cho phép người dùng ẩn danh đọc và ghi an toàn.

---

### Bước 4: Thiết lập Secret Khóa Gemini AI
Thiết lập khóa Gemini API vào Supabase Secrets (không bao giờ lộ ra ngoài):
```bash
npx supabase secrets set GEMINI_API_KEY="khoa_gemini_api_cua_ban"
```
*(Hoặc vào Supabase Dashboard -> **Project Settings** -> **Edge Functions** -> Thêm Secret mới tên `GEMINI_API_KEY`).*

---

### Bước 5: Deploy các Edge Functions
Chạy lệnh deploy cả 3 Edge Functions lên Supabase:
```bash
npm run supabase:deploy
```
Hoặc deploy từng function riêng lẻ:
```bash
npx supabase functions deploy chat --no-verify-jwt
npx supabase functions deploy stylist --no-verify-jwt
npx supabase functions deploy lookbooks --no-verify-jwt
```

Sau khi deploy thành công, bạn sẽ thấy 3 endpoint xuất hiện trong Supabase Dashboard -> **Edge Functions**:
- `https://<project-ref>.supabase.co/functions/v1/chat`
- `https://<project-ref>.supabase.co/functions/v1/stylist`
- `https://<project-ref>.supabase.co/functions/v1/lookbooks`

---

### Bước 6: Cấu hình Frontend kết nối Supabase
1. Vào Supabase Dashboard -> **Project Settings** -> **API**:
   - Sao chép **Project URL** (dạng `https://<project-ref>.supabase.co`)
   - Sao chép **anon public key**
2. Mở file `.env` trên máy của bạn (hoặc cấu hình Environment Variables trên Vercel / Netlify nếu bạn deploy frontend lên đó):
```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
3. Khởi động lại Frontend:
```bash
npm run dev:frontend
```
Frontend sẽ tự động phát hiện Supabase và chuyển hướng toàn bộ luồng AI và Database sang Supabase Cloud!

---

## Kiểm Tra & Xác Nhận Tính Năng
1. **Cố Vấn Di Sản AI (Chatbot)**:
   - Mở bong bóng chat ở góc phải màn hình.
   - Hỏi: *"Tư vấn cho tôi trang phục chụp kỷ yếu đại học"*.
   - Kiểm tra câu trả lời xuất hiện dạng chữ chạy streaming thời gian thực mượt mà.
   - Kiểm tra bảng `chat_messages` trên Supabase Table Editor đã ghi nhận lịch sử hội thoại.
2. **AI Stylist & Gợi Ý Phối Đồ**:
   - Bấm vào nút **AI Stylist** trên thanh công cụ.
   - Chọn dịp (ví dụ: Đón Tết hoặc Dạo phố cà phê) -> Bấm **Tạo Bản Phối AI**.
   - Nhận bản phối trang phục kèm phụ kiện và triết lý Ngũ Hành.
3. **Lưu & Xem Lookbook**:
   - Bấm nút **Lưu Lookbook** sau khi tạo bản phối.
   - Vào Supabase Table Editor -> bảng `lookbooks` để xem dữ liệu đã đồng bộ lên cloud.
