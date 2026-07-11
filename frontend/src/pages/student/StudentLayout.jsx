import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { getUserInfo, logout } from '../../utils/app.utils';
import { PhaseProvider, usePhase } from '../../contexts/PhaseContext';
import { Archive, Bell, Calendar, ChevronDown, ChevronLeft, ChevronRight, Circle, ClipboardList, GraduationCap, Home, Lightbulb, Lock, LogOut, Menu, Shield, User, UserCircle, Users, X } from 'lucide-react';

const StudentLayoutInner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserInfo() ?? null;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [ideasOpen, setIdeasOpen] = useState(false);

  const path = location.pathname;
  const isLocked = !user.profileCompleted;

  const { currentPhase } = usePhase();
  const phaseSeq = currentPhase?.sequence ?? 1;
  const phaseName = currentPhase?.name ?? '';

  const phaseConfig = {
    '/dashboard':            { minSeq: 1 },
    '/profile':              { minSeq: 1 },
    '/fyp-group':            { minSeq: 1, maxSeq: 3 },
    '/supervisor-selection': { minSeq: 1, maxSeq: 3 },
    '/committee':            { minSeq: 1 },
    '/my-presentations':     { minSeq: 3, maxSeq: 8 },
    '/phase1-remarks':       { minSeq: 5 },
    '/phase2-remarks':       { minSeq: 7 },
    '/phase3-remarks':       { minSeq: 10 },
    '/phase4-remarks':       { minSeq: 12 },
    '/project':              { minSeq: 2, maxSeq: 4 },
    '/suggestions':          { minSeq: 1 },
    '/task-manager':         { minSeq: 4 },
    '/past-projects':        { minSeq: 1 },
  };

  const phaseVisible = (itemId) => {
    const match = Object.entries(phaseConfig).find(([key]) => itemId.startsWith(key));
    if (!match) return true;
    const { minSeq, maxSeq } = match[1];
    if (phaseSeq < minSeq) return false;
    if (maxSeq && phaseSeq > maxSeq) return false;
    return true;
  };

  useEffect(() => {
    if (path.includes('/project')) setIdeasOpen(true);
  }, [path]);

  const navItems = [
    { section: 'Overview', items: [
      { id: '/dashboard', label: 'Dashboard', icon: Home }
    ]},
    { section: 'Account', items: [
      { id: '/profile', label: 'My Profile', icon: UserCircle }
    ]},
    { section: 'Group', items: [
      { id: '/fyp-group', label: 'My FYP Group', icon: Users },
      { id: '/supervisor-selection', label: 'Supervisor', icon: User },
      { id: '/committee', label: 'Committee', icon: Shield },
      { id: '/my-presentations', label: 'Presentations', icon: Calendar }
    ]},
    { section: 'Evaluation Remarks', items: [
      { id: '/phase1-remarks', label: 'Phase 1 (10%)', icon: ClipboardList },
      { id: '/phase2-remarks', label: 'Phase 2 (30%)', icon: ClipboardList },
      { id: '/phase3-remarks', label: 'Phase 3 (60%)', icon: ClipboardList },
      { id: '/phase4-remarks', label: 'Phase 4 (100%)', icon: ClipboardList }
    ]},
    { section: 'Project', items: [
      { id: '/project/new', label: 'Group Ideas', icon: Lightbulb },
      { id: '/suggestions', label: 'Supervisor Ideas', icon: Lightbulb },
      { id: '/task-manager', label: 'Task Manager', icon: ClipboardList },
      { id: '/past-projects', label: 'Past Projects', icon: Archive }
    ]}
  ];

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  let pageTitle = 'Dashboard';
  if (path === '/profile') pageTitle = 'My Profile';
  else if (path.includes('/partners/new')) pageTitle = 'New Request';
  else if (path.includes('/partners/requests')) pageTitle = 'Incoming Requests';
  else if (path.includes('/supervisor-selection')) pageTitle = 'FYP Supervisor';
  else if (path.includes('/project/new')) pageTitle = 'Group Ideas';
  else if (path.includes('/task-manager')) pageTitle = 'Task Manager';
  else if (path.includes('/past-projects')) pageTitle = 'Past FYP Projects';
  else if (path.includes('/suggestions')) pageTitle = 'Supervisor Suggestions';
  else if (path.includes('/committee')) pageTitle = 'My Committee';
  else if (path.includes('/phase1-remarks')) pageTitle = 'Phase 1 Remarks';
  else if (path.includes('/phase2-remarks')) pageTitle = 'Phase 2 Remarks';
  else if (path.includes('/phase3-remarks')) pageTitle = 'Phase 3 Remarks';
  else if (path.includes('/phase4-remarks')) pageTitle = 'Phase 4 Remarks';
  else if (path.includes('/my-presentations')) pageTitle = 'My Presentations';

  return (
    <div className="flex h-screen overflow-hidden relative bg-surface selection:bg-blue-100 selection:text-blue-900 font-poppins">
      <div 
        className={`bg-sidebar-bg border-r border-white/10 flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden fixed lg:relative z-[50] h-full ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ width: sidebarCollapsed ? 68 : 256, minWidth: sidebarCollapsed ? 68 : 256 }}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 relative">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <GraduationCap className="text-white" size={16} />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden transition-all duration-300">
              <div className="text-white text-sm font-bold whitespace-nowrap">CUI DFYP</div>
              <div className="text-blue-300 text-xs whitespace-nowrap leading-tight">Student Portal</div>
            </div>
          )}
          <button onClick={() => setMobileSidebarOpen(false)} className="ml-auto lg:hidden bg-transparent border-0 text-blue-200 cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors absolute right-4">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2" style={{ scrollbarWidth: 'none' }}>
          {navItems.map((group, idx) => {
            const visItems = group.items.filter(item =>
              item.isDropdown
                ? item.subItems.some(sub => phaseVisible(sub.id))
                : phaseVisible(item.id)
            );
            if (visItems.length === 0) return null;
            return (
            <div key={idx} className={`mb-1 ${idx > 0 ? 'mt-4' : ''}`}>
              {!sidebarCollapsed && (
                <div className="text-[0.6rem] font-bold uppercase tracking-widest text-blue-300/60 px-3 mb-1 truncate transition-all">
                  {group.section}
                </div>
              )}
              {visItems.map((item) => {
                const isProfileLocked = isLocked && item.id !== '/profile';
                const isActive = path === item.id || (item.isDropdown && item.subItems.some(sub => path === sub.id));
                
                if (item.isDropdown) {
                  const isOpen = ideasOpen;
                  const setOpen = setIdeasOpen;
                  const visSubs = item.subItems.filter(sub => phaseVisible(sub.id));
                  
                  return (
                    <div key={item.id} className="mb-1">
                      <button
                        onClick={() => { if(!isProfileLocked) setOpen(!isOpen); }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 border-0 w-full text-left focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-bg ${isProfileLocked ? 'opacity-40' : ''} ${isActive && !isOpen ? 'bg-sidebar-active text-white font-semibold' : 'text-white hover:bg-white/10 hover:text-white'} ${sidebarCollapsed ? 'justify-center' : ''}`}
                        title={item.label}
                        aria-expanded={!isProfileLocked ? isOpen : undefined}
                        aria-label={item.label}
                      >
                        {React.createElement(item.icon, { size: 16 })}
                        {!sidebarCollapsed && <span className="text-sm font-medium flex-1 whitespace-nowrap">{item.label}</span>}
                        {!sidebarCollapsed && isProfileLocked && <Lock size={10} className="text-blue-300/60 animate-pulse mr-1" />}
                        {!sidebarCollapsed && !isProfileLocked && <ChevronDown size={14} className="text-white/60" />}
                      </button>
                      
                      {!sidebarCollapsed && isOpen && !isProfileLocked && (
                          <div className="mt-1 ml-4 border-l border-white/10 pl-2 space-y-1">
                          {visSubs.map(sub => (
                            <button 
                              key={sub.id} 
                              onClick={() => { navigate(sub.id); setMobileSidebarOpen(false); }}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm border-0 w-full text-left focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-bg ${path === sub.id ? 'text-white bg-white/15 font-semibold' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                              aria-label={sub.label}
                            >
                              <Circle size={4} className="fill-current" />
                              <span className="whitespace-nowrap">{sub.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button 
                    key={item.id}
                    onClick={() => { if(!isProfileLocked) { navigate(item.id); setMobileSidebarOpen(false); } }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 border-0 w-full text-left focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-bg ${isProfileLocked ? 'opacity-40' : ''} ${isActive ? 'bg-sidebar-active text-white font-semibold' : 'text-white hover:bg-white/10 hover:text-white'} ${sidebarCollapsed ? 'justify-center' : ''}`}
                    title={item.label}
                    aria-label={item.label}
                  >
                    {React.createElement(item.icon, { size: 16 })}
                    {!sidebarCollapsed && <span className="text-sm font-medium flex-1 whitespace-nowrap">{item.label}</span>}
                    {!sidebarCollapsed && isProfileLocked && <Lock size={10} className="text-blue-300/60 animate-pulse" />}
                  </button>
                );
              })}
            </div>
          );
          })}
        </nav>

        <div className="p-2 pt-4">
          <button onClick={() => logout()} type="button" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white hover:bg-white/10 hover:text-red-400 transition-all duration-200 border-0 w-full text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-bg" title="Logout" aria-label="Logout">
            <LogOut size={16} className="flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {mobileSidebarOpen && <div onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-[40] lg:hidden" />}

      <div className="flex-1 flex flex-col overflow-hidden w-full transition-all duration-300 ease-in-out">
        <div className="bg-white border-b border-line px-3 md:px-6 h-14 md:h-16 flex items-center justify-between flex-shrink-0 z-[30] gap-3">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <button onClick={() => setMobileSidebarOpen(true)} className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all border-0 lg:hidden flex-shrink-0 focus-visible:ring-2 focus-visible:ring-blue-500">
              <Menu size={15} />
            </button>
            
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:flex w-9 h-9 rounded-xl bg-blue-50 items-center justify-center text-blue-600 hover:bg-blue-100 transition-all border-0 flex-shrink-0">
              {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div className="min-w-0">
              <h2 className="text-sm md:text-base font-bold text-slate-900 leading-tight truncate">{pageTitle}</h2>
              <p className="text-[10px] text-slate-500 leading-tight hidden sm:block">CUI Abbottabad | <span>{currentDate}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl text-xs font-semibold text-blue-700 whitespace-nowrap">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>{phaseName}</span>
            </div>

            <div className="relative">
              <button className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all focus-visible:ring-2 focus-visible:ring-blue-500">
                <Bell size={15} />
              </button>
            </div>

            <Link to="/profile" className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-all focus-visible:ring-2 focus-visible:ring-blue-500">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0 overflow-hidden">
                {user.profilepicture ? (
                  <img src={user.profilepicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">{user.avatar || 'ST'}</div>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-28">{user.name}</div>
                <div className="text-[10px] text-slate-500 leading-tight font-medium">{user.role}</div>
              </div>
              <ChevronDown size={10} className="text-slate-400 ml-0.5 hidden sm:block" />
            </Link>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 bg-surface scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full animate-fadeSlideUp">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>
    </div>
  );
};

const DashboardLayout = () => (
  <PhaseProvider>
    <StudentLayoutInner />
  </PhaseProvider>
);

export default DashboardLayout;
