import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getAdminStats } from '../../services/admin.service';

export default function AdminOverview() {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [stats, setStats] = useState({});

  useEffect(() => {
    getAdminStats().then(setStats);
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Banner */}
      <div className="rounded-[2rem] p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm border border-gray-100"
        style={{ background: 'linear-gradient(135deg, #111827, #374151)' }}>
        <div className="text-white">
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">System Administration Console ⚡</h1>
          <p className="text-sm text-white/80 font-medium max-w-2xl leading-relaxed">
            Welcome, {user.name}. Manage user credentials, configure role-based access control (RBAC), monitor system audit logs, and maintain database backups for the FYP Portal.
          </p>
        </div>
        <button onClick={() => navigate('/admin-dashboard/users')} className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-rose-500">
          <i className="fas fa-user-plus"></i> Create User Account
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-users"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Registered Users</div>
            <div className="flex items-baseline justify-between"><span className="text-3xl font-black text-gray-800">{stats.totalUsers}</span><span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">Active</span></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-user-shield"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Active Roles</div>
            <div className="flex items-baseline justify-between"><span className="text-3xl font-black text-gray-800">{stats.activeRoles}</span><span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg">RBAC</span></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-history"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">Audit Entries</div>
            <div className="flex items-baseline justify-between"><span className="text-3xl font-black text-gray-800">{stats.auditLogEntries}</span><span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg">Indexed</span></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><i className="fas fa-server"></i></div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">System Health</div>
            <div className="flex items-baseline justify-between"><span className="text-3xl font-black text-gray-800">{stats.systemHealth}</span><span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">Optimal</span></div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div onClick={() => navigate('/admin-dashboard/users')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold"><i className="fas fa-user-cog"></i></div>
            <i className="fas fa-arrow-right text-gray-300 group-hover:text-blue-500 transition-all"></i>
          </div>
          <h3 className="font-bold text-gray-800 text-base mb-1">User Accounts</h3><p className="text-xs text-gray-500 font-medium">Create credentials, manage profiles, trigger resets.</p>
        </div>
        <div onClick={() => navigate('/admin-dashboard/rbac')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold"><i className="fas fa-user-shield"></i></div>
            <i className="fas fa-arrow-right text-gray-300 group-hover:text-purple-500 transition-all"></i>
          </div>
          <h3 className="font-bold text-gray-800 text-base mb-1">Role Checklists</h3><p className="text-xs text-gray-500 font-medium">Configure RBAC permissions.</p>
        </div>
        <div onClick={() => navigate('/admin-dashboard/audit')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold"><i className="fas fa-history"></i></div>
            <i className="fas fa-arrow-right text-gray-300 group-hover:text-amber-500 transition-all"></i>
          </div>
          <h3 className="font-bold text-gray-800 text-base mb-1">Audit Logs</h3><p className="text-xs text-gray-500 font-medium">System-wide event logging.</p>
        </div>
        <div onClick={() => navigate('/admin-dashboard/maintenance')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold"><i className="fas fa-tools"></i></div>
            <i className="fas fa-arrow-right text-gray-300 group-hover:text-emerald-500 transition-all"></i>
          </div>
          <h3 className="font-bold text-gray-800 text-base mb-1">Maintenance</h3><p className="text-xs text-gray-500 font-medium">Database backups, cache clearing.</p>
        </div>
      </div>
    </div>
  );
}
