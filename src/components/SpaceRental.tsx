import React, { useState } from 'react';
import {
  Building2,
  Users,
  Church,
  GraduationCap,
  Briefcase,
  Monitor,
  Zap,
  Snowflake,
  Armchair,
  ShieldCheck,
  Car,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  MessageCircle,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Info,
  X
} from 'lucide-react';
import collegeLogo from '../assets/images/college_logo.svg';
import bconFrontalElevation from '../assets/images/BCON Frontal Elevation.jpeg';
import screenshotLecture1 from '../assets/images/Screenshot 2026-10-13 203730.png';
import screenshotLecture2 from '../assets/images/Screenshot 2026-07-21 195118.png';
import screenshotLecture3 from '../assets/images/Screenshot 2026-07-21 195049.png';
import screenshotEventSpace from '../assets/images/Screenshot 2026-06-23 075551.png';
import whatsappComputerSuite from '../assets/images/WhatsApp Image 2026-05-16 at 3.49.44 PM (1).jpeg';

// Exact image paths corresponding to the user's authentic attachments
const EXACT_IMAGES = {
  frontalElevation: bconFrontalElevation,
  lectureHallMain: screenshotLecture1,
  lectureHallAngle2: screenshotLecture2,
  lectureHallAngle3: screenshotLecture3,
  eventSpace: screenshotEventSpace,
  computerSuite: whatsappComputerSuite,
  computerSuite2: whatsappComputerSuite,
};

interface SpaceRentalProps {
  onBackToHome: () => void;
  onOpenChat?: () => void;
}

export default function SpaceRental({ onBackToHome }: SpaceRentalProps) {
  const [selectedSpace, setSelectedSpace] = useState<string>('Corporate Meetings & Seminars');
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryDate, setInquiryDate] = useState('');
  const [inquiryDuration, setInquiryDuration] = useState('Hourly');
  const [inquiryAttendees, setInquiryAttendees] = useState('10 - 50 People');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string; subtitle: string } | null>(null);

  // Suitable spaces data from the flyer
  const suitableSpaces = [
    {
      title: 'Corporate Meetings & Seminars',
      desc: 'Quiet, air-conditioned rooms ideal for board meetings & strategy sessions.',
      icon: Users,
      badge: 'Executive Setup',
      capacity: '20 - 80 Attendees'
    },
    {
      title: 'Church Fellowships & Gatherings',
      desc: 'Spacious halls with comfortable seating layouts for weekly or special services.',
      icon: Church,
      badge: 'Acoustics & Seating',
      capacity: '50 - 300+ Attendees'
    },
    {
      title: 'Coaching & Extra-Mural Classes',
      desc: 'Fully equipped classrooms with whiteboards & sturdy student desks.',
      icon: GraduationCap,
      badge: 'Academic Classrooms',
      capacity: '30 - 100 Students'
    },
    {
      title: 'Workshops & Training Bootcamps',
      desc: 'Flexible spatial setups for practical workshops, skill acquisition & seminars.',
      icon: Briefcase,
      badge: 'Flexible Layout',
      capacity: '25 - 150 Attendees'
    },
    {
      title: 'ICT Lab & Computer Examinations',
      desc: 'High-speed desktop workstations with partitioned dividers and backup power.',
      icon: Monitor,
      badge: 'CBT / Computer Suites',
      capacity: '40 - 120 Workstations'
    }
  ];

  // Key amenities from the flyer
  const amenities = [
    {
      name: '24/7 Uninterrupted Power Supply',
      desc: 'Dedicated heavy-duty industrial generator and solar backup guaranteeing zero downtime during events.',
      icon: Zap
    },
    {
      name: 'Air-Conditioned Spaces',
      desc: 'High-performance split inverter cooling systems maintaining optimum climate control.',
      icon: Snowflake
    },
    {
      name: 'Modern Ergonomic Seating & Desks',
      desc: 'Comfortable executive and tiered educational seating designed for lengthy sessions.',
      icon: Armchair
    },
    {
      name: 'Fully Equipped ICT Computer Lab',
      desc: 'LAN network, CBT exam workstations with partitions, and secure fiber connectivity.',
      icon: Monitor
    },
    {
      name: '24hrs Security Available',
      desc: 'Gated compound perimeter with round-the-clock trained security guards and CCTV surveillance.',
      icon: ShieldCheck
    },
    {
      name: 'Ample Secure Parking Space',
      desc: 'Spacious, well-paved gated parking lot capable of accommodating numerous vehicles safely.',
      icon: Car
    }
  ];

  // Handle direct WhatsApp inquiry dispatch
  const handleWhatsAppBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hello Bridge College of Nursing,%0A%0AI would like to make an enquiry for SPACE RENTAL FOR COMMERCIAL USE:%0A• Space Type: ${encodeURIComponent(selectedSpace)}%0A• Name / Organization: ${encodeURIComponent(inquiryName || 'Prospective Client')}%0A• Contact Phone: ${encodeURIComponent(inquiryPhone || 'N/A')}%0A• Preferred Date: ${encodeURIComponent(inquiryDate || 'To be scheduled')}%0A• Rental Duration: ${encodeURIComponent(inquiryDuration)}%0A• Estimated Attendees: ${encodeURIComponent(inquiryAttendees)}%0A• Special Notes: ${encodeURIComponent(inquiryNotes || 'None')}%0A%0APlease provide pricing and availability details.`;
    window.open(`https://wa.me/2347017514313?text=${message}`, '_blank');
  };

  const copyPageLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-gray-800 pb-20 animate-fadeIn" id="space_rental_page">
      
      {/* TOP NAVIGATION / BREADCRUMB BAR */}
      <div className="bg-teal-950 text-teal-100 py-3.5 px-4 sm:px-6 lg:px-8 border-b border-teal-800/80 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Homepage</span>
            </button>
            <span className="text-teal-600">/</span>
            <span className="text-teal-200">Commercial Space Rental</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyPageLink}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-900 hover:bg-teal-850 text-teal-200 hover:text-white rounded-lg border border-teal-700/60 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isCopied ? 'Link Copied!' : 'Share Page'}</span>
            </button>

            <a
              href="https://wa.me/2347017514313?text=Hello%20Bridge%20College%2C%20I%20am%20inquiring%20about%20spaces%20for%20rent%20for%20commercial%20use."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Now</span>
            </a>
          </div>
        </div>
      </div>

      {/* FLYER CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8">
        
        {/* ======================================================== */}
        {/* FLYER HEADER BLOCK (Exact Dark Patterned Aesthetic)      */}
        {/* ======================================================== */}
        <div className="relative bg-gradient-to-b from-[#071626] via-[#0b2138] to-[#08182b] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-amber-500/30 overflow-hidden text-center">
          
          {/* Subtle Grid Accent Texture */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-4">
            
            {/* BADGE: EXCELLENCE IN LEARNING & SERENE ENVIRONMENT */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fef3c7] text-[#92400e] border border-[#d97706] rounded-full text-xs font-mono font-black tracking-wider uppercase shadow-sm">
              <Building2 className="w-4 h-4 text-[#d97706]" />
              <span>EXCELLENCE IN LEARNING &amp; SERENE ENVIRONMENT</span>
            </div>

            {/* MAIN COLLEGE TITLE */}
            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-[#f59e0b] uppercase drop-shadow-sm">
              BRIDGE COLLEGE OF NURSING
            </h1>

            {/* GOLD ACCENT DIVIDER */}
            <div className="w-20 h-1 bg-[#f59e0b] mx-auto rounded-full" />

            {/* SUBTITLE */}
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-wide uppercase text-white font-sans">
              SPACES FOR RENT FOR COMMERCIAL USE
            </h2>

            {/* TAGLINE */}
            <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl mx-auto font-medium">
              Modern, Fully Furnished &amp; Serene Facilities Available for Immediate Hire
            </p>
          </div>

        </div>

        {/* ======================================================== */}
        {/* PHOTO SHOWCASE BENTO GRID (Matching the 4 Flyer Photos)  */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="flyer_photos_grid">
          
          {/* LEFT LARGE PHOTO: College Building & Gated Compound */}
          <div 
            onClick={() => setPreviewImage({
              src: EXACT_IMAGES.frontalElevation,
              title: 'Bridge College Building & Gated Compound',
              subtitle: 'Frontal elevation showing multi-storey facilities, gated perimeter & security command.'
            })}
            className="lg:col-span-7 relative group overflow-hidden rounded-3xl shadow-xl border border-slate-200 bg-slate-900 min-h-[360px] sm:min-h-[460px] cursor-pointer"
          >
            <img
              src={EXACT_IMAGES.frontalElevation}
              alt="Bridge College Building & Gated Compound"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.95]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500 text-teal-950 font-mono font-black text-xs uppercase tracking-wider rounded-md shadow-md">
                PRIME LOCATION
              </span>
              <span className="px-2.5 py-1 bg-black/60 text-white font-mono text-[11px] rounded-md backdrop-blur-xs hidden sm:inline-block">
                🔍 Click to zoom
              </span>
            </div>

            <div className="absolute bottom-5 left-5 right-5 text-white">
              <h3 className="text-lg sm:text-2xl font-black font-sans tracking-wide">
                College Building &amp; Gated Compound
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-sans mt-0.5">
                Harriet Shoroye Street, Off Akala Express, Ibadan • Secure, serene compound
              </p>
            </div>
          </div>

          {/* RIGHT 3 STACKED PHOTOS */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Top Right: Spacious Lecture Halls */}
            <div 
              onClick={() => setPreviewImage({
                src: EXACT_IMAGES.lectureHallMain,
                title: 'Spacious Lecture Halls',
                subtitle: 'Cobalt blue student workstations, whiteboards & modern ceiling downlights.'
              })}
              className="relative group overflow-hidden rounded-2xl shadow-md border border-slate-200 bg-slate-900 h-[145px] sm:h-[145px] cursor-pointer"
            >
              <img
                src={EXACT_IMAGES.lectureHallMain}
                alt="Spacious Lecture Halls"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="font-bold text-sm tracking-wide block">Spacious Lecture Halls</span>
                <span className="text-[11px] text-teal-200 font-mono">Tiered acoustic classrooms &amp; whiteboards</span>
              </div>
            </div>

            {/* Middle Right: Computer & Exam Suite */}
            <div 
              onClick={() => setPreviewImage({
                src: EXACT_IMAGES.computerSuite,
                title: 'Computer & Exam Suite',
                subtitle: 'Partitioned CBT computer workstations, high-speed connectivity & red ergonomic seating.'
              })}
              className="relative group overflow-hidden rounded-2xl shadow-md border border-slate-200 bg-slate-900 h-[145px] sm:h-[145px] cursor-pointer"
            >
              <img
                src={EXACT_IMAGES.computerSuite}
                alt="Computer & Exam Suite"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="font-bold text-sm tracking-wide block">Computer &amp; Exam Suite</span>
                <span className="text-[11px] text-teal-200 font-mono">High-speed CBT testing workstations</span>
              </div>
            </div>

            {/* Bottom Right: Multi-purpose Event Spaces */}
            <div 
              onClick={() => setPreviewImage({
                src: EXACT_IMAGES.eventSpace,
                title: 'Multi-purpose Event Spaces',
                subtitle: 'Conferences, church fellowships, workshops & large gatherings in session.'
              })}
              className="relative group overflow-hidden rounded-2xl shadow-md border border-slate-200 bg-slate-900 h-[145px] sm:h-[145px] cursor-pointer"
            >
              <img
                src={EXACT_IMAGES.eventSpace}
                alt="Multi-purpose Event Spaces"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="font-bold text-sm tracking-wide block">Multi-purpose Event Spaces</span>
                <span className="text-[11px] text-teal-200 font-mono">Conferences, church fellowships &amp; seminars</span>
              </div>
            </div>

          </div>

        </div>

        {/* ADDITIONAL PERSPECTIVES GALLERY STRIP */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-mono font-bold uppercase text-teal-900 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Additional Facility Angles &amp; Workstations:
            </span>
            <span className="text-xxs text-gray-500 font-mono">Click any thumbnail to inspect</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div
              onClick={() => setPreviewImage({
                src: EXACT_IMAGES.lectureHallAngle2,
                title: 'Lecture Hall & Classrooms (Perspective 2)',
                subtitle: 'Cobalt blue student desks and blackboard/whiteboard configuration.'
              })}
              className="group relative rounded-xl overflow-hidden h-28 bg-slate-800 cursor-pointer border border-slate-200"
            >
              <img
                src={EXACT_IMAGES.lectureHallAngle2}
                alt="Lecture Hall Angle 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] text-white font-bold truncate">Classroom Perspective 2</span>
            </div>

            <div
              onClick={() => setPreviewImage({
                src: EXACT_IMAGES.lectureHallAngle3,
                title: 'Lecture Hall & Classrooms (Perspective 3)',
                subtitle: 'Wide view highlighting expansive floor space, window grilles, and daylighting.'
              })}
              className="group relative rounded-xl overflow-hidden h-28 bg-slate-800 cursor-pointer border border-slate-200"
            >
              <img
                src={EXACT_IMAGES.lectureHallAngle3}
                alt="Lecture Hall Angle 3"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] text-white font-bold truncate">Classroom Perspective 3</span>
            </div>

            <div
              onClick={() => setPreviewImage({
                src: EXACT_IMAGES.computerSuite2,
                title: 'CBT Computer Workstations (Perspective 2)',
                subtitle: 'Close-up of computer terminals, partition dividers, and red executive chairs.'
              })}
              className="group relative rounded-xl overflow-hidden h-28 bg-slate-800 cursor-pointer border border-slate-200"
            >
              <img
                src={EXACT_IMAGES.computerSuite2}
                alt="CBT Computer Suite Angle 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] text-white font-bold truncate">CBT Terminals Close-up</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 1: SUITABLE SPACES AVAILABLE FOR                 */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200/80 space-y-6">
          
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-2.5 h-7 bg-amber-500 rounded-full" />
            <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-wide text-gray-900">
              SUITABLE SPACES AVAILABLE FOR:
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suitableSpaces.map((space, idx) => {
              const Icon = space.icon;
              const isChosen = selectedSpace === space.title;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedSpace(space.title)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isChosen
                      ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-400/30 shadow-md'
                      : 'bg-slate-50/80 hover:bg-white border-slate-200 hover:border-amber-300 hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#0b2138] text-white flex items-center justify-center shadow-sm">
                        <Icon className="w-6 h-6 text-amber-400" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-200 text-gray-700">
                        {space.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-gray-900 leading-snug">
                        {space.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed mt-1.5 font-sans">
                        {space.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xxs font-mono text-gray-500">
                    <span>Capacity: <strong className="text-gray-800">{space.capacity}</strong></span>
                    <span className="text-amber-600 font-bold">Select space &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ======================================================== */}
        {/* SECTION 2: KEY AMENITIES & FACILITIES INCLUDED           */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200/80 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-wide text-gray-900">
                KEY AMENITIES &amp; FACILITIES INCLUDED
              </h2>
            </div>

            <div className="px-3.5 py-1.5 bg-[#fef3c7] text-[#92400e] border border-[#d97706]/70 rounded-full text-xs font-mono font-bold tracking-tight inline-flex items-center gap-1.5 self-start sm:self-auto shadow-xs">
              <Clock className="w-3.5 h-3.5 text-[#d97706]" />
              <span>Flexible Hourly, Daily &amp; Long-term Rates Available</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {amenities.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3.5 hover:bg-white hover:border-amber-300 transition-all shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Icon className="w-5 h-5 text-teal-950" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-gray-900 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ======================================================== */}
        {/* SPECIAL DISCOUNT BANNER                                  */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-teal-950 p-4 sm:p-5 rounded-2xl shadow-lg border border-amber-600 flex items-center justify-center gap-3 text-center">
          <Sparkles className="w-5 h-5 text-teal-950 shrink-0" />
          <span className="text-sm sm:text-base font-black tracking-wide font-sans">
            Special Discount for Recurring Fellowships &amp; Educational Programs!
          </span>
        </div>

        {/* ======================================================== */}
        {/* BOOKING ENQUIRIES & VENUE ADDRESS (Bento Box from Flyer) */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-br from-[#081b30] to-[#040e1b] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-slate-800">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* LEFT SIDE: VENUE & ADDRESS */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500 text-teal-950 rounded-full text-xs font-mono font-black uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>VENUE &amp; ADDRESS</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white uppercase">
                  BRIDGE COLLEGE OF NURSING
                </h3>

                <p className="text-sm text-slate-300 font-sans leading-relaxed">
                  Harriet Shoroye Street, Off Araoye Heritage Estate, Off Akala Express,{' '}
                  <strong className="text-amber-400 font-bold">Ibadan, Oyo State</strong>.
                </p>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Located in a peaceful, secure gated environment devoid of bustling city traffic noise, offering your guests and students peak comfort and prestige.
                </p>
              </div>

              <div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Harriet+Shoroye+Street+Off+Akala+Express+Ibadan+Oyo+State+Nigeria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 font-mono transition-colors group underline decoration-amber-400/50 underline-offset-4"
                >
                  <span>Open in Google Maps Directions</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* RIGHT SIDE: FOR ENQUIRIES WHATSAPP ONLY CARD */}
            <div className="lg:col-span-7 bg-[#0b2440] p-6 sm:p-8 rounded-2xl border border-teal-800/60 shadow-xl flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <span className="text-xs font-mono font-black tracking-widest text-amber-400 uppercase block">
                  FOR ENQUIRIES: WHATSAPP ONLY
                </span>

                {/* LINE 1: NIGERIA WHATSAPP */}
                <a
                  href="https://wa.me/2347017514313?text=Hello%20Bridge%20College%2C%20I%20am%20inquiring%20about%20spaces%20for%20rent%20at%20Bridge%20College%20of%20Nursing."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-[#07192c] hover:bg-[#092036] rounded-xl border border-teal-700/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-teal-950 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base font-bold font-mono text-white tracking-wide">
                      +2347017514313
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500 text-teal-950 font-black font-mono text-[10px] uppercase rounded tracking-wider shadow-xs">
                    WHATSAPP ONLY
                  </span>
                </a>

                {/* LINE 2: UK / INTERNATIONAL WHATSAPP */}
                <a
                  href="https://wa.me/447912495161?text=Hello%20Bridge%20College%2C%20I%20am%20inquiring%20about%20spaces%20for%20rent%20at%20Bridge%20College%20of%20Nursing."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 bg-[#07192c] hover:bg-[#092036] rounded-xl border border-teal-700/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-teal-950 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base font-bold font-mono text-white tracking-wide">
                      +447912495161
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500 text-teal-950 font-black font-mono text-[10px] uppercase rounded tracking-wider shadow-xs">
                    WHATSAPP ONLY
                  </span>
                </a>

                {/* LINE 3: EMAIL */}
                <a
                  href="mailto:bridgecollegeofnursing@gmail.com?subject=Space%20Rental%20Enquiry%20-%20Bridge%20College"
                  className="flex items-center gap-3 p-3.5 bg-[#07192c] hover:bg-[#092036] rounded-xl border border-teal-700/50 transition-all group"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold font-mono text-slate-200 group-hover:text-white transition-colors truncate">
                    bridgecollegeofnursing@gmail.com
                  </span>
                </a>
              </div>

              <div className="pt-2 text-xxs text-slate-400 font-sans border-t border-slate-800">
                ⚡ Rapid response guaranteed within 2 hours. Physical site walkthroughs can be scheduled Monday through Saturday.
              </div>

            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE INSPECTION & QUOTE BOOKING FORM              */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200">
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="text-center space-y-2">
              <span className="px-3 py-1 bg-amber-100 text-[#7c2d12] rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                Instant Reservation Request
              </span>
              <h3 className="text-2xl font-extrabold text-gray-900 font-display">
                Request Facility Quotation or Schedule Site Walkthrough
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-sans">
                Fill in your preferred event details below to initiate direct booking via our official campus WhatsApp desk.
              </p>
            </div>

            <form onSubmit={handleWhatsAppBooking} className="space-y-4 text-xs font-sans">
              
              <div>
                <label className="font-bold text-gray-700 block mb-1">Space of Interest</label>
                <select
                  value={selectedSpace}
                  onChange={(e) => setSelectedSpace(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs text-gray-800 font-medium"
                >
                  {suitableSpaces.map((s, i) => (
                    <option key={i} value={s.title}>{s.title} ({s.capacity})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Your Name / Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pastor David / Apex Consult"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">WhatsApp Contact Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 803 123 4567"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={inquiryDate}
                    onChange={(e) => setInquiryDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Rental Duration</label>
                  <select
                    value={inquiryDuration}
                    onChange={(e) => setInquiryDuration(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                  >
                    <option value="Hourly">Hourly (Short Let)</option>
                    <option value="Full Day">Full Day</option>
                    <option value="Multi-Day">Multi-Day Workshop</option>
                    <option value="Weekly Recurring">Weekly Recurring (Fellowships)</option>
                    <option value="Monthly Long-term">Monthly Long-term Lease</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Expected Attendees</label>
                  <select
                    value={inquiryAttendees}
                    onChange={(e) => setInquiryAttendees(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                  >
                    <option value="Under 20 People">Under 20 People</option>
                    <option value="20 - 50 People">20 - 50 People</option>
                    <option value="50 - 150 People">50 - 150 People</option>
                    <option value="150 - 300+ People">150 - 300+ People</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Special Requirements (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Projector needed, sound system arrangement, weekend only..."
                  value={inquiryNotes}
                  onChange={(e) => setInquiryNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-amber-300" />
                <span>Send Booking Enquiry via WhatsApp (+2347017514313)</span>
              </button>

            </form>

          </div>
        </div>

      </div>

      {/* IMAGE ZOOM LIGHTBOX MODAL */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm p-4 sm:p-8 flex flex-col items-center justify-center animate-fadeIn cursor-pointer"
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
            title="Close Preview"
          >
            <X className="w-6 h-6" />
          </button>

          <div 
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl max-h-[85vh] flex flex-col items-center bg-[#071626] rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl"
          >
            <img
              src={previewImage.src}
              alt={previewImage.title}
              className="max-h-[68vh] w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="w-full p-4 sm:p-5 bg-[#0a1f33] text-white border-t border-teal-800/80">
              <h4 className="text-base sm:text-lg font-bold text-amber-400 font-sans">
                {previewImage.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5">
                {previewImage.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
