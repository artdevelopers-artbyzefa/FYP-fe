import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getOfficeDashboardStats } from '../../services/office-assistant.service';
import { ArrowRight, FileUp, GitBranch, GraduationCap, Layers, UserPen, UserPlus, Users, FileSignature, CalendarCheck, Star } from 'lucide-react';
import PhaseContext from '../../contexts/PhaseContext';
import { DashboardSkeleton } from '../../components/Skeleton';

const iconMap = {
  FileUp, UserPen, UserPlus, FileSignature, CalendarCheck, Star
};

const AssistantDashboard = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const phaseCtx = useContext(PhaseContext);
  const currentPhase = phaseCtx?.currentPhase;
  const phase1Keys = ['registration', 'proposal_submission', 'proposal_defense', 'phase1_development', 'phase1_evaluation'];
  const isPhase1 = currentPhase && phase1Keys.includes(currentPhase.key);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOfficeDashboardStats().then((res) => setStats(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === 1) return `Yesterday, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const actions = stats?.recentActions || [];

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-full flex items-center justify-center text-xl text-primary overflow-hidden border-2 border-primary/10 flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Good day, {user?.name || 'Assistant'}!</h2>
            <p className="text-xs md:text-sm text-gray-400 font-medium">FYP Office Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
            <div className="text-[9px] font-bold text-primary uppercase tracking-widest">Designation</div>
            <div className="text-xs font-bold text-gray-700">Assistant</div>
          </div>
          <div className="px-4 py-2 bg-secondary/5 rounded-xl border border-secondary/10">
            <div className="text-[9px] font-bold text-secondary uppercase tracking-widest">Campus</div>
            <div className="text-xs font-bold text-gray-700">CUI Abbottabad</div>
          </div>
          <button onClick={() => navigate('/office-assistant/users')} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-secondary transition-all cursor-pointer shadow-sm">
            <UserPlus className="w-4 h-4" /> Add User
          </button>
          <button onClick={() => navigate('/office-assistant/students')} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-secondary transition-all cursor-pointer shadow-sm">
            <GraduationCap className="w-4 h-4" /> View Students
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => navigate('/office-assistant/users')} className="card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
          <div className="flex justify-between items-center mb-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex-center text-secondary group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <ArrowRight className="text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">User Account Management</h3>
          <p className="text-xs text-gray-400 font-medium">Assign roles, manage accounts, and register users.</p>
        </div>
        <div onClick={() => navigate('/office-assistant/students')} className="card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
          <div className="flex justify-between items-center mb-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex-center text-secondary group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <ArrowRight className="text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">Student Records</h3>
          <p className="text-xs text-gray-400 font-medium">Search, onboard, and manage student profiles.</p>
        </div>
        <div onClick={() => navigate('/office-assistant/faculty')} className="card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
          <div className="flex justify-between items-center mb-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex-center text-secondary group-hover:scale-105 transition-transform">
              <UserPen className="w-5 h-5" />
            </div>
            <ArrowRight className="text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">Faculty Profiles</h3>
          <p className="text-xs text-gray-400 font-medium">Onboard and manage faculty members.</p>
        </div>
        <div onClick={() => navigate('/office-assistant/proposal-committee')} className="card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group opacity-50 cursor-not-allowed" title="Locked during Phase 1">
          <div className="flex justify-between items-center mb-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex-center text-gray-400">
              <Users className="w-5 h-5" />
            </div>
            <ArrowRight className="text-gray-300 w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-400 text-sm mb-1">Proposal Committees</h3>
          <p className="text-xs text-gray-400 font-medium">Locked during Phase 1.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex-center text-primary">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">System Workflow Quick Access</h3>
              <p className="text-[10px] text-gray-400 font-medium">Manage core database entities and committee configurations</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Layers, label: 'Evaluation Committees', path: '/office-assistant/eval-committee', locked: isPhase1 },
              { icon: FileUp, label: 'Content & Templates', path: '/office-assistant/content', locked: true },
              { icon: Star, label: 'Results & Printing', path: '/office-assistant/results', locked: true },
              { icon: FileSignature, label: 'Project Directory', path: '/office-assistant/projects', locked: isPhase1 },
            ].map(link => (
              <div key={link.label} onClick={() => { if (!link.locked) navigate(link.path); }} className={`p-4 rounded-2xl border border-gray-100 transition-all ${link.locked ? 'opacity-50 cursor-not-allowed' : 'hover:border-secondary hover:shadow-md cursor-pointer group'}`} title={link.locked && currentPhase ? `Locked during ${currentPhase.name}` : link.label}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-xl flex-center ${link.locked ? 'bg-gray-100 text-gray-400' : 'bg-secondary/10 text-secondary group-hover:scale-105 transition-transform'}`}>
                    <link.icon className="w-4 h-4" />
                  </div>
                  <span className={`font-bold text-xs ${link.locked ? 'text-gray-400' : 'text-gray-800'}`}>{link.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex-center text-primary">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">Recent Actions</h3>
              <p className="text-[10px] text-gray-400 font-medium">Latest administrative activities</p>
            </div>
          </div>
          <div className="space-y-4">
            {actions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
                <p className="text-xs font-medium">Loading...</p>
              </div>
            ) : (
              actions.map((a, i) => {
                const Icon = iconMap[a.icon] || CalendarCheck;
                return (
                  <div key={i} className={`flex gap-4 items-start ${i < actions.length - 1 ? 'pb-4 border-b border-gray-100' : 'pb-2'}`}>
                    <div className={`w-8 h-8 rounded-xl flex-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      a.category === 'content' ? 'bg-amber-50 text-amber-500' :
                      a.category === 'committee' ? 'bg-blue-50 text-blue-500' :
                      a.category === 'user' ? 'bg-purple-50 text-purple-500' :
                      a.category === 'proposal' ? 'bg-indigo-50 text-indigo-500' :
                      'bg-emerald-50 text-emerald-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-800">{a.title}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{a.description}</div>
                      <div className="text-[10px] text-gray-400 font-bold mt-1">{formatTime(a.time)}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantDashboard;
