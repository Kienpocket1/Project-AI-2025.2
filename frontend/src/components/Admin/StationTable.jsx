import React, { useState, useEffect } from "react";
import { Search, MapPin, SearchX, ServerCrash } from "lucide-react";
import { ToggleSwitch } from "./ToggleSwitch";
import { cn } from "./utils";
import { ToastContainer } from "./Toast";

export default function StationTable() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusLoadingMap, setStatusLoadingMap] = useState({});
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/stations");
      if (!res.ok) throw new Error("Could not fetch stations");
      const data = await res.json();
      setStations(data);
    } catch (err) {
      setError(err.message || "Failed to load system data");
    } finally {
      setLoading(false);
    }
  };

  const overrideStationStatus = async (stationId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    
    // Khóa nút gạt tạm thời để tránh click liên tục
    setStatusLoadingMap(prev => ({ ...prev, [stationId]: true }));
    
    try {
      const res = await fetch("/api/admin/station/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stationId, status: newStatus }),
      });
      
      const data = await res.json();
      
      // FIX LỖI Ở ĐÂY: Bỏ cái vụ bắt bẻ data.success đi, chỉ cần server không báo lỗi 500 là duyệt!
      if (!res.ok) {
         throw new Error(data.message || "Hệ thống từ chối cập nhật!");
      }
      
      // Lật công tắc sang màu xanh (hoặc xám)
      setStations(prev => prev.map(s => s.node_id === stationId ? { ...s, status: newStatus } : s));
      addToast("success", `Đã cập nhật ga #${stationId} -> ${newStatus === 1 ? "Hoạt động" : "Bảo trì"}`);
      
    } catch (err) {
      addToast("error", `Lỗi: ${err.message}`);
    } finally {
      setStatusLoadingMap(prev => ({ ...prev, [stationId]: false }));
    }
  };

  const filteredStations = stations.filter(s => 
    s.stop_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.node_id.toString().includes(searchQuery)
  );

  return (
    <div className="p-8 h-full flex flex-col">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="flex justify-between items-end mb-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Danh Sách Ga (Madrid)</h2>
            <p className="text-sm text-slate-500">Bật/tắt ga để định tuyến lại thuật toán tìm đường</p>
          </div>
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm tên ga hoặc ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all outline-none text-slate-800"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden">
        
        {/* Table Content */}
        <div className="flex-1 overflow-auto bg-white">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
              <p>Đang tải dữ liệu mạng lưới...</p>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-red-500 p-8 space-y-4 text-center">
              <ServerCrash className="h-12 w-12 text-red-400" />
              <div>
                <p className="font-medium text-lg">Lỗi tải dữ liệu</p>
                <p className="text-sm opacity-80 mt-1">{error}</p>
              </div>
              <button 
                onClick={fetchStations}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : filteredStations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <SearchX className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="font-medium text-slate-600">Không tìm thấy ga tàu</p>
                <p className="text-sm mt-1">Thử thay đổi từ khóa tìm kiếm</p>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">
                    ID Ga
                  </th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Tên Ga
                  </th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Tọa độ (Lat, Lon)
                  </th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredStations.map((station) => {
                  const isActive = station.status === 1;
                  const isToggleLoading = statusLoadingMap[station.node_id] || false;
                  
                  return (
                    <tr key={station.node_id} className={`hover:bg-slate-50 transition-colors ${!isActive ? 'bg-red-50/30' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-400">
                        #{station.node_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-semibold">
                        {station.stop_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex items-center space-x-1.5 font-mono text-xs">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{station.stop_lat.toFixed(4)}, {station.stop_lon.toFixed(4)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <span className={cn(
                            "text-xs font-medium px-2.5 py-1 rounded-full",
                            isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                          )}>
                            {isActive ? "Hoạt động" : "Bảo trì"}
                          </span>
                          
                          <ToggleSwitch 
                            checked={isActive} 
                            disabled={isToggleLoading}
                            onChange={() => overrideStationStatus(station.node_id, station.status)} 
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination Mockup */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between mt-auto">
          <span className="text-sm text-slate-500">Hiển thị {filteredStations.length} / {stations.length} ga tàu</span>
        </div>
      </div>
    </div>
  );
}
