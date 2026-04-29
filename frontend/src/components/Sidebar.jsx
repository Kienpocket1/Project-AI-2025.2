import { useState, useEffect } from 'react';
import { getStations } from '../services/api';
import RouteList from './RouteList';

const Sidebar = ({ onSearch, loading, resultData }) => {
  const [stations, setStations] = useState([]);
  const [startName, setStartName] = useState('');
  const [endName, setEndName] = useState('');
  const [mode, setMode] = useState('1');

  useEffect(() => {
    const fetchStations = async () => {
      const data = await getStations();
      if (Array.isArray(data)) setStations(data);
    };
    fetchStations();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const startNode = stations.find(s => s.name === startName)?.id;
    const endNode = stations.find(s => s.name === endName)?.id;

    if (startNode !== undefined && endNode !== undefined) {
      onSearch(startNode, endNode, mode);
    } else {
      alert("Vui lòng chọn đúng tên ga từ danh sách gợi ý!");
    }
  };

  return (
    <div className="w-[320px] h-screen bg-white border-r border-slate-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.05)] z-20">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3 text-[#e30613] font-extrabold text-xl tracking-tighter">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          <span>MADRID METRO</span>
        </div>
      </div>
      <div className="p-6 flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2 tracking-wider">Ga xuất phát</label>
            <input
              type="text"
              list="station-list"
              value={startName}
              onChange={(e) => setStartName(e.target.value)}
              placeholder="Gõ để tìm tên ga..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50 box-border focus:outline-none focus:ring-2 focus:ring-[#e30613]"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2 tracking-wider">Ga đến</label>
            <input
              type="text"
              list="station-list"
              value={endName}
              onChange={(e) => setEndName(e.target.value)}
              placeholder="Gõ để tìm tên ga..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50 box-border focus:outline-none focus:ring-2 focus:ring-[#e30613]"
              required
            />
          </div>

          <datalist id="station-list">
            {stations.map(s => (
              <option key={s.id} value={s.name} />
            ))}
          </datalist>

          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2 tracking-wider">Tiêu chí</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-slate-50 box-border focus:outline-none focus:ring-2 focus:ring-[#e30613]"
            >
              <option value="1">Nhanh nhất</option>
              <option value="2">Ít chuyển tuyến</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-[#e30613] text-white rounded-lg font-semibold mt-2 cursor-pointer shadow-[0_4px_12px_rgba(227,6,19,0.2)] hover:bg-[#c10510] transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang tính...' : 'Tìm đường'}
          </button>
        </form>

       <RouteList resultData={resultData} />
      </div>
    </div>
  );
};

export default Sidebar;