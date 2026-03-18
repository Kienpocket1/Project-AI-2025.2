# Project-AI-2025.2: Nhập môn Trí tuệ Nhân tạo

---

## Phần 1: Tối ưu hóa Phân bổ Hội đồng Bảo vệ Đồ án 

### 1. Bài toán
* **Tên bài toán:** Tối ưu hóa Phân bổ Hội đồng Bảo vệ Đồ án dựa trên Thỏa mãn Ràng buộc và Độ tương đồng (Optimizing Thesis Council Assignment via Constraint Satisfaction and Similarity).
* **Mục tiêu:** Xây dựng một hệ thống phân bổ `N` đồ án tốt nghiệp và `M` giáo viên vào `K` hội đồng sao cho:
  * Tìm được nghiệm thỏa mãn toàn bộ 5 ràng buộc cứng của hệ thống (quy mô hội đồng, quy tắc hướng dẫn, ngưỡng tương đồng tối thiểu).
  * Đồng thời tối đa hóa hàm mục tiêu là **tổng độ tương đồng** (giữa các đồ án với nhau và giữa đồ án với giáo viên trong cùng một hội đồng).
* **Ý nghĩa:** Khẳng định tính hiệu quả của Trí tuệ Nhân tạo trong việc giải quyết bài toán tối ưu tổ hợp (Combinatorial Optimization) thuộc lớp NP-Hard.

### 2. Phương pháp
* **Dữ liệu (Data):**
  * Do tính bảo mật và khó khăn trong việc thu thập ma trận tương đồng thực tế quy mô lớn (N <= 1000, M <= 200), hệ thống sẽ sử dụng **Dữ liệu mô phỏng (Mock Data)**.
  * Xây dựng module `Data Generator` bằng Python để tự động sinh ngẫu nhiên các file Input chuẩn định dạng với các mức độ phức tạp khác nhau (Test nhỏ N=50, Test vừa N=200, Test lớn N=1000).
* **Tiền xử lý (Preprocessing):**
  * Đọc và parse dữ liệu từ file văn bản đầu vào.
  * Chuyển đổi ma trận tương đồng `s` và `g` thành Numpy Arrays để tối ưu tốc độ truy xuất.
  * Biểu diễn nghiệm dưới dạng ma trận nhị phân (Binary Matrix) `X_ik ∈ {0, 1}` (đồ án i thuộc hội đồng k) và `Y_jk ∈ {0, 1}` (giáo viên j thuộc hội đồng k) để dễ lập phương trình toán học.

* **Mô hình & Thuật toán (Model & Algorithms):**
  Phương pháp giải quyết được chia thành 2 hướng tiếp cận để so sánh chéo:
  
  **A. Phương pháp 1: Lập trình Nguyên (Integer Linear Programming - ILP)**
  * Cài đặt bằng thư viện **Google OR-Tools** (CP-SAT Solver).
  * Mô hình hóa các giới hạn [a, b], [c, d], điều kiện t(i) và các ngưỡng e, f thành hệ bất phương trình.
  * *Vai trò:* Làm Baseline, đảm bảo tìm ra nghiệm tối ưu toàn cục (Global Optimum) chính xác 100% cho các test case nhỏ và vừa.

  **B. Phương pháp 2: Thuật toán Meta-heuristic (Genetic Algorithm - GA / Simulated Annealing)**
  * *Mã hóa cá thể (Chromosome):* Sự kết hợp của 2 mảng x và y.
  * *Hàm thích nghi (Fitness Function):* Tổng độ tương đồng trừ đi hàm phạt (Penalty Function) có trọng số lớn khi vi phạm ràng buộc cứng (thiếu người, trùng lặp giáo viên hướng dẫn...).
  * *Vai trò:* Tìm kiếm nghiệm xấp xỉ tối ưu (Local Optimum) trong thời gian ngắn cho các test case cực lớn (vì OR-Tools có thể bị TLE với N=1000).

* **Đánh giá & So sánh (Evaluation):**
  * Chạy thực nghiệm cả hai thuật toán trên cùng các bộ test.
  * So sánh 3 chỉ số: Thời gian thực thi (Execution Time), Giá trị hàm mục tiêu đạt được (Objective Value), và Tỷ lệ vi phạm ràng buộc (Constraint Violation Rate).

---

## Phần 2: Nhận diện Chữ số Viết tay (CNN vs KNN)

### 1. Bài toán
* **Tên bài toán:** So sánh khả năng nhận diện chữ số viết tay (0–9) từ ảnh bằng thuật toán K-Nearest Neighbors (KNN) và mạng nơ-ron tích chập (CNN).
* **Mục tiêu:** Xây dựng mô hình AI phân loại chính xác ảnh chứa chữ số viết tay (1 chữ số) vào 1 trong 10 lớp (0–9) theo 2 phương pháp. So sánh và đánh giá đặc điểm, hiệu năng của 2 mô hình.

### 2. Phương pháp
* **Dữ liệu:** Sử dụng bộ dữ liệu **MNIST** (60,000 ảnh train, 10,000 ảnh test, kích thước 28x28 grayscale).
* **Tiền xử lý:** Chuẩn hóa (Normalize) và định hình lại dữ liệu phù hợp với input của từng mô hình KNN/CNN.

#### Mô hình 1: Mạng nơ-ron tích chập (CNN)
* **Kiến trúc:** Mô hình CNN đơn giản gồm:
  * 2 lớp Tích chập (Convolution) + Lớp gộp (MaxPooling).
  * 1 lớp Kết nối đầy đủ (Fully Connected / Dense).
  * Lớp Softmax đầu ra (10 lớp phân loại).
* **Cấu hình:** * Hàm mất mát: `Categorical Cross-Entropy`. 
  * Bộ tối ưu: `Adam`.
* **Đánh giá mô hình:** `Accuracy` trên tập test, vẽ `Confusion Matrix` để phân tích lỗi.
* **Công cụ:** Python, TensorFlow/Keras, Google Colab.

#### Mô hình 2: K-Nearest Neighbors (KNN)
* **Kiến trúc:** * Tính khoảng cách giữa các điểm dữ liệu dựa trên khoảng cách Euclid.
  * Chọn giá trị K tối ưu bằng cách lập hàm đánh giá độ chính xác qua các giá trị K khác nhau.
  * Đưa ra nhãn dự đoán bằng cơ chế bầu chọn và so sánh với nhãn thật.
* **Đánh giá mô hình:** `Accuracy` trên tập test, vẽ `Confusion Matrix` phân tích lỗi, và biểu đồ thể hiện độ chính xác dựa trên giá trị K.
* **Công cụ:** Python.

---