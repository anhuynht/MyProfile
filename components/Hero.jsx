'use client';

import React from 'react';
import { Sparkles, Calendar, FileText, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import LinkedInIcon from './LinkedInIcon';
import { profileData } from '@/lib/profileData';

export default function Hero({ lang, onOpenJD, onOpenBooking, onOpenResume }) {
  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Background Decorative Geometric Shapes (matching the reference design) */}
      <div className="absolute top-12 left-10 w-24 h-24 rounded-full bg-[#FFAF00]/10 blur-xl pointer-events-none" />
      <div className="absolute top-40 right-20 w-36 h-36 rounded-full bg-[#009DAE]/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-48 h-48 rounded-full bg-[#FF4F6E]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Pitch */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline "Hello, I'm..." in Vibrant Coral Pink */}
            <div className="flex items-center justify-center lg:justify-start space-x-2">
              <span className="font-ubuntu text-base sm:text-lg font-bold text-[#FF4F6E] tracking-wide">
                {lang === 'vi' ? '👋 Xin chào, tôi là Huỳnh Thiên An' : '👋 Hello, I\'m Huynh Thien An'}
              </span>
              <span className="hidden sm:inline-block w-8 h-0.5 bg-[#FF4F6E]/60 rounded-full"></span>
            </div>

            {/* Main Headline in Ubuntu Bold */}
            <div className="space-y-2">
              <h1 className="font-ubuntu text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                {lang === 'vi' ? (
                  <>
                    Giám Đốc CNTT & <br />
                    <span className="text-[#009DAE]">Lãnh Đạo AI Doanh Nghiệp</span>
                  </>
                ) : (
                  <>
                    Chief Information Officer & <br />
                    <span className="text-[#009DAE]">Enterprise AI Executive</span>
                  </>
                )}
              </h1>
              <p className="font-ubuntu text-lg sm:text-xl font-bold text-[#FFAF00]">
                {lang === 'vi' ? '20+ Năm Kiến Tạo Chuyển Đổi Số & Quản Trị Hệ Thống Cốt Lõi' : '20+ Years Strategic Tech Leadership, Core Modernization & AI'}
              </p>
            </div>

            {/* Value Proposition */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0 font-roboto">
              {lang === 'vi' ? profileData.executiveSummary.vi : profileData.executiveSummary.en}
            </p>

            {/* Primary Action Buttons (matching Nancy's "Hire Me Now" style) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              {/* Pill Button with Pink Arrow Box */}
              <button
                onClick={onOpenJD}
                className="btn-hire-pill"
              >
                <span className="btn-hire-icon shadow-sm">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
                <span className="pr-1">
                  {lang === 'vi' ? 'Phân Tích Matching JD với AI' : 'Match My Profile with JD'}
                </span>
              </button>

              {/* Teal Pill Button */}
              <button
                onClick={onOpenBooking}
                className="btn-teal px-5 py-3 rounded-full text-xs sm:text-sm font-bold flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{lang === 'vi' ? 'Đặt Lịch Trao Đổi' : 'Book Strategic Call'}</span>
              </button>

              {/* Gold Pill Button */}
              <button
                onClick={onOpenResume}
                className="px-4 py-3 rounded-full border border-slate-300 hover:border-[#FFAF00] hover:text-[#FFAF00] bg-white text-slate-700 text-xs sm:text-sm font-bold font-ubuntu flex items-center space-x-2 transition-all shadow-xs"
              >
                <FileText className="w-4 h-4 text-[#FFAF00]" />
                <span>{lang === 'vi' ? 'Tải CV PDF' : 'Request CV'}</span>
              </button>
            </div>

            {/* Social & Contact Icons row (with colorful circles) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-[#009DAE] text-[#009DAE] hover:bg-[#009DAE] hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="LinkedIn Profile"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${profileData.email}`}
                className="w-9 h-9 rounded-full border border-[#FF4F6E] text-[#FF4F6E] hover:bg-[#FF4F6E] hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="Email Huỳnh Thiên An"
              >
                <Mail className="w-4 h-4" />
              </a>

              <a
                href={`tel:${profileData.phone}`}
                className="w-9 h-9 rounded-full border border-[#FFAF00] text-[#FFAF00] hover:bg-[#FFAF00] hover:text-white flex items-center justify-center transition-colors shadow-xs"
                title="Số điện thoại"
              >
                <Phone className="w-4 h-4" />
              </a>

              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#009DAE]" />
                <span>{lang === 'vi' ? profileData.locationVi : profileData.location}</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {profileData.stats.map((stat, i) => {
                const accentColors = ['#009DAE', '#FFAF00', '#FF4F6E', '#009DAE'];
                return (
                  <div key={i} className="glass-card rounded-2xl p-4 text-center">
                    <div className="font-ubuntu text-2xl sm:text-3xl font-extrabold" style={{ color: accentColors[i % 4] }}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-1">
                      {lang === 'vi' ? stat.labelVi : stat.labelEn}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Clean Executive Circular Portrait without borders or AI tags */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl bg-white group">
              <img
                src="/profile.png"
                alt="Huỳnh Thiên An - IT Director & CIO"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
