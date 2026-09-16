'use client';

import React from 'react';
import { GraduationCap, Award, ShieldCheck } from 'lucide-react';
import { profileData } from '@/lib/profileData';

export default function EducationCerts({ lang }) {
  return (
    <section id="education" className="py-16 md:py-24 border-t border-[#E7ECF3] bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <h2 className="font-ubuntu text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'vi' ? 'Nền Tảng Học Thuật & Quản Trị Vững Chắc' : 'Rigorous Academic & Executive Degrees'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-roboto">
            {lang === 'vi'
              ? 'Tốt nghiệp từ các trường đại học danh tiếng tại Thụy Sĩ và Vương quốc Anh cùng hệ thống chứng chỉ chuyên môn quốc tế.'
              : 'Degrees from top European institutions paired with world-class agile, cloud, and digital transformation certifications.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Degrees (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-ubuntu text-xl font-bold text-slate-900 flex items-center space-x-2.5">
              <GraduationCap className="w-6 h-6 text-[#009DAE]" />
              <span>{lang === 'vi' ? 'Bằng Cấp & Học Vị' : 'Academic Degrees'}</span>
            </h3>

            <div className="space-y-4">
              {profileData.education.map((edu, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-[#E7ECF3] shadow-card hover:border-[#009DAE]/40 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h4 className="font-ubuntu text-base sm:text-lg font-bold text-slate-900">
                        {lang === 'vi' ? edu.degreeVi : edu.degreeEn}
                      </h4>
                      <p className="text-xs sm:text-sm font-bold font-ubuntu text-[#009DAE] mt-1">
                        {edu.institution}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 font-roboto">
                        {edu.field}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="px-3 py-1 rounded-full bg-[#E0F6FA] border border-[#BCECF3] text-xs font-bold font-ubuntu text-[#009DAE]">
                        {edu.year}
                      </span>
                    </div>
                  </div>

                  {(edu.honorsVi || edu.honorsEn) && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2 text-xs font-bold font-ubuntu text-[#FFAF00]">
                      <Award className="w-4 h-4 text-[#FFAF00] shrink-0" />
                      <span>{lang === 'vi' ? edu.honorsVi : edu.honorsEn}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications (Right 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-ubuntu text-xl font-bold text-slate-900 flex items-center space-x-2.5">
              <ShieldCheck className="w-6 h-6 text-[#FF4F6E]" />
              <span>{lang === 'vi' ? 'Chứng Chỉ Chuyên Môn' : 'Professional Certifications'}</span>
            </h3>

            <div className="bg-white rounded-3xl p-6 border border-[#E7ECF3] shadow-card space-y-3.5">
              {profileData.certifications.map((cert, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#FAFBFD] border border-slate-100 flex items-start space-x-3.5 hover:bg-[#FFF0F3] hover:border-[#FFC8D3] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#009DAE] text-white flex items-center justify-center font-bold font-ubuntu text-xs shrink-0 mt-0.5 shadow-sm">
                    {cert.badge}
                  </div>
                  <div>
                    <div className="font-ubuntu text-sm font-bold text-slate-900 leading-snug">{cert.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium font-roboto">{cert.issuer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
