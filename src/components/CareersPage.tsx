import React, { useState } from 'react';
import { 
  Briefcase, MapPin, Calendar, Clock, DollarSign, Award, CheckCircle2, 
  ChevronRight, Search, Filter, Sparkles, Building2, User, Mail, Phone, 
  FileText, Upload, X, Shield, ArrowRight, HeartPulse, GraduationCap, Check
} from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';
import { JobPosting } from '../services/siteContentStore';

interface CareersPageProps {
  onBackToHome: () => void;
  onOpenDashboard?: () => void;
}

export default function CareersPage({ onBackToHome, onOpenDashboard }: CareersPageProps) {
  const { content, store } = useSiteContent();
  const jobs = content.jobs || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Selected job for detail modal / application
  const [activeJobDetail, setActiveJobDetail] = useState<JobPosting | null>(null);
  const [applyingJob, setApplyingJob] = useState<JobPosting | null>(null);

  // Application form fields
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [candidateQualification, setCandidateQualification] = useState('');
  const [candidateNmcn, setCandidateNmcn] = useState('');
  const [candidateExperience, setCandidateExperience] = useState('');
  const [candidateCoverLetter, setCandidateCoverLetter] = useState('');
  const [cvFileName, setCvFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSuccessId, setApplicationSuccessId] = useState<string | null>(null);

  // Spontaneous Talent Pool modal
  const [isTalentPoolOpen, setIsTalentPoolOpen] = useState(false);

  // Departments list for filter
  const departments = ['All', 'Academic Nursing', 'Clinical Training & Midwifery', 'Medical Laboratory Sciences', 'ICT & Examinations', 'Administration & Accounts'];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = selectedDepartment === 'All' || job.department === selectedDepartment;
    const matchesType = selectedType === 'All' || job.type === selectedType;

    return matchesSearch && matchesDept && matchesType;
  });

  const handleOpenApplication = (job: JobPosting) => {
    setApplyingJob(job);
    setActiveJobDetail(null);
    setApplicationSuccessId(null);
  };

  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFileName(e.target.files[0].name);
    }
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob || !candidateName.trim() || !candidateEmail.trim() || !candidatePhone.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const createdApp = store.addApplication({
        jobId: applyingJob.id,
        jobTitle: applyingJob.title,
        department: applyingJob.department,
        candidateName: candidateName.trim(),
        email: candidateEmail.trim(),
        phone: candidatePhone.trim(),
        qualification: candidateQualification || 'Degree in relevant discipline',
        nmcnNumber: candidateNmcn || undefined,
        experienceYears: candidateExperience || 'Demonstrated experience',
        coverLetter: candidateCoverLetter || 'Submitted via Bridge College Careers Portal',
        cvFileName: cvFileName || 'Resume_Uploaded.pdf'
      });

      setIsSubmitting(false);
      setApplicationSuccessId(createdApp.id);
      // Reset form
      setCandidateName('');
      setCandidateEmail('');
      setCandidatePhone('');
      setCandidateQualification('');
      setCandidateNmcn('');
      setCandidateExperience('');
      setCandidateCoverLetter('');
      setCvFileName('');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col font-sans" id="careers_page_root">
      
      {/* HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-teal-850 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500 shadow-md">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-teal-600/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              Faculty &amp; Staff Recruitment Portal
            </div>

            <button
              onClick={onBackToHome}
              className="text-xs font-medium text-teal-200 hover:text-white flex items-center gap-1.5 transition-colors bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/15"
            >
              &larr; Back to Main Website
            </button>
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight">
              Build the Future of <span className="text-amber-400">Nursing &amp; Healthcare</span> With Us
            </h1>
            <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed font-sans">
              Join Bridge College of Nursing &amp; Health Sciences in Ibadan, Oyo State. 
              We are seeking dedicated nurse educators, clinical preceptors, laboratory scientists, and administrative visionaries passionate about preparing empathetic, licensed health custodians.
            </p>
          </div>

          {/* KEY METRICS BENTO */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-4xl">
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-4 rounded-2xl">
              <span className="block text-2xl font-black text-amber-400 font-mono">
                {jobs.filter(j => j.status === 'Open').length}
              </span>
              <span className="text-xs text-teal-100 uppercase tracking-wider font-semibold">Active Openings</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-4 rounded-2xl">
              <span className="block text-2xl font-black text-amber-400 font-mono">NMCN</span>
              <span className="text-xs text-teal-100 uppercase tracking-wider font-semibold">Standard Curriculum</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-4 rounded-2xl">
              <span className="block text-2xl font-black text-amber-400 font-mono">CONUASS</span>
              <span className="text-xs text-teal-100 uppercase tracking-wider font-semibold">Competitive Packages</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-4 rounded-2xl">
              <span className="block text-2xl font-black text-amber-400 font-mono">Ibadan</span>
              <span className="text-xs text-teal-100 uppercase tracking-wider font-semibold">Off-Akala Express Wing</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH AND FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20 w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-teal-100 p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-7 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by job title, department, or keyword (e.g., Nursing Tutor, Preceptor, ICT)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
              />
            </div>

            {/* Job Type Selector */}
            <div className="md:col-span-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="All">All Employment Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Adjunct">Adjunct</option>
                <option value="Clinical Preceptor">Clinical Preceptor</option>
              </select>
            </div>

            {/* Clear Filters / Results count */}
            <div className="md:col-span-2 text-right">
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-3 py-2 rounded-lg border border-teal-100 block text-center">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'Opening' : 'Openings'}
              </span>
            </div>
          </div>

          {/* Department Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-gray-400 font-semibold uppercase text-xxs tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Dept:
            </span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedDepartment === dept
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* JOB LISTINGS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full space-y-6">
        
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No matching positions found</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              We could not find any active vacancies matching "{searchQuery}". Try clearing your filters or submit a spontaneous resume to our general talent pool.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDepartment('All');
                setSelectedType('All');
              }}
              className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl border border-teal-100 hover:border-teal-300 hover:shadow-xl transition-all p-6 sm:p-7 flex flex-col justify-between group"
                id={`job_card_${job.id}`}
              >
                <div className="space-y-4">
                  
                  {/* Top tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xxs font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-teal-50 text-teal-800 rounded-md border border-teal-100">
                      {job.department}
                    </span>
                    <span className={`text-xxs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      job.status === 'Open'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {job.status === 'Open' ? '● Accepting Applications' : job.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold font-sans text-gray-900 group-hover:text-teal-700 transition-colors leading-snug">
                    {job.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {job.summary}
                  </p>

                  {/* Quick Meta Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500 pt-2 border-t border-slate-100 font-sans">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Award className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">{job.experience}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>Deadline: {job.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveJobDetail(job)}
                    className="text-xs font-bold text-teal-700 hover:text-teal-850 hover:underline flex items-center gap-1"
                  >
                    View Responsibilities &rarr;
                  </button>

                  <button
                    onClick={() => handleOpenApplication(job)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-teal-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                  >
                    Apply Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SPONTANEOUS APPLICATION BANNER */}
        <div className="mt-12 bg-gradient-to-r from-teal-900 to-teal-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-teal-800">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xxs font-mono font-bold uppercase tracking-widest text-amber-400">
              Future Openings &amp; Adjunct Roster
            </span>
            <h3 className="text-2xl font-bold font-sans">
              Don't See Your Specialization Listed Today?
            </h3>
            <p className="text-xs sm:text-sm text-teal-200 leading-relaxed">
              We continually review credentials for clinical preceptors, visiting lecturers in anatomy, biochemistry, and maternal healthcare. Send your CV to our talent database.
            </p>
          </div>
          <button
            onClick={() => setIsTalentPoolOpen(true)}
            className="px-6 py-3 bg-white text-teal-950 hover:bg-amber-400 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md shrink-0 uppercase tracking-wider font-mono flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-teal-900" />
            Submit Talent Pool CV
          </button>
        </div>

        {/* WHY JOIN BRIDGE COLLEGE PERKS BENTO */}
        <div className="pt-12 space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xxs font-mono font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Faculty Environment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              Why Teach &amp; Practice at Bridge College?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              We nurture an environment of academic integrity, rigorous clinical practice, and continuous professional growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-gray-900">Modern Simulation Labs</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Teach in clinical laboratories equipped with multi-functional simulation mannequins, anatomical models, and diagnostic tools meeting NMCN criteria.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-gray-900">Continuous Faculty Development</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Staff receive sponsorship for mandatory continuous professional development (CPD) programs, workshops, and national nursing education summits.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-gray-900">Serene Campus &amp; Location</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Located on Harriet Shoroye Street off Akala Express, Ibadan. Enjoy a serene, secure perimeter away from metropolitan gridlock with standby power and high-speed Wi-Fi.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* JOB DETAIL MODAL */}
      {activeJobDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-teal-100 space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xxs font-mono font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded">
                  {activeJobDetail.department}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">{activeJobDetail.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2 font-sans">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-500" /> {activeJobDetail.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-teal-600" /> {activeJobDetail.type}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-600" /> {activeJobDetail.salary}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveJobDetail(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Position Overview</h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {activeJobDetail.summary}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Key Responsibilities</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                {activeJobDetail.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Minimum Qualifications &amp; Licensing</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                {activeJobDetail.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            {activeJobDetail.benefits && activeJobDetail.benefits.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">Remuneration &amp; Benefits</h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                  {activeJobDetail.benefits.map((ben, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <span className="text-xs text-gray-500 font-mono">
                Deadline: <strong className="text-gray-800">{activeJobDetail.deadline}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveJobDetail(null)}
                  className="px-4 py-2 border border-slate-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleOpenApplication(activeJobDetail)}
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5 uppercase tracking-wider"
                >
                  Proceed to Application &rarr;
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* JOB APPLICATION FORM MODAL */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-teal-100 space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xxs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded">
                  Official Application
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                  Apply: {applyingJob.title}
                </h2>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  Bridge College Recruitment Portal &bull; Department of {applyingJob.department}
                </p>
              </div>

              <button
                onClick={() => setApplyingJob(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applicationSuccessId ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4 animate-fadeIn">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900">Application Submitted Successfully!</h3>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Your application has been logged into the Bridge College HR &amp; Recruitment system with Reference ID:
                </p>
                <div className="inline-block bg-white px-4 py-2 rounded-xl border border-emerald-300 font-mono font-bold text-sm text-emerald-900 shadow-xs">
                  {applicationSuccessId}
                </div>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Our recruitment board and head of nursing will review your credentials. Shortlisted applicants will be contacted via email and telephone.
                </p>
                <button
                  onClick={() => setApplyingJob(null)}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="space-y-4 text-xs font-sans">
                
                {/* Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Full Name (Surname First) *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Adebayo, Victoria Funmilayo"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={candidateEmail}
                        onChange={(e) => setCandidateEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone & Qualification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Phone Number (WhatsApp Active) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        placeholder="+234 800 000 0000"
                        value={candidatePhone}
                        onChange={(e) => setCandidatePhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Highest Qualification *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. M.Sc Nursing, B.N.Sc, RN, RM, B.MLS"
                      value={candidateQualification}
                      onChange={(e) => setCandidateQualification(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* NMCN Number & Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      NMCN / Professional License No (if applicable)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. RN-098231 / RM-044211"
                      value={candidateNmcn}
                      onChange={(e) => setCandidateNmcn(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Years of Relevant Experience *
                    </label>
                    <select
                      value={candidateExperience}
                      onChange={(e) => setCandidateExperience(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                    >
                      <option value="">Select Experience</option>
                      <option value="1 - 2 Years">1 - 2 Years</option>
                      <option value="3 - 5 Years">3 - 5 Years</option>
                      <option value="6 - 10 Years">6 - 10 Years</option>
                      <option value="10+ Years">Over 10 Years (Senior Cadre)</option>
                    </select>
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Brief Statement of Interest / Suitability *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your teaching or clinical experience, pedagogical philosophy, and why you wish to teach at Bridge College of Nursing..."
                    value={candidateCoverLetter}
                    onChange={(e) => setCandidateCoverLetter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>

                {/* CV / Resume Upload */}
                <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <FileText className="w-5 h-5 text-teal-600" />
                    <span className="font-semibold text-xs">
                      {cvFileName ? `Attached: ${cvFileName}` : 'Attach Curriculum Vitae (PDF or DOCX)'}
                    </span>
                  </div>
                  <input
                    type="file"
                    id="cv-upload-input"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCvFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="cv-upload-input"
                    className="inline-block px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-slate-100 cursor-pointer shadow-xs"
                  >
                    {cvFileName ? 'Change File' : 'Browse Files'}
                  </label>
                  <p className="text-xxs text-gray-400">Max size 5MB. Standard academic curriculum vitae format.</p>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setApplyingJob(null)}
                    className="px-4 py-2 border border-slate-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 uppercase tracking-wider"
                  >
                    {isSubmitting ? 'Transmitting File...' : 'Submit Application'}
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* TALENT POOL MODAL */}
      {isTalentPoolOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-teal-100 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xxs font-mono font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded">
                  Roster Submission
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">Join the Academic Talent Pool</h3>
              </div>
              <button onClick={() => setIsTalentPoolOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Submit your curriculum vitae for future adjunct tutoring roles, external exam moderation, or specialized health laboratory projects.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you! Your profile has been saved to the Bridge College prospective faculty database.');
                setIsTalentPoolOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold block mb-1 text-gray-700">Your Full Name</label>
                <input required type="text" placeholder="Dr. / Mr. / Mrs. Full Name" className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
              </div>
              <div>
                <label className="font-semibold block mb-1 text-gray-700">Email Address</label>
                <input required type="email" placeholder="name@example.com" className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
              </div>
              <div>
                <label className="font-semibold block mb-1 text-gray-700">Field / Discipline of Expertise</label>
                <input required type="text" placeholder="e.g., Maternal & Child Health, Medical Microbiology, Nursing Informatics" className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider mt-2 shadow-sm"
              >
                Register into Talent Pool
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
