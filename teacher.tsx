
import React, { useState } from 'react';
import { BarChart, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAppContext, Button, Card, Modal } from './App';
import { Grade, Course } from './types';

export const ProfessorGradeManagement = ({ course }: { course: Course }) => {
  const { allUsers, allGrades, addGrade, deleteGrade, updateGrade } = useAppContext();
  const studentsInClass = allUsers.filter(u => u.role === 'STUDENT' && u.classGroupId === course.classGroupId);
  const courseGrades = allGrades.filter(g => g.courseId === course.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [formData, setFormData] = useState({ 
    studentId: '', 
    type: 'HOMEWORK' as any, 
    score: 0, 
    maxScore: 20, 
    date: new Date().toISOString().split('T')[0] 
  });

  const handleOpenModal = (grade?: Grade) => {
    if (grade) {
      setEditingGrade(grade);
      setFormData({ studentId: grade.studentId, type: grade.type, score: grade.score, maxScore: grade.maxScore, date: grade.date });
    } else {
      setEditingGrade(null);
      setFormData({ studentId: '', type: 'HOMEWORK', score: 0, maxScore: 20, date: new Date().toISOString().split('T')[0] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId) return;
    if (editingGrade) updateGrade({ ...editingGrade, ...formData });
    else addGrade({ id: `g-${Date.now()}`, courseId: course.id, ...formData });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold dark:text-white uppercase tracking-tight flex items-center gap-3">
          <BarChart className="text-blue-500" size={24}/> Gradebook Management
        </h3>
        <Button variant="primary" onClick={() => handleOpenModal()} className="rounded-2xl px-8 h-12 shadow-xl shadow-blue-600/20">
          <Plus size={18}/> Assign Grade
        </Button>
      </div>
      <Card className="overflow-hidden border-none shadow-sm rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b dark:border-white/5">
              <tr>
                <th className="p-7">Student</th>
                <th className="p-7">Type</th>
                <th className="p-7">Date</th>
                <th className="p-7 text-right">Score</th>
                <th className="p-7 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {courseGrades.map(g => {
                const student = allUsers.find(u => u.id === g.studentId);
                return (
                  <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group">
                    <td className="p-7 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-xs font-bold">{student?.name.charAt(0)}</div>
                      <span className="font-bold text-sm dark:text-slate-200 uppercase">{student?.name}</span>
                    </td>
                    <td className="p-7">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-bold rounded-lg uppercase tracking-widest">{g.type}</span>
                    </td>
                    <td className="p-7 text-slate-400 text-[11px] font-bold">{g.date}</td>
                    <td className="p-7 text-right">
                      <span className={`font-bold text-xl ${g.score/g.maxScore >= 0.5 ? 'text-emerald-600' : 'text-red-600'}`}>{g.score}<span className="text-sm opacity-30 ml-1">/{g.maxScore}</span></span>
                    </td>
                    <td className="p-7 text-right flex gap-2 justify-end">
                      <button onClick={() => handleOpenModal(g)} className="p-2 text-slate-300 hover:text-blue-500"><Edit2 size={18}/></button>
                      <button onClick={() => deleteGrade(g.id)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingGrade ? "Edit Entry" : "New Grade Entry"}>
        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Student</label>
            <select required className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl outline-none font-bold dark:text-white" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})}>
              <option value="">-- Select Student --</option>
              {studentsInClass.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Score /20</label>
              <input type="number" step="0.5" required className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl outline-none font-bold dark:text-white" value={formData.score} onChange={e => setFormData({...formData, score: Number(e.target.value)})}/>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <select required className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-bold dark:text-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                <option value="HOMEWORK">Homework</option>
                <option value="QUIZ">Quiz</option>
                <option value="INTERROGATION">Assignment</option>
                <option value="EXAM">Exam</option>
                <option value="MEMOIRE">Thesis</option>
              </select>
            </div>
          </div>
          <Button type="submit" className="w-full h-16 rounded-3xl mt-6">
            {editingGrade ? "Update Grade" : "Confirm Entry"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};
