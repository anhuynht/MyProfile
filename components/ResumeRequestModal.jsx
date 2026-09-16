'use client';

import React, { useState } from 'react';
import { X, FileDown, CheckCircle, Download, Loader2 } from 'lucide-react';

export default function ResumeRequestModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [purpose, setPurpose] = useState('Tìm hiểu ứng viên cho vị trí C-Level');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleDownloadDirect = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (name || email) {
        await fetch('/api/resume-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name || 'Ẩn danh', email: email || 'Chưa cung cấp', company, role, purpose }),
        });
      }

      window.location.href = '/api/download-resume';
      setIsDone(true);
    } catch (err) {
      console.error(err);
      window.location.href = '/api/download-resume';
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-[#E7ECF3] rounded-[32px] shadow-2xl overflow-hidden my-6 font-roboto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFF8E6] via-white to-[#F0FBFD] p-6 border-b border-[#E7ECF3] flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FFAF00] text-slate-950 shadow-sm flex items-center justify-center">
              <FileDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-ubuntu text-lg font-bold text-slate-900">
                Tải Hồ Sơ Huỳnh Thiên An (Executive CV)
              </h3>
              <p className="text-xs text-slate-500 font-roboto">
                Bản cập nhật mới nhất năm 2026
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
        <div className="p-6 sm:p-8">
          {isDone ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E0F6FA] text-[#009DAE] flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-ubuntu text-lg font-bold text-slate-900">File Hồ Sơ Đang Được Tải Về!</h4>
                <p className="text-xs text-slate-600">
                  Cảm ơn bạn đã quan tâm đến hồ sơ của ông Huỳnh Thiên An.
                </p>
              </div>
              <button
                onClick={onClose}
                className="btn-teal px-6 py-2.5 rounded-full text-xs font-bold"
              >
                Đóng
              </button>
            </div>
          ) : (
            <form onSubmit={handleDownloadDirect} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Vui lòng để lại thông tin để hệ thống ghi nhận lượt tải hồ sơ và hỗ trợ liên hệ khi có cơ hội phù hợp:
              </p>

              <div>
                <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1">Họ và Tên</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Họ tên của bạn"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@company.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1">Công ty / Tổ chức</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Tên đơn vị"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-ubuntu text-slate-700 mb-1">Chức danh</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="VD: HRD / Recruiter"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center space-x-2 shadow-md"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-slate-900" />
                      <span>Tải Hồ Sơ Ngay (Executive CV)</span>
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
