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

unordered_map<int, Node> graph_nodes;
unordered_map<int, vector<Edge>> adj_list;

double toRadians(double degree) { return degree * (M_PI / 180.0); }

double heuristic(int u, int target) {
    double lat1 = toRadians(graph_nodes[u].lat), lon1 = toRadians(graph_nodes[u].lon);
    double lat2 = toRadians(graph_nodes[target].lat), lon2 = toRadians(graph_nodes[target].lon);
    double R = 6371000.0;
    double dLat = lat2 - lat1, dLon = lon2 - lon1;
    double a = sin(dLat / 2) * sin(dLat / 2) + cos(lat1) * cos(lat2) * sin(dLon / 2) * sin(dLon / 2);
    return (R * 2 * atan2(sqrt(a), sqrt(1 - a))) / 10.0;
}

void findPathAStar(int start_id, int goal_id, int mode) {
    auto start_time = chrono::high_resolution_clock::now();

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

            auto end_time = chrono::high_resolution_clock::now();
            chrono::duration<double, std::milli> elapsed = end_time - start_time;

            cerr << "\n[BENCHMARK] Tu " << start_id << " den " << goal_id 
                 << " | Mode " << mode 
                 << " | Thoi gian chay A*: " << elapsed.count() << " ms\n";
                 
            vector<pair<int, double>> path_with_time; // Lưu {ID ga, thời gian từ ga trước}
            vector<bool> path_is_transfer; // Lưu trạng thái đi bộ
            
            int curr = u;
            double total_actual_time = 0;

            while (curr != start_id) {
                int prev = came_from[curr];
                double weight_to_curr = 0;
                bool transfer_to_curr = false;

                for (const auto& edge : adj_list[prev]) { 
                    if (edge.to == curr) { 
                        weight_to_curr = edge.weight; 
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

            // In JSON nâng cấp
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
                cout << "\"step_time\": " << path_with_time[i].second << ","; // Thời gian chặng này
                cout << "\"is_transfer\": " << (path_is_transfer[i] ? "true" : "false") << ","; // Có phải đi bộ ko
                cout << "\"arrival_time\": " << accumulated_time; // Tổng thời gian tính từ lúc xuất phát
                cout << "}";
                if (i != path_with_time.size() - 1) cout << ",";
            }
            cout << "]}";
            return;
        }

        if (current_g > g_score[u]) continue;

        for (const auto& edge : adj_list[u]) {
            double cost = (mode == 2) ? (edge.is_transfer ? 10000.0 : 1.0) : edge.weight;
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

    sqlite3* db;
    sqlite3_open("metro_madrid.db", &db);
    
    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(db, "SELECT node_id, stop_name, stop_lat, stop_lon FROM Tram;", -1, &stmt, nullptr);
    while (sqlite3_step(stmt) == SQLITE_ROW) {
        int id = sqlite3_column_int(stmt, 0);
        graph_nodes[id] = {id, (const char*)sqlite3_column_text(stmt, 1), sqlite3_column_double(stmt, 2), sqlite3_column_double(stmt, 3)};
    }
    sqlite3_finalize(stmt);

    sqlite3_prepare_v2(db, "SELECT u, v, MIN(travel_time) FROM Ket_Noi GROUP BY u, v;", -1, &stmt, nullptr);
    while (sqlite3_step(stmt) == SQLITE_ROW) {
        adj_list[sqlite3_column_int(stmt, 0)].push_back({sqlite3_column_int(stmt, 1), sqlite3_column_double(stmt, 2), false});
    }
    sqlite3_finalize(stmt);

    for (auto& u : graph_nodes) {
        for (auto& v : graph_nodes) {
            if (u.first != v.first && u.second.name == v.second.name) {
                adj_list[u.first].push_back({v.first, 300.0, true});
            }
        }
    }

    findPathAStar(start, end, mode);
    
    sqlite3_close(db);
    return 0;
}