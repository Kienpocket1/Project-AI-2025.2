import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import UserDashboard from './UserDashboard'; 
import AdminDashboard from './components/Admin/AdminDashboard'; 
import AuthPage from './components/AuthPage'; 

const ProtectedRoute = ({ children, requireAdmin }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && role !== 'admin') {
    // CHỖ SỬA SỐ 1: Bị đuổi thì văng về trang /user thay vì /
    return <Navigate to="/user" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        {/* CHỖ SỬA SỐ 2: Nếu ai đó gõ mỗi localhost:5173/, tự động bế họ sang /user */}
        <Route path="/" element={<Navigate to="/user" replace />} />

        {/* CHỖ SỬA SỐ 3: Đổi nhà mới cho User sang đường dẫn /user */}
        <Route path="/user" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;