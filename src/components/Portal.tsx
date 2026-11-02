import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Key, FileSpreadsheet, ListChecks, CalendarRange, 
  BookOpen, PlusCircle, CheckCircle, XCircle, Clock, Trash2, Bell, Award, User, RefreshCw
} from 'lucide-react';
import { Announcement, LectureMaterial, TimetableEntry, ExamSchedule, Grade, AdmissionFormSubmission } from '../types';
import { studentAnnouncements, demoMaterials, demoTimetables, demoExams, demoGrades } from '../data';



interface PortalProps {
  initialSubmissions: AdmissionFormSubmission[];
}

export default function Portal({ initialSubmissions }: PortalProps) {
  const [role, setRole] = useState<'student' | 'registrar' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Portal State Data
  const [submissions, setSubmissions] = useState<AdmissionFormSubmission[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [materials, setMaterials] = useState<LectureMaterial[]>([]);
  const [timetables, setTimetables] = useState<TimetableEntry[]>([]);
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  // Student specific active states
  const [activeDay, setActiveDay] = useState('Monday');

  // Registrar forms
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnCategory, setNewAnnCategory] = useState<'academic' | 'general' | 'administrative'>('academic');

  // Load from local storage or fall back
  useEffect(() => {
    // 1. Admissions submissions
    const storedAdmissions = localStorage.getItem('bridge_admissions');
    if (storedAdmissions) {
      setSubmissions(JSON.parse(storedAdmissions));
    } else {
      setSubmissions(initialSubmissions.length > 0 ? initialSubmissions : [
        {
          id: 'ADM-8841',
          fullName: 'Olaleken Yusuf Adeola',
          email: 'yusuf.adeola@gmail.com',
          phone: '+234 812 345 6789',
          dob: '2005-08-14',
          gender: 'Male',
          stateOfOrigin: 'Oyo',
          programmeSelected: 'General Nursing Programme (RN)',
          waecResults: { english: 'B3', maths: 'B2', biology: 'A1', chemistry: 'B3', physics: 'C4' },
          submittedAt: '24/05/2026 10:14 AM',
          status: 'Pending'
        },
        {
          id: 'ADM-4932',
          fullName: 'Fatima Mohammed Bello',
          email: 'fatibello@yahoo.com',
          phone: '+234 905 987 6543',
          dob: '2006-02-19',
          gender: 'Female',
          stateOfOrigin: 'Kwara',
          programmeSelected: 'Basic Midwifery Programme (RM)',
          waecResults: { english: 'A1', maths: 'C4', biology: 'B2', chemistry: 'B2', physics: 'B3' },
          submittedAt: '23/05/2026 04:30 PM',
          status: 'Approved'
        }
      ]);
    }

    // 2. Announcements
    const storedAnn = localStorage.getItem('bridge_ann');
    if (storedAnn) {
      setAnnouncements(JSON.parse(storedAnn));
    } else {
      setAnnouncements(studentAnnouncements);
    }

    // 3. Materials
    setMaterials(demoMaterials);
    // 4. Timetable
    setTimetables(demoTimetables);
    // 5. Exams
    setExams(demoExams);
    // 6. Grades
    setGrades(demoGrades);
  }, [initialSubmissions]);

  // Handle Logins
  const handleStudentDemoLogin = () => {
    setRole('student');
    setLoginError('');
  };

  const handleRegistrarDemoLogin = () => {
    setRole('registrar');
    setLoginError('');
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'student' && password === 'password') {
      setRole('student');
    } else if (username === 'registrar' && password === 'password') {
      setRole('registrar');
    } else {
      setLoginError('Invalid matric / password credentials. Use the Demo login shortcuts for immediate trials.');
    }
  };

  const handleLogout = () => {
    setRole(null);
    setUsername('');
    setPassword('');
    setLoginError('');
  };

  // Admission Actions (Registrar)
  const updateSubmissionStatus = (id: string, nextStatus: 'Approved' | 'Rejected') => {
    const updated = submissions.map(sub => {
      if (sub.id === id) return { ...sub, status: nextStatus };
      return sub;
    });
    setSubmissions(updated);
    localStorage.setItem('bridge_admissions', JSON.stringify(updated));
  };

  // Add Announcement (Registrar)
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;

    const newAnn: Announcement = {
      id: 'ann-' + Math.floor(Math.random() * 1000),
      title: newAnnTitle,
      content: newAnnContent,
      date: new Date().toISOString().split('T')[0],
      category: newAnnCategory as any,
      sender: 'Office of the Registrar'
    };

    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('bridge_ann', JSON.stringify(updated));

    // Reset Form
    setNewAnnTitle('');
    setNewAnnContent('');
    alert('Announcement published successfully and synchronized with students feed!');
  };

  // Delete Announcement
  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter(sub => sub.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('bridge_ann', JSON.stringify(updated));
  };

  // Calculations
  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    const totalGP = grades.reduce((acc, curr) => acc + (curr.gp * curr.units), 0);
    const totalUnits = grades.reduce((acc, curr) => acc + curr.units, 0);
    return (totalGP / totalUnits).toFixed(2);
  };

  return (
    <div className="bg-slate-50 py-10 px-4 min-h-[600px] rounded-3xl border border-teal-100/50" id="portal_card_root">
      
      {/* 1. LOGIN SCREEN */}
      {!role && (
        <div className="max-w-md mx-auto" id="portal_login_window">
          <div className="bg-white rounded-3xl border border-teal-100 shadow-xl overflow-hidden p-8 space-y-6">
            
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-200">
                <GraduationCap className="w-6 h-6 text-teal-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-sans uppercase">College E-Portal</h3>
              <p className="text-xs text-gray-500 mt-1">Authorized access for Registered Nursing Candidates &amp; Academics</p>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-900 font-sans">
                {loginError}
              </div>
            )}

            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Matric Number / Email</label>
                <input
                  id="portal_user"
                  type="text"
                  placeholder="e.g. nurse_student or registrar@bridge.ng"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Secure Password</label>
                <input
                  id="portal_pass"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-lg shadow-sm border-b-2 border-teal-900 transition-all font-sans"
                id="btn_login_submit"
              >
                Sign In
              </button>
            </form>

            <div className="relative my-4 text-center">
              <span className="bg-white px-3 text-xxs font-mono text-gray-400 uppercase tracking-widest relative z-10">Demo Quick Access</span>
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2" />
            </div>

            {/* QUICK SHORTCUTS FOR CONVENIENT REVIEW */}
            <div className="grid grid-cols-2 gap-3" id="quick_login_shortcuts">
              <button
                id="btn_shortcut_student"
                type="button"
                onClick={handleStudentDemoLogin}
                className="py-3 px-3 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 hover:border-teal-400 rounded-xl text-center transition-all group"
              >
                <User className="w-5 h-5 mx-auto text-teal-600 mb-1 group-hover:scale-110 transition-all" />
                <span className="text-xs font-bold text-teal-950 block">Demo Student</span>
                <span className="text-[10px] text-gray-500 block font-mono">NUR-2026-001</span>
              </button>

              <button
                id="btn_shortcut_registrar"
                type="button"
                onClick={handleRegistrarDemoLogin}
                className="py-3 px-3 bg-gradient-to-br from-amber-50/50 to-orange-50 border border-amber-200 hover:border-amber-400 rounded-xl text-center transition-all group"
              >
                <Key className="w-5 h-5 mx-auto text-amber-600 mb-1 group-hover:scale-110 transition-all" />
                <span className="text-xs font-bold text-gray-900 block font-sans">Demo Registrar</span>
                <span className="text-[10px] text-gray-500 block font-mono">Emmanuel Alao</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. LOGGED-IN: STUDENT PORTAL VIEW */}
      {role === 'student' && (
        <div className="space-y-6" id="student_portal_core">
          
          {/* USER BANNER */}
          <div className="bg-gradient-to-r from-teal-800 to-teal-950 p-6 rounded-2xl border-b-4 border-amber-500 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-full border border-teal-500 flex items-center justify-center font-bold text-teal-300 text-lg">
                AB
              </div>
              <div>
                <h3 className="text-lg font-bold">Alao Adeleke Babajide</h3>
                <div className="flex flex-wrap gap-2 text-xxs font-mono text-teal-300 mt-1">
                  <span>Matric: <strong className="text-white">BCN-RN-2026-081</strong></span> |
                  <span>Dept: <strong className="text-white">Basic Nursing</strong></span> |
                  <span>Semester: <strong className="text-white">Year 2, Sem I</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-teal-900 border border-teal-700 text-xs font-bold font-mono text-teal-300">
                GPA: {calculateGPA()} CGPA
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-lg shadow-sm"
                id="btn_student_logout"
              >
                Log Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="student_dashboard_bento">
            
            {/* LATEST NOTICE BOARD (Student Feed) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-teal-50 shadow-sm" id="student_notice_board">
              <div className="flex items-center gap-2 border-b border-teal-50 pb-3 mb-4 text-teal-950 font-bold">
                <Bell className="w-5 h-5 text-amber-500 shrink-0" />
                <h4 className="text-sm uppercase tracking-wider">Dynamic Announcements</h4>
              </div>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1" id="student_announcements_scroll">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-3 bg-teal-50/50 hover:bg-teal-50 rounded-xl border border-teal-100 text-xs transition-all relative">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#a16207]">
                      {ann.category}
                    </span>
                    <h5 className="font-bold text-teal-950 mt-1">{ann.title}</h5>
                    <p className="text-gray-600 leading-normal mt-1 text-xxs font-sans">{ann.content}</p>
                    <div className="flex justify-between items-center text-[9px] text-gray-400 mt-2 border-t border-teal-50/20 pt-1 font-mono">
                      <span>Sender: {ann.sender}</span>
                      <span>{ann.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TIMETABLE CALENDAR GRID */}
            <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-teal-50 shadow-sm" id="student_timetable_pane">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-teal-50 pb-3 mb-4">
                <div className="flex items-center gap-2 text-teal-950 font-bold">
                  <CalendarRange className="w-5 h-5 text-teal-650" />
                  <h4 className="text-sm uppercase tracking-wider">Interactive Class Timetable</h4>
                </div>

                {/* DAY CHIPS */}
                <div className="flex gap-1.5" id="timetable_day_selectors">
                  {timetables.map(t => (
                    <button
                      key={t.day}
                      onClick={() => setActiveDay(t.day)}
                      className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                        activeDay === t.day
                          ? 'bg-teal-700 text-white shadow-sm'
                          : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                      }`}
                    >
                      {t.day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day's Classes listing */}
              <div className="space-y-3" id="daily_class_schedule">
                {timetables.find(t => t.day === activeDay)?.classes.map((c, i) => (
                  <div key={i} className="flex gap-4 p-3 bg-gradient-to-r from-teal-50/20 to-teal-50/5 hover:from-teal-50/40 rounded-xl border border-teal-100 shadow-xs">
                    <div className="p-2.5 bg-teal-100 text-teal-800 rounded-lg text-xs font-mono font-semibold flex items-center justify-center min-w-[140px] text-center shrink-0">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {c.time}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-amber-600 bg-amber-50 px-1.5 rounded">{c.courseCode}</span>
                        <h5 className="font-bold text-gray-800">{c.courseName}</h5>
                      </div>
                      <p className="text-xxs text-gray-500 font-sans">
                        Instructor: <strong className="text-gray-700">{c.instructor}</strong> | Room: <span className="font-mono text-teal-700 font-semibold">{c.hall}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DETAILED GRADES & GPA FORMULA */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-teal-50 shadow-sm" id="student_grades_pane">
              <div className="flex items-center gap-2 border-b border-teal-50 pb-3 mb-4 text-teal-950 font-bold">
                <Award className="w-5 h-5 text-amber-500 shrink-0" />
                <h4 className="text-sm uppercase tracking-wider font-sans">Academic Progress &amp; Grades Transcript</h4>
              </div>

              <div className="overflow-x-auto" id="grades_transcript_table_wrapper">
                <table className="w-full text-xs font-sans text-left">
                  <thead>
                    <tr className="bg-teal-50 text-teal-900 uppercase font-mono tracking-widest text-[9px]">
                      <th className="p-2.5 rounded-l-md">Course</th>
                      <th className="p-2.5">Name</th>
                      <th className="p-2.5 text-center">Units</th>
                      <th className="p-2.5 text-center">Grade</th>
                      <th className="p-2.5 text-center rounded-r-md">GP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-50 font-mono text-gray-700">
                    {grades.map((g, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-all">
                        <td className="p-2.5 font-bold text-teal-800">{g.courseCode}</td>
                        <td className="p-2.5 font-sans whitespace-nowrap overflow-ellipsis max-w-[180px] overflow-hidden">{g.courseName}</td>
                        <td className="p-2.5 text-center">{g.units}</td>
                        <td className="p-2.5 text-center font-bold text-amber-600">{g.grade}</td>
                        <td className="p-2.5 text-center font-bold text-[#115e59]">{g.gp.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 p-3.5 bg-gradient-to-r from-teal-900 to-teal-980 text-teal-50 rounded-xl flex items-center justify-between shadow-inner">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest">GPA Formula Status:</span>
                  <p className="text-xs text-teal-200">Total GP * Units Weighted Divided by Total Units</p>
                </div>
                <div className="text-right">
                  <span className="text-xxs text-amber-400 block font-mono">Calculated GPA</span>
                  <strong className="text-xl font-mono text-white block leading-none">{calculateGPA()}</strong>
                </div>
              </div>
            </div>

            {/* LECTURE MATERIALS DOWNLOAD */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-teal-50 shadow-sm" id="student_materials_pane">
              <div className="flex items-center gap-2 border-b border-teal-50 pb-3 mb-4 text-teal-950 font-bold">
                <BookOpen className="w-5 h-5 text-teal-650 shrink-0" />
                <h4 className="text-sm uppercase tracking-wider">E-Learning Material Downloads</h4>
              </div>

              <div className="space-y-3" id="lecture_notes_list">
                {materials.map((m) => (
                  <div key={m.id} className="p-3 bg-slate-50 hover:bg-teal-50/30 rounded-xl border border-teal-100 text-xs transition-all relative">
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <span className="text-[9px] font-mono font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded mr-1.5">
                          {m.courseCode}
                        </span>
                        <strong className="text-gray-900 text-xs">{m.title}</strong>
                      </div>
                      <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded text-[9px] font-mono font-bold uppercase shrink-0 border border-rose-100">
                        {m.type} Notes
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 font-sans leading-relaxed">{m.description}</p>
                    
                    <div className="flex justify-between items-center text-[9px] text-gray-400 mt-3 pt-1 border-t border-dashed border-teal-100 font-mono">
                      <span>Date added: {m.dateAdded}</span>
                      <button
                        onClick={() => alert(`Note File '${m.courseCode} (${m.type})' successfully downloaded from Bridge E-Library cluster.`)}
                        className="text-teal-700 hover:text-[#0f766e] font-bold uppercase transition-all"
                      >
                        [Download Note]
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EXAMS AGENDA */}
            <div className="lg:col-span-12 bg-white p-5 rounded-2xl border border-teal-50 shadow-sm" id="student_exams_pane">
              <div className="flex items-center gap-2 border-b border-teal-50 pb-3 mb-4 text-teal-950 font-bold">
                <ListChecks className="w-5 h-5 text-amber-500 shrink-0" />
                <h4 className="text-sm uppercase tracking-wider">Second Semester Exam Schedule Matrix</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="student_exams_grid">
                {exams.map((ex, idx) => (
                  <div key={idx} className="p-4 bg-teal-50/30 rounded-xl border border-teal-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-amber-600 bg-white border border-amber-100 px-1.5 py-0.5 rounded">{ex.courseCode}</span>
                      <span className="font-mono font-bold text-teal-800 text-[10px]">{ex.time}</span>
                    </div>
                    <h5 className="font-bold text-gray-900 leading-tight text-xs">{ex.courseName}</h5>
                    <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-teal-100/50 font-mono">
                      <span>Date: <strong>{ex.date}</strong></span>
                      <span>Hall: <strong>{ex.venue}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. LOGGED-IN: REGISTRAR PORTAL VIEW */}
      {role === 'registrar' && (
        <div className="space-y-6" id="registrar_portal_core">
          
          {/* REGISTRAR BANNER */}
          <div className="bg-gradient-to-r from-[#5c3e03] to-teal-980 p-6 rounded-2xl border-b-4 border-teal-500 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-full border border-amber-500 flex items-center justify-center font-bold text-amber-400 text-lg">
                EA
              </div>
              <div>
                <h3 className="text-lg font-bold">Mr. Emmanuel O. Alao</h3>
                <div className="flex flex-wrap gap-2 text-xxs font-mono text-amber-300 mt-1">
                  <span>Role: <strong className="text-white">College Registrar</strong></span> |
                  <span>Access: <strong className="text-white">Admin Privileges</strong></span> |
                  <span>Submissions: <strong className="text-white">{submissions.length} Total Applications</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-teal-950/80 border border-teal-700 text-xs font-bold font-mono text-teal-300">
                Oyo State NMCN Registrar Module
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-lg shadow-sm"
                id="btn_registrar_logout"
              >
                Log Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="registrar_bento_grid">
            
            {/* REAL-TIME ADMISSIONS FORM QUEUE */}
            <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-teal-50 shadow-sm space-y-4" id="registrar_admissions_queue_pane">
              <div className="flex items-center justify-between border-b border-teal-50 pb-3 mb-2">
                <div className="flex items-center gap-2 text-teal-950 font-bold">
                  <FileSpreadsheet className="w-5 h-5 text-teal-650 shrink-0" />
                  <h4 className="text-sm uppercase tracking-wider font-sans">Applications Admissions Queue</h4>
                </div>
                <span className="text-xxs font-mono text-gray-500 bg-gray-100 border px-2 py-0.5 rounded">
                  Connected to Public Admissions Form
                </span>
              </div>

              {submissions.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-xs font-sans">
                  No admissions submitted yet in current local session. Submit the Admissions Form in visitor mode to inspect!
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1" id="registrar_sub_scroll">
                  {submissions.map((sub) => (
                    <div key={sub.id} className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-teal-200/50 shadow-xs relative text-xs">
                      
                      {/* Sub heading details */}
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <span className="text-[10px] font-mono font-bold bg-teal-700 text-white px-2 py-0.5 rounded mr-1.5">
                            {sub.id}
                          </span>
                          <strong className="text-gray-900 text-sm font-sans">{sub.fullName}</strong>
                          <span className="text-xxs text-gray-500 block font-mono">Submitted: {sub.submittedAt}</span>
                        </div>

                        {/* Status Label */}
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                            sub.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            sub.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                      </div>

                      {/* Biological metadata */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-teal-100/40 text-[11px] font-sans text-gray-600">
                        <div>
                          Contact: <strong className="text-teal-980 block">{sub.phone}</strong>
                          Email: <span className="font-mono">{sub.email}</span>
                        </div>
                        <div>
                          Origin: <strong className="text-teal-985 block">{sub.stateOfOrigin} State</strong>
                          Gender/DOB: <span>{sub.gender} ({sub.dob})</span>
                        </div>
                        <div className="col-span-2">
                          Track Selected: <strong className="text-amber-700 block mt-0.5">{sub.programmeSelected}</strong>
                        </div>
                      </div>

                      {/* WAEC Credits details */}
                      <div className="mt-3 p-2 bg-gradient-to-r from-teal-50 to-teal-50/20 rounded border border-teal-100 flex items-center justify-between text-xxs font-mono">
                        <div>
                          <strong>WAEC GRADES FOR DECISION TIER:</strong>
                          <div className="flex gap-2 mt-1 font-bold">
                            <span>ENG: <strong className="text-amber-705 font-mono">{sub.waecResults.english}</strong></span>
                            <span>MTH: <strong className="text-amber-705 font-mono">{sub.waecResults.maths}</strong></span>
                            <span>BIO: <strong className="text-teal-705 font-mono">{sub.waecResults.biology}</strong></span>
                            <span>CHM: <strong className="text-teal-705 font-mono">{sub.waecResults.chemistry}</strong></span>
                            <span>PHY: <strong className="text-teal-705 font-mono">{sub.waecResults.physics}</strong></span>
                          </div>
                        </div>

                        {/* Actions buttons */}
                        {sub.status === 'Pending' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateSubmissionStatus(sub.id, 'Approved')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-sans font-bold flex items-center gap-1 shadow-sm uppercase text-[9px]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateSubmissionStatus(sub.id, 'Rejected')}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-sans font-bold flex items-center gap-1 shadow-sm uppercase text-[9px]"
                            >
                              Deny
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* WRITE ANNOUNCEMENTS (CONNECTED TO STUDENTS CORE FEED) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-teal-50 shadow-sm space-y-4" id="announcements_composer_pane">
              <div className="flex items-center gap-2 border-b border-teal-50 pb-3 mb-2 text-teal-950 font-bold">
                <PlusCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <h4 className="text-sm uppercase tracking-wider">Publish New Notice</h4>
              </div>

              <form onSubmit={handleAddAnnouncement} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Notice / Headline Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Schedule for Clinical postings shifts"
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-sans focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Notice Classification Category</label>
                  <select
                    value={newAnnCategory}
                    onChange={(e: any) => setNewAnnCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="academic">Academic / Practical Notes</option>
                    <option value="general">General Campus News</option>
                    <option value="administrative">Administrative Directives</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Full Detailed Notice Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write detailed announcements messages here..."
                    value={newAnnContent}
                    onChange={(e) => setNewAnnContent(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#5c3e03] hover:bg-[#473002] border-b-2 border-amber-900 text-white font-bold rounded-lg text-xs shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  Publish To Feed &amp; Cache
                </button>
              </form>

              {/* LIST REMOVABLE ACTIVE NOTICES */}
              <div className="pt-4 border-t border-teal-50">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7c2d12] mb-2 block">Manager Active Notices Queue ({announcements.length}):</span>
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-2 bg-slate-50 border border-teal-100 rounded-lg flex items-center justify-between text-xxs">
                      <div className="overflow-hidden mr-2">
                        <strong className="text-teal-950 block truncate">{ann.title}</strong>
                        <span className="text-[8px] font-mono text-gray-400 block">{ann.date} ({ann.category})</span>
                      </div>
                      <button
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete announcement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
