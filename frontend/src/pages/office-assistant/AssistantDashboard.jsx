import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getOfficeDashboardStats } from '../../services/office-assistant.service';
import { ArrowRight, CalendarCheck, FileUp, GitBranch, GraduationCap, Layers, UserPen, UserPlus, Users, FileSignature, Star, Loader2 } from 'lucide-react';

const iconMap = {
  FileUp, UserPen, UserPlus, FileSignature, CalendarCheck, Star
};

const AssistantDashboard = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOfficeDashboardStats().then((res) => setStats(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const actions = stats?.recentActions || [];

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
        {loading
          ? Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="rounded-2xl border p-4 md:p-5 animate-pulse">
                <div className="skeleton h-8 w-16 mb-2" />
                <div className="skeleton h-3 w-24" />
              </div>
            ))
          : <>
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
        </>}
      </div>

      {/* Quick Navigation & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loading
          ? <>
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8 animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                  <div className="skeleton w-10 h-10 rounded-xl" />
                  <div className="space-y-2">
                    <div className="skeleton h-5 w-48" />
                    <div className="skeleton h-3 w-64" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white border border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <div className="skeleton w-10 h-10 rounded-xl" />
                        <div className="skeleton w-5 h-5 rounded" />
                      </div>
                      <div className="skeleton h-4 w-32 mb-2" />
                      <div className="skeleton h-3 w-full" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8 animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                  <div className="skeleton w-10 h-10 rounded-xl" />
                  <div className="space-y-2">
                    <div className="skeleton h-5 w-32" />
                    <div className="skeleton h-3 w-40" />
                  </div>
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="flex gap-4 items-start pb-4 border-b border-gray-100">
                      <div className="skeleton w-8 h-8 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="skeleton h-3 w-full" />
                        <div className="skeleton h-3 w-3/4" />
                        <div className="skeleton h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          : <>
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
            {actions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" />
                <p className="text-xs font-medium">No recent activity yet.</p>
              </div>
            ) : (
              actions.map((a, i) => {
                const Icon = iconMap[a.icon] || CalendarCheck;
                return (
                  <div key={i} className={`flex gap-4 items-start ${i < actions.length - 1 ? 'pb-4 border-b border-gray-100' : 'pb-2'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
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
        </>}
      </div>
    </div>
  );
};

export default AssistantDashboard;
