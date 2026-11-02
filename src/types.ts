export interface Programme {
  id: string;
  name: string;
  duration: string;
  level: string;
  requirements: string[];
  description: string;
  outcomes: string[];
  fees: {
    tuition: string;
    ancillary: string;
    total: string;
  };
}

export interface StudentProfile {
  id: string;
  name: string;
  matricNo: string;
  programme: string;
  year: number;
  semester: number;
  avatar: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'academic' | 'general' | 'administrative' | 'student-association';
  sender: string;
}

export interface ExamSchedule {
  courseCode: string;
  courseName: string;
  date: string;
  time: string;
  venue: string;
}

export interface TimetableEntry {
  day: string;
  classes: {
    time: string;
    courseCode: string;
    courseName: string;
    instructor: string;
    hall: string;
  }[];
}

export interface LectureMaterial {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  type: 'PDF' | 'Slides' | 'Video' | 'Link';
  url: string;
  description: string;
  dateAdded: string;
}

export interface Grade {
  courseCode: string;
  courseName: string;
  units: number;
  grade: string;
  gp: number;
}

export interface AdmissionFormSubmission {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  stateOfOrigin: string;
  programmeSelected: string;
  waecResults: {
    english: string;
    maths: string;
    biology: string;
    chemistry: string;
    physics: string;
  };
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Labs' | 'ICT Room' | 'Library' | 'Building' | 'Offices' | 'Lecture Halls';
  description: string;
  imageUrl: string;
}

export interface FacultyMember {
  name: string;
  role: string;
  qualification: string;
  department: string;
  avatarUrl: string;
}
