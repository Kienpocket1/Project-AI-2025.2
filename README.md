# 🤖 Project-AI-2025.2: Nhập môn Trí tuệ Nhân tạo

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.0%2B-orange?logo=tensorflow&logoColor=white)](https://tensorflow.org/)
[![Google Colab](https://img.shields.io/badge/Google_Colab-F9AB00?logo=googlecolab&logoColor=white)](https://colab.research.google.com/)
[![HUST](https://img.shields.io/badge/HUST-IT1-red)](#)

> Đồ án môn học Nhập môn Trí tuệ Nhân tạo - Ngành Khoa học Máy tính (IT1), Đại học Bách Khoa Hà Nội. 
> Repo này lưu trữ mã nguồn và tài liệu báo cáo cho các bài toán học máy và tối ưu hóa tổ hợp.

---

## 📑 Mục lục
1. [Phần 1: Bài toán Phân loại (Classification)](#phan-1-bai-toan-phan-loai)
2. [Phần 2: Tối ưu hóa Phân bổ Hội đồng (CSP)](#phan-2-toi-uu-hoa-phan-bo-hoi-dong)
3. [Thành viên nhóm](#thanh-vien-nhom)

---

## 🧠 Phần 1: Bài toán Phân loại (Classification) <a name="phan-1-bai-toan-phan-loai"></a>

### 1. Phương pháp CNN (Convolutional Neural Network)
* **Hàm mất mát (Loss Function):** Categorical Cross-Entropy.
* **Bộ tối ưu (Optimizer):** Adam.
* **Đánh giá mô hình:** * Đo lường `Accuracy` trên tập test.
    * Vẽ `Confusion Matrix` để phân tích và đánh giá lỗi dự đoán chi tiết.
* **Công cụ sử dụng:** Python, TensorFlow/Keras, Google Colab.

### 2. Phương pháp KNN (K-Nearest Neighbors)
* **Xây dựng mô hình KNN:**
    * Tính toán khoảng cách giữa các điểm dữ liệu dựa trên **khoảng cách Euclid**.
    * Chọn giá trị $K$ tối ưu bằng cách lập hàm đánh giá độ chính xác của thuật toán qua các giá trị $K$ khác nhau.
    * Đưa ra nhãn dự đoán và so sánh trực tiếp với nhãn thật (Ground truth).
* **Đánh giá mô hình:** * Đo lường `Accuracy` trên tập test.
    * Vẽ `Confusion Matrix` để phân tích lỗi.
    * Vẽ biểu đồ tương quan giữa độ chính xác và giá trị $K$.
* **Công cụ sử dụng:** Python, Scikit-learn.

---

## 🎯 Phần 2: Tối ưu hóa Phân bổ Hội đồng <a name="phan-2-toi-uu-hoa-phan-bo-hoi-dong"></a>

### 1. Bài toán
* **Tên bài toán:** Tối ưu hóa Phân bổ Hội đồng Bảo vệ Đồ án dựa trên Thỏa mãn Ràng buộc và Độ tương đồng *(Optimizing Thesis Council Assignment via Constraint Satisfaction and Similarity)*.
* **Mục tiêu cốt lõi:** Xây dựng một hệ thống phân bổ $N$ đồ án tốt nghiệp và $M$ giáo viên vào $K$ hội đồng sao cho:
    1.  Tìm được nghiệm thỏa mãn toàn bộ 5 ràng buộc cứng của hệ thống (quy mô hội đồng, quy tắc hướng dẫn, ngưỡng tương đồng tối thiểu).
    2.  Đồng thời tối đa hóa hàm mục tiêu là **tổng độ tương đồng** (giữa các đồ án với nhau và giữa đồ án với giáo viên trong cùng một hội đồng).
* **Ý nghĩa:** Khẳng định tính hiệu quả của Trí tuệ Nhân tạo trong việc giải quyết bài toán tối ưu tổ hợp (Combinatorial Optimization) thuộc lớp bài toán siêu khó **NP-Hard**.

### 2. Phương pháp
* **Dữ liệu (Data):** * Sử dụng dữ liệu mô phỏng (Mock Test) do đặc thù bảo mật thông tin.
    * Xây dựng một module **Data Generator** bằng Python để tự động sinh ngẫu nhiên các file Input phục vụ quá trình test thuật toán với nhiều quy mô dữ liệu khác nhau (Small, Medium, Large).
* *(Các phần Tiền xử lý và Mô hình thuật toán sẽ được cập nhật thêm trong quá trình triển khai...)*

---

## 🖼️ Đề tài 3: Phân loại Chữ số Viết tay (Classification)

### 1. Bài toán
* **Tên bài toán:** So sánh khả năng nhận diện chữ số viết tay (0–9) từ ảnh bằng thuật toán K-Nearest Neighbors (KNN) và Mạng nơ-ron tích chập (CNN).
* **Mục tiêu:** Xây dựng mô hình AI có khả năng phân loại chính xác một ảnh chứa chữ số viết tay (chỉ 1 chữ số) vào một trong 10 lớp (0–9) theo 2 phương pháp. Từ đó, tiến hành so sánh, đánh giá các đặc điểm và hiệu năng của 2 mô hình với nhau.

---

### 2. Phương pháp thực hiện
* **Dữ liệu (Data):** Sử dụng bộ dữ liệu kinh điển **MNIST** bao gồm 60,000 ảnh cho tập huấn luyện (train) và 10,000 ảnh cho tập kiểm thử (test). Định dạng ảnh là 28x28 pixel, ảnh xám (grayscale).
* **Tiền xử lý (Preprocessing):** Chuẩn hóa (Normalize) dữ liệu hình ảnh để phù hợp với định dạng đầu vào (input shape) của từng thuật toán (ví dụ: duỗi phẳng mảng 2D thành vector 1D cho KNN, hoặc giữ nguyên định dạng thêm kênh màu cho CNN).

---

#### 🧠 Mô hình 1: Mạng nơ-ron tích chập (CNN)
* **Kiến trúc mạng:** Xây dựng mô hình CNN cơ bản bao gồm:
  * 2 lớp Tích chập (Convolution) + Lớp gộp (MaxPooling) để trích xuất đặc trưng hình ảnh.
  * 1 lớp Kết nối đầy đủ (Fully Connected / Dense Layer).
  * Lớp Softmax ở đầu ra tương ứng với 10 nơ-ron (10 lớp chữ số).
  
* **Cấu hình huấn luyện:** * Hàm mất mát (Loss Function): `Categorical Cross-Entropy`.
  * Bộ tối ưu (Optimizer): `Adam`.
* **Đánh giá mô hình:** Đo lường chỉ số `Accuracy` trên tập test. Trực quan hóa bằng cách vẽ Ma trận nhầm lẫn (`Confusion Matrix`) để phân tích chi tiết các lỗi nhận diện sai.
* **Công cụ:** Python, TensorFlow/Keras, Google Colab.

---

#### 📏 Mô hình 2: K-Nearest Neighbors (KNN)
* **Thuật toán:** * Tính toán khoảng cách giữa các điểm dữ liệu dựa trên **khoảng cách Euclid**.
  * Tối ưu hóa siêu tham số bằng cách chọn giá trị $K$ tốt nhất thông qua việc lập hàm đánh giá độ chính xác của thuật toán dựa trên các giá trị $K$ khác nhau.
  * Đưa ra nhãn dự đoán theo kết quả bình chọn đa số và so sánh với nhãn thật.
  
* **Đánh giá mô hình:** * Đo lường chỉ số `Accuracy` trên tập test. 
  * Vẽ `Confusion Matrix` để phân tích lỗi. 
  * Vẽ biểu đồ đường thể hiện sự biến thiên của độ chính xác dựa trên sự thay đổi của giá trị $K$.
* **Công cụ:** Python (thư viện Scikit-learn).