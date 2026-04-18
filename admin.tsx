
import React, { useState, useMemo } from 'react';
import { 
  Users, Briefcase, PieChart, TrendingUp, Activity, Plus, Edit2, Trash2, Eye,
  ArrowLeft, BookPlus, Clock, MapPin, Globe, Check, Megaphone, History, Filter, Save, UserPlus, Layers, BookOpen
} from 'lucide-react';
import { useAppContext, Button, Card, Modal } from './App';
import { User, Course, ClassGroup } from './types';

export const AdminOverview = () => {
  const { allUsers, allClasses, allGrades } = useAppContext();
  const studentCount = allUsers.filter(u => u.role === 'STUDENT').length;
  const profCount = allUsers.filter(u => u.role === 'PROFESSOR').length;
  const avgGrade = allGrades.length > 0 ? allGrades.reduce((acc, g) => acc + (g.score / g.maxScore) * 20, 0) / allGrades.length : 0;

  const stats = [
    { label: 'Students', value: studentCount, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Faculty', value: profCount, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Active Classes', value: allClasses.length, icon: PieChart, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: 'GPA Average', value: `${avgGrade.toFixed(1)}/20`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  ];

  return (
    <div className="space-y-10 view-transition">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-7 border-none shadow-sm flex flex-col gap-4 group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-extrabold dark:text-white mt-1">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-10 border-none shadow-sm">
        <h3 className="text-lg font-bold flex items-center gap-3 dark:text-white mb-10"><Activity className="text-blue-500" size={22}/> Activity Feed</h3>
        <div className="h-64 flex items-end gap-4 px-2">
          {[40, 65, 30, 85, 45, 90, 75, 60, 45, 80].map((h, i) => (
            <div key={i} className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl relative group overflow-hidden">
              <div className="absolute bottom-0 w-full bg-blue-500 transition-all duration-700 ease-out rounded-xl" style={{ height: `${h}%` }}></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const AdminProfsView = ({ onSelectProf }: { onSelectProf: (id: string) => void }) => {
  const { allUsers, addProfessor, updateUser } = useAppContext();
  const professors = allUsers.filter(u => u.role === 'PROFESSOR');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProf, setEditingProf] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    matricule: '',
    department: 'Computer Science',
    experience: 0,
    languages: [] as string[]
  });

  const handleOpenModal = (prof?: User) => {
    if (prof) {
      setEditingProf(prof);
      setFormData({
        name: prof.name,
        email: prof.email,
        matricule: prof.matricule || '',
        department: prof.department || 'Computer Science',
        experience: prof.experience || 0,
        languages: prof.languages || []
      });
    } else {
      setEditingProf(null);
      setFormData({ name: '', email: '', matricule: '', department: 'Computer Science', experience: 0, languages: [] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProf) updateUser({ ...editingProf, ...formData });
    else addProfessor({ id: `p-${Date.now()}`, role: 'PROFESSOR', ...formData });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold dark:text-white uppercase tracking-tight">Academic Faculty</h2>
        <Button variant="primary" onClick={() => handleOpenModal()} className="rounded-3xl h-14 px-8 shadow-xl shadow-blue-500/20">
          <UserPlus size={20}/> New Professor
        </Button>
      </div>
      
      <Card className="overflow-hidden border-none shadow-sm rounded-[3rem]">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b dark:border-white/5">
            <tr>
              <th className="p-8">Professor</th>
              <th className="p-8">Department</th>
              <th className="p-8">Matricule</th>
              <th className="p-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {professors.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 group">
                <td className="p-8 font-bold dark:text-white uppercase tracking-tight flex items-center gap-4 cursor-pointer" onClick={() => onSelectProf(p.id)}>
                   <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-black">{p.name.charAt(0)}</div>
                   {p.name}
                </td>
                <td className="p-8 text-xs font-bold text-slate-400 uppercase tracking-widest">{p.department}</td>
                <td className="p-8 text-xs font-black text-slate-500 uppercase">{p.matricule}</td>
                <td className="p-8 text-right flex gap-3 justify-end">
                  <button onClick={() => handleOpenModal(p)} className="p-3 text-slate-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"><Edit2 size={18}/></button>
                  <button onClick={() => onSelectProf(p.id)} className="p-3 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"><Eye size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProf ? "Edit Professor" : "Register Professor"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input required className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-inner" placeholder="Dr. John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <input required type="email" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-inner" placeholder="john.doe@uni.edu" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Matricule</label>
              <input required className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl dark:text-white font-black outline-none focus:ring-2 focus:ring-blue-500 shadow-inner" placeholder="PROF-000" value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Years Exp.</label>
              <input required type="number" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-inner" value={formData.experience} onChange={e => setFormData({...formData, experience: Number(e.target.value)})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
            <select className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-inner" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
               <option value="Computer Science">Computer Science</option>
               <option value="Physical Sciences">Physical Sciences</option>
               <option value="Mathematics">Mathematics</option>
               <option value="Civil Engineering">Civil Engineering</option>
            </select>
          </div>
          <Button type="submit" className="w-full h-16 rounded-[2.5rem] mt-4 font-black uppercase text-sm tracking-[0.2em] shadow-xl shadow-blue-500/30">
            <Save size={18}/> {editingProf ? "Update Account" : "Create Account"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export const AdminProfessorDetails = ({ professorId, onBack }: { professorId: string, onBack: () => void }) => {
  const { allUsers, allCourses } = useAppContext();
  const prof = allUsers.find(u => u.id === professorId);
  const courses = allCourses.filter(c => c.professorId === professorId);
  if (!prof) return null;
  return (
    <div className="space-y-8 animate-in slide-in-from-right-10">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold uppercase text-[10px]"><ArrowLeft size={16}/> Back</button>
      <Card className="p-10 flex flex-col md:flex-row gap-10 items-center">
        <div className="w-32 h-32 bg-blue-600 rounded-[3rem] flex items-center justify-center text-white text-4xl font-extrabold uppercase shadow-2xl">{prof.name.charAt(0)}</div>
        <div>
          <h2 className="text-4xl font-extrabold dark:text-white uppercase tracking-tight">{prof.name}</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">{prof.matricule} • {prof.department}</p>
          <div className="flex gap-4 mt-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl"><p className="text-[10px] text-slate-400 font-bold">Experience</p><p className="font-bold dark:text-white">{prof.experience} Years</p></div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl"><p className="text-[10px] text-slate-400 font-bold">Teaching</p><p className="font-bold dark:text-white">{courses.length} Modules</p></div>
          </div>
        </div>
      </Card>
      <Card className="p-10">
        <h3 className="text-xl font-bold dark:text-white uppercase tracking-tight mb-8">Teaching Assignment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map(c => <div key={c.id} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl font-bold uppercase text-xs tracking-widest dark:text-slate-200 border border-transparent hover:border-blue-500 transition-all">{c.code} - {c.name}</div>)}
        </div>
      </Card>
    </div>
  );
};

export const AdminClassesView = ({ onSelectClass }: { onSelectClass: (id: string) => void }) => {
  const { allClasses, addClass, updateClass } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassGroup | null>(null);
  const [formData, setFormData] = useState({ name: '', level: '', academicYear: '2023-2024' });

  const handleOpenModal = (cls?: ClassGroup) => {
    if (cls) {
      setEditingClass(cls);
      setFormData({ name: cls.name, level: cls.level, academicYear: cls.academicYear });
    } else {
      setEditingClass(null);
      setFormData({ name: '', level: '', academicYear: '2023-2024' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClass) updateClass({ ...editingClass, ...formData });
    else addClass({ id: `cl-${Date.now()}`, ...formData, studentCount: 0 });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold dark:text-white uppercase tracking-tight">Academic Groups</h2>
        <Button variant="primary" onClick={() => handleOpenModal()} className="rounded-3xl h-14 px-8 shadow-xl shadow-blue-500/20">
          <Plus size={20}/> New Promotion
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {allClasses.map(cls => (
          <Card key={cls.id} className="p-10 flex flex-col items-center text-center cursor-pointer hover:shadow-xl transition-all hover:-translate-y-2 group relative">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); handleOpenModal(cls); }} className="p-2 text-slate-400 hover:text-blue-500 bg-slate-50 dark:bg-slate-900 rounded-lg"><Edit2 size={16}/></button>
            </div>
            <div onClick={() => onSelectClass(cls.id)} className="w-full h-full flex flex-col items-center">
              <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-[2rem] flex items-center justify-center mb-6"><Layers size={32}/></div>
              <h3 className="text-2xl font-extrabold dark:text-white uppercase tracking-tight">{cls.name}</h3>
              <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{cls.level}</p>
              <p className="text-xs font-black text-blue-500 mt-2">{cls.studentCount || 0} Students</p>
            </div>
          </Card>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClass ? "Edit Promotion" : "Add Promotion"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Class Name</label>
            <input required className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl dark:text-white font-bold outline-none shadow-inner" placeholder="e.g., AIP3" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Level / Cycle</label>
            <input required className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl dark:text-white font-bold outline-none shadow-inner" placeholder="e.g., Master 1" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Year</label>
            <input required className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl dark:text-white font-bold outline-none shadow-inner" placeholder="2023-2024" value={formData.academicYear} onChange={e => setFormData({...formData, academicYear: e.target.value})} />
          </div>
          <Button type="submit" className="w-full h-16 rounded-[2.5rem] mt-4 font-black uppercase text-sm tracking-[0.2em]">
            <Save size={18}/> Save Promotion
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export const AdminClassDetails = ({ classId, onBack, onSelectStudent }: { classId: string, onBack: () => void, onSelectStudent: (id: string) => void }) => {
  const { allClasses, allUsers, allCourses, addStudent, updateUser } = useAppContext();
  const cls = allClasses.find(c => c.id === classId);
  const students = allUsers.filter(u => u.classGroupId === classId);
  const courses = allCourses.filter(c => c.classGroupId === classId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', studentId: '' });

  const handleOpenModal = (student?: User) => {
    if (student) {
      setEditingStudent(student);
      setFormData({ name: student.name, email: student.email, studentId: student.studentId || '' });
    } else {
      setEditingStudent(null);
      setFormData({ name: '', email: '', studentId: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) updateUser({ ...editingStudent, ...formData });
    else addStudent({ id: `s-${Date.now()}`, ...formData, role: 'STUDENT', classGroupId: classId, courses: courses.map(c => c.id) });
    setIsModalOpen(false);
  };

  if (!cls) return null;

  return (
    <div className="space-y-8 animate-in slide-in-from-right-10">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold uppercase text-[10px]"><ArrowLeft size={16}/> Back</button>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-extrabold dark:text-white uppercase tracking-tight">{cls.name}</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">{cls.level} • {cls.academicYear}</p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()} className="rounded-3xl h-14 px-8 shadow-xl shadow-blue-500/20">
          <UserPlus size={20}/> Add Student
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="p-10 border-none shadow-sm">
          <h3 className="text-xl font-bold dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3"><Users className="text-blue-500" size={24}/> Student List</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
            {students.map(s => (
              <div key={s.id} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl flex justify-between items-center group hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-blue-500/30">
                <div onClick={() => onSelectStudent(s.id)} className="flex-1 cursor-pointer">
                  <span className="font-bold uppercase text-xs tracking-widest dark:text-slate-200">{s.name}</span>
                  <p className="text-[10px] font-black text-slate-400 mt-1">{s.studentId}</p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => handleOpenModal(s)} className="p-3 text-slate-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Edit2 size={16}/></button>
                   <button onClick={() => onSelectStudent(s.id)} className="p-3 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"><Eye size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-10 border-none shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold dark:text-white uppercase tracking-tight flex items-center gap-3"><BookOpen className="text-orange-500" size={24}/> Assigned Modules</h3>
          </div>
          <div className="space-y-4">
            {courses.map(c => (
              <div key={c.id} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl flex justify-between items-center">
                <div>
                   <p className="font-bold uppercase text-xs tracking-widest dark:text-slate-200">{c.name}</p>
                   <p className="text-[10px] font-black text-slate-400 mt-1">{c.code} • Prof. {c.professorName}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? "Edit Student" : "Enroll Student"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <input required className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl dark:text-white font-bold outline-none shadow-inner" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Email</label>
            <input required type="email" className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl dark:text-white font-bold outline-none shadow-inner" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Student ID</label>
            <input required className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl dark:text-white font-black outline-none shadow-inner" placeholder="STU-2024-XXX" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} />
          </div>
          <Button type="submit" className="w-full h-16 rounded-[2.5rem] mt-4 font-black uppercase text-sm tracking-[0.2em]">
            <Save size={18}/> Register Student
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export const AdminStudentProfileView = ({ studentId, onBack }: { studentId: string, onBack: () => void }) => {
  const { allUsers, allGrades, allCourses } = useAppContext();
  const student = allUsers.find(u => u.id === studentId);
  const grades = allGrades.filter(g => g.studentId === studentId);
  if (!student) return null;
  return (
    <div className="space-y-8 animate-in slide-in-from-right-10">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold uppercase text-[10px]"><ArrowLeft size={16}/> Back</button>
      <Card className="p-10 flex flex-col md:flex-row gap-10 items-center">
        <div className="w-32 h-32 bg-blue-600 rounded-[3rem] flex items-center justify-center text-white text-4xl font-extrabold uppercase shadow-2xl">{student.name.charAt(0)}</div>
        <div>
          <h2 className="text-4xl font-extrabold dark:text-white uppercase tracking-tight">{student.name}</h2>
          <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-2">{student.studentId}</p>
        </div>
      </Card>
      <Card className="p-10 overflow-hidden">
        <h3 className="text-xl font-bold dark:text-white uppercase tracking-tight mb-8">Academic Transcript</h3>
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
            <tr><th className="p-6">Course</th><th className="p-6 text-right">Grade</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {grades.map(g => {
              const c = allCourses.find(x => x.id === g.courseId);
              return <tr key={g.id}><td className="p-6 font-bold uppercase text-xs tracking-widest dark:text-slate-200">{c?.name}</td><td className="p-6 text-right font-black text-xl text-blue-600">{g.score}</td></tr>;
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export const AdminScheduleManagement = () => {
  const { allCourses, allUsers, allClasses, addCourse, updateCourse, deleteCourse } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [filterClassId, setFilterClassId] = useState<string>('ALL');
  const [formData, setFormData] = useState({ name: '', code: '', professorId: '', classGroupId: '', schedule: '', room: '', description: '' });
  const professors = allUsers.filter(u => u.role === 'PROFESSOR');
  const filteredCourses = useMemo(() => filterClassId === 'ALL' ? allCourses : allCourses.filter(c => c.classGroupId === filterClassId), [allCourses, filterClassId]);

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({ name: course.name, code: course.code, professorId: course.professorId, classGroupId: course.classGroupId || '', schedule: course.schedule, room: course.room, description: course.description });
    } else {
      setEditingCourse(null);
      setFormData({ name: '', code: '', professorId: '', classGroupId: '', schedule: '', room: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prof = professors.find(p => p.id === formData.professorId);
    const courseData: Course = { id: editingCourse ? editingCourse.id : `c-${Date.now()}`, ...formData, professorName: prof?.name || 'Unknown' };
    if (editingCourse) updateCourse(courseData); else addCourse(courseData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-extrabold dark:text-white uppercase tracking-tight">University Master Schedule</h2>
          <p className="text-sm text-slate-400 font-semibold uppercase mt-1 tracking-widest opacity-80">Organize academic sessions</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
             <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
             <select value={filterClassId} onChange={(e) => setFilterClassId(e.target.value)} className="pl-12 pr-10 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl font-bold text-xs uppercase tracking-widest shadow-sm outline-none cursor-pointer dark:text-white">
               <option value="ALL">All Classes</option>
               {allClasses.map(cl => <option key={cl.id} value={cl.id}>{cl.name}</option>)}
             </select>
          </div>
          <Button variant="primary" onClick={() => handleOpenModal()} className="rounded-[1.5rem] h-14 px-8 shadow-xl shadow-blue-500/20">
            <BookPlus size={20}/> Plan Module
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {filteredCourses.map(c => (
          <Card key={c.id} className="p-8 flex flex-col md:flex-row justify-between items-center group hover:bg-blue-600 transition-all duration-500 relative overflow-hidden border-none shadow-sm">
            <div className="flex items-center gap-8 w-full md:w-auto">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 group-hover:bg-white/20 group-hover:text-white rounded-[2rem] flex items-center justify-center font-black uppercase text-2xl transition-all shadow-inner border border-transparent dark:border-white/5">
                {c.code.slice(0, 2)}
              </div>
              <div className="relative z-10">
                <p className="font-extrabold text-blue-600 group-hover:text-white/80 uppercase text-[10px] tracking-[0.25em] mb-1">{c.code} • {allClasses.find(cl => cl.id === c.classGroupId)?.name || 'NO CLASS'}</p>
                <h4 className="font-black dark:text-white group-hover:text-white uppercase tracking-tight text-xl leading-none">{c.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 group-hover:text-white/60 mt-2 uppercase tracking-widest">Professor: {c.professorName}</p>
              </div>
            </div>
            <div className="flex items-center gap-12 mt-8 md:mt-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-50 dark:border-white/5 pt-6 md:pt-0">
              <div className="text-right">
                <div className="flex items-center gap-3 justify-end text-sm font-black dark:text-white group-hover:text-white uppercase tracking-tight">
                  <Clock size={16} className="text-blue-500 group-hover:text-white/80"/>
                  <span>{c.schedule}</span>
                </div>
                <div className="flex items-center gap-3 justify-end text-[10px] font-bold text-slate-400 group-hover:text-white/60 mt-2 uppercase tracking-[0.2em]">
                  <MapPin size={14} className="text-emerald-500 group-hover:text-white/80"/>
                  <span>ROOM {c.room}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleOpenModal(c)} className="p-4 bg-slate-50 dark:bg-slate-900/50 text-slate-400 hover:text-blue-600 group-hover:bg-white/20 group-hover:text-white rounded-2xl transition-all"><Edit2 size={20}/></button>
                <button onClick={() => deleteCourse(c.id)} className="p-4 bg-slate-50 dark:bg-slate-900/50 text-slate-400 hover:text-red-500 group-hover:bg-white/20 group-hover:text-red-100 rounded-2xl transition-all"><Trash2 size={20}/></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCourse ? "Update Module" : "Schedule New Session"}>
        <form onSubmit={handleSubmit} className="space-y-8 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input required className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-none rounded-3xl dark:text-white font-bold outline-none shadow-inner" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g., Artificial Intelligence" />
            <input required className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-none rounded-3xl dark:text-white font-black outline-none shadow-inner uppercase" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g., CS-402" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <select required className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-none rounded-3xl dark:text-white font-bold outline-none shadow-inner" value={formData.professorId} onChange={e => setFormData({...formData, professorId: e.target.value})}>
              <option value="">-- Faculty --</option>
              {professors.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select required className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-none rounded-3xl dark:text-white font-bold outline-none shadow-inner" value={formData.classGroupId} onChange={e => setFormData({...formData, classGroupId: e.target.value})}>
              <option value="">-- Promotion --</option>
              {allClasses.map(cl => <option key={cl.id} value={cl.id}>{cl.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input required className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-none rounded-3xl dark:text-white font-bold outline-none shadow-inner" value={formData.schedule} onChange={e => setFormData({...formData, schedule: e.target.value})} placeholder="e.g., Monday 08:30 - 11:30" />
            <input required className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-none rounded-3xl dark:text-white font-bold outline-none shadow-inner" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} placeholder="e.g., Hall 2" />
          </div>
          <textarea className="w-full h-32 p-6 bg-slate-50 dark:bg-slate-900 border-none rounded-[2rem] dark:text-white font-medium outline-none shadow-inner resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Syllabus details..." />
          <Button type="submit" className="w-full h-20 rounded-[2.5rem] font-black uppercase text-sm tracking-[0.25em] shadow-2xl shadow-blue-500/40 transition-all hover:-translate-y-1">
            <Save size={20}/> {editingCourse ? "Save Changes" : "Confirm Schedule"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export const AdminAnnouncements = () => {
  const { sendAnnouncement } = useAppContext();
  const [msg, setMsg] = useState('');
  const [target, setTarget] = useState<'ALL' | 'PROFESSOR' | 'STUDENT'>('ALL');
  const [showSuccess, setShowSuccess] = useState(false);
  const targets = [
    { id: 'ALL', label: 'Everyone', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'PROFESSOR', label: 'Faculty', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'STUDENT', label: 'Students', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  ];

  const handleSend = () => {
    if (!msg.trim()) return;
    sendAnnouncement({ title: 'OFFICIAL BROADCAST', message: msg, type: 'INFO', targetGroup: target, timestamp: new Date().toISOString() });
    setMsg(''); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-10 animate-in fade-in">
      <h2 className="text-3xl font-extrabold dark:text-white uppercase tracking-tight">University Broadcast Channel</h2>
      <Card className="p-12 max-w-3xl border-none shadow-xl relative overflow-hidden">
        <div className="space-y-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {targets.map((t) => (
              <button key={t.id} onClick={() => setTarget(t.id as any)} className={`p-6 rounded-[2.5rem] flex flex-col items-center gap-4 transition-all duration-300 border-2 ${target === t.id ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-900/20 scale-105 shadow-lg' : 'border-transparent bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800'}`}>
                <div className={`w-14 h-14 rounded-2xl ${t.bg} ${t.color} flex items-center justify-center transition-transform`}><t.icon size={26} /></div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${target === t.id ? 'text-blue-600' : 'text-slate-500'}`}>{t.label}</span>
              </button>
            ))}
          </div>
          <textarea value={msg} onChange={e => setMsg(e.target.value)} className="w-full h-48 p-8 bg-slate-50 dark:bg-slate-900 border-none rounded-[3.5rem] outline-none font-medium dark:text-white shadow-inner resize-none transition-all text-lg leading-relaxed" placeholder="Type your announcement here..." />
          <div className="flex flex-col items-center gap-6">
            <Button onClick={handleSend} disabled={!msg.trim()} className="w-full h-20 rounded-[3rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-blue-500/30">
              {showSuccess ? <><Check size={24}/> Broadcast Sent</> : <><Megaphone size={24}/> Send Announcement</>}
            </Button>
            {showSuccess && <p className="text-emerald-500 font-black text-[10px] uppercase tracking-widest animate-bounce">Broadcast successful!</p>}
          </div>
        </div>
      </Card>
      <Card className="p-10 border-none shadow-sm max-w-3xl opacity-60">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3"><History size={16}/> Admin Note</h3>
        <p className="text-xs font-bold text-slate-400 italic leading-loose uppercase tracking-widest">Broadcasts appear instantly in the notification center of the selected group.</p>
      </Card>
    </div>
  );
};
