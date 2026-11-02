import { GalleryItem, Programme, FacultyMember, Announcement, LectureMaterial, TimetableEntry, ExamSchedule, Grade } from './types';
import drAdesinaPhoto from './assets/images/dr_adesina.jpg';
import bconElevationImg from './assets/images/BCON Frontal Elevation.jpeg';
import lectureHallImg from './assets/images/Screenshot 2026-10-13 203730.png';
import eventSpaceImg from './assets/images/Screenshot 2026-06-23 075551.png';
import computerSuiteImg from './assets/images/WhatsApp Image 2026-05-16 at 3.49.44 PM (1).jpeg';

export const programmesList: Programme[] = [
  {
    id: 'gen-nursing',
    name: 'General Nursing Programme (RN)',
    duration: '3 Years (6 Semesters)',
    level: 'Professional Diploma',
    requirements: [
      'Five (5) Credits in WAEC/NECO/NABTEB at not more than two (2) sittings.',
      'Credits must include English Language, Mathematics, Biology, Chemistry, and Physics.',
      'Age limit: Must be 17 years and above.'
    ],
    description: 'A comprehensive, rigorous professional program designed to train world-class registered nurses. Covers both theory and practical layouts with hands-on clinical rotations at state hospitals.',
    outcomes: [
      'Eligibility to take the Nursing and Midwifery Council of Nigeria (NMCN) licensing examinations.',
      'Ability to practice in primary, secondary, and tertiary health institutions globally.',
      'Strong foundations for specialized nursing fellowships (Pediatrics, ICU, Geriatrics, Midwifery).'
    ],
    fees: {
      tuition: '₦220,000',
      ancillary: '₦80,000',
      total: '₦300,000'
    }
  },
  {
    id: 'basic-midwifery',
    name: 'Basic Midwifery Programme (RM)',
    duration: '3 Years (6 Semesters)',
    level: 'Professional Diploma',
    requirements: [
      'Five (5) Credits in WAEC/NECO/NABTEB at not more than two (2) sittings.',
      'Required Credits: English Language, Mathematics, Biology, Chemistry, and Physics.',
      'Applicants should pass the entrance computer-based mock exam and clinical interview.'
    ],
    description: 'Dedicated maternal and child healthcare curriculum focused on equipping midwives with clinical decision-making skills to manage pregnancy, labor, post-natal recovery, and neonatal wellness.',
    outcomes: [
      'Registered Midwife (RM) license issued by NMCN.',
      'Comprehensive expertise in emergency obstetric care and child health management.'
    ],
    fees: {
      tuition: '₦230,000',
      ancillary: '₦70,000',
      total: '₦300,000'
    }
  },
  {
    id: 'health-sciences',
    name: 'Foundation in Basic Health Sciences',
    duration: '1 Year (2 Semesters)',
    level: 'Preparatory Program',
    requirements: [
      'At least four (4) Credits in relevant WAEC/O-level subjects including English, Biology, or Chemistry.'
    ],
    description: 'An advanced foundational program serving as a bridging structure for aspiring nurses, lab technicians, and community practitioners before clinical enrollment.',
    outcomes: [
      'Seamless transition into RN/RM tracks.',
      'Strong biomedical foundation.'
    ],
    fees: {
      tuition: '₦120,000',
      ancillary: '₦30,000',
      total: '₦150,000'
    }
  }
];

export const facultyMembers: FacultyMember[] = [
  {
    name: 'Rev. Ms Bridget Adesina',
    role: 'Founder/CEO',
    qualification: 'BA Hons Theology (Brunel University)\nPG Dip Advance Practice (Bedfordshire University)\nBSc Health Studies (Buckinghamshire New University)',
    department: 'Educational & Administrative Nursing',
    avatarUrl: drAdesinaPhoto
  }
];

export const galleryItems: GalleryItem[] = [
  {
    id: 'building-front',
    title: 'Modern Front Elevation',
    category: 'Building',
    description: 'The state-of-the-art academic structure of Bridge College of Nursing, Nigeria, with high-quality glazing, modern finishes, and dual wings.',
    imageUrl: bconElevationImg
  },
  {
    id: 'medical-lab-1',
    title: 'Anatomy & Pharmacology Clinical Lab',
    category: 'Labs',
    description: 'Highly equipped lab with skeletal models, human organs simulations, biological microscopes, and chemical prep units as seen in the video tours.',
    imageUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'medical-ward-2',
    title: 'Practical Demonstration Nursing Ward',
    category: 'Labs',
    description: 'Equipped simulated clinical beds, IV drip stations, pediatric care cradles, and obstetric/pregnancy mannequins for real-time practical lessons.',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'computer-ict',
    title: 'Electronic Resource & ICT Center',
    category: 'ICT Room',
    description: 'High-speed internet workstations with dual rows of computers and ergonomic seating allowing for digital lectures and mock testing sequences.',
    imageUrl: computerSuiteImg
  },
  {
    id: 'college-library',
    title: 'E-Library & Standard Resource Stack',
    category: 'Library',
    description: 'Packed catalog including the latest editions of medical, nursing, and midwifery textbooks alongside serene reading desks for deep exploration.',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'lecture-lecture',
    title: 'Standard Lecture Hall A',
    category: 'Lecture Halls',
    description: 'Bright and airy classrooms with specialized blue writing surfaces, high-contrast whiteboards, and presentation systems for students.',
    imageUrl: lectureHallImg
  },
  {
    id: 'event-hall',
    title: 'Multi-Purpose Seminar & Fellowship Hall',
    category: 'Building',
    description: 'Acoustic-treated event space with cobalt blue lecture seating, ceiling lights, and audio-visual setups for seminars, church fellowships, and workshops.',
    imageUrl: eventSpaceImg
  }
];

export const studentAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Resumption of Second Semester & Fee Payment Guidance',
    content: 'All general nursing and midwifery students are expected to resume lectures by Monday. Please ensure that all ancillary and accommodation fees are paid to the bursar before matriculation exercises.',
    date: '2026-05-20',
    category: 'academic',
    sender: 'Office of the Registrar'
  },
  {
    id: 'ann-2',
    title: 'Clinical Placement Postings - State General Hospital',
    content: 'The list of designated departments for the Pediatric and Emergency Nursing postings has been compiled. Check your group allocations under the learning resources hub or the physical notice board near HOD Secretary.',
    date: '2026-05-18',
    category: 'academic',
    sender: 'HOD, Clinical Practice'
  },
  {
    id: 'ann-3',
    title: 'Annual Professional Induction Ceremony',
    content: 'The governing council of Bridge College of Nursing wishes to inform the public of the dual induction program scheduled for next month. Details of invite allocations are detailed in the notice booklet.',
    date: '2026-05-15',
    category: 'general',
    sender: 'Rev. Ms Bridget Adesina, Founder/CEO'
  }
];

export const demoMaterials: LectureMaterial[] = [
  {
    id: 'mat-1',
    courseCode: 'NSC 211',
    courseName: 'Foundations of Clinical Nursing',
    title: 'Introduction to Vital Signs & Patient Triage Protocols',
    type: 'PDF',
    url: '#',
    description: 'Comprehensive notes covering blood pressure estimation, pulse dynamics, and pediatric respiratory measurement scales.',
    dateAdded: '2026-05-12'
  },
  {
    id: 'mat-2',
    courseCode: 'PHM 222',
    courseName: 'Systemic Pharmacology for Nurses',
    title: 'Drug Dosage Calculations & Intravenous Therapy Guidelines',
    type: 'Slides',
    url: '#',
    description: 'Slide deck showing pediatric vs geriatric drip rate ratios and calculations with examples.',
    dateAdded: '2026-05-14'
  },
  {
    id: 'mat-3',
    courseCode: 'MID 301',
    courseName: 'Advanced Midwifery Care I',
    title: 'Management of Second Stage Labor and Obstetric Emergencies',
    type: 'Video',
    url: '#',
    description: 'Detailed video slides summarizing maneuvers for shoulder dystocia and early management of postpartum hemorrhage care.',
    dateAdded: '2026-05-16'
  }
];

export const demoTimetables: TimetableEntry[] = [
  {
    day: 'Monday',
    classes: [
      { time: '08:00 AM - 10:00 AM', courseCode: 'NSC 211', courseName: 'Foundations of Clinical Nursing Practice', instructor: 'Mrs. Abigail T. Falope', hall: 'Lecture Hall A' },
      { time: '10:30 AM - 12:30 PM', courseCode: 'BIO 112', courseName: 'Human Anatomy II', instructor: 'Dr. Michael Ade', hall: 'Lecture Hall B' },
      { time: '02:00 PM - 04:00 PM', courseCode: 'MID 301', courseName: 'Clinical Simulation Practicum', instructor: 'Mrs. Falope & Instructors', hall: 'Anatomy Lab' }
    ]
  },
  {
    day: 'Tuesday',
    classes: [
      { time: '09:00 AM - 11:00 AM', courseCode: 'PHM 222', courseName: 'Pharmacology Lecture', instructor: 'Rev. Ms Bridget Adesina', hall: 'Lecture Hall A' },
      { time: '11:30 AM - 01:30 PM', courseCode: 'PAT 205', courseName: 'Systemic Pathology', instructor: 'Mr. Emmanuel O. Alao', hall: 'Lecture Hall C' }
    ]
  },
  {
    day: 'Wednesday',
    classes: [
      { time: '08:00 AM - 10:00 AM', courseCode: 'CSC 102', courseName: 'E-Health Technologies & Lab Informatics', instructor: 'Mr. Jude Chijioke', hall: 'ICT Resource Center' },
      { time: '11:00 AM - 01:00 PM', courseCode: 'MID 301', courseName: 'Obstetric Medicine Practice', instructor: 'Mrs. Abigail T. Falope', hall: 'Maternity Demonstration Hall' }
    ]
  }
];

export const demoExams: ExamSchedule[] = [
  { courseCode: 'NSC 211', courseName: 'Foundations of Clinical Nursing practice', date: '2026-06-08', time: '09:00 AM', venue: 'Lecture Wing Multi-Hall' },
  { courseCode: 'BIO 112', courseName: 'Human Anatomy II', date: '2026-06-10', time: '11:30 AM', venue: 'Lecture Wing Multi-Hall' },
  { courseCode: 'PHM 222', courseName: 'Systemic Pharmacology for Nurses', date: '2026-06-12', time: '02:00 PM', venue: 'ICT Testing Center' }
];

export const demoGrades: Grade[] = [
  { courseCode: 'NSC 201', courseName: 'Nursing History & Professionalism', units: 2, grade: 'A', gp: 4.0 },
  { courseCode: 'BIO 111', courseName: 'Basic Anatomy & Physiology I', units: 3, grade: 'B', gp: 3.0 },
  { courseCode: 'CHM 101', courseName: 'Medical Organic Chemistry', units: 3, grade: 'A', gp: 4.0 },
  { courseCode: 'MIC 204', courseName: 'Medical Microbiology & infection controls', units: 2, grade: 'B', gp: 3.0 }
];
