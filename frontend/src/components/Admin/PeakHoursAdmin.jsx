import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, CheckCircle2, Info, AlertTriangle } from 'lucide-react'; 

export default function PeakHoursAdmin() {
    const [peakHours, setPeakHours] = useState([]);
    const [formData, setFormData] = useState({
        gio_bat_dau: '', gio_ket_thuc: '', he_so_luu_luong: 1.5, thoi_gian_cho_tau: 300
    });

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    
    // 1. TẠO TRẠNG THÁI CHO HỘP THOẠI XÁC NHẬN XÓA (MODAL) TẠI ĐÂY
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message, type }), 3000); 
    };

    useEffect(() => {
        fetchPeakHours();
    }, []);

    const fetchPeakHours = async () => {
        const res = await fetch('http://localhost:3000/api/admin/peak-hours');
        if (res.ok) {
            const data = await res.json();
            setPeakHours(data);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:3000/api/admin/peak-hours', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        fetchPeakHours(); 
        setFormData({ gio_bat_dau: '', gio_ket_thuc: '', he_so_luu_luong: 1.5, thoi_gian_cho_tau: 300 }); 
        
        showToast("Đã thêm giờ cao điểm thành công!", "success");
    };

    // 2. KHI BẤM NÚT XÓA Ở BẢNG -> CHỈ MỞ MODAL LÊN CHỨ CHƯA XÓA VỘI
    const handleDeleteClick = (id) => {
        setDeleteModal({ show: true, id: id });
    };

    // 3. KHI BẤM "XÓA LUÔN" TRONG MODAL -> MỚI THỰC SỰ GỌI API
    const confirmDelete = async () => {
        const id = deleteModal.id;
        setDeleteModal({ show: false, id: null }); // Đóng modal ngay lập tức
        
        await fetch(`http://localhost:3000/api/admin/peak-hours/${id}`, {
            method: 'DELETE'
        });
        fetchPeakHours(); 
        showToast("Đã xóa khung giờ thành công!", "delete");
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-8 relative">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                Thiết lập Lịch trình động (Giờ cao điểm)
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Từ giờ</label>
                    <input type="time" required className="p-2 border border-slate-300 rounded focus:ring-red-500 outline-none" 
                        value={formData.gio_bat_dau} onChange={e => setFormData({...formData, gio_bat_dau: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Đến giờ</label>
                    <input type="time" required className="p-2 border border-slate-300 rounded focus:ring-red-500 outline-none"
                        value={formData.gio_ket_thuc} onChange={e => setFormData({...formData, gio_ket_thuc: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Hệ số lưu lượng</label>
                    <input type="number" step="0.1" required className="p-2 border border-slate-300 rounded w-24 outline-none"
                        value={formData.he_so_luu_luong} onChange={e => setFormData({...formData, he_so_luu_luong: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Phạt đổi tuyến (giây)</label>
                    <input type="number" required className="p-2 border border-slate-300 rounded w-32 outline-none"
                        value={formData.thoi_gian_cho_tau} onChange={e => setFormData({...formData, thoi_gian_cho_tau: e.target.value})} />
                </div>
                <button type="submit" className="bg-red-600 text-white px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-700 transition-colors">
                    <Plus className="w-4 h-4" /> Thêm thiết lập
                </button>
            </form>

            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-200 text-sm text-slate-500 uppercase tracking-wider bg-slate-50">
                        <th className="p-3 font-semibold">Khung giờ</th>
                        <th className="p-3 font-semibold">Trạng thái lưu lượng</th>
                        <th className="p-3 font-semibold">Chờ chuyển tuyến</th>
                        <th className="p-3 font-semibold text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {peakHours.map((ph) => (
                        <tr key={ph.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-bold text-slate-700">{ph.gio_bat_dau} - {ph.gio_ket_thuc}</td>
                            <td className="p-3 text-red-600 font-medium">Chậm x {ph.he_so_luu_luong} lần</td>
                            <td className="p-3 text-orange-600 font-medium">Cộng thêm {ph.thoi_gian_cho_tau}s</td>
                            <td className="p-3 text-right">
                                {/* SỬA NÚT NÀY THÀNH GỌI HÀM MỞ MODAL */}
                                <button onClick={() => handleDeleteClick(ph.id)} className="text-slate-400 hover:text-red-600 transition-colors p-1" title="Xóa khung giờ này">
                                    <Trash2 className="w-5 h-5 inline" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {peakHours.length === 0 && (
                        <tr>
                            <td colSpan="4" className="p-4 text-center text-slate-500 italic">Chưa có khung giờ cao điểm nào được thiết lập.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* THÔNG BÁO (TOAST) */}
            {toast.show && (
                <div className={`fixed bottom-8 right-8 px-5 py-3 rounded-lg shadow-2xl text-white text-sm font-medium flex items-center gap-3 z-50 animate-bounce ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                    {toast.message}
                </div>
            )}

            {/* ========================================================= */}
            {/* 4. MODAL XÁC NHẬN XÓA (NỔI GIỮA MÀN HÌNH CHUẨN XỊN) */}
            {/* ========================================================= */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 transform scale-100 transition-transform">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                            <div className="p-2 bg-red-100 rounded-full">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Xác nhận xóa</h3>
                        </div>
                        <p className="text-slate-600 text-sm mb-6 pl-1">
                            Bạn có chắc chắn muốn xóa khung giờ cao điểm này không? Dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục.
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button 
                                onClick={() => setDeleteModal({ show: false, id: null })} 
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                onClick={confirmDelete} 
                                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                            >
                                Xóa luôn
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}