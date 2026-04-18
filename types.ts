
export type UserRole = 'STUDENT' | 'PROFESSOR' | 'ADMIN';
export type Language = 'FR' | 'EN' | 'ES' | 'AR';

export interface ClassGroup {
  id: string;
  name: string;
  level: string;
  academicYear: string;
  studentCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  studentId?: string; // For students
  adminId?: string; // For admins
  matricule?: string; // For profs
  department?: string; // For profs (e.g. "Informatique", "Mathématiques")
  classGroupId?: string; // Link student to a class group
  courses?: string[]; // Course IDs
  languages?: string[]; // Spoken languages
  experience?: number; // Years
  address?: string;
  isOnline?: boolean;
}

export interface UserDocument {
  id: string;
  userId: string;
  courseId?: string; // Optional: Link document to a specific course
  name: string;
  type: string;
  date: string;
  url: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  professorId: string;
  professorName: string;
  classGroupId?: string; // Link course to a class group
  description: string;
  schedule: string;
  room: string;
}

export interface Book {
  id: string;
  courseId: string;
  title: string;
  author: string;
  url: string; // Mock URL
  addedBy: string;
  description?: string;
  publicationDate?: string;
}

export interface Lab {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'OPEN' | 'CLOSED';
  url?: string;
}

export interface Submission {
  id: string;
  labId: string;
  studentId: string;
  fileUrl: string;
  status: 'SUBMITTED' | 'LATE';
  submittedAt: string;
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  type: 'HOMEWORK' | 'EXAM' | 'QUIZ' | 'INTERROGATION' | 'MEMOIRE';
  score: number;
  maxScore: number;
  date: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'IMAGE' | 'FILE';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  courseId: string; // Acts as the chat room
  content: string;
  timestamp: string;
  isAnnouncement?: boolean;
  attachments?: Attachment[];
  reactions?: Record<string, number>; // e.g. { '👍': 2, '❤️': 1 }
}

export interface Notification {
  id: string;
  userId?: string; // If null, global
  title: string;
  message: string;
  read: boolean;
  type: 'INFO' | 'WARNING' | 'SUCCESS';
  timestamp: string;
  targetGroup?: 'ALL' | 'PROFESSOR' | 'STUDENT';
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'RESOLVED';
  date: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'SHORT';
  options?: string[];
  correctAnswer: string;
  points: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: number; // minutes
  questions: Question[];
  status: 'OPEN' | 'CLOSED';
  date: string;
}
