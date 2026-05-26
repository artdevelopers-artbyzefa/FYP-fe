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
    <>
      {/* Welcome Banner */}
      <div className="bg-white rounded-[2rem] border border-black shadow-sm p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-[fadeIn_0.4s_ease-out]" >
        <div className="text-white">
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Good day, {user?.name || 'Assistant'}!</h1>
          <p className="text-sm text-white/80 font-medium max-w-2xl leading-relaxed">Here is the administrative overview of the FYP Management System for the Spring 2026 academic session. All portals and committee assignments are active.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => navigate('/office-assistant/users')} className="bg-white text-black hover:bg-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
            <UserPlus className="w-4 h-4" /> Add User
          </button>
          <button onClick={() => navigate('/office-assistant/students')} className="bg-white hover:bg-black text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
            <GraduationCap className="w-4 h-4" /> View Students
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-black p-6 shadow-sm flex items-center gap-5 hover:border-black transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><Users className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-black uppercase tracking-wider mb-1 truncate">Total Users</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-black">{stats ? stats.totalUsers : '...'}</span>
              <span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg">{stats ? stats.activeUsers : ''}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-black p-6 shadow-sm flex items-center gap-5 hover:border-black transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><GraduationCap className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-black uppercase tracking-wider mb-1 truncate">FYP Students</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-black">{stats ? stats.fypStudents : '...'}</span>
              <span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg">{stats ? stats.studentsStatus : ''}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-black p-6 shadow-sm flex items-center gap-5 hover:border-black transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><GitBranch className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-black uppercase tracking-wider mb-1 truncate">Active Projects</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-black">{stats ? stats.activeProjects : '...'}</span>
              <span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg">{stats ? stats.projectsStatus : ''}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-black p-6 shadow-sm flex items-center gap-5 hover:border-black transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><Users className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-black uppercase tracking-wider mb-1 truncate">Committees</div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-black">{stats ? stats.committees : '...'}</span>
              <span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg">{stats ? stats.committeesStatus : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-black shadow-sm p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6 border-b border-black pb-4">
            <div>
              <h3 className="text-lg font-black text-black">System Workflow Quick Access</h3>
              <p className="text-xs text-black mt-0.5 font-medium">Manage core database entities and committee configurations</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div onClick={() => navigate('/office-assistant/users')} className="p-5 rounded-2xl bg-white border border-black hover:border-black hover:bg-white/30 transition-all cursor-pointer flex flex-col justify-between group">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold"><Users className="w-4 h-4" /></div>
                <ArrowRight className="text-black group-hover:text-black group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h4 className="font-bold text-black text-base mb-1">User Account Management</h4>
                <p className="text-xs text-black font-medium">Assign roles, manage account locks, and register new administrative or academic users.</p>
              </div>
            </div>
            <div onClick={() => navigate('/office-assistant/students')} className="p-5 rounded-2xl bg-white border border-black hover:border-black hover:bg-white/30 transition-all cursor-pointer flex flex-col justify-between group">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold"><GraduationCap className="w-4 h-4" /></div>
                <ArrowRight className="text-black group-hover:text-black group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h4 className="font-bold text-black text-base mb-1">Student Records & Bulk Messaging</h4>
                <p className="text-xs text-black font-medium">Search registration numbers, view read-only profiles, and dispatch milestone alerts.</p>
              </div>
            </div>
            <div onClick={() => navigate('/office-assistant/proposal-committee')} className="p-5 rounded-2xl bg-white border border-black hover:border-black hover:bg-white/30 transition-all cursor-pointer flex flex-col justify-between group">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold"><Users className="w-4 h-4" /></div>
                <ArrowRight className="text-black group-hover:text-black group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h4 className="font-bold text-black text-base mb-1">Proposal Committees</h4>
                <p className="text-xs text-black font-medium">Configure evaluation boards with AI-assisted faculty interest and availability suggestions.</p>
              </div>
            </div>
            <div onClick={() => navigate('/office-assistant/eval-committee')} className="p-5 rounded-2xl bg-white border border-black hover:border-black hover:bg-white/30 transition-all cursor-pointer flex flex-col justify-between group">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold"><Layers className="w-4 h-4" /></div>
                <ArrowRight className="text-black group-hover:text-black group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h4 className="font-bold text-black text-base mb-1">FYP Evaluation Boards</h4>
                <p className="text-xs text-black font-medium">Manage FYP-1 & FYP-2 boards, enforce 50% member rotation, and monitor evaluation locks.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-black shadow-sm p-6 sm:p-8">
          <h3 className="text-lg font-black text-black mb-6">Recent Administrative Actions</h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-start pb-4 border-b border-black">
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"><UserPen className="w-4 h-4" /></div>
              <div>
                <div className="text-xs font-bold text-black">Role Assigned: Dr. Ali Hassan</div>
                <div className="text-[11px] text-black mt-0.5">Assigned to Proposal Evaluation Committee (PEC-1).</div>
                <div className="text-[10px] text-black font-bold mt-1">Today, 10:15 AM</div>
              </div>
            </div>
            <div className="flex gap-4 items-start pb-4 border-b border-black">
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"><FileUp className="w-4 h-4" /></div>
              <div>
                <div className="text-xs font-bold text-black">Thesis Template v2.4 Uploaded</div>
                <div className="text-[11px] text-black mt-0.5">Replaced older version in FYP Content Management repository.</div>
                <div className="text-[10px] text-black font-bold mt-1">Yesterday, 04:30 PM</div>
              </div>
            </div>
            <div className="flex gap-4 items-start pb-2">
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"><CalendarCheck className="w-4 h-4" /></div>
              <div>
                <div className="text-xs font-bold text-black">Meeting Schedule Published</div>
                <div className="text-[11px] text-black mt-0.5">Published FYP-1 mid-term defense schedule for 24 groups.</div>
                <div className="text-[10px] text-black font-bold mt-1">May 15, 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssistantDashboard;
