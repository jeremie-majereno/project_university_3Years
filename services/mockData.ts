
import { User, Course, Book, Lab, Grade, Message, Notification, ClassGroup, UserDocument } from '../types';

// Mock Classes
export const MOCK_CLASSES: ClassGroup[] = [
  {
    id: 'cl1',
    name: 'Master 1 AI',
    level: 'Master 1',
    academicYear: '2023-2024',
    studentCount: 24
  },
  {
    id: 'cl2',
    name: 'Bachelor 3 Web',
    level: 'Bachelor 3',
    academicYear: '2023-2024',
    studentCount: 45
  },
  {
    id: 'cl3',
    name: 'Master 2 Data Science',
    level: 'Master 2',
    academicYear: '2023-2024',
    studentCount: 18
  }
];

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: 's1',
    name: 'John Doe',
    email: 'john.student@uni.edu',
    role: 'STUDENT',
    studentId: 'STU-2024-001',
    classGroupId: 'cl1', 
    address: '123 University Street',
    courses: ['c1', 'c2', 'c4', 'c5', 'c7', 'c8'],
    isOnline: true,
    avatar: 'JD'
  },
  {
    id: 's2',
    name: 'Alice Martin',
    email: 'alice.m@uni.edu',
    role: 'STUDENT',
    studentId: 'STU-2024-002',
    classGroupId: 'cl1',
    address: '45 Champs Avenue',
    courses: ['c1', 'c3'],
    isOnline: false,
    avatar: 'AM'
  },
  {
    id: 'p1',
    name: 'Dr. Marie Curie',
    email: 'marie.prof@uni.edu',
    role: 'PROFESSOR',
    matricule: 'PROF-SCI-99',
    department: 'Physical Sciences',
    courses: ['c1', 'c4', 'c5', 'c7'],
    languages: ['French', 'English', 'Polish'],
    experience: 15,
    isOnline: true,
    avatar: 'MC'
  },
  {
    id: 'p2',
    name: 'Prof. Alan Turing',
    email: 'alan.t@uni.edu',
    role: 'PROFESSOR',
    matricule: 'PROF-INF-01',
    department: 'Computer Science',
    courses: ['c2', 'c3', 'c6', 'c8'],
    experience: 8,
    isOnline: false,
    avatar: 'AT'
  },
  {
    id: 'a1',
    name: 'Main Admin',
    email: 'admin@uni.edu',
    role: 'ADMIN',
    adminId: 'ADM-001',
    isOnline: false,
    avatar: 'AD'
  }
];

// Mock Courses
export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    code: 'AIP3',
    name: 'Advanced Artificial Intelligence',
    professorId: 'p1',
    professorName: 'Dr. Marie Curie',
    classGroupId: 'cl1',
    description: 'In-depth study of neural networks and Deep Learning. This course covers theoretical foundations and practical applications.',
    schedule: 'Monday 14:00 - 17:00',
    room: 'Lab A4',
  },
  {
    id: 'c2',
    code: 'WEB2',
    name: 'Modern Web Development with React',
    professorId: 'p2',
    professorName: 'Prof. Alan Turing',
    classGroupId: 'cl2',
    description: 'Building modern SPA applications. Hooks, Context API, and State Management.',
    schedule: 'Tuesday 09:00 - 12:00',
    room: 'Room B2',
  },
  {
    id: 'c3',
    code: 'DAT1',
    name: 'Big Data Analytics',
    professorId: 'p2',
    professorName: 'Prof. Alan Turing',
    classGroupId: 'cl3',
    description: 'Analysis of massive datasets with Hadoop and Spark. Distributed processing.',
    schedule: 'Thursday 08:00 - 11:00',
    room: 'Hall C',
  },
  {
    id: 'c4',
    code: 'MATH4',
    name: 'Applied Linear Algebra',
    professorId: 'p1',
    professorName: 'Dr. Marie Curie',
    classGroupId: 'cl1',
    description: 'Matrices, vectors and applications in AI. SVD decomposition and eigenvalues.',
    schedule: 'Friday 10:00 - 12:00',
    room: 'Hall A',
  }
];

// Mock Books
export const MOCK_BOOKS: Book[] = [
  { id: 'b1', courseId: 'c1', title: 'Deep Learning', author: 'Ian Goodfellow', url: '#', addedBy: 'p1', description: 'The absolute reference in Deep Learning.', publicationDate: '2016' },
  { id: 'b2', courseId: 'c1', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', url: '#', addedBy: 'p1', description: 'Foundations of AI.', publicationDate: '2020' }
];

// Mock Labs
export const MOCK_LABS: Lab[] = [
  { id: 'l1', courseId: 'c1', title: 'Lab 1: Simple Perceptron', description: 'Python implementation of a perceptron without libraries.', dueDate: '2023-10-15', status: 'CLOSED' },
  { id: 'l2', courseId: 'c1', title: 'Lab 2: Backpropagation', description: 'Implementation of the backpropagation algorithm.', dueDate: '2023-11-20', status: 'OPEN' }
];

// Mock Documents
export const MOCK_DOCUMENTS: UserDocument[] = [
  { id: 'd1', userId: 'p1', courseId: 'c1', name: 'Syllabus_AIP3.pdf', type: 'PDF', date: '2023-09-01', url: '#' },
  { id: 'd2', userId: 'p2', courseId: 'c2', name: 'Intro_React.pptx', type: 'PPT', date: '2023-09-15', url: '#' }
];

// Mock Grades
export const MOCK_GRADES: Grade[] = [
  { id: 'g1', studentId: 's1', courseId: 'c1', type: 'HOMEWORK', score: 18, maxScore: 20, date: '2023-10-15' },
  { id: 'g2', studentId: 's1', courseId: 'c2', type: 'EXAM', score: 14.5, maxScore: 20, date: '2023-10-20' }
];

// Mock Chat Messages
export const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    courseId: 'c1',
    senderId: 'p1',
    senderName: 'Dr. Marie Curie',
    content: 'Welcome to AIP3! Don\'t forget Lab 1 for Monday.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isAnnouncement: true,
    reactions: { '👍': 5 }
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'New grade available', message: 'Your grade for AI Lab 1 has been published.', read: false, type: 'INFO', timestamp: new Date().toISOString(), userId: 's1' },
  { id: '2', title: 'Exam Reminder', message: 'React Web Exam tomorrow at 09:00 in Room B2.', read: false, type: 'WARNING', timestamp: new Date(Date.now() - 3600000).toISOString(), userId: 's1' }
];

// Translations
export const TRANSLATIONS = {
  FR: {
    welcome: 'Bienvenue',
    dashboard: 'Tableau de bord',
    courses: 'Cours',
    grades: 'Notes',
    schedule: 'Emploi du temps',
    info: 'Informations',
    logout: 'Déconnexion',
    search: 'Rechercher',
    chat: 'Messagerie',
    books: 'Livres',
    labs: 'Laboratoires',
    submit: 'Soumettre',
    download: 'Télécharger',
    settings: 'Paramètres'
  },
  EN: {
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    courses: 'Courses',
    grades: 'Grades',
    schedule: 'Schedule',
    info: 'Information',
    logout: 'Logout',
    search: 'Search',
    chat: 'Chat',
    books: 'Books',
    labs: 'Labs',
    submit: 'Submit',
    download: 'Download',
    settings: 'Settings'
  }
};
