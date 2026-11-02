import React, { useState, useRef } from 'react';
import { 
  Award, BookOpen, GraduationCap, Building, Building2, Phone, Mail, MapPin, 
  User, Stethoscope, BadgeCheck, Calendar, ChevronRight, Image, 
  Send, MessageSquare, Shield, HelpCircle, HeartPulse, Sparkles, Check,
  FileText, Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { programmesList, facultyMembers, galleryItems } from './data';
import { AdmissionFormSubmission } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import AdmissionsForm from './components/AdmissionsForm';
import Portal from './components/Portal';
import OrganogramHierarchy from './components/Organogram';
import BridgeAiChat, { ChatRole } from './components/BridgeAiChat';
import SpaceRental from './components/SpaceRental';
import CareersPage from './components/CareersPage';
import AdminDashboard from './components/dashboard/AdminDashboard';
import StaffLoginModal from './components/dashboard/StaffLoginModal';
import { useSiteContent } from './hooks/useSiteContent';

// @ts-ignore
import collegeTourVideo from './assets/images/college_tour.mp4';
import drAdesinaPhoto from './assets/images/dr_adesina.jpg';
import libraryBg from './assets/images/nursing_library_bg_1779735206053.png';

export default function App() {
  const { content, isAuthenticated } = useSiteContent();
  const [activeSection, setActiveSection] = useState<string>('home');
  const [submissionsList, setSubmissionsList] = useState<AdmissionFormSubmission[]>([]);

  // Staff Login Modal state (clean modal without demo credentials)
  const [isStaffLoginModalOpen, setIsStaffLoginModalOpen] = useState(false);

  const handleOpenStaffDashboard = () => {
    if (isAuthenticated) {
      setActiveSection('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsStaffLoginModalOpen(true);
    }
  };

  // AI Chatbot state
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);
  const [chatInitialRole, setChatInitialRole] = useState<ChatRole>('admissions_counselor');

  const handleOpenChat = (role: ChatRole = 'admissions_counselor') => {
    setChatInitialRole(role);
    setIsFloatingChatOpen(true);
  };

  // User custom video state for the interactive campus tour - initialized with configured video or default
  const activeVideoSource = content.videoConfig?.videoUrl?.trim() ? content.videoConfig.videoUrl.trim() : collegeTourVideo;
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(activeVideoSource);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Interactive Contact Inquiry state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  // Gallery active filter - uses dynamic mediaItems from store if available
  const [galleryFilter, setGalleryFilter] = useState<'All' | 'Labs' | 'ICT Room' | 'Library' | 'Building'>('All');

  const activeMediaList = (content.mediaItems && content.mediaItems.length > 0) ? content.mediaItems : galleryItems;
  const filteredGallery = galleryFilter === 'All' 
    ? activeMediaList 
    : activeMediaList.filter(item => item.category === galleryFilter);

  // Hook admissions submission back to Portal state
  const handleAdmissionSubmission = (newSubmission: AdmissionFormSubmission) => {
    setSubmissionsList(prev => [newSubmission, ...prev]);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryMessage.trim()) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMessage('');
      alert('Your inquiry has been logged! Our Ibadan campus secretary will call you shortly.');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col font-sans" id="app_root">
      
      {/* HEADER NAVIGATION */}
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        portalLoggedIn={false} 
        portalRole={null} 
        onLogout={() => {}} 
        onOpenChat={() => handleOpenChat('admissions_counselor')}
        onOpenDashboard={handleOpenStaffDashboard}
      />

      {/* EMERGENCY NOTIFICATION TICKER */}
      {content.ticker?.enabled && (
        <div className="bg-gradient-to-r from-teal-900 to-teal-980 text-teal-100 py-3 px-4 border-b border-amber-500 shadow-sm" id="emergency_banner">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xxs sm:text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-500 text-teal-950 font-bold font-mono rounded animate-pulse">
                {content.ticker.badge || 'NEWS ALERT'}
              </span>
              <span className="font-semibold truncate">
                {content.ticker.text}
              </span>
            </div>
            <button 
              onClick={() => setActiveSection(content.ticker.actionTarget || 'admissions')} 
              className="text-amber-400 hover:text-amber-300 font-bold underline shrink-0 font-mono"
              id="btn_hero_apply_ticker"
            >
              {content.ticker.actionText || 'Apply Instantly →'}
            </button>
          </div>
        </div>
      )}

      {/* SPACE RENTAL ADVERT BAR */}
      {content.spaceRentalBar?.enabled && (
        <div 
          onClick={() => {
            setActiveSection('space-rental');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-gradient-to-r from-amber-500 via-amber-450 to-amber-500 hover:from-amber-400 hover:to-amber-450 text-teal-950 py-2.5 px-4 border-b border-amber-600/80 shadow-xs cursor-pointer transition-all duration-200 group"
          id="space_rental_ad_bar"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-950 text-amber-400 text-xs shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                <Building2 className="w-3.5 h-3.5" />
              </span>
              <span className="truncate tracking-wide text-teal-950 font-sans">
                {content.spaceRentalBar.headline}{' '}
                <span className="underline decoration-teal-950/40 underline-offset-2">
                  {content.spaceRentalBar.subtext}
                </span>
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-extrabold uppercase bg-teal-950 text-white px-3 py-1 rounded-full group-hover:bg-teal-900 transition-colors shrink-0 shadow-xs">
              {content.spaceRentalBar.badge || 'Commercial Use →'}
            </span>
          </div>
        </div>
      )}

      {/* CORE FRAMEWORK BODY */}
      <main className="flex-grow">
        
        {/* ================= HOME SECTION ================= */}
        {activeSection === 'home' && (
          <div className="space-y-16 animate-fadeIn" id="home_section_root">
            
            {/* HERO SECTION / BANNER SPLASH */}
            <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/50 to-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-teal-100/40" id="hero_showcase">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* HERO COPY */}
                <div className="lg:col-span-7 space-y-6 text-left" id="hero_copy_col">
                  
                  {/* Accreditation Microtag */}
                  <div className="inline-flex items-center gap-2 bg-slate-100 border-l-4 border-l-amber-500 border-2 border-slate-200 py-1.5 px-3.5 text-xs font-semibold text-teal-950" id="accreditation_microtag">
                    <Award className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                    <span>{content.siteCopy?.hero?.accreditationTag || 'Accredited by the Nursing & Midwifery Council of Nigeria (NMCN)'}</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-teal-950 tracking-tight leading-tight uppercase" id="hero_heading">
                    {content.siteCopy?.hero?.headline || 'Bridging Compassion With Clinical Integrity'}
                  </h2>

                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-sans max-w-2xl">
                    {content.siteCopy?.hero?.subheadline || 'Welcome to Bridge College of Nursing and Health Sciences, Nigeria. Located in standard serene facilities along Akala Express, Ibadan, we offer state-of-the-art simulations and direct general hospital clinical exposure to raise elite clinical practitioners.'}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4" id="hero_action_buttons">
                    <button
                      onClick={() => setActiveSection('admissions')}
                      className="px-6 py-4 bg-teal-750 hover:bg-teal-850 text-white font-bold font-display uppercase tracking-wider text-xs border-2 border-teal-750 transition-all shadow-md active:scale-95 flex items-center gap-2 border-b-4 border-amber-500 rounded-none cursor-pointer"
                      id="hero_btn_admissions"
                    >
                      <Stethoscope className="w-5 h-5 text-amber-400" />
                      Admission Portal Online
                    </button>
                    <button
                      onClick={() => setActiveSection('gallery')}
                      className="px-6 py-4 bg-white border-2 border-teal-750 hover:bg-slate-50 text-teal-950 font-bold font-display uppercase tracking-wider text-xs transition-all flex items-center gap-2 border-b-4 border-teal-750 rounded-none cursor-pointer hover:translate-y-[-1px]"
                      id="hero_btn_tour"
                    >
                      <Building className="w-5 h-5 text-teal-650" />
                      Campus Virtual Tour
                    </button>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-3 gap-4 pt-8 border-t-2 border-slate-200 max-w-lg font-sans" id="hero_metrics">
                    <div>
                      <span className="text-2xl sm:text-3xl font-bold font-display text-teal-950 tracking-tight block">100%</span>
                      <span className="text-xxs text-gray-500 uppercase tracking-widest block font-mono">NMCN Exam Success</span>
                    </div>
                    <div>
                      <span className="text-2xl sm:text-3xl font-bold font-display text-teal-950 tracking-tight block">Elite</span>
                      <span className="text-xxs text-gray-500 uppercase tracking-widest block font-mono">Simulation Labs</span>
                    </div>
                    <div>
                      <span className="text-2xl sm:text-3xl font-bold font-display text-teal-950 tracking-tight block">1Yr / 3Yr</span>
                      <span className="text-xxs text-gray-500 uppercase tracking-widest block font-mono font-bold text-teal-700">Tracks Available</span>
                    </div>
                  </div>

                </div>

                {/* HERO HERO IMAGE REPLICA WITH PREMIUM DECOR */}
                <div className="lg:col-span-5 relative" id="hero_image_col">
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-600/10 to-amber-500/10 rounded-3xl -rotate-2 scale-102 blur-xs" />
                  
                  {/* Outer Photo Box representing the Ibadan building shown in photo 1 */}
                  <div className="relative bg-white p-4 rounded-3xl border border-teal-100 shadow-2xl">
                    <div className="relative rounded-2xl w-full h-[320px] overflow-hidden bg-slate-900 shadow-inner group flex flex-col justify-center items-center text-center" id="hero_gif_container">
                      {customVideoUrl ? (
                        <video
                          src={customVideoUrl}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <div className="p-6 flex flex-col items-center justify-center space-y-4 text-center cursor-pointer select-none h-full w-full bg-gradient-to-b from-slate-900 via-slate-950 to-teal-950 text-slate-100 relative"
                             onClick={() => videoInputRef.current?.click()}
                        >
                          {/* Beautiful grid/radar lines on background to make it look hyper professional */}
                          <div className="absolute inset-0 opacity-15 overflow-hidden pointer-events-none">
                            <div className="w-full h-full bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:20px_20px]" />
                            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
                          </div>

                          <div className="w-16 h-16 bg-teal-800/50 group-hover:bg-teal-700/60 border border-teal-500/30 rounded-full flex items-center justify-center text-teal-400 animate-pulse shadow-xl transition-all relative z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="stroke-teal-400 fill-teal-400/10 ml-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                          </div>

                          <div className="space-y-1 relative z-10 px-4">
                            <p className="text-white text-sm font-bold tracking-tight">
                              Click to Load Campus Tour Video
                            </p>
                            <p className="text-slate-400 text-xxs font-medium max-w-xs leading-normal">
                              Have your own local video tour file? Click to watch it loop beautifully in this layout!
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCustomVideoUrl(collegeTourVideo);
                              }}
                              className="mt-2 text-amber-400 hover:text-amber-300 text-[10px] font-mono font-bold block mx-auto underline"
                            >
                              Reset to Official Tour
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Hidden input file for loading the video */}
                      <input
                        type="file"
                        id="hero_video_input"
                        accept="video/mp4, video/quicktime, video/*"
                        ref={videoInputRef}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setCustomVideoUrl(url);
                          }
                        }}
                      />

                      {/* Premium Live Tour badge */}
                      {!customVideoUrl && (
                        <div className="absolute top-4 left-4 bg-teal-950/85 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-amber-500/30 shadow-lg">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                          <span className="text-[10px] text-white font-mono font-bold uppercase tracking-wider">CAMPUS VIDEO TOUR</span>
                        </div>
                      )}
                    </div>

                    {/* Badge Overlay */}
                    <div className="absolute -bottom-6 -left-6 bg-amber-500 text-teal-950 border-2 border-white py-3.5 px-5 rounded-2xl shadow-xl max-w-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <HeartPulse className="w-5 h-5 text-teal-950 stroke-[2] animate-bounce" />
                        <span className="text-xs uppercase font-extrabold font-mono tracking-wider">Oyo State Excellence</span>
                      </div>
                      <p className="text-[10px] leading-relaxed">
                        Harriet Shoroye Street, Off Akala Express, Ibadan. Complete modern multi-story complex.
                      </p>
                    </div>

                    {/* Certificate Badge Overlay */}
                    <div className="absolute -top-4 -right-4 bg-teal-900 border-2 border-white text-white p-3 rounded-2xl shadow-lg flex items-center gap-1.5 text-xs font-mono font-bold uppercase">
                      <BadgeCheck className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                      <span>Certified RN &amp; RM</span>
                    </div>

                  </div>
                </div>

              </div>
            </section>

            {/* LIVE PROMOTIONAL ADVERTS BENTO */}
            {content.promoBanners && content.promoBanners.filter(b => b.active).length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20" id="live_promo_adverts">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.promoBanners.filter(b => b.active).map(banner => (
                    <div 
                      key={banner.id}
                      onClick={() => {
                        setActiveSection(banner.actionTarget || 'admissions');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white rounded-2xl p-5 border border-amber-500/40 shadow-md hover:shadow-lg hover:border-amber-500 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xxs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            banner.badgeColor === 'teal' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {banner.badge}
                          </span>
                          <span className="text-xxs text-gray-400 font-mono">Live Announcement</span>
                        </div>
                        <h4 className="text-base font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                          {banner.title}
                        </h4>
                        <p className="text-xxs text-amber-700 font-bold uppercase tracking-wide">
                          {banner.subtitle}
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {banner.content}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-teal-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          {banner.actionLabel} &rarr;
                        </span>
                        <span className="text-xxs text-gray-400 font-mono">Bridge College Bulletin</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* WHO WE ARE SECTION MATCHING THE ATTACHMENT */}
            <section className="relative py-20 px-4 border-b border-teal-50 animate-fade-in overflow-hidden" id="who_we_are_section">
              {/* Background image container with professional overlay */}
              <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <img
                  src={libraryBg}
                  alt="Library Background"
                  className="w-full h-full object-cover scale-102 filter brightness-[0.98]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/40 via-white/20 to-amber-50/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
              </div>

              <div className="relative z-10 max-w-4xl mx-auto space-y-8 text-left bg-white/95 backdrop-blur-md p-6 sm:p-10 md:p-12 rounded-3xl border border-teal-100/50 shadow-2xl" id="who_we_are_text_col">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-950 font-display tracking-tight leading-tight">
                    Who We Are
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* 01. Our Vision */}
                  <div className="flex gap-4 sm:gap-5 items-start">
                    <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <FileText className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-teal-950 font-sans">
                        <span className="text-red-600 font-extrabold mr-1.5">01.</span> Our Vision
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-sans">
                        Our vision is to provide opportunity for students to pursue their dream in a serene and safe environment, helping them to focus on what it takes to fulfil their goals.
                      </p>
                    </div>
                  </div>

                  {/* Divider line matching sleek graphic look */}
                  <div className="h-px bg-slate-100 w-full" />

                  {/* 02. Our Mission */}
                  <div className="flex gap-4 sm:gap-5 items-start">
                    <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Search className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <div className="space-y-3.5 w-full">
                      <h3 className="text-lg font-bold text-teal-950 font-sans">
                        <span className="text-red-600 font-extrabold mr-1.5">02.</span> Our Mission
                      </h3>
                      
                      <div className="space-y-3 text-sm sm:text-base text-gray-600 leading-relaxed font-sans">
                        <p>
                          To offer health education to individuals with a calling or special interest, so that they may use their knowledge and skills to serve health care systems both nationally and internationally.
                        </p>
                        <p>
                          We aim to challenge our students to engage the gift of God in them and to use it to serve their society with love and care. We encourage students to provide their service with good conscience, knowing that nursing goes beyond personal interest, but is also a gift from God.
                        </p>
                        <p>
                          Providing service to mankind is a service that has eternal gratitude. As a nurse, once you serve your community with good conscience it will be a rewarding experience and you will be held in high esteem by others. We aspire to positively impact our student outlook on nursing. We offer unique training that will give our students the opportunity to achieve their life goals and to reach their full potential.
                        </p>

                        {/* Message to Future Students block */}
                        <div className="mt-5 p-4.5 rounded-2xl bg-teal-50/50 border border-teal-100/60 shadow-xs relative overflow-hidden">
                          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 text-teal-500/5 select-none pointer-events-none text-7xl font-serif">
                            &ldquo;
                          </div>
                          <h4 className="text-xs font-mono font-extrabold text-teal-800 uppercase tracking-widest mb-2 block">
                            Our message to future students
                          </h4>
                          <p className="text-xs sm:text-sm text-teal-950/95 leading-relaxed font-sans italic">
                            &ldquo;The college gives you the opportunity to emerge as an eagle. Through training, you will develop foresight and you will be guided to become forward thinkers. You will be mentored to develop the capabilities in nursing others. The olive within you will grow as you endure life challenges ahead. When you emerge as an eagle and endure pressure, the olive in you will produce a flowing oil. This will be an essential ingredient that you can use to heal the people in your care.&rdquo;
                          </p>
                        </div>

                        {/* Beautifully styled Badge for Motto */}
                        <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 leading-relaxed text-xs text-amber-950 font-bold">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-amber-500 text-teal-950 text-[10px] font-mono font-black uppercase tracking-wider rounded">
                              Motto
                            </span>
                            <span className="text-amber-800 text-xs font-sans font-bold">The eagle in me will manifest itself.</span>
                          </div>
                          <p className="text-amber-900/90 font-sans font-medium italic">
                            &ldquo;I am an eagle, born to make a positive impact. There is a beauty inside of me that is like an olive tree. I have a gift to give to my generation. We will strive to emerge as eagles and we will grow to flourish like olive trees.&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider line */}
                  <div className="h-px bg-slate-100 w-full" />

                  {/* 03. Accreditation */}
                  <div className="flex gap-4 sm:gap-5 items-start">
                    <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Award className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold text-teal-950 font-sans">
                        <span className="text-red-600 font-extrabold mr-1.5">03.</span> Accreditation
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-sans">
                        Bridge College of Nursing and Health Sciences is proudly accredited by the National Board for Technical Education (NBTE) to offer the OND in Nursing Science. Our accreditation confirms that our curriculum meets the rigorous academic and practical standards required for the development of competent and ethical nursing professionals.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* QUICK FEATURES / ACCREDITATIONS CARDS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8" id="core_strengths_grid">
              
              <div className="p-6 bg-white border border-teal-50 rounded-2xl hover:border-teal-200 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-700">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 font-sans">Simulated Demonstration Ward</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-sans">
                  Our labs coordinate high-end anatomy dummies, birthing mannequins, and active clinical beds corresponding precisely to standard hospital parameters.
                </p>
              </div>

              <div className="p-6 bg-white border border-teal-50 rounded-2xl hover:border-teal-200 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 font-sans">E-Library &amp; Standard Books</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-sans">
                  Hundreds of scientific journals, anatomical diagnostic catalogs, and state exam summaries alongside standard high-speed e-learning PCs.
                </p>
              </div>

              <div className="p-6 bg-white border border-teal-50 rounded-2xl hover:border-teal-200 hover:shadow-md transition-all space-y-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-700">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 font-sans">Elite Nurse Tutors</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-sans">
                  Learn from accredited clinical instructors and directors containing Ph.D. degrees, active NMCN licensing tutors, and specialized research scholars.
                </p>
              </div>

            </section>

            {/* INTRODUCTORY HISTORICAL TOUR & FOUNDER STATEMENT */}
            <section className="bg-slate-100 py-16 px-4" id="historical_overview">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Founder Photo Overlay */}
                <div className="lg:col-span-5 relative" id="founder_image_wrapper">
                  <div className="absolute inset-0 bg-teal-800/10 rounded-2xl -rotate-1" />
                  <div className="relative bg-white p-4 rounded-2xl border border-teal-100 shadow-lg">
                    <img
                      src={drAdesinaPhoto}
                      alt="Rev. Ms Bridget Adesina, Founder/CEO"
                      className="rounded-xl w-full h-[400px] object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-4 border-t border-teal-100 mt-3 bg-slate-50 rounded-xl space-y-3">
                      <div className="text-center">
                        <strong className="text-gray-900 block font-sans text-base font-extrabold">Rev. Ms Bridget Adesina</strong>
                        <span className="inline-block px-2.5 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full mt-1">
                          Founder/CEO
                        </span>
                      </div>
                      
                      <div className="text-[11px] text-gray-600 font-sans border-t border-teal-100/60 pt-3 space-y-2">
                        <span className="text-teal-900 font-extrabold tracking-wide uppercase text-[9px] font-mono block">Academic Credentials:</span>
                        <ul className="space-y-2 list-none pl-0">
                          <li className="flex items-start gap-1.5">
                            <span className="text-amber-500 mt-0.5">▪</span>
                            <div>
                              <strong className="text-gray-800 block font-bold leading-tight">BA Hons Theology</strong>
                              <span className="text-gray-500 block leading-tight text-[10px]">Brunel University</span>
                            </div>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-amber-500 mt-0.5">▪</span>
                            <div>
                              <strong className="text-gray-800 block font-bold leading-tight">PG Dip Advance Practice</strong>
                              <span className="text-gray-500 block leading-tight text-[10px]">Bedfordshire University</span>
                            </div>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-amber-500 mt-0.5">▪</span>
                            <div>
                              <strong className="text-gray-800 block font-bold leading-tight">BSc Health Studies</strong>
                              <span className="text-gray-500 block leading-tight text-[10px]">Buckinghamshire New University</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* History Block copy */}
                <div className="lg:col-span-7 space-y-6 text-left" id="historical_copy_block">
                  <span className="px-3 py-1 bg-amber-100 text-[#7c2d12] rounded-full text-xs font-mono font-bold uppercase tracking-widest">
                    Executive History
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-teal-950 tracking-tight leading-tight">
                    History of Bridge College
                  </h3>
                  
                  <div className="space-y-4 text-sm text-gray-600 leading-relaxed font-sans">
                    <p>
                      I was first approached by my younger sister to start a nursing institution for two reasons, having spent the best part of my years in nursing profession, the impact I have made in my career as advanced practitioner and the disturbing fact that there is a group of people in Nigeria that are struggling to gain admission into nursing training because of limited intake capacity compared to the demand and that most of these students are turning down offers to alternate studies but are willing to keep trying until they achieve their dreams through nursing courses.
                    </p>
                    <p>
                      I let this request pass for about 3 months after which I heard from God. He spoke to me to redirect the building that was in progress for a specialized school, and convert it to a nursing and health sciences college so as to give opportunity for students to pursue their dreams in nursing, creating opportunities for some students that are struggling to gain admission and relieve the frustration of some of the families who are desperate to see their children gain the opportunity to pursue their dreams.
                    </p>
                    <div className="p-4 bg-teal-50 rounded-xl border-l-4 border-amber-500 font-medium text-teal-950">
                      Hence in January 2024 without delay I instructed that changes be made to the Special need facility to convert it into a nursing college and I engaged in the pursuit of getting the registration ready for the college to prepare intake for 2025.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center shrink-0 text-teal-750">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-gray-700 font-semibold">Dual Midwifery &amp; RN Tracks</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center shrink-0 text-teal-750">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-gray-700 font-semibold">Harriet Shoroye Ibadan Location</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center shrink-0 text-teal-750">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-gray-700 font-semibold">NMCN Accredited Certifications</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center shrink-0 text-teal-750">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-gray-700 font-semibold">100% Student-to-Clinic Placement</span>
                    </div>
                  </div>

                </div>

              </div>
            </section>

          </div>
        )}

        {/* ================= ABOUT SECTION (INCLUDES INTERACTIVE ORGANOGRAM) ================= */}
        {activeSection === 'about' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn" id="about_panel_root">
            
            <div className="text-center max-w-3xl mx-auto">
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                Who We Are
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-2">
                Vision &amp; Strategic Blueprint of our College
              </h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                As a paramount health training institution in Oyo State, Nigeria, we maintain rigorous standards of excellence, physical cleanliness, and absolute regulatory compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start" id="mission_vision_boxes">
              <div className="p-8 bg-white border border-teal-50 rounded-3xl shadow-sm text-left relative space-y-4">
                <span className="text-xs uppercase font-mono font-extrabold text-teal-600 tracking-widest block">The Vision</span>
                <h3 className="text-xl font-bold text-teal-950 font-sans border-b border-teal-50 pb-2">To raise elite health leaders globally.</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-sans">
                  To be acknowledged as the premium center for nursing and health science credentials in Oyo, outstandingly recognized for producing clinically superior, highly ethical, and empathetic nurse managers who excel worldwide.
                </p>
              </div>

              <div className="p-8 bg-white border border-teal-50 rounded-3xl shadow-sm text-left relative space-y-4">
                <span className="text-xs uppercase font-mono font-extrabold text-teal-600 tracking-widest block">The Mission</span>
                <h3 className="text-xl font-bold text-teal-950 font-sans border-b border-teal-50 pb-2">Technical excellence, clinical competence.</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-sans">
                  Our mission coordinates intensive training sequences across modern medical simulation laboratories, e-health libraries, and supportive general hospital rotations, enabling professional qualifications to NMCN rules.
                </p>
              </div>
            </div>

            {/* ACCREDITATIONS & BOARD */}
            <div className="bg-teal-980 text-teal-50 py-10 px-8 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center border-t-4 border-amber-500 shadow-lg" id="compliance_banner_dark">
              <div className="space-y-1">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto text-amber-400">
                  <Shield className="w-5 h-5 animate-pulse" />
                </div>
                <h4 className="font-bold text-sm text-white">Oyo Ministry of Health</h4>
                <p className="text-xs text-teal-200 max-w-xs mx-auto">Registered as an accredited private medical and health sciences college.</p>
              </div>

              <div className="space-y-1">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">NMCN Compliant Labs</h4>
                <p className="text-xs text-teal-200 max-w-xs mx-auto">Our clinical laboratory settings meet regulatory guidelines of NMCN.</p>
              </div>

              <div className="space-y-1">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto text-amber-400">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">Oyo State Clinical Placements</h4>
                <p className="text-xs text-teal-200 max-w-xs mx-auto">Fully synchronized postings at government teaching and specialist medical facilities.</p>
              </div>
            </div>

            {/* DYNAMIC HIERARCHY TIER NODES */}
            <OrganogramHierarchy />

          </div>
        )}

        {/* ================= PROGRAMS SECTION ================= */}
        {activeSection === 'programs' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn" id="programs_panel_root">
            
            <div className="text-center max-w-3xl mx-auto">
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                Education Modules
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-2">
                Our Proffered Programmes &amp; Requirements
              </h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed font-sans">
                Review academic parameters, licensing course durations, and WAEC admission thresholds below.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="programmes_cards_wrapper">
              {programmesList.map((prog) => (
                <div key={prog.id} className="bg-white rounded-3xl border border-teal-100 hover:border-teal-300 hover:shadow-xl transition-all overflow-hidden flex flex-col h-full" id={`card_${prog.id}`}>
                  
                  {/* Cyan Banner */}
                  <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-teal-50 p-6 border-b border-teal-950">
                    <span className="text-xxs font-mono font-bold tracking-widest uppercase text-amber-400">
                      {prog.level}
                    </span>
                    <h3 className="text-lg font-bold font-sans mt-1 leading-tight text-white">
                      {prog.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-4 text-xs font-mono text-teal-300 bg-teal-950/45 py-1 px-3 rounded">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>Duration: {prog.duration}</span>
                    </div>
                  </div>

                  {/* Program Core Content */}
                  <div className="p-6 flex-grow space-y-4 text-left text-xs sm:text-sm">
                    <p className="text-gray-600 leading-relaxed font-sans">{prog.description}</p>
                    
                    {/* Requirements list */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-teal-950 block uppercase tracking-wider font-mono">Admission Criteria:</span>
                      <ul className="space-y-1.5 text-xs text-gray-500">
                        {prog.requirements.map((req, rIdx) => (
                          <li key={rIdx} className="flex gap-2">
                            <span className="text-amber-500 font-bold shrink-0">&bull;</span>
                            <span className="font-sans leading-relaxed">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 border-t border-teal-100 flex items-center justify-between">
                    <span className="text-xxs font-mono text-gray-500">O-Level Credits: Eng, Bio, Chm, Phy, Mth</span>
                    <button
                      onClick={() => setActiveSection('admissions')}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-all"
                    >
                      Enrol Now
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= ADMISSIONS SECTION ================= */}
        {activeSection === 'admissions' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn" id="admissions_panel_root">
            
            <div className="text-center max-w-2xl mx-auto">
              <span className="px-3 py-1 bg-amber-100 text-[#7c2d12] rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                Registration Hub
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-2">
                Bridge College Online Registration
              </h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Fill the direct three-step online admission format below. Your information is processed safely inside our secure Ibadan campus registers.
              </p>
            </div>

            {/* ADMISSIONS STEPPER WRAPPER */}
            <AdmissionsForm 
              programmes={programmesList} 
              onSubmissionSuccess={handleAdmissionSubmission} 
            />

          </div>
        )}

        {/* ================= CAMPUS TOUR / GALLERY SECTION ================= */}
        {activeSection === 'gallery' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn" id="gallery_panel_root">
            
            <div className="text-center max-w-3xl mx-auto">
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                Exquisite Galleries
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-2">
                Explore our Ibadan Physical Facilities
              </h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed font-sans">
                Review architectural characteristics and official specifications of our scientific labs, e-libraries, computer rooms, and classrooms corresponding exactly to our physical campus facilities.
              </p>
            </div>

            {/* CATEGORY SELECTOR CHET */}
            <div className="flex flex-wrap items-center justify-center gap-2" id="gallery_filter_bar">
              {['All', 'Labs', 'ICT Room', 'Library', 'Building'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGalleryFilter(cat as any)}
                  className={`px-4 py-2 border rounded-full text-xs font-semibold font-mono transition-all ${
                    galleryFilter === cat
                      ? 'bg-teal-700 text-teal-50 border-teal-700 shadow-sm'
                      : 'bg-white text-gray-600 border-teal-100 hover:border-teal-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* SHARP DENSE GRID WITH ILLUSTRATIVE ICONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="gallery_mesh_grid">
              {filteredGallery.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl border border-teal-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full">
                  <div className="relative w-full h-40 bg-gradient-to-br from-teal-950 via-teal-900 to-teal-850 flex items-center justify-center p-6 text-teal-400 overflow-hidden border-b border-teal-900">
                    {/* Atmospheric background patterns */}
                    <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none">
                      <div className="w-full h-full bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]" />
                    </div>
                    
                    {/* Core Illustrative Icon based on category or type */}
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-teal-900/60 border border-teal-500/25 flex items-center justify-center text-teal-300 shadow-md">
                      {item.category === 'Labs' && <Stethoscope className="w-8 h-8 text-teal-300" />}
                      {item.category === 'ICT Room' && <Sparkles className="w-8 h-8 text-cyan-300" />}
                      {item.category === 'Library' && <BookOpen className="w-8 h-8 text-amber-300" />}
                      {item.category === 'Building' && <Building className="w-8 h-8 text-emerald-300" />}
                      {item.category === 'Lecture Halls' && <GraduationCap className="w-8 h-8 text-blue-300" />}
                      {!['Labs', 'ICT Room', 'Library', 'Building', 'Lecture Halls'].includes(item.category) && <Award className="w-8 h-8 text-amber-400" />}
                    </div>

                    <span className="absolute top-3 right-3 bg-teal-850/90 text-teal-50 border border-teal-700 font-mono px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-5 flex-grow text-left space-y-2">
                    <h4 className="text-sm font-bold text-teal-950 font-sans leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xxs sm:text-xs text-gray-500 leading-normal leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                  <div className="px-5 py-3 bg-slate-50 border-t border-teal-100/50 text-[10px] text-gray-400 font-mono text-right flex items-center justify-between">
                    <span>Oyo State Campus Unit</span>
                    <span>BCN Real Asset</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= NEWS & FACULTY SECTION ================= */}
        {activeSection === 'news' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fadeIn" id="news_panel_root">
            
            {/* LECTURER ADVISORS BOARD */}
            <div className="space-y-8 text-center">
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                Distinguished Academics
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-2">
                Bridge College Faculty &amp; Staff Members
              </h2>
              <p className="text-sm text-gray-600 mt-2 max-w-xl mx-auto">
                Consult profiles of senior administrative officers, clinical trainers and academic advisors stationed inside Harriet Shoroye Complex.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left" id="faculty_board_mesh">
                {facultyMembers.map((fac, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-teal-100 hover:border-teal-300 hover:shadow shadow-sm overflow-hidden p-5 space-y-4">
                    <img
                      src={fac.avatarUrl}
                      alt={fac.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-teal-500"
                    />
                    <div>
                      <h4 className="font-bold text-teal-950 text-sm leading-tight font-sans">
                        {fac.name}
                      </h4>
                      <span className="text-[10px] font-mono text-amber-600 font-bold block mt-1 uppercase">
                        {fac.role}
                      </span>
                    </div>
                    <div className="text-xxs text-gray-500 font-sans space-y-2 pt-2 border-t border-teal-50">
                      <div>Credentials: <strong className="text-gray-700 block mt-1 whitespace-pre-line leading-relaxed">{fac.qualification}</strong></div>
                      <div>Dept: <span className="text-teal-700 font-semibold">{fac.department}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DYNAMIC NEWS & EVENTS FEED */}
            <div className="space-y-8 pt-10 border-t border-teal-100">
              <div className="text-center">
                <span className="px-3 py-1 bg-amber-100 text-[#7c2d12] rounded-full text-xs font-mono font-bold uppercase tracking-widest">
                  News Hub
                </span>
                <h3 className="text-2xl font-extrabold text-teal-950 mt-2">
                  Latest Campus News &amp; Academic Calendars
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left" id="news_bulletins_grid">
                
                <div className="p-6 bg-white border border-teal-50 rounded-2xl space-y-4">
                  <span className="text-[10.5px] font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">ADMISSIONS 2026</span>
                  <h4 className="text-sm font-bold text-gray-900 leading-snug">Acceptance Guidelines and Screening Schedules</h4>
                  <p className="text-xxs sm:text-xs text-gray-500 leading-relaxed font-sans">
                    Prospective students are prompted to submit Waec certifications online before joining campus face-to-face computerized tests inside Ibadan halls next week.
                  </p>
                  <div className="text-[10px] text-gray-400 font-mono flex items-center justify-between pt-2 border-t border-teal-100/50">
                    <span>Date: 22/05/2026</span>
                    <span>Admin Office Feed</span>
                  </div>
                </div>

                <div className="p-6 bg-white border border-teal-50 rounded-2xl space-y-4">
                  <span className="text-[10.5px] font-mono font-bold bg-amber-100 text-[#7c2d12] px-2 py-0.5 rounded">LIBRARY RESOURCES</span>
                  <h4 className="text-sm font-bold text-gray-900 leading-snug">New Core E-Library textbooks successfully cataloged</h4>
                  <p className="text-xxs sm:text-xs text-gray-500 leading-relaxed font-sans">
                    The College Librarian has cataloged the newly received 5th editions of Taylor&apos;s dictionaries of nursing and diagnostic sciences inside our reading rooms.
                  </p>
                  <div className="text-[10px] text-gray-400 font-mono flex items-center justify-between pt-2 border-t border-teal-100/50">
                    <span>Date: 19/05/2026</span>
                    <span>E-Library Feed</span>
                  </div>
                </div>

                <div className="p-6 bg-white border border-teal-50 rounded-2xl space-y-4">
                  <span className="text-[10.5px] font-mono font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded">CLINICAL PRACTICE</span>
                  <h4 className="text-sm font-bold text-gray-900 leading-snug">Postpartum Hemorrhage maneuvers clinical workshops</h4>
                  <p className="text-xxs sm:text-xs text-gray-500 leading-relaxed font-sans">
                    Our second-year basic nursing students will be completing practical simulations on neonatal care beds inside our demonstration labs next Monday.
                  </p>
                  <div className="text-[10px] text-gray-400 font-mono flex items-center justify-between pt-2 border-t border-teal-100/50">
                    <span>Date: 15/05/2026</span>
                    <span>Demonstration Lab Feed</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ================= PORTAL LOGIN / REDIRECT ================= */}
        {activeSection === 'portal' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn" id="portal_panel_root">
            
            <div className="text-center max-w-xl mx-auto">
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                E-Campus Portal
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-2 animate-pulse">
                Connect to Institutional Workspace
              </h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Log in as any of our designated simulation profiles (demo student / registrar) to experience the real-time clinical dashboards instantly!
              </p>
            </div>

            {/* PORTAL SYSTEM CORE COMPONENT */}
            <Portal initialSubmissions={submissionsList} />

          </div>
        )}

        {/* ================= CONTACT SECTION & MAPS ================= */}
        {activeSection === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn" id="contact_panel_root">
            
            <div className="text-center max-w-2xl mx-auto">
              <span className="px-3 py-1 bg-amber-100 text-[#7c2d12] rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                Our Campus Channels
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mt-2">
                We Welcome Visitors
              </h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Our physical location is fully open on weekdays inside Ibadan, Nigeria. Schedule an academic inspection tour using the contact lanes below.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="contact_layout_bento">
              
              {/* CONTACT FORM */}
              <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-teal-100 shadow-lg space-y-6" id="visitor_inquiry_form_pane">
                <div className="flex items-center gap-2 border-b border-teal-50 pb-3 mb-2 text-teal-950 font-bold">
                  <MessageSquare className="w-5 h-5 text-teal-650" />
                  <h4 className="text-sm uppercase tracking-wider font-sans">Submit Academic Inquiry Ticket</h4>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs select-none">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Samuel Adekunle"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">Email / Contact Number</label>
                      <input
                        type="text"
                        required
                        placeholder="name@example.com / +234"
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Your Message / Inquiry Detail</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Ask our admission officer about requirements, accommodation fees, or test schedules..."
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg tracking-wide shadow flex items-center justify-center gap-2"
                  >
                    Send Message to Campus
                    <Send className="w-4 h-4 text-amber-400" />
                  </button>
                </form>
              </div>

              {/* LOCATION DETAILS CARD */}
              <div className="lg:col-span-5 bg-teal-985 text-teal-50 p-8 rounded-3xl border border-teal-800 shadow-md space-y-6" id="contact_info_box">
                <span className="text-xs uppercase font-mono font-extrabold text-[#f59e0b] tracking-widest block">Ibadan Headquarters</span>
                <h3 className="text-2xl font-bold font-sans text-white border-b border-teal-800 pb-2">The Harriet Shoroye Wing</h3>
                
                <p className="text-xs sm:text-sm text-teal-200 leading-relaxed font-sans">
                  The college building is framed by a serene off-Akala Express security perimeter in Ibadan, Oyo State, offering candidates a focused atmosphere devoid of metropolitan noises.
                </p>

                <div className="space-y-4 text-xs font-mono text-teal-300">
                  <div className="flex gap-2.5">
                    <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                    <span>{content.siteCopy?.contact?.address || 'Harriet Shoroye Street, Off Araoye Heritage Estate, Off Akala Express, Ibadan, Nigeria.'}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                    <span>{content.siteCopy?.contact?.phone || '+234 701 7514 313'}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                    <span>{content.siteCopy?.contact?.email || 'info@bridgecollegeofnursing'}</span>
                  </div>
                </div>

                <div className="p-4 bg-teal-950/60 rounded-2xl border border-teal-800 text-xxs leading-relaxed font-sans text-teal-300 flex items-start gap-2">
                  <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    Weekly campus walkthrough hours: {content.siteCopy?.contact?.hours || 'Monday to Friday (08:00 AM - 04:00 PM)'}. Parents and regulatory NMCN officers are welcome.
                  </span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION: AI ADVISOR & CLINICAL TUTOR (GEMINI POWERED)     */}
        {/* ======================================================== */}
        {activeSection === 'aichat' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn" id="aichat_section">
            
            {/* HERO BANNER */}
            <div className="relative bg-gradient-to-r from-teal-950 via-teal-900 to-teal-850 rounded-3xl p-8 sm:p-10 text-white shadow-xl overflow-hidden border border-amber-500/40">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Google Gemini Multiturn Assistant
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans text-white leading-tight">
                  Bridge College AI Academic &amp; Clinical Advisor
                </h1>

                <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed font-sans">
                  Connect 24/7 with our AI system designed for Bridge College of Nursing and Health Sciences.
                  Consult with specialized personas for prospective student admissions, clinical nursing &amp; pharmacology tutoring, or enrolled student portal welfare.
                </p>

                {/* PERSONA HIGHLIGHTS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-3.5 rounded-2xl">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase font-mono mb-1">
                      <GraduationCap className="w-4 h-4" />
                      Admissions Counselor
                    </div>
                    <p className="text-xxs text-teal-100 leading-normal">
                      Guidance on WAEC/NECO requirements, screening protocols, and programme eligibility.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-3.5 rounded-2xl">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase font-mono mb-1">
                      <Stethoscope className="w-4 h-4" />
                      Clinical &amp; Nursing Tutor
                    </div>
                    <p className="text-xxs text-teal-100 leading-normal">
                      Evidence-based reviews in anatomy, pharmacology, ADPIE care plans, and NMCN license exams.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-3.5 rounded-2xl">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase font-mono mb-1">
                      <BookOpen className="w-4 h-4" />
                      Student Life &amp; Portal
                    </div>
                    <p className="text-xxs text-teal-100 leading-normal">
                      Timetables, hospital ward postings advice, clinical logbooks, and academic support.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FULL-PAGE CHAT CONTAINER */}
            <div className="bg-white rounded-3xl shadow-lg border border-teal-100 overflow-hidden">
              <BridgeAiChat isFloating={false} />
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION: SPACES FOR RENT FOR COMMERCIAL USE              */}
        {/* ======================================================== */}
        {activeSection === 'space-rental' && (
          <SpaceRental
            onBackToHome={() => {
              setActiveSection('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenChat={() => handleOpenChat('admissions_counselor')}
          />
        )}

        {/* ======================================================== */}
        {/* SECTION: CAREERS & CURRENT JOB OPPORTUNITIES             */}
        {/* ======================================================== */}
        {activeSection === 'careers' && (
          <CareersPage
            onBackToHome={() => {
              setActiveSection('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenDashboard={handleOpenStaffDashboard}
          />
        )}

        {/* ======================================================== */}
        {/* SECTION: MULTI-ROLE STAFF & ADMINISTRATIVE DASHBOARD      */}
        {/* ======================================================== */}
        {activeSection === 'dashboard' && (
          isAuthenticated ? (
            <AdminDashboard
              onBackToSite={() => {
                setActiveSection('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <div className="min-h-[75vh] flex items-center justify-center p-4 bg-slate-50">
              <StaffLoginModal
                isOpen={true}
                onClose={() => {
                  setActiveSection('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSuccess={() => {
                  setActiveSection('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )
        )}

      </main>

      {/* GLOBAL STAFF SIGN-IN MODAL (PROMPTED WHEN DASHBOARD IS CLICKED) */}
      <StaffLoginModal
        isOpen={isStaffLoginModalOpen}
        onClose={() => setIsStaffLoginModalOpen(false)}
        onSuccess={() => {
          setIsStaffLoginModalOpen(false);
          setActiveSection('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* FLOATING AI CHAT LAUNCHER BUTTON */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2" id="floating_chat_wrapper">
        {!isFloatingChatOpen && (
          <button
            id="floating_ai_chat_btn"
            onClick={() => setIsFloatingChatOpen(true)}
            className="group relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-teal-900 via-teal-850 to-teal-950 text-white rounded-full shadow-2xl border-2 border-amber-400 hover:scale-105 active:scale-95 transition-all duration-200"
            title="Chat with Bridge College AI Assistant"
          >
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
            </span>
            <div className="text-left font-sans">
              <span className="block text-xs font-extrabold tracking-wide uppercase font-mono text-amber-300 leading-none">
                AI Advisor
              </span>
              <span className="block text-[11px] text-teal-100 font-medium leading-tight">
                Ask Admissions &amp; Tutor
              </span>
            </div>
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform ml-1" />
          </button>
        )}
      </div>

      {/* FLOATING CHAT DIALOG */}
      {isFloatingChatOpen && (
        <BridgeAiChat
          isFloating={true}
          isOpen={isFloatingChatOpen}
          onClose={() => setIsFloatingChatOpen(false)}
          initialRole={chatInitialRole}
        />
      )}

      {/* FOOTER */}
      <Footer 
        setActiveSection={setActiveSection} 
        onOpenDashboard={handleOpenStaffDashboard}
      />

    </div>
  );
}
