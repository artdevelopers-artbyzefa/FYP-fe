import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { usePhase } from '../../contexts/PhaseContext';
import { getInchargeDashboardStats } from '../../services/office-incharge.service';
import { ArrowRight, Calendar, ClipboardList, GraduationCap, Lock, Scale, ToggleRight, UserPlus, Users, Loader2, CheckCircle } from 'lucide-react';

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
    { onClick: () => navigate('/office-incharge/grievances'), icon: Scale, title: 'Grievance & SLAs', desc: 'Resolve student disputes, monitor SLA windows, and escalate critical issues.' },
    { locked: true, icon: Users, title: 'Committee Oversight', desc: 'Monitor active boards, manage head change requests, and trigger re-evaluations.' },
    { locked: true, icon: UserPlus, title: 'Supervision Requests', desc: 'Review and process faculty supervision requests.' },
    { locked: true, icon: GraduationCap, title: 'Student Reports', desc: 'View detailed student academic reports.' },
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

      {/* User Info + Welcome */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-full flex items-center justify-center text-xl text-primary overflow-hidden border-2 border-primary/10 flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">{user?.name || 'Dr. Sara Malik'}</h2>
            <p className="text-xs md:text-sm text-gray-400 font-medium">FYP Office In-charge</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
            <div className="text-[9px] font-bold text-primary uppercase tracking-widest">Designation</div>
            <div className="text-xs font-bold text-gray-700">In-charge</div>
          </div>
          <div className="px-4 py-2 bg-secondary/5 rounded-xl border border-secondary/10">
            <div className="text-[9px] font-bold text-secondary uppercase tracking-widest">Campus</div>
            <div className="text-xs font-bold text-gray-700">CUI Abbottabad</div>
          </div>
          <button onClick={() => navigate('/office-incharge/grievances')} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-secondary transition-all cursor-pointer shadow-sm">
            <Scale className="w-4 h-4" /> Grievances ({stats?.openGrievances || 0})
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {/* Active Phase Display */}
      {phaseLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        </div>
      ) : currentPhase ? (
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-sm p-6 md:p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-200" />
                <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Active Phase</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-1">{currentPhase.name}</h3>
              <p className="text-sm text-blue-200 font-medium max-w-xl">{currentPhase.description}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/10">
              <span className="text-xs font-bold text-white">Phase {currentPhase.sequence}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <ToggleRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-800">No Active Phase</h3>
              <p className="text-xs text-amber-600 font-medium">Go to Phase Control to activate a phase.</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link, i) => (
          <div key={i} onClick={() => { if (!link.locked) link.onClick?.(); }} className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all group flex flex-col justify-between ${link.locked ? 'opacity-50 cursor-not-allowed' : 'hover:border-secondary hover:shadow-md cursor-pointer'}`} title={link.locked ? 'Locked during Phase 1' : link.title}>
            <div className="flex justify-between items-center mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${link.locked ? 'bg-gray-100 text-gray-400' : 'bg-secondary/10 text-secondary'}`}>
                <link.icon className="w-5 h-5" />
              </div>
              {link.locked ? <Lock className="text-gray-300 w-5 h-5" /> : <ArrowRight className="text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all w-5 h-5" />}
            </div>
            <div>
              <h3 className={`font-bold text-sm mb-1 ${link.locked ? 'text-gray-400' : 'text-gray-800'}`}>{link.title}</h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">{link.desc}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default InchargeDashboard;
