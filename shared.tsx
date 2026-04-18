
import React, { useState } from 'react';
import { 
  BookOpen, Clock, MapPin, Plus, Edit2, Trash2, ChevronRight, Send, Download, Info, Beaker, Save, FileUp, MessageCircle, FileText, ArrowLeft, BarChart, Upload, Calendar
} from 'lucide-react';
import { useAppContext, Button, Card, Modal } from './App';
import { Course, Message, Book, Lab } from './types';
import { ProfessorGradeManagement } from './teacher';

export const CourseCard = ({ course, onClick, role }: { course: Course; onClick: () => void; role: string }) => (
  <Card onClick={onClick} className="group p-8 flex flex-col border-none shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer bg-white dark:bg-slate-800/60 overflow-hidden relative">
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-colors"></div>
    <div className="flex justify-between items-start mb-8 relative z-10">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
        <BookOpen size={28} />
      </div>
      <span className="text-[10px] font-extrabold text-slate-300 dark:text-slate-600 group-hover:text-blue-500/50 uppercase tracking-[0.3em] transition-colors">{course.code}</span>
    </div>
    <h4 className="font-bold text-xl dark:text-white mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-snug line-clamp-2">{course.name}</h4>
    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-10 opacity-70">
      {role === 'STUDENT' ? `Prof. ${course.professorName}` : 'Taught Module'}
    </p>
    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col gap-3 relative z-10">
      <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        <Clock size={15} className="text-blue-500"/> 
        <span>{course.schedule}</span>
      </div>
      <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        <MapPin size={15} className="text-blue-500"/> 
        <span className="bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded-lg">ROOM {course.room}</span>
      </div>
    </div>
  </Card>
);

export const CoursesView = ({ searchQuery, onSelectCourse }: { searchQuery: string, onSelectCourse: (id: string) => void }) => {
  const { user, allCourses } = useAppContext();
  const myCourses = allCourses.filter(c => 
    (user?.courses?.includes(c.id) || c.professorId === user?.id) && 
    (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="view-transition">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold dark:text-white uppercase tracking-tight">Academic Modules</h2>
          <p className="text-sm text-slate-400 font-semibold uppercase mt-1 tracking-widest opacity-80">Access your syllabus and resources</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {myCourses.map(course => (
          <CourseCard key={course.id} course={course} onClick={() => onSelectCourse(course.id)} role={user?.role || 'STUDENT'} />
        ))}
        {myCourses.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-30 italic font-bold uppercase tracking-widest">No modules enrolled</div>
        )}
      </div>
    </div>
  );
};

export const CourseDetailsView = ({ courseId, onBack }: { courseId: string, onBack: () => void }) => {
  const { allCourses, books, labs, allGrades, messages, user, sendMessage, deleteBook, deleteLab, updateCourse, addBook, addLab } = useAppContext();
  const [activeTab, setActiveTab] = useState<'info' | 'books' | 'labs' | 'grades' | 'chat'>('info');
  const course = allCourses.find(c => c.id === courseId);
  const courseBooks = books.filter(b => b.courseId === courseId);
  const courseLabs = labs.filter(l => l.courseId === courseId);
  const courseGrades = allGrades.filter(g => g.courseId === courseId);
  const courseMessages = messages.filter(m => m.courseId === courseId);

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [tempDesc, setTempDesc] = useState(course?.description || '');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  
  const [bookForm, setBookForm] = useState({ title: '', description: '', file: null as File | null });
  const [labForm, setLabForm] = useState({ title: '', description: '', dueDate: '', file: null as File | null });

  if (!course) return null;

  const handleAddBookSubmit = () => {
    if (bookForm.title) {
      addBook({ id: `b-${Date.now()}`, courseId, title: bookForm.title, author: user?.name || 'Faculty', url: bookForm.file ? URL.createObjectURL(bookForm.file) : '#', addedBy: user!.id, description: bookForm.description });
      setIsBookModalOpen(false); setBookForm({ title: '', description: '', file: null });
    }
  };

  const handleAddLabSubmit = () => {
    if (labForm.title && labForm.dueDate) {
      addLab({ id: `l-${Date.now()}`, courseId, title: labForm.title, dueDate: labForm.dueDate, description: labForm.description, status: 'OPEN', url: labForm.file ? URL.createObjectURL(labForm.file) : undefined });
      setIsLabModalOpen(false); setLabForm({ title: '', description: '', dueDate: '', file: null });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold uppercase text-[10px] tracking-widest"><ArrowLeft size={16}/> Back to Modules</button>
      <div><h2 className="text-3xl font-extrabold dark:text-white uppercase tracking-tight">{course.name}</h2><p className="text-sm text-slate-400 font-semibold uppercase mt-2 tracking-widest opacity-80">{course.code} • Prof. {course.professorName}</p></div>
      <div className="flex gap-4 p-1.5 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl w-fit overflow-x-auto scrollbar-hide border border-slate-200 dark:border-white/5">
        {[
          { id: 'info', label: 'INFO', icon: Info },
          { id: 'books', label: 'BOOKS', icon: BookOpen },
          { id: 'labs', label: 'LABS', icon: Beaker },
          { id: 'grades', label: 'GRADES', icon: BarChart },
          { id: 'chat', label: 'CHAT', icon: MessageCircle }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-md' : 'text-slate-500'}`}>{tab.label}</button>
        ))}
      </div>
      <div className="mt-8">
        {activeTab === 'info' && (
          <Card className="p-10 space-y-10">
            <div className="flex justify-between items-center"><h3 className="text-xl font-bold dark:text-white uppercase tracking-tight flex items-center gap-3"><Info className="text-blue-500" size={22}/> Overview</h3>{user?.role === 'PROFESSOR' && !isEditingDesc && <Button variant="ghost" onClick={() => setIsEditingDesc(true)} className="text-xs">Edit Syllabus</Button>}</div>
            {isEditingDesc ? (
              <div className="space-y-4">
                <textarea value={tempDesc} onChange={e => setTempDesc(e.target.value)} className="w-full h-40 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl outline-none border-none font-medium dark:text-white leading-relaxed" />
                <div className="flex gap-4 justify-end"><Button variant="ghost" onClick={() => setIsEditingDesc(false)}>Cancel</Button><Button variant="primary" onClick={() => { updateCourse({ ...course, description: tempDesc }); setIsEditingDesc(false); }}><Save size={18}/> Save</Button></div>
              </div>
            ) : <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{course.description}</p>}
          </Card>
        )}
        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center"><h3 className="text-xl font-bold dark:text-white uppercase tracking-tight">Course Literature</h3>{user?.role === 'PROFESSOR' && <Button variant="primary" onClick={() => setIsBookModalOpen(true)} className="rounded-2xl"><Plus size={18}/> Add Textbook</Button>}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courseBooks.map(book => (
                <Card key={book.id} className="p-8 group hover:shadow-2xl transition-all duration-500 flex flex-col h-full bg-white dark:bg-slate-800/80 border-none">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 mb-6 shadow-inner group-hover:scale-110 transition-transform"><BookOpen size={28}/></div>
                  <h4 className="font-extrabold dark:text-white mb-2 uppercase tracking-tight text-lg truncate group-hover:text-blue-600 transition-colors">{book.title}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">By {book.author}</p>
                  {book.description && <p className="text-sm text-slate-500 line-clamp-2 mb-6 opacity-70 italic">"{book.description}"</p>}
                  <div className="mt-auto pt-6 border-t dark:border-white/5 flex justify-between items-center">
                    <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest border border-slate-100 dark:border-white/5 hover:bg-blue-600 hover:text-white transition-all" onClick={() => window.open(book.url, '_blank')}><Download size={16}/> View PDF</Button>
                    {user?.role === 'PROFESSOR' && <button onClick={() => deleteBook(book.id)} className="text-slate-300 hover:text-red-500 p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"><Trash2 size={20}/></button>}
                  </div>
                </Card>
              ))}
              {courseBooks.length === 0 && <div className="col-span-full py-20 text-center opacity-30 italic font-bold uppercase tracking-widest">No books available</div>}
            </div>
          </div>
        )}
        {activeTab === 'labs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center"><h3 className="text-xl font-bold dark:text-white uppercase tracking-tight">Labs & Assignments</h3>{user?.role === 'PROFESSOR' && <Button variant="primary" onClick={() => setIsLabModalOpen(true)} className="rounded-2xl"><Plus size={18}/> New Lab</Button>}</div>
            {courseLabs.map(lab => (
              <Card key={lab.id} className="p-8 flex items-center justify-between group hover:shadow-xl transition-all border-l-[8px] border-l-purple-500">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center"><Beaker size={26}/></div>
                  <div>
                    <h4 className="font-bold dark:text-white uppercase tracking-tight text-lg">{lab.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Due: {lab.dueDate}</p>
                    {lab.description && <p className="text-xs text-slate-500 mt-2 opacity-70 italic">Instruction: {lab.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">{lab.url && <Button variant="secondary" className="text-[10px] px-6 font-bold uppercase tracking-widest h-11" onClick={() => window.open(lab.url, '_blank')}><Download size={16}/> Support Doc</Button>}{user?.role === 'PROFESSOR' && <button onClick={() => deleteLab(lab.id)} className="p-2.5 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>}</div>
              </Card>
            ))}
            {courseLabs.length === 0 && <div className="py-20 text-center opacity-30 italic font-bold uppercase tracking-widest">No labs scheduled</div>}
          </div>
        )}
        {activeTab === 'grades' && user?.role === 'PROFESSOR' ? <ProfessorGradeManagement course={course} /> : activeTab === 'grades' && (
          <Card className="overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b dark:border-white/5">
                <tr><th className="p-8">Assessment</th><th className="p-8 text-right">Grade</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {courseGrades.filter(g => g.studentId === user?.id).map(g => (
                  <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40"><td className="p-8 font-bold dark:text-white uppercase text-sm">{g.type}</td><td className="p-8 font-black text-2xl dark:text-blue-400">{g.score}<span className="text-xs opacity-30 ml-1">/20</span></td></tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
        {activeTab === 'chat' && (
          <div className="h-[600px] flex flex-col">
            <Card className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide bg-slate-50/50 dark:bg-slate-900/20">
              {courseMessages.map(m => (
                <div key={m.id} className={`flex ${m.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-5 rounded-3xl ${m.senderId === user?.id ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 dark:text-white rounded-tl-none border dark:border-white/5'}`}><p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">{m.senderName}</p><p className="text-sm font-medium leading-relaxed">{m.content}</p></div>
                </div>
              ))}
            </Card>
            <div className="mt-4 flex gap-4 bg-white dark:bg-slate-800 p-3 rounded-3xl shadow-lg border border-slate-100 dark:border-white/5">
              <input type="text" placeholder="Send a message to the class..." className="flex-1 px-6 bg-transparent border-none outline-none font-bold text-sm dark:text-white" onKeyPress={e => { if(e.key === 'Enter') { sendMessage({ id: `m-${Date.now()}`, senderId: user!.id, senderName: user!.name, courseId, content: e.currentTarget.value, timestamp: new Date().toISOString() }); e.currentTarget.value = ''; }}} />
              <Button className="h-12 w-12 rounded-2xl p-0"><Send size={18}/></Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Enhanced Addition Modals */}
      <Modal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} title="Register Textbook / Reference">
        <div className="space-y-8 p-1">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Title</label>
            <input className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl dark:text-white font-bold outline-none shadow-inner" placeholder="e.g., Quantum Computing Basics" value={bookForm.title} onChange={e => setBookForm({...bookForm, title: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Abstract / Description</label>
            <textarea className="w-full h-32 p-5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl dark:text-white font-medium outline-none shadow-inner resize-none" placeholder="Provide a brief overview of the content..." value={bookForm.description} onChange={e => setBookForm({...bookForm, description: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">PDF Document</label>
            <div className="relative group">
              <input type="file" accept=".pdf" className="hidden" id="bookPdf" onChange={e => setBookForm({...bookForm, file: e.target.files ? e.target.files[0] : null})} />
              <label htmlFor="bookPdf" className="w-full p-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all">
                <FileUp size={32} className="text-blue-500" />
                <div className="text-center"><p className="text-sm font-bold dark:text-white">{bookForm.file ? bookForm.file.name : "Select PDF File"}</p><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Max 50MB</p></div>
              </label>
            </div>
          </div>
          <Button className="w-full h-20 rounded-[2.5rem] font-black uppercase shadow-2xl shadow-blue-500/30" onClick={handleAddBookSubmit}><Save size={20}/> Add Textbook</Button>
        </div>
      </Modal>

      <Modal isOpen={isLabModalOpen} onClose={() => setIsLabModalOpen(false)} title="Schedule New Laboratory / Assignment">
        <div className="space-y-8 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Assignment Title</label>
              <input className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl dark:text-white font-bold outline-none shadow-inner" placeholder="e.g., Lab 4: Circuit Simulation" value={labForm.title} onChange={e => setLabForm({...labForm, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Due Date</label>
              <input className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl dark:text-white font-black outline-none shadow-inner" type="date" value={labForm.dueDate} onChange={e => setLabForm({...labForm, dueDate: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Instructions</label>
            <textarea className="w-full h-32 p-5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl dark:text-white font-medium outline-none shadow-inner resize-none" placeholder="Explain the steps, objectives and deliverables..." value={labForm.description} onChange={e => setLabForm({...labForm, description: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Support Material (PDF)</label>
            <div className="relative group">
              <input type="file" accept=".pdf" className="hidden" id="labPdf" onChange={e => setLabForm({...labForm, file: e.target.files ? e.target.files[0] : null})} />
              <label htmlFor="labPdf" className="w-full p-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all">
                <FileUp size={32} className="text-purple-500" />
                <div className="text-center"><p className="text-sm font-bold dark:text-white">{labForm.file ? labForm.file.name : "Attach Lab Instructions"}</p></div>
              </label>
            </div>
          </div>
          <Button className="w-full h-20 rounded-[2.5rem] bg-purple-600 hover:bg-purple-700 font-black uppercase shadow-2xl shadow-purple-600/30" onClick={handleAddLabSubmit}><Save size={20}/> Publish Lab</Button>
        </div>
      </Modal>
    </div>
  );
};

export const ScheduleView = () => {
  const { user, allCourses } = useAppContext();
  const myCourses = allCourses.filter(c => user?.courses?.includes(c.id) || c.professorId === user?.id);
  return (
    <div className="space-y-10 animate-in fade-in">
      <h2 className="text-4xl font-extrabold dark:text-white uppercase tracking-tight">Personal Schedule</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {myCourses.map(c => (
          <Card key={c.id} className="p-10 flex items-center justify-between group hover:shadow-2xl transition-all duration-500">
             <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-[2rem] flex items-center justify-center font-black uppercase text-2xl shadow-inner">{c.code.slice(0, 2)}</div>
                <div>
                  <h3 className="text-2xl font-extrabold dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors">{c.name}</h3>
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest"><Clock size={16} className="text-blue-500"/> {c.schedule}</span>
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest"><MapPin size={16} className="text-emerald-500"/> ROOM {c.room}</span>
                  </div>
                </div>
             </div>
             <ChevronRight size={24} className="text-slate-200 group-hover:translate-x-2 transition-all"/>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const ChatSystem = ({ searchQuery }: { searchQuery: string }) => {
  const { user, allCourses, messages, sendMessage } = useAppContext();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const myChats = allCourses.filter(c => user?.courses?.includes(c.id) || c.professorId === user?.id);
  const filteredMessages = messages.filter(m => m.courseId === selectedChat);

  return (
    <div className="h-[750px] flex gap-10 animate-in fade-in">
      <Card className="w-96 flex flex-col p-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
        <h3 className="text-xl font-extrabold mb-8 dark:text-white uppercase tracking-tight flex items-center gap-3"><MessageCircle className="text-emerald-500" size={24}/> Chat Rooms</h3>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
           {myChats.map(c => (
             <button key={c.id} onClick={() => setSelectedChat(c.id)} className={`w-full p-6 rounded-[2rem] text-left transition-all duration-300 relative border border-transparent ${selectedChat === c.id ? 'bg-blue-600 text-white shadow-xl' : 'bg-slate-50 dark:bg-slate-900/50 dark:text-white hover:bg-white dark:hover:bg-slate-800'}`}><p className="font-extrabold text-sm uppercase tracking-tight truncate mb-1">{c.name}</p><p className={`text-[10px] font-bold uppercase tracking-widest ${selectedChat === c.id ? 'text-white/70' : 'text-slate-400'}`}>{c.code}</p></button>
           ))}
        </div>
      </Card>
      <Card className="flex-1 flex flex-col p-10 border-none shadow-sm overflow-hidden relative rounded-[4rem]">
        {!selectedChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-8 animate-in zoom-in"><div className="w-32 h-32 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center border-4 border-dashed border-slate-100 dark:border-white/5"><MessageCircle size={56}/></div><p className="font-black uppercase tracking-[0.3em] text-lg opacity-40">Choose a channel</p></div>
        ) : (
          <>
            <div className="mb-10 flex justify-between items-center pb-8 border-b dark:border-white/5"><div><h3 className="font-black text-2xl dark:text-white uppercase tracking-tight">{allCourses.find(c => c.id === selectedChat)?.name}</h3><p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">ACADEMIC CHANNEL</p></div></div>
            <div className="flex-1 overflow-y-auto space-y-8 pr-6 scroll-smooth scrollbar-hide">
              {filteredMessages.map(m => (
                <div key={m.id} className={`flex gap-5 ${m.senderId === user?.id ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-sm uppercase shadow-lg flex-shrink-0">{m.senderName.charAt(0)}</div>
                  <div className={`max-w-[65%] space-y-2 ${m.senderId === user?.id ? 'items-end' : 'items-start'}`}>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3">{m.senderName}</p>
                    <div className={`p-6 rounded-[2.5rem] shadow-sm text-sm font-semibold leading-relaxed ${m.senderId === user?.id ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 dark:text-white rounded-tl-none border dark:border-white/5'}`}>{m.content}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[3rem] shadow-inner border border-slate-100 dark:border-white/5">
               <input type="text" placeholder="Type your message..." className="flex-1 px-10 bg-transparent border-none outline-none font-bold text-sm dark:text-white" onKeyPress={e => { if(e.key === 'Enter') { sendMessage({ id: `m-${Date.now()}`, senderId: user!.id, senderName: user!.name, courseId: selectedChat, content: e.currentTarget.value, timestamp: new Date().toISOString() }); e.currentTarget.value = ''; }}} />
               <Button className="h-16 w-16 rounded-full p-0 shadow-2xl shadow-blue-500/40 active:scale-90 transition-transform"><Send size={24}/></Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export const DocumentLibrary = ({ searchQuery }: { searchQuery: string }) => {
  const { documents, user, allCourses, deleteDocument } = useAppContext();
  const filteredDocs = documents.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()) && (user?.role === 'ADMIN' || user?.courses?.includes(doc.courseId || '') || doc.userId === user?.id));
  return (
    <div className="space-y-12 view-transition">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div><h2 className="text-4xl font-extrabold dark:text-white uppercase tracking-tight">Digital Archive</h2><p className="text-sm text-slate-400 font-semibold uppercase mt-2 tracking-widest opacity-80">Access shared educational materials</p></div>
        {user?.role !== 'STUDENT' && <Button variant="primary" className="rounded-3xl h-16 px-12 uppercase font-bold text-xs shadow-xl shadow-blue-600/25"><Upload size={22}/> Upload Material</Button>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {filteredDocs.map(doc => (
          <Card key={doc.id} className="p-10 group hover:shadow-2xl transition-all duration-500 rounded-[3rem] bg-white dark:bg-slate-800/80 relative overflow-hidden">
            <div className="w-20 h-24 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-10 shadow-inner group-hover:bg-blue-600 transition-all duration-500"><FileText size={44} className="text-slate-200 group-hover:text-white" /></div>
            <h4 className="font-extrabold text-base dark:text-white mb-2 uppercase truncate leading-tight tracking-tight">{doc.name}</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">{doc.type}</p>
            <div className="flex gap-2">
              <button className="h-11 w-11 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-all"><Download size={20}/></button>
              {user?.id === doc.userId && <button onClick={() => deleteDocument(doc.id)} className="h-11 w-11 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-all"><Trash2 size={20}/></button>}
            </div>
          </Card>
        ))}
        {filteredDocs.length === 0 && <div className="col-span-full py-20 text-center opacity-30 italic font-bold uppercase tracking-widest">Archive is empty</div>}
      </div>
    </div>
  );
};
