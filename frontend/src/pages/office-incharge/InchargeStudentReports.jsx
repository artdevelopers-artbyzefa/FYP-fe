import React, { useEffect, useState } from 'react';
import { getInchargeStudentReports } from '../../services/office-incharge.service';
import { Award, GitBranch } from 'lucide-react';

const InchargeStudentReports = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInchargeStudentReports()
      .then(res => setStudents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Student Supervision & Milestone Reports</h2>
        <p className="text-xs text-slate-900 mt-0.5 font-medium">Per-student audit tracking project details, evaluation history, supervisor remarks, and milestone progress</p>
      </div>

      {loading
        ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-56 w-full rounded-[2rem] mb-6" />
          ))
        : students.map((s, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] border border-line shadow-sm p-6 sm:p-8 space-y-8 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-line gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black flex-shrink-0">
                    {s.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{s.name}</h3>
                    <p className="text-xs text-slate-900 font-mono mt-0.5">{s.regNo} | Computer Science</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-line">
                  <span className="text-xs font-bold text-slate-900">Milestone Progress:</span>
                  <span className="text-lg font-bold text-slate-900">{s.progress}% Completed</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="bg-white p-5 rounded-2xl border border-line space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm pb-2 border-b border-line"><GitBranch className="text-slate-900 mr-2" />Project Overview</h4>
                  <div className="flex justify-between"><span className="text-slate-900 font-bold">Group ID:</span><span className="font-mono font-bold text-slate-900">{s.group}</span></div>
                  <div className="flex justify-between"><span className="text-slate-900 font-bold">Supervisor:</span><span className="font-bold text-slate-900">{s.supervisor}</span></div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-line space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm pb-2 border-b border-line"><Award className="text-slate-900 mr-2" />Evaluation History</h4>
                  <div className="flex justify-between"><span className="text-slate-900 font-bold">10% Milestone Score:</span><span className="font-bold text-slate-900">{s.score}</span></div>
                  <div className="flex justify-between"><span className="text-slate-900 font-bold">Defense Status:</span><span className="font-bold text-slate-900">Cleared</span></div>
                </div>
              </div>
            </div>
          ))}
    </>
  );
};

export default InchargeStudentReports;
