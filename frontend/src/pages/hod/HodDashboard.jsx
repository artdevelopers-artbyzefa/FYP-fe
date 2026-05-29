import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHodDashboardStats } from '../../services/hod.service';
import { getCurrentUser } from '../../services/auth.service';
import { CheckCircle, ChevronRight, ClipboardList, Gavel, Landmark, LineChart, PieChart, Presentation, Shield, Users } from 'lucide-react';

const HodDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const user = getCurrentUser() ?? null;

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
      badgeColor: 'text-blue-600',
      icon: Users,
      color: '',
      bgLight: 'bg-white',
    },
    {
      label: 'Escalated Grievances',
      value: stats?.escalatedGrievances,
      badge: 'Requires Action',
      badgeColor: 'text-blue-600',
      icon: Gavel,
      color: '',
      bgLight: 'bg-white',
    },
    {
      label: 'Active Faculty',
      value: stats?.activeFaculty,
      badge: 'Optimal Load',
      badgeColor: 'text-blue-600',
      icon: Presentation,
      color: '',
      bgLight: 'bg-white',
    },
    {
      label: 'CLO Attainment Avg',
      value: stats?.cloAttainmentAvg,
      badge: 'Satisfactory',
      badgeColor: 'text-blue-600',
      icon: CheckCircle,
      color: '',
      bgLight: 'bg-white',
    },
  ];

  return (
    <>
      <div className="relative overflow-hidden bg-white rounded-3xl border border-black shadow-lg mb-8">
        <div className="absolute inset-0"  />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Landmark className="text-lg text-white/90" />
                </div>
                <span className="text-xs font-bold text-white/50 tracking-widest">Executive Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Departmental FYP Oversight</h1>
              <p className="text-sm text-white/70 font-medium max-w-2xl leading-relaxed">
                Welcome back, <span className="text-white font-bold">{user.name}</span>. Monitor academic compliance, resolve escalations, and review faculty workload distribution.
              </p>
            </div>
            <button
              onClick={() => navigate('/hod/escalations')}
              className="group relative overflow-hidden bg-gradient- hover: hover: text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all duration-300 flex items-center gap-3 cursor-pointer active:scale-95"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                <Gavel className="w-4 h-4" />
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
            className="group bg-white rounded-2xl border border-black p-6 shadow-sm hover:shadow-lg hover:border-blue-600 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${card.bgLight} flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300`}>
                {React.createElement(card.icon, { className: "w-4 h-4" })}
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${card.badgeColor} whitespace-nowrap`}>
                {card.badge}
              </span>
            </div>
            <div className="text-xs font-bold text-black tracking-wider mb-1">{card.label}</div>
            <div className="text-3xl font-black text-black tabular-nums">{card.value ?? '...'}</div>
            <div className="mt-3 h-1.5 rounded-full bg-white overflow-hidden">
              <div className={`h-full rounded-full ${card.color} transition-all duration-500`} style={{ width: '70%' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Governance Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-black shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-black text-black">Department Governance</h3>
            <span className="text-xs font-bold text-black bg-white px-3 py-1.5 rounded-xl border border-black/50">Spring 2026</span>
          </div>
          <div className="space-y-3">
            {[
              { icon: Shield, color: 'text-blue-600', bg: 'bg-white', title: 'Academic Integrity Lock Status', desc: 'All 4 evaluation committees have active padlock protection on their rubric schemas. No unauthorized modifications detected.' },
              { icon: ClipboardList, color: 'text-blue-600', bg: 'bg-white', title: 'Milestone Defense Completion', desc: 'The 10% project specification defense completed across all panels. Student attendance and deliverable compliance at 98%.' },
              { icon: LineChart, color: 'text-blue-600', bg: 'bg-white', title: 'Phase Progress Overview', desc: 'All groups have successfully passed the proposal phase. Mid-progress review scheduled for next week across 4 evaluation panels.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl bg-white/50 border border-black hover:bg-white transition-colors">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {React.createElement(item.icon, { className: "w-4 h-4" })}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-black mb-1">{item.title}</div>
                  <p className="text-xs text-black leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Portals */}
        <div className="bg-white rounded-2xl border border-black shadow-sm p-6 flex flex-col">
          <h3 className="text-base font-black text-black mb-6">Executive Portals</h3>
          <div className="space-y-2 flex-1">
            {[
              { label: 'Escalated Grievances', icon: Gavel, color: 'text-blue-600', hover: 'hover:text-blue-600 hover:bg-white hover:border-blue-600', chevron: 'text-blue-600', path: '/hod/escalations' },
              { label: 'Faculty Workload Oversight', icon: Presentation, color: 'text-blue-600', hover: 'hover:text-blue-600 hover:bg-white hover:border-blue-600', chevron: 'text-blue-600', path: '/hod/faculty-oversight' },
              { label: 'Committee Governance', icon: Landmark, color: 'text-blue-600', hover: 'hover:text-blue-600 hover:bg-white hover:border-blue-600', chevron: 'text-blue-600', path: '/hod/governance' },
              { label: 'Analytics & Reports', icon: PieChart, color: 'text-blue-600', hover: 'hover:text-blue-600 hover:bg-white hover:border-blue-600', chevron: 'text-blue-600', path: '/hod/analytics' },
            ].map((link) => (
              <div
                key={link.label}
                onClick={() => navigate(link.path)}
                className={`flex items-center justify-between p-3.5 rounded-xl border border-black bg-white cursor-pointer transition-all duration-200 group ${link.hover}`}
              >
                <div className="flex items-center gap-3">
                  {React.createElement(link.icon, { className: "w-4 h-4" })}
                  <span className="text-xs font-bold text-black group-hover:text-inherit transition-colors">{link.label}</span>
                </div>
                <ChevronRight className="text-black group-hover:text-inherit text-xs transition-colors" />
              </div>
            ))}
          </div>
          <div className="pt-5 mt-5 border-t border-black text-center">
            <span className="text-[11px] text-black font-bold tracking-wider">CUI Abbottabad Portal v4.0</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default HodDashboard;

