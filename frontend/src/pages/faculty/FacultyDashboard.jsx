import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getFacultyDashboardStats } from '../../services/faculty.service';
import { ArrowRight, CalendarCheck, Crown, FileSignature, GitBranch, Star, UserCheck } from 'lucide-react';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getFacultyDashboardStats().then((res) => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <>
      {/* Welcome Banner */}
      <div className="bg-white rounded-[2rem] border border-black shadow-sm p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-[fadeIn_0.4s_ease-out]" >
        <div className="text-white">
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Welcome, {user?.name || 'Faculty'}!</h1>
          <p className="text-sm text-white/80 font-medium max-w-2xl leading-relaxed">
            Here is your academic supervision and committee management dashboard. Track active student groups, review supervision requests, and input committee evaluation scores.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => navigate('/faculty/proposals')} className="bg-white text-black hover:bg-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
            <UserCheck className="w-4 h-4" /> Supervision Requests ({stats?.pendingRequests ?? '...'})
          </button>
          <button onClick={() => navigate('/faculty/evaluations')} className="bg-white hover:bg-white text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
            <Star className="w-4 h-4" /> Defenses (2)
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-black p-6 shadow-sm flex items-center gap-5 hover:border-blue-600 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><GitBranch className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-black uppercase tracking-wider mb-1 truncate">Supervised Groups</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-black">{stats ? stats.supervisedGroups : '...'}</span>
              <span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg">{stats ? stats.supervisedGroups : 0}/{stats ? stats.supervisedCap : 8} Full</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-black p-6 shadow-sm flex items-center gap-5 hover:border-blue-600 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><UserCheck className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-black uppercase tracking-wider mb-1 truncate">Supervision Requests</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-black">{stats ? stats.pendingRequests : '...'}</span>
              <span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg">Requires Review</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-black p-6 shadow-sm flex items-center gap-5 hover:border-blue-600 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><CalendarCheck className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-black uppercase tracking-wider mb-1 truncate">Weekly Log Approvals</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-black">{stats ? stats.weeklyLogs : '...'}</span>
              <span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg">Up to date</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-black p-6 shadow-sm flex items-center gap-5 hover:border-blue-600 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><Crown className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-black uppercase tracking-wider mb-1 truncate">Committee Head Status</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-black">{stats ? stats.committeeHead : '...'}</span>
              <span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg">Active Head</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div onClick={() => navigate('/faculty/proposals')} className="bg-white p-6 rounded-2xl border border-black shadow-sm hover:border-blue-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold"><UserCheck className="text-base" /></div>
            <ArrowRight className="text-black group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-black text-base mb-1">Supervision Requests</h3>
            <p className="text-xs text-black font-medium">Review student requests to be your supervisee. Accept or reject supervision requests.</p>
          </div>
        </div>
        <div onClick={() => navigate('/faculty/supervision')} className="bg-white p-6 rounded-2xl border border-black shadow-sm hover:border-blue-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold"><GitBranch className="text-base" /></div>
            <ArrowRight className="text-black group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-black text-base mb-1">Project Supervision</h3>
            <p className="text-xs text-black font-medium">Track weekly log submissions and review draft thesis chapters.</p>
          </div>
        </div>
        <div onClick={() => navigate('/faculty/evaluations')} className="bg-white p-6 rounded-2xl border border-black shadow-sm hover:border-blue-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold"><Star className="text-base" /></div>
            <ArrowRight className="text-black group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-black text-base mb-1">Committee Evaluations</h3>
            <p className="text-xs text-black font-medium">Input scores per CLO criteria and submit locked evaluation scorecards.</p>
          </div>
        </div>
        <div onClick={() => navigate('/faculty/head-duties')} className="bg-white p-6 rounded-2xl border border-black shadow-sm hover:border-blue-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between bg-white/10">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold"><Crown className="text-base" /></div>
            <ArrowRight className="text-black group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-black text-base mb-1">Committee Head Duties</h3>
            <p className="text-xs text-black font-medium">Consolidate member evaluations and publish final consensus scores.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyDashboard;
