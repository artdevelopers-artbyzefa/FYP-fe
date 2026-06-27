import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getUserInfo, logout } from '../../utils/app.utils';
import { getAdminNotifications } from '../../services/admin.service';
import { showToast as toast } from '../AppToast';
import { Bell, ChevronLeft, ChevronRight, History, Landmark, LogOut, Menu, Server, Shield, UserCog, Wrench, X } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserInfo() ?? null;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  useEffect(() => {
    getAdminNotifications().then(setNotifications);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = [
    { id: '/admin-dashboard',           label: 'Dashboard',             icon: Server,      section: 'System' },
    { id: '/admin-dashboard/users',       label: 'User Accounts',         icon: UserCog,    section: 'Account & RBAC' },
    { id: '/admin-dashboard/rbac',        label: 'Role Checklists',       icon: Shield, section: null },
    { id: '/admin-dashboard/audit',       label: 'System Audit Logs',     icon: History,     section: 'Security & Maintenance' },
    { id: '/admin-dashboard/maintenance', label: 'System Maintenance',    icon: Wrench,       section: null },
  ];

  const pageTitle = navItems.find(n => n.id === location.pathname)?.label || 'System Dashboard';
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen overflow-hidden bg-surface selection:bg-blue-100 selection:text-blue-900 font-poppins">
      <aside
        className={`bg-[#1a237e] border-r border-white/10 flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden z-50 h-full
          fixed lg:relative ${mobileSidebarOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'} ${sidebarCollapsed ? 'lg:w-[68px]' : 'w-64 lg:w-64'}`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 flex-shrink-0">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <Landmark className="text-white" size={16} />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <div className="text-white text-sm font-bold whitespace-nowrap">CUI DIMS</div>
              <div className="text-blue-300 text-xs whitespace-nowrap leading-tight">System Administrator</div>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="ml-auto hidden lg:flex bg-transparent border-0 text-blue-200 cursor-pointer flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors">
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
          <button onClick={() => setMobileSidebarOpen(false)} className="ml-auto lg:hidden bg-transparent border-0 text-blue-200 cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 sidebar-nav">
          {navItems.map((item) => (
            <React.Fragment key={item.id}>
              {item.section && !sidebarCollapsed && (
                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-300/60 px-3 mb-1 pt-3">{item.section}</div>
              )}
              <button
                onClick={() => { navigate(item.id); setMobileSidebarOpen(false); }}
                title={sidebarCollapsed ? item.label : ''}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                  ${location.pathname === item.id ? 'bg-[#1565c0] text-white font-semibold' : 'text-white hover:bg-white/10 hover:text-white'}
                  ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                {React.createElement(item.icon, { size: 16, className: "flex-shrink-0" })}
                {!sidebarCollapsed && <span className="text-sm font-medium whitespace-nowrap flex-1">{item.label}</span>}
              </button>
            </React.Fragment>
          ))}
        </nav>

        <div className="p-2 pt-4 flex-shrink-0">
          <button onClick={() => logout()} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-white hover:bg-white/10 hover:text-red-400 transition-all duration-200 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <LogOut size={16} className="flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {mobileSidebarOpen && <div onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-40 lg:hidden" />}

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="bg-white border-b border-line px-3 md:px-6 h-14 md:h-16 flex items-center justify-between flex-shrink-0 z-30 gap-3">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <button onClick={() => { window.innerWidth >= 1024 ? setSidebarCollapsed(!sidebarCollapsed) : setMobileSidebarOpen(true); }} className="w-9 h-9 rounded-xl bg-blue-50 border-0 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all cursor-pointer flex-shrink-0 focus-visible:ring-2 focus-visible:ring-blue-500">
              <Menu size={15} />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm md:text-base font-bold text-slate-900 leading-tight truncate">{pageTitle}</h2>
              <p className="text-[10px] text-slate-400 leading-tight hidden sm:block">CUI Abbottabad</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl text-[10px] font-semibold text-blue-700 whitespace-nowrap">
              <Shield size={13} />
              <span>System Administrator</span>
            </div>

            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(p => !p)} className="w-9 h-9 rounded-xl bg-blue-50 border-0 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all cursor-pointer relative focus-visible:ring-2 focus-visible:ring-blue-500">
                <Bell size={15} />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-11 bg-white border border-line rounded-2xl w-80 shadow-dropdown z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-line flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-900">System Notifications</span>
                    <button onClick={() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); toast.success('All notifications marked as read'); }} className="text-[10px] font-semibold text-blue-600 hover:underline cursor-pointer bg-transparent border-0">Mark all read</button>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-12 flex flex-col items-center justify-center text-slate-300">
                        <p className="text-xs font-medium">No notifications</p>
                      </div>
                    ) : notifications.map(n => (
                      <div key={n.id} className={`flex items-start gap-3 px-4 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}>
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bell size={12} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{n.body}</p>
                          <p className="text-[9px] text-slate-300 font-semibold mt-1.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-blue-50 rounded-xl">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                {user.avatar || 'SA'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-28">{user.name}</div>
                <div className="text-[10px] text-slate-400 leading-tight font-medium">SysAdmin</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 bg-surface scroll-smooth" onClick={() => setNotifOpen(false)}>
          <div className="max-w-[1600px] mx-auto w-full animate-fadeSlideUp">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>
    </div>
  );
}
