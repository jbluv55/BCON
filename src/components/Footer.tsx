import { Mail, Phone, MapPin, Award, CheckCircle2, Shield } from 'lucide-react';
import bconOfficialLogo from '../assets/images/bcon_official_logo.png';

interface FooterProps {
  setActiveSection: (sec: string) => void;
  onOpenDashboard?: () => void;
  logoUrl?: string;
}

export default function Footer({ setActiveSection, onOpenDashboard, logoUrl }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const activeLogo = logoUrl || bconOfficialLogo;

  return (
    <footer className="bg-teal-980 text-teal-100 pt-16 pb-8 border-t-4 border-amber-500" id="main_footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* COL 1: MISSION/LOGO */}
        <div className="space-y-4" id="footer_brand_column">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full overflow-hidden flex items-center justify-center border border-amber-500 shadow-md p-0.5 shrink-0">
              <img
                src={activeLogo}
                alt="Bridge College Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-bold text-white uppercase tracking-tight block">Bridge College</span>
              <span className="text-xxs text-amber-400 font-semibold uppercase block">Nursing &amp; Health Sciences</span>
            </div>
          </div>
          <p className="text-sm text-teal-200 leading-relaxed font-sans">
            Bridging academic theories with elite clinical practice to build the next generation of empathetic, highly skilled health custodians for Oyo State and the global community.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs text-amber-300 font-mono">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Accredited by NMCN</span>
          </div>
        </div>

        {/* COL 2: IMPORTANT LINKS */}
        <div className="space-y-4" id="footer_links_column">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b-2 border-teal-800 pb-2 font-display">
            Institutional Links
          </h3>
          <ul className="space-y-2 text-sm text-teal-200">
            <li>
              <button onClick={() => setActiveSection('about')} className="hover:text-white hover:underline transition-all">
                About the College
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection('programs')} className="hover:text-white hover:underline transition-all">
                Academic Programmes
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection('admissions')} className="hover:text-white hover:underline transition-all">
                Admission Portal
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection('careers')} className="hover:text-white hover:underline transition-all text-amber-300 font-semibold flex items-center gap-1.5">
                <span>💼 Careers &amp; Vacancies</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection('gallery')} className="hover:text-white hover:underline transition-all">
                Campus Gallery Tour
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection('space-rental')} className="hover:text-white hover:underline transition-all text-amber-400 font-semibold flex items-center gap-1.5">
                <span>🏢 Spaces for Rent (Commercial)</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection('aichat')} className="hover:text-white hover:underline transition-all text-teal-200 font-semibold flex items-center gap-1.5">
                <span>✨ AI Advisor &amp; Tutor</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActiveSection('portal')} className="hover:text-white hover:underline transition-all font-mono font-semibold">
                Student &amp; Staff E-Portal
              </button>
            </li>
            <li>
              <button 
                onClick={() => onOpenDashboard ? onOpenDashboard() : setActiveSection('dashboard')} 
                className="hover:text-white hover:underline transition-all text-teal-300 font-mono text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>⚙️ Staff Management Dashboard</span>
              </button>
            </li>
          </ul>
        </div>

        {/* COL 3: REGULATORY INFRASTRUCTURE */}
        <div className="space-y-4" id="footer_regulatory_column">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b-2 border-teal-800 pb-2 font-display">
            Regulatory Compliance
          </h3>
          <div className="space-y-3 text-xs text-teal-200">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>Full compliance with Core Curriculum frameworks of the Nursing &amp; Midwifery Council of Nigeria (NMCN).</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>Approved Oyo State Health Training Center of Excellence certification.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>Equipped clinical research and simulation wards matching global standards.</span>
            </div>
          </div>
        </div>

        {/* COL 4: CONTACT & LOCATION */}
        <div className="space-y-4" id="footer_contact_column">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b-2 border-teal-800 pb-2 font-display">
            Contact Channels
          </h3>
          <div className="space-y-3 text-sm text-teal-200 font-sans">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Harriet Shoroye Street, Off Araoye Heritage Estate, Off Akala Express, Ibadan, Oyo State, Nigeria.
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-5 h-5 text-amber-400 shrink-0" />
              <span>+234 701 7514 313</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="font-mono text-xs">info@bridgecollegeofnursing</span>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-teal-900 text-center" id="footer_copyright_row">
        <p className="text-xxs sm:text-xs text-teal-400 font-mono">
          &copy; {currentYear} Bridge College of Nursing and Health Sciences. Harriet Shoroye St, Off Akala Express, Ibadan. All Rights Reserved.
        </p>
        <p className="text-xxs text-teal-500 mt-1">
          Designed with elite standards in Nursing Education &amp; ICT.
        </p>
      </div>
    </footer>
  );
}
