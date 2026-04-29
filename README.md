# 🚇 Madrid Metro Routing

Dự án tìm đường đi tối ưu trong hệ thống tàu điện ngầm Madrid, Tây Ban Nha. Đây là sản phẩm thuộc học phần **Nhập môn Trí tuệ nhân tạo** tại Đại học Bách Khoa Hà Nội (HUST).

!

## 🌟 Giới thiệu chung
Hệ thống sử dụng thuật toán tìm kiếm **A* (A-Star)** để tính toán lộ trình giữa hai nhà ga bất kỳ dựa trên dữ liệu tọa độ địa lý thực tế. Người dùng có thể tùy chọn giữa các tiêu chí tối ưu khác nhau như thời gian nhanh nhất hoặc số lần chuyển tuyến ít nhất.

## ✨ Tính năng nổi bật
- **Tìm kiếm thông minh:** Hỗ trợ gợi ý tên ga ngay khi nhập liệu (Auto-complete).
- **Bản đồ tương tác:** Tích hợp Leaflet hiển thị toàn bộ mạng lưới ga và đường đi trực quan.
- **Đa mục tiêu (Multi-objective):** - *Chế độ 1:* Tìm đường nhanh nhất.
  - *Chế độ 2:* Ưu tiên ít chuyển tuyến (ít phải đi bộ đổi tàu).
- **Chỉ dẫn chi tiết:** Hiển thị thời gian dự kiến đến từng ga và cảnh báo các đoạn đi bộ chuyển tuyến kèm thời gian cụ thể.
- **Hiệu năng cao:** Lõi xử lý bằng C++ kết hợp CSDL SQLite3 giúp tìm kiếm kết quả trong thời gian thực (< 10ms).

## 🛠 Công nghệ sử dụng
- **Frontend:** React.js, Vite, Tailwind CSS, React-Leaflet (GIS).
- **Backend:** Node.js (Express), SQLite3.
- **Algorithm:** C++ (A-Star, Haversine Formula).
- **Data Source:** Dữ liệu GTFS Metro Madrid.

## 📂 Cấu trúc thư mục
```text
.
├── backend/                # Lõi xử lý và API
│   ├── main.cpp            # Thuật toán A* (C++)
│   ├── Graph.h             # Cấu trúc dữ liệu đồ thị
│   ├── server.js           # Express API Server
│   ├── metro_madrid.db     # Cơ sở dữ liệu SQLite
│   └── metro.exe           # File thực thi sau khi biên dịch
├── frontend/               # Giao diện người dùng (React)
│   ├── src/
│   │   ├── components/     # MapView, Sidebar, RouteList...
│   │   └── services/       # API call logic
│   └── index.html
└── README.md
```

## 🚀 Hướng dẫn cài đặt và khởi chạy

### 1. Yêu cầu hệ thống
- Đã cài đặt **Node.js** (v16 trở lên).
- Đã cài đặt trình biên dịch C++ (ví dụ **MinGW/GCC**).
- Thư viện **SQLite3** (thường đã đi kèm trong code backend).

### 2. Thiết lập Backend
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Biên dịch lõi C++ (Lưu ý: cần file `sqlite3.c` trong thư mục):
   ```bash
   g++ main.cpp sqlite3.c -o metro.exe -fpermissive
   ```
3. Cài đặt thư viện Node.js:
   ```bash
   npm install express sqlite3 cors
   ```
4. Khởi chạy Server:
   ```bash
   node server.js
   ```
   *Server sẽ chạy tại: `http://localhost:3000`*

### 3. Thiết lập Frontend
1. Mở một Terminal mới và di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt dependencies:
   ```bash
   npm install
   ```
3. Khởi chạy ứng dụng Web:
   ```bash
   npm run dev
   ```
   *Truy cập ứng dụng tại: `http://localhost:5173`*

## 📝 Kiểm thử và Đánh giá (Benchmark)
Hệ thống đã qua kiểm thử với nhiều kịch bản khác nhau:
- **Tốc độ xử lý:** ~0.5ms đến 8ms tùy độ dài quãng đường.
- **Độ chính xác:** Khớp hoàn toàn với sơ đồ tuyến thực tế của Metro Madrid.
- **Xử lý ngoại lệ:** Chống sập khi dữ liệu tọa độ bị thiếu hoặc lỗi kết nối Server.

***
