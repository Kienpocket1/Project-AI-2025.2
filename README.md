# 🚇 Madrid Metro Routing - Hệ thống Chỉ đường Tàu điện ngầm

Dự án tìm đường đi tối ưu trong hệ thống tàu điện ngầm thành phố Madrid, Tây Ban Nha. Đây là sản phẩm đồ án **Project I** thuộc học phần của Đại học Bách Khoa Hà Nội (HUST).

## 🌟 Giới thiệu chung
Hệ thống sử dụng lõi thuật toán tìm kiếm **A* (A-Star)** để tính toán lộ trình giữa các nhà ga dựa trên dữ liệu tọa độ địa lý thực tế. Điểm đột phá của dự án là khả năng **Định tuyến phụ thuộc thời gian (Time-Dependent Routing)**, cho phép thuật toán tự động tính toán lại trọng số đường đi và gợi ý lộ trình thông minh hơn dựa trên các thiết lập Giờ cao điểm từ Ban quản lý.

## ✨ Tính năng nổi bật

### 1. Dành cho Người dùng (User)
- **Tìm kiếm đa mục tiêu (Multi-objective):** Tùy chọn tìm đường nhanh nhất hoặc ưu tiên ít phải đi bộ chuyển tuyến nhất.
- **Bản đồ tương tác trực quan:** Tích hợp Leaflet hiển thị toàn bộ mạng lưới Metro Madrid, vẽ đường đi trực tiếp trên bản đồ.
- **Chỉ dẫn chi tiết:** Hiển thị thời gian dự kiến, các trạm đi qua, và cảnh báo thời gian đi bộ đổi tuyến.
- **Auto-complete:** Gợi ý tên ga thông minh ngay khi nhập liệu.

### 2. Dành cho Ban quản lý (Admin)
- **Hệ thống Phân quyền (Role-based Auth):** Đăng nhập an toàn với JWT Token và mật khẩu mã hóa (bcrypt), ngăn chặn truy cập trái phép vào trang quản trị.
- **Thiết lập Lịch trình động (Dynamic Routing):** Admin có thể thêm/xóa các khung giờ cao điểm, điều chỉnh **Hệ số lưu lượng** (thời gian tàu chạy chậm lại do đông khách) và **Phạt đổi tuyến** (thời gian chờ ở ga lâu hơn). Lõi C++ sẽ lập tức cập nhật để bẻ hướng tìm lộ trình tối ưu mới.

## 🛠 Công nghệ sử dụng
- **Frontend:** React.js, Vite, Tailwind CSS, React-Router-DOM, React-Leaflet.
- **Backend:** Node.js (Express), JWT (JSON Web Token).
- **Cơ sở dữ liệu:** **MySQL** (Lưu trữ User, Phân quyền, Giờ cao điểm) đồng bộ thời gian thực với **SQLite3** (Phục vụ lõi C++ đọc dữ liệu siêu tốc).
- **Thuật toán cốt lõi:** C++ (A-Star, Haversine Formula).

## 📂 Cấu trúc thư mục (Lược dịch)
```text
.
├── backend/                # Lõi xử lý và API Server
│   ├── main.cpp            # Thuật toán A* (C++)
│   ├── server.js           # Express API Server (Xử lý Auth & Đồng bộ DB)
│   ├── metro_madrid.db     # CSDL SQLite (Dành cho C++)
│   └── metro.exe           # File thực thi C++
├── frontend/               # Giao diện ứng dụng
│   ├── src/
│   │   ├── components/ 
│   │   │   ├── Admin/      # Giao diện Dashboard cho Quản trị viên
│   │   │   ├── AuthPage.jsx# Màn hình Đăng nhập/Đăng ký phân quyền
│   │   │   ├── MapView.jsx # Xử lý Bản đồ Leaflet
│   │   │   └── ...
│   └── index.html
└── README.md

```

## 🚀 Hướng dẫn cài đặt và khởi chạy

### 1. Yêu cầu hệ thống

* **Node.js** (v16 trở lên).
* Trình biên dịch C++ (**MinGW/GCC**).
* **MySQL Server** (XAMPP hoặc MySQL Workbench).

### 2. Thiết lập Database (MySQL)

1. Mở MySQL, tạo database tên `metro_madrid`.
2. Tạo bảng `Users` (id, username, password, role) và bảng `KhungGioCaoDiem` (id, gio_bat_dau, gio_ket_thuc, he_so_luu_luong, thoi_gian_cho_tau).
3. (Tùy chọn) Thêm sẵn một tài khoản có `role = 'admin'` để truy cập trang quản trị.

### 3. Thiết lập Backend

1. Di chuyển vào thư mục backend: `cd backend`
2. Cài đặt các thư viện cần thiết:
```bash
npm install express sqlite3 cors mysql bcrypt jsonwebtoken

```


3. Khởi chạy Server:
```bash
node server.js

```



### 4. Thiết lập Frontend

1. Mở một Terminal mới, di chuyển vào frontend: `cd frontend`
2. Cài đặt các gói phụ thuộc:
```bash
npm install lucide-react react-router-dom clsx tailwind-merge

```


3. Khởi chạy ứng dụng Web:
```bash
npm run dev

```


*Truy cập ứng dụng tại: `http://localhost:5173*`

## 📝 Kiểm thử và Đánh giá (Benchmark)

* **Tốc độ xử lý:** Thuật toán C++ phản hồi trong khoảng ~0.5ms đến 8ms, đảm bảo trải nghiệm Real-time.
* **Bảo mật:** Giao thức JWT chặn 100% các truy cập trái phép vào route `/admin`.
* **Tính linh hoạt:** Hệ thống chuyển hướng lộ trình hoàn hảo khi Admin thiết lập trọng số phạt giờ cao điểm.

## 🔮 Định hướng phát triển (Future Work)

* **Quản lý sự cố trực tiếp:** Tích hợp tính năng cho phép Admin tạm thời "đóng cửa" một nhà ga (ví dụ: đang bảo trì, sửa chữa). Hệ thống C++ sẽ tạm ngắt các cạnh đồ thị liên kết với ga đó để tự động tìm đường vòng an toàn cho người dân.
* **Gợi ý quy hoạch đô thị:** Áp dụng Machine Learning để phân tích dữ liệu các điểm mù giao thông, từ đó đề xuất vị trí nên xây dựng tuyến đường/nhà ga mới giúp giảm tải áp lực cho mạng lưới hiện tại.



