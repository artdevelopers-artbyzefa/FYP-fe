import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, logout } from '../../utils/app.utils';
import { 
  getAdminStats, getAdminUsers, getRbacMatrix, getAuditLogs, 
  getSystemHealth, triggerDatabaseBackup, clearApplicationCache, getAdminNotifications,
  createAdminUser, resetUserPassword, toggleUserStatus
} from '../../services/admin.service';
import { showToast as toast } from '../../components/AppToast';
import { ArrowRight, Bell, Broom, CloudDownload, Database, FileUp, History, Landmark, LogOut, Menu, Plus, RefreshCw, Search, Server, Shield, UserCog, UserPlus, Users, Wrench, X } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUserInfo() || { name: 'Tariq Mehmood', avatar: 'SA' };

  /* ── State ──────────────────────────────────────────────────────────────── */
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);

  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [rbac, setRbac] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [health, setHealth] = useState({});
  const [notifications, setNotifications] = useState([]);

  const [searchUser, setSearchUser] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [searchAudit, setSearchAudit] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const notifRef = useRef(null);

  /* ── Load data ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    getAdminStats().then(setStats);
    getAdminUsers().then(setUsers);
    getRbacMatrix().then(setRbac);
    getAuditLogs().then(setAuditLogs);
    getSystemHealth().then(setHealth);
    getAdminNotifications().then(setNotifications);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Helpers ────────────────────────────────────────────────────────────── */
  const goTo = (view) => {
    setActiveView(view);
    setMobileSidebarOpen(false);
  };

  const handleLogout = () => { logout(); };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    const res = await createAdminUser(payload);
    toast.success(res.message);
    setCreateUserOpen(false);
    e.target.reset();
  };

  const handleResetPassword = async (u) => {
    if (window.confirm(`Are you sure you want to reset password for ${u.name}?`)) {
      const res = await resetUserPassword(u.id);
      toast.success(res.message);
    }
  };

  const handleToggleStatus = async (u) => {
    if (window.confirm(`Are you sure you want to deactivate account for ${u.name}?`)) {
      const res = await toggleUserStatus(u.id);
      toast.warning(res.message || 'User account deactivated.');
    }
  };

  /* ── Nav items ──────────────────────────────────────────────────────────── */
  const navItems = [
    { id: 'dashboard',   label: 'Dashboard',             icon: Server,      section: 'System' },
    { id: 'users',       label: 'User Accounts',         icon: UserCog,    section: 'Account & RBAC' },
    { id: 'rbac',        label: 'Role Checklists',       icon: Shield, section: null },
    { id: 'audit',       label: 'System Audit Logs',     icon: History,     section: 'Security & Maintenance' },
    { id: 'maintenance', label: 'System Maintenance',    icon: Wrench,       section: null },
  ];

  const pageTitle = navItems.find(n => n.id === activeView)?.label || 'System Dashboard';
  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredUsers = users.filter(u => 
    (u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())) &&
    (roleFilter === '' || u.role === roleFilter)
  );

  const filteredAudit = auditLogs.filter(a =>
    (a.entity.toLowerCase().includes(searchAudit.toLowerCase()) || a.user.toLowerCase().includes(searchAudit.toLowerCase())) &&
    (actionFilter === '' || a.action === actionFilter)
  );

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: '#EFF6FF' }}>

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside
        id="admin-sidebar"
        style={{ backgroundColor: '#2B3990', width: sidebarCollapsed ? 68 : 256, minWidth: sidebarCollapsed ? 68 : 256 }}
        className={`flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden z-50 h-full border-r border-white/10 shadow-2xl
          fixed lg:relative
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 relative flex-shrink-0">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <Landmark className="text-white text-sm" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden transition-all duration-300">
              <div className="text-white text-sm font-black whitespace-nowrap tracking-wide">CUI ABBOTTABAD</div>
              <div className="text-white/60 text-[11px] whitespace-nowrap leading-tight font-semibold">System Administrator</div>
            </div>
          )}
          <button onClick={() => setMobileSidebarOpen(false)} className="ml-auto lg:hidden bg-transparent border-0 text-white cursor-pointer p-1 rounded-lg hover:bg-white/15 transition-colors absolute right-4">
            <X className="text-lg" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1" style={{ scrollbarWidth: 'none' }}>
          {navItems.map((item) => (
            <React.Fragment key={item.id}>
              {item.section && !sidebarCollapsed && (
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-3 mb-2 pt-4">{item.section}</div>
              )}
              <button
                onClick={() => goTo(item.id)}
                title={sidebarCollapsed ? item.label : ''}
                style={activeView === item.id ? { backgroundColor: '#2563EB' } : {}}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 text-left
                  ${activeView === item.id ? 'text-white shadow-lg font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'}
                  ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                {React.createElement(item.icon, { className: "w-4 h-4" })}
                {!sidebarCollapsed && <span className="text-sm font-medium whitespace-nowrap flex-1">{item.label}</span>}
              </button>
            </React.Fragment>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 bg-black/10 flex-shrink-0">
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-white/80 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 font-bold ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <LogOut className="text-sm w-5 text-center flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileSidebarOpen && <div onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" />}

      {/* ═══════════════ MAIN ═══════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">

        {/* TOPBAR */}
        <header className="bg-white border-b border-black px-4 md:px-6 h-16 flex items-center justify-between shadow-sm flex-shrink-0 z-30 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileSidebarOpen(true)} className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-black hover:bg-white transition-all border-0 lg:hidden flex-shrink-0 cursor-pointer">
              <Menu className="text-sm" />
            </button>
            <button onClick={() => setSidebarCollapsed(p => !p)} className="hidden lg:flex w-9 h-9 rounded-xl bg-white items-center justify-center text-black hover:bg-white transition-all border-0 flex-shrink-0 cursor-pointer">
              <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-sm`}></i>
            </button>
            <div className="min-w-0">
              <h2 className="text-base font-black leading-tight truncate" style={{ color: '#2B3990' }}>{pageTitle}</h2>
              <p className="text-[11px] text-black leading-tight hidden sm:block font-medium">COMSATS University Islamabad, Abbottabad Campus</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-black rounded-xl text-xs font-bold text-black whitespace-nowrap shadow-sm">
              <Shield className="text-black" />
              <span>System Administrator</span>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(p => !p)} className="w-9 h-9 rounded-xl bg-white border border-black flex items-center justify-center text-black hover:bg-white transition-all cursor-pointer relative">
                <Bell className="text-sm" />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-white rounded-full border-2 border-white animate-pulse"></span>}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-black overflow-hidden z-[100]">
                  <div className="p-4 bg-white border-b border-black flex items-center justify-between">
                    <span className="text-sm font-black text-black">System Notifications</span>
                    <button onClick={() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); toast.success('All notifications marked as read'); }} className="text-xs font-bold text-black hover:underline cursor-pointer">Mark all as read</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-black">
                    {notifications.length === 0 ? (
                      <p className="p-8 text-center text-xs text-black font-bold">No new notifications</p>
                    ) : notifications.map(n => (
                      <div key={n.id} className={`p-4 hover:bg-rose-50/50 transition-colors flex gap-3 items-start border-l-4 ${n.read ? 'border-transparent' : 'border-black'}`}>
                        <div className={`w-8 h-8 rounded-xl bg-${n.color}-100 text-${n.color}-700 flex items-center justify-center text-xs flex-shrink-0 mt-0.5`}>
                          <i className={`fas fa-${n.icon}`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-black">{n.title}</div>
                          <div className="text-[11px] text-black mt-0.5">{n.body}</div>
                          <div className="text-[10px] text-black mt-1 font-bold">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-white border-t border-black text-center">
                    <button className="text-xs font-bold text-black hover:text-black transition-colors cursor-pointer">View All Notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-white rounded-xl cursor-pointer border border-black hover:bg-white hover:border-black transition-all">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black text-xs font-bold shadow-sm flex-shrink-0">
                {user.avatar || 'SA'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-black leading-tight truncate max-w-28">{user.name}</div>
                <div className="text-[10px] text-black leading-tight font-bold">SysAdmin</div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full">

            {/* ── VIEW: DASHBOARD ── */}
            {activeView === 'dashboard' && (
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
                  <button onClick={() => goTo('users')} className="bg-white hover:bg-white text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-black">
                    <UserPlus className="w-4 h-4" /> Create User Account
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                  <div className="bg-white rounded-2xl border border-black p-6 shadow-sm flex items-center gap-5 hover:border-black transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><Users className="w-4 h-4" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-black uppercase tracking-wider mb-1 truncate">Registered Users</div>
                      <div className="flex items-baseline justify-between"><span className="text-3xl font-black text-black">{stats.totalUsers}</span><span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg">Active</span></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-black p-6 shadow-sm flex items-center gap-5 hover:border-black transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><Shield className="w-4 h-4" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-black uppercase tracking-wider mb-1 truncate">Active Roles</div>
                      <div className="flex items-baseline justify-between"><span className="text-3xl font-black text-black">{stats.activeRoles}</span><span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg">RBAC</span></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-black p-6 shadow-sm flex items-center gap-5 hover:border-black transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><History className="w-4 h-4" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-black uppercase tracking-wider mb-1 truncate">Audit Entries</div>
                      <div className="flex items-baseline justify-between"><span className="text-3xl font-black text-black">{stats.auditLogEntries}</span><span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg">Indexed</span></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-black p-6 shadow-sm flex items-center gap-5 hover:border-black transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"><Server className="w-4 h-4" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-black uppercase tracking-wider mb-1 truncate">System Health</div>
                      <div className="flex items-baseline justify-between"><span className="text-3xl font-black text-black">{stats.systemHealth}</span><span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg">Optimal</span></div>
                    </div>
                  </div>
                </div>

                {/* Quick Access */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div onClick={() => goTo('users')} className="bg-white p-6 rounded-2xl border border-black shadow-sm hover:border-black hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold"><UserCog className="w-4 h-4" /></div>
                      <ArrowRight className="text-black group-hover:text-black transition-all" />
                    </div>
                    <h3 className="font-bold text-black text-base mb-1">User Accounts</h3><p className="text-xs text-black font-medium">Create credentials, manage profiles, trigger resets.</p>
                  </div>
                  <div onClick={() => goTo('rbac')} className="bg-white p-6 rounded-2xl border border-black shadow-sm hover:border-black hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold"><Shield className="w-4 h-4" /></div>
                      <ArrowRight className="text-black group-hover:text-black transition-all" />
                    </div>
                    <h3 className="font-bold text-black text-base mb-1">Role Checklists</h3><p className="text-xs text-black font-medium">Configure RBAC permissions.</p>
                  </div>
                  <div onClick={() => goTo('audit')} className="bg-white p-6 rounded-2xl border border-black shadow-sm hover:border-black hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold"><History className="w-4 h-4" /></div>
                      <ArrowRight className="text-black group-hover:text-black transition-all" />
                    </div>
                    <h3 className="font-bold text-black text-base mb-1">Audit Logs</h3><p className="text-xs text-black font-medium">System-wide event logging.</p>
                  </div>
                  <div onClick={() => goTo('maintenance')} className="bg-white p-6 rounded-2xl border border-black shadow-sm hover:border-black hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold"><Wrench className="w-4 h-4" /></div>
                      <ArrowRight className="text-black group-hover:text-black transition-all" />
                    </div>
                    <h3 className="font-bold text-black text-base mb-1">Maintenance</h3><p className="text-xs text-black font-medium">Database backups, cache clearing.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── VIEW: USERS ── */}
            {activeView === 'users' && (
              <div className="animate-in fade-in slide-in- duration-300">
                <div className="border-b border-black pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-black text-black">User Account Management &amp; Credentials</h2>
                    <p className="text-xs text-black mt-0.5 font-medium">Create new user accounts, assign roles, and trigger password resets</p>
                  </div>
                  <button onClick={() => setCreateUserOpen(true)} className="px-5 py-2.5 bg-black text-white hover:bg-black rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer">
                    <Plus className="w-4 h-4" /> Create New User
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-black p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-sm" />
                    <input type="text" value={searchUser} onChange={e => setSearchUser(e.target.value)} placeholder="Search user name or email..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-black rounded-xl text-sm outline-none focus:border-black focus:bg-white transition-all" />
                  </div>
                  <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="bg-white border border-black rounded-xl px-4 py-2.5 text-sm font-bold text-black outline-none focus:border-black cursor-pointer w-full sm:w-auto">
                    <option value="">All Roles</option>
                    <option value="FYP Office Assistant">FYP Office Assistant</option>
                    <option value="FYP Office In-charge">FYP Office In-charge</option>
                    <option value="Faculty Supervisor">Faculty Supervisor</option>
                    <option value="HOD">HOD</option>
                    <option value="System Administrator">System Administrator</option>
                    <option value="Industry Supervisor">Industry Supervisor</option>
                  </select>
                </div>

                <div className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white border-b border-black text-[11px] font-black text-black uppercase tracking-wider">
                          <th className="py-3.5 px-6">Full Name</th>
                          <th className="py-3.5 px-6">Email Address</th>
                          <th className="py-3.5 px-6">Primary Role</th>
                          <th className="py-3.5 px-6 text-center">Status</th>
                          <th className="py-3.5 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black text-xs font-medium text-black">
                        {filteredUsers.map(u => (
                          <tr key={u.id} className="hover:bg-white/50 transition-colors">
                            <td className="py-4 px-6 font-bold text-black">{u.name}</td>
                            <td className="py-4 px-6 text-black font-mono">{u.email}</td>
                            <td className="py-4 px-6"><span className="bg-white text-black font-bold px-2.5 py-1 rounded-lg border border-black">{u.role}</span></td>
                            <td className="py-4 px-6 text-center"><span className="bg-white text-black font-bold px-2.5 py-1 rounded-lg border border-black">{u.status}</span></td>
                            <td className="py-4 px-6 text-right space-x-1">
                              <button onClick={() => handleResetPassword(u)} className="px-2.5 py-1 rounded-lg bg-white hover:bg-white text-black border border-black font-bold transition-all cursor-pointer">Reset</button>
                              <button onClick={() => handleToggleStatus(u)} className="px-2.5 py-1 rounded-lg bg-white hover:bg-white text-black border border-black font-bold transition-all cursor-pointer">Deactivate</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── VIEW: RBAC ── */}
            {activeView === 'rbac' && (
              <div className="animate-in fade-in slide-in- duration-300">
                <div className="border-b border-black pb-4 mb-6">
                  <h2 className="text-xl font-black text-black">Role Checklists &amp; RBAC</h2>
                  <p className="text-xs text-black mt-0.5 font-medium">Verify role permissions and audit role assignments</p>
                </div>
                <div className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden mb-8">
                  <div className="p-5 bg-white border-b border-black"><h3 className="text-base font-black text-black">System Role Permission Matrix</h3></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white border-b border-black text-[11px] font-black text-black uppercase tracking-wider">
                          <th className="py-3.5 px-6">System Role</th>
                          <th className="py-3.5 px-6">Core Permissions &amp; Scope</th>
                          <th className="py-3.5 px-6 text-center">Users</th>
                          <th className="py-3.5 px-6 text-right">RBAC Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black text-xs font-medium text-black">
                        {rbac.map(r => (
                          <tr key={r.role} className="hover:bg-white/50 transition-colors">
                            <td className="py-4 px-6 font-bold text-black">{r.role}</td>
                            <td className="py-4 px-6 text-black">{r.permissions}</td>
                            <td className="py-4 px-6 text-center font-bold">{r.users} Users</td>
                            <td className="py-4 px-6 text-right"><span className="bg-white text-black font-bold px-2.5 py-1 rounded-lg border border-black">{r.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── VIEW: AUDIT LOGS ── */}
            {activeView === 'audit' && (
              <div className="animate-in fade-in slide-in- duration-300">
                <div className="border-b border-black pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-black text-black">System Audit Logs &amp; Security Index</h2>
                    <p className="text-xs text-black mt-0.5 font-medium">Track timestamps, users, actions, and affected entities</p>
                  </div>
                  <button onClick={() => toast.success('Audit logs export started.')} className="px-5 py-2.5 bg-white border border-black text-black hover:bg-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer">
                    <FileUp className="text-black" /> Export Logs
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-black p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-sm" />
                    <input type="text" value={searchAudit} onChange={e => setSearchAudit(e.target.value)} placeholder="Search audit logs..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-black rounded-xl text-sm outline-none focus:border-black focus:bg-white transition-all" />
                  </div>
                  <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="bg-white border border-black rounded-xl px-4 py-2 text-sm font-bold text-black outline-none focus:border-black cursor-pointer w-full sm:w-auto">
                    <option value="">All Action Types</option>
                    <option value="ACCOUNT_CREATE">ACCOUNT_CREATE</option>
                    <option value="RUBRIC_UPDATE">RUBRIC_UPDATE</option>
                    <option value="COMMITTEE_LOCK">COMMITTEE_LOCK</option>
                    <option value="USER_AUTH">USER_AUTH</option>
                    <option value="DB_BACKUP">DB_BACKUP</option>
                  </select>
                </div>

                <div className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white border-b border-black text-[11px] font-black text-black uppercase tracking-wider">
                          <th className="py-3.5 px-6">Timestamp</th>
                          <th className="py-3.5 px-6">User Email</th>
                          <th className="py-3.5 px-6">Action Type</th>
                          <th className="py-3.5 px-6">Affected Entity</th>
                          <th className="py-3.5 px-6">IP Address</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black text-xs font-medium text-black font-mono">
                        {filteredAudit.map((a, i) => (
                          <tr key={i} className="hover:bg-white/50 transition-colors">
                            <td className="py-4 px-6 text-black">{a.timestamp}</td>
                            <td className="py-4 px-6 font-bold text-black">{a.user}</td>
                            <td className="py-4 px-6"><span className="bg-white text-black font-bold px-2 py-0.5 rounded border border-black">{a.action}</span></td>
                            <td className="py-4 px-6 text-black">{a.entity}</td>
                            <td className="py-4 px-6 text-black">{a.ip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── VIEW: MAINTENANCE ── */}
            {activeView === 'maintenance' && (
              <div className="animate-in fade-in slide-in- duration-300">
                <div className="border-b border-black pb-4 mb-6">
                  <h2 className="text-xl font-black text-black">System Maintenance &amp; Backup Console</h2>
                  <p className="text-xs text-black mt-0.5 font-medium">Trigger automated database backups, view system health metrics, and clear application cache</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-black shadow-sm p-6 space-y-6">
                    <h3 className="text-base font-black text-black pb-3 border-b border-black">Database &amp; Cache Maintenance</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="p-5 rounded-2xl bg-white border border-black flex flex-col justify-between space-y-4">
                        <div>
                          <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xl mb-3"><Database className="w-4 h-4" /></div>
                          <h4 className="font-black text-black text-sm mb-1">Database Backup Snapshot</h4>
                          <p className="text-xs text-black leading-relaxed">Create an immediate, fully encrypted snapshot of the entire FYP database.</p>
                        </div>
                        <button onClick={async () => { const res = await triggerDatabaseBackup(); toast.success(res.message); }} className="w-full py-2.5 bg-white hover:bg-white text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"><CloudDownload className="w-4 h-4" /> Trigger Snapshot Backup</button>
                      </div>
                      <div className="p-5 rounded-2xl bg-white border border-black flex flex-col justify-between space-y-4">
                        <div>
                          <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xl mb-3"><Broom className="w-4 h-4" /></div>
                          <h4 className="font-black text-black text-sm mb-1">Clear Application Cache</h4>
                          <p className="text-xs text-black leading-relaxed">Flush system routing cache and compiled validation schemas.</p>
                        </div>
                        <button onClick={async () => { const res = await clearApplicationCache(); toast.success(res.message); }} className="w-full py-2.5 bg-white hover:bg-white text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> Flush System Cache</button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-black shadow-sm p-6 space-y-6">
                    <h3 className="text-base font-black text-black pb-3 border-b border-black">System Health Metrics</h3>
                    <div className="space-y-4 text-xs">
                      <div>
                        <div className="flex justify-between font-bold text-black mb-1"><span>Server CPU Load</span><span>{health.cpuLoad}%</span></div>
                        <div className="w-full bg-white h-2.5 rounded-full overflow-hidden"><div className="bg-white h-full rounded-full" style={{ width: `${health.cpuLoad}%` }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between font-bold text-black mb-1"><span>Memory Allocation (RAM)</span><span>{health.ramUsed} GB / {health.ramTotal} GB</span></div>
                        <div className="w-full bg-white h-2.5 rounded-full overflow-hidden"><div className="bg-black h-full rounded-full" style={{ width: `${(health.ramUsed/health.ramTotal)*100}%` }}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between font-bold text-black mb-1"><span>Database Storage Capacity</span><span>{health.dbUsed} GB / {health.dbTotal} GB</span></div>
                        <div className="w-full bg-white h-2.5 rounded-full overflow-hidden"><div className="bg-white h-full rounded-full" style={{ width: `${(health.dbUsed/health.dbTotal)*100}%` }}></div></div>
                      </div>
                      <div className="pt-4 border-t border-black flex justify-between items-center font-bold text-black">
                        <span>System Uptime:</span><span className="text-black font-black">{health.uptime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* CREATE USER MODAL */}
      {createUserOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-black">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-black">
              <h3 className="text-lg font-black text-black">Create New User Account</h3>
              <i className="fas fa-times text-black hover:text-black cursor-pointer text-lg" onClick={() => setCreateUserOpen(false)}></i>
            </div>
            <form onSubmit={handleCreateUserSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Full Name</label>
                <input name="name" type="text" placeholder="e.g. Dr. Bilal Ahmed" className="w-full bg-white border border-black rounded-xl px-4 py-2.5 text-sm font-bold text-black outline-none focus:border-black transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Email Address</label>
                <input name="email" type="email" placeholder="e.g. bilal@cuiatd.edu.pk" className="w-full bg-white border border-black rounded-xl px-4 py-2.5 text-sm font-bold text-black outline-none focus:border-black transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Assign Primary System Role</label>
                <select name="role" className="w-full bg-white border border-black rounded-xl px-4 py-2.5 text-sm font-bold text-black outline-none focus:border-black cursor-pointer" required>
                  <option value="Faculty Supervisor">Faculty Supervisor</option>
                  <option value="FYP Office Assistant">FYP Office Assistant</option>
                  <option value="FYP Office In-charge">FYP Office In-charge</option>
                  <option value="HOD">HOD</option>
                  <option value="System Administrator">System Administrator</option>
                  <option value="Industry Supervisor">Industry Supervisor</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-black">
                <button type="button" onClick={() => setCreateUserOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-black hover:bg-white transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-black hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}
