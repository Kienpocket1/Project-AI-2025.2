# Project-AI-2025.2
### Bài toán
-	Tên bài toán: So sánh khả năng nhận diện chữ số viết tay (0–9) từ ảnh bằng thuật toán K-Nearest Neighbors (KNN) và mạng nơ-ron tích chập (CNN).
-	Mục tiêu: Xây dựng mô hình AI có khả năng phân loại chính xác một ảnh chứa chữ số viết tay (chỉ 1 chữ số) vào một trong 10 lớp (0–9) theo 2 phương pháp và so sánh, đánh giá các đặc điểm của 2 mô hình với nhau.
### Phương pháp
-   Áp dụng thuật toán KNN và CNN để nhận dạng chữ số viết tay
-   Dữ liệu: Sử dụng bộ dữ liệu MNIST (60,000 ảnh train, 10,000 ảnh test, ảnh 28×28 grayscale).
-   Tiền xử lý: Chuẩn hóa dữ liệu phù hợp input KNN/CNN.
-   Mô hình:
#### Với CNN
-   Xây dựng mô hình CNN đơn giản gồm:
            2 lớp Convolution + MaxPooling.
            1 lớp Fully Connected (Dense).
            Lớp Softmax đầu ra 10 lớp.
            Hàm mất mát: Categorical Cross-Entropy.
            Bộ tối ưu: Adam.
-   Đánh giá mô hình: Accuracy trên tập test, vẽ confusion matrix để phân tích lỗi.
-   Công cụ: Python, TensorFlow/Keras, Google Colab.
#### Với KNN
-   Xây dựng mô hình KNN
            Tính khoảng cách dựa trên khoảng cách euclid
            Chọn giá trị K bằng cách lập hàm đánh giá độ chính xác của thuật toán dựa trên các giá trị K khác nhau
            Đưa ra nhãn dự đoán và so sánh với nhãn thật
-   Đánh giá mô hình: Accuracy trên tập test, vẽ confusion matrix để phân tích lỗi, biểu đồ chính xác dựa trên giá trị K. 
-   Công cụ: Python.
