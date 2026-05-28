import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getOfficeDashboardStats } from '../../services/office-assistant.service';
import { ArrowRight, CalendarCheck, FileUp, GitBranch, GraduationCap, Layers, UserPen, UserPlus, Users } from 'lucide-react';

const AssistantDashboard = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getOfficeDashboardStats().then((res) => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">Good day, {user?.name || 'Assistant'}!</h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">Here is the administrative overview of the FYP Management System. All portals and committee assignments are active.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => navigate('/office-assistant/users')} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-secondary transition-all cursor-pointer shadow-sm">
            <UserPlus className="w-4 h-4" /> Add User
          </button>
          <button onClick={() => navigate('/office-assistant/students')} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-secondary transition-all cursor-pointer shadow-sm">
            <GraduationCap className="w-4 h-4" /> View Students
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4 md:p-5 text-center lg:text-left">
          <div className="text-2xl md:text-3xl font-black text-blue-600 mb-1">{stats?.totalUsers || 0}</div>
          <div className="text-[9px] md:text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-tight">Total Users</div>
        </div>
        <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4 md:p-5 text-center lg:text-left">
          <div className="text-2xl md:text-3xl font-black text-emerald-600 mb-1">{stats?.fypStudents || 0}</div>
          <div className="text-[9px] md:text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-tight">FYP Students</div>
        </div>
        <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-4 md:p-5 text-center lg:text-left">
          <div className="text-2xl md:text-3xl font-black text-indigo-600 mb-1">{stats?.activeProjects || 0}</div>
          <div className="text-[9px] md:text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-tight">Active Projects</div>
        </div>
        <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4 md:p-5 text-center lg:text-left">
          <div className="text-2xl md:text-3xl font-black text-amber-600 mb-1">{stats?.committees || 0}</div>
          <div className="text-[9px] md:text-[10px] font-bold text-amber-400 uppercase tracking-widest leading-tight">Committees</div>
        </div>
      </div>

      {/* Quick Navigation & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black text-gray-800">System Workflow Quick Access</h3>
              <p className="text-[10px] md:text-sm text-gray-400 font-medium">Manage core database entities and committee configurations</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div onClick={() => navigate('/office-assistant/users')} className="p-5 rounded-2xl bg-white border border-gray-100 hover:border-secondary hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary"><Users className="w-4 h-4" /></div>
                <ArrowRight className="text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">User Account Management</h4>
                <p className="text-xs text-gray-400 font-medium">Assign roles, manage account locks, and register new administrative or academic users.</p>
              </div>
            </div>
            <div onClick={() => navigate('/office-assistant/students')} className="p-5 rounded-2xl bg-white border border-gray-100 hover:border-secondary hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary"><GraduationCap className="w-4 h-4" /></div>
                <ArrowRight className="text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">Student Records & Bulk Messaging</h4>
                <p className="text-xs text-gray-400 font-medium">Search registration numbers, view read-only profiles, and dispatch milestone alerts.</p>
              </div>
            </div>
            <div onClick={() => navigate('/office-assistant/proposal-committee')} className="p-5 rounded-2xl bg-white border border-gray-100 hover:border-secondary hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary"><Users className="w-4 h-4" /></div>
                <ArrowRight className="text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">Proposal Committees</h4>
                <p className="text-xs text-gray-400 font-medium">Configure evaluation boards with AI-assisted faculty interest and availability suggestions.</p>
              </div>
            </div>
            <div onClick={() => navigate('/office-assistant/eval-committee')} className="p-5 rounded-2xl bg-white border border-gray-100 hover:border-secondary hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary"><Layers className="w-4 h-4" /></div>
                <ArrowRight className="text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">FYP Evaluation Boards</h4>
                <p className="text-xs text-gray-400 font-medium">Manage FYP-1 & FYP-2 boards, enforce 50% member rotation, and monitor evaluation locks.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black text-gray-800">Recent Actions</h3>
              <p className="text-[10px] md:text-sm text-gray-400 font-medium">Latest administrative activities</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 items-start pb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"><UserPen className="w-4 h-4" /></div>
              <div>
                <div className="text-xs font-bold text-gray-800">Role Assigned: Dr. Ali Hassan</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Assigned to Proposal Evaluation Committee (PEC-1).</div>
                <div className="text-[10px] text-gray-400 font-bold mt-1">Today, 10:15 AM</div>
              </div>
            </div>
            <div className="flex gap-4 items-start pb-4 border-b border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"><FileUp className="w-4 h-4" /></div>
              <div>
                <div className="text-xs font-bold text-gray-800">Thesis Template v2.4 Uploaded</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Replaced older version in FYP Content Management repository.</div>
                <div className="text-[10px] text-gray-400 font-bold mt-1">Yesterday, 04:30 PM</div>
              </div>
            </div>
            <div className="flex gap-4 items-start pb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"><CalendarCheck className="w-4 h-4" /></div>
              <div>
                <div className="text-xs font-bold text-gray-800">Meeting Schedule Published</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Published FYP-1 mid-term defense schedule for 24 groups.</div>
                <div className="text-[10px] text-gray-400 font-bold mt-1">May 15, 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantDashboard;
