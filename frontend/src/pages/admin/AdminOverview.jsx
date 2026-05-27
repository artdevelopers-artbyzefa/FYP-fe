import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getAdminStats } from '../../services/admin.service';
import { ArrowRight, History, Server, Shield, UserCog, UserPlus, Users, Wrench } from 'lucide-react';

export default function AdminOverview() {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [stats, setStats] = useState({});

  useEffect(() => {
    getAdminStats().then(setStats);
  }, []);

  return (
    <div className="animate-in fade-in slide-in- duration-300">
      {/* Banner */}
      <div className="rounded-[2rem] p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm border border-black"
        >
        <div className="text-white">
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">System Administration Console</h1>
          <p className="text-sm text-white/80 font-medium max-w-2xl leading-relaxed">
            Welcome, {user.name}. Manage user credentials, configure role-based access control (RBAC), monitor system audit logs, and maintain database backups for the FYP Portal.
          </p>
        </div>
        <button onClick={() => navigate('/admin-dashboard/users')} className="bg-white hover:bg-white text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-black">
          <UserPlus className="w-4 h-4" /> Create User Account
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-black p-6 shadow-sm flex items-center gap-5 hover:border-blue-600 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><Users className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-black uppercase tracking-wider mb-1 truncate">Registered Users</div>
            <div className="flex items-baseline justify-between"><span className="text-3xl font-black text-black">{stats.totalUsers}</span><span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg">Active</span></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-black p-6 shadow-sm flex items-center gap-5 hover:border-blue-600 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><Shield className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-black uppercase tracking-wider mb-1 truncate">Active Roles</div>
            <div className="flex items-baseline justify-between"><span className="text-3xl font-black text-black">{stats.activeRoles}</span><span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg">RBAC</span></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-black p-6 shadow-sm flex items-center gap-5 hover:border-blue-600 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><History className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-black uppercase tracking-wider mb-1 truncate">Audit Entries</div>
            <div className="flex items-baseline justify-between"><span className="text-3xl font-black text-black">{stats.auditLogEntries}</span><span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg">Indexed</span></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-black p-6 shadow-sm flex items-center gap-5 hover:border-blue-600 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><Server className="w-4 h-4" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-black uppercase tracking-wider mb-1 truncate">System Health</div>
            <div className="flex items-baseline justify-between"><span className="text-3xl font-black text-black">{stats.systemHealth}</span><span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg">Optimal</span></div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div onClick={() => navigate('/admin-dashboard/users')} className="bg-white p-6 rounded-2xl border border-black shadow-sm hover:border-blue-600 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold"><UserCog className="w-4 h-4" /></div>
            <ArrowRight className="text-black group-hover:text-blue-600 transition-all" />
          </div>
          <h3 className="font-bold text-black text-base mb-1">User Accounts</h3><p className="text-xs text-black font-medium">Create credentials, manage profiles, trigger resets.</p>
        </div>
        <div onClick={() => navigate('/admin-dashboard/rbac')} className="bg-white p-6 rounded-2xl border border-black shadow-sm hover:border-blue-600 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold"><Shield className="w-4 h-4" /></div>
            <ArrowRight className="text-black group-hover:text-blue-600 transition-all" />
          </div>
          <h3 className="font-bold text-black text-base mb-1">Role Checklists</h3><p className="text-xs text-black font-medium">Configure RBAC permissions.</p>
        </div>
        <div onClick={() => navigate('/admin-dashboard/audit')} className="bg-white p-6 rounded-2xl border border-black shadow-sm hover:border-blue-600 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold"><History className="w-4 h-4" /></div>
            <ArrowRight className="text-black group-hover:text-blue-600 transition-all" />
          </div>
          <h3 className="font-bold text-black text-base mb-1">Audit Logs</h3><p className="text-xs text-black font-medium">System-wide event logging.</p>
        </div>
        <div onClick={() => navigate('/admin-dashboard/maintenance')} className="bg-white p-6 rounded-2xl border border-black shadow-sm hover:border-blue-600 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold"><Wrench className="w-4 h-4" /></div>
            <ArrowRight className="text-black group-hover:text-blue-600 transition-all" />
          </div>
          <h3 className="font-bold text-black text-base mb-1">Maintenance</h3><p className="text-xs text-black font-medium">Database backups, cache clearing.</p>
        </div>
      </div>
    </div>
  );
}
