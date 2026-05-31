import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import { getStations, getRoute } from './services/api';

export default function UserDashboard() {
  const [allStations, setAllStations] = useState([]);
  const [pathData, setPathData] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(null);

  // Lấy toàn bộ danh sách ga để hiển thị lên bản đồ lúc mới vào
  useEffect(() => {
    const fetchStations = async () => {
      const data = await getStations();
      if (Array.isArray(data)) setAllStations(data);
    };
    fetchStations();
  }, []);

  // Hàm xử lý khi user bấm nút "Tìm đường" ở Sidebar
  const handleSearch = async (startNode, endNode, mode, departureTime) => {
    setLoading(true);
    try {
      // Gọi API C++ tìm đường 
      const data = await getRoute(startNode, endNode, mode, departureTime);
      
      if (data && data.path) {
        setPathData(data.path);
        setTotalTime(data.total_time);
        setResultData(data); // Truyền xuống cho RouteList hiển thị text
      } else {
        alert("Không tìm thấy đường đi hoặc ga bị bảo trì!");
        setPathData([]);
        setResultData(null);
      }
    } catch (error) {
      alert("Lỗi kết nối đến server C++!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Cột trái: Sidebar chứa Form tìm kiếm */}
      <Sidebar 
        onSearch={handleSearch} 
        loading={loading} 
        resultData={resultData} 
      />

      {/* Cột phải: Bản đồ chiếm toàn bộ không gian còn lại */}
      <div className="flex-1 relative z-0">
        <MapView 
          allStations={allStations} 
          pathData={pathData} 
          totalTime={totalTime} 
        />
      </div>
    </div>
  );
}