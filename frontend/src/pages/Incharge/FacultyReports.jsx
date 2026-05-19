import React from 'react';

export default function FacultyReports() {
  const confirmAction = (actionName) => {
    alert(`Action completed: ${actionName}`);
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
      <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Faculty Supervision & Workload Analytics</h1>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Comprehensive audit of faculty supervision loads, proposed projects, active student groups, and weekly meeting frequencies</p>
        </div>
        <button onClick={() => window.print()} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer border-0">
          <i className="fas fa-file-export text-secondary"></i> Export PDF Report
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-secondary flex items-center justify-center text-2xl font-bold"><i className="fas fa-chalkboard-teacher"></i></div>
          <div><div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Active Faculty</div><div className="text-3xl font-black text-gray-800">42</div></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-2xl font-bold"><i className="fas fa-user-graduate"></i></div>
          <div><div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Supervised Groups</div><div className="text-3xl font-black text-gray-800">128</div></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold"><i className="fas fa-calendar-check"></i></div>
          <div><div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Avg Weekly Meetings</div><div className="text-3xl font-black text-gray-800">94.5%</div></div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full sm:w-96">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input type="text" placeholder="Search faculty name or designation..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-secondary focus:bg-white transition-all" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-secondary cursor-pointer w-full sm:w-auto">
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="AI & Data Science">AI & Data Science</option>
          </select>
        </div>
      </div>

      {/* Faculty Reports Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">Faculty Member</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6 text-center">Supervised Groups</th>
                <th className="py-4 px-6 text-center">Proposed Projects</th>
                <th className="py-4 px-6 text-center">Meeting Frequency</th>
                <th className="py-4 px-6 text-center">Workload Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-secondary flex items-center justify-center font-bold text-sm border border-blue-100 flex-shrink-0">AH</div>
                    <div><div className="font-bold text-gray-900">Dr. Ali Hassan</div><div className="text-xs text-gray-500">Associate Professor</div></div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-600">Computer Science</td>
                <td className="py-4 px-6 text-center font-bold text-gray-900">4 Groups</td>
                <td className="py-4 px-6 text-center text-gray-600">6 Projects</td>
                <td className="py-4 px-6 text-center"><span className="text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-lg border border-success/20">100% (Weekly)</span></td>
                <td className="py-4 px-6 text-center"><span className="text-xs font-bold text-secondary bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">Full Load (4/4)</span></td>
                <td className="py-4 px-6 text-right"><button onClick={() => confirmAction('View Audit for Dr. Ali Hassan')} className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-all cursor-pointer border-0">View Audit</button></td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm border border-purple-200 flex-shrink-0">FK</div>
                    <div><div className="font-bold text-gray-900">Dr. Fatima Khan</div><div className="text-xs text-gray-500">Assistant Professor</div></div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-600">Software Engineering</td>
                <td className="py-4 px-6 text-center font-bold text-gray-900">3 Groups</td>
                <td className="py-4 px-6 text-center text-gray-600">5 Projects</td>
                <td className="py-4 px-6 text-center"><span className="text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-lg border border-success/20">92% (Regular)</span></td>
                <td className="py-4 px-6 text-center"><span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">Optimal (3/4)</span></td>
                <td className="py-4 px-6 text-right"><button onClick={() => confirmAction('View Audit for Dr. Fatima Khan')} className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-all cursor-pointer border-0">View Audit</button></td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm border border-amber-200 flex-shrink-0">UK</div>
                    <div><div className="font-bold text-gray-900">Dr. Usman Khalid</div><div className="text-xs text-gray-500">Professor</div></div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-600">AI & Data Science</td>
                <td className="py-4 px-6 text-center font-bold text-gray-900">2 Groups</td>
                <td className="py-4 px-6 text-center text-gray-600">3 Projects</td>
                <td className="py-4 px-6 text-center"><span className="text-xs font-bold text-warning bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">75% (Irregular)</span></td>
                <td className="py-4 px-6 text-center"><span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">Under Load (2/4)</span></td>
                <td className="py-4 px-6 text-right"><button onClick={() => confirmAction('View Audit for Dr. Usman Khalid')} className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-all cursor-pointer border-0">View Audit</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 font-bold text-center">
          <span>Showing all 3 registered faculty supervision records</span>
        </div>
      </div>
    </div>
  );
}
