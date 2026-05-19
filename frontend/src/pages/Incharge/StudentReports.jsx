import React from 'react';

export default function StudentReports() {
  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">Student Supervision & Milestone Reports</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Per-student audit tracking project details, evaluation history, supervisor remarks, and milestone progress</p>
      </div>

      {/* Search & Select Student */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input type="text" placeholder="Search student name or reg no..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-secondary focus:bg-white transition-all" />
        </div>
        <select className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 outline-none focus:border-secondary cursor-pointer w-full sm:w-auto">
          <option>Ahmed Farooq (SP21-BCS-001)</option>
          <option>Aima Khalid (SP21-BCS-019)</option>
        </select>
      </div>

      {/* Detailed Student Report Card */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-100 gap-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-black flex-shrink-0">AF</div>
            <div><h3 className="text-xl font-black text-gray-900">Ahmed Farooq</h3><p className="text-xs text-gray-500 font-mono mt-0.5">SP21-BCS-001 · Computer Science</p></div>
          </div>
          <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100"><span className="text-xs font-bold text-gray-500">Milestone Progress:</span><span className="text-lg font-black text-secondary">25% Completed</span></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
            <h4 className="font-black text-gray-800 text-sm pb-2 border-b border-gray-200"><i className="fas fa-project-diagram text-secondary mr-2"></i>Project Overview</h4>
            <div className="flex justify-between"><span className="text-gray-500 font-bold">Assigned Title:</span><span className="font-bold text-gray-800 truncate max-w-xs">AI Traffic Management System</span></div>
            <div className="flex justify-between"><span className="text-gray-500 font-bold">Supervisor Name:</span><span className="font-bold text-gray-800">Dr. Ali Hassan</span></div>
            <div className="flex justify-between"><span className="text-gray-500 font-bold">Group ID:</span><span className="font-mono font-bold text-gray-800">G-042</span></div>
          </div>
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
            <h4 className="font-black text-gray-800 text-sm pb-2 border-b border-gray-200"><i className="fas fa-award text-secondary mr-2"></i>Evaluation History</h4>
            <div className="flex justify-between"><span className="text-gray-500 font-bold">10% Milestone Score:</span><span className="font-black text-success">8.5 / 10 (A)</span></div>
            <div className="flex justify-between"><span className="text-gray-500 font-bold">Evaluating Committee:</span><span className="font-bold text-gray-800">PEC-1</span></div>
            <div className="flex justify-between"><span className="text-gray-500 font-bold">Defense Status:</span><span className="font-bold text-success">Cleared</span></div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-black text-gray-800 text-sm"><i className="fas fa-comments text-secondary mr-2"></i>Supervisor Remarks & Log Audit</h4>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs"><div className="flex justify-between items-center mb-1"><span className="font-bold text-gray-900">Dr. Ali Hassan (Supervisor)</span><span className="text-[10px] text-gray-400 font-bold">May 12, 2026</span></div><p className="text-gray-600 leading-relaxed">"The group has successfully implemented the YOLOv8 object detection pipeline. Ready for mid-term defense presentation."</p></div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs"><div className="flex justify-between items-center mb-1"><span className="font-bold text-gray-900">Dr. Sara Malik (Committee Head)</span><span className="text-[10px] text-gray-400 font-bold">Apr 20, 2026</span></div><p className="text-gray-600 leading-relaxed">"Proposal approved with minor revisions required in the literature review section."</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
