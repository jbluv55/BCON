import React, { useState } from 'react';
import { 
  Briefcase, Plus, Edit3, Trash2, CheckCircle2, XCircle, Clock, 
  FileText, User, Mail, Phone, Eye, Search, Filter, AlertCircle, Save, X
} from 'lucide-react';
import { JobPosting, JobApplication, siteContentStore } from '../../services/siteContentStore';

interface CareersTabProps {
  jobs: JobPosting[];
  applications: JobApplication[];
  canManageCareers: boolean;
  canReviewApplications: boolean;
}

export default function CareersTab({ 
  jobs, 
  applications, 
  canManageCareers, 
  canReviewApplications 
}: CareersTabProps) {
  const [subTab, setSubTab] = useState<'postings' | 'applications'>('postings');
  
  // Job modal states
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  // Form fields for new/edit job
  const [formTitle, setFormTitle] = useState('');
  const [formDepartment, setFormDepartment] = useState<JobPosting['department']>('Academic Nursing');
  const [formType, setFormType] = useState<JobPosting['type']>('Full-Time');
  const [formLocation, setFormLocation] = useState('Ibadan Main Campus, Oyo State');
  const [formExperience, setFormExperience] = useState('2 - 4 Years Experience');
  const [formSalary, setFormSalary] = useState('Competitive (CONUASS Aligned)');
  const [formDeadline, setFormDeadline] = useState('December 31, 2026');
  const [formStatus, setFormStatus] = useState<JobPosting['status']>('Open');
  const [formSummary, setFormSummary] = useState('');
  const [formResponsibilities, setFormResponsibilities] = useState('');
  const [formRequirements, setFormRequirements] = useState('');
  const [formBenefits, setFormBenefits] = useState('');

  // Application reviewer modal
  const [viewingApp, setViewingApp] = useState<JobApplication | null>(null);
  const [appStatusNote, setAppStatusNote] = useState('');
  const [appFilterStatus, setAppFilterStatus] = useState<string>('All');
  const [appSearch, setAppSearch] = useState('');

  // Open job modal for create
  const handleOpenCreateJob = () => {
    setEditingJobId(null);
    setFormTitle('');
    setFormDepartment('Academic Nursing');
    setFormType('Full-Time');
    setFormLocation('Ibadan Main Campus, Oyo State');
    setFormExperience('2 - 4 Years Experience');
    setFormSalary('Competitive (CONUASS Aligned)');
    setFormDeadline('December 31, 2026');
    setFormStatus('Open');
    setFormSummary('');
    setFormResponsibilities('Deliver course didactic and practical sequences.\nValidate student competencies in clinical labs.\nConduct student evaluation and mentoring.');
    setFormRequirements('Relevant Degree (B.N.Sc / M.Sc / B.MLS).\nActive practicing license with regulatory council.\nStrong dedication to student mentorship.');
    setFormBenefits('Contributory pension & health coverage.\nContinuous professional development sponsorship.');
    setIsJobModalOpen(true);
  };

  // Open job modal for edit
  const handleOpenEditJob = (job: JobPosting) => {
    setEditingJobId(job.id);
    setFormTitle(job.title);
    setFormDepartment(job.department);
    setFormType(job.type);
    setFormLocation(job.location);
    setFormExperience(job.experience);
    setFormSalary(job.salary);
    setFormDeadline(job.deadline);
    setFormStatus(job.status);
    setFormSummary(job.summary);
    setFormResponsibilities(job.responsibilities.join('\n'));
    setFormRequirements(job.requirements.join('\n'));
    setFormBenefits(job.benefits.join('\n'));
    setIsJobModalOpen(true);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSummary.trim()) return;

    const responsibilitiesArr = formResponsibilities
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const requirementsArr = formRequirements
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const benefitsArr = formBenefits
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingJobId) {
      siteContentStore.updateJob(editingJobId, {
        title: formTitle,
        department: formDepartment,
        type: formType,
        location: formLocation,
        experience: formExperience,
        salary: formSalary,
        deadline: formDeadline,
        status: formStatus,
        summary: formSummary,
        responsibilities: responsibilitiesArr,
        requirements: requirementsArr,
        benefits: benefitsArr
      });
    } else {
      siteContentStore.addJob({
        title: formTitle,
        department: formDepartment,
        type: formType,
        location: formLocation,
        experience: formExperience,
        salary: formSalary,
        deadline: formDeadline,
        status: formStatus,
        summary: formSummary,
        responsibilities: responsibilitiesArr,
        requirements: requirementsArr,
        benefits: benefitsArr
      });
    }

    setIsJobModalOpen(false);
  };

  const handleDeleteJob = (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove the job opening "${title}"?`)) {
      siteContentStore.deleteJob(id);
    }
  };

  const handleToggleJobStatus = (job: JobPosting) => {
    const nextStatus = job.status === 'Open' ? 'Closed' : 'Open';
    siteContentStore.updateJob(job.id, { status: nextStatus });
  };

  // Filtered applications
  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.candidateName.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.email.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.id.toLowerCase().includes(appSearch.toLowerCase());
    const matchesStatus = appFilterStatus === 'All' || app.status === appFilterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateAppStatus = (appId: string, status: JobApplication['status']) => {
    siteContentStore.updateApplicationStatus(appId, status, appStatusNote);
    if (viewingApp && viewingApp.id === appId) {
      setViewingApp(prev => prev ? { ...prev, status, adminNotes: appStatusNote } : null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub tabs: Postings vs Applications */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('postings')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              subTab === 'postings'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Job Postings ({jobs.length})
          </button>

          {canReviewApplications && (
            <button
              onClick={() => setSubTab('applications')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                subTab === 'applications'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Candidate Applications ({applications.length})
              {applications.filter(a => a.status === 'New').length > 0 && (
                <span className="px-1.5 py-0.5 bg-amber-400 text-teal-950 font-mono text-xxs font-black rounded-full">
                  {applications.filter(a => a.status === 'New').length} New
                </span>
              )}
            </button>
          )}
        </div>

        {subTab === 'postings' && canManageCareers && (
          <button
            onClick={handleOpenCreateJob}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-teal-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Post New Career Vacancy
          </button>
        )}
      </div>

      {/* ================= POSTINGS SUB-TAB ================= */}
      {subTab === 'postings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-teal-300 transition-all"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xxs font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-teal-50 text-teal-800 rounded border border-teal-100">
                      {job.department}
                    </span>
                    <button
                      onClick={() => canManageCareers && handleToggleJobStatus(job)}
                      disabled={!canManageCareers}
                      className={`text-xxs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded cursor-pointer ${
                        job.status === 'Open'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      title={canManageCareers ? 'Click to toggle status' : ''}
                    >
                      ● {job.status}
                    </button>
                    <span className="text-xxs text-gray-400 font-mono">
                      Posted: {job.postedDate}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-gray-900">{job.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1">{job.summary}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xxs text-gray-500 pt-1">
                    <span><strong>Type:</strong> {job.type}</span>
                    <span>&bull;</span>
                    <span><strong>Experience:</strong> {job.experience}</span>
                    <span>&bull;</span>
                    <span><strong>Deadline:</strong> {job.deadline}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {canManageCareers && (
                    <>
                      <button
                        onClick={() => handleOpenEditJob(job)}
                        className="p-2 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors border border-teal-200"
                        title="Edit Job Vacancy"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id, job.title)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= APPLICATIONS SUB-TAB ================= */}
      {subTab === 'applications' && canReviewApplications && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-grow max-w-md">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidate name, job title, or email..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="w-full text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 font-semibold">Status:</span>
              <select
                value={appFilterStatus}
                onChange={(e) => setAppFilterStatus(e.target.value)}
                className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Rejected">Rejected</option>
                <option value="Hired">Hired</option>
              </select>
            </div>
          </div>

          {/* List of Applications */}
          {filteredApps.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-gray-500 text-xs">
              No applications found matching search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xxs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {app.id}
                      </span>
                      <span className={`text-xxs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        app.status === 'New' ? 'bg-amber-100 text-amber-800 font-black' :
                        app.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'Interview Scheduled' ? 'bg-indigo-100 text-indigo-800' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {app.status}
                      </span>
                      <span className="text-xxs text-gray-400 font-mono">
                        Applied: {app.appliedAt}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-gray-900">{app.candidateName}</h4>
                    <p className="text-xs text-teal-700 font-medium">Applied for: {app.jobTitle}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xxs text-gray-500 pt-1">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-gray-400" /> {app.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-gray-400" /> {app.phone}</span>
                      {app.nmcnNumber && <span>&bull; NMCN: {app.nmcnNumber}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setViewingApp(app);
                        setAppStatusNote(app.adminNotes || '');
                      }}
                      className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Review Profile &amp; CV
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ================= CREATE / EDIT JOB MODAL ================= */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xxs font-mono font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {editingJobId ? 'Edit Vacancy' : 'New Career Posting'}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {editingJobId ? 'Modify Job Advertisement' : 'Publish New Career Opportunity'}
                </h3>
              </div>
              <button onClick={() => setIsJobModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs font-sans">
              
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Position / Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Lecturer in Midwifery Sciences"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Department</label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value as JobPosting['department'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="Academic Nursing">Academic Nursing</option>
                    <option value="Clinical Training & Midwifery">Clinical Training & Midwifery</option>
                    <option value="Medical Laboratory Sciences">Medical Laboratory Sciences</option>
                    <option value="ICT & Examinations">ICT & Examinations</option>
                    <option value="Administration & Accounts">Administration & Accounts</option>
                    <option value="Facility & Security">Facility & Security</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Employment Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as JobPosting['type'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Adjunct">Adjunct</option>
                    <option value="Clinical Preceptor">Clinical Preceptor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Experience Required</label>
                  <input
                    type="text"
                    placeholder="e.g. 3+ Years Clinical Teaching"
                    value={formExperience}
                    onChange={(e) => setFormExperience(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Salary / Remuneration</label>
                  <input
                    type="text"
                    placeholder="CONUASS Aligned / Competitive"
                    value={formSalary}
                    onChange={(e) => setFormSalary(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Application Deadline</label>
                  <input
                    type="text"
                    placeholder="e.g. December 31, 2026"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as JobPosting['status'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Summary / Role Brief *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Provide a concise 1-2 sentence overview of the vacancy..."
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Key Responsibilities (One per line)</label>
                <textarea
                  rows={3}
                  value={formResponsibilities}
                  onChange={(e) => setFormResponsibilities(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Minimum Qualifications &amp; Licenses (One per line)</label>
                <textarea
                  rows={3}
                  value={formRequirements}
                  onChange={(e) => setFormRequirements(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Benefits &amp; Perks (One per line)</label>
                <textarea
                  rows={2}
                  value={formBenefits}
                  onChange={(e) => setFormBenefits(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-gray-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs uppercase tracking-wider"
                >
                  {editingJobId ? 'Save Changes' : 'Publish Vacancy'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= REVIEW APPLICATION MODAL ================= */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xxs font-mono font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded">
                  Application Dossier &bull; {viewingApp.id}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{viewingApp.candidateName}</h3>
                <p className="text-xs text-teal-800 font-medium">Applied for: {viewingApp.jobTitle}</p>
              </div>
              <button onClick={() => setViewingApp(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Applicant details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-gray-400 block text-xxs uppercase">Contact Email</span>
                <span className="font-semibold text-gray-800">{viewingApp.email}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xxs uppercase">Phone Number</span>
                <span className="font-semibold text-gray-800">{viewingApp.phone}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xxs uppercase">Highest Qualification</span>
                <span className="font-semibold text-gray-800">{viewingApp.qualification}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xxs uppercase">NMCN / Professional License</span>
                <span className="font-semibold text-gray-800">{viewingApp.nmcnNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xxs uppercase">Experience Level</span>
                <span className="font-semibold text-gray-800">{viewingApp.experienceYears}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xxs uppercase">Submission Date</span>
                <span className="font-semibold text-gray-800">{viewingApp.appliedAt}</span>
              </div>
            </div>

            {/* Statement of Interest */}
            <div className="space-y-1">
              <span className="text-xxs font-mono font-bold uppercase tracking-wider text-gray-400">Statement of Interest / Cover Letter</span>
              <p className="text-xs text-gray-700 bg-white p-4 rounded-xl border border-slate-200 leading-relaxed">
                {viewingApp.coverLetter}
              </p>
            </div>

            {/* CV Attachment card */}
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-700" />
                <span className="font-bold text-teal-950">{viewingApp.cvFileName}</span>
              </div>
              <span className="text-xxs font-mono text-teal-700 bg-white px-2 py-1 rounded border border-teal-200">
                Validated PDF
              </span>
            </div>

            {/* Reviewer Status Actions */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-gray-700 block">HR Reviewer Notes</label>
              <textarea
                rows={2}
                placeholder="Add internal notes on interview scheduling or candidate qualifications..."
                value={appStatusNote}
                onChange={(e) => setAppStatusNote(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-xs text-gray-500">Current Status: <strong>{viewingApp.status}</strong></span>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleUpdateAppStatus(viewingApp.id, 'Shortlisted')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() => handleUpdateAppStatus(viewingApp.id, 'Interview Scheduled')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
                  >
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => handleUpdateAppStatus(viewingApp.id, 'Rejected')}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      siteContentStore.updateApplicationStatus(viewingApp.id, viewingApp.status, appStatusNote);
                      setViewingApp(null);
                    }}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold"
                  >
                    Save &amp; Close
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
