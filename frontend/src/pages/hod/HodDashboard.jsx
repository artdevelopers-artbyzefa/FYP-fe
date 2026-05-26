import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHodDashboardStats } from '../../services/hod.service';
import { getCurrentUser } from '../../services/auth.service';

const HodDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const user = getCurrentUser() || { name: 'Prof. Dr. Zafar Ali' };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getHodDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching HOD stats:', error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total FYP Groups',
      value: stats?.totalGroups,
      badge: '100% Assigned',
      badgeColor: 'text-emerald-700 bg-emerald-50',
      icon: 'fa-users',
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
    },
    {
      label: 'Escalated Grievances',
      value: stats?.escalatedGrievances,
      badge: 'Requires Action',
      badgeColor: 'text-amber-700 bg-amber-50',
      icon: 'fa-gavel',
      color: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50',
    },
    {
      label: 'Active Faculty',
      value: stats?.activeFaculty,
      badge: 'Optimal Load',
      badgeColor: 'text-purple-700 bg-purple-50',
      icon: 'fa-chalkboard-teacher',
      color: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
    },
    {
      label: 'CLO Attainment Avg',
      value: stats?.cloAttainmentAvg,
      badge: 'Satisfactory',
      badgeColor: 'text-emerald-700 bg-emerald-50',
      icon: 'fa-check-circle',
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
    },
  ];

  return (
    <>
      <div className="relative overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-lg mb-8">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <i className="fas fa-landmark text-lg text-white/90" />
                </div>
                <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Executive Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Departmental FYP Oversight</h1>
              <p className="text-sm text-white/70 font-medium max-w-2xl leading-relaxed">
                Welcome back, <span className="text-white font-bold">{user.name}</span>. Monitor academic compliance, resolve escalations, and review faculty workload distribution.
              </p>
            </div>
            <button
              onClick={() => navigate('/hod/escalations')}
              className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-amber-500/20 transition-all duration-300 flex items-center gap-3 cursor-pointer active:scale-95"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                <i className="fas fa-gavel" />
                Pending Escalations
                <span className="bg-white/20 text-white px-2.5 py-0.5 rounded-full text-xs font-bold backdrop-blur-sm">1</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${card.bgLight} flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300`}>
                <i className={`fas ${card.icon} bg-gradient-to-br ${card.color} bg-clip-text text-transparent`} />
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${card.badgeColor} whitespace-nowrap`}>
                {card.badge}
              </span>
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{card.label}</div>
            <div className="text-3xl font-black text-gray-800 tabular-nums">{card.value ?? '...'}</div>
            <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${card.color} transition-all duration-500`} style={{ width: '70%' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Governance Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-black text-gray-800">Department Governance</h3>
            <span className="text-xs font-bold text-secondary bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100/50">Spring 2026</span>
          </div>
          <div className="space-y-3">
            {[
              { icon: 'fa-shield-alt', color: 'text-blue-600', bg: 'bg-blue-50', title: 'Academic Integrity Lock Status', desc: 'All 4 evaluation committees have active padlock protection on their rubric schemas. No unauthorized modifications detected.' },
              { icon: 'fa-tasks', color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Milestone Defense Completion', desc: 'The 10% project specification defense completed across all panels. Student attendance and deliverable compliance at 98%.' },
              { icon: 'fa-chart-line', color: 'text-purple-600', bg: 'bg-purple-50', title: 'Phase Progress Overview', desc: 'All groups have successfully passed the proposal phase. Mid-progress review scheduled for next week across 4 evaluation panels.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <i className={`fas ${item.icon} ${item.color} text-base`} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-900 mb-1">{item.title}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Portals */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <h3 className="text-base font-black text-gray-800 mb-6">Executive Portals</h3>
          <div className="space-y-2 flex-1">
            {[
              { label: 'Escalated Grievances', icon: 'fa-gavel', color: 'text-amber-600', hover: 'hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700', chevron: 'text-amber-600', path: '/hod/escalations' },
              { label: 'Faculty Workload Oversight', icon: 'fa-chalkboard-teacher', color: 'text-purple-600', hover: 'hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700', chevron: 'text-purple-600', path: '/hod/faculty-oversight' },
              { label: 'Committee Governance', icon: 'fa-landmark', color: 'text-blue-600', hover: 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700', chevron: 'text-blue-600', path: '/hod/governance' },
              { label: 'Analytics & Reports', icon: 'fa-chart-pie', color: 'text-emerald-600', hover: 'hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700', chevron: 'text-emerald-600', path: '/hod/analytics' },
            ].map((link) => (
              <div
                key={link.label}
                onClick={() => navigate(link.path)}
                className={`flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-white cursor-pointer transition-all duration-200 group ${link.hover}`}
              >
                <div className="flex items-center gap-3">
                  <i className={`fas ${link.icon} ${link.color} text-sm w-5 text-center`} />
                  <span className="text-xs font-bold text-gray-700 group-hover:text-inherit transition-colors">{link.label}</span>
                </div>
                <i className="fas fa-chevron-right text-gray-300 group-hover:text-inherit text-xs transition-colors" />
              </div>
            ))}
          </div>
          <div className="pt-5 mt-5 border-t border-gray-100 text-center">
            <span className="text-[11px] text-gray-400 font-bold tracking-wider">CUI Abbottabad Portal v4.0</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default HodDashboard;
