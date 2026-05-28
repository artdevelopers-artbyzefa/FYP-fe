import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getUserInfo, logout } from '../../utils/app.utils';
import { getIndustryNotifications } from '../../services/industry.service';
import { showToast as toast } from '../AppToast';
import { Bell, ChevronLeft, ChevronRight, GitBranch, Landmark, LogOut, Menu, StarHalf, User, X } from 'lucide-react';

export default function IndustryLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserInfo() || { name: 'Engr. Kamran Shah', avatar: 'KS' };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  useEffect(() => {
    getIndustryNotifications().then(setNotifications);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = [
    { id: '/industry-dashboard',         label: 'Assigned Projects', icon: GitBranch, section: 'Evaluation Console' },
    { id: '/industry-dashboard/scoring', label: 'Rubric Scoring',    icon: StarHalf,   section: null },
  ];

  const pageTitle = navItems.find(n => n.id === location.pathname)?.label || 'Dashboard';
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: '#EFF6FF' }}>
      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside
        style={{ backgroundColor: '#2B3990', width: sidebarCollapsed ? 68 : 256, minWidth: sidebarCollapsed ? 68 : 256 }}
        className={`flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden z-50 h-full border-r border-white/10 shadow-2xl
          fixed lg:relative ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 relative flex-shrink-0">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <Landmark className="text-white text-sm" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden transition-all duration-300">
              <div className="text-white text-sm font-black whitespace-nowrap tracking-wide">CUI ABBOTTABAD</div>
              <div className="text-white/60 text-[11px] whitespace-nowrap leading-tight font-semibold">Industry Supervisor</div>
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
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-3 mb-2 pt-2">{item.section}</div>
              )}
              <button
                onClick={() => { navigate(item.id); setMobileSidebarOpen(false); }}
                title={sidebarCollapsed ? item.label : ''}
                style={location.pathname === item.id || (item.id === '/industry-dashboard/scoring' && location.pathname.includes('/scoring')) ? { backgroundColor: '#2563EB' } : {}}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 text-left
                  ${location.pathname === item.id || (item.id === '/industry-dashboard/scoring' && location.pathname.includes('/scoring')) ? 'text-white shadow-lg font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'}
                  ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                {React.createElement(item.icon, { className: "w-4 h-4" })}
                {!sidebarCollapsed && <span className="text-sm font-medium whitespace-nowrap flex-1">{item.label}</span>}
              </button>
            </React.Fragment>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 bg-blue-600/10 flex-shrink-0">
          <button onClick={() => logout()} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-white/80 hover:bg-blue-600/20 hover:text-blue-600 transition-all duration-200 font-bold ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <LogOut className="text-sm w-5 text-center flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {mobileSidebarOpen && <div onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 bg-blue-600/50 z-40 lg:hidden backdrop-blur-sm" />}

      {/* ═══════════════ MAIN ═══════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="bg-white border-b border-blue-100 px-4 md:px-6 h-16 flex items-center justify-between shadow-sm flex-shrink-0 z-30 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileSidebarOpen(true)} className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-600 hover:bg-blue-50 transition-all border-0 lg:hidden flex-shrink-0 cursor-pointer">
              <Menu className="text-sm" />
            </button>
            <button onClick={() => setSidebarCollapsed(p => !p)} className="hidden lg:flex w-9 h-9 rounded-xl bg-white items-center justify-center text-slate-600 hover:bg-blue-50 transition-all border-0 flex-shrink-0 cursor-pointer">
              {sidebarCollapsed  ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <div className="min-w-0">
              <h2 className="text-base font-black leading-tight truncate" style={{ color: '#2B3990' }}>{pageTitle}</h2>
              <p className="text-[11px] text-slate-500 leading-tight hidden sm:block font-medium">COMSATS University Islamabad, Abbottabad Campus</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-100 rounded-xl text-xs font-bold text-slate-700 whitespace-nowrap shadow-sm">
              <User className="text-primary" />
              <span>Industry Supervisor</span>
            </div>

            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(p => !p)} className="w-9 h-9 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-slate-600 hover:bg-blue-50 transition-all cursor-pointer relative">
                <Bell className="text-sm" />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-white rounded-full border-2 border-white animate-pulse"></span>}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden z-[100]">
                  <div className="p-4 bg-white border-b border-blue-100 flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900">Notifications</span>
                    <button onClick={() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); toast.success('All notifications marked as read'); }} className="text-xs font-bold text-primary hover:underline cursor-pointer">Mark all as read</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-blue-600">
                    {notifications.length === 0 ? (
                      <p className="p-8 text-center text-xs text-slate-500 font-bold">No notifications</p>
                    ) : notifications.map(n => (
                      <div key={n.id} className={`p-4 hover:bg-blue-50/50 transition-colors flex gap-3 items-start border-l-4 ${n.read ? 'border-transparent' : 'border-blue-500 bg-blue-50/20'}`}>
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          <Bell className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900">{n.title}</div>
                          <div className="text-[11px] text-slate-600 mt-0.5">{n.body}</div>
                          <div className="text-[10px] text-slate-500 mt-1 font-bold">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-white rounded-xl cursor-pointer border border-blue-100 hover:bg-blue-50 hover:border-primary transition-all">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-primary text-xs font-bold shadow-sm flex-shrink-0">
                {user.avatar || 'KS'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-28">{user.name}</div>
                <div className="text-[10px] text-slate-500 leading-tight font-bold">External</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>
    </div>
  );
}
