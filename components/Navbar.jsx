'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar } from 'lucide-react';

export default function Navbar({ lang, setLang, onOpenJD, onOpenBooking }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E7ECF3] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#009DAE] p-0.5 shadow-sm">
            <img src="/profile.png" alt="Huỳnh Thiên An" className="w-full h-full object-cover object-top rounded-full" />
          </div>

          <div>
            <div className="font-ubuntu text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-[#009DAE] transition-colors">
              <span>{lang === 'vi' ? 'Huỳnh Thiên An' : 'Huynh Thien An'}</span>
            </div>
            <div className="text-[11px] font-bold text-[#009DAE] tracking-wider uppercase font-ubuntu">
              IT Director & CIO | Enterprise AI
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-ubuntu font-medium text-slate-600">
          <a href="#about" className="hover:text-[#009DAE] transition-colors">{lang === 'vi' ? 'Giới Thiệu' : 'About'}</a>
          <a href="#capabilities" className="hover:text-[#009DAE] transition-colors">{lang === 'vi' ? 'Năng Lực' : 'Capabilities'}</a>
          <a href="#experience" className="hover:text-[#009DAE] transition-colors">{lang === 'vi' ? 'Sự Nghiệp' : 'Experience'}</a>
          <a href="#education" className="hover:text-[#009DAE] transition-colors">{lang === 'vi' ? 'Học Vấn' : 'Education'}</a>
          <a href="#tech" className="hover:text-[#009DAE] transition-colors">{lang === 'vi' ? 'Công Nghệ' : 'Tech Stack'}</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Flag-only Language Toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-full border border-slate-200">
            <button
              onClick={() => setLang('en')}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all ${
                lang === 'en' ? 'bg-white shadow-xs font-bold' : 'opacity-50 hover:opacity-100'
              }`}
              title="English"
            >
              🇬🇧
            </button>
            <button
              onClick={() => setLang('vi')}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all ${
                lang === 'vi' ? 'bg-white shadow-xs font-bold' : 'opacity-50 hover:opacity-100'
              }`}
              title="Tiếng Việt"
            >
              🇻🇳
            </button>
          </div>

          {/* AI Matching Button (Teal Pill Button like "Let's talk" in image) */}
          <button
            onClick={onOpenJD}
            className="hidden sm:flex items-center space-x-2 px-5 py-2.5 rounded-full btn-teal text-xs tracking-wide shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Phân Tích JD Với AI' : 'Let\'s Match JD'}</span>
          </button>

          {/* Book Appointment Button */}
          <button
            onClick={onOpenBooking}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:border-[#FFAF00] hover:text-[#FFAF00] text-slate-700 text-xs font-bold font-ubuntu transition-all shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-[#FFAF00]" />
            <span className="hidden sm:inline">{lang === 'vi' ? 'Đặt Lịch' : 'Book Call'}</span>
          </button>


        </div>
      </div>
    </header>
  );
}
