'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, Mail, Key, Sparkles, Calendar, FileText, 
  Settings, LogOut, Search, Eye, CheckCircle2, AlertCircle, 
  Clock, RefreshCw, Server, Send, ChevronRight, User, Building2, Phone, ExternalLink
} from 'lucide-react';

export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('an.huynht@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState('logs'); // 'logs' | 'appointments' | 'resumes' | 'ai_settings' | 'email_settings'
  const [matchLogs, setMatchLogs] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [resumeRequests, setResumeRequests] = useState([]);
  const [settings, setSettings] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Modals & Inspection State
  const [selectedLog, setSelectedLog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState('');

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeMsg, setPasswordChangeMsg] = useState({ type: '', text: '' });

  // Check saved token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_jwt');
    const savedUser = localStorage.getItem('admin_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch dashboard data when authenticated
  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    setIsLoadingData(true);
    try {
      // 1. Fetch Logs
      const logsRes = await fetch('/api/admin/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const logsData = await logsRes.json();
      if (logsData.success) {
        setMatchLogs(logsData.logs || []);
      }

      // 2. Fetch Appointments & Resumes
      const apptRes = await fetch('/api/admin/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const apptData = await apptRes.json();
      if (apptData.success) {
        setAppointments(apptData.appointments || []);
        setResumeRequests(apptData.resumeRequests || []);
      }

      // 3. Fetch Settings
      const setRes = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const setData = await setRes.json();
      if (setData.success) {
        setSettings(setData.settings || {});
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Đăng nhập không thành công.');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('admin_jwt', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('admin_jwt');
    localStorage.removeItem('admin_user');
  };

  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: apptId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status: newStatus } : a));
      }
    } catch (err) {
      alert('Lỗi cập nhật trạng thái: ' + err.message);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaveSuccessMsg('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg('Đã lưu cấu hình thành công!');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      } else {
        alert('Lỗi: ' + data.error);
      }
    } catch (err) {
      alert('Lỗi lưu cấu hình: ' + err.message);
    }
  };

  const handleSendTestEmail = async () => {
    setTestEmailLoading(true);
    setTestEmailResult('');
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ testEmail: settings.notification_email || 'an.huynht@gmail.com' }),
      });
      const data = await res.json();
      if (data.success) {
        setTestEmailResult('✅ Đã gửi email thử nghiệm thành công! Vui lòng kiểm tra hộp thư ' + (settings.notification_email || 'an.huynht@gmail.com'));
      } else {
        setTestEmailResult('❌ Lỗi: ' + data.error);
      }
    } catch (err) {
      setTestEmailResult('❌ Lỗi gửi email: ' + err.message);
    } finally {
      setTestEmailLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordChangeMsg({ type: 'error', text: 'Mật khẩu mới và xác nhận mật khẩu không khớp.' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordChangeMsg({ type: 'error', text: 'Mật khẩu mới phải có tối thiểu 8 ký tự.' });
      return;
    }
    setPasswordChangeLoading(true);
    setPasswordChangeMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Đổi mật khẩu thất bại.');
      setPasswordChangeMsg({ type: 'success', text: data.message || 'Cập nhật mật khẩu thành công!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordChangeMsg({ type: 'error', text: err.message });
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  // Filter logs by search
  const filteredLogs = matchLogs.filter(l => {
    const q = searchQuery.toLowerCase();
    return (
      (l.user_name && l.user_name.toLowerCase().includes(q)) ||
      (l.user_email && l.user_email.toLowerCase().includes(q)) ||
      (l.company_name && l.company_name.toLowerCase().includes(q)) ||
      (l.job_title && l.job_title.toLowerCase().includes(q))
    );
  });

  // Calculate quick stats
  const totalComparisons = matchLogs.length;
  const totalAppointments = appointments.length;
  const totalResumes = resumeRequests.length;
  const avgScore = totalComparisons > 0
    ? Math.round(matchLogs.reduce((acc, curr) => acc + (curr.match_score || 0), 0) / totalComparisons)
    : 0;

  // -------------------------------------------------------------
  // RENDER: LOGIN SCREEN (IF NOT AUTHENTICATED)
  // -------------------------------------------------------------
  if (!token) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex flex-col items-center justify-center p-4 relative font-roboto">
        <div className="w-full max-w-md bg-white border border-[#E7ECF3] rounded-[32px] p-8 shadow-card space-y-6 relative z-10">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#E0F6FA] border border-[#BCECF3] flex items-center justify-center text-[#009DAE] mx-auto shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="font-ubuntu text-2xl font-bold text-slate-900 tracking-tight">
              Executive Admin Portal
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Cổng quản trị dành riêng cho ông Huỳnh Thiên An
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-2xl bg-[#FFF1F4] border border-[#FFC8D3] text-[#FF4F6E] text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1.5">Email Quản Trị</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="an.huynht@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#009DAE] transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1.5">Mật Khẩu</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#009DAE] transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="btn-teal w-full py-3.5 rounded-full text-white font-bold text-sm shadow-card flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loginLoading ? <span>Đang đăng nhập...</span> : <span>Đăng Nhập Quản Trị</span>}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <Link href="/" className="text-xs font-bold font-ubuntu text-slate-500 hover:text-[#009DAE] transition-colors inline-flex items-center space-x-1">
              <span>← Trở về Trang Chủ Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FAFBFD] text-slate-800 flex flex-col font-roboto">
      {/* Admin Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#E7ECF3] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#009DAE] text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>

            <div>
              <div className="font-ubuntu text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span>Executive Management Portal</span>
                <span className="px-2 py-0.5 rounded-full bg-[#E0F6FA] text-[#009DAE] text-[10px] font-bold border border-[#BCECF3]">PostgreSQL</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium font-roboto">
                Huỳnh Thiên An ({user?.email})
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-slate-600 hover:text-[#009DAE] font-bold font-ubuntu transition-colors inline-flex items-center space-x-1"
            >
              <span>Xem Trang Chủ</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={fetchDashboardData}
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#009DAE] hover:border-[#009DAE] transition-all shadow-xs"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-[#009DAE]' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#FFF1F4] border border-[#FFC8D3] text-[#FF4F6E] hover:bg-[#FFE1E7] text-xs font-bold font-ubuntu transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đăng Xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* KPI Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-[#E7ECF3] shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-ubuntu text-slate-500 uppercase tracking-wider">Lượt So Sánh JD</span>
              <div className="w-8 h-8 rounded-full bg-[#E0F6FA] text-[#009DAE] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="font-ubuntu text-3xl font-extrabold text-slate-900 mt-2">{totalComparisons}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">Lưu trữ log đầy đủ</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E7ECF3] shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-ubuntu text-slate-500 uppercase tracking-wider">Lịch Hẹn Đặt</span>
              <div className="w-8 h-8 rounded-full bg-[#FFF4D6] text-[#FFAF00] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="font-ubuntu text-3xl font-extrabold text-slate-900 mt-2">{totalAppointments}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">Cuộc gặp online / offline</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E7ECF3] shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-ubuntu text-slate-500 uppercase tracking-wider">Yêu Cầu Tải CV</span>
              <div className="w-8 h-8 rounded-full bg-[#FFE1E7] text-[#FF4F6E] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="font-ubuntu text-3xl font-extrabold text-slate-900 mt-2">{totalResumes}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">Lượt quan tâm hồ sơ</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E7ECF3] shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-ubuntu text-slate-500 uppercase tracking-wider">Điểm Match TB</span>
              <div className="w-3 h-3 rounded-full bg-[#009DAE]" />
            </div>
            <div className="font-ubuntu text-3xl font-extrabold text-[#009DAE] mt-2">{avgScore}%</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">Độ phù hợp trung bình</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold font-ubuntu flex items-center space-x-2 transition-all ${
              activeTab === 'logs'
                ? 'btn-teal shadow-soft'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-[#009DAE]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Log So Sánh JD ({totalComparisons})</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold font-ubuntu flex items-center space-x-2 transition-all ${
              activeTab === 'appointments'
                ? 'btn-teal shadow-soft'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-[#009DAE]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Lịch Hẹn ({totalAppointments})</span>
          </button>

          <button
            onClick={() => setActiveTab('resumes')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold font-ubuntu flex items-center space-x-2 transition-all ${
              activeTab === 'resumes'
                ? 'btn-teal shadow-soft'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-[#009DAE]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Lượt Tải CV ({totalResumes})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_settings')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold font-ubuntu flex items-center space-x-2 transition-all ${
              activeTab === 'ai_settings'
                ? 'btn-teal shadow-soft'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-[#009DAE]'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Cấu Hình Google Cloud AI</span>
          </button>

          <button
            onClick={() => setActiveTab('email_settings')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold font-ubuntu flex items-center space-x-2 transition-all ${
              activeTab === 'email_settings'
                ? 'btn-teal shadow-soft'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-[#009DAE]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Cấu Hình Email Thông Báo</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold font-ubuntu flex items-center space-x-2 transition-all ${
              activeTab === 'security'
                ? 'btn-teal shadow-soft'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-[#009DAE]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Bảo Mật & Mật Khẩu</span>
          </button>
        </div>

        {/* ----------------- TAB 1: JD MATCH LOGS ----------------- */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            {/* Search & Stats Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên, email, công ty..."
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#009DAE] transition-all shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Hiển thị {filteredLogs.length} kết quả
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-[#E7ECF3] shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-[#FAFBFD] text-slate-600 font-bold font-ubuntu border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Thời Gian</th>
                      <th className="py-3 px-4">Nhà Tuyển Dụng</th>
                      <th className="py-3 px-4">Công Ty / Vị Trí</th>
                      <th className="py-3 px-4">File JD</th>
                      <th className="py-3 px-4 text-center">Điểm Match</th>
                      <th className="py-3 px-4 text-right">Chi Tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                          Chưa có lượt so sánh JD nào được ghi nhận.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#F0FBFD]/50 transition-colors">
                          <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-medium">
                            {new Date(log.created_at).toLocaleString('vi-VN')}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 font-ubuntu">
                            <div>{log.user_name}</div>
                            <div className="text-[11px] text-[#009DAE] font-normal font-roboto">
                              <a href={`mailto:${log.user_email}`} className="hover:underline">
                                {log.user_email}
                              </a>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-slate-900 font-bold font-ubuntu">{log.company_name || 'Chưa cung cấp'}</div>
                            <div className="text-[11px] text-slate-500 font-roboto">{log.job_title || 'N/A'}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate font-medium">
                            {log.jd_filename || 'Trực tiếp'}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full font-bold font-ubuntu text-xs ${
                              (log.match_score || 0) >= 85 
                                ? 'bg-[#E0F6FA] text-[#009DAE] border border-[#BCECF3]' 
                                : 'bg-[#FFF4D6] text-[#BF8300] border border-[#FFE7A8]'
                            }`}>
                              {log.match_score}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedLog(log)}
                              className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#009DAE] hover:border-[#009DAE] transition-colors inline-flex items-center space-x-1 font-bold font-ubuntu"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Xem</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: APPOINTMENTS ----------------- */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-[#E7ECF3] shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-[#FAFBFD] text-slate-600 font-bold font-ubuntu border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Ngày Đặt</th>
                      <th className="py-3 px-4">Người Đặt Hẹn</th>
                      <th className="py-3 px-4">Hình Thức & Khung Giờ</th>
                      <th className="py-3 px-4">Chủ Đề & Lời Nhắn</th>
                      <th className="py-3 px-4">Trạng Thái</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                          Chưa có lịch hẹn nào được ghi nhận.
                        </td>
                      </tr>
                    ) : (
                      appointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-[#F0FBFD]/50 transition-colors">
                          <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-medium">
                            {new Date(appt.created_at).toLocaleString('vi-VN')}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 font-ubuntu">
                            <div>{appt.name}</div>
                            <div className="text-[11px] text-[#009DAE] font-normal font-roboto">
                              <a href={`mailto:${appt.email}`} className="hover:underline">{appt.email}</a>
                            </div>
                            {appt.phone && <div className="text-[11px] text-slate-500">{appt.phone}</div>}
                            {appt.company && <div className="text-[11px] text-[#FFAF00] font-bold">{appt.company}</div>}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 font-ubuntu">
                              {appt.meeting_type === 'online' ? '🌐 Trực tuyến (Meet)' : '☕ Trực tiếp (TP.HCM)'}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {appt.preferred_date} ({appt.preferred_time})
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-bold text-slate-800">{appt.topic}</div>
                            {appt.notes && (
                              <div className="text-[11px] text-slate-500 italic mt-0.5 truncate font-roboto">
                                &quot;{appt.notes}&quot;
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={appt.status || 'pending'}
                              onChange={(e) => handleUpdateStatus(appt.id, e.target.value)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold font-ubuntu text-slate-800 focus:outline-none focus:border-[#009DAE] focus:bg-white"
                            >
                              <option value="pending">⏳ Chờ phản hồi</option>
                              <option value="confirmed">✅ Đã xác nhận</option>
                              <option value="completed">🎉 Đã hoàn thành</option>
                              <option value="cancelled">❌ Đã hủy</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <a
                              href={`mailto:${appt.email}?subject=Xác nhận lịch hẹn trao đổi với Huỳnh Thiên An`}
                              className="px-3 py-1.5 rounded-full bg-[#E0F6FA] text-[#009DAE] hover:bg-[#009DAE] hover:text-white border border-[#BCECF3] text-[11px] font-bold font-ubuntu transition-all inline-block"
                            >
                              Gửi Email
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: RESUME REQUESTS ----------------- */}
        {activeTab === 'resumes' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-[#E7ECF3] shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-[#FAFBFD] text-slate-600 font-bold font-ubuntu border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Thời Gian</th>
                      <th className="py-3 px-4">Họ và Tên</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Công Ty</th>
                      <th className="py-3 px-4">Chức Danh</th>
                      <th className="py-3 px-4">Mục Đích</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {resumeRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                          Chưa có lượt tải CV nào được ghi nhận.
                        </td>
                      </tr>
                    ) : (
                      resumeRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-[#F0FBFD]/50 transition-colors">
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-medium">
                            {new Date(req.created_at).toLocaleString('vi-VN')}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 font-ubuntu">{req.name}</td>
                          <td className="py-3 px-4 text-[#009DAE] font-bold">
                            <a href={`mailto:${req.email}`} className="hover:underline">{req.email}</a>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">{req.company || 'N/A'}</td>
                          <td className="py-3 px-4 text-slate-600">{req.role || 'N/A'}</td>
                          <td className="py-3 px-4 text-slate-500">{req.purpose || 'Tìm hiểu ứng viên'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: AI SETTINGS (GOOGLE CLOUD & GEMINI) ----------------- */}
        {activeTab === 'ai_settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7ECF3] shadow-card space-y-6 max-w-3xl">
            <div className="space-y-1">
              <h3 className="font-ubuntu text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#009DAE]" />
                <span>Cấu Hình Tích Hợp AI (Google Cloud Platform / Gemini)</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-roboto">
                Kết nối Google Cloud Platform (Gemini 1.5/2.0) tương tự module phân tích cuộc gọi Call Center, tối ưu hóa cho nhà tuyển dụng.
              </p>
            </div>

            {saveSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-[#E0F6FA] border border-[#BCECF3] text-[#009DAE] text-xs flex items-center space-x-2 font-ubuntu">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1.5">
                  Google Gemini / Vertex AI API Key
                </label>
                <input
                  type="text"
                  value={settings.gemini_api_key || ''}
                  onChange={(e) => setSettings({ ...settings, gemini_api_key: e.target.value })}
                  placeholder={settings.gemini_api_key_masked || 'Nhập Google AI Studio hoặc GCP API Key (AIzaSy...)'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-mono focus:bg-white focus:outline-none focus:border-[#009DAE]"
                />
                <p className="text-[11px] text-slate-500 mt-1 font-roboto">
                  Nếu chưa điền API Key, hệ thống tự động sử dụng bộ phân tích thông minh chuẩn ngữ nghĩa của anh An.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1.5">Model AI</label>
                  <select
                    value={settings.gemini_model || 'gemini-1.5-flash'}
                    onChange={(e) => setSettings({ ...settings, gemini_model: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-[#009DAE]"
                  >
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Tốc độ cao, tối ưu chi phí)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Lý luận sâu sắc, phân tích đa chiều)</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash (Thế hệ mới nhất)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1.5">GCP Project ID (tùy chọn)</label>
                  <input
                    type="text"
                    value={settings.gcp_project_id || ''}
                    onChange={(e) => setSettings({ ...settings, gcp_project_id: e.target.value })}
                    placeholder="VD: cs-callcenter-ai-prod"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#009DAE]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1.5">
                  Tùy Biến System Prompt So Sánh JD (Executive Matching Prompt)
                </label>
                <textarea
                  rows={6}
                  value={settings.custom_system_prompt || ''}
                  onChange={(e) => setSettings({ ...settings, custom_system_prompt: e.target.value })}
                  placeholder="Để trống để sử dụng System Prompt mặc định chuẩn C-Level đã được lập trình sẵn..."
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:bg-white focus:outline-none focus:border-[#009DAE] leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="btn-teal px-6 py-3 rounded-full font-bold text-xs sm:text-sm shadow-soft"
              >
                Lưu Cấu Hình AI
              </button>
            </form>
          </div>
        )}

        {/* ----------------- TAB 5: EMAIL SETTINGS & NOTIFICATIONS ----------------- */}
        {activeTab === 'email_settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7ECF3] shadow-card space-y-6 max-w-3xl">
            <div className="space-y-1">
              <h3 className="font-ubuntu text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Mail className="w-5 h-5 text-[#009DAE]" />
                <span>Cấu Hình Email Thông Báo Tự Động</span>
              </h3>
              <p className="text-xs text-slate-500 font-roboto">
                Gửi thông báo tức thì về email <span className="text-[#009DAE] font-bold">an.huynht@gmail.com</span> khi có đối tác đặt lịch hoặc phân tích JD.
              </p>
            </div>

            {saveSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-[#E0F6FA] border border-[#BCECF3] text-[#009DAE] text-xs flex items-center space-x-2 font-ubuntu">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1.5">
                  Email Nhận Thông Báo
                </label>
                <input
                  type="email"
                  value={settings.notification_email || 'an.huynht@gmail.com'}
                  onChange={(e) => setSettings({ ...settings, notification_email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#009DAE]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1.5">SMTP Server Host</label>
                  <input
                    type="text"
                    value={settings.smtp_host || 'smtp.gmail.com'}
                    onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
                    placeholder="smtp.gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#009DAE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1.5">SMTP Port</label>
                  <input
                    type="number"
                    value={settings.smtp_port || 465}
                    onChange={(e) => setSettings({ ...settings, smtp_port: parseInt(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#009DAE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1.5">SMTP User / Email Gửi</label>
                  <input
                    type="text"
                    value={settings.smtp_user || ''}
                    onChange={(e) => setSettings({ ...settings, smtp_user: e.target.value })}
                    placeholder="your-email@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#009DAE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1.5">SMTP Password / App Password</label>
                  <input
                    type="password"
                    value={settings.smtp_pass || ''}
                    onChange={(e) => setSettings({ ...settings, smtp_pass: e.target.value })}
                    placeholder={settings.smtp_pass_masked || 'Mật khẩu ứng dụng 16 ký tự'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#009DAE]"
                  />
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="text-xs font-bold font-ubuntu text-slate-700">Tùy Chọn Bật/Tắt Thông Báo:</div>
                <div className="flex flex-wrap gap-5 text-xs text-slate-700 font-roboto">
                  <label className="flex items-center space-x-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={settings.notify_on_booking !== false}
                      onChange={(e) => setSettings({ ...settings, notify_on_booking: e.target.checked })}
                      className="rounded text-[#009DAE] focus:ring-[#009DAE] h-4 w-4"
                    />
                    <span>Thông báo khi có Lịch Hẹn mới</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={settings.notify_on_matching !== false}
                      onChange={(e) => setSettings({ ...settings, notify_on_matching: e.target.checked })}
                      className="rounded text-[#009DAE] focus:ring-[#009DAE] h-4 w-4"
                    />
                    <span>Thông báo khi có So Sánh JD</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="btn-teal px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-soft"
                >
                  Lưu Cấu Hình Email
                </button>

                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={testEmailLoading}
                  className="px-4 py-2.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold font-ubuntu text-slate-700 flex items-center space-x-2 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-[#009DAE]" />
                  <span>{testEmailLoading ? 'Đang gửi...' : 'Gửi Thử Email Thông Báo'}</span>
                </button>
              </div>

              {testEmailResult && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800">
                  {testEmailResult}
                </div>
              )}
            </form>
          </div>
        )}

        {/* ----------------- TAB 6: SECURITY & CHANGE PASSWORD ----------------- */}
        {activeTab === 'security' && (
          <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-[#E7ECF3] shadow-card space-y-6">
            <div>
              <h2 className="font-ubuntu text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Lock className="w-5 h-5 text-[#009DAE]" />
                <span>Bảo Mật Tài Khoản & Đổi Mật Khẩu</span>
              </h2>
              <p className="text-xs text-slate-500 font-roboto mt-1">
                Quản lý thông tin đăng nhập và cập nhật mật khẩu bảo vệ Cổng Quản Trị C-Level.
              </p>
            </div>

            {/* Account Info Pill */}
            <div className="bg-[#FAFBFD] p-4 rounded-2xl border border-[#E7ECF3] space-y-2">
              <div className="text-xs font-bold font-ubuntu text-slate-700">Tài Khoản Quản Trị:</div>
              <div className="flex items-center justify-between text-xs text-slate-600 font-roboto">
                <span>Email: <strong className="text-slate-900">{user?.email || 'an.huynht@gmail.com'}</strong></span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E0F6FA] text-[#009DAE] font-bold text-[11px]">System Owner</span>
              </div>
            </div>

            {passwordChangeMsg.text && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-center space-x-2 ${
                  passwordChangeMsg.type === 'success'
                    ? 'bg-[#EBFBF7] border border-[#B3F2DF] text-[#059669]'
                    : 'bg-[#FFF1F4] border border-[#FFC8D3] text-[#FF4F6E]'
                }`}
              >
                {passwordChangeMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{passwordChangeMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 font-roboto">
              <div>
                <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1.5">
                  Mật Khẩu Hiện Tại <span className="text-[#FF4F6E]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-[#009DAE] transition-all"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1.5">
                  Mật Khẩu Mới <span className="text-[#FF4F6E]">*</span> (Tối thiểu 8 ký tự)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-[#009DAE] transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1.5">
                  Xác Nhận Mật Khẩu Mới <span className="text-[#FF4F6E]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-[#009DAE] transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordChangeLoading}
                  className="btn-teal px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-soft flex items-center space-x-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{passwordChangeLoading ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* ----------------- MODAL: VIEW FULL JD MATCH LOG DETAIL ----------------- */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-roboto">
          <div className="relative w-full max-w-3xl bg-white border border-[#E7ECF3] rounded-[32px] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#E0F6FA] text-[#009DAE] text-xs font-bold font-ubuntu border border-[#BCECF3]">
                  Match Score: {selectedLog.match_score}%
                </span>
                <h3 className="font-ubuntu text-xl font-bold text-slate-900 mt-2">
                  Chi Tiết So Sánh JD: {selectedLog.user_name}
                </h3>
                <div className="text-xs text-slate-400 font-medium font-roboto">
                  {new Date(selectedLog.created_at).toLocaleString('vi-VN')} • IP: {selectedLog.ip_address}
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Recruiter Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-medium">Email:</span>{' '}
                <a href={`mailto:${selectedLog.user_email}`} className="text-[#009DAE] font-bold hover:underline">{selectedLog.user_email}</a>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Công ty:</span>{' '}
                <span className="text-slate-900 font-bold">{selectedLog.company_name || 'Chưa cung cấp'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Vị trí:</span>{' '}
                <span className="text-slate-900 font-bold">{selectedLog.job_title || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Tên file:</span>{' '}
                <span className="text-slate-700 font-mono">{selectedLog.jd_filename}</span>
              </div>
            </div>

            {/* AI Summary */}
            {selectedLog.ai_result?.summary && (
              <div className="p-4 rounded-2xl bg-[#E0F6FA]/60 border border-[#BCECF3] text-xs sm:text-sm text-slate-800 leading-relaxed font-roboto">
                <strong className="text-[#009DAE] block mb-1 font-bold font-ubuntu">Tóm Tắt Đánh Giá AI:</strong>
                {selectedLog.ai_result.summary}
              </div>
            )}

            {/* JD Summary */}
            {selectedLog.ai_result?.jdSummary && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold font-ubuntu text-[#009DAE] uppercase tracking-wider text-[11px]">Tóm Tắt Bản Mô Tả Công Việc (JD):</div>
                {selectedLog.ai_result.jdSummary.coreObjective && (
                  <p className="text-slate-700"><strong className="text-slate-900 font-bold">Mục tiêu:</strong> {selectedLog.ai_result.jdSummary.coreObjective}</p>
                )}
                {selectedLog.ai_result.jdSummary.keyResponsibilities && (
                  <div className="pt-1">
                    <strong className="text-slate-700 block mb-1 font-bold font-ubuntu">Trách nhiệm chính:</strong>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 font-roboto">
                      {selectedLog.ai_result.jdSummary.keyResponsibilities.map((r, ri) => (
                        <li key={ri}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Detailed Matching Matrix Table */}
            {selectedLog.ai_result?.matchingMatrix && selectedLog.ai_result.matchingMatrix.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold font-ubuntu text-[#009DAE] uppercase tracking-wider">
                  Bảng So Khớp Yêu Cầu & Luận Điểm Năng Lực Ứng Viên:
                </div>
                <div className="overflow-x-auto border border-[#E7ECF3] rounded-2xl">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-[#009DAE] text-white font-bold font-ubuntu">
                      <tr>
                        <th className="py-2.5 px-3">Yêu Cầu JD</th>
                        <th className="py-2.5 px-2 text-center">Tương Thích</th>
                        <th className="py-2.5 px-3">Luận Điểm Trong Hồ Sơ Anh An</th>
                        <th className="py-2.5 px-3">Giá Trị Doanh Nghiệp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedLog.ai_result.matchingMatrix.map((item, mi) => (
                        <tr key={mi} className="align-top hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-900 font-ubuntu">
                            <div>{item.dimension || item.requirement}</div>
                            <div className="text-[11px] text-slate-500 font-normal font-roboto">{item.requirement}</div>
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold text-[#009DAE] font-ubuntu">
                            {item.fitLevel || `${item.fitScore}%`}
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-700 leading-relaxed font-roboto">
                            {item.profileEvidence}
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-500 italic font-roboto">
                            {item.businessValue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4 Pillars */}
            {selectedLog.ai_result?.pillars && (
              <div className="space-y-2">
                <div className="text-xs font-bold font-ubuntu text-slate-700 uppercase tracking-wider">Đánh Giá Theo Trụ Cột:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-roboto">
                  {selectedLog.ai_result.pillars.map((p, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex justify-between font-bold font-ubuntu text-slate-900 mb-1">
                        <span>{p.name}</span>
                        <span className="text-[#009DAE]">{p.score}%</span>
                      </div>
                      <p className="text-[11px] text-slate-600">{p.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* JD Text */}
            <div className="space-y-1">
              <div className="text-xs font-bold font-ubuntu text-slate-700 uppercase tracking-wider">Nội Dung JD Đã Upload:</div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-h-48 overflow-y-auto text-xs text-slate-600 whitespace-pre-wrap font-mono">
                {selectedLog.jd_text}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <a
                href={`mailto:${selectedLog.user_email}?subject=Trao đổi cơ hội hợp tác cho vị trí ${selectedLog.job_title || 'C-Level'}`}
                className="btn-teal px-5 py-2.5 rounded-full text-white text-xs font-bold shadow-soft"
              >
                Gửi Email Cho Nhà Tuyển Dụng
              </a>
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-ubuntu transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
