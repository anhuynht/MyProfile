'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ExecutiveBio from '@/components/ExecutiveBio';
import CoreCapabilities from '@/components/CoreCapabilities';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import EducationCerts from '@/components/EducationCerts';
import TechStackCloud from '@/components/TechStackCloud';
import Footer from '@/components/Footer';
import JDMatcherModal from '@/components/JDMatcherModal';
import BookingModal from '@/components/BookingModal';
import ResumeRequestModal from '@/components/ResumeRequestModal';

export default function HomePage() {
  const [lang, setLang] = useState('en'); // 'en' (default) | 'vi'
  const [isJDOpen, setIsJDOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFD] text-slate-800 font-roboto selection:bg-[#009DAE]/20 selection:text-[#009DAE]">
      {/* Navigation */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onOpenJD={() => setIsJDOpen(true)}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        <Hero
          lang={lang}
          onOpenJD={() => setIsJDOpen(true)}
          onOpenBooking={() => setIsBookingOpen(true)}
          onOpenResume={() => setIsResumeOpen(true)}
        />
        
        <ExecutiveBio lang={lang} />

        <CoreCapabilities
          lang={lang}
          onOpenJD={() => setIsJDOpen(true)}
        />

        <ExperienceTimeline lang={lang} />

        <EducationCerts lang={lang} />

        <TechStackCloud lang={lang} />
      </main>

      {/* Footer */}
      <Footer 
        lang={lang}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenJD={() => setIsJDOpen(true)}
      />

      {/* Modals */}
      <JDMatcherModal
        isOpen={isJDOpen}
        onClose={() => setIsJDOpen(false)}
        lang={lang}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        lang={lang}
      />

      <ResumeRequestModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        lang={lang}
      />
    </div>
  );
}
