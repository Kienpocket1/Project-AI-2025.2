import React from 'react';
import { Train, Clock, LogOut } from 'lucide-react'; // Thêm icon Clock
import { useNavigate } from 'react-router-dom';

// Nhận 2 biến activeTab và setActiveTab từ AdminDashboard truyền sang
export default function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/auth');
  };

  return (
    <aside className="w-64 bg-[#111827] text-slate-300 flex flex-col h-full transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-2 text-white font-bold text-lg tracking-wide">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white">M</div>
          Metro Madrid
        </div>
      </div>

      <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Hệ thống</div>
      
      <nav className="flex-1 px-3 space-y-1">
        {/* Nút Quản lý Ga Tàu */}
        <button 
          onClick={() => setActiveTab('stations')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium ${
            activeTab === 'stations' ? 'bg-red-600 text-white' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Train className="w-5 h-5" /> Quản lý Ga Tàu
        </button>

        {/* Nút Thiết lập Lịch trình động */}
        <button 
          onClick={() => setActiveTab('peakhours')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium ${
            activeTab === 'peakhours' ? 'bg-red-600 text-white' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Clock className="w-5 h-5" /> Lịch trình động
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
            AD
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Senior Admin</div>
            <div className="text-xs text-slate-400">Quản trị viên</div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-5 h-5" /> Đăng xuất
        </button>
      </div>
    </aside>
  );
}