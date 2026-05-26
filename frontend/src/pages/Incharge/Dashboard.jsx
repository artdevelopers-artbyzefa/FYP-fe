import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useOutletContext();

  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
      {/* Welcome Banner */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6" style={{ background: 'linear-gradient(135deg, #2B3990, #1E3A8A)' }}>
        <div className="text-white">
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Welcome back, {user?.name || 'In-charge'}!</h1>
          <p className="text-sm text-white/80 font-medium max-w-2xl leading-relaxed">Here is the executive oversight panel for the Spring 2026 academic session. Monitor grievance SLAs, review supervision requests, and manage curriculum rubrics.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => navigate('/incharge/supervision-requests')} className="bg-white text-primary hover:bg-gray-50 px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer border-0">
            <i className="fas fa-user-plus"></i> Pending Requests (2)
          </button>
          <button onClick={() => navigate('/incharge/grievances')} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer border-0">
            <i className="fas fa-balance-scale"></i> Grievances (1)
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-tasks"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Active Rubrics</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-800">4</span>
              <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-lg">Validated</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-secondary flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-user-plus"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Supervision Req</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-800">2</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">Pending</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-balance-scale-right"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Open Grievances</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-800">3</span>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg">1 SLA Breach</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-calendar-check"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Active Session</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-800">SP26</span>
              <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-lg flex items-center gap-1"><i className="fas fa-lock text-xs"></i> Locked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div onClick={() => navigate('/incharge/rubrics')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-secondary hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold"><i className="fas fa-tasks text-base"></i></div>
            <i className="fas fa-arrow-right text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all"></i>
          </div>
          <div><h3 className="font-bold text-gray-800 text-base mb-1">Rubric Builder</h3><p className="text-xs text-gray-500 font-medium">Design proposal & CLO evaluation rubrics with 100% weight validation.</p></div>
        </div>
        <div onClick={() => navigate('/incharge/sessions')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-secondary hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-secondary flex items-center justify-center font-bold"><i className="fas fa-calendar-alt text-base"></i></div>
            <i className="fas fa-arrow-right text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all"></i>
          </div>
          <div><h3 className="font-bold text-gray-800 text-base mb-1">Academic Sessions</h3><p className="text-xs text-gray-500 font-medium">Configure milestone deadlines and handle FYP-1 repeat registrations.</p></div>
        </div>
        <div onClick={() => navigate('/incharge/committee-oversight')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-secondary hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold"><i className="fas fa-users text-base"></i></div>
            <i className="fas fa-arrow-right text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all"></i>
          </div>
          <div><h3 className="font-bold text-gray-800 text-base mb-1">Committee Oversight</h3><p className="text-xs text-gray-500 font-medium">Monitor active boards, manage head change requests, and trigger re-evaluations.</p></div>
        </div>
        <div onClick={() => navigate('/incharge/grievances')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-secondary hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold"><i className="fas fa-balance-scale text-base"></i></div>
            <i className="fas fa-arrow-right text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all"></i>
          </div>
          <div><h3 className="font-bold text-gray-800 text-base mb-1">Grievance & SLAs</h3><p className="text-xs text-gray-500 font-medium">Resolve student disputes, monitor SLA windows, and escalate critical issues.</p></div>
        </div>
      </div>
    </div>
  );
}