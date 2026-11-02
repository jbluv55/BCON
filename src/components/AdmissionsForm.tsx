import React, { useState } from 'react';
import { FileText, CheckCircle, AlertTriangle, Send, User, Award, ArrowRight, BookOpen } from 'lucide-react';
import { AdmissionFormSubmission } from '../types';

interface AdmissionsFormProps {
  programmes: { id: string; name: string }[];
  onSubmissionSuccess: (submission: AdmissionFormSubmission) => void;
}

export default function AdmissionsForm({ programmes, onSubmissionSuccess }: AdmissionsFormProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Female');
  const [stateOfOrigin, setStateOfOrigin] = useState('Oyo');
  const [programmeSelected, setProgrammeSelected] = useState(programmes[0]?.id || 'gen-nursing');
  
  // WAEC results
  const [english, setEnglish] = useState('A1');
  const [maths, setMaths] = useState('B2');
  const [biology, setBiology] = useState('B3');
  const [chemistry, setChemistry] = useState('C4');
  const [physics, setPhysics] = useState('C5');

  const gradeOptions = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'];

  const validateStep1 = () => {
    return fullName.trim() !== '' && email.trim() !== '' && phone.trim() !== '' && dob !== '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const submission: AdmissionFormSubmission = {
        id: 'ADM-' + Math.floor(1000 + Math.random() * 9000),
        fullName,
        email,
        phone,
        dob,
        gender,
        stateOfOrigin,
        programmeSelected: programmes.find(p => p.id === programmeSelected)?.name || programmeSelected,
        waecResults: {
          english,
          maths,
          biology,
          chemistry,
          physics
        },
        submittedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        status: 'Pending'
      };

      // Store in localStorage list of submissions
      const existingSubmissions = JSON.parse(localStorage.getItem('bridge_admissions') || '[]');
      existingSubmissions.unshift(submission);
      localStorage.setItem('bridge_admissions', JSON.stringify(existingSubmissions));

      onSubmissionSuccess(submission);
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-6 bg-teal-50 border border-teal-100 rounded-3xl" id="admission_success_screen">
        <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-white">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-teal-950 font-sans">Application Received!</h3>
        <p className="text-sm text-gray-700 mt-2 max-w-lg mx-auto leading-relaxed">
          Dear <strong className="text-teal-900">{fullName}</strong>, thank you for applying to Bridge College of Nursing. Your application code is <strong className="font-mono text-amber-600 px-1 py-0.5 bg-amber-50 rounded border border-amber-200">{ 'ADM-' + Math.floor(1000 + Math.random() * 9000) }</strong>.
        </p>

        <div className="bg-white p-5 rounded-2xl border border-teal-100 font-sans text-left mt-8 max-w-md mx-auto space-y-2 text-sm shadow-sm">
          <span className="font-mono text-xxs font-bold text-teal-600 uppercase tracking-widest block">Next Steps For Candidates:</span>
          <p className="text-gray-600 text-xs">
            1. We will verify your waec credits in Biology, Chemistry, and Physics.
          </p>
          <p className="text-gray-600 text-xs">
            2. High-scoring candidates will be prompted by mail to choose a computer entrance testing date.
          </p>
          <p className="text-gray-600 text-xs">
            3. Admission officers can approve your portal state in real time. Log in to the <strong>Staff/Registrar Portal</strong> on this website to inspect and approve your mock folder instantly!
          </p>
        </div>

        <button
          onClick={() => {
            setSubmitted(false);
            setStep(1);
            setFullName('');
            setEmail('');
            setPhone('');
            setDob('');
          }}
          className="mt-8 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-lg shadow"
          id="btn_apply_again"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-teal-100 shadow-xl overflow-hidden" id="admission_form_root">
      
      {/* FORM HEADER BANNER */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-950 py-8 px-8 border-b-4 border-amber-500 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <FileText className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-sans">Apply Online for RN / RM Admission</h3>
            <span className="text-xxs sm:text-xs font-mono tracking-wider text-teal-300 block uppercase">
              Bridge College of Nursing and Health Sciences, Nigeria
            </span>
          </div>
        </div>

        {/* STEPPER PROGRESS */}
        <div className="grid grid-cols-3 gap-2 mt-6 text-center text-xs font-semibold">
          <div className={`py-1.5 rounded ${step >= 1 ? 'bg-teal-750 text-white border border-teal-500' : 'text-teal-400'}`}>
            1. Biological Info
          </div>
          <div className={`py-1.5 rounded ${step >= 2 ? 'bg-teal-750 text-white border border-teal-500' : 'text-teal-400'}`}>
            2. WAEC O-Levels
          </div>
          <div className={`py-1.5 rounded ${step >= 3 ? 'bg-teal-750 text-white border border-teal-500' : 'text-teal-400'}`}>
            3. Final Review
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6" id="admission_form_core">
        
        {/* STEP 1: PERSONAL BIOLOGICAL DATA */}
        {step === 1 && (
          <div className="space-y-4" id="form_step_1">
            <div className="flex items-center gap-2 text-teal-800 border-b border-teal-50 pb-2 mb-2">
              <User className="w-5 h-5" />
              <h4 className="font-bold text-sm uppercase tracking-wider">Biological Details &amp; Programme Select</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Full Legal Name (Surname First) *</label>
                <input
                  id="inp_fullName"
                  type="text"
                  required
                  placeholder="e.g. Alao Adeleke Babajide"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address *</label>
                <input
                  id="inp_email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number (WhatsApp Preferred) *</label>
                <input
                  id="inp_phone"
                  type="tel"
                  required
                  placeholder="+234 801 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Date of Birth *</label>
                <input
                  id="inp_dob"
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Gender *</label>
                <select
                  id="inp_gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">State of Origin (Nigeria) *</label>
                <select
                  id="inp_state"
                  value={stateOfOrigin}
                  onChange={(e) => setStateOfOrigin(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Oyo">Oyo State</option>
                  <option value="Lagos">Lagos State</option>
                  <option value="Ogun">Ogun State</option>
                  <option value="Osun">Osun State</option>
                  <option value="Kwara">Kwara State</option>
                  <option value="Ondo">Ondo State</option>
                  <option value="Ekiti">Ekiti State</option>
                  <option value="Enugu">Enugu State</option>
                  <option value="FCT">Federal Capital Territory</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <label className="text-xs font-bold text-teal-850 block mb-1.5">Choice of Academic Programme *</label>
              <select
                id="inp_programme"
                value={programmeSelected}
                onChange={(e) => setProgrammeSelected(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-teal-50 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-900 font-bold"
              >
                {programmes.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!validateStep1()}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center gap-2"
                id="btn_step1_next"
              >
                Next Step: WAEC Results
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: WAEC SELECTION */}
        {step === 2 && (
          <div className="space-y-4" id="form_step_2">
            <div className="flex items-center gap-2 text-teal-800 border-b border-teal-50 pb-2 mb-2">
              <Award className="w-5 h-5 text-amber-500" />
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider">Senior School (WAEC/NECO/NABTEB) Credits</h4>
                <p className="text-xxs text-gray-500">Accredited colleges in Nigeria mandate English plus 4 Sciences at Credit levels (A1 - C6).</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Credit Threshold Rule:</strong> English Language, Mathematics, Biology, Chemistry, and Physics must be at grade <strong>C6</strong> or above to secure admission approvals dynamically.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3" id="waec_selection_matrix">
              <div>
                <label className="text-xs font-bold block mb-1 text-gray-800 text-center bg-gray-100 py-1 rounded">English *</label>
                <select
                  id="waec_english"
                  value={english}
                  onChange={(e) => setEnglish(e.target.value)}
                  className="w-full text-center py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                >
                  {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1 text-gray-800 text-center bg-gray-100 py-1 rounded">Mathematics *</label>
                <select
                  id="waec_maths"
                  value={maths}
                  onChange={(e) => setMaths(e.target.value)}
                  className="w-full text-center py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                >
                  {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1 text-gray-800 text-center bg-teal-50 text-teal-800 py-1 rounded">Biology *</label>
                <select
                  id="waec_biology"
                  value={biology}
                  onChange={(e) => setBiology(e.target.value)}
                  className="w-full text-center py-2.5 border border-teal-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 bg-teal-50 font-mono font-bold"
                >
                  {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1 text-gray-800 text-center bg-teal-50 text-teal-800 py-1 rounded">Chemistry *</label>
                <select
                  id="waec_chemistry"
                  value={chemistry}
                  onChange={(e) => setChemistry(e.target.value)}
                  className="w-full text-center py-2.5 border border-teal-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 bg-teal-50 font-mono font-bold"
                >
                  {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1 text-gray-800 text-center bg-teal-50 text-teal-800 py-1 rounded">Physics *</label>
                <select
                  id="waec_physics"
                  value={physics}
                  onChange={(e) => setPhysics(e.target.value)}
                  className="w-full text-center py-2.5 border border-teal-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 bg-teal-50 font-mono font-bold"
                >
                  {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold text-sm rounded-lg"
                id="btn_step2_prev"
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-lg shadow-sm flex items-center gap-2"
                id="btn_step2_next"
              >
                Next Step: Preview
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PREVIEW */}
        {step === 3 && (
          <div className="space-y-6" id="form_step_3">
            <div className="flex items-center gap-2 text-teal-800 border-b border-teal-50 pb-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              <h4 className="font-bold text-sm uppercase tracking-wider">Verify Application Data Summary</h4>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs tracking-wide">
              <div>
                <span className="text-gray-500 uppercase font-mono block">Program Enrolment</span>
                <span className="font-bold text-teal-900 text-sm">{programmes.find(p => p.id === programmeSelected)?.name}</span>
              </div>
              
              <div>
                <span className="text-gray-500 uppercase font-mono block">Full Candidate Name</span>
                <span className="font-bold text-gray-800 text-sm">{fullName}</span>
              </div>

              <div>
                <span className="text-gray-500 uppercase font-mono block">Email Address / Phone</span>
                <span className="font-bold text-gray-800 block text-xs">{email}</span>
                <span className="font-semibold text-gray-600 font-mono block">{phone}</span>
              </div>

              <div>
                <span className="text-gray-500 uppercase font-mono block">Gender / Origin</span>
                <span className="font-bold text-gray-850 text-xs">{gender} candidate ({stateOfOrigin} State)</span>
                <span className="text-gray-500 font-mono text-xxs block">Birth: {dob}</span>
              </div>
            </div>

            {/* WAEC LISTING */}
            <div className="bg-teal-950/5 text-teal-950 border border-teal-900/10 rounded-2xl p-5">
              <span className="text-xxs font-mono font-bold uppercase tracking-widest text-teal-600 block mb-2">Subject Grade Registry Verification:</span>
              <div className="flex flex-wrap gap-4 text-xs font-semibold font-mono">
                <span className="bg-white py-1.5 px-3 rounded-md shadow-sm border border-teal-100">English: <span className="text-amber-600">{english}</span></span>
                <span className="bg-white py-1.5 px-3 rounded-md shadow-sm border border-teal-100">Maths: <span className="text-amber-600">{maths}</span></span>
                <span className="bg-white py-1.5 px-3 rounded-md shadow-sm border border-teal-100">Biology: <span className="text-teal-600">{biology}</span></span>
                <span className="bg-white py-1.5 px-3 rounded-md shadow-sm border border-teal-100">Chemistry: <span className="text-teal-600">{chemistry}</span></span>
                <span className="bg-white py-1.5 px-3 rounded-md shadow-sm border border-teal-100">Physics: <span className="text-teal-600">{physics}</span></span>
              </div>
            </div>

            <div className="text-center font-sans text-xs text-gray-500 leading-relaxed max-w-lg mx-auto">
              By submitting, you certify that the provided grades fully match your original terminal senior certifications. All entries are subject to immediate audit at our Ibadan administrative halls.
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold text-sm rounded-lg"
                id="btn_step3_prev"
              >
                Back to Grades
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-700 to-teal-900 hover:from-teal-800 hover:to-teal-950 disabled:from-teal-300 disabled:to-teal-400 text-white font-bold text-sm rounded-lg shadow-md flex items-center gap-2 border-b-2 border-teal-950"
                id="btn_submit_final"
              >
                {submitting ? 'Submitting File...' : 'Submit Application Now'}
                <Send className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
