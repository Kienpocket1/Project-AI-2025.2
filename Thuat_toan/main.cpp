#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include "src/Graph.h"

void loadDataFromCSV(SubwayGraph& graph) {
    std::string line;

    // 1. ĐỌC BẢNG TRAM (NODES)
    std::ifstream nodeFile("Tram.csv");
    if (!nodeFile.is_open()) {
        std::cout << "Loi: Khong tim thay file Tram.csv\n";
        return;
    }
    std::getline(nodeFile, line); // Bỏ qua dòng tiêu đề (Header)
    
    while (std::getline(nodeFile, line)) {
        std::stringstream ss(line);
        std::string stop_id, stop_name, lat_str, lon_str, node_id;
        
        // Cắt chuỗi theo dấu phẩy
        std::getline(ss, stop_id, ',');
        std::getline(ss, stop_name, ',');
        std::getline(ss, lat_str, ',');
        std::getline(ss, lon_str, ',');
        std::getline(ss, node_id, ',');

        // Bảng của Kiên không có tên Line, ta tạm để "Unknown"
        if (!stop_id.empty() && !lat_str.empty()) {
            graph.addNode(stop_id, stop_name, "Unknown", std::stod(lat_str), std::stod(lon_str));
        }
    }
    nodeFile.close();

    // 2. ĐỌC BẢNG KET_NOI (EDGES)
    std::ifstream edgeFile("Ket_Noi.csv");
    if (!edgeFile.is_open()) {
        std::cout << "Loi: Khong tim thay file Ket_Noi.csv\n";
        return;
    }
    std::getline(edgeFile, line); // Bỏ qua Header

    while (std::getline(edgeFile, line)) {
        std::stringstream ss(line);
        std::string trip_id, stop_id, next_stop_id, time_str, u, v;
        
        std::getline(ss, trip_id, ',');
        std::getline(ss, stop_id, ',');
        std::getline(ss, next_stop_id, ',');
        std::getline(ss, time_str, ',');
        std::getline(ss, u, ',');
        std::getline(ss, v, ',');

        if (!stop_id.empty() && !next_stop_id.empty() && !time_str.empty()) {
            // QUAN TRỌNG: Đổi giây sang phút để khớp với Heuristic
            double time_in_minutes = std::stod(time_str) / 60.0;
            
            // Dữ liệu GTFS thường là đường 1 chiều cho mỗi trip_id, 
            // nên ta dùng addTrackDirection (nó đã tự động tạo 2 chiều trong Graph.h)
            graph.addTrackDirection(stop_id, next_stop_id, time_in_minutes);
        }
    }
    edgeFile.close();
    std::cout << "=> Da nap xong du lieu tu CSV vao he thong!\n";
}

int main(int argc, char* argv[]) {
    SubwayGraph madridMetro;

    // Tự động nạp toàn bộ hàng ngàn trạm và kết nối
    loadDataFromCSV(madridMetro);

    // Kịch bản test tĩnh (Bạn có thể tự chọn 2 stop_id bất kỳ trong file Tram.csv để test)
    // Ví dụ tôi thấy trong ảnh của bạn có trạm "par_4_1" và "par_4_10"
    std::cout << "\n>>> CHAY THU A* VOI DATA THAT <<<\n";
    madridMetro.findAStarPathJSON("par_4_1", "par_4_10", 1.0, 1.0);

    return 0;
}