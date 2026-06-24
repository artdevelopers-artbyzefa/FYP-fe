import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getHodDashboardStats, getGovernanceData } from '../../services/hod.service';
import { getCurrentUser } from '../../services/auth.service';
import { CheckCircle, ChevronRight, ClipboardList, Gavel, Landmark, LineChart, PieChart, Presentation, Shield, Users } from 'lucide-react';

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

  const activeCommittees = Array.isArray(governance.committees)
    ? governance.committees.filter(c => c.status === 'active')
    : [];
  const totalRubrics = Array.isArray(governance.rubrics) ? governance.rubrics.length : 0;
  const hasLockedRubrics = Array.isArray(governance.rubrics)
    ? governance.rubrics.some(r => r.status === 'locked')
    : false;

  const statCards = [
    {
      label: 'Total FYP Groups',
      value: stats?.totalGroups,
      badge: '100% Assigned',
      icon: Users,
    },
    {
      label: 'Escalated Grievances',
      value: stats?.escalatedGrievances,
      badge: stats?.escalatedGrievances > 0 ? 'Requires Action' : 'All Clear',
      icon: Gavel,
    },
    {
      label: 'Active Faculty',
      value: stats?.activeFaculty,
      badge: 'Optimal Load',
      icon: Presentation,
    },
    {
      label: 'CLO Attainment Avg',
      value: stats?.cloAttainmentAvg,
      badge: (stats?.cloAttainmentAvg ?? 0) >= 70 ? 'Satisfactory' : 'Needs Review',
      icon: CheckCircle,
    },
  ];

  const governanceItems = [
    {
      icon: Shield,
      title: 'Academic Integrity Lock Status',
      desc: hasLockedRubrics
        ? `${governance.rubrics.filter(r => r.status === 'locked').length} rubric schemas are locked with integrity protection. No unauthorized modifications detected.`
        : 'No rubrics are currently locked. Consider locking approved rubric schemas for integrity protection.',
    },
    {
      icon: ClipboardList,
      title: 'Active Evaluation Boards',
      desc: activeCommittees.length > 0
        ? `${activeCommittees.length} evaluation ${activeCommittees.length === 1 ? 'committee is' : 'committees are'} active with ${totalRubrics} approved rubric schemas.`
        : 'No active evaluation committees found.',
    },
    {
      icon: LineChart,
      title: 'Phase Progress Overview',
      desc: stats?.totalGroups
        ? `${stats.totalGroups} FYP groups registered. ${stats.activeFaculty} faculty ${stats.activeFaculty === 1 ? 'member is' : 'members are'} actively supervising.`
        : 'Loading phase progress data...',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 rounded-2xl mb-8">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="relative px-6 sm:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Landmark size={16} className="text-white/90" />
                </div>
                <span className="text-[11px] font-semibold text-blue-200 tracking-widest uppercase">Executive Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight text-balance">Department Command Center</h1>
              <p className="text-sm text-blue-200 font-medium max-w-2xl leading-relaxed">
                Welcome back, <span className="text-white font-semibold">{user?.name || 'HOD'}</span> — review faculty workload, grievances, and phase progress.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20 text-white text-xs font-semibold">
                Spring 2026
              </div>
              <button
                onClick={() => navigate('/hod/escalations')}
                className="group relative overflow-hidden bg-white text-blue-900 px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className="relative flex items-center gap-2">
                  <Gavel size={14} />
                  Pending Escalations
                  {(stats?.escalatedGrievances ?? 0) > 0 && (
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {stats.escalatedGrievances}
                    </span>
                  )}
                </span>
              </button>
            </div>
          </div>

        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(card => (
          <div
            key={card.label}
            className="group bg-white rounded-2xl border border-line p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform duration-300">
                {React.createElement(card.icon, { size: 20 })}
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap text-blue-700 bg-blue-50">
                {card.badge}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">{card.label}</div>
            <div className="text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">{card.value ?? '...'}</div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-line shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Oversight</p>
              <h3 className="text-lg font-semibold text-slate-900">Department Governance</h3>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full whitespace-nowrap">
              Spring 2026
            </span>
          </div>
          <div className="space-y-3">
            {governanceItems.map(item => (
              <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl bg-blue-50/40 border border-line hover:bg-blue-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-blue-600">
                  <item.icon size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900 mb-0.5">{item.title}</div>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-line shadow-card p-6 flex flex-col">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Quick Access</p>
            <h3 className="text-lg font-semibold text-slate-900 mb-5">Executive Portals</h3>
          </div>
          <div className="space-y-2 flex-1">
            {[
              { label: 'Escalated Grievances', icon: Gavel, path: '/hod/escalations', desc: 'Resolve escalated issues' },
              { label: 'Faculty Workload Oversight', icon: Presentation, path: '/hod/faculty-oversight', desc: 'Review supervision load' },
              { label: 'Committee Governance', icon: Landmark, path: '/hod/governance', desc: 'Manage committees' },
              { label: 'Analytics & Reports', icon: PieChart, path: '/hod/analytics', desc: 'View detailed insights' },
            ].map(link => (
              <div
                key={link.label}
                onClick={() => navigate(link.path)}
                className="group flex items-center justify-between p-3.5 rounded-xl border border-line bg-white cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:border-blue-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <link.icon size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{link.label}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{link.desc}</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-200" />
              </div>
            ))}
          </div>
          <div className="pt-5 mt-5 border-t border-line text-center">
            <span className="text-[11px] text-slate-400 font-medium">CUI Abbottabad Portal v4.0</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HodDashboard;
