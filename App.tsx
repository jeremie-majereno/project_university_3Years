
import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  BookOpen, Bell, Search, Moon, Sun, Menu, X, 
  GraduationCap, FileText, MessageCircle, Settings, LogOut, 
  Users, BarChart, Calendar, ChevronRight, Briefcase, 
  Shield, Globe, User as UserIcon, Megaphone, PieChart
} from 'lucide-react';
import { User, UserRole, Language, Notification, Course, ClassGroup, Grade, Message, UserDocument, Book, Lab } from './types';
import { TRANSLATIONS, MOCK_USERS, MOCK_COURSES, MOCK_CLASSES, MOCK_GRADES, MOCK_MESSAGES, MOCK_NOTIFICATIONS, MOCK_DOCUMENTS, MOCK_BOOKS, MOCK_LABS } from './services/mockData';

// --- Re-exporting views from specific files ---
import { AdminOverview, AdminProfsView, AdminProfessorDetails, AdminClassesView, AdminClassDetails, AdminStudentProfileView, AdminScheduleManagement, AdminAnnouncements } from './admin';
import { ProfessorGradeManagement } from './teacher';
import { StudentGradesView } from './student';
import { CoursesView, CourseDetailsView, ScheduleView, ChatSystem, DocumentLibrary } from './shared';

// --- UI Base Components ---

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyle = "px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25",
    secondary: "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500",
    ghost: "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50",
    danger: "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={`bg-white dark:bg-slate-800/50 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 backdrop-blur-sm ${className || ''}`} {...props}>
    {children}
  </div>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-6">
      <Card className="w-full max-w-lg p-10 rounded-[3rem] animate-in zoom-in shadow-2xl relative border-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
        <button onClick={onClose} className="absolute right-8 top-8 text-slate-400 hover:text-slate-600 transition-all p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
          <X size={24}/>
        </button>
        <h3 className="text-2xl font-extrabold mb-10 dark:text-white uppercase tracking-tight">{title}</h3>
        <div className="max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
          {children}
        </div>
      </Card>
    </div>
  );
};

export const Badge = ({ count }: { count: number }) => {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce">
      {count}
    </span>
  );
};

// --- Context ---

export interface AppContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  updateUser: (user: User) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  sendAnnouncement: (announcement: Partial<Notification>) => void;
  t: (key: string) => string;
  allUsers: User[];
  allCourses: Course[];
  allClasses: ClassGroup[];
  allGrades: Grade[];
  messages: Message[];
  documents: UserDocument[];
  books: Book[];
  labs: Lab[];
  addClass: (newClass: ClassGroup) => void;
  updateClass: (cls: ClassGroup) => void;
  deleteClass: (id: string) => void;
  addProfessor: (newProfessor: User) => void;
  addStudent: (student: User) => void;
  removeUser: (userId: string) => void;
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  addBook: (book: Book) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  addLab: (lab: Lab) => void;
  updateLab: (lab: Lab) => void;
  deleteLab: (id: string) => void;
  addGrade: (grade: Grade) => void;
  updateGrade: (grade: Grade) => void;
  deleteGrade: (id: string) => void;
  sendMessage: (msg: Message) => void;
  addDocument: (doc: UserDocument) => void;
  updateDocument: (doc: UserDocument) => void;
  deleteDocument: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

// --- Settings View ---

const SettingsView = () => {
  const { theme, toggleTheme, language, setLanguage, user, updateUserProfile } = useAppContext();
  return (
    <div className="max-w-4xl mx-auto space-y-16 view-transition">
      <div>
        <h2 className="text-4xl font-extrabold dark:text-white uppercase tracking-tight">System Preferences</h2>
        <p className="text-sm text-slate-400 font-semibold uppercase mt-2 tracking-widest opacity-80">Manage your profile</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Card className="p-12 border-none shadow-sm rounded-[3.5rem] relative overflow-hidden">
          <h3 className="text-xl font-black mb-12 dark:text-white uppercase tracking-tight flex items-center gap-4"><Sun className="text-orange-500" size={28}/> Appearance</h3>
          <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] transition-all">
             <div><p className="font-black text-sm uppercase dark:text-white">Dark Mode</p><p className="text-[10px] text-slate-400 uppercase font-extrabold mt-1">High contrast</p></div>
             <button onClick={toggleTheme} className={`w-18 h-10 rounded-full transition-all duration-700 relative flex items-center px-1.5 ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-300'}`}><div className={`w-7 h-7 bg-white rounded-full transition-all duration-700 shadow-xl ${theme === 'dark' ? 'translate-x-8' : 'translate-x-0'}`}></div></button>
          </div>
        </Card>
        <Card className="p-12 border-none shadow-sm rounded-[3.5rem]">
          <h3 className="text-xl font-black mb-12 dark:text-white uppercase tracking-tight flex items-center gap-4"><Globe className="text-blue-500" size={28}/> Language</h3>
          <div className="grid grid-cols-2 gap-4">
            {(['EN', 'FR', 'ES', 'AR'] as Language[]).map(lang => (
              <button key={lang} onClick={() => setLanguage(lang)} className={`p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 ${language === lang ? 'bg-blue-600 text-white shadow-xl' : 'bg-slate-50 dark:bg-slate-900/50 text-slate-500'}`}>{lang}</button>
            ))}
          </div>
        </Card>
        <Card className="p-12 border-none shadow-sm rounded-[3.5rem] md:col-span-2">
           <h3 className="text-xl font-black mb-12 dark:text-white uppercase tracking-tight flex items-center gap-4"><UserIcon className="text-purple-500" size={28}/> My Profile</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase ml-3 tracking-widest">Full Name</label>
                <input className="w-full p-6 bg-slate-50 dark:bg-slate-900/50 border-none rounded-[2rem] outline-none font-black dark:text-white focus:ring-4 focus:ring-blue-500/10 text-lg shadow-inner" value={user?.name || ''} onChange={e => updateUserProfile({name: e.target.value})}/>
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase ml-3 tracking-widest">Academic Email</label>
                <input disabled className="w-full p-6 bg-slate-50 dark:bg-slate-900 border-none rounded-[2rem] outline-none font-black opacity-40 cursor-not-allowed text-lg shadow-inner" value={user?.email || ''}/>
              </div>
           </div>
           <div className="mt-16 flex justify-end">
              <Button variant="primary" className="h-20 px-16 rounded-[2.5rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-blue-600/40">Save Changes</Button>
           </div>
        </Card>
      </div>
    </div>
  );
};

// --- Auth Page ---

const AuthPage = () => {
  const { login } = useAppContext();
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-purple-500 rounded-full blur-[120px]"></div>
      </div>
      <Card className="max-w-md w-full p-10 space-y-10 text-center view-transition z-10">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-600/30 mb-6 rotate-3">
            <GraduationCap size={44} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">UniVerse</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-3 px-8">The next-generation academic portal.</p>
        </div>
        <div className="space-y-4">
          <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6">Choose your role</p>
          <div className="grid grid-cols-1 gap-4">
            <Button onClick={() => login('john.student@uni.edu', 'STUDENT')} variant="secondary" className="group h-16 rounded-2xl justify-between px-8 border-none bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <div className="flex items-center gap-4"><Users size={22} className="text-blue-500" /><span className="font-bold text-sm tracking-tight">Student</span></div>
              <ChevronRight size={18} className="text-slate-300" />
            </Button>
            <Button onClick={() => login('marie.prof@uni.edu', 'PROFESSOR')} variant="secondary" className="group h-16 rounded-2xl justify-between px-8 border-none bg-slate-50 dark:bg-slate-900/50 hover:bg-purple-50 dark:hover:bg-purple-900/20">
              <div className="flex items-center gap-4"><Briefcase size={22} className="text-purple-500" /><span className="font-bold text-sm tracking-tight">Professor</span></div>
              <ChevronRight size={18} className="text-slate-300" />
            </Button>
            <Button onClick={() => login('admin@uni.edu', 'ADMIN')} variant="secondary" className="group h-16 rounded-2xl justify-between px-8 border-none bg-slate-50 dark:bg-slate-900/50 hover:bg-orange-50 dark:hover:bg-orange-900/20">
              <div className="flex items-center gap-4"><Shield size={22} className="text-orange-500" /><span className="font-bold text-sm tracking-tight">Administrator</span></div>
              <ChevronRight size={18} className="text-slate-300" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// --- Dashboard Component ---

const Dashboard = () => {
  const { user, logout, theme, toggleTheme, notifications, markNotificationAsRead } = useAppContext();
  const [activeView, setActiveView] = useState(user?.role === 'ADMIN' ? 'admin-overview' : 'courses');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedProfId, setSelectedProfId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const myNotifications = notifications.filter(n => 
    n.userId === user?.id || (!n.userId && (n.targetGroup === 'ALL' || n.targetGroup === user?.role))
  );
  const unreadCount = myNotifications.filter(n => !n.read).length;

  const handleSelectCourse = (id: string) => { setSelectedCourseId(id); setActiveView('course-details'); };
  const handleBackToCourses = () => { setSelectedCourseId(null); setActiveView('courses'); };

  const menuItems = [
    { id: 'courses', label: 'MODULES', icon: BookOpen, roles: ['STUDENT', 'PROFESSOR'] },
    { id: 'grades', label: 'GRADES', icon: GraduationCap, roles: ['STUDENT'] },
    { id: 'schedule', label: 'SCHEDULE', icon: Calendar, roles: ['STUDENT', 'PROFESSOR'] },
    { id: 'chat', label: 'MESSAGES', icon: MessageCircle, roles: ['STUDENT', 'PROFESSOR'] },
    { id: 'documents', label: 'LIBRARY', icon: FileText, roles: ['STUDENT', 'PROFESSOR'] },
    { id: 'admin-overview', label: 'DASHBOARD', icon: BarChart, roles: ['ADMIN'] },
    { id: 'admin-profs', label: 'FACULTY', icon: Users, roles: ['ADMIN'] },
    { id: 'admin-classes', label: 'PROMOTIONS', icon: PieChart, roles: ['ADMIN'] },
    { id: 'admin-schedule', label: 'GLOBAL SCHEDULE', icon: Calendar, roles: ['ADMIN'] },
    { id: 'admin-announcements', label: 'ANNOUNCEMENTS', icon: Megaphone, roles: ['ADMIN'] },
    { id: 'settings', label: 'SETTINGS', icon: Settings, roles: ['STUDENT', 'PROFESSOR', 'ADMIN'] },
  ].filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className={`flex min-h-screen transition-all duration-500`}>
      <aside className={`fixed md:sticky top-0 h-screen z-50 w-80 bg-white dark:bg-[#0f172a] border-r border-slate-100 dark:border-white/5 flex flex-col shadow-2xl transition-transform duration-700 ease-in-out ${isSidebarOpen ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
        <div className="p-10 flex items-center gap-5 mb-10">
          <div className="w-14 h-14 bg-blue-600 rounded-[1.75rem] flex items-center justify-center text-white shadow-2xl shadow-blue-600/40 ring-8 ring-blue-600/10 rotate-3">
            <GraduationCap size={34} />
          </div>
          <span className="font-black text-3xl tracking-tighter text-slate-900 dark:text-white uppercase leading-none">UniVerse</span>
        </div>
        <nav className="flex-1 px-5 space-y-3 overflow-y-auto scrollbar-hide">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => { setActiveView(item.id); setSelectedProfId(null); setSelectedClassId(null); setSelectedCourseId(null); setSelectedStudentId(null); if(window.innerWidth < 768) setSidebarOpen(false); }} className={`w-full flex items-center gap-6 px-8 py-5 rounded-[2.25rem] transition-all duration-500 relative group ${activeView === item.id || (activeView === 'course-details' && item.id === 'courses') || (activeView === 'admin-student-profile' && item.id === 'admin-classes') ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'}`}>
              <item.icon size={26} className={`${activeView === item.id ? 'scale-110' : 'group-hover:scale-110 transition-transform duration-500'}`} />
              <span className="font-black text-[13px] uppercase tracking-[0.15em]">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-8 border-t dark:border-white/5 space-y-8">
           <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] flex items-center gap-5 border border-slate-100 dark:border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg uppercase text-sm ring-4 ring-blue-500/10">{user?.name.charAt(0)}</div>
              <div className="overflow-hidden">
                <p className="font-black text-sm text-slate-900 dark:text-white truncate uppercase tracking-tight">{user?.name.split(' ')[0]}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user?.role}</p>
              </div>
           </div>
           <button onClick={logout} className="w-full flex items-center gap-6 px-8 py-5 rounded-[2.25rem] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-black text-[13px] uppercase group"><LogOut size={26}/><span>Logout</span></button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#020617]">
         <header className="h-28 glass-card border-none flex items-center justify-between px-12 z-40 sticky top-0 md:shadow-none shadow-sm transition-all duration-500">
            <div className="flex items-center gap-10">
               <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-4 text-slate-500 rounded-[1.5rem] bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all border border-slate-100 dark:border-white/5">{isSidebarOpen ? <Menu size={28}/> : <X size={28}/>}</button>
               <div className="hidden lg:flex items-center relative group">
                 <Search size={22} className="absolute left-8 text-slate-300 group-focus-within:text-blue-600 transition-colors duration-500"/><input type="text" placeholder="SEARCH SYSTEM..." className="pl-20 pr-12 py-5 bg-slate-100/60 dark:bg-slate-900/60 rounded-[2.5rem] text-sm w-96 focus:w-[550px] transition-all duration-700 outline-none dark:text-white font-black tracking-[0.1em] shadow-inner" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
               </div>
            </div>
            <div className="flex items-center gap-8">
               <button onClick={toggleTheme} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border dark:border-white/5">{theme === 'light' ? <Moon size={24}/> : <Sun size={24}/>}</button>
               <div className="relative">
                 <button onClick={() => setNotificationsOpen(!isNotificationsOpen)} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border dark:border-white/5"><Bell size={26}/>{unreadCount > 0 && <Badge count={unreadCount}/>}</button>
                 {isNotificationsOpen && (
                   <div className="absolute right-0 top-full mt-8 w-[450px] bg-white dark:bg-slate-800 rounded-[3.5rem] shadow-2xl border-none overflow-hidden z-50 animate-in fade-in slide-in-from-top-6">
                     <div className="p-10 border-b dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                       <h3 className="font-black text-xs uppercase tracking-[0.3em] dark:text-white">Recent Alerts</h3>
                       <button onClick={() => myNotifications.forEach(n => markNotificationAsRead(n.id))} className="text-[10px] font-black text-blue-600 uppercase">Mark all read</button>
                     </div>
                     <div className="max-h-[550px] overflow-y-auto scrollbar-hide">
                       {myNotifications.map(n => (
                         <div key={n.id} onClick={() => markNotificationAsRead(n.id)} className={`p-10 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all cursor-pointer ${!n.read ? 'bg-blue-50/20 border-l-[10px] border-l-blue-600' : ''}`}>
                           <p className={`text-base ${!n.read ? 'font-black dark:text-white uppercase tracking-tight' : 'text-slate-500 font-bold opacity-70'}`}>{n.title}</p>
                           <p className="text-xs text-slate-400 mt-3 font-semibold leading-relaxed uppercase tracking-widest opacity-80">{n.message}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
            </div>
         </header>
         <main className="flex-1 overflow-y-auto p-10 md:p-16 lg:p-24 scroll-smooth">
            <div className="max-w-7xl mx-auto space-y-16">
               {activeView === 'admin-overview' && <AdminOverview />}
               {activeView === 'admin-profs' && (selectedProfId ? <AdminProfessorDetails professorId={selectedProfId} onBack={() => setSelectedProfId(null)} /> : <AdminProfsView onSelectProf={setSelectedProfId} />)}
               {activeView === 'admin-classes' && (selectedClassId ? <AdminClassDetails classId={selectedClassId} onBack={() => setSelectedClassId(null)} onSelectStudent={(id) => { setSelectedStudentId(id); setActiveView('admin-student-profile'); }} /> : <AdminClassesView onSelectClass={setSelectedClassId} />)}
               {activeView === 'admin-student-profile' && selectedStudentId && <AdminStudentProfileView studentId={selectedStudentId} onBack={() => setActiveView('admin-classes')} />}
               {activeView === 'admin-schedule' && <AdminScheduleManagement />}
               {activeView === 'admin-announcements' && <AdminAnnouncements />}
               {activeView === 'courses' && <CoursesView searchQuery={searchQuery} onSelectCourse={handleSelectCourse} />}
               {activeView === 'course-details' && selectedCourseId && <CourseDetailsView courseId={selectedCourseId} onBack={handleBackToCourses} />}
               {activeView === 'grades' && user?.role === 'STUDENT' && <StudentGradesView searchQuery={searchQuery} />}
               {activeView === 'schedule' && <ScheduleView />}
               {activeView === 'chat' && <ChatSystem searchQuery={searchQuery} />}
               {activeView === 'documents' && <DocumentLibrary searchQuery={searchQuery} />}
               {activeView === 'settings' && <SettingsView />}
            </div>
         </main>
      </div>
    </div>
  );
};

// --- App Core Provider ---

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguageState] = useState<Language>('EN');
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [allUsers, setAllUsers] = useState(MOCK_USERS);
  const [allCourses, setAllCourses] = useState(MOCK_COURSES);
  const [allClasses, setAllClasses] = useState(MOCK_CLASSES);
  const [allGrades, setAllGrades] = useState(MOCK_GRADES);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [documents, setDocuments] = useState<UserDocument[]>(MOCK_DOCUMENTS);
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [labs, setLabs] = useState<Lab[]>(MOCK_LABS);

  useEffect(() => { if (theme === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [theme]);
  const login = (email: string, role: UserRole) => { 
    const u = allUsers.find(u => u.email === email && u.role === role) || allUsers.find(u => u.role === role);
    if(u) setUser({...u, isOnline: true});
  };
  const logout = () => { if(user) setAllUsers(allUsers.map(u => u.id === user.id ? {...u, isOnline: false} : u)); setUser(null); };
  const updateUserProfile = (d: Partial<User>) => { if(user) setUser({...user, ...d}); };
  const updateUser = (u: User) => { 
    setAllUsers(prev => prev.map(x => x.id === u.id ? u : x)); 
    if(user?.id === u.id) setUser(u); 
  };

  const markNotificationAsRead = (id: string) => setNotifications(notifications.map(n => n.id === id ? {...n, read: true} : n));
  const sendAnnouncement = (ann: Partial<Notification>) => {
    const newAnn: Notification = { 
      id: `ann-${Date.now()}`, 
      title: ann.title || 'ALERT', 
      message: ann.message || '', 
      read: false, 
      type: ann.type || 'INFO', 
      timestamp: new Date().toISOString(), 
      targetGroup: ann.targetGroup || 'ALL' 
    };
    setNotifications([newAnn, ...notifications]);
  };

  return (
    <AppContext.Provider value={{ 
      user, login, logout, updateUserProfile, updateUser, theme, toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light'), language, setLanguage: setLanguageState, notifications, markNotificationAsRead, sendAnnouncement, t: (k) => (TRANSLATIONS[language] as any)[k] || k, 
      allUsers, allCourses, allClasses, allGrades, messages, documents, books, labs,
      addClass: (c) => setAllClasses([...allClasses, c]), 
      updateClass: (cls) => setAllClasses(allClasses.map(x => x.id === cls.id ? cls : x)),
      deleteClass: (id) => setAllClasses(allClasses.filter(x => x.id !== id)),
      addProfessor: (p) => setAllUsers([...allUsers, p]), 
      addStudent: (s) => setAllUsers([...allUsers, s]), 
      removeUser: (id) => setAllUsers(allUsers.filter(u => u.id !== id)),
      addCourse: (c) => setAllCourses([...allCourses, c]), 
      updateCourse: (c) => setAllCourses(allCourses.map(x => x.id === c.id ? c : x)), 
      deleteCourse: (id) => setAllCourses(allCourses.filter(x => x.id !== id)),
      addBook: (b) => setBooks([...books, b]), updateBook: (b) => setBooks(books.map(x => x.id === b.id ? b : x)), deleteBook: (id) => setBooks(books.filter(x => x.id !== id)),
      addLab: (l) => setLabs([...labs, l]), updateLab: (l) => setLabs(labs.map(x => x.id === l.id ? l : x)), deleteLab: (id) => setLabs(labs.filter(x => x.id !== id)),
      addGrade: (g) => setAllGrades([...allGrades, g]), updateGrade: (g) => setAllGrades(allGrades.map(x => x.id === g.id ? g : x)), deleteGrade: (id) => setAllGrades(allGrades.filter(x => x.id !== id)),
      sendMessage: (m) => setMessages([...messages, m]), addDocument: (d) => setDocuments([...documents, d]), updateDocument: (d) => setDocuments(documents.map(x => x.id === d.id ? d : x)), deleteDocument: (id) => setDocuments(documents.filter(x => x.id !== id))
    }}>
      {children}
    </AppContext.Provider>
  );
};

const Main = () => {
  const { user } = useAppContext();
  return user ? <Dashboard /> : <AuthPage />;
};

const App = () => <AppProvider><Main /></AppProvider>;

export default App;
