'use client';

import React from 'react';
import { Cpu, Server, Shield, Layers, Database, Sparkles } from 'lucide-react';
import { profileData } from '@/lib/profileData';

const catIcons = {
  0: Sparkles,
  1: Server,
  2: Shield,
  3: Layers,
  4: Database,
  5: Cpu
};

const badgeColors = [
  'bg-[#E0F6FA] text-[#009DAE]',
  'bg-[#FFF4D6] text-[#FFAF00]',
  'bg-[#FFE1E7] text-[#FF4F6E]',
  'bg-[#E0F6FA] text-[#009DAE]',
  'bg-[#FFF4D6] text-[#FFAF00]',
  'bg-[#FFE1E7] text-[#FF4F6E]',
];

export default function TechStackCloud({ lang }) {
  return (
    <section id="tech" className="py-16 md:py-24 border-t border-[#E7ECF3] bg-[#FAFBFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <h2 className="font-ubuntu text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'vi' ? 'Công Nghệ, Nền Tảng & Chuẩn Mực Quản Trị' : 'Platforms, Architectures & Governance'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-roboto">
            {lang === 'vi'
              ? 'Tập hợp các giải pháp công nghệ doanh nghiệp đã được triển khai, tích hợp và vận hành thực tế qua các dự án lớn.'
              : 'Enterprise-grade technologies and platforms orchestrated across high-scale implementations.'}
          </p>
        </div>

        {/* Tech Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profileData.techStack.map((group, idx) => {
            const Icon = catIcons[idx] || Cpu;
            const badgeColor = badgeColors[idx % badgeColors.length];

            return (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-[#E7ECF3] shadow-card hover:border-[#009DAE]/40 transition-all">
                <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
                  <div className={`w-10 h-10 rounded-xl ${badgeColor} flex items-center justify-center font-bold`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-ubuntu text-base font-bold text-slate-900">{group.category}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.items.map((item, iIdx) => (
                    <span
                      key={iIdx}
                      className="px-3 py-1.5 rounded-full bg-[#FAFBFD] border border-slate-200 text-xs font-semibold text-slate-700 hover:border-[#009DAE] hover:text-[#009DAE] transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
