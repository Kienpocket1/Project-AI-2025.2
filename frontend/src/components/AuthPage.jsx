import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, UserPlus, LogIn, Loader2, Server } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tiện ích gộp class Tailwind (tùy chọn) */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? 'http://localhost:3000/api/login' : 'http://localhost:3000/api/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra');
      }

      if (isLogin) {
        // Đăng nhập thành công, hứng ĐÚNG tên biến từ Backend
        const { token, role, username } = data;
        
        // Lưu thông tin vào Browser Storage
        localStorage.setItem('token', token);
        localStorage.setItem('role', role); // Lưu thẳng role ra đây cho dễ đọc
        localStorage.setItem('username', username);

        // PHÂN QUYỀN ĐIỀU HƯỚNG MỚI
        if (role === 'admin') {
          navigate('/admin');
        } else {
          // CHỖ SỬA ĐÂY: Đổi từ '/' thành '/user'
          navigate('/user'); 
        }
      } else {
        // Đăng ký thành công
        alert('Đăng ký thành công, vui lòng đăng nhập!');
        setIsLogin(true); // Chuyển về form login
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 font-sans p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden shadow-gray-200/50">
        
        {/* Header Section */}
        <div className="bg-slate-900 text-white p-8 text-center">
          <div className="mx-auto bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            {isLogin ? <Lock className="w-8 h-8 text-blue-400" /> : <UserPlus className="w-8 h-8 text-green-400" />}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {isLogin 
              ? 'Đăng nhập để vào hệ thống tàu điện ngầm' 
              : 'Đăng ký tài khoản để mua vé & tra cứu'}
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm border border-red-100 flex items-center">
              <Server className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 block w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                  placeholder="Nhập tên đăng nhập..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white transition-all",
                isLogin 
                  ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" 
                  : "bg-green-600 hover:bg-green-700 focus:ring-green-500",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              )}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLogin ? (
                <>
                  <LogIn className="w-4 h-4 mr-2" /> Đăng Nhập
                </>
              ) : (
                'Đăng Ký Tài Khoản'
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button
              type="button"
              onClick={toggleAuthMode}
              className="font-medium text-blue-600 hover:text-blue-500 underline underline-offset-4"
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
