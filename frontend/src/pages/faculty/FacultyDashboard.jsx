import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFacultyDashboardStats } from '../../services/faculty.service';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getFacultyDashboardStats().then((res) => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <>
      {/* Welcome Banner */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-[fadeIn_0.4s_ease-out]" style={{ background: 'linear-gradient(135deg, #2b3990, #2563eb)' }}>
        <div className="text-white">
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Welcome, Dr. Ali Hassan! 🎓</h1>
          <p className="text-sm text-white/80 font-medium max-w-2xl leading-relaxed">
            Here is your academic supervision and committee management dashboard. Track active student groups, review pending project proposals, and input committee evaluation scores.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => navigate('/faculty/proposals')} className="bg-white text-primary hover:bg-gray-50 px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
            <i className="fas fa-file-signature"></i> Pending Proposals (1)
          </button>
          <button onClick={() => navigate('/faculty/evaluations')} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
            <i className="fas fa-star"></i> Defenses (2)
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-secondary flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-project-diagram"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Supervised Groups</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-800">{stats ? stats.supervisedGroups : '...'}</span>
              <span className="text-xs font-bold text-secondary bg-blue-50 px-2 py-0.5 rounded-lg">Full Cap ({stats ? stats.supervisedCap : ''}/{stats ? stats.supervisedCap : ''})</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-file-signature"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Pending Proposals</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-800">{stats ? stats.pendingProposals : '...'}</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">Requires Review</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-calendar-check"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Weekly Log Approvals</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-800">{stats ? stats.weeklyLogs : '...'}</span>
              <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-lg">Up to date</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-crown"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Committee Head Status</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-800">{stats ? stats.committeeHead : '...'}</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg">Active Head</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div onClick={() => navigate('/faculty/proposals')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-secondary hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold"><i className="fas fa-file-signature text-base"></i></div>
            <i className="fas fa-arrow-right text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base mb-1">Student Proposals</h3>
            <p className="text-xs text-gray-500 font-medium">Review incoming project proposals and request mandatory revisions.</p>
          </div>
        </div>
        <div onClick={() => navigate('/faculty/supervision')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-secondary hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-secondary flex items-center justify-center font-bold"><i className="fas fa-project-diagram text-base"></i></div>
            <i className="fas fa-arrow-right text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base mb-1">Project Supervision</h3>
            <p className="text-xs text-gray-500 font-medium">Track weekly log submissions and review draft thesis chapters.</p>
          </div>
        </div>
        <div onClick={() => navigate('/faculty/evaluations')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-secondary hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold"><i className="fas fa-star text-base"></i></div>
            <i className="fas fa-arrow-right text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base mb-1">Committee Evaluations</h3>
            <p className="text-xs text-gray-500 font-medium">Input scores per CLO criteria and submit locked evaluation scorecards.</p>
          </div>
        </div>
        <div onClick={() => navigate('/faculty/head-duties')} className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between bg-amber-50/10">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold"><i className="fas fa-crown text-base"></i></div>
            <i className="fas fa-arrow-right text-gray-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base mb-1">Committee Head Duties</h3>
            <p className="text-xs text-gray-600 font-medium">Consolidate member evaluations and publish final consensus scores.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyDashboard;
