'use client';

import React, { useState } from 'react';
import { Building2, Calendar, MapPin, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { profileData } from '@/lib/profileData';

export default function ExperienceTimeline({ lang }) {
  const [expandedIndices, setExpandedIndices] = useState([0, 1]);

  const toggleExpand = (index) => {
    setExpandedIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <section id="experience" className="py-16 md:py-24 border-t border-[#E7ECF3] bg-[#FAFBFD] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <h2 className="font-ubuntu text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'vi' ? 'Hơn 20 Năm Dẫn Dắt Đổi Mới Công Nghệ' : 'Over 20 Years Leading Enterprise Technology'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-roboto">
            {lang === 'vi'
              ? 'Kinh nghiệm sâu rộng tại các tập đoàn bảo hiểm nhân thọ & phi nhân thọ, tổ chức giáo dục quốc tế, bệnh viện và dịch vụ doanh nghiệp.'
              : 'Proven executive delivery across regulated life insurance, multi-country education, healthcare, and enterprise platforms.'}
          </p>
        </div>

        {/* Timeline List */}
        <div className="relative border-l-2 border-[#009DAE]/30 ml-4 md:ml-32 space-y-8">
          {profileData.experiences.map((exp, idx) => {
            const isExpanded = expandedIndices.includes(idx);
            const isCurrent = idx === 0;

            return (
              <div key={idx} className="relative pl-8 md:pl-10 group">
                
                {/* Timeline Node Dot */}
                <div className={`absolute -left-[9px] top-6 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  isCurrent 
                    ? 'bg-[#009DAE] border-[#E0F6FA] shadow-teal-glow scale-125' 
                    : 'bg-white border-[#FFAF00] group-hover:border-[#009DAE]'
                }`} />

                {/* Date on desktop floated left */}
                <div className="hidden md:block absolute -left-36 top-5 w-28 text-right text-xs font-bold font-ubuntu text-slate-500">
                  {lang === 'vi' ? exp.periodVi : exp.period}
                </div>

                {/* Experience Card */}
                <div className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all duration-300 shadow-card ${
                  isCurrent ? 'border-[#009DAE]/50' : 'border-[#E7ECF3] hover:border-[#009DAE]/40'
                }`}>
                  
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center space-x-2.5">
                        <span className="font-ubuntu text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#009DAE] transition-colors">
                          {lang === 'vi' ? exp.roleVi : exp.roleEn}
                        </span>
                        {isCurrent && (
                          <span className="px-3 py-1 rounded-full bg-[#E0F6FA] border border-[#BCECF3] text-[#009DAE] text-[10px] font-extrabold font-ubuntu uppercase tracking-wider">
                            {lang === 'vi' ? 'Hiện tại' : 'Current'}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 mt-1.5 font-ubuntu">
                        <span className="text-[#009DAE] font-bold flex items-center space-x-1.5">
                          <Building2 className="w-4 h-4 text-[#009DAE]" />
                          <span>{lang === 'vi' ? exp.companyVi : exp.companyEn}</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 flex items-center space-x-1 font-normal font-roboto">
                          <MapPin className="w-3.5 h-3.5 text-[#FFAF00]" />
                          <span>{exp.location}</span>
                        </span>
                      </div>
                    </div>

                    {/* Mobile Period & Toggle Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                      <div className="md:hidden text-xs font-semibold text-slate-500 flex items-center space-x-1 font-ubuntu">
                        <Calendar className="w-3.5 h-3.5 text-[#009DAE]" />
                        <span>{lang === 'vi' ? exp.periodVi : exp.period}</span>
                      </div>

                      <button
                        onClick={() => toggleExpand(idx)}
                        className="px-3.5 py-1.5 rounded-full bg-[#F0FBFD] hover:bg-[#E0F6FA] border border-[#BCECF3] text-xs font-bold font-ubuntu text-[#009DAE] flex items-center space-x-1.5 transition-colors"
                      >
                        <span>{isExpanded ? (lang === 'vi' ? 'Thu gọn' : 'Collapse') : (lang === 'vi' ? 'Chi tiết' : 'Details')}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  {isExpanded && (
                    <div className="mt-5 space-y-3 pt-1">
                      {(lang === 'vi' ? exp.highlightsVi : exp.highlightsEn).map((item, hIdx) => (
                        <div key={hIdx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-roboto">
                          <CheckCircle className="w-4 h-4 text-[#009DAE] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
