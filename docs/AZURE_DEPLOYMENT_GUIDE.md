# Hướng Dẫn Triển Khai Lên Microsoft Azure ($100 Credit)

Tài liệu này hướng dẫn bạn tận dụng **$100 credit trên Microsoft Azure** để triển khai dự án **Viet Costume Customizer** chuẩn Production với độ sẵn sàng cao, bảo mật tuyệt đối và chi phí tối ưu.

---

## 1. Kiến Trúc Triển Khai Trên Azure

```mermaid
graph LR
    User[Người Dùng] -->|HTTPS| ACA[Azure Container Apps (Frontend + Backend)]
    ACA -->|Bảo mật GEMINI_API_KEY| Gemini[Google Gemini 3.7 Flash API]
    ACA -->|DATABASE_URL| Postgres[(Azure Database for PostgreSQL Flexible Server)]
```

- **Backend & Frontend**: Đóng gói trong 1 Docker image duy nhất chạy trên **Azure Container Apps (ACA)**.
- **Database**: Sử dụng **Azure Database for PostgreSQL (Flexible Server)** gói Burstable `B1ms` (~$12/tháng).
- **Chi phí dự tính**: ~$12 – $15/tháng. Với $100 credit, bạn có thể chạy liên tục **6 đến 8 tháng**!

---

## 2. Bước 1: Tạo Database PostgreSQL Trên Azure Portal

1. Đăng nhập vào [Azure Portal](https://portal.azure.com/).
2. Trên thanh tìm kiếm, gõ **Azure Database for PostgreSQL flexible servers** và chọn **Create**.
3. Điền các thông số cơ bản:
   - **Subscription**: Chọn gói có $100 credit của bạn.
   - **Resource Group**: Tạo mới, ví dụ: `rg-viet-costume`.
   - **Server name**: Đặt tên duy nhất, ví dụ: `psql-viet-costume`.
   - **Region**: Chọn `Southeast Asia` (Singapore) để có độ trễ thấp nhất về Việt Nam.
   - **Workload type**: Chọn `Development` (hoặc `Burstable B1ms` - 1 vCPU, 2 GiB RAM, 32 GiB Storage) để tiết kiệm chi phí tối đa.
   - **Authentication**: Nhập `Admin username` (ví dụ: `adminuser`) và `Password`.
4. Trong tab **Networking**:
   - Tích chọn: **Allow public access from any Azure service within Azure to this server** (cho phép Azure Container Apps truy cập).
   - Bấm **Add current client IP address** để máy tính của bạn có thể test kết nối từ xa.
5. Bấm **Review + create** -> **Create**.
6. Sau khi tạo xong, vào server vừa tạo, chọn **Databases** -> Tạo database mới tên là `viet_costume`.
7. Chuỗi kết nối của bạn sẽ có dạng:
   ```text
   postgres://adminuser:MatKhauCuaBan@psql-viet-costume.postgres.database.azure.com:5432/viet_costume?sslmode=require
   ```

---

## 3. Bước 2: Triển Khai Ứng Dụng Bằng Azure Container Apps (ACA)

Azure Container Apps cho phép bạn deploy trực tiếp mã nguồn từ GitHub hoặc từ Docker Image:

### Cách A: Deploy Trực Tiếp Từ GitHub (Khuyên dùng - Nhanh nhất)
1. Trên Azure Portal, tìm kiếm **Container Apps** -> Bấm **Create**.
2. Thiết lập:
   - **Resource Group**: Chọn `rg-viet-costume`.
   - **Container App name**: `app-viet-costume`.
   - **Region**: `Southeast Asia`.
3. Trong tab **App settings**:
   - Chọn **Use a quickstart image** tạm thời để tạo nhanh.
   - **Ingress**: Bật **Enabled**, Target Port: `3001`, Ingress traffic: **Accepting traffic from anywhere**.
4. Bấm **Review + create** -> **Create**.
5. Sau khi tạo xong, vào Container App vừa tạo -> Chọn **Continuous deployment** (ở menu bên trái):
   - Đăng nhập tài khoản GitHub của bạn.
   - Chọn Repository: `dat-nnguyen/viet-costume-customizer`, Branch: `main`.
   - Dockerfile path: `./Dockerfile`.
   - Azure sẽ tự động tạo GitHub Actions workflow để mỗi khi bạn `git push origin main`, Azure sẽ tự build và deploy phiên bản mới nhất!

### Cách B: Cấu Hình Biến Môi Trường (Environment Variables) Trên Azure
Vào Container App của bạn -> Chọn mục **Containers** -> **Edit and deploy** -> **Environment variables**:
1. `GEMINI_API_KEY`: Dán khóa API Gemini của bạn.
2. `DATABASE_URL`: Dán chuỗi kết nối PostgreSQL ở Bước 1:
   ```text
   postgres://adminuser:MatKhauCuaBan@psql-viet-costume.postgres.database.azure.com:5432/viet_costume?sslmode=require
   ```
3. `PORT`: `3001`
4. `NODE_ENV`: `production`

Bấm **Save** -> **Deploy**.

---

## 4. Kiểm Tra Sau Khi Triển Khai
- Azure Container Apps sẽ cấp cho bạn một đường dẫn URL HTTPS miễn phí, ví dụ:
  `https://app-viet-costume.ashyground-xxxx.southeastasia.azurecontainerapps.io`
- Mở URL và kiểm tra:
  - Thử lưu một Lookbook mới -> Dữ liệu được lưu thẳng vào PostgreSQL trên Azure.
  - Thử mở Chatbot Cố Vấn AI -> API key được bảo mật ở server Azure, stream câu trả lời về cực nhanh.
  - Kiểm tra trạng thái hệ thống tại: `https://<domain-cua-ban>/api/health` -> Trả về:
    `{"status":"ok","database":"PostgreSQL (Azure / Cloud)","geminiConfigured":true}`.

---

## 5. Mẹo Tiết Kiệm Credit Azure Tối Đa
- **Bật Scale-to-Zero trên ACA**: Trong mục **Scale and replicas**, đặt **Min replicas = 0** và **Max replicas = 1**. Khi không có ai truy cập web, container sẽ tự động ngủ và Azure **tính phí 0đ**. Khi có người dùng truy cập, web sẽ tự thức dậy trong 2 giây!
- **Tắt Server PostgreSQL khi không dùng dài ngày**: Nếu có tuần bạn không cần demo hay phát triển, bạn có thể bấm **Stop server** trên Azure Portal để tạm dừng tính tiền Compute.
