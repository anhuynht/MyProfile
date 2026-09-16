'use client';

import React from 'react';
import { Bot, Layers, Network, ShieldCheck, BarChart3, Briefcase, ChevronRight, Sparkles } from 'lucide-react';
import { profileData } from '@/lib/profileData';

const iconMap = [Bot, Layers, Network, ShieldCheck, BarChart3, Briefcase];
const circleStyles = [
  'icon-circle-pink',
  'icon-circle-gold',
  'icon-circle-teal',
  'icon-circle-pink',
  'icon-circle-gold',
  'icon-circle-teal',
];

export default function CoreCapabilities({ lang, onOpenJD }) {
  return (
    <section id="capabilities" className="py-16 md:py-24 border-t border-[#E7ECF3] relative bg-[#FAFBFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <h2 className="font-ubuntu text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'vi' ? 'Giải Quyết Các Bài Toán Công Nghệ Cấp Cao' : 'I Provide A Wide Range Of Executive Tech Capabilities'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-roboto">
            {lang === 'vi'
              ? 'Sự kết hợp hoàn hảo giữa tầm nhìn chiến lược kinh doanh của một CIO và năng lực kiến trúc kỹ thuật công nghệ sâu sắc.'
              : 'The strategic combination of executive business acumen and deep enterprise architectural mastery.'}
          </p>
        </div>

        {/* 6 Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profileData.coreCapabilities.map((cap, index) => {
            const IconComponent = iconMap[index % iconMap.length];
            const circleClass = circleStyles[index % circleStyles.length];

            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-7 border border-[#E7ECF3] shadow-card hover:shadow-card-hover transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Round colorful icon badge like Nancy's Mockup */}
                  <div className={`w-14 h-14 rounded-full ${circleClass} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="font-ubuntu text-lg font-bold text-slate-900 group-hover:text-[#009DAE] transition-colors">
                    {lang === 'vi' ? cap.titleVi : cap.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-roboto">
                    {lang === 'vi' ? cap.descVi : cap.descEn}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold font-ubuntu text-slate-400 group-hover:text-[#009DAE] transition-colors">
                  <span>{lang === 'vi' ? 'Xem kinh nghiệm thực tế' : 'Verified in Track Record'}</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Prompt Banner */}
        <div className="mt-14 p-7 sm:p-8 rounded-3xl bg-white border-2 border-[#E7ECF3] text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
          <div className="text-left space-y-1">
            <h4 className="font-ubuntu text-base sm:text-xl font-bold text-slate-900">
              {lang === 'vi' ? 'Bạn đang tìm kiếm lãnh đạo công nghệ với các tiêu chuẩn trên?' : 'Find Out If My Profile Matches Your Job Description'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 font-roboto">
              {lang === 'vi' ? 'Tải lên file JD của bạn để AI phân tích mức độ tương thích và trích xuất bảng so khớp chi tiết.' : 'Upload your JD to run an immediate AI assessment with detailed matching matrix.'}
            </p>
          </div>
          
          <button
            onClick={onOpenJD}
            className="btn-teal px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold shrink-0 flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'vi' ? 'Phân Tích Với JD Của Bạn' : 'Match With Your JD'}</span>
          </button>
        </div>

      </div>
    </section>
  );
}
