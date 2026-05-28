import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { getUserInfo, logout } from '../../utils/app.utils';
import { Bell, ChevronDown, ChevronLeft, ChevronRight, Circle, ClipboardList, GraduationCap, Home, Lightbulb, Lock, LogOut, Menu, User, UserCircle, Users, X } from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserInfo() || { name: 'Student User', avatar: 'ST', role: 'Student' };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Dropdown states
  const [partnersOpen, setPartnersOpen] = useState(false);
  const [ideasOpen, setIdeasOpen] = useState(false);

  // Path helpers
  const path = location.pathname;
  const isLocked = !user.profileCompleted;

  // Auto-expand dropdowns based on active path
  useEffect(() => {
    if (path.includes('/partners')) setPartnersOpen(true);
    if (path.includes('/project')) setIdeasOpen(true);
  }, [path]);

  const navItems = [
    { section: 'Overview', items: [
      { id: '/dashboard', label: 'Dashboard', icon: Home }
    ]},
    { section: 'Account', items: [
      { id: '/profile', label: 'My Profile', icon: UserCircle }
    ]},
    { section: 'Group & Supervisor', items: [
      { id: 'group_partners', label: 'FYP Partners', icon: Users, isDropdown: true, subItems: [
        { id: '/partners/new', label: 'New Request' },
        { id: '/partners/requests', label: 'Incoming Requests' }
      ]},
      { id: '/supervisor-selection', label: 'Supervisor Selection', icon: User }
    ]},
    { section: 'Project Execution', items: [
      { id: 'group_ideas', label: 'Project Idea', icon: Lightbulb, isDropdown: true, subItems: [
        { id: '/project/new', label: 'New Idea' },
        { id: '/project/approved', label: 'Approved Ideas' }
      ]},
      { id: '/task-manager', label: 'Task Manager', icon: ClipboardList }
    ]}
  ];

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  // Compute Page Title
  let pageTitle = 'Dashboard';
  if (path === '/profile') pageTitle = 'My Profile';
  else if (path.includes('/partners/new')) pageTitle = 'New Request';
  else if (path.includes('/partners/requests')) pageTitle = 'Incoming Requests';
  else if (path.includes('/supervisor-selection')) pageTitle = 'Supervisor Selection';
  else if (path.includes('/project/new')) pageTitle = 'New Idea';
  else if (path.includes('/project/approved')) pageTitle = 'Approved Ideas';
  else if (path.includes('/task-manager')) pageTitle = 'Task Manager';

  return (
    <div className={`flex h-screen overflow-hidden relative bg-white selection:bg-blue-600/20 ${isLocked ? 'profile-locked' : ''}`} style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: '#EFF6FF' }}>
      
      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <div 
        className={`bg-blue-600 flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden fixed lg:relative z-[50] h-full ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ width: sidebarCollapsed ? 68 : 256, minWidth: sidebarCollapsed ? 68 : 256, backgroundColor: '#1E3A8A' }}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 relative">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <GraduationCap className="text-white text-sm" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden transition-all duration-300">
              <div className="text-white text-sm font-bold whitespace-nowrap">CUI DFYP</div>
              <div className="text-white/60 text-xs whitespace-nowrap leading-tight">Student Portal</div>
            </div>
          )}
          <button onClick={() => setMobileSidebarOpen(false)} className="ml-auto lg:hidden bg-transparent border-0 text-white cursor-pointer p-1 rounded-lg hover:bg-white/15 transition-colors absolute right-4">
            <X className="text-lg" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 mt-2" style={{ scrollbarWidth: 'none' }}>
          {navItems.map((group, idx) => (
            <div key={idx} className={`mb-1 ${idx > 0 ? 'mt-4' : ''}`}>
              {!sidebarCollapsed && (
                <div className="text-[0.6rem] font-bold uppercase tracking-widest text-white/30 px-3 mb-1 truncate transition-all">
                  {group.section}
                </div>
              )}
              {group.items.map((item) => {
                const isNavLocked = isLocked && item.id !== '/profile';
                const isActive = path === item.id || (item.isDropdown && item.subItems.some(sub => path === sub.id));
                
                if (item.isDropdown) {
                  const isOpen = item.id === 'group_partners' ? partnersOpen : ideasOpen;
                  const setOpen = item.id === 'group_partners' ? setPartnersOpen : setIdeasOpen;
                  
                  return (
                    <div key={item.id} className="mb-1">
                      <div 
                        onClick={() => { if(!isNavLocked) setOpen(!isOpen); }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${isNavLocked ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''} ${isActive && !isOpen ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold' : 'text-white/90 hover:bg-white/15 hover:text-white'} ${sidebarCollapsed ? 'justify-center' : ''}`}
                        title={item.label}
                      >
                        {React.createElement(item.icon, { className: "w-4 h-4" })}
                        {!sidebarCollapsed && <span className="text-sm font-medium flex-1 whitespace-nowrap">{item.label}</span>}
                        {!sidebarCollapsed && isNavLocked && <Lock className="text-[10px] text-white/40 animate-pulse mr-1" />}
                        {!sidebarCollapsed && !isNavLocked && <ChevronDown className="w-4 h-4" />}
                      </div>
                      
                      {!sidebarCollapsed && isOpen && !isNavLocked && (
                        <div className="mt-1 ml-4 border-l border-white/10 pl-2 space-y-1">
                          {item.subItems.map(sub => (
                            <div 
                              key={sub.id} 
                              onClick={() => { navigate(sub.id); setMobileSidebarOpen(false); }}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${path === sub.id ? 'text-white bg-white/10 font-bold' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                            >
                              <Circle className="text-[4px]" />
                              <span className="whitespace-nowrap">{sub.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div 
                    key={item.id}
                    onClick={() => { if(!isNavLocked) { navigate(item.id); setMobileSidebarOpen(false); } }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${isNavLocked ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''} ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold' : 'text-white/90 hover:bg-white/15 hover:text-white'} ${sidebarCollapsed ? 'justify-center' : ''}`}
                    title={item.label}
                  >
                    {React.createElement(item.icon, { className: "w-4 h-4" })}
                    {!sidebarCollapsed && <span className="text-sm font-medium flex-1 whitespace-nowrap">{item.label}</span>}
                    {!sidebarCollapsed && isNavLocked && <Lock className="text-[10px] text-white/40 animate-pulse" />}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-2 border-t border-white/10">
          <div onClick={() => logout()} className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-white/90 hover:bg-white/20 hover:text-blue-600 transition-all duration-200" title="Logout">
            <LogOut className="text-sm w-5 text-center flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-medium transition-all duration-200">Logout</span>}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && <div onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 bg-blue-600/50 z-[40] lg:hidden backdrop-blur-sm" />}

      {/* ═══════════════ MAIN CONTENT WRAPPER ═══════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden w-full transition-all duration-300 ease-in-out">
        
        {/* TOPBAR */}
        <div className="bg-white border-b border-blue-100 px-3 md:px-6 h-14 md:h-16 flex items-center justify-between shadow-sm flex-shrink-0 z-[30] gap-3">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <button onClick={() => setMobileSidebarOpen(true)} className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-500 hover:bg-white hover:text-primary transition-all border-0 lg:hidden flex-shrink-0">
              <Menu className="text-sm" />
            </button>
            
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:flex w-9 h-9 rounded-xl bg-white items-center justify-center text-slate-500 hover:text-primary hover:bg-blue-50 transition-all border-0 flex-shrink-0">
              {sidebarCollapsed  ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <div className="min-w-0">
              <h2 className="text-sm md:text-base font-bold text-slate-900 leading-tight truncate">{pageTitle}</h2>
              <p className="text-[10px] text-slate-500 leading-tight hidden sm:block">CUI Abbottabad · <span>{currentDate}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-100 rounded-xl text-xs font-bold text-slate-700 whitespace-nowrap">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>Phase 1: Student Registration</span>
            </div>

            <div className="relative">
              <button className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-500 hover:bg-white hover:text-primary transition-all">
                <Bell className="text-sm" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full border-2 border-white"></span>
              </button>
            </div>

            <Link to="/profile" className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-white rounded-xl cursor-pointer border border-blue-100 hover:bg-white hover:border-blue-600 transition-all">
              <div className="w-8 h-8 bg-white/50 rounded-lg flex items-center justify-center text-slate-700 text-xs font-bold shadow-sm flex-shrink-0">
                {user.avatar || 'ST'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-28">{user.name}</div>
                <div className="text-[10px] text-slate-500 leading-tight font-bold">{user.role}</div>
              </div>
              <ChevronDown className="text-slate-500 ml-0.5 hidden sm:block text-[9px]" />
            </Link>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 bg-white scroll-smooth relative" style={{ backgroundColor: '#EFF6FF' }}>
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
