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
    <div className="flex h-screen overflow-hidden bg-lightbg selection:bg-secondary/20 font-poppins">
      {/* SIDEBAR */}
      <aside
        className={`bg-primary flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden z-50 h-full
          fixed lg:relative ${mobileSidebarOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'} ${sidebarCollapsed ? 'lg:w-[68px]' : 'w-64 lg:w-64'}`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 flex-shrink-0">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <Landmark className="text-white text-sm" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <div className="text-white text-sm font-bold whitespace-nowrap">CUI DIMS</div>
              <div className="text-white/60 text-xs whitespace-nowrap leading-tight">Industry Supervisor</div>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="ml-auto hidden lg:flex bg-transparent border-0 text-white cursor-pointer flex-shrink-0 p-1 rounded-lg hover:bg-white/15 transition-colors">
            {sidebarCollapsed ? <ChevronRight className="text-sm" /> : <ChevronLeft className="text-sm" />}
          </button>
          <button onClick={() => setMobileSidebarOpen(false)} className="ml-auto lg:hidden bg-transparent border-0 text-white cursor-pointer p-1 rounded-lg hover:bg-white/15 transition-colors">
            <X className="text-lg" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 sidebar-nav">
          {navItems.map((item) => (
            <React.Fragment key={item.id}>
              {item.section && !sidebarCollapsed && (
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-3 mb-1 pt-1">{item.section}</div>
              )}
              <button
                onClick={() => { navigate(item.id); setMobileSidebarOpen(false); }}
                title={sidebarCollapsed ? item.label : ''}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 text-left outline-none
                  ${location.pathname === item.id || (item.id === '/industry-dashboard/scoring' && location.pathname.includes('/scoring')) ? 'bg-secondary text-white shadow-lg shadow-blue-600/30 font-bold' : 'text-white/80 hover:bg-white/15 hover:text-white'}
                  ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                {React.createElement(item.icon, { className: "w-4 h-4 flex-shrink-0" })}
                {!sidebarCollapsed && <span className="text-sm font-medium whitespace-nowrap flex-1">{item.label}</span>}
              </button>
            </React.Fragment>
          ))}
        </nav>

        <div className="p-2 border-t border-white/10 flex-shrink-0">
          <button onClick={() => logout()} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-white/80 hover:bg-white/15 hover:text-white transition-all duration-200 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {mobileSidebarOpen && <div onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" />}

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* TOPBAR */}
        <header className="bg-white border-b border-gray-100 px-3 md:px-6 h-14 md:h-16 flex items-center justify-between shadow-sm flex-shrink-0 z-30 gap-3">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <button onClick={() => { window.innerWidth >= 1024 ? setSidebarCollapsed(!sidebarCollapsed) : setMobileSidebarOpen(true); }} className="w-9 h-9 rounded-xl bg-gray-50 border-0 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-all cursor-pointer flex-shrink-0">
              <Menu className="text-sm" />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm md:text-base font-bold text-primary leading-tight truncate">{pageTitle}</h2>
              <p className="text-[10px] text-gray-400 leading-tight hidden sm:block">CUI Abbottabad</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-700 whitespace-nowrap">
              <User className="w-3.5 h-3.5 text-primary" />
              <span>Industry Supervisor</span>
            </div>

            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(p => !p)} className="w-9 h-9 rounded-xl bg-gray-50 border-0 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-secondary transition-all cursor-pointer relative">
                <Bell className="text-sm" />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-11 bg-white border border-gray-100 rounded-2xl w-80 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-primary">Notifications</span>
                    <button onClick={() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); toast.success('All notifications marked as read'); }} className="text-[10px] font-bold text-secondary hover:underline cursor-pointer">Mark all read</button>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-12 flex flex-col items-center justify-center text-gray-300">
                        <p className="text-xs font-medium">No notifications</p>
                      </div>
                    ) : notifications.map(n => (
                      <div key={n.id} className={`flex items-start gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/80 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}>
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bell className="text-xs" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-900">{n.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{n.body}</p>
                          <p className="text-[9px] text-gray-300 font-bold mt-1.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-xs font-bold shadow-sm flex-shrink-0">
                {user.avatar || 'KS'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-gray-800 leading-tight truncate max-w-28">{user.name}</div>
                <div className="text-[10px] text-gray-400 leading-tight font-bold">External</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 bg-lightbg scroll-smooth" onClick={() => setNotifOpen(false)}>
          <div className="max-w-[1600px] mx-auto w-full animate-[fadeIn_0.3s_ease-out]">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>
    </div>
  );
}
