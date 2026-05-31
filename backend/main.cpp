// Thuật toán A* (A-Star Search) - Tích hợp Đồ thị phụ thuộc thời gian (Time-Dependent Routing) - BẢN BỌC THÉP CHỐNG SẬP
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <cmath>
#include <queue>
#include <algorithm>
#include "sqlite3.h"
#include <chrono>

using namespace std;

struct Node { int id; string name; double lat; double lon; };
struct Edge { int to; double weight; bool is_transfer; };
struct AStarNode {
    int id; double f_score; double g_score;
    bool operator>(const AStarNode& other) const { return f_score > other.f_score; }
};
struct PeakHour {
    int start_sec, end_sec;
    double multiplier, extra_wait;
};

unordered_map<int, Node> graph_nodes;
unordered_map<int, vector<Edge>> adj_list;
vector<PeakHour> peak_hours;

double toRadians(double degree) { return degree * (M_PI / 180.0); }

double heuristic(int u, int target) {
    double lat1 = toRadians(graph_nodes[u].lat), lon1 = toRadians(graph_nodes[u].lon);
    double lat2 = toRadians(graph_nodes[target].lat), lon2 = toRadians(graph_nodes[target].lon);
    double R = 6371000.0;
    double dLat = lat2 - lat1, dLon = lon2 - lon1;
    double a = sin(dLat / 2) * sin(dLat / 2) + cos(lat1) * cos(lat2) * sin(dLon / 2) * sin(dLon / 2);
    return (R * 2 * atan2(sqrt(a), sqrt(1 - a))) / 20.0; 
}

// BỌC THÉP 1: Chống sập khi truyền sai format giờ 
int parseTime(string time_str) {
    if (time_str.length() < 5) return 0;
    try {
        int h = stoi(time_str.substr(0, 2));
        int m = stoi(time_str.substr(3, 2));
        return h * 3600 + m * 60;
    } catch (...) {
        return 0; 
    }
}

void findPathAStar(int start_id, int goal_id, int mode, int start_time_sec) {
    if (graph_nodes.find(start_id) == graph_nodes.end() || graph_nodes.find(goal_id) == graph_nodes.end()) {
        cout << "{\"status\": \"error\", \"message\": \"Not found\"}";
        return;
    }

    auto start_time_bench = chrono::high_resolution_clock::now(); 
    unordered_map<int, double> g_score;
    unordered_map<int, int> came_from;
    priority_queue<AStarNode, vector<AStarNode>, greater<AStarNode>> open_set;

    for (const auto& pair : graph_nodes) g_score[pair.first] = 1e9;
    g_score[start_id] = 0;
    open_set.push({start_id, heuristic(start_id, goal_id), 0});

    while (!open_set.empty()) {
        int u = open_set.top().id;
        double current_g = open_set.top().g_score;
        open_set.pop();

        if (graph_nodes[u].name == graph_nodes[goal_id].name) {
            vector<pair<int, double>> path_with_time; 
            vector<bool> path_is_transfer; 
            
            int curr = u;
            double total_actual_time = 0;

            while (curr != start_id) {
                int prev = came_from[curr];
                double weight_to_curr = 0;
                bool transfer_to_curr = false;

                int time_of_day = (start_time_sec + (int)g_score[prev]) % 86400;
                double mult = 1.0;
                double wait = 0.0;
                for (const auto& ph : peak_hours) {
                    if (time_of_day >= ph.start_sec && time_of_day <= ph.end_sec) {
                        mult = ph.multiplier;
                        wait = ph.extra_wait;
                        break;
                    }
                }

                for (const auto& edge : adj_list[prev]) { 
                    if (edge.to == curr) { 
                        weight_to_curr = (edge.weight * mult) + (edge.is_transfer ? wait : 0); 
                        transfer_to_curr = edge.is_transfer;
                        break; 
                    } 
                }
                path_with_time.push_back({curr, weight_to_curr});
                path_is_transfer.push_back(transfer_to_curr);
                total_actual_time += weight_to_curr;
                curr = prev;
            }
            path_with_time.push_back({start_id, 0});
            path_is_transfer.push_back(false);
            
            reverse(path_with_time.begin(), path_with_time.end());
            reverse(path_is_transfer.begin(), path_is_transfer.end());

            cout << "{";
            cout << "\"status\": \"success\",";
            cout << "\"total_time\": " << total_actual_time << ",";
            cout << "\"path\": [";
            double accumulated_time = 0;
            for (size_t i = 0; i < path_with_time.size(); ++i) {
                int id = path_with_time[i].first;
                accumulated_time += path_with_time[i].second;
                
                cout << "{";
                cout << "\"name\": \"" << graph_nodes[id].name << "\",";
                cout << "\"lat\": " << graph_nodes[id].lat << ",";
                cout << "\"lon\": " << graph_nodes[id].lon << ",";
                cout << "\"step_time\": " << path_with_time[i].second << ","; 
                cout << "\"is_transfer\": " << (path_is_transfer[i] ? "true" : "false") << ","; 
                cout << "\"arrival_time\": " << accumulated_time; 
                cout << "}";
                if (i != path_with_time.size() - 1) cout << ",";
            }
            cout << "]}";
            return;
        }

        if (current_g > g_score[u]) continue;

        int current_time_of_day = (start_time_sec + (int)g_score[u]) % 86400;
        double mult = 1.0;
        double wait = 0.0;
        
        for (const auto& ph : peak_hours) {
            if (current_time_of_day >= ph.start_sec && current_time_of_day <= ph.end_sec) {
                mult = ph.multiplier;
                wait = ph.extra_wait;
                break;
            }
        }

        for (const auto& edge : adj_list[u]) {
            double cost = 0;
            if (mode == 2) {
                cost = edge.is_transfer ? (10000.0 + wait) : (1.0 * mult);
            } else {
                cost = (edge.weight * mult) + (edge.is_transfer ? wait : 0);
            }

            if (g_score[u] + cost < g_score[edge.to]) {
                came_from[edge.to] = u;
                g_score[edge.to] = g_score[u] + cost;
                open_set.push({edge.to, g_score[edge.to] + heuristic(edge.to, goal_id), g_score[edge.to]});
            }
        }
    }
    cout << "{\"status\": \"error\", \"message\": \"Not found\"}";
}

int main(int argc, char* argv[]) {
    if (argc < 4) return 1;
    int start = stoi(argv[1]);
    int end = stoi(argv[2]);
    int mode = stoi(argv[3]);
    
    // BỌC THÉP 2: Chống sập nếu Web quên truyền giờ xuống
    int start_time_sec = (argc >= 5) ? parseTime(argv[4]) : 0; 

    sqlite3* db;
    sqlite3_open("metro_madrid.db", &db);
    sqlite3_stmt* stmt = nullptr;

    // BỌC THÉP 3: Chống sập nếu bảng KhungGioCaoDiem chưa tồn tại
    if (sqlite3_prepare_v2(db, "SELECT gio_bat_dau, gio_ket_thuc, he_so_luu_luong, thoi_gian_cho_tau FROM KhungGioCaoDiem;", -1, &stmt, nullptr) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            string t_start = (const char*)sqlite3_column_text(stmt, 0);
            string t_end = (const char*)sqlite3_column_text(stmt, 1);
            peak_hours.push_back({
                parseTime(t_start), parseTime(t_end),
                sqlite3_column_double(stmt, 2), sqlite3_column_double(stmt, 3)
            });
        }
        sqlite3_finalize(stmt);
    }
    
    // Tải Ga
    if (sqlite3_prepare_v2(db, "SELECT node_id, stop_name, stop_lat, stop_lon FROM Tram WHERE status = 1;", -1, &stmt, nullptr) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            int id = sqlite3_column_int(stmt, 0);
            graph_nodes[id] = {id, (const char*)sqlite3_column_text(stmt, 1), sqlite3_column_double(stmt, 2), sqlite3_column_double(stmt, 3)};
        }
        sqlite3_finalize(stmt);
    }

    // Tải Kết nối
    if (sqlite3_prepare_v2(db, "SELECT u, v, MIN(travel_time) FROM Ket_Noi GROUP BY u, v;", -1, &stmt, nullptr) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            int u = sqlite3_column_int(stmt, 0), v = sqlite3_column_int(stmt, 1);
            if (graph_nodes.count(u) && graph_nodes.count(v)) {
                adj_list[u].push_back({v, sqlite3_column_double(stmt, 2), false});
            }
        }
        sqlite3_finalize(stmt);
    }

    // Thêm cạnh đi bộ
    for (auto& u : graph_nodes) {
        for (auto& v : graph_nodes) {
            if (u.first != v.first && u.second.name == v.second.name) {
                adj_list[u.first].push_back({v.first, 300.0, true});
            }
        }
    }

    // --- GẮN KÍNH LÚP DEBUG VÀO ĐÂY ---
    cerr << "\n================ DEBUG THÔNG TIN ================\n";
    cerr << "1. Gio khoi hanh (tinh bang giay): " << start_time_sec << "\n";
    cerr << "2. So khung gio cao diem trong DB: " << peak_hours.size() << "\n";
    cerr << "=================================================\n";

    findPathAStar(start, end, mode, start_time_sec);

    sqlite3_close(db);
    return 0;
}