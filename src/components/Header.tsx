import { useState } from 'react';
import { Menu, X, Landmark, GraduationCap, Award, BookOpen, ShieldAlert, Sparkles, Sliders, Briefcase } from 'lucide-react';
import bconOfficialLogo from '../assets/images/bcon_official_logo.png';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
  portalLoggedIn: boolean;
  portalRole: string | null;
  onLogout: () => void;
  onOpenChat?: () => void;
  onOpenDashboard?: () => void;
  logoUrl?: string;
}

export default function Header({
  activeSection,
  setActiveSection,
  portalLoggedIn,
  portalRole,
  onLogout,
  onOpenChat,
  onOpenDashboard,
  logoUrl
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeLogo = logoUrl || bconOfficialLogo;

  const handleDashboardClick = () => {
    if (onOpenDashboard) {
      onOpenDashboard();
    } else {
      setActiveSection('dashboard');
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'programs', label: 'Programmes' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'careers', label: 'Careers' },
    { id: 'gallery', label: 'Campus Tour' },
    { id: 'space-rental', label: 'Space Rentals' },
    { id: 'news', label: 'Faculty & News' },
    { id: 'aichat', label: 'AI Advisor' },
    { id: 'contact', label: 'Contact Us' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-teal-750 shadow-sm" id="main_header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          
          {/* LOGO */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveSection('home')} id="header_logo_group">
            <div className="relative flex items-center justify-center w-[84px] h-[84px] rounded-full border-2 border-amber-500 bg-white overflow-hidden shadow-md shrink-0">
              <img
                src={activeLogo}
                alt="Bridge College of Nursing and Health Sciences Official Logo"
                className="w-full h-full object-contain p-0.5"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-teal-980 font-display tracking-wider leading-none uppercase">
                Bridge College
              </h1>
              <span className="text-xs sm:text-sm font-extrabold text-[#b45309] tracking-widest uppercase block mt-1">
                Of Nursing &amp; Health Sciences
              </span>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" id="desktop_navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`desktop_nav_${item.id}`}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  activeSection === item.id
                    ? 'text-teal-700 bg-teal-50'
                    : 'text-gray-600 hover:text-teal-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* PORTAL ACTIONS */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3" id="desktop_portal_controls">
            <button
              onClick={() => {
                if (onOpenChat) onOpenChat();
                else setActiveSection('aichat');
              }}
              className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-teal-950 font-bold text-xs uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 shadow-sm border border-amber-600/40"
              title="Open Bridge College AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-950" />
              Ask AI
            </button>

            <button
              id="btn_goto_dashboard_desktop"
              onClick={handleDashboardClick}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 border cursor-pointer ${
                activeSection === 'dashboard'
                  ? 'bg-amber-100 text-teal-950 border-amber-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-teal-900 border-slate-300'
              }`}
              title="Open Multi-Role Staff & Management Dashboard"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              Staff Dashboard
            </button>

            {portalLoggedIn ? (
              <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 py-1.5 px-3 rounded-lg">
                <div className="text-right">
                  <span className="text-xxs font-bold text-teal-600 uppercase tracking-widest block">Logged in as</span>
                  <span className="text-xs font-semibold text-gray-800 font-mono capitalize">{portalRole} Portal</span>
                </div>
                <button
                  id="btn_logout_desktop"
                  onClick={onLogout}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium text-xs px-3 py-1.5 rounded-md transition-all"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                id="btn_goto_portal_desktop"
                onClick={() => setActiveSection('portal')}
                className="bg-teal-750 hover:bg-teal-650 text-white font-bold font-display uppercase tracking-wider text-xs px-4 xl:px-5 py-3 transition-all hover:shadow-md flex items-center gap-2 border-b-4 border-amber-500 rounded-none cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                College Portal
              </button>
            )}
          </div>

          {/* MOBILE MENU TRIGGER */}
          <div className="lg:hidden flex items-center gap-2" id="mobile_trigger_wrapper">
            <button
              onClick={handleDashboardClick}
              className="bg-amber-500 hover:bg-amber-400 text-teal-950 px-2 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 cursor-pointer"
              id="mobile_quick_dashboard_button"
              title="Staff Dashboard"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            {!portalLoggedIn && (
              <button
                onClick={() => setActiveSection('portal')}
                className="bg-teal-600 text-white p-1.5 rounded-md text-xs font-semibold flex items-center gap-1"
                id="mobile_quick_portal_button"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Portal
              </button>
            )}
            <button
              id="mobile_menu_button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-teal-600 hover:bg-teal-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-teal-100 shadow-inner px-4 pt-2 pb-6 space-y-2 animate-fadeIn" id="mobile_navbar_drawer">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile_nav_${item.id}`}
              onClick={() => {
                setActiveSection(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all block ${
                activeSection === item.id
                  ? 'text-teal-700 bg-teal-50 border-l-4 border-teal-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-teal-50" id="mobile_drawer_portal_actions">
            {portalLoggedIn ? (
              <div className="space-y-2">
                <div className="p-3 bg-teal-50 rounded-lg text-center">
                  <span className="text-xxs font-semibold text-teal-600 uppercase block">Signed In</span>
                  <span className="text-sm font-bold text-teal-950 font-mono capitalize">{portalRole} Portal</span>
                </div>
                <button
                  id="btn_logout_mobile"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  id="btn_goto_dashboard_mobile"
                  onClick={() => {
                    handleDashboardClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-teal-950 text-center rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-teal-950" />
                  Staff &amp; Role Dashboard
                </button>
                <button
                  id="btn_goto_portal_mobile"
                  onClick={() => {
                    setActiveSection('portal');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 bg-teal-700 text-white text-center rounded-lg text-sm font-semibold shadow-md flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  Open Student &amp; Staff Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
