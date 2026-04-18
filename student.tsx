
import React from 'react';
import { useAppContext, Card } from './App';

export const StudentGradesView = ({ searchQuery }: { searchQuery: string }) => {
  const { user, allGrades, allCourses } = useAppContext();
  const grades = allGrades.filter(g => g.studentId === user?.id);
  return (
    <div className="space-y-10 animate-in fade-in">
      <h2 className="text-3xl font-extrabold dark:text-white uppercase tracking-tight">Academic Transcript</h2>
      <Card className="overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b dark:border-white/5">
            <tr><th className="p-8">Module</th><th className="p-8">Type</th><th className="p-8 text-right">Performance</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {grades.map(g => {
              const c = allCourses.find(x => x.id === g.courseId);
              return (
                <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td className="p-8 font-extrabold dark:text-white uppercase text-sm tracking-tight">{c?.name}</td>
                  <td className="p-8"><span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 text-[9px] font-bold rounded-lg uppercase tracking-widest">{g.type}</span></td>
                  <td className="p-8 text-right font-black text-3xl dark:text-white">{g.score}<span className="text-xs opacity-30 ml-1">/20</span></td>
                </tr>
              );
            })}
            {grades.length === 0 && (
              <tr><td colSpan={3} className="p-20 text-center opacity-30 italic font-bold uppercase tracking-widest">No grades published yet</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
