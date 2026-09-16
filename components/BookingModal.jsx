'use client';

import React, { useState } from 'react';
import { X, Calendar, Video, Coffee, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function BookingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    meetingType: 'online',
    topic: 'Trao đổi cơ hội C-Level (CIO / Head of IT)',
    preferredDate: '',
    preferredTime: '10:00 - 11:00',
    notes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMsg('Vui lòng nhập Họ Tên và Email để liên hệ.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi đặt lịch.');
      }

      setIsSuccess(true);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-[#E7ECF3] rounded-[32px] shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F0FBFD] via-white to-[#FFF0F3] p-6 border-b border-[#E7ECF3] flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#009DAE] text-white shadow-sm flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-ubuntu text-lg font-bold text-slate-900">
                Đặt Lịch Trao Đổi Cấp Cao
              </h3>
              <p className="text-xs text-slate-500 font-roboto">
                Gặp gỡ trực tuyến hoặc trực tiếp với ông Huỳnh Thiên An
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 font-roboto">
          {isSuccess ? (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#E0F6FA] border border-[#BCECF3] text-[#009DAE] flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-ubuntu text-xl font-bold text-slate-900">Đặt Lịch Thành Công!</h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thông tin lịch hẹn đã được gửi trực tiếp đến email của anh Huỳnh Thiên An (<span className="text-[#009DAE] font-bold">an.huynht@gmail.com</span>). Anh An sẽ phản hồi sớm nhất để xác nhận thời gian chi tiết.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="btn-teal px-6 py-3 rounded-full font-bold text-xs sm:text-sm shadow-sm"
                >
                  Hoàn Tất & Đóng
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-[#FFF1F4] border border-[#FFC8D3] text-[#FF4F6E] text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Meeting Type */}
              <div>
                <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-2">Hình Thức Gặp Gỡ</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, meetingType: 'online' })}
                    className={`p-3.5 rounded-2xl border text-xs font-bold font-ubuntu flex items-center justify-center space-x-2 transition-all ${
                      formData.meetingType === 'online'
                        ? 'bg-[#E0F6FA] border-[#009DAE] text-[#009DAE] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Trực Tuyến (Meet/Teams)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, meetingType: 'offline' })}
                    className={`p-3.5 rounded-2xl border text-xs font-bold font-ubuntu flex items-center justify-center space-x-2 transition-all ${
                      formData.meetingType === 'offline'
                        ? 'bg-[#FFF4D6] border-[#FFAF00] text-[#BF8300] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Coffee className="w-4 h-4" />
                    <span>Gặp Trực Tiếp (TP.HCM)</span>
                  </button>
                </div>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1.5">Chủ Đề Trao Đổi</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white"
                >
                  <option value="Trao đổi cơ hội C-Level (CIO / Head of IT / AI Director)">Trao đổi cơ hội C-Level (CIO / Head of IT / AI Director)</option>
                  <option value="Tư vấn chiến lược Enterprise AI & RAG">Tư vấn chiến lược Enterprise AI & RAG</option>
                  <option value="Tư vấn hiện đại hóa Core Platform & Chuyển đổi số">Tư vấn hiện đại hóa Core Platform & Chuyển đổi số</option>
                  <option value="Giao lưu chuyên môn & Mở rộng kết nối (Networking)">Giao lưu chuyên môn & Mở rộng kết nối (Networking)</option>
                </select>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1">
                    Họ và Tên <span className="text-[#FF4F6E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1">
                    Email liên hệ <span className="text-[#FF4F6E]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1">Công ty / Tổ chức</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Tên công ty"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1">Ngày đề xuất</label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1">Khung giờ phù hợp</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white"
                  >
                    <option value="09:00 - 10:00">09:00 - 10:00 (Sáng)</option>
                    <option value="10:00 - 11:00">10:00 - 11:00 (Sáng)</option>
                    <option value="14:00 - 15:00">14:00 - 15:00 (Chiều)</option>
                    <option value="15:30 - 16:30">15:30 - 16:30 (Chiều)</option>
                    <option value="17:00 - 18:00">17:00 - 18:00 (Cuối ngày)</option>
                    <option value="Linh hoạt">Linh hoạt theo lịch anh An</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1">Lời nhắn thêm (tùy chọn)</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Nội dung cần trao đổi trước, liên kết JD hoặc bối cảnh cuộc gặp..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-teal w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50 shadow-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Đang Gửi Lịch Hẹn...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 text-white" />
                      <span>Xác Nhận Đặt Lịch Hẹn</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
