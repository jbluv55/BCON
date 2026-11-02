import React, { useState } from 'react';
import { 
  FileEdit, Save, CheckCircle2, Award, Phone, Mail, MapPin, 
  Clock, Hash, Sparkles, Calendar, BookOpen
} from 'lucide-react';
import { SiteCopy, siteContentStore } from '../../services/siteContentStore';

interface ContentTabProps {
  siteCopy: SiteCopy;
  canEditCopy: boolean;
}

export default function ContentTab({ siteCopy, canEditCopy }: ContentTabProps) {
  // Hero section form
  const [accreditationTag, setAccreditationTag] = useState(siteCopy.hero.accreditationTag);
  const [headline, setHeadline] = useState(siteCopy.hero.headline);
  const [subheadline, setSubheadline] = useState(siteCopy.hero.subheadline);
  const [ctaPrimary, setCtaPrimary] = useState(siteCopy.hero.ctaPrimary);
  const [ctaSecondary, setCtaSecondary] = useState(siteCopy.hero.ctaSecondary);

  // Contact section form
  const [address, setAddress] = useState(siteCopy.contact.address);
  const [phone, setPhone] = useState(siteCopy.contact.phone);
  const [whatsapp, setWhatsapp] = useState(siteCopy.contact.whatsapp);
  const [email, setEmail] = useState(siteCopy.contact.email);
  const [hours, setHours] = useState(siteCopy.contact.hours);

  // Stats form
  const [studentCapacity, setStudentCapacity] = useState(siteCopy.stats.studentCapacity);
  const [passRate, setPassRate] = useState(siteCopy.stats.passRate);
  const [hospitalPartners, setHospitalPartners] = useState(siteCopy.stats.hospitalPartners);
  const [nmcnApprovalYear, setNmcnApprovalYear] = useState(siteCopy.stats.nmcnApprovalYear);

  // Admissions notice form
  const [batch, setBatch] = useState(siteCopy.admissionsNotice.batch);
  const [portalNotice, setPortalNotice] = useState(siteCopy.admissionsNotice.portalNotice);
  const [deadline, setDeadline] = useState(siteCopy.admissionsNotice.deadline);
  const [screeningDate, setScreeningDate] = useState(siteCopy.admissionsNotice.screeningDate);

  const [savedToast, setSavedToast] = useState(false);

  const handleSaveAllContent = (e: React.FormEvent) => {
    e.preventDefault();
    siteContentStore.updateSiteCopy({
      hero: {
        accreditationTag,
        headline,
        subheadline,
        ctaPrimary,
        ctaSecondary
      },
      contact: {
        address,
        phone,
        whatsapp,
        email,
        hours
      },
      stats: {
        studentCapacity,
        passRate,
        hospitalPartners,
        nmcnApprovalYear
      },
      admissionsNotice: {
        batch,
        portalNotice,
        deadline,
        screeningDate
      }
    });

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-8">
      
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-gray-900">Site Copy &amp; Text Content Editor</h3>
          <p className="text-xs text-gray-500">
            Edit live text strings across the Bridge College public website. Changes apply immediately upon saving.
          </p>
        </div>

        {canEditCopy && (
          <div className="flex items-center gap-3">
            {savedToast && (
              <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" /> All Changes Published Live!
              </span>
            )}
            <button
              onClick={handleSaveAllContent}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save &amp; Update Site
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveAllContent} className="space-y-8 text-xs font-sans">
        
        {/* 1. HOMEPAGE HERO SECTION */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Homepage Hero &amp; Tagline</h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-semibold block mb-1 text-gray-700">Accreditation Micro-Badge</label>
              <input
                type="text"
                disabled={!canEditCopy}
                value={accreditationTag}
                onChange={(e) => setAccreditationTag(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-gray-700">Hero Main Title / Headline</label>
              <input
                type="text"
                disabled={!canEditCopy}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-gray-700">Hero Subheadline / Mission Narrative</label>
              <textarea
                rows={3}
                disabled={!canEditCopy}
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1 text-gray-700">Primary CTA Button</label>
                <input
                  type="text"
                  disabled={!canEditCopy}
                  value={ctaPrimary}
                  onChange={(e) => setCtaPrimary(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">Secondary CTA Button</label>
                <input
                  type="text"
                  disabled={!canEditCopy}
                  value={ctaSecondary}
                  onChange={(e) => setCtaSecondary(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. CONTACT CHANNELS & CAMPUS DETAILS */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Phone className="w-4 h-4 text-teal-600" />
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Campus Contact Channels &amp; Address</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1 text-gray-700">Physical Campus Location</label>
              <input
                type="text"
                disabled={!canEditCopy}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-gray-700">Primary Telephone Line</label>
              <input
                type="text"
                disabled={!canEditCopy}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-gray-700">WhatsApp Inquiry Line</label>
              <input
                type="text"
                disabled={!canEditCopy}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-gray-700">Official Campus Email</label>
              <input
                type="text"
                disabled={!canEditCopy}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold block mb-1 text-gray-700">Campus Walkthrough &amp; Visiting Hours</label>
              <input
                type="text"
                disabled={!canEditCopy}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 3. INSTITUTIONAL KEY NUMBERS / METRICS */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Hash className="w-4 h-4 text-indigo-600" />
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Key Institutional Metrics</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1 text-gray-700">Student Capacity</label>
              <input
                type="text"
                disabled={!canEditCopy}
                value={studentCapacity}
                onChange={(e) => setStudentCapacity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-gray-700">Pass Rate Target</label>
              <input
                type="text"
                disabled={!canEditCopy}
                value={passRate}
                onChange={(e) => setPassRate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-gray-700">Clinical Hospital Partners</label>
              <input
                type="text"
                disabled={!canEditCopy}
                value={hospitalPartners}
                onChange={(e) => setHospitalPartners(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-gray-700">NMCN Accreditation Reference</label>
              <input
                type="text"
                disabled={!canEditCopy}
                value={nmcnApprovalYear}
                onChange={(e) => setNmcnApprovalYear(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
              />
            </div>
          </div>
        </div>

        {/* 4. ADMISSIONS NOTICE & TIMETABLE */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Admissions Timetable &amp; Screening Notices</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1 text-gray-700">Admission Batch</label>
              <input
                type="text"
                disabled={!canEditCopy}
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-gray-700">Application Deadline</label>
              <input
                type="text"
                disabled={!canEditCopy}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold block mb-1 text-gray-700">Portal Status Notice</label>
              <input
                type="text"
                disabled={!canEditCopy}
                value={portalNotice}
                onChange={(e) => setPortalNotice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold block mb-1 text-gray-700">Screening &amp; CBT Mock Exam Date</label>
              <input
                type="text"
                disabled={!canEditCopy}
                value={screeningDate}
                onChange={(e) => setScreeningDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {canEditCopy && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save All Text Updates
            </button>
          </div>
        )}

      </form>

    </div>
  );
}
