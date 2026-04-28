#ifndef GRAPH_H
#define GRAPH_H

#include <string>
#include <vector>
#include <unordered_map>
#include <iostream>
#include <queue>     
#include <limits>    
#include <algorithm> 
#include <cmath>
struct Edge {
    std::string targetNodeId;
    double travelTime;
    double transferPenalty;
    
    Edge(std::string target, double time, double penalty = 0.0) 
        : targetNodeId(target), travelTime(time), transferPenalty(penalty) {}
};

struct Node {
    std::string id;
    std::string stationName;
    std::string line;
    double lat;
    double lon;
    
    std::vector<Edge> neighbors; 

    Node() {}
    Node(std::string _id, std::string _name, std::string _line, double _lat = 0.0, double _lon = 0.0)
        : id(_id), stationName(_name), line(_line), lat(_lat), lon(_lon) {}
};

class SubwayGraph {
private:
    std::unordered_map<std::string, Node> nodes;

    // HÀM MỚI: Tính khoảng cách Haversine và đổi ra số phút dự kiến
    double calculateHeuristic(const std::string& currentId, const std::string& goalId) {
        Node current = nodes[currentId];
        Node goal = nodes[goalId];

        // Bán kính Trái Đất (km)
        const double R = 6371.0; 

        // Chuyển đổi độ sang radian
        double lat1 = current.lat * M_PI / 180.0;
        double lon1 = current.lon * M_PI / 180.0;
        double lat2 = goal.lat * M_PI / 180.0;
        double lon2 = goal.lon * M_PI / 180.0;

        double dLat = lat2 - lat1;
        double dLon = lon2 - lon1;

        // Công thức Haversine
        double a = std::sin(dLat / 2) * std::sin(dLat / 2) +
                   std::cos(lat1) * std::cos(lat2) * std::sin(dLon / 2) * std::sin(dLon / 2);
        double c = 2 * std::atan2(std::sqrt(a), std::sqrt(1 - a));
        
        double distanceKm = R * c; // Khoảng cách đường chim bay (km)

        // Giả sử tốc độ trung bình của tàu điện Madrid là 30 km/h (0.5 km/phút)
        // Thời gian ước tính = Khoảng cách / Tốc độ
        double estimatedTimeMin = distanceKm / 2.0; 

        return estimatedTimeMin;
    }

public:
    // Cập nhật hàm addNode để nhận thêm lat và lon (mặc định là 0.0 nếu không truyền)
    void addNode(const std::string& id, const std::string& name, const std::string& line, double lat = 0.0, double lon = 0.0) {
        if (nodes.find(id) == nodes.end()) {
            nodes[id] = Node(id, name, line, lat, lon); // Truyền tọa độ vào constructor của Node
        }
    }

    void addTrackDirection(const std::string& fromId, const std::string& toId, double travelTime) {
        nodes[fromId].neighbors.push_back(Edge(toId, travelTime, 0.0));
        nodes[toId].neighbors.push_back(Edge(fromId, travelTime, 0.0));
    }

    void addTransfer(const std::string& node1Id, const std::string& node2Id, double walkingTime) {
        nodes[node1Id].neighbors.push_back(Edge(node2Id, 0.0, walkingTime));
        nodes[node2Id].neighbors.push_back(Edge(node1Id, 0.0, walkingTime));
    }

    void printGraph() {
        for (const auto& pair : nodes) {
            std::cout << "Node: " << pair.first << " (" << pair.second.stationName << " - " << pair.second.line << ")\n";
            for (const auto& edge : pair.second.neighbors) {
                std::cout << "  -> " << edge.targetNodeId 
                          << " [Time: " << edge.travelTime 
                          << "m, Penalty: " << edge.transferPenalty << "m]\n";
            }
        }
    }
    // THUẬT TOÁN DIJKSTRA TÌM ĐƯỜNG NGẮN NHẤT
    // THÊM THAM SỐ: w_time (trọng số thời gian) và w_transfer (trọng số chuyển tuyến)
    void findShortestPath(const std::string& startId, const std::string& endId, double w_time = 1.0, double w_transfer = 1.0) {
        std::unordered_map<std::string, double> distances;
        std::unordered_map<std::string, std::string> previous;

        for (const auto& pair : nodes) {
            distances[pair.first] = std::numeric_limits<double>::infinity();
        }
        distances[startId] = 0.0;

        std::priority_queue<std::pair<double, std::string>,
                            std::vector<std::pair<double, std::string>>,
                            std::greater<std::pair<double, std::string>>> pq;

        pq.push({0.0, startId});

        while (!pq.empty()) {
            double currentDist = pq.top().first;
            std::string currentId = pq.top().second;
            pq.pop();

            if (currentId == endId) break;
            if (currentDist > distances[currentId]) continue;

            for (const auto& edge : nodes[currentId].neighbors) {
                // CÔNG THỨC ĐA TIÊU CHÍ (Tùy chỉnh hệ số)
                double weight = (edge.travelTime * w_time) + (edge.transferPenalty * w_transfer);
                double newDist = currentDist + weight;

                if (newDist < distances[edge.targetNodeId]) {
                    distances[edge.targetNodeId] = newDist;
                    previous[edge.targetNodeId] = currentId;
                    pq.push({newDist, edge.targetNodeId});
                }
            }
        }

        // --- (Phần code truy vết traceback bên dưới giữ nguyên y hệt) ---
        if (distances[endId] == std::numeric_limits<double>::infinity()) {
            std::cout << "\nKhong tim thay duong di tu " << startId << " den " << endId << "\n";
            return;
        }

        std::vector<std::string> path;
        std::string curr = endId;
        while (curr != "") {
            path.push_back(curr);
            if (previous.find(curr) != previous.end()) {
                curr = previous[curr];
            } else {
                curr = "";
            }
        }
        std::reverse(path.begin(), path.end());

        std::cout << "\n=== KET QUA TIM DUONG ===\n";
        std::cout << "Tu ga: " << startId << " den " << endId << "\n";
        // Lưu ý: Distances lúc này là "Điểm chi phí", không còn thuần túy là "Phút" nữa
        std::cout << "Tong chi phi (Score): " << distances[endId] << "\n";
        std::cout << "Lo trinh: ";
        for (size_t i = 0; i < path.size(); ++i) {
            std::cout << path[i];
            if (i < path.size() - 1) std::cout << " -> ";
        }
        std::cout << "\n=========================\n";
    }
    // THUẬT TOÁN A* TỐI ƯU HÓA TÌM KIẾM BẰNG TỌA ĐỘ
    void findAStarPath(const std::string& startId, const std::string& endId, double w_time = 1.0, double w_transfer = 1.0) {
        std::unordered_map<std::string, double> gScore; // Chi phí thực tế g(n)
        std::unordered_map<std::string, std::string> previous;

        for (const auto& pair : nodes) {
            gScore[pair.first] = std::numeric_limits<double>::infinity();
        }
        gScore[startId] = 0.0;

        // Priority Queue lưu pair< fScore, NodeID >
        std::priority_queue<std::pair<double, std::string>,
                            std::vector<std::pair<double, std::string>>,
                            std::greater<std::pair<double, std::string>>> pq;

        // f(start) = g(start) + h(start) = 0 + h(start)
        double initialHeuristic = calculateHeuristic(startId, endId);
        pq.push({initialHeuristic, startId});

        while (!pq.empty()) {
            std::string currentId = pq.top().second;
            // fScore hiện tại chính là pq.top().first, nhưng ta không dùng nó để xét tính logic, 
            // ta lấy ra để loại bỏ khỏi queue
            pq.pop();

            if (currentId == endId) break;

            for (const auto& edge : nodes[currentId].neighbors) {
                // Tính g(n) mới = Chi phí thực tế từ điểm xuất phát đến trạm kề
                double weight = (edge.travelTime * w_time) + (edge.transferPenalty * w_transfer);
                double tentative_gScore = gScore[currentId] + weight;

                if (tentative_gScore < gScore[edge.targetNodeId]) {
                    // Cập nhật gScore và đường đi
                    gScore[edge.targetNodeId] = tentative_gScore;
                    previous[edge.targetNodeId] = currentId;
                    
                    // Tính f(n) = g(n) + h(n) và đẩy vào hàng đợi
                    double fScore = tentative_gScore + calculateHeuristic(edge.targetNodeId, endId);
                    pq.push({fScore, edge.targetNodeId});
                }
            }
        }

        // --- Truy vết đường đi (Tương tự Dijkstra) ---
        if (gScore[endId] == std::numeric_limits<double>::infinity()) {
            std::cout << "\n[A*] Khong tim thay duong di tu " << startId << " den " << endId << "\n";
            return;
        }

        std::vector<std::string> path;
        std::string curr = endId;
        while (curr != "") {
            path.push_back(curr);
            if (previous.find(curr) != previous.end()) {
                curr = previous[curr];
            } else {
                curr = "";
            }
        }
        std::reverse(path.begin(), path.end());

        std::cout << "\n=== KET QUA TIM DUONG (A-STAR) ===\n";
        std::cout << "Tu ga: " << startId << " den " << endId << "\n";
        std::cout << "Tong chi phi g(n): " << gScore[endId] << "\n";
        std::cout << "Lo trinh: ";
        for (size_t i = 0; i < path.size(); ++i) {
            std::cout << path[i];
            if (i < path.size() - 1) std::cout << " -> ";
        }
        std::cout << "\n==================================\n";
    }
    // HÀM MỚI: Trả về kết quả định dạng JSON
    void findAStarPathJSON(const std::string& startId, const std::string& endId, double w_time = 1.0, double w_transfer = 1.0) {
        std::unordered_map<std::string, double> gScore;
        std::unordered_map<std::string, std::string> previous;

        for (const auto& pair : nodes) {
            gScore[pair.first] = std::numeric_limits<double>::infinity();
        }
        gScore[startId] = 0.0;

        std::priority_queue<std::pair<double, std::string>,
                            std::vector<std::pair<double, std::string>>,
                            std::greater<std::pair<double, std::string>>> pq;

        pq.push({calculateHeuristic(startId, endId), startId});

        while (!pq.empty()) {
            std::string currentId = pq.top().second;
            pq.pop();

            if (currentId == endId) break;

            for (const auto& edge : nodes[currentId].neighbors) {
                double weight = (edge.travelTime * w_time) + (edge.transferPenalty * w_transfer);
                double tentative_gScore = gScore[currentId] + weight;

                if (tentative_gScore < gScore[edge.targetNodeId]) {
                    gScore[edge.targetNodeId] = tentative_gScore;
                    previous[edge.targetNodeId] = currentId;
                    
                    double fScore = tentative_gScore + calculateHeuristic(edge.targetNodeId, endId);
                    pq.push({fScore, edge.targetNodeId});
                }
            }
        }

        // --- ĐÓNG GÓI KẾT QUẢ THÀNH JSON STRING ---
        if (gScore[endId] == std::numeric_limits<double>::infinity()) {
            // Trả về JSON báo lỗi
            std::cout << "{\"status\": \"error\", \"message\": \"Route not found\"}\n";
            return;
        }

        std::vector<std::string> path;
        std::string curr = endId;
        int numTransfers = 0; // Biến đếm số lần chuyển tuyến

        while (curr != "") {
            path.push_back(curr);
            if (previous.find(curr) != previous.end()) {
                std::string prevNode = previous[curr];
                // Nếu 2 node này nằm ở 2 line khác nhau => Cọng 1 lần chuyển tuyến
                if (nodes[curr].line != nodes[prevNode].line) {
                    numTransfers++;
                }
                curr = prevNode;
            } else {
                curr = "";
            }
        }
        std::reverse(path.begin(), path.end());

        // In ra chuỗi JSON thủ công (Tránh phải cài thêm thư viện parse JSON ngoài)
        std::cout << "{\n";
        std::cout << "  \"status\": \"success\",\n";
        std::cout << "  \"start\": \"" << startId << "\",\n";
        std::cout << "  \"end\": \"" << endId << "\",\n";
        std::cout << "  \"total_cost\": " << gScore[endId] << ",\n";
        std::cout << "  \"total_transfers\": " << numTransfers << ",\n";
        std::cout << "  \"route\": [\n";
        
        for (size_t i = 0; i < path.size(); ++i) {
            std::cout << "    \"" << path[i] << "\"";
            if (i < path.size() - 1) std::cout << ",";
            std::cout << "\n";
        }
        
        std::cout << "  ]\n";
        std::cout << "}\n";
    }
};

#endif // GRAPH_H