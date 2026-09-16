# Executive Portfolio & AI Candidate Matcher Platform
### Huỳnh Thiên An (Chief Information Officer | Technology, Digital Transformation & AI Executive)

Hệ thống Landing Page cá nhân đẳng cấp C-Level kết hợp nền tảng AI phân tích độ tương thích ứng viên với Job Description (JD), đặt lịch hẹn trao đổi, yêu cầu hồ sơ và Dashboard quản trị bảo mật dành riêng cho anh **Huỳnh Thiên An**.

---

## 🌟 Các Tính Năng Nổi Bật

1. **Executive Landing Page (Trang Chủ)**:
   - Giao diện thiết kế theo phong cách Executive Navy & Cyan cao cấp, chuẩn hóa cho lãnh đạo cấp C-Level.
   - Trưng bày ảnh chân dung chính thức, tiểu sử chuyên nghiệp, triết lý lãnh đạo và toàn bộ sự nghiệp 20+ năm (MAP Life, XCL Education, VAS, GIC, CIH, Great Eastern).
   - Học vấn (MBA UBIS Thụy Sĩ - Cum Laude Top 5, Cử nhân University of London), hệ thống chứng chỉ quốc tế và bản đồ công nghệ (Tech Stack).
   - Chuyển đổi song ngữ linh hoạt: **Tiếng Việt & Tiếng Anh**.

2. **AI Job Description Matching (Phân Tích So Sánh JD)**:
   - Nhà tuyển dụng (Headhunter / BOD) nhập họ tên, email, công ty, vị trí cần tuyển và tải file JD (`.pdf`, `.docx`, `.doc`, `.txt`) hoặc dán nội dung trực tiếp.
   - Hệ thống kết nối mô hình Google Cloud Platform / Gemini AI phân tích đa chiều:
     - **Điểm tương thích tổng thể (Overall Match Score %)**.
     - **Đánh giá 4 trụ cột**: Chiến lược C-Level, Kiến trúc AI & Công nghệ, Kinh nghiệm Ngành & Vận hành, An ninh mạng & Tuân thủ PDPL.
     - **Điểm mạnh vượt trội (Key Synergies)** của anh An đối với vị trí.
     - **Điểm cần trao đổi thêm (Points for Discussion)**.
     - **Gợi ý 3-4 câu hỏi phỏng vấn chiến lược** dành cho Ban Giám Đốc sử dụng khi gặp ứng viên.
   - Tự động lưu toàn bộ log phân tích vào cơ sở dữ liệu.

3. **Đặt Lịch Hẹn Cấp Cao (Appointment Booking)**:
   - Đặt lịch phỏng vấn hoặc tư vấn chiến lược với lựa chọn hình thức: Trực tuyến (Google Meet/Teams) hoặc Gặp mặt trực tiếp tại TP. Hồ Chí Minh.
   - Ghi nhận vào hệ thống và kích hoạt thông báo tự động.

4. **Yêu Cầu & Tải Hồ Sơ CV PDF (Executive CV)**:
   - Tải file hồ sơ trực tiếp hoặc gửi thông tin nhận bản cập nhật mới nhất qua email.

5. **Email Notification Tức Thì**:
   - Gửi email thông báo tự động về **`an.huynht@gmail.com`** ngay khi có đối tác đặt lịch hoặc thực hiện phân tích JD.
   - Email định dạng HTML chỉn chu, hiển thị đầy đủ thông tin nhà tuyển dụng, điểm match và tóm tắt đánh giá.

6. **Cổng Quản Trị Độc Quyền (Admin Dashboard - `/admin`)**:
   - Đăng nhập bảo mật với tài khoản của anh An:
     - **Email:** `an.huynht@gmail.com`
     - **Mật khẩu khởi tạo:** `Admin@2026`
   - Quản lý và tra cứu toàn bộ Log so sánh JD của nhà tuyển dụng (đọc lại file JD đã upload, xem báo cáo AI, gửi email phản hồi trực tiếp).
   - Quản lý danh sách lịch hẹn và cập nhật trạng thái (Chờ duyệt, Đã xác nhận, Hoàn tất).
   - Quản lý danh sách yêu cầu tải CV.
   - Cấu hình API Google Cloud / Gemini AI, đổi Model và tùy biến System Prompt.
   - Cấu hình thông số gửi email SMTP (Host, Port, User, App Password) và nút gửi email thử nghiệm.

---

## 🚀 Hướng Dẫn Chạy Tại Local

### 1. Cài đặt và khởi chạy:
```bash
# Khởi chạy chế độ phát triển
npm run dev

# Hoặc Build bản tối ưu và chạy Production
npm run build
npm start
```
Mở trình duyệt truy cập: `http://localhost:3000` (hoặc cổng hiển thị trên terminal).
Trang quản trị: `http://localhost:3000/admin`

---

## ☁️ Hướng Dẫn Promote / Deploy Lên Vercel

Hệ thống được phát triển chuẩn kiến trúc Next.js 14 và tương thích 100% với nền tảng Vercel:

### Bước 1: Đẩy mã nguồn lên GitHub / GitLab
```bash
git init
git add .
git commit -m "Deploy Huynh Thien An Executive Portfolio"
git branch -M main
git remote add origin <URL_REPO_CUA_ANH>
git push -u origin main
```

### Bước 2: Import dự án vào Vercel
1. Đăng nhập vào [Vercel](https://vercel.com).
2. Chọn **Add New...** -> **Project** và chọn Repository vừa đẩy lên.
3. Vercel sẽ tự động nhận diện framework là **Next.js**.

### Bước 3: Cấu hình Cơ sở dữ liệu PostgreSQL trên Vercel
1. Trên Vercel Dashboard của dự án, vào tab **Storage**.
2. Bấm **Create Database** -> Chọn **Postgres** (hoặc kết nối với Neon / Supabase).
3. Sau khi tạo xong, Vercel sẽ tự động gán biến môi trường `DATABASE_URL` / `POSTGRES_URL` vào dự án. Hệ thống sẽ tự động khởi tạo các bảng `jd_match_logs`, `appointments`, `resume_requests`, `system_settings`, `admin_users` ngay lần chạy đầu tiên.

### Bước 4: Cài đặt Biến Môi Trường (Environment Variables) trên Vercel:
Trong phần **Settings** -> **Environment Variables**, cấu hình các biến sau:
- `DATABASE_URL`: Đường dẫn kết nối PostgreSQL (tự động có nếu tạo Vercel Postgres).
- `GEMINI_API_KEY`: API Key lấy từ [Google AI Studio](https://aistudio.google.com/) hoặc Google Cloud Console.
- `JWT_SECRET`: Chuỗi bí mật bất kỳ để mã hóa phiên đăng nhập Admin (VD: `executive-an-secret-key-2026`).
- `SMTP_HOST`: `smtp.gmail.com` (hoặc server email công ty).
- `SMTP_PORT`: `465`
- `SMTP_USER`: Email gửi thông báo (VD: `an.huynht@gmail.com`).
- `SMTP_PASS`: Mật khẩu ứng dụng 16 ký tự của Gmail (Google Account -> Security -> 2-Step Verification -> App passwords).

Bấm **Deploy**, hệ thống sẽ hoạt động trên tên miền Vercel (hoặc tên miền riêng của anh An)!
