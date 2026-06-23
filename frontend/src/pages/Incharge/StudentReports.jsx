import React from 'react';
import { Award, GitBranch, MessageSquare, Search } from 'lucide-react';

export default function StudentReports() {
  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Student Supervision & Milestone Reports</h2>
        <p className="text-xs text-slate-900 mt-0.5 font-medium">Per-student audit tracking project details, evaluation history, supervisor remarks, and milestone progress</p>
      </div>

      {/* Search & Select Student */}
      <div className="bg-white rounded-2xl border border-line p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 text-sm" />
          <input type="text" placeholder="Search student name or reg no..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-line rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
        </div>
        <select className="bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer w-full sm:w-auto">
          <option>Ahmed Farooq (SP21-BCS-001)</option>
          <option>Aima Khalid (SP21-BCS-019)</option>
        </select>
      </div>

      {/* Detailed Student Report Card */}
      <div className="bg-white rounded-[2rem] border border-line shadow-sm p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-line gap-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black flex-shrink-0">AF</div>
            <div><h3 className="text-xl font-bold text-slate-900">Ahmed Farooq</h3><p className="text-xs text-slate-900 font-mono mt-0.5">SP21-BCS-001 | Computer Science</p></div>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-line"><span className="text-xs font-bold text-slate-900">Milestone Progress:</span><span className="text-lg font-bold text-slate-900">25% Completed</span></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-white p-5 rounded-2xl border border-line space-y-3">
            <h4 className="font-bold text-slate-900 text-sm pb-2 border-b border-line"><GitBranch className="text-slate-900 mr-2" />Project Overview</h4>
            <div className="flex justify-between"><span className="text-slate-900 font-bold">Assigned Title:</span><span className="font-bold text-slate-900 truncate max-w-xs">AI Traffic Management System</span></div>
            <div className="flex justify-between"><span className="text-slate-900 font-bold">Supervisor Name:</span><span className="font-bold text-slate-900">Dr. Ali Hassan</span></div>
            <div className="flex justify-between"><span className="text-slate-900 font-bold">Group ID:</span><span className="font-mono font-bold text-slate-900">G-042</span></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-line space-y-3">
            <h4 className="font-bold text-slate-900 text-sm pb-2 border-b border-line"><Award className="text-slate-900 mr-2" />Evaluation History</h4>
            <div className="flex justify-between"><span className="text-slate-900 font-bold">10% Milestone Score:</span><span className="font-bold text-slate-900">8.5 / 10 (A)</span></div>
            <div className="flex justify-between"><span className="text-slate-900 font-bold">Evaluating Committee:</span><span className="font-bold text-slate-900">PEC-1</span></div>
            <div className="flex justify-between"><span className="text-slate-900 font-bold">Defense Status:</span><span className="font-bold text-slate-900">Cleared</span></div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 text-sm"><MessageSquare className="text-slate-900 mr-2" />Supervisor Remarks & Log Audit</h4>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white border border-line text-xs"><div className="flex justify-between items-center mb-1"><span className="font-bold text-slate-900">Dr. Ali Hassan (Supervisor)</span><span className="text-[10px] text-slate-900 font-bold">May 12, 2026</span></div><p className="text-slate-900 leading-relaxed">"The group has successfully implemented the YOLOv8 object detection pipeline. Ready for mid-term defense presentation."</p></div>
            <div className="p-4 rounded-2xl bg-white border border-line text-xs"><div className="flex justify-between items-center mb-1"><span className="font-bold text-slate-900">Dr. Sara Malik (Committee Head)</span><span className="text-[10px] text-slate-900 font-bold">Apr 20, 2026</span></div><p className="text-slate-900 leading-relaxed">"Proposal approved with minor revisions required in the literature review section."</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
