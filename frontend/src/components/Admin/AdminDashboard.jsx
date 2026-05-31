import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import StationTable from './StationTable';
import PeakHoursAdmin from './PeakHoursAdmin'; // Đem import vào đây

export default function AdminDashboard() {
  // Trạng thái lưu xem người dùng đang mở tab nào (Mặc định là 'stations')
  const [activeTab, setActiveTab] = useState('stations');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Truyền trạng thái và hàm đổi tab sang Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          {/* NẾU activeTab LÀ 'stations' THÌ HIỆN BẢNG GA, NẾU LÀ 'peakhours' THÌ HIỆN GIỜ CAO ĐIỂM */}
          {activeTab === 'stations' ? <StationTable /> : <PeakHoursAdmin />}
        </main>
      </div>
    </div>
  );
}