import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getHodDashboardStats, getGovernanceData } from '../../services/hod.service';
import { getCurrentUser } from '../../services/auth.service';
import { ChevronRight, Gavel, GraduationCap, Landmark, LineChart, Lock, PieChart, Presentation, Shield, Users, UserCheck } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const HodDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [governance, setGovernance] = useState({ committees: [], rubrics: [] });
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser() ?? null;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, govRes] = await Promise.all([
          getHodDashboardStats(),
          getGovernanceData().catch(() => ({ data: { committees: [], rubrics: [] } })),
        ]);
        setStats(dashRes.data);
        setGovernance(govRes.data);
      } catch (error) {
        console.error('Error fetching HOD data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const activeCommittees = Array.isArray(governance.committees) ? governance.committees.filter(c => c.status === 'active') : [];
  const totalRubrics = Array.isArray(governance.rubrics) ? governance.rubrics.length : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-32 w-full rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="skeleton h-64 lg:col-span-2 rounded-2xl" />
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-full flex items-center justify-center text-xl text-primary overflow-hidden border-2 border-primary/10 flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">{user?.name || 'HOD'}</h2>
            <p className="text-xs md:text-sm text-gray-400 font-medium">Head of Department</p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
            <div className="text-[9px] font-bold text-primary uppercase tracking-widest">Designation</div>
            <div className="text-xs font-bold text-gray-700">HOD CS</div>
          </div>
          <div className="px-4 py-2 bg-secondary/5 rounded-xl border border-secondary/10">
            <div className="text-[9px] font-bold text-secondary uppercase tracking-widest">Campus</div>
            <div className="text-xs font-bold text-gray-700">CUI Abbottabad</div>
          </div>
          <button onClick={() => navigate('/hod/escalations')} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-secondary transition-all cursor-pointer shadow-sm">
            <Gavel className="w-4 h-4" /> Escalations ({stats?.escalatedGrievances || 0})
          </button>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => navigate('/hod/students')} className="card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
          <div className="flex justify-between items-center mb-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex-center text-secondary group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-blue-700 bg-blue-50">{stats?.totalGroups || 0} Groups</span>
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">Students</h3>
          <p className="text-xs text-gray-400 font-medium">View and manage registered students.</p>
        </div>
        <div onClick={() => navigate('/hod/faculty')} className="card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
          <div className="flex justify-between items-center mb-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex-center text-secondary group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-emerald-700 bg-emerald-50">{stats?.activeFaculty || 0} Active</span>
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">Faculty</h3>
          <p className="text-xs text-gray-400 font-medium">Monitor faculty workload and profiles.</p>
        </div>
        <div onClick={() => navigate('/hod/escalations')} className="card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
          <div className="flex justify-between items-center mb-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex-center text-secondary group-hover:scale-105 transition-transform">
              <Gavel className="w-5 h-5" />
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${(stats?.escalatedGrievances || 0) > 0 ? 'text-rose-700 bg-rose-50' : 'text-emerald-700 bg-emerald-50'}`}>
              {(stats?.escalatedGrievances || 0) > 0 ? 'Requires Action' : 'All Clear'}
            </span>
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">Grievances</h3>
          <p className="text-xs text-gray-400 font-medium">{stats?.escalatedGrievances || 0} escalated issues.</p>
        </div>
        <div className="card p-5 opacity-50 cursor-not-allowed select-none" title="Locked during Phase 1">
          <div className="flex justify-between items-center mb-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex-center text-gray-400">
              <LineChart className="w-5 h-5" />
            </div>
            <Lock className="text-gray-300 w-4 h-4" />
          </div>
          <h3 className="font-bold text-gray-400 text-sm mb-1">CLO Attainment</h3>
          <p className="text-xs text-gray-400 font-medium">Locked during Phase 1.</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Oversight</p>
              <h3 className="text-lg font-semibold text-slate-900">Department Governance</h3>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full whitespace-nowrap">Spring 2026</span>
          </div>
          <div className="space-y-3">
            {[
              { icon: Shield, title: 'Academic Integrity Lock Status', desc: `${totalRubrics} rubric schemas. ${governance.rubrics.filter(r => r.status === 'locked').length} locked.` },
              { icon: Presentation, title: 'Active Evaluation Boards', desc: `${activeCommittees.length} active committees with ${totalRubrics} rubrics.` },
              { icon: Users, title: 'FYP Groups Overview', desc: `${stats?.totalGroups || 0} groups registered. ${stats?.activeFaculty || 0} faculty supervising.` },
            ].map(gov => (
              <div key={gov.title} className="flex items-start gap-4 p-4 rounded-xl bg-blue-50/40 border border-line">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex-center flex-shrink-0 mt-0.5 text-blue-600">
                  <gov.icon size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900 mb-0.5">{gov.title}</div>
                  <p className="text-xs text-slate-500 leading-relaxed">{gov.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 flex flex-col">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Quick Access</p>
            <h3 className="text-lg font-semibold text-slate-900 mb-5">Executive Portals</h3>
          </div>
          <div className="space-y-2 flex-1">
            {[
              { label: 'Students', icon: Users, path: '/hod/students', desc: 'Manage student records' },
              { label: 'Faculty', icon: UserCheck, path: '/hod/faculty', desc: 'View faculty profiles' },
              { label: 'Escalated Grievances', icon: Gavel, path: '/hod/escalations', desc: 'Resolve escalated issues' },
              { label: 'Faculty Workload', icon: Presentation, path: '/hod/faculty-oversight', desc: 'Review supervision load', locked: true },
              { label: 'Oversight', icon: Landmark, path: '/hod/governance', desc: 'Manage committees', locked: true },
              { label: 'FYP Analytics', icon: LineChart, path: '/hod/analytics', desc: 'View insights', locked: true },
            ].map(link => (
              <div key={link.label} onClick={() => { if (!link.locked) navigate(link.path); }} className={`flex items-center justify-between p-3 rounded-xl border border-line transition-all ${link.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-50 hover:border-blue-200 group'}`} title={link.locked ? 'Locked during Phase 1' : link.label}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex-center flex-shrink-0 ${link.locked ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600 group-hover:scale-105 transition-transform'}`}>
                    <link.icon size={14} />
                  </div>
                  <div>
                    <div className={`text-xs font-semibold ${link.locked ? 'text-gray-400' : 'text-slate-900 group-hover:text-blue-700 transition-colors'}`}>{link.label}</div>
                  </div>
                </div>
                {link.locked ? <Lock size={12} className="text-gray-300" /> : <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HodDashboard;
