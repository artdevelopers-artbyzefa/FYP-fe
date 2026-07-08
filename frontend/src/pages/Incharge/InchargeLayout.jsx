import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getUserInfo, logout } from '../../utils/app.utils';
import { BarChart3, Bell, Calendar, ChevronLeft, ChevronRight, ClipboardList, GraduationCap, History, Home, Landmark, LogOut, Menu, Scale, User, UserPlus, Users, X } from 'lucide-react';

export default function InchargeLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserInfo() ?? null;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const path = location.pathname;

  const navItems = [
    { section: 'Overview', items: [
      { id: '/incharge/dashboard', label: 'Dashboard', icon: Home }
    ]},
    { section: 'Curriculum & Sessions', items: [
      { id: '/incharge/rubrics', label: 'Rubric Builder', icon: ClipboardList },
      { id: '/incharge/sessions', label: 'Academic Sessions', icon: Calendar }
    ]},
    { section: 'Governance & Oversight', items: [
      { id: '/incharge/supervision-requests', label: 'Supervision Requests', icon: UserPlus },
      { id: '/incharge/committee-oversight', label: 'Committee Oversight', icon: Users },
      { id: '/incharge/grievances', label: 'Grievances & SLAs', icon: Scale }
    ]},
    { section: 'Analytics & Logs', items: [
      { id: '/incharge/faculty-reports', label: 'Faculty Reports', icon: BarChart3 },
      { id: '/incharge/student-reports', label: 'Student Reports', icon: GraduationCap },
      { id: '/incharge/audit-logs', label: 'System Audit Logs', icon: History }
    ]}
  ];

  let pageTitle = 'Dashboard';
  if (path.includes('/rubrics')) pageTitle = 'Rubric Builder';
  else if (path.includes('/sessions')) pageTitle = 'Academic Sessions';
  else if (path.includes('/supervision-requests')) pageTitle = 'Supervision Requests';
  else if (path.includes('/committee-oversight')) pageTitle = 'Committee Oversight';
  else if (path.includes('/grievances')) pageTitle = 'Grievances & SLAs';
  else if (path.includes('/faculty-reports')) pageTitle = 'Faculty Reports';
  else if (path.includes('/student-reports')) pageTitle = 'Student Reports';
  else if (path.includes('/audit-logs')) pageTitle = 'System Audit Logs';

  return (
    <div className="flex h-screen overflow-hidden relative bg-surface selection:bg-blue-100 selection:text-blue-900 font-poppins">
      <div 
        className={`bg-sidebar-bg border-r border-white/10 flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden fixed lg:relative z-[50] h-full ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ width: sidebarCollapsed ? 68 : 256, minWidth: sidebarCollapsed ? 68 : 256 }}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 relative">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <Landmark className="text-white" size={16} />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden transition-all duration-300">
              <div className="text-white text-sm font-bold whitespace-nowrap tracking-wide">CUI ABBOTTABAD</div>
              <div className="text-blue-300 text-xs whitespace-nowrap leading-tight font-medium">FYP Office In-charge</div>
            </div>
          )}
          <button onClick={() => setMobileSidebarOpen(false)} className="ml-auto lg:hidden bg-transparent border-0 text-blue-200 cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors absolute right-4">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1" style={{ scrollbarWidth: 'none' }}>
          {navItems.map((group, idx) => (
            <div key={idx} className="mb-2">
              {!sidebarCollapsed && (
                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-300/60 px-3 mb-2 pt-2">
                  {group.section}
                </div>
              )}
              {group.items.map((item) => {
                const isActive = path === item.id;
                return (
                  <button 
                    key={item.id}
                    onClick={() => { navigate(item.id); setMobileSidebarOpen(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 border-0 w-full text-left focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-bg ${isActive ? 'bg-sidebar-active text-white font-semibold' : 'text-white hover:bg-white/10 hover:text-white'} ${sidebarCollapsed ? 'justify-center' : ''}`}
                    title={item.label}
                    aria-label={item.label}
                  >
                    {React.createElement(item.icon, { size: 16 })}
                    {!sidebarCollapsed && <span className="text-sm font-medium whitespace-nowrap flex-1">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 pt-5">
          <button onClick={() => logout()} type="button" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white hover:bg-white/10 hover:text-red-400 transition-all duration-200 border-0 w-full text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-bg" title="Logout" aria-label="Logout">
            <LogOut size={16} className="flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {mobileSidebarOpen && <div onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-[40] lg:hidden" />}

      <div className="flex-1 flex flex-col overflow-hidden w-full transition-all duration-300 ease-in-out">
        <div className="bg-white border-b border-line px-4 md:px-6 h-16 flex items-center justify-between flex-shrink-0 z-[30] gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileSidebarOpen(true)} className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all border-0 lg:hidden flex-shrink-0 focus-visible:ring-2 focus-visible:ring-blue-500">
              <Menu size={15} />
            </button>
            
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:flex w-9 h-9 rounded-xl bg-blue-50 items-center justify-center text-blue-600 hover:bg-blue-100 transition-all border-0 flex-shrink-0 cursor-pointer">
              {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900 leading-tight truncate">{pageTitle}</h2>
              <p className="text-[11px] text-slate-500 leading-tight hidden sm:block font-medium">COMSATS University Islamabad, Abbottabad Campus</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl text-xs font-semibold text-blue-700 whitespace-nowrap">
              <User size={13} />
              <span>FYP Office In-charge</span>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                  {user.avatar || 'SM'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-28">{user.name}</div>
                  <div className="text-[10px] text-slate-400 leading-tight font-medium">{user.role || 'In-charge'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full animate-fadeSlideUp">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>
    </div>
  );
}
