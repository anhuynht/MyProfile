'use client';

import React, { useState, useRef } from 'react';
import { X, Sparkles, UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Calendar, HelpCircle, BarChart2 } from 'lucide-react';

export default function JDMatcherModal({ isOpen, onClose, onOpenBooking }) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jdText, setJdText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputTab, setInputTab] = useState('upload'); // 'upload' | 'text'

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingStep, setLoadingStep] = useState(1);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage('');
    }
  };

  const handleRunMatch = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!userName.trim() || !userEmail.trim()) {
      setErrorMessage('Vui lòng nhập Họ Tên và Email để hệ thống ghi nhận và gửi kết quả.');
      return;
    }

    if (inputTab === 'upload' && !selectedFile) {
      setErrorMessage('Vui lòng chọn file JD (.pdf, .docx, .txt) hoặc chuyển qua tab Nhập Văn Bản.');
      return;
    }

    if (inputTab === 'text' && (!jdText || jdText.trim().length < 40)) {
      setErrorMessage('Vui lòng dán nội dung mô tả công việc (ít nhất 40 ký tự) để AI có thể phân tích.');
      return;
    }

    setIsLoading(true);
    setLoadingStep(1);

    const timer1 = setTimeout(() => setLoadingStep(2), 1200);
    const timer2 = setTimeout(() => setLoadingStep(3), 2800);

    try {
      const formData = new FormData();
      formData.append('userName', userName);
      formData.append('userEmail', userEmail);
      formData.append('companyName', companyName);
      formData.append('jobTitle', jobTitle);

      if (inputTab === 'upload' && selectedFile) {
        formData.append('jdFile', selectedFile);
      } else {
        formData.append('jdText', jdText);
      }

      const res = await fetch('/api/match-jd', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi khi phân tích JD.');
      }

      setAnalysisResult(data.analysis);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setSelectedFile(null);
    setJdText('');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-[#E7ECF3] rounded-[32px] shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#F0FBFD] via-white to-[#FFF0F3] p-6 border-b border-[#E7ECF3] flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#009DAE] text-white shadow-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-ubuntu text-lg font-bold text-slate-900">
                AI Candidate Matcher & Fit Analysis
              </h3>
              <p className="text-xs text-slate-500 font-roboto">
                Đối chiếu Job Description với hồ sơ năng lực của ông Huỳnh Thiên An
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

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          
          {/* STATE 1: Input Form */}
          {!isLoading && !analysisResult && (
            <form onSubmit={handleRunMatch} className="space-y-6">
              
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-[#FFF1F4] border border-[#FFC8D3] text-[#FF4F6E] text-xs sm:text-sm flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Recruiter Information */}
              <div>
                <div className="font-ubuntu text-xs font-bold text-[#FF4F6E] uppercase tracking-wider mb-3">
                  1. Thông Tin Nhà Tuyển Dụng / Doanh Nghiệp
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 font-ubuntu">
                      Họ và tên của bạn <span className="text-[#FF4F6E]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="VD: Nguyễn Văn A (Headhunter / Talent Lead)"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white transition-all font-roboto"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 font-ubuntu">
                      Email nhận báo cáo <span className="text-[#FF4F6E]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="email@company.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white transition-all font-roboto"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 font-ubuntu">
                      Tên công ty / Tập đoàn
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="VD: Tập đoàn Bảo hiểm X, Fintech Corp, v.v."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white transition-all font-roboto"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 font-ubuntu">
                      Chức danh tuyển dụng
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="VD: Chief Information Officer / Head of AI & IT"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white transition-all font-roboto"
                    />
                  </div>
                </div>
              </div>

              {/* JD Input Mode Tabs */}
              <div>
                <div className="font-ubuntu text-xs font-bold text-[#FF4F6E] uppercase tracking-wider mb-3">
                  2. Cung Cấp Bản Mô Tả Công Việc (Job Description)
                </div>

                <div className="flex space-x-2 border-b border-slate-100 pb-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setInputTab('upload')}
                    className={`px-4 py-2 rounded-full text-xs font-bold font-ubuntu flex items-center space-x-2 transition-all ${
                      inputTab === 'upload' 
                        ? 'bg-[#E0F6FA] text-[#009DAE] border border-[#BCECF3]' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload File JD (PDF / Word / Docx)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInputTab('text')}
                    className={`px-4 py-2 rounded-full text-xs font-bold font-ubuntu flex items-center space-x-2 transition-all ${
                      inputTab === 'text' 
                        ? 'bg-[#E0F6FA] text-[#009DAE] border border-[#BCECF3]' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Dán Nội Dung Trực Tiếp</span>
                  </button>
                </div>

                {inputTab === 'upload' ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-[#009DAE] rounded-3xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-[#F0FBFD] transition-all group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <UploadCloud className="w-12 h-12 mx-auto text-[#009DAE] group-hover:scale-110 transition-transform mb-3" />
                    
                    {selectedFile ? (
                      <div className="space-y-1">
                        <div className="text-sm font-bold font-ubuntu text-slate-900 flex items-center justify-center space-x-2">
                          <FileText className="w-4 h-4 text-[#009DAE]" />
                          <span>{selectedFile.name}</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {(selectedFile.size / 1024).toFixed(1)} KB — Bấm để chọn file khác
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-sm font-bold font-ubuntu text-slate-800">
                          Kéo thả file JD vào đây hoặc bấm để duyệt file
                        </div>
                        <div className="text-xs text-slate-500">
                          Hỗ trợ định dạng PDF, DOCX, DOC, TXT (Tối đa 15MB)
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <textarea
                      rows={7}
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      placeholder="Dán toàn bộ nội dung yêu cầu công việc (Job Description) vào đây... (Yêu cầu chuyên môn, kinh nghiệm, trách nhiệm quản trị, nền tảng công nghệ, v.v.)"
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#009DAE] focus:bg-white leading-relaxed font-roboto"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-teal w-full py-4 rounded-2xl text-sm sm:text-base font-bold flex items-center justify-center space-x-2 shadow-md"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Bắt Đầu Phân Tích Matching Với AI</span>
                </button>
                <div className="text-center text-[11px] text-slate-500 mt-2 font-medium font-roboto">
                  Dữ liệu phân tích được lưu trữ an toàn trên hệ thống và gửi thông báo trực tiếp đến anh Huỳnh Thiên An.
                </div>
              </div>

            </form>
          )}

          {/* STATE 2: Loading State */}
          {isLoading && (
            <div className="py-16 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#009DAE] animate-spin" />
                <Sparkles className="w-8 h-8 text-[#009DAE] absolute inset-0 m-auto animate-pulse" />
              </div>

              <div className="space-y-2">
                <h4 className="font-ubuntu text-lg font-bold text-slate-900">
                  {loadingStep === 1 && 'Đang trích xuất và đọc hiểu nội dung JD...'}
                  {loadingStep === 2 && 'Đang đối chiếu với hồ sơ CIO & Enterprise AI của anh An...'}
                  {loadingStep === 3 && 'Đang tổng hợp báo cáo đánh giá & gợi ý câu hỏi phỏng vấn...'}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto font-roboto">
                  Mô hình AI đang phân tích toàn diện 20+ năm kinh nghiệm, các dự án Core Platform, AI/LLMs và quản trị PDPL để tạo đánh giá chuẩn xác nhất.
                </p>
              </div>

              {/* Step indicator */}
              <div className="flex justify-center items-center space-x-3 text-xs text-slate-500 font-bold font-ubuntu">
                <span className={loadingStep >= 1 ? 'text-[#009DAE]' : ''}>1. Trích xuất JD</span>
                <span>•</span>
                <span className={loadingStep >= 2 ? 'text-[#009DAE]' : ''}>2. So khớp năng lực</span>
                <span>•</span>
                <span className={loadingStep >= 3 ? 'text-[#009DAE]' : ''}>3. Khuyến nghị tuyển dụng</span>
              </div>
            </div>
          )}

          {/* STATE 3: Analysis Results */}
          {!isLoading && analysisResult && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Top Score Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#E0F6FA] via-white to-[#FFF0F3] border border-[#BCECF3] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="text-center sm:text-left space-y-2">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E0F6FA] text-[#009DAE] border border-[#BCECF3] text-xs font-bold font-ubuntu">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đánh Giá Mức Độ Tương Thích: Rất Cao</span>
                  </div>
                  <h3 className="font-ubuntu text-xl sm:text-2xl font-bold text-slate-900">
                    Kết Quả Đánh Giá Ứng Viên: Huỳnh Thiên An
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 max-w-xl leading-relaxed font-roboto">
                    {analysisResult.summary}
                  </p>
                </div>

                {/* Score Dial */}
                <div className="relative shrink-0 flex flex-col items-center">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#009DAE] flex items-center justify-center bg-white shadow-soft relative">
                    <div className="text-center">
                      <div className="font-ubuntu text-3xl sm:text-4xl font-extrabold text-[#009DAE]">
                        {analysisResult.matchScore}%
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold font-ubuntu">
                        Match Score
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. Tóm Tắt Nội Dung JD */}
              {analysisResult.jdSummary && (
                <div className="bg-white rounded-3xl p-6 border border-[#E7ECF3] shadow-card space-y-4">
                  <div className="flex items-center space-x-2 text-sm font-bold font-ubuntu text-[#009DAE] uppercase tracking-wider">
                    <FileText className="w-4 h-4 text-[#009DAE]" />
                    <span>Tóm Tắt Bản Mô Tả Công Việc (JD Overview)</span>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm font-roboto">
                    {analysisResult.jdSummary.coreObjective && (
                      <div className="p-4 rounded-2xl bg-[#F0FBFD] border border-[#BCECF3]">
                        <strong className="text-slate-900 block mb-1 font-ubuntu">Mục tiêu chiến lược của vị trí:</strong>
                        <p className="text-slate-700 leading-relaxed">{analysisResult.jdSummary.coreObjective}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {analysisResult.jdSummary.keyResponsibilities && analysisResult.jdSummary.keyResponsibilities.length > 0 && (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <strong className="text-slate-900 text-xs font-ubuntu uppercase tracking-wider block font-bold">Trách Nhiệm Trọng Tâm:</strong>
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {analysisResult.jdSummary.keyResponsibilities.map((resp, rIdx) => (
                              <li key={rIdx} className="flex items-start space-x-2">
                                <span className="text-[#009DAE] mt-0.5 font-bold">•</span>
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysisResult.jdSummary.mustHaveRequirements && analysisResult.jdSummary.mustHaveRequirements.length > 0 && (
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <strong className="text-slate-900 text-xs font-ubuntu uppercase tracking-wider block font-bold">Yêu Cầu Cốt Lõi:</strong>
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {analysisResult.jdSummary.mustHaveRequirements.map((req, qIdx) => (
                              <li key={qIdx} className="flex items-start space-x-2">
                                <span className="text-[#FF4F6E] mt-0.5 font-bold">•</span>
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Bảng Phân Tích So Khớp Chi Tiết (Matching Matrix Table) */}
              {analysisResult.matchingMatrix && analysisResult.matchingMatrix.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold font-ubuntu text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                      <BarChart2 className="w-4 h-4 text-[#009DAE]" />
                      <span>Bảng Phân Tích So Khớp Yêu Cầu & Luận Điểm Năng Lực Ứng Viên</span>
                    </h4>
                    <span className="text-xs font-bold font-ubuntu text-[#009DAE] bg-[#E0F6FA] px-2.5 py-1 rounded-full border border-[#BCECF3]">
                      {analysisResult.matchingMatrix.length} khía cạnh đối chiếu
                    </span>
                  </div>

                  <div className="bg-white rounded-3xl border border-[#E7ECF3] overflow-hidden shadow-card">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-[#009DAE] text-white font-bold font-ubuntu uppercase tracking-wider">
                          <tr>
                            <th className="py-3.5 px-4 w-1/4">Yêu Cầu Trong JD</th>
                            <th className="py-3.5 px-3 text-center w-28">Độ Tương Thích</th>
                            <th className="py-3.5 px-4 w-5/12">Luận Điểm & Bằng Chứng Trong Hồ Sơ Anh An</th>
                            <th className="py-3.5 px-4 w-1/4">Giá Trị Cho Doanh Nghiệp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {analysisResult.matchingMatrix.map((item, mIdx) => (
                            <tr key={mIdx} className="hover:bg-slate-50/80 transition-colors align-top">
                              <td className="py-4 px-4 space-y-1.5">
                                <div className="font-bold font-ubuntu text-slate-900 text-xs sm:text-sm">
                                  {item.dimension || `Yêu cầu #${mIdx + 1}`}
                                </div>
                                <div className="text-slate-600 text-xs leading-relaxed font-roboto">
                                  {item.requirement}
                                </div>
                                {item.importance && (
                                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFF0F3] text-[10px] font-bold font-ubuntu text-[#FF4F6E]">
                                    {item.importance}
                                  </span>
                                )}
                              </td>

                              <td className="py-4 px-3 text-center space-y-1">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-ubuntu ${
                                  (item.fitScore || 90) >= 95
                                    ? 'bg-[#E0F6FA] text-[#009DAE] border border-[#BCECF3]'
                                    : 'bg-[#FFF4D6] text-[#FFAF00] border border-[#FFE7A8]'
                                }`}>
                                  {item.fitLevel || `${item.fitScore}%`}
                                </span>
                                {item.fitScore && (
                                  <div className="w-16 mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mt-1">
                                    <div
                                      className="h-full bg-[#009DAE] rounded-full"
                                      style={{ width: `${item.fitScore}%` }}
                                    />
                                  </div>
                                )}
                              </td>

                              <td className="py-4 px-4 text-slate-800 text-xs leading-relaxed font-roboto">
                                <p className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-medium">
                                  {item.profileEvidence}
                                </p>
                              </td>

                              <td className="py-4 px-4 text-slate-600 text-xs leading-relaxed italic font-roboto">
                                {item.businessValue}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. 4 Pillars Breakdown */}
              <div>
                <h4 className="text-sm font-bold font-ubuntu text-slate-900 uppercase tracking-wider mb-4 flex items-center space-x-2">
                  <BarChart2 className="w-4 h-4 text-[#009DAE]" />
                  <span>Đánh Giá Chi Tiết Theo 4 Trụ Cột Năng Lực</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResult.pillars?.map((pillar, pIdx) => (
                    <div key={pIdx} className="bg-white rounded-2xl p-5 border border-[#E7ECF3] space-y-2 shadow-card">
                      <div className="flex items-center justify-between text-sm font-bold font-ubuntu text-slate-900">
                        <span>{pillar.name}</span>
                        <span className="text-[#009DAE]">{pillar.score}%</span>
                      </div>
                      {/* Bar */}
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-[#009DAE] to-[#FFAF00] rounded-full"
                          style={{ width: `${pillar.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1 font-roboto">
                        {pillar.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Strengths & Synergies */}
              <div className="bg-white rounded-3xl p-6 border border-[#E7ECF3] shadow-card space-y-3">
                <h4 className="text-sm font-bold font-ubuntu text-[#009DAE] uppercase tracking-wider flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#009DAE]" />
                  <span>Điểm Mạnh Vượt Trội Cho Vị Trí Này (Key Synergies)</span>
                </h4>
                <div className="space-y-2.5 font-roboto">
                  {analysisResult.keyStrengths?.map((str, sIdx) => (
                    <div key={sIdx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-[#009DAE] shrink-0 mt-1.5" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Alignment Points */}
              {analysisResult.pointsForDiscussion && analysisResult.pointsForDiscussion.length > 0 && (
                <div className="bg-[#FFF8E6] rounded-3xl p-6 border border-[#FFE7A8] space-y-3">
                  <h4 className="text-sm font-bold font-ubuntu text-[#FFAF00] uppercase tracking-wider flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-[#FFAF00]" />
                    <span>Điểm Cần Trao Đổi Thêm Với Ứng Viên</span>
                  </h4>
                  <div className="space-y-2 font-roboto">
                    {analysisResult.pointsForDiscussion.map((pt, ptIdx) => (
                      <div key={ptIdx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700">
                        <div className="w-2 h-2 rounded-full bg-[#FFAF00] shrink-0 mt-1.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Interview Questions */}
              {analysisResult.recommendedInterviewQuestions && (
                <div className="p-6 rounded-3xl bg-[#F0FBFD] border border-[#BCECF3] space-y-3">
                  <h4 className="text-sm font-bold font-ubuntu text-[#009DAE] uppercase tracking-wider flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-[#009DAE]" />
                    <span>Gợi Ý Câu Hỏi Phỏng Vấn Dành Cho Ban Giám Đốc / Hội Đồng Tuyển Dụng</span>
                  </h4>
                  <div className="space-y-3">
                    {analysisResult.recommendedInterviewQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="p-4 rounded-2xl bg-white border border-[#BCECF3] text-xs sm:text-sm text-slate-800 font-medium italic shadow-2xs font-roboto">
                        {q}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-3 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold font-ubuntu transition-colors"
                >
                  Thực Hiện Phân Tích Với JD Khác
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenBooking();
                  }}
                  className="btn-teal w-full sm:w-auto px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Đặt Lịch Phỏng Vấn / Trao Đổi Với Anh An</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
