import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import { getRoute, getStations } from './services/api'; // Import thêm getStations

export default function App() {
  const [routeData, setRouteData] = useState(null);
  const [allStations, setAllStations] = useState([]); // Lưu toàn bộ ga để hiện lên map
  const [loading, setLoading] = useState(false);

  // Hút dữ liệu ngay khi vào trang
  useEffect(() => {
    const loadStations = async () => {
      const data = await getStations();
      if (Array.isArray(data)) setAllStations(data);
    };
    loadStations();
  }, []);

  const handleSearch = async (start, end, mode) => {
    setLoading(true);
    setRouteData(null);
    try {
      const data = await getRoute(start, end, mode);
      setRouteData(data);
    } catch (error) {
      setRouteData({ status: 'error', message: 'Lỗi kết nối Server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar onSearch={handleSearch} loading={loading} resultData={routeData} />
      <div className="flex-1 h-full relative z-10 bg-slate-200">
        <MapView
          allStations={allStations} // Truyền toàn bộ ga
          pathData={routeData?.path || []}
          totalTime={routeData?.total_time || 0}
        />
      </div>
    </div>
  );
}