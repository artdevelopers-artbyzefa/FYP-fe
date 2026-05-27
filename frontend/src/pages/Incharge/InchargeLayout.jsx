import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { getUserInfo, logout } from '../../utils/app.utils';
import { BarChart3, Bell, Calendar, ChevronLeft, ChevronRight, ClipboardList, GraduationCap, History, Home, Landmark, LogOut, Menu, Scale, User, UserPlus, Users, X } from 'lucide-react';

export default function InchargeLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserInfo() || { name: 'Dr. Sara Malik', avatar: 'SM', role: 'In-charge' };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

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

  // Compute Page Title
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
    <div className="flex h-screen overflow-hidden relative bg-white selection:bg-blue-600 selection:text-white" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: '#EFF6FF' }}>
      
      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <div 
        className={`bg-blue-600 flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden fixed lg:relative z-[50] h-full ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} border-r border-white/10 shadow-2xl lg:shadow-none`}
        style={{ width: sidebarCollapsed ? 68 : 256, minWidth: sidebarCollapsed ? 68 : 256, backgroundColor: '#2B3990' }}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 relative">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <Landmark className="text-white text-sm" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden transition-all duration-300">
              <div className="text-white text-sm font-black whitespace-nowrap tracking-wide">CUI ABBOTTABAD</div>
              <div className="text-white/60 text-[11px] whitespace-nowrap leading-tight font-semibold">FYP Office In-charge</div>
            </div>
          )}
          <button onClick={() => setMobileSidebarOpen(false)} className="ml-auto lg:hidden bg-transparent border-0 text-white cursor-pointer p-1 rounded-lg hover:bg-white/15 transition-colors absolute right-4">
            <X className="text-lg" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1" style={{ scrollbarWidth: 'none' }}>
          {navItems.map((group, idx) => (
            <div key={idx} className="mb-2">
              {!sidebarCollapsed && (
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-3 mb-2 pt-2">
                  {group.section}
                </div>
              )}
              {group.items.map((item) => {
                const isActive = path === item.id;
                return (
                  <div 
                    key={item.id}
                    onClick={() => { navigate(item.id); setMobileSidebarOpen(false); }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'} ${sidebarCollapsed ? 'justify-center' : ''}`}
                    title={item.label}
                  >
                    {React.createElement(item.icon, { className: "w-4 h-4" })}
                    {!sidebarCollapsed && <span className="text-sm font-medium whitespace-nowrap flex-1">{item.label}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 bg-blue-600/10">
          <div onClick={() => logout()} className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-white/80 hover:bg-white/20 hover:text-blue-600 transition-all duration-200 font-bold" title="Logout">
            <LogOut className="text-sm w-5 text-center flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Logout</span>}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && <div onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 bg-blue-600/50 z-[40] lg:hidden backdrop-blur-sm" />}

      {/* ═══════════════ MAIN CONTENT WRAPPER ═══════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden w-full transition-all duration-300 ease-in-out">
        
        {/* TOPBAR */}
        <div className="bg-white border-b border-black px-4 md:px-6 h-16 flex items-center justify-between shadow-sm flex-shrink-0 z-[30] gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileSidebarOpen(true)} className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-black hover:bg-white hover:text-blue-600 transition-all border-0 lg:hidden flex-shrink-0">
              <Menu className="text-sm" />
            </button>
            
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:flex w-9 h-9 rounded-xl bg-white items-center justify-center text-black hover:bg-white hover:text-blue-600 transition-all border-0 flex-shrink-0 cursor-pointer">
              {sidebarCollapsed  ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <div className="min-w-0">
              <h2 className="text-base font-black text-black leading-tight truncate">{pageTitle}</h2>
              <p className="text-[11px] text-black leading-tight hidden sm:block font-medium">COMSATS University Islamabad, Abbottabad Campus</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-black rounded-xl text-xs font-bold text-black whitespace-nowrap shadow-sm">
              <User className="text-black" />
              <span>FYP Office In-charge</span>
            </div>

            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="w-9 h-9 rounded-xl bg-white border border-black flex items-center justify-center text-black hover:bg-white hover:text-blue-600 transition-all cursor-pointer relative">
                <Bell className="text-sm" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-white rounded-full border-2 border-white animate-pulse"></span>
              </button>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-white rounded-xl cursor-pointer border border-black hover:bg-white hover:border-blue-600 transition-all">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black text-xs font-bold shadow-sm flex-shrink-0">
                  {user.avatar || 'SM'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-black leading-tight truncate max-w-28">{user.name}</div>
                  <div className="text-[10px] text-black leading-tight font-bold">{user.role || 'In-charge'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-white scroll-smooth relative" style={{ backgroundColor: '#EFF6FF' }}>
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}
