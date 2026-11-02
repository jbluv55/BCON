import { GalleryItem } from '../types';
import bconElevationImg from '../assets/images/BCON Frontal Elevation.jpeg';
import lectureHallImg from '../assets/images/Screenshot 2026-10-13 203730.png';
import eventSpaceImg from '../assets/images/Screenshot 2026-06-23 075551.png';
import computerSuiteImg from '../assets/images/WhatsApp Image 2026-05-16 at 3.49.44 PM (1).jpeg';
import bconOfficialLogo from '../assets/images/bcon_official_logo.png';

// ==========================================
// TYPES FOR BRANDING & SITE LOGO
// ==========================================

export interface SiteBrandingConfig {
  logoUrl: string;
}

export const DEFAULT_BRANDING: SiteBrandingConfig = {
  logoUrl: bconOfficialLogo
};

// ==========================================
// TYPES FOR CAREERS & RECRUITMENT
// ==========================================

export interface JobPosting {
  id: string;
  title: string;
  department: 'Academic Nursing' | 'Clinical Training & Midwifery' | 'Medical Laboratory Sciences' | 'ICT & Examinations' | 'Administration & Accounts' | 'Facility & Security';
  type: 'Full-Time' | 'Part-Time' | 'Adjunct' | 'Clinical Preceptor';
  location: string;
  experience: string;
  salary: string;
  deadline: string;
  status: 'Open' | 'Closed' | 'Draft';
  authorId?: string;
  authorName?: string;
  authorUsername?: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedDate: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  candidateName: string;
  email: string;
  phone: string;
  qualification: string;
  nmcnNumber?: string;
  experienceYears: string;
  coverLetter: string;
  cvFileName: string;
  status: 'New' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Rejected' | 'Hired';
  adminNotes?: string;
  appliedAt: string;
}

// ==========================================
// TYPES FOR ADVERTS & ANNOUNCEMENTS
// ==========================================

export interface TopTickerConfig {
  enabled: boolean;
  badge: string;
  text: string;
  actionText: string;
  actionTarget: string; // section id e.g. 'admissions' | 'careers' | 'space-rental'
}

export interface SpaceRentalBarConfig {
  enabled: boolean;
  headline: string;
  subtext: string;
  badge: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  badge: string;
  badgeColor: string;
  actionLabel: string;
  actionTarget: string;
  imageUrl?: string;
  active: boolean;
  status?: 'Published' | 'Draft';
  authorId?: string;
  authorName?: string;
  authorUsername?: string;
  startDate?: string;
  endDate?: string;
}

// ==========================================
// TYPES FOR SITE TEXT & COPY
// ==========================================

export interface SiteCopy {
  hero: {
    accreditationTag: string;
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  contact: {
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    hours: string;
  };
  stats: {
    studentCapacity: string;
    passRate: string;
    hospitalPartners: string;
    nmcnApprovalYear: string;
  };
  admissionsNotice: {
    batch: string;
    portalNotice: string;
    deadline: string;
    screeningDate: string;
  };
}

// ==========================================
// TYPES FOR MEDIA & VIDEOS
// ==========================================

export interface MediaVideoConfig {
  title: string;
  caption: string;
  videoUrl: string;
  posterUrl?: string;
}

export interface EditableMediaItem extends GalleryItem {
  uploadedAt?: string;
  featured?: boolean;
}

// ==========================================
// DYNAMIC ROLE & USER MANAGEMENT (RBAC)
// ==========================================

export interface RolePermissions {
  canManageCareers: boolean;
  canReviewApplications: boolean;
  canManageAdverts: boolean;
  canEditCopy: boolean;
  canManageMedia: boolean;
  canManageUsersAndRoles: boolean;
  canExportReset: boolean;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  badgeColor: string; // 'amber' | 'teal' | 'indigo' | 'purple' | 'emerald' | 'rose' | 'sky'
  isSystemRole?: boolean;
  permissions: RolePermissions;
  createdAt?: string;
}

export interface StaffUserAccount {
  id: string;
  username: string;
  password: string;
  displayName: string;
  email: string;
  roleId: string;
  status: 'Active' | 'Suspended';
  lastLogin?: string;
  createdAt: string;
}

// Legacy alias for compatibility with existing components
export type StaffRole = string;
export interface StaffUserProfile {
  role: string;
  displayName: string;
  email: string;
  avatarText: string;
  roleTitle: string;
  permissions: RolePermissions;
}

/**
 * Access Control Helper:
 * Ensures that Drafts (jobs, adverts, content) are ONLY seen by their author or super admin,
 * and NEVER by unauthenticated viewers or other unauthorized staff.
 */
export function canUserViewDraft(
  item: { status?: string; isDraft?: boolean; authorId?: string; authorUsername?: string },
  currentUser: StaffUserAccount | null,
  isAuthenticated: boolean,
  userProfile?: StaffUserProfile | null
): boolean {
  const isDraft = item.status === 'Draft' || item.isDraft === true;
  // If not a draft (e.g. Open, Closed, Published), everyone can see it
  if (!isDraft) return true;

  // If item IS a draft:
  // Viewers (unauthenticated) can NEVER see drafts
  if (!isAuthenticated || !currentUser) return false;

  // Super Administrator can see all drafts
  if (
    currentUser.roleId === 'superadmin' || 
    currentUser.username.toLowerCase() === 'admin' || 
    userProfile?.permissions?.canManageUsersAndRoles
  ) {
    return true;
  }

  // Author can see their own drafts
  if (item.authorId && item.authorId === currentUser.id) return true;
  if (item.authorUsername && item.authorUsername.toLowerCase() === currentUser.username.toLowerCase()) return true;

  // All other staff/viewers cannot see this draft
  return false;
}

// Default Seed Roles
export const DEFAULT_ROLES: RoleDefinition[] = [
  {
    id: 'superadmin',
    name: 'Super Administrator / Provost',
    description: 'Full institutional authority over all modules, staff user accounts, role definitions, and system backup tools.',
    badgeColor: 'amber',
    isSystemRole: true,
    permissions: {
      canManageCareers: true,
      canReviewApplications: true,
      canManageAdverts: true,
      canEditCopy: true,
      canManageMedia: true,
      canManageUsersAndRoles: true,
      canExportReset: true
    },
    createdAt: '2026-01-01'
  },
  {
    id: 'hr_officer',
    name: 'HR & Recruitment Officer',
    description: 'Publishes and edits faculty career postings, manages vacancy deadlines, and reviews submitted candidate CV dossiers.',
    badgeColor: 'teal',
    isSystemRole: false,
    permissions: {
      canManageCareers: true,
      canReviewApplications: true,
      canManageAdverts: false,
      canEditCopy: false,
      canManageMedia: false,
      canManageUsersAndRoles: false,
      canExportReset: false
    },
    createdAt: '2026-01-01'
  },
  {
    id: 'media_officer',
    name: 'Media & Public Relations Officer',
    description: 'Oversees campus video walkthrough tour, photo gallery media assets, top emergency banners, and promotional adverts.',
    badgeColor: 'indigo',
    isSystemRole: false,
    permissions: {
      canManageCareers: false,
      canReviewApplications: false,
      canManageAdverts: true,
      canEditCopy: false,
      canManageMedia: true,
      canManageUsersAndRoles: false,
      canExportReset: false
    },
    createdAt: '2026-01-01'
  },
  {
    id: 'content_editor',
    name: 'Academic & Content Editor',
    description: 'Manages website copy, hero announcements, contact channels, institutional stats, and entrance screening schedules.',
    badgeColor: 'emerald',
    isSystemRole: false,
    permissions: {
      canManageCareers: false,
      canReviewApplications: false,
      canManageAdverts: false,
      canEditCopy: true,
      canManageMedia: false,
      canManageUsersAndRoles: false,
      canExportReset: false
    },
    createdAt: '2026-01-01'
  }
];

// Default Seed Users (Ready to test credentials)
export const DEFAULT_USERS: StaffUserAccount[] = [
  {
    id: 'usr-001',
    username: 'admin',
    password: 'password123',
    displayName: 'Rev. Ms Bridget Adesina',
    email: 'provost@bridgecollege.edu.ng',
    roleId: 'superadmin',
    status: 'Active',
    lastLogin: 'Today, 08:30 AM',
    createdAt: '2026-01-01'
  },
  {
    id: 'usr-002',
    username: 'hr',
    password: 'hrpass123',
    displayName: 'Mrs. K. Alabi',
    email: 'hr@bridgecollege.edu.ng',
    roleId: 'hr_officer',
    status: 'Active',
    lastLogin: 'Yesterday, 02:15 PM',
    createdAt: '2026-01-05'
  },
  {
    id: 'usr-003',
    username: 'media',
    password: 'mediapass123',
    displayName: 'Mr. T. Babatunde',
    email: 'media@bridgecollege.edu.ng',
    roleId: 'media_officer',
    status: 'Active',
    lastLogin: '3 days ago',
    createdAt: '2026-01-10'
  },
  {
    id: 'usr-004',
    username: 'editor',
    password: 'editorpass123',
    displayName: 'Dr. O. Adebisi',
    email: 'academics@bridgecollege.edu.ng',
    roleId: 'content_editor',
    status: 'Active',
    lastLogin: '5 days ago',
    createdAt: '2026-01-12'
  }
];

// Legacy fallback map for quick access
export const ROLE_CONFIGS: Record<string, StaffUserProfile> = {
  superadmin: {
    role: 'superadmin',
    displayName: 'Rev. Ms Bridget Adesina',
    email: 'provost@bridgecollege.edu.ng',
    avatarText: 'SA',
    roleTitle: 'Super Administrator / Provost',
    permissions: DEFAULT_ROLES[0].permissions
  },
  hr_officer: {
    role: 'hr_officer',
    displayName: 'Mrs. K. Alabi',
    email: 'hr@bridgecollege.edu.ng',
    avatarText: 'HR',
    roleTitle: 'HR & Recruitment Officer',
    permissions: DEFAULT_ROLES[1].permissions
  },
  media_officer: {
    role: 'media_officer',
    displayName: 'Mr. T. Babatunde',
    email: 'media@bridgecollege.edu.ng',
    avatarText: 'PR',
    roleTitle: 'Media & Public Relations Officer',
    permissions: DEFAULT_ROLES[2].permissions
  },
  content_editor: {
    role: 'content_editor',
    displayName: 'Dr. O. Adebisi',
    email: 'academics@bridgecollege.edu.ng',
    avatarText: 'CE',
    roleTitle: 'Academic & Content Editor',
    permissions: DEFAULT_ROLES[3].permissions
  }
};

// ==========================================
// SEED DEFAULT DATA
// ==========================================

export const DEFAULT_JOBS: JobPosting[] = [
  {
    id: 'job-001',
    title: 'Senior Lecturer / Nursing Tutor (General Nursing)',
    department: 'Academic Nursing',
    type: 'Full-Time',
    location: 'Ibadan Main Campus, Oyo State',
    experience: '3 - 5 Years Post-B.N.Sc / M.Sc Teaching Experience',
    salary: 'Competitive (CONUASS Aligned) + Performance Bonus',
    deadline: 'December 15, 2026',
    status: 'Open',
    summary: 'Lead lecture deliveries, clinical simulation instruction, and student mentorship for Registered Nursing (RN) trainees according to NMCN curriculum benchmarks.',
    responsibilities: [
      'Deliver core didactic and practical coursework in Medical-Surgical Nursing, Pharmacology, and Pathophysiology.',
      'Coordinate clinical skills lab simulations and validate student competencies using OSCE rubrics.',
      'Supervise nursing students during hospital postings at our partner clinical teaching centers in Oyo State.',
      'Prepare candidates rigorously for internal exams and NMCN Professional Licensing Examinations.'
    ],
    requirements: [
      'Master of Science (M.Sc) in Nursing Science or B.N.Sc with Postgraduate Diploma in Education (PGDE).',
      'Current, unencumbered Registered Nurse (RN) and Registered Nurse Educator (RNE) license with NMCN.',
      'Minimum of 3 years demonstrable clinical or pedagogical experience in a recognized nursing institution.',
      'Proficiency in ICT-driven instructional delivery and modern e-health simulated mannequins.'
    ],
    benefits: [
      'Contributory pension scheme & health insurance coverage.',
      'Annual academic development and conference grant.',
      'Modern, air-conditioned faculty office and high-speed campus internet.',
      'Commendation and bonus packages for top-performing sets in NMCN national exams.'
    ],
    postedDate: 'October 28, 2026'
  },
  {
    id: 'job-002',
    title: 'Clinical Preceptor & Midwifery Instructor (RM Track)',
    department: 'Clinical Training & Midwifery',
    type: 'Full-Time',
    location: 'Ibadan Main Campus & Partner Maternity Centers',
    experience: '2+ Years Active Midwifery / Maternal Health Experience',
    salary: 'Commensurate with Clinical Experience',
    deadline: 'December 20, 2026',
    status: 'Open',
    summary: 'Oversee hands-on obstetric and maternal healthcare training for Basic Midwifery students across labor wards, antenatal clinics, and neonatal wellness units.',
    responsibilities: [
      'Demonstrate advanced obstetric delivery techniques, emergency neonatal resuscitation, and post-natal care.',
      'Manage student clinical logbooks, verifying delivery quotas and maternal case studies.',
      'Liaise with ward charge nurses at partner specialist hospitals to optimize clinical rotation shifts.',
      'Conduct regular simulation drills in our specialized maternal & neonatal health training suite.'
    ],
    requirements: [
      'Registered Midwife (RM) with valid NMCN practicing license (B.N.Sc or Post-Basic Midwifery qualification preferred).',
      'Demonstrated experience in high-volume labor wards and family health centers.',
      'Passionate educator with high empathy and strict commitment to maternal patient dignity.',
      'Strong organizational, mentoring, and record-keeping capabilities.'
    ],
    benefits: [
      'Clinical hazard allowance and subsidized accommodation assistance.',
      'Sponsored participation in national Maternal & Child Health summits.',
      'Friendly collegiate environment with state-of-the-art diagnostic tools.'
    ],
    postedDate: 'November 01, 2026'
  },
  {
    id: 'job-003',
    title: 'Medical Laboratory Scientist / Technologist',
    department: 'Medical Laboratory Sciences',
    type: 'Full-Time',
    location: 'Bridge College Diagnostic & Teaching Labs, Ibadan',
    experience: '2 - 4 Years Laboratory Practice',
    salary: 'Attractive & Commensurate with Qualifications',
    deadline: 'December 10, 2026',
    status: 'Open',
    summary: 'Manage our biological, chemical, and anatomical teaching labs; guide student practical sessions and maintain laboratory diagnostic instrumentation.',
    responsibilities: [
      'Prepare laboratory reagents, biological specimen slides, and diagnostic equipment for daily student practicals.',
      'Enforce universal biosafety protocols, chemical storage standards, and waste disposal regulations.',
      'Demonstrate hematology, clinical chemistry, microbiology, and histology assays to students.',
      'Calibrate and maintain spectrophotometers, centrifuges, autoclaves, and microscopy suites.'
    ],
    requirements: [
      'Bachelor of Medical Laboratory Science (B.MLS) or Associate of Medical Laboratory Science Council (AMLSCN).',
      'Valid practicing license from the Medical Laboratory Science Council of Nigeria (MLSCN).',
      'Deep knowledge of laboratory quality assurance, chemical hygiene, and biosafety protocols.',
      'Prior experience in an academic or teaching hospital laboratory is an added advantage.'
    ],
    benefits: [
      'Comprehensive laboratory hazard and professional development allowances.',
      'Hands-on exposure to newly commissioned modern diagnostic instruments.',
      'Paid annual leave and health coverage.'
    ],
    postedDate: 'October 30, 2026'
  },
  {
    id: 'job-004',
    title: 'ICT & CBT Systems Administrator',
    department: 'ICT & Examinations',
    type: 'Full-Time',
    location: 'Ibadan Main Campus Computer & CBT Suite',
    experience: '2+ Years Systems & Network Administration',
    salary: 'Attractive IT Package',
    deadline: 'December 05, 2026',
    status: 'Open',
    summary: 'Manage the 120-workstation CBT Exam Suite, campus fiber-optic LAN, e-library portal servers, and student computer-based screening exams.',
    responsibilities: [
      'Administer the college local area network, secure Wi-Fi access points, and UPS power backups for the ICT suite.',
      'Supervise computer-based testing (CBT) mock exams, entrance examinations, and NMCN software setups.',
      'Manage college website updates, portal database backups, and student email credentials.',
      'Provide rapid technical support to staff lecture rooms, projectors, and administrative workstations.'
    ],
    requirements: [
      'B.Sc / HND in Computer Science, Information Technology, or Computer Engineering.',
      'Hands-on experience configuring Cisco/MikroTik routers, managed switches, and Windows/Linux servers.',
      'Experience running CBT exam platforms (JAMB / NMCN mock engines or local CBT packages).',
      'Knowledge of web technologies, basic database maintenance, and hardware troubleshooting.'
    ],
    benefits: [
      'Continuous certification sponsorship (CompTIA, CCNA, or Cloud essentials).',
      'High-speed unlimited broadband and modern IT workspace.',
      'Performance incentives during CBT exam seasons.'
    ],
    postedDate: 'November 02, 2026'
  },
  {
    id: 'job-005',
    title: 'Admissions & Student Welfare Officer',
    department: 'Administration & Accounts',
    type: 'Full-Time',
    location: 'Ibadan Main Campus Administrative Wing',
    experience: '1 - 3 Years Customer / Student Support',
    salary: 'Competitive & Commensurate',
    deadline: 'December 22, 2026',
    status: 'Open',
    summary: 'Serve as the welcoming face and guide for prospective candidates, parents, and admitted nursing students navigating application screenings and campus accommodation.',
    responsibilities: [
      'Guide prospective applicants on WAEC/NECO subject combinations, entrance exam schedules, and registration.',
      'Process submitted admission files, verify academic credentials, and issue admission notifications.',
      'Handle public inquiries via phone, campus reception, WhatsApp, and official email.',
      'Coordinate student hostel allocations, orientation programs, and matriculation logistics.'
    ],
    requirements: [
      'B.Sc / HND in Public Administration, Mass Communication, English, or related social sciences.',
      'Superb interpersonal, written, and oral communication skills with high telephone etiquette.',
      'Proficiency in Microsoft Office (Word, Excel) and web-based portal management.',
      'Warm, professional demeanor with passion for student mentorship and care.'
    ],
    benefits: [
      'Friendly, supportive administrative team environment.',
      'Career progression path in higher education administration.',
      'Annual leave allowances and health coverage.'
    ],
    postedDate: 'October 25, 2026',
    authorId: 'usr-001',
    authorName: 'Rev. Ms Bridget Adesina',
    authorUsername: 'admin'
  },
  {
    id: 'job-006',
    title: 'Visiting Lecturer in Anatomy & Physiology (Draft Opening)',
    department: 'Academic Nursing',
    type: 'Part-Time',
    location: 'Ibadan Main Campus Lecture Theater',
    experience: '1 - 2 Years Adjunct Teaching Experience',
    salary: 'Commensurate Hourly Scale',
    deadline: 'January 15, 2027',
    status: 'Draft',
    authorId: 'usr-001',
    authorName: 'Rev. Ms Bridget Adesina',
    authorUsername: 'admin',
    summary: 'Preliminary curriculum draft: deliver pre-clinical anatomy lectures, musculoskeletal demonstrations, and embryology seminars.',
    responsibilities: [
      'Prepare instructional slides and dissection models for pre-clinical anatomy coursework.',
      'Supervise histology microscopy sessions.'
    ],
    requirements: [
      'M.Sc or B.Sc in Human Anatomy / Medical Physiology.',
      'Previous higher-institution tutoring experience.'
    ],
    benefits: [
      'Flexible adjunct scheduling with per-session honorarium.'
    ],
    postedDate: 'November 02, 2026'
  },
  {
    id: 'job-007',
    title: 'Midwifery Clinical Simulation Coach (HR Draft)',
    department: 'Clinical Training & Midwifery',
    type: 'Clinical Preceptor',
    location: 'Ibadan Campus Simulation Suite',
    experience: '3+ Years Post-RM Clinical Delivery Ward',
    salary: 'CONUASS 4 Aligned',
    deadline: 'January 25, 2027',
    status: 'Draft',
    authorId: 'usr-002',
    authorName: 'Mrs. K. Alabi',
    authorUsername: 'hr',
    summary: 'Internal recruitment draft prepared by HR for a dedicated coach to conduct OSCE mock examinations and labor ward emergency drills.',
    responsibilities: [
      'Conduct hands-on obstetric delivery simulations.',
      'Evaluate student birthing competencies.'
    ],
    requirements: [
      'Registered Midwife (RM) and licensed Nurse Educator.'
    ],
    benefits: [
      'Standard faculty allowances and clinical insurance.'
    ],
    postedDate: 'November 02, 2026'
  }
];

export const DEFAULT_APPLICATIONS: JobApplication[] = [
  {
    id: 'APP-1021',
    jobId: 'job-001',
    jobTitle: 'Senior Lecturer / Nursing Tutor (General Nursing)',
    department: 'Academic Nursing',
    candidateName: 'Nurse Folasade Mary Adekoya',
    email: 'folasade.mary@gmail.com',
    phone: '+234 803 456 7812',
    qualification: 'M.Sc Nursing Science (Obafemi Awolowo University), RNE, RN',
    nmcnNumber: 'RN-118492 / RNE-04918',
    experienceYears: '6 Years Teaching & Clinical Preceptorship',
    coverLetter: 'I am excited to submit my credentials for the Nursing Tutor position at Bridge College. Having spent 6 years lecturing Medical-Surgical Nursing with a 98% pass rate in NMCN council examinations, I am eager to bring my pedagogy and OSCE evaluation expertise to your esteemed institution.',
    cvFileName: 'Folasade_Adekoya_CV_2026.pdf',
    status: 'Shortlisted',
    adminNotes: 'Excellent credentials. Strong candidate for Medical-Surgical lead. Scheduled for pedagogical interview.',
    appliedAt: '2026-10-31 14:22'
  },
  {
    id: 'APP-1022',
    jobId: 'job-002',
    jobTitle: 'Clinical Preceptor & Midwifery Instructor (RM Track)',
    department: 'Clinical Training & Midwifery',
    candidateName: 'Grace Chidinma Okonkwo',
    email: 'grace.okonkwo.midwife@yahoo.com',
    phone: '+234 814 902 3311',
    qualification: 'B.N.Sc (UNILAG), RM, RN, Certified Neonatal Resuscitation Provider',
    nmcnNumber: 'RM-099412',
    experienceYears: '4 Years Labor Ward Specialist',
    coverLetter: 'As a passionate midwife dedicated to reducing maternal mortality, I have managed over 450 successful deliveries and coached junior student nurses. I would love to mentor the future midwives of Bridge College.',
    cvFileName: 'Grace_Okonkwo_Resume.pdf',
    status: 'New',
    adminNotes: 'Application received. Validated NMCN registration status.',
    appliedAt: '2026-11-01 09:40'
  },
  {
    id: 'APP-1023',
    jobId: 'job-004',
    jobTitle: 'ICT & CBT Systems Administrator',
    department: 'ICT & Examinations',
    candidateName: 'Oluwaseun David Arowolo',
    email: 'arowolo.it@outlook.com',
    phone: '+234 902 114 8872',
    qualification: 'B.Sc Computer Science (University of Ibadan), CCNA, Linux Admin',
    experienceYears: '3 Years CBT Center Administrator',
    coverLetter: 'I have successfully coordinated 150-workstation CBT examinations for national exams and university portals with zero downtime. I have strong experience managing localized LANs, firewalls, and generator backup cutovers.',
    cvFileName: 'David_Arowolo_IT_CV.pdf',
    status: 'Under Review',
    adminNotes: 'Solid networking experience. Check availability for CBT setup inspection.',
    appliedAt: '2026-11-02 11:15'
  }
];

export const DEFAULT_TICKER: TopTickerConfig = {
  enabled: true,
  badge: 'NEWS ALERT',
  text: 'Online Admission application for RM (Midwifery) & RN (General Nursing) is currently active for 2026/2027 Academic Session.',
  actionText: 'Apply Instantly →',
  actionTarget: 'admissions'
};

export const DEFAULT_SPACERENTAL_BAR: SpaceRentalBarConfig = {
  enabled: true,
  headline: 'Looking For Space to Rent or Short Let?',
  subtext: 'Click for More Information & Virtual Campus Tour',
  badge: 'Commercial Use →'
};

export const DEFAULT_PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'promo-01',
    title: 'Admissions Screening & CBT Mock Date Announced',
    subtitle: '2026/2027 Academic Year Batch A',
    content: 'Bridge College of Nursing announces the formal computer-based entrance assessment date. Early registered candidates enjoy priority lab shift allocations.',
    badge: 'Admissions Update',
    badgeColor: 'amber',
    actionLabel: 'Check Admissions Portal',
    actionTarget: 'admissions',
    active: true
  },
  {
    id: 'promo-02',
    title: 'Now Hiring: Academic Faculty & Clinical Preceptors',
    subtitle: 'Shape Future Healthcare Leaders',
    content: 'We are expanding our faculty. Join our world-class collegiate community in Ibadan. Attractive remuneration aligned with CONUASS.',
    badge: 'Careers Opening',
    badgeColor: 'teal',
    actionLabel: 'Explore Open Positions',
    actionTarget: 'careers',
    active: true
  }
];

export const DEFAULT_SITE_COPY: SiteCopy = {
  hero: {
    accreditationTag: 'Accredited by the Nursing & Midwifery Council of Nigeria (NMCN)',
    headline: 'Bridge College of Nursing & Health Sciences',
    subheadline: 'Shaping empathetic, technically proficient healthcare leaders through intensive clinical simulations, accredited nursing curricula, and dedicated hospital postings in Ibadan, Nigeria.',
    ctaPrimary: 'Apply For Admission',
    ctaSecondary: 'Explore Programmes'
  },
  contact: {
    address: 'Harriet Shoroye Street, Off Araoye Heritage Estate, Off Akala Express, Ibadan, Oyo State, Nigeria.',
    phone: '+234 701 7514 313',
    whatsapp: '+234 701 7514 313',
    email: 'info@bridgecollegeofnursing',
    hours: 'Monday to Friday (08:00 AM - 04:00 PM)'
  },
  stats: {
    studentCapacity: '500+ Qualified Trainees',
    passRate: '100% NMCN Pass Rate Target',
    hospitalPartners: '8+ Specialist Teaching Centers',
    nmcnApprovalYear: 'Oyo State Health Ministry & NMCN Approved'
  },
  admissionsNotice: {
    batch: 'Batch A - 2026/2027 Session',
    portalNotice: 'Registration portal is open for General Nursing (RN) and Basic Midwifery (RM).',
    deadline: 'December 31, 2026',
    screeningDate: 'Saturday, January 09, 2027'
  }
};

export const DEFAULT_MEDIA_ITEMS: EditableMediaItem[] = [
  {
    id: 'building-front',
    title: 'Modern Front Elevation',
    category: 'Building',
    description: 'The state-of-the-art academic structure of Bridge College of Nursing, Nigeria, with high-quality glazing, modern finishes, and dual wings.',
    imageUrl: bconElevationImg,
    featured: true
  },
  {
    id: 'lecture-hall-1',
    title: 'Spacious Multi-tier Lecture Hall',
    category: 'Lecture Halls',
    description: 'Modern stepped lecture amphitheater with comfortable ergonomic desks and multimedia projection.',
    imageUrl: lectureHallImg,
    featured: true
  },
  {
    id: 'event-spaces-1',
    title: 'Multi-purpose Auditorium & Event Spaces',
    category: 'Building',
    description: 'Expansive air-conditioned venue available for academic symposiums, corporate summits, and short lets.',
    imageUrl: eventSpaceImg,
    featured: true
  },
  {
    id: 'ict-suite-1',
    title: 'Modern 120-Seat Computer & CBT Exam Suite',
    category: 'ICT Room',
    description: 'Equipped with individual partitioned workstations, high-speed fiber internet, and dual inverter backup power.',
    imageUrl: computerSuiteImg,
    featured: true
  }
];

export const DEFAULT_VIDEO_CONFIG: MediaVideoConfig = {
  title: 'Bridge College Interactive Campus Video Tour',
  caption: 'Walk through our modern lecture halls, clinical labs, CBT suite, and serene off-Akala Express campus grounds.',
  videoUrl: '' // Handled by App.tsx import or custom URL
};

// ==========================================
// CENTRAL REACTIVE STORE IMPLEMENTATION
// ==========================================

const STORAGE_KEY = 'bcon_site_content_v3';
const ACTIVE_USER_STORAGE_KEY = 'bcon_active_user_id';
const STAFF_AUTH_SESSION_KEY = 'bcon_staff_auth_user_id';

export interface SiteContentState {
  jobs: JobPosting[];
  applications: JobApplication[];
  ticker: TopTickerConfig;
  spaceRentalBar: SpaceRentalBarConfig;
  promoBanners: PromoBanner[];
  siteCopy: SiteCopy;
  mediaItems: EditableMediaItem[];
  videoConfig: MediaVideoConfig;
  branding: SiteBrandingConfig;
  roles: RoleDefinition[];
  users: StaffUserAccount[];
  activeUserId: string;
}

class SiteContentStore {
  private state: SiteContentState;
  private authenticatedUserId: string | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
    try {
      const savedAuthId = sessionStorage.getItem(STAFF_AUTH_SESSION_KEY);
      if (savedAuthId && this.getUserById(savedAuthId)) {
        this.authenticatedUserId = savedAuthId;
      }
    } catch (e) {
      this.authenticatedUserId = null;
    }
  }

  private loadState(): SiteContentState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const roles = (parsed.roles && Array.isArray(parsed.roles) && parsed.roles.length > 0)
          ? parsed.roles
          : DEFAULT_ROLES;
        const users = (parsed.users && Array.isArray(parsed.users) && parsed.users.length > 0)
          ? parsed.users
          : DEFAULT_USERS;
        const activeUserId = parsed.activeUserId || localStorage.getItem(ACTIVE_USER_STORAGE_KEY) || 'usr-001';

        return {
          jobs: parsed.jobs || DEFAULT_JOBS,
          applications: parsed.applications || DEFAULT_APPLICATIONS,
          ticker: parsed.ticker || DEFAULT_TICKER,
          spaceRentalBar: parsed.spaceRentalBar || DEFAULT_SPACERENTAL_BAR,
          promoBanners: parsed.promoBanners || DEFAULT_PROMO_BANNERS,
          siteCopy: parsed.siteCopy || DEFAULT_SITE_COPY,
          mediaItems: parsed.mediaItems || DEFAULT_MEDIA_ITEMS,
          videoConfig: parsed.videoConfig || DEFAULT_VIDEO_CONFIG,
          branding: parsed.branding || DEFAULT_BRANDING,
          roles,
          users,
          activeUserId
        };
      }
    } catch (e) {
      console.warn('Could not parse stored site content, resetting to defaults', e);
    }

    return {
      jobs: DEFAULT_JOBS,
      applications: DEFAULT_APPLICATIONS,
      ticker: DEFAULT_TICKER,
      spaceRentalBar: DEFAULT_SPACERENTAL_BAR,
      promoBanners: DEFAULT_PROMO_BANNERS,
      siteCopy: DEFAULT_SITE_COPY,
      mediaItems: DEFAULT_MEDIA_ITEMS,
      videoConfig: DEFAULT_VIDEO_CONFIG,
      branding: DEFAULT_BRANDING,
      roles: DEFAULT_ROLES,
      users: DEFAULT_USERS,
      activeUserId: 'usr-001'
    };
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, this.state.activeUserId);
    } catch (e) {
      console.error('Failed to save site content state to localStorage', e);
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  public getState(): SiteContentState {
    return this.state;
  }

  // ==========================================
  // DYNAMIC ROLE MANAGEMENT
  // ==========================================

  public getRoles(): RoleDefinition[] {
    return this.state.roles;
  }

  public getRoleById(roleId: string): RoleDefinition | undefined {
    return this.state.roles.find(r => r.id === roleId);
  }

  public addRole(role: Omit<RoleDefinition, 'id' | 'createdAt'> & { id?: string }): { success: boolean; role?: RoleDefinition; error?: string } {
    const rawId = role.id ? role.id.toLowerCase().replace(/[^a-z0-9_]/g, '_') : 'role_' + Date.now().toString(36);
    
    // Check if ID already exists
    if (this.state.roles.some(r => r.id === rawId)) {
      return { success: false, error: `Role key "${rawId}" already exists. Please choose a unique key.` };
    }

    const newRole: RoleDefinition = {
      ...role,
      id: rawId,
      name: role.name.trim(),
      description: role.description.trim(),
      badgeColor: role.badgeColor || 'teal',
      isSystemRole: false,
      permissions: {
        canManageCareers: !!role.permissions.canManageCareers,
        canReviewApplications: !!role.permissions.canReviewApplications,
        canManageAdverts: !!role.permissions.canManageAdverts,
        canEditCopy: !!role.permissions.canEditCopy,
        canManageMedia: !!role.permissions.canManageMedia,
        canManageUsersAndRoles: !!role.permissions.canManageUsersAndRoles,
        canExportReset: !!role.permissions.canExportReset
      },
      createdAt: new Date().toISOString().slice(0, 10)
    };

    this.state.roles = [...this.state.roles, newRole];
    this.saveState();
    return { success: true, role: newRole };
  }

  public updateRole(roleId: string, updates: Partial<RoleDefinition>): { success: boolean; error?: string } {
    const roleIndex = this.state.roles.findIndex(r => r.id === roleId);
    if (roleIndex === -1) {
      return { success: false, error: 'Role not found.' };
    }

    const existing = this.state.roles[roleIndex];
    
    // Superadmin is protected: always retains canManageUsersAndRoles and canExportReset
    const permissions = updates.permissions
      ? {
          ...existing.permissions,
          ...updates.permissions,
          ...(existing.id === 'superadmin' ? { canManageUsersAndRoles: true, canExportReset: true } : {})
        }
      : existing.permissions;

    this.state.roles[roleIndex] = {
      ...existing,
      ...updates,
      permissions
    };

    this.saveState();
    return { success: true };
  }

  public deleteRole(roleId: string): { success: boolean; error?: string } {
    if (roleId === 'superadmin') {
      return { success: false, error: 'The Super Administrator system role cannot be deleted.' };
    }

    // Check if any user is assigned to this role
    const assignedUsers = this.state.users.filter(u => u.roleId === roleId);
    if (assignedUsers.length > 0) {
      return { 
        success: false, 
        error: `Cannot delete role: ${assignedUsers.length} active user(s) currently assigned (${assignedUsers.map(u => u.username).join(', ')}). Please reassign them first.` 
      };
    }

    this.state.roles = this.state.roles.filter(r => r.id !== roleId);
    this.saveState();
    return { success: true };
  }

  // ==========================================
  // USER ACCOUNT MANAGEMENT
  // ==========================================

  public getUsers(): StaffUserAccount[] {
    return this.state.users;
  }

  public getUserById(userId: string): StaffUserAccount | undefined {
    return this.state.users.find(u => u.id === userId);
  }

  public addUser(userData: {
    username: string;
    password: string;
    displayName: string;
    email: string;
    roleId: string;
    status?: 'Active' | 'Suspended';
  }): { success: boolean; user?: StaffUserAccount; error?: string } {
    const cleanUsername = userData.username.trim().toLowerCase();
    
    if (!cleanUsername) {
      return { success: false, error: 'Username is required.' };
    }
    if (!userData.password.trim()) {
      return { success: false, error: 'Password is required.' };
    }
    if (this.state.users.some(u => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: `Username "${cleanUsername}" is already taken.` };
    }
    if (!this.state.roles.some(r => r.id === userData.roleId)) {
      return { success: false, error: 'Invalid role assigned.' };
    }

    const newUser: StaffUserAccount = {
      id: 'usr-' + Date.now().toString(36),
      username: cleanUsername,
      password: userData.password.trim(),
      displayName: userData.displayName.trim() || cleanUsername,
      email: userData.email.trim() || `${cleanUsername}@bridgecollege.edu.ng`,
      roleId: userData.roleId,
      status: userData.status || 'Active',
      createdAt: new Date().toISOString().slice(0, 10)
    };

    this.state.users = [...this.state.users, newUser];
    this.saveState();
    return { success: true, user: newUser };
  }

  public updateUser(userId: string, updates: Partial<Omit<StaffUserAccount, 'id' | 'createdAt'>>): { success: boolean; error?: string } {
    const userIndex = this.state.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, error: 'User not found.' };
    }

    const existing = this.state.users[userIndex];

    // Check username uniqueness if changed
    if (updates.username && updates.username.trim().toLowerCase() !== existing.username.toLowerCase()) {
      const cleanUsername = updates.username.trim().toLowerCase();
      if (this.state.users.some(u => u.id !== userId && u.username.toLowerCase() === cleanUsername)) {
        return { success: false, error: `Username "${cleanUsername}" is already taken by another account.` };
      }
      updates.username = cleanUsername;
    }

    if (updates.roleId && !this.state.roles.some(r => r.id === updates.roleId)) {
      return { success: false, error: 'Selected role does not exist.' };
    }

    this.state.users[userIndex] = {
      ...existing,
      ...updates
    };

    this.saveState();
    return { success: true };
  }

  public deleteUser(userId: string): { success: boolean; error?: string } {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) {
      return { success: false, error: 'User not found.' };
    }
    if (user.username === 'admin') {
      return { success: false, error: 'The primary admin account cannot be deleted.' };
    }
    if (this.state.activeUserId === userId) {
      return { success: false, error: 'Cannot delete the currently logged in user.' };
    }

    this.state.users = this.state.users.filter(u => u.id !== userId);
    this.saveState();
    return { success: true };
  }

  // ==========================================
  // ACTIVE USER & AUTHENTICATION
  // ==========================================

  public isAuthenticated(): boolean {
    if (!this.authenticatedUserId) return false;
    return !!this.getUserById(this.authenticatedUserId);
  }

  public getAuthenticatedUser(): StaffUserAccount | null {
    if (!this.authenticatedUserId) return null;
    return this.getUserById(this.authenticatedUserId) || null;
  }

  public getActiveUser(): StaffUserAccount {
    if (this.authenticatedUserId) {
      const authUser = this.getUserById(this.authenticatedUserId);
      if (authUser) return authUser;
    }
    const user = this.state.users.find(u => u.id === this.state.activeUserId);
    if (user) return user;
    return this.state.users[0] || DEFAULT_USERS[0];
  }

  public setActiveUser(userId: string): boolean {
    const user = this.state.users.find(u => u.id === userId);
    if (user) {
      this.state.activeUserId = userId;
      user.lastLogin = 'Just now';
      this.saveState();
      return true;
    }
    return false;
  }

  public loginWithCredentials(username: string, password: string): { success: boolean; user?: StaffUserAccount; error?: string } {
    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    const user = this.state.users.find(u => u.username.toLowerCase() === cleanUsername);
    if (!user) {
      return { success: false, error: 'Staff account not found. Please verify your username.' };
    }
    if (user.status === 'Suspended') {
      return { success: false, error: 'This staff account has been suspended by the administrator.' };
    }
    if (user.password !== cleanPassword) {
      return { success: false, error: 'Incorrect password. Please re-enter your password.' };
    }

    this.authenticatedUserId = user.id;
    try {
      sessionStorage.setItem(STAFF_AUTH_SESSION_KEY, user.id);
    } catch (e) {}

    this.setActiveUser(user.id);
    this.notify();
    return { success: true, user };
  }

  public logout() {
    this.authenticatedUserId = null;
    try {
      sessionStorage.removeItem(STAFF_AUTH_SESSION_KEY);
    } catch (e) {}
    this.notify();
  }

  // --- BACKWARD COMPATIBLE RBAC HELPERS ---
  public getRole(): string {
    const activeUser = this.getActiveUser();
    return activeUser.roleId;
  }

  public getProfile(): StaffUserProfile {
    const activeUser = this.getActiveUser();
    const roleDef = this.getRoleById(activeUser.roleId) || DEFAULT_ROLES[0];
    const initials = activeUser.displayName
      .split(' ')
      .filter(Boolean)
      .map(s => s[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'ST';

    return {
      role: roleDef.id,
      displayName: activeUser.displayName,
      email: activeUser.email,
      avatarText: initials,
      roleTitle: roleDef.name,
      permissions: roleDef.permissions
    };
  }

  public setRole(roleId: string) {
    const roleDef = this.getRoleById(roleId);
    if (roleDef) {
      // Find a user with this role or update active user's role
      const matchingUser = this.state.users.find(u => u.roleId === roleId);
      if (matchingUser) {
        this.setActiveUser(matchingUser.id);
      } else {
        const activeUser = this.getActiveUser();
        activeUser.roleId = roleId;
        this.saveState();
      }
    }
  }

  // ==========================================
  // CAREERS & RECRUITMENT METHODS
  // ==========================================

  public addJob(job: Omit<JobPosting, 'id' | 'postedDate'>, author?: { id: string; displayName: string; username: string }): JobPosting {
    const active = author || this.getActiveUser();
    const newJob: JobPosting = {
      ...job,
      id: 'job-' + Date.now().toString(36),
      postedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      authorId: job.authorId || active?.id,
      authorName: job.authorName || active?.displayName,
      authorUsername: job.authorUsername || active?.username
    };
    this.state.jobs = [newJob, ...this.state.jobs];
    this.saveState();
    return newJob;
  }

  public updateJob(id: string, updates: Partial<JobPosting>) {
    this.state.jobs = this.state.jobs.map(j => j.id === id ? { ...j, ...updates } : j);
    this.saveState();
  }

  public deleteJob(id: string) {
    this.state.jobs = this.state.jobs.filter(j => j.id !== id);
    this.saveState();
  }

  public addApplication(app: Omit<JobApplication, 'id' | 'appliedAt' | 'status'>): JobApplication {
    const newApp: JobApplication = {
      ...app,
      id: 'APP-' + Math.floor(1000 + Math.random() * 9000),
      status: 'New',
      appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    this.state.applications = [newApp, ...this.state.applications];
    this.saveState();
    return newApp;
  }

  public updateApplicationStatus(id: string, status: JobApplication['status'], adminNotes?: string) {
    this.state.applications = this.state.applications.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status,
          adminNotes: adminNotes !== undefined ? adminNotes : a.adminNotes
        };
      }
      return a;
    });
    this.saveState();
  }

  public deleteApplication(id: string) {
    this.state.applications = this.state.applications.filter(a => a.id !== id);
    this.saveState();
  }

  // ==========================================
  // ADVERTS & NOTIFICATIONS METHODS
  // ==========================================

  public updateTicker(ticker: Partial<TopTickerConfig>) {
    this.state.ticker = { ...this.state.ticker, ...ticker };
    this.saveState();
  }

  public updateSpaceRentalBar(bar: Partial<SpaceRentalBarConfig>) {
    this.state.spaceRentalBar = { ...this.state.spaceRentalBar, ...bar };
    this.saveState();
  }

  public addPromoBanner(banner: Omit<PromoBanner, 'id'>, author?: { id: string; displayName: string; username: string }): PromoBanner {
    const active = author || this.getActiveUser();
    const newBanner: PromoBanner = {
      ...banner,
      id: 'promo-' + Date.now().toString(36),
      authorId: banner.authorId || active?.id,
      authorName: banner.authorName || active?.displayName,
      authorUsername: banner.authorUsername || active?.username
    };
    this.state.promoBanners = [newBanner, ...this.state.promoBanners];
    this.saveState();
    return newBanner;
  }

  public updatePromoBanner(id: string, updates: Partial<PromoBanner>) {
    this.state.promoBanners = this.state.promoBanners.map(b => b.id === id ? { ...b, ...updates } : b);
    this.saveState();
  }

  public deletePromoBanner(id: string) {
    this.state.promoBanners = this.state.promoBanners.filter(b => b.id !== id);
    this.saveState();
  }

  // ==========================================
  // BRANDING & SITE LOGO METHODS
  // ==========================================

  public getLogoUrl(): string {
    return this.state.branding?.logoUrl || bconOfficialLogo;
  }

  public updateBranding(updates: Partial<SiteBrandingConfig>) {
    this.state.branding = {
      ...this.state.branding,
      ...updates
    };
    this.saveState();
  }

  public resetLogoToDefault() {
    this.state.branding = {
      logoUrl: bconOfficialLogo
    };
    this.saveState();
  }

  // ==========================================
  // SITE TEXT & COPY METHODS
  // ==========================================

  public updateSiteCopy(updates: Partial<SiteCopy>) {
    this.state.siteCopy = {
      ...this.state.siteCopy,
      ...updates,
      hero: { ...this.state.siteCopy.hero, ...(updates.hero || {}) },
      contact: { ...this.state.siteCopy.contact, ...(updates.contact || {}) },
      stats: { ...this.state.siteCopy.stats, ...(updates.stats || {}) },
      admissionsNotice: { ...this.state.siteCopy.admissionsNotice, ...(updates.admissionsNotice || {}) }
    };
    this.saveState();
  }

  // ==========================================
  // MEDIA & VIDEO METHODS
  // ==========================================

  public addMediaItem(item: Omit<EditableMediaItem, 'id' | 'uploadedAt'>): EditableMediaItem {
    const newItem: EditableMediaItem = {
      ...item,
      id: 'media-' + Date.now().toString(36),
      uploadedAt: new Date().toLocaleDateString()
    };
    this.state.mediaItems = [newItem, ...this.state.mediaItems];
    this.saveState();
    return newItem;
  }

  public updateMediaItem(id: string, updates: Partial<EditableMediaItem>) {
    this.state.mediaItems = this.state.mediaItems.map(m => m.id === id ? { ...m, ...updates } : m);
    this.saveState();
  }

  public deleteMediaItem(id: string) {
    this.state.mediaItems = this.state.mediaItems.filter(m => m.id !== id);
    this.saveState();
  }

  public updateVideoConfig(config: Partial<MediaVideoConfig>) {
    this.state.videoConfig = { ...this.state.videoConfig, ...config };
    this.saveState();
  }

  // ==========================================
  // SYSTEM TOOLS & DATA BACKUP
  // ==========================================

  public resetToDefaults() {
    this.state = {
      jobs: DEFAULT_JOBS,
      applications: DEFAULT_APPLICATIONS,
      ticker: DEFAULT_TICKER,
      spaceRentalBar: DEFAULT_SPACERENTAL_BAR,
      promoBanners: DEFAULT_PROMO_BANNERS,
      siteCopy: DEFAULT_SITE_COPY,
      mediaItems: DEFAULT_MEDIA_ITEMS,
      videoConfig: DEFAULT_VIDEO_CONFIG,
      branding: DEFAULT_BRANDING,
      roles: DEFAULT_ROLES,
      users: DEFAULT_USERS,
      activeUserId: 'usr-001'
    };
    this.saveState();
  }

  public exportBackupJson(): string {
    return JSON.stringify(this.state, null, 2);
  }

  public importBackupJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        this.state = {
          jobs: parsed.jobs || DEFAULT_JOBS,
          applications: parsed.applications || DEFAULT_APPLICATIONS,
          ticker: parsed.ticker || DEFAULT_TICKER,
          spaceRentalBar: parsed.spaceRentalBar || DEFAULT_SPACERENTAL_BAR,
          promoBanners: parsed.promoBanners || DEFAULT_PROMO_BANNERS,
          siteCopy: parsed.siteCopy || DEFAULT_SITE_COPY,
          mediaItems: parsed.mediaItems || DEFAULT_MEDIA_ITEMS,
          videoConfig: parsed.videoConfig || DEFAULT_VIDEO_CONFIG,
          branding: parsed.branding || DEFAULT_BRANDING,
          roles: parsed.roles || DEFAULT_ROLES,
          users: parsed.users || DEFAULT_USERS,
          activeUserId: parsed.activeUserId || 'usr-001'
        };
        this.saveState();
        return true;
      }
    } catch (e) {
      console.error('Import error', e);
    }
    return false;
  }
}

// Global Singleton Store Instance
export const siteContentStore = new SiteContentStore();
