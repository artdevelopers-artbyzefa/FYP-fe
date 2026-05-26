import React from 'react';
import { CalendarCheck, FileUp, GraduationCap, Presentation, Search } from 'lucide-react';

export default function FacultyReports() {
  const confirmAction = (actionName) => {
    alert(`Action completed: ${actionName}`);
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
      <div className="border-b border-black pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">Faculty Supervision & Workload Analytics</h1>
          <p className="text-xs text-black mt-0.5 font-medium">Comprehensive audit of faculty supervision loads, proposed projects, active student groups, and weekly meeting frequencies</p>
        </div>
        <button onClick={() => window.print()} className="px-5 py-2.5 bg-white border border-black text-black hover:bg-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer border-0">
          <FileUp className="text-black" /> Export PDF Report
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-black shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl font-bold"><Presentation className="w-4 h-4" /></div>
          <div><div className="text-xs font-bold text-black uppercase tracking-wider mb-1">Total Active Faculty</div><div className="text-3xl font-black text-black">42</div></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl font-bold"><GraduationCap className="w-4 h-4" /></div>
          <div><div className="text-xs font-bold text-black uppercase tracking-wider mb-1">Total Supervised Groups</div><div className="text-3xl font-black text-black">128</div></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-black shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl font-bold"><CalendarCheck className="w-4 h-4" /></div>
          <div><div className="text-xs font-bold text-black uppercase tracking-wider mb-1">Avg Weekly Meetings</div><div className="text-3xl font-black text-black">94.5%</div></div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl border border-black p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-sm" />
          <input type="text" placeholder="Search faculty name or designation..." className="w-full pl-10 pr-4 py-2 bg-white border border-black rounded-xl text-sm outline-none focus:border-black focus:bg-white transition-all" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="bg-white border border-black rounded-xl px-4 py-2 text-sm font-bold text-black outline-none focus:border-black cursor-pointer w-full sm:w-auto">
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="AI & Data Science">AI & Data Science</option>
          </select>
        </div>
      </div>

      {/* Faculty Reports Table */}
      <div className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/75 border-b border-black text-[11px] font-black text-black uppercase tracking-wider">
                <th className="py-4 px-6">Faculty Member</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6 text-center">Supervised Groups</th>
                <th className="py-4 px-6 text-center">Proposed Projects</th>
                <th className="py-4 px-6 text-center">Meeting Frequency</th>
                <th className="py-4 px-6 text-center">Workload Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black text-sm font-medium text-black">
              <tr className="hover:bg-white/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-sm border border-black flex-shrink-0">AH</div>
                    <div><div className="font-bold text-black">Dr. Ali Hassan</div><div className="text-xs text-black">Associate Professor</div></div>
                  </div>
                </td>
                <td className="py-4 px-6 text-black">Computer Science</td>
                <td className="py-4 px-6 text-center font-bold text-black">4 Groups</td>
                <td className="py-4 px-6 text-center text-black">6 Projects</td>
                <td className="py-4 px-6 text-center"><span className="text-xs font-bold text-black bg-white px-2.5 py-1 rounded-lg border border-black/20">100% (Weekly)</span></td>
                <td className="py-4 px-6 text-center"><span className="text-xs font-bold text-black bg-white px-2.5 py-1 rounded-lg border border-black">Full Load (4/4)</span></td>
                <td className="py-4 px-6 text-right"><button onClick={() => confirmAction('View Audit for Dr. Ali Hassan')} className="px-3 py-1.5 bg-white hover:bg-white border border-black rounded-lg text-xs font-bold text-black transition-all cursor-pointer border-0">View Audit</button></td>
              </tr>
              <tr className="hover:bg-white/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-sm border border-black flex-shrink-0">FK</div>
                    <div><div className="font-bold text-black">Dr. Fatima Khan</div><div className="text-xs text-black">Assistant Professor</div></div>
                  </div>
                </td>
                <td className="py-4 px-6 text-black">Software Engineering</td>
                <td className="py-4 px-6 text-center font-bold text-black">3 Groups</td>
                <td className="py-4 px-6 text-center text-black">5 Projects</td>
                <td className="py-4 px-6 text-center"><span className="text-xs font-bold text-black bg-white px-2.5 py-1 rounded-lg border border-black/20">92% (Regular)</span></td>
                <td className="py-4 px-6 text-center"><span className="text-xs font-bold text-black bg-white px-2.5 py-1 rounded-lg border border-black">Optimal (3/4)</span></td>
                <td className="py-4 px-6 text-right"><button onClick={() => confirmAction('View Audit for Dr. Fatima Khan')} className="px-3 py-1.5 bg-white hover:bg-white border border-black rounded-lg text-xs font-bold text-black transition-all cursor-pointer border-0">View Audit</button></td>
              </tr>
              <tr className="hover:bg-white/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-sm border border-black flex-shrink-0">UK</div>
                    <div><div className="font-bold text-black">Dr. Usman Khalid</div><div className="text-xs text-black">Professor</div></div>
                  </div>
                </td>
                <td className="py-4 px-6 text-black">AI & Data Science</td>
                <td className="py-4 px-6 text-center font-bold text-black">2 Groups</td>
                <td className="py-4 px-6 text-center text-black">3 Projects</td>
                <td className="py-4 px-6 text-center"><span className="text-xs font-bold text-black bg-white px-2.5 py-1 rounded-lg border border-black">75% (Irregular)</span></td>
                <td className="py-4 px-6 text-center"><span className="text-xs font-bold text-black bg-white px-2.5 py-1 rounded-lg border border-black">Under Load (2/4)</span></td>
                <td className="py-4 px-6 text-right"><button onClick={() => confirmAction('View Audit for Dr. Usman Khalid')} className="px-3 py-1.5 bg-white hover:bg-white border border-black rounded-lg text-xs font-bold text-black transition-all cursor-pointer border-0">View Audit</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-white border-t border-black text-xs text-black font-bold text-center">
          <span>Showing all 3 registered faculty supervision records</span>
        </div>
      </div>
    </div>
  );
}
