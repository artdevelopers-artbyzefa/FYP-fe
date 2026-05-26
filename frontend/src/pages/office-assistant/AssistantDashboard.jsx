import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getOfficeDashboardStats } from '../../services/office-assistant.service';

const AssistantDashboard = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getOfficeDashboardStats().then((res) => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <>
      {/* Welcome Banner */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-[fadeIn_0.4s_ease-out]" style={{ background: 'linear-gradient(135deg, #2B3990, #1E3A8A)' }}>
        <div className="text-white">
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Good day, {user?.name || 'Assistant'}!</h1>
          <p className="text-sm text-white/80 font-medium max-w-2xl leading-relaxed">Here is the administrative overview of the FYP Management System for the Spring 2026 academic session. All portals and committee assignments are active.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => navigate('/office-assistant/users')} className="bg-white text-primary hover:bg-gray-50 px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
            <i className="fas fa-user-plus"></i> Add User
          </button>
          <button onClick={() => navigate('/office-assistant/students')} className="bg-secondary hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
            <i className="fas fa-graduation-cap"></i> View Students
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-secondary flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-users"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Total Users</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-800">{stats ? stats.totalUsers : '...'}</span>
              <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-lg">{stats ? stats.activeUsers : ''}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-user-graduate"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">FYP Students</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-800">{stats ? stats.fypStudents : '...'}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">{stats ? stats.studentsStatus : ''}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-project-diagram"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Active Projects</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-800">{stats ? stats.activeProjects : '...'}</span>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg">{stats ? stats.projectsStatus : ''}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-users-viewfinder"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Committees</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-gray-800">{stats ? stats.committees : '...'}</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">{stats ? stats.committeesStatus : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-gray-800">System Workflow Quick Access</h3>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">Manage core database entities and committee configurations</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div onClick={() => navigate('/office-assistant/users')} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-secondary hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col justify-between group">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-secondary flex items-center justify-center font-bold"><i className="fas fa-users-gear"></i></div>
                <i className="fas fa-arrow-right text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-base mb-1">User Account Management</h4>
                <p className="text-xs text-gray-500 font-medium">Assign roles, manage account locks, and register new administrative or academic users.</p>
              </div>
            </div>
            <div onClick={() => navigate('/office-assistant/students')} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-secondary hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col justify-between group">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold"><i className="fas fa-user-graduate"></i></div>
                <i className="fas fa-arrow-right text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-base mb-1">Student Records & Bulk Messaging</h4>
                <p className="text-xs text-gray-500 font-medium">Search registration numbers, view read-only profiles, and dispatch milestone alerts.</p>
              </div>
            </div>
            <div onClick={() => navigate('/office-assistant/proposal-committee')} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-secondary hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col justify-between group">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold"><i className="fas fa-users"></i></div>
                <i className="fas fa-arrow-right text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-base mb-1">Proposal Committees</h4>
                <p className="text-xs text-gray-500 font-medium">Configure evaluation boards with AI-assisted faculty interest and availability suggestions.</p>
              </div>
            </div>
            <div onClick={() => navigate('/office-assistant/eval-committee')} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-secondary hover:bg-blue-50/30 transition-all cursor-pointer flex flex-col justify-between group">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold"><i className="fas fa-layer-group"></i></div>
                <i className="fas fa-arrow-right text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-base mb-1">FYP Evaluation Boards</h4>
                <p className="text-xs text-gray-500 font-medium">Manage FYP-1 & FYP-2 boards, enforce 50% member rotation, and monitor evaluation locks.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8">
          <h3 className="text-lg font-black text-gray-800 mb-6">Recent Administrative Actions</h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-start pb-4 border-b border-gray-50">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-secondary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"><i className="fas fa-user-edit"></i></div>
              <div>
                <div className="text-xs font-bold text-gray-800">Role Assigned: Dr. Ali Hassan</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Assigned to Proposal Evaluation Committee (PEC-1).</div>
                <div className="text-[10px] text-gray-400 font-bold mt-1">Today, 10:15 AM</div>
              </div>
            </div>
            <div className="flex gap-4 items-start pb-4 border-b border-gray-50">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"><i className="fas fa-file-upload"></i></div>
              <div>
                <div className="text-xs font-bold text-gray-800">Thesis Template v2.4 Uploaded</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Replaced older version in FYP Content Management repository.</div>
                <div className="text-[10px] text-gray-400 font-bold mt-1">Yesterday, 04:30 PM</div>
              </div>
            </div>
            <div className="flex gap-4 items-start pb-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"><i className="fas fa-calendar-check"></i></div>
              <div>
                <div className="text-xs font-bold text-gray-800">Meeting Schedule Published</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Published FYP-1 mid-term defense schedule for 24 groups.</div>
                <div className="text-[10px] text-gray-400 font-bold mt-1">May 15, 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssistantDashboard;
