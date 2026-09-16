'use client';

import React from 'react';
import { Mail, Phone, MapPin, ArrowUp, Send, ArrowRight } from 'lucide-react';
import LinkedInIcon from './LinkedInIcon';
import { profileData } from '@/lib/profileData';

export default function Footer({ lang, onOpenBooking, onOpenJD }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-20">
      
      {/* 1. Floating Top CTA Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-20 -mb-20">
        <div className="bg-white rounded-[28px] p-6 sm:p-10 border border-[#E7ECF3] shadow-card-hover text-center space-y-4">
          <h3 className="font-ubuntu text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900">
            {lang === 'vi' 
              ? <>Bạn cần trao đổi về cơ hội C-Level hay dự án Chuyển Đổi Số?</> 
              : <>Looking for Strategic IT Leadership or Advisory?</>}
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm font-roboto max-w-xl mx-auto">
            {lang === 'vi' 
              ? 'Liên hệ trực tiếp qua số hotline +84 934 771 264 hoặc đặt lịch gặp trực tiếp / trực tuyến để thảo luận chi tiết.' 
              : 'Reach out directly at +84 934 771 264 or schedule an executive consultation.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenBooking}
              className="btn-teal px-6 py-3 rounded-full text-xs sm:text-sm font-bold flex items-center space-x-2"
            >
              <span>{lang === 'vi' ? 'Đặt Lịch Trao Đổi Ngay' : 'Book Strategic Meeting'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenJD}
              className="btn-pink px-6 py-3 rounded-full text-xs sm:text-sm font-bold flex items-center space-x-2"
            >
              <span>{lang === 'vi' ? 'So Khớp JD Bằng AI' : 'Run AI JD Matcher'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Rich Deep Teal Footer Block */}
      <div className="bg-[#009DAE] text-white pt-32 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/20">
            
            {/* Col 1: Brand & Logo */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/40 p-0.5 shadow-sm">
                  <img src="/profile.png" alt="Huỳnh Thiên An" className="w-full h-full object-cover object-top rounded-full" />
                </div>
                <div className="font-ubuntu text-xl font-bold text-white tracking-tight">
                  {lang === 'vi' ? 'Huỳnh Thiên An' : 'Huynh Thien An'}
                </div>
              </div>

              <p className="font-ubuntu text-xs font-bold text-[#FFAF00] uppercase tracking-wider">
                {lang === 'vi' ? profileData.titleVi : profileData.title}
              </p>

              <p className="text-white/85 text-xs leading-relaxed max-w-md font-roboto italic">
                &ldquo;{lang === 'vi'
                  ? 'Chuyển đổi số thành công phụ thuộc vào con người, quy trình, năng lực lãnh đạo và sự thực thi kỷ luật cũng như công nghệ. Tôi xây dựng các kiến trúc tin cậy, có khả năng mở rộng nhằm trao quyền cho các đội ngũ kinh doanh và mở khóa lợi thế cạnh tranh bền vững.'
                  : 'Successful digital transformation depends as much on people, processes, leadership, and disciplined execution as it does on technology. I build scalable, trusted architectures that empower business teams and unlock sustainable competitive advantage.'}&rdquo;
              </p>

              {/* Social Round Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <a
                  href={profileData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#009DAE] flex items-center justify-center transition-all"
                  title="LinkedIn"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${profileData.email}`}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#009DAE] flex items-center justify-center transition-all"
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href={`tel:${profileData.phone}`}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#009DAE] flex items-center justify-center transition-all"
                  title="Phone"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="md:col-span-3 space-y-3 font-ubuntu">
              <div className="text-white font-bold text-xs uppercase tracking-wider pb-1">
                {lang === 'vi' ? 'Danh Mục' : 'Navigation'}
              </div>
              <ul className="space-y-2 text-xs text-white/80">
                <li><a href="#about" className="hover:text-[#FFAF00] transition-colors">{lang === 'vi' ? 'Tiểu Sử & Triết Lý' : 'Biography'}</a></li>
                <li><a href="#capabilities" className="hover:text-[#FFAF00] transition-colors">{lang === 'vi' ? 'Năng Lực Trọng Tâm' : 'Capabilities'}</a></li>
                <li><a href="#experience" className="hover:text-[#FFAF00] transition-colors">{lang === 'vi' ? 'Quá Trình Sự Nghiệp' : 'Experience Timeline'}</a></li>
                <li><a href="#education" className="hover:text-[#FFAF00] transition-colors">{lang === 'vi' ? 'Học Vấn & Bằng Cấp' : 'Education & Degrees'}</a></li>
                <li><a href="#tech" className="hover:text-[#FFAF00] transition-colors">{lang === 'vi' ? 'Hệ Sinh Thái Tech Stack' : 'Tech Stack Cloud'}</a></li>
              </ul>
            </div>

            {/* Col 3: Direct Contact & Admin */}
            <div className="md:col-span-4 space-y-3 font-roboto">
              <div className="text-white font-bold text-xs font-ubuntu uppercase tracking-wider pb-1">
                {lang === 'vi' ? 'Thông Tin Liên Hệ' : 'Direct Contact'}
              </div>

              <div className="space-y-2 text-xs text-white/85">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#FFAF00] shrink-0" />
                  <a href={`mailto:${profileData.email}`} className="hover:text-[#FFAF00] transition-colors">
                    {profileData.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#FFAF00] shrink-0" />
                  <a href={`tel:${profileData.phone}`} className="hover:text-[#FFAF00] transition-colors">
                    {profileData.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#FFAF00] shrink-0" />
                  <span>{profileData.location}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/70 gap-2 font-roboto">
            <div>
              © {new Date().getFullYear()} {lang === 'vi' ? 'Huỳnh Thiên An' : 'Huynh Thien An'}. All rights reserved.
            </div>
            
            <button
              onClick={scrollToTop}
              className="inline-flex items-center space-x-1 text-white hover:text-[#FFAF00] transition-colors font-semibold font-ubuntu"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Về đầu trang' : 'Back to top'}</span>
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
