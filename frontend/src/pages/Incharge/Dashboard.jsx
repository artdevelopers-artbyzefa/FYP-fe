import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowRight, Calendar, CalendarCheck, ClipboardList, Lock, Scale, UserPlus, Users } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useOutletContext();

  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
      {/* Welcome Banner */}
      <div className="bg-white rounded-[2rem] border border-line shadow-sm p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6" >
        <div className="text-white">
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Welcome back, {user?.name || 'In-charge'}!</h1>
          <p className="text-sm text-white/80 font-medium max-w-2xl leading-relaxed">Here is the executive oversight panel for the Spring 2026 academic session. Monitor grievance SLAs, review supervision requests, and manage curriculum rubrics.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => navigate('/incharge/supervision-requests')} className="bg-white text-slate-900 hover:bg-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer border-0">
            <UserPlus className="w-4 h-4" /> Pending Requests (2)
          </button>
          <button onClick={() => navigate('/incharge/grievances')} className="bg-white hover:bg-white text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer border-0">
            <Scale className="w-4 h-4" /> Grievances (1)
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-line p-6 shadow-sm flex items-center gap-5 hover:border-blue-500 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white text-slate-900 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><ClipboardList className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 truncate">Active Rubrics</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900">4</span>
              <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded-lg">Validated</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-line p-6 shadow-sm flex items-center gap-5 hover:border-blue-500 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white text-slate-900 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><UserPlus className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 truncate">Supervision Req</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900">2</span>
              <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded-lg">Pending</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-line p-6 shadow-sm flex items-center gap-5 hover:border-blue-500 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white text-slate-900 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><Scale className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 truncate">Open Grievances</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900">3</span>
              <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded-lg">1 SLA Breach</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-line p-6 shadow-sm flex items-center gap-5 hover:border-blue-500 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white text-slate-900 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><CalendarCheck className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 truncate">Active Session</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900">SP26</span>
              <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded-lg flex items-center gap-1"><Lock className="text-xs" /> Locked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div onClick={() => navigate('/incharge/rubrics')} className="bg-white p-6 rounded-2xl border border-line shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center font-bold"><ClipboardList className="text-base" /></div>
            <ArrowRight className="text-slate-900 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div><h3 className="font-bold text-slate-900 text-base mb-1">Rubric Builder</h3><p className="text-xs text-slate-900 font-medium">Design proposal & CLO evaluation rubrics with 100% weight validation.</p></div>
        </div>
        <div onClick={() => navigate('/incharge/sessions')} className="bg-white p-6 rounded-2xl border border-line shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center font-bold"><Calendar className="text-base" /></div>
            <ArrowRight className="text-slate-900 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div><h3 className="font-bold text-slate-900 text-base mb-1">Academic Sessions</h3><p className="text-xs text-slate-900 font-medium">Configure milestone deadlines and handle FYP-1 repeat registrations.</p></div>
        </div>
        <div onClick={() => navigate('/incharge/committee-oversight')} className="bg-white p-6 rounded-2xl border border-line shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center font-bold"><Users className="text-base" /></div>
            <ArrowRight className="text-slate-900 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div><h3 className="font-bold text-slate-900 text-base mb-1">Committee Oversight</h3><p className="text-xs text-slate-900 font-medium">Monitor active boards, manage head change requests, and trigger re-evaluations.</p></div>
        </div>
        <div onClick={() => navigate('/incharge/grievances')} className="bg-white p-6 rounded-2xl border border-line shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center font-bold"><Scale className="text-base" /></div>
            <ArrowRight className="text-slate-900 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div><h3 className="font-bold text-slate-900 text-base mb-1">Grievance & SLAs</h3><p className="text-xs text-slate-900 font-medium">Resolve student disputes, monitor SLA windows, and escalate critical issues.</p></div>
        </div>
      </div>
    </div>
  );
}