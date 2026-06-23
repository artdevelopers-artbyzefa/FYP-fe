import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { usePhase } from '../../contexts/PhaseContext';
import { getInchargeDashboardStats } from '../../services/office-incharge.service';
import { ArrowRight, Calendar, ClipboardList, GraduationCap, Scale, ToggleRight, UserPlus, Users } from 'lucide-react';

const InchargeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const { currentPhase, loading: phaseLoading } = usePhase();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInchargeDashboardStats()
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const quickLinks = [
    { onClick: () => navigate('/office-incharge/phases'), icon: ToggleRight, title: 'Phase Control', desc: 'Activate or switch academic phases. Registration, Proposal, Development, and more.' },
    { onClick: () => navigate('/office-incharge/rubrics'), icon: ClipboardList, title: 'Rubric Builder', desc: 'Design proposal & CLO evaluation rubrics with 100% weight validation.' },
    { onClick: () => navigate('/office-incharge/sessions'), icon: Calendar, title: 'Academic Sessions', desc: 'Configure milestone deadlines and handle FYP-1 repeat registrations.' },
    { onClick: () => navigate('/office-incharge/committee-oversight'), icon: Users, title: 'Committee Oversight', desc: 'Monitor active boards, manage head change requests, and trigger re-evaluations.' },
    { onClick: () => navigate('/office-incharge/grievances'), icon: Scale, title: 'Grievance & SLAs', desc: 'Resolve student disputes, monitor SLA windows, and escalate critical issues.' },
  ];

  return (
    <div className="space-y-6">

      {/* Active Phase Banner */}
      {!phaseLoading && currentPhase && (
        <div onClick={() => navigate('/office-incharge/phases')} className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl shadow-sm border border-blue-800/20 p-4 md:p-6 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
              <ToggleRight className="text-white w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Current Academic Phase</div>
              <div className="text-white text-base md:text-lg font-bold">{currentPhase.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
            <span className="text-[10px] font-bold hidden sm:inline">Manage Phases</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">Welcome back, {user?.name || 'In-charge'}!</h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">Here is the executive oversight panel for the current academic session. Monitor grievance SLAs, review supervision requests, and manage curriculum rubrics.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => navigate('/office-incharge/supervision-requests')} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-secondary transition-all cursor-pointer shadow-sm">
            <UserPlus className="w-4 h-4" /> Pending ({stats?.pendingSupervisionReqs || 0})
          </button>
          <button onClick={() => navigate('/office-incharge/grievances')} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-secondary transition-all cursor-pointer shadow-sm">
            <Scale className="w-4 h-4" /> Grievances ({stats?.openGrievances || 0})
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 w-full rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4 md:p-5 text-center lg:text-left">
            <div className="text-2xl md:text-3xl font-black text-emerald-600 mb-1">{stats?.activeRubrics || 0}</div>
            <div className="text-[9px] md:text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-tight">Active Rubrics</div>
          </div>
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4 md:p-5 text-center lg:text-left">
            <div className="text-2xl md:text-3xl font-black text-blue-600 mb-1">{stats?.pendingSupervisionReqs || 0}</div>
            <div className="text-[9px] md:text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-tight">Supervision Requests</div>
          </div>
          <div className="bg-rose-50 rounded-2xl border border-rose-100 p-4 md:p-5 text-center lg:text-left">
            <div className="text-2xl md:text-3xl font-black text-rose-600 mb-1">{stats?.openGrievances || 0}</div>
            <div className="text-[9px] md:text-[10px] font-bold text-rose-400 uppercase tracking-widest leading-tight">Open Grievances</div>
          </div>
          <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-4 md:p-5 text-center lg:text-left">
            <div className="text-2xl md:text-3xl font-black text-indigo-600 mb-1">{stats?.activeSession || 'N/A'}</div>
            <div className="text-[9px] md:text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-tight">Active Session</div>
          </div>
        </div>
      )}

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link, i) => (
          <div key={i} onClick={link.onClick} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-secondary hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                <link.icon className="w-5 h-5" />
              </div>
              <ArrowRight className="text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">{link.title}</h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">{link.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center text-xl md:text-2xl text-primary overflow-hidden border-2 border-primary/10">
            <GraduationCap className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">{user?.name || 'Dr. Sara Malik'}</h2>
            <p className="text-xs md:text-sm text-gray-400 font-medium">FYP Office In-charge</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">Designation</div>
            <div className="text-sm font-medium text-gray-700">In-charge</div>
          </div>
          <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
            <div className="text-[10px] font-bold text-secondary mb-1 uppercase tracking-widest">Campus</div>
            <div className="text-sm font-medium text-gray-700">CUI Abbottabad</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InchargeDashboard;
