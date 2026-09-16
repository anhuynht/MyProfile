'use client';

import React from 'react';
import { Target, Users, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react';
import { profileData } from '@/lib/profileData';

export default function ExecutiveBio({ lang }) {
  return (
    <section id="about" className="py-16 md:py-24 border-t border-[#E7ECF3] bg-[#FAFBFD] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <h2 className="font-ubuntu text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'vi' ? 'Kiến Tạo Hệ Sinh Thái Công Nghệ Đáng Tin Cậy' : 'Building Trusted, High-Performance Technology Ecosystems'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-roboto">
            {lang === 'vi' 
              ? 'Hơn hai thập kỷ dẫn dắt chiến lược công nghệ, hiện đại hóa hệ thống lõi và chuyển đổi số quy mô lớn.' 
              : 'Over two decades driving enterprise technology agendas, core PAS modernizations, and scalable AI adoption across regulated industries.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Full Biography Narrative */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-9 border border-[#E7ECF3] shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base font-roboto">
              <div className="flex items-center space-x-2.5 pb-1">
                <span className="w-3 h-3 rounded-full bg-[#009DAE]" />
                <h3 className="font-ubuntu text-xl font-bold text-slate-900">
                  {lang === 'vi' ? 'Hành Trình Chuyên Nghiệp' : 'Executive Profile & Background'}
                </h3>
              </div>

              <p>
                {lang === 'vi' ? (
                  <>
                    Ông <strong className="text-slate-900">Huỳnh Thiên An</strong> hiện là <strong className="text-[#009DAE]">Giám đốc Công nghệ Thông tin (IT Director & CIO)</strong> tại Công ty TNHH Bảo hiểm Nhân thọ Mirae Asset Prévoir (MAP Life). Ông chịu trách nhiệm hoạch định toàn diện chiến lược công nghệ, dẫn dắt chương trình chuyển đổi số quy mô lớn và thúc đẩy ứng dụng Trí tuệ Nhân tạo (AI) nhằm xây dựng doanh nghiệp bảo hiểm số lấy khách hàng làm trọng tâm.
                  </>
                ) : (
                  <>
                    Mr. <strong className="text-slate-900">Huynh Thien An</strong> currently serves as <strong className="text-[#009DAE]">IT Director & CIO</strong> at Mirae Asset Prévoir Life Insurance (MAP Life), steering the complete technology agenda, enterprise architecture, and AI-driven growth for a regulated financial services institution.
                  </>
                )}
              </p>

              <p>
                {lang === 'vi' ? (
                  <>
                    Với hơn <strong className="text-slate-900">20 năm kinh nghiệm thực chiến</strong>, ông đã từng đảm nhiệm các vị trí lãnh đạo công nghệ chủ chốt tại các tổ chức hàng đầu như: <em>Head of Applications tại XCL Education Group</em> (khu vực Đông Nam Á), <em>IT Deputy Director tại Hệ thống Trường Quốc tế Việt Úc (VAS)</em>, <em>IT Director tại Tổng Công ty Cổ phần Bảo hiểm Toàn Cầu (GIC)</em>, <em>IT Manager tại Bệnh viện Quốc tế City (CIH)</em>, và <em>Application Head tại Great Eastern Life Vietnam</em>.
                  </>
                ) : (
                  <>
                    With over <strong className="text-slate-900">20 years of hands-on leadership</strong>, he previously held senior positions across Southeast Asia, including <em>Head of Applications at XCL Education Group</em>, <em>IT Deputy Director at Vietnam Australia International School (VAS)</em>, <em>IT Director at Global Insurance Corporation (GIC)</em>, <em>IT Manager at City International Hospital (CIH)</em>, and <em>Application Head at Great Eastern Life Vietnam</em>.
                  </>
                )}
              </p>

              <p>
                {lang === 'vi' ? (
                  <>
                    Ông tốt nghiệp <strong className="text-slate-900">Thạc sĩ Quản trị Kinh doanh (MBA)</strong> hạng <strong className="text-[#FFAF00]">Xuất sắc (Cum Laude - Top 5)</strong> từ Đại học UBIS (Thụy Sĩ), <strong className="text-slate-900">Cử nhân Khoa học Hệ thống Thông tin & Quản trị</strong> từ <strong className="text-slate-900">Đại học London (Anh Quốc)</strong>, cùng các chứng chỉ quốc tế uy tín về Quản lý Dự án (PSM I, IO4PM, SFC) và Chuyển đổi Số từ University of Virginia Darden School of Business.
                  </>
                ) : (
                  <>
                    He holds a <strong className="text-slate-900">Master of Business Administration (MBA)</strong> graduated with <strong className="text-[#FFAF00]">Cum Laude (Top 5 Distinction)</strong> from UBIS (Geneva, Switzerland), a <strong className="text-slate-900">BSc in Information Systems and Management</strong> from the <strong className="text-slate-900">University of London (UK)</strong>, and professional certifications including PSM I and Digital Transformation from UVA Darden School of Business.
                  </>
                )}
              </p>

              {/* Progress / Competency Bar like Nancy's Mockup */}
              <div className="pt-2 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold font-ubuntu text-slate-800">
                  <span>{lang === 'vi' ? 'Năng Lực Lãnh Đạo Chiến Lược & Chuyển Đổi Số' : 'Strategic Leadership & Digital Transformation'}</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FF4F6E] text-white text-[10px]">98%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF4F6E] rounded-full w-[98%]" />
                </div>
              </div>
            </div>

            {/* Quote Block with Teal Left Accent */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F0FBFD] border-l-4 border-[#009DAE] text-slate-800 text-xs sm:text-sm font-medium italic leading-relaxed">
              &quot;{lang === 'vi' ? profileData.leadershipPhilosophy.vi : profileData.leadershipPhilosophy.en}&quot;
            </div>
          </div>

          {/* Right Column: 4 Strategic Pillars with Colorful Circle Badges */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Pillar 1: AI (Teal) */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E7ECF3] shadow-card hover:border-[#009DAE] transition-all">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl icon-circle-teal flex items-center justify-center shrink-0">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-ubuntu text-base font-bold text-slate-900 mb-1">
                    {lang === 'vi' ? 'Edge AI Trong Bảo Hiểm Nhân Thọ & AI Thực Chiến' : 'Edge AI for Life Insurance & Pragmatic AI'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-roboto">
                    {lang === 'vi' 
                      ? 'Tiên phong triển khai kiến trúc Edge AI On-premise cho bảo hiểm nhân thọ, trợ lý AI tư vấn, phân tích giọng nói cuộc gọi thời gian thực và mô hình LLM tại biên bảo mật tuyệt đối, không rò rỉ dữ liệu nhạy cảm theo chuẩn PDPL.' 
                      : 'Pioneering on-premise Edge AI architectures in life insurance: real-time voice analytics for call centers, agency sales copilot, and local-first LLMs ensuring zero data leakage under strict PDPL.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 2: Core Modernization (Gold) */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E7ECF3] shadow-card hover:border-[#FFAF00] transition-all">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl icon-circle-gold flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-ubuntu text-base font-bold text-slate-900 mb-1">
                    {lang === 'vi' ? 'Hiện Đại Hóa Nền Tảng Lõi & Kiến Trúc Tích Hợp' : 'Core Modernization & Scalable Integration'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-roboto">
                    {lang === 'vi'
                      ? 'Năng lực thẩm định, chuyển đổi và tích hợp các nền tảng phức tạp (Life Asia, Wynsure, DXC, Oracle Fusion Cloud, SAP, NetSuite, Salesforce).'
                      : 'Extensive track record evaluating and modernizing complex core insurance PAS estates, enterprise ERP, and cloud integration ecosystems.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3: Cybersecurity & PDPL (Pink) */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E7ECF3] shadow-card hover:border-[#FF4F6E] transition-all">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl icon-circle-pink flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-ubuntu text-base font-bold text-slate-900 mb-1">
                    {lang === 'vi' ? 'An Toàn Thông Tin & Tuân Thủ Pháp Lý (PDPL)' : 'Cybersecurity, Risk & Compliance'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-roboto">
                    {lang === 'vi'
                      ? 'Thiết kế an ninh Zero Trust với Microsoft Defender & FortiGate, bảo vệ dữ liệu theo Luật An ninh mạng & Nghị định 13/PDPL, sẵn sàng kiểm toán quốc tế.'
                      : 'Zero Trust architecture via Defender and FortiGate, compliance with Vietnam Cybersecurity Law and PDPL, ready for stringent global audits.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 4: Boardroom & People (Teal) */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E7ECF3] shadow-card hover:border-[#009DAE] transition-all">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl icon-circle-teal flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-ubuntu text-base font-bold text-slate-900 mb-1">
                    {lang === 'vi' ? 'Lãnh Đạo Đội Ngũ & Đồng Hành Cùng HĐQT' : 'Boardroom Alignment & People Leadership'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-roboto">
                    {lang === 'vi'
                      ? 'Gắn kết mục tiêu công nghệ với chiến lược kinh doanh của HĐQT, tối ưu chi phí CAPEX/OPEX, và xây dựng văn hóa công nghệ linh hoạt, trao quyền.'
                      : 'Bridging boardroom business vision with agile IT delivery, multi-million-dollar budgeting, vendor governance, and developing high-performing teams.'}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
