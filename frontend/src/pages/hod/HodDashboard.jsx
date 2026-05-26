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

  return (
    <>
      {/* Executive Welcome Banner */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-[fadeIn_0.4s_ease-out]" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
        <div className="text-white">
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Departmental FYP Executive Oversight</h1>
          <p className="text-sm text-white/80 font-medium max-w-2xl leading-relaxed">
            Welcome, {user.name}. Monitor overall academic compliance, resolve escalated student grievances, and review faculty workload distribution across the Computer Science department.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => navigate('/hod/escalations')} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
            <i className="fas fa-gavel"></i> Pending Escalations (1)
          </button>
        </div>
      </div>

      {/* Executive Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-secondary flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-users"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Total FYP Groups</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-800">{stats ? stats.totalGroups : '...'}</span>
              <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-lg">100% Assigned</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-gavel"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Escalated Grievances</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-800">{stats ? stats.escalatedGrievances : '...'}</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">Requires Action</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-chalkboard-teacher"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Active Faculty</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-800">{stats ? stats.activeFaculty : '...'}</span>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg">Optimal Load</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-check-circle"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">CLO Attainment Avg</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-800">{stats ? stats.cloAttainmentAvg : '...'}</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">Satisfactory</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-50">
            <h3 className="text-base font-black text-gray-800">Department Governance Summary</h3>
            <span className="text-xs font-bold text-secondary bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">Spring 2026</span>
          </div>
          <div className="space-y-4 text-xs font-medium text-gray-600 leading-relaxed">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-4">
              <i className="fas fa-shield-alt text-primary text-xl mt-0.5"></i>
              <div><span className="block font-black text-gray-900 mb-1 text-sm">Academic Integrity Lock Status</span><p>All 4 evaluation committees have active padlock protection on their rubric schemas. No unauthorized structural modifications detected.</p></div>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-4">
              <i className="fas fa-tasks text-success text-xl mt-0.5"></i>
              <div><span className="block font-black text-gray-900 mb-1 text-sm">Milestone Defense Completion</span><p>The 10% project specification defense has been completed across all panels. Overall student attendance and deliverable compliance stands at 98%.</p></div>
            </div>
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-gray-800 mb-6 pb-3 border-b border-gray-50">Executive Portals</h3>
            <div className="space-y-3">
              <div onClick={() => navigate('/hod/escalations')} className="p-3.5 rounded-xl bg-gray-50 hover:bg-amber-50 hover:text-amber-700 border border-gray-100 hover:border-amber-200 transition-all cursor-pointer flex items-center justify-between font-bold text-xs group">
                <div className="flex items-center gap-3"><i className="fas fa-gavel text-amber-600 text-sm w-5"></i><span>Escalated Grievances</span></div>
                <i className="fas fa-chevron-right text-gray-300 group-hover:text-amber-600 transition-all"></i>
              </div>
              <div onClick={() => navigate('/hod/faculty-oversight')} className="p-3.5 rounded-xl bg-gray-50 hover:bg-purple-50 hover:text-purple-700 border border-gray-100 hover:border-purple-200 transition-all cursor-pointer flex items-center justify-between font-bold text-xs group">
                <div className="flex items-center gap-3"><i className="fas fa-chalkboard-teacher text-purple-600 text-sm w-5"></i><span>Faculty Workload Oversight</span></div>
                <i className="fas fa-chevron-right text-gray-300 group-hover:text-purple-600 transition-all"></i>
              </div>
              <div onClick={() => navigate('/hod/governance')} className="p-3.5 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-secondary border border-gray-100 hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between font-bold text-xs group">
                <div className="flex items-center gap-3"><i className="fas fa-landmark text-secondary text-sm w-5"></i><span>Committee Governance</span></div>
                <i className="fas fa-chevron-right text-gray-300 group-hover:text-secondary transition-all"></i>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-50 text-center">
            <span className="text-[11px] text-gray-400 font-bold">CUI Abbottabad Portal v4.0</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default HodDashboard;
