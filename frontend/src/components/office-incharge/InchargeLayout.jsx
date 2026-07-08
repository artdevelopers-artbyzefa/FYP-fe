import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { PhaseProvider, usePhase } from '../../contexts/PhaseContext';
import { SessionProvider, useSession } from '../../contexts/SessionContext';
import { showToast as toast } from '../AppToast';
import { logoutUser, getCurrentUser } from '../../services/auth.service';
import { AlertCircle, BarChart3, Bell, Calendar, ChevronDown, ChevronLeft, ChevronRight, ClipboardList, GraduationCap, GitBranch, History, Home, Layers, Lock, LogOut, Menu, Scale, ToggleRight, Users, X } from 'lucide-react';

const SessionDropdown = () => {
  const { sessions, selectedSession, setSelectedSession, loading } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mx-3 mt-2">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading || !sessions.length}
        className="w-full flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl text-white hover:bg-white/15 transition-all cursor-pointer border-0 text-left disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GraduationCap size={13} className="text-blue-300 shrink-0" />
        <span className="text-xs font-semibold truncate flex-1">
          {loading ? 'Loading...' : selectedSession?.sessionName || selectedSession?.name || 'Select Batch'}
        </span>
        {!loading && sessions.length > 0 && <ChevronDown size={12} className={`text-blue-300/60 transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>
      {open && sessions.length > 0 && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-dropdown z-20 py-1 max-h-48 overflow-y-auto border border-line">
            {sessions.map(s => (
              <button
                key={s._id || s.id}
                onClick={() => { setSelectedSession(s); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors cursor-pointer border-0 bg-transparent hover:bg-blue-50 ${selectedSession?._id === s._id || selectedSession?.id === s.id ? 'text-blue-700 bg-blue-50' : 'text-slate-700'}`}
              >
                <span>{s.sessionName || s.name}</span>
                {s.sessionName && s.name && <span className="text-[9px] text-slate-400 block">{s.name}</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Sidebar = ({ isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed, user, roleLabel, navLinks, handleLogout }) => {
  const { currentPhase, loading } = usePhase();

  return (
    <div
      className={`bg-[#1a237e] border-r border-white/10 flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden fixed lg:relative z-[50] h-full ${isMobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'lg:w-[68px]' : 'w-64 lg:w-64'}`}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          {!isCollapsed && (
            <div className="overflow-hidden flex-1">
              <div className="text-white text-sm font-bold whitespace-nowrap">CUI DIMS</div>
              <div className="text-blue-300 text-xs whitespace-nowrap leading-tight">{roleLabel}</div>
            </div>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} className="ml-auto hidden lg:flex bg-transparent border-0 text-blue-200 cursor-pointer flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors">
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
          <button onClick={() => setIsMobileOpen(false)} className="ml-auto lg:hidden bg-transparent border-0 text-blue-200 cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        {!isCollapsed && !loading && currentPhase && (
          <div className="mx-3 mt-2 px-3 py-2 bg-white/10 rounded-xl">
            <div className="text-[9px] font-bold text-blue-300/60 uppercase tracking-widest">Active Phase</div>
            <div className="text-white text-xs font-bold truncate">{currentPhase.name}</div>
          </div>
        )}

        <SessionDropdown />

      <nav className="flex-1 overflow-y-auto p-2 sidebar-nav">
        {navLinks.map((link, index) => {
          const showSection = index === 0 || navLinks[index - 1].section !== link.section;
          return (
            <React.Fragment key={link.to}>
              {showSection && !isCollapsed && (
                <div className={`text-[10px] font-bold uppercase tracking-widest text-blue-300/60 px-3 mb-1 ${index !== 0 ? 'pt-3' : 'pt-1'}`}>
                  {link.section}
                </div>
              )}
              {link.locked ? (
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-300/60 cursor-not-allowed select-none ${isCollapsed ? 'justify-center w-[44px] h-[44px] mx-auto p-[10px]' : ''}`} title={`${link.label} — locked`}>
                  {React.createElement(link.icon, { size: 16, className: "flex-shrink-0" })}
                  {!isCollapsed && (
                    <>
                      <span className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1">{link.label}</span>
                      <Lock size={12} className="flex-shrink-0 text-blue-300/60" />
                    </>
                  )}
                </div>
              ) : (
              <NavLink
                to={link.to}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${isActive ? 'bg-[#1565c0] text-white font-semibold' : 'text-white hover:bg-white/10 hover:text-white'} ${isCollapsed ? 'justify-center w-[44px] h-[44px] mx-auto p-[10px]' : ''}`}
              >
                {React.createElement(link.icon, { size: 16, className: "flex-shrink-0" })}
                {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1">{link.label}</span>}
              </NavLink>
              )}
            </React.Fragment>
          );
        })}
      </nav>

        <div className="p-2 pt-4">
          <div onClick={handleLogout} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-white hover:bg-white/10 hover:text-red-400 transition-all duration-200 ${isCollapsed ? 'justify-center w-[44px] h-[44px] mx-auto p-[10px]' : ''}`} title="Logout">
          <LogOut size={16} className="flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </div>
      </div>
    </div>
  );
};

const LayoutInner = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser() ?? null;
  const { currentPhase, loading } = usePhase();
  const phase1Keys = ['registration', 'proposal_submission'];
  const isPhase1 = currentPhase && phase1Keys.includes(currentPhase.key);

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const roleLabel = 'FYP Office In-charge';

  const navLinks = [
    { to: '/office-incharge/dashboard', icon: Home, label: 'Dashboard', section: 'Overview' },
    { to: '/office-incharge/phases', icon: ToggleRight, label: 'Phase Control', section: 'Overview' },
    { to: '/office-incharge/eval-committee', icon: Layers, label: 'Evaluation Committees', section: 'Committees & Scheduling' },
    { to: '/office-incharge/committee-oversight', icon: Users, label: 'Committee Oversight', section: 'Committees & Scheduling' },
    { to: '/office-incharge/timetable', icon: Calendar, label: 'Timetable Management', section: 'Committees & Scheduling' },
    { to: '/office-incharge/meeting-timetable', icon: Users, label: 'Meeting Timetable', section: 'Committees & Scheduling' },
    { to: '/office-incharge/rubrics', icon: ClipboardList, label: 'Rubric Builder', section: 'Curriculum' },
    { to: '/office-incharge/sessions', icon: Calendar, label: 'Academic Sessions', section: 'Curriculum' },
    { to: '/office-incharge/projects', icon: GitBranch, label: 'Project Directory', section: 'Records' },
    { to: '/office-incharge/student-reports', icon: GraduationCap, label: 'Student Records', section: 'Records' },
    { to: '/office-incharge/forwarded-proposals', icon: GitBranch, label: 'Forwarded Proposals', section: 'Records' },
    { to: '/office-incharge/phase1-marks', icon: BarChart3, label: 'Phase 1 (10%) Marks', section: 'Marks' },
    { to: '/office-incharge/phase2-marks', icon: BarChart3, label: 'Phase 2 (30%) Marks', section: 'Marks' },
    { to: '/office-incharge/final-marks', icon: ClipboardList, label: 'Final Calculated Marks', section: 'Marks' },
    { to: '/office-incharge/grievances', icon: Scale, label: 'Grievances & SLAs', section: 'Audit & Logs' },
    { to: '/office-incharge/audit-log', icon: History, label: 'System Audit Logs', section: 'Audit & Logs' },
  ];

  return (
    <div className="flex h-screen overflow-hidden relative bg-surface selection:bg-blue-100 selection:text-blue-900 font-poppins">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} user={user} roleLabel={roleLabel} navLinks={navLinks} handleLogout={handleLogout} />

      {isMobileOpen && (
        <div onClick={() => setIsMobileOpen(false)} className="fixed inset-0 bg-black/30 z-[40] lg:hidden" />
      )}

      <div className="flex-1 flex flex-col overflow-hidden w-full transition-all duration-300 ease-in-out">
        <div className="bg-white border-b border-line px-3 md:px-6 h-14 md:h-16 flex items-center justify-between flex-shrink-0 z-[30] gap-3">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <button onClick={() => { window.innerWidth >= 1024 ? setIsCollapsed(!isCollapsed) : setIsMobileOpen(true); }} className="w-9 h-9 rounded-xl bg-blue-50 border-0 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all cursor-pointer flex-shrink-0 focus-visible:ring-2 focus-visible:ring-blue-500">
              <Menu size={15} />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm md:text-base font-bold text-slate-900 leading-tight truncate">Dashboard</h2>
              <p className="text-[10px] text-slate-400 leading-tight hidden sm:block">CUI Abbottabad</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            {!loading && currentPhase && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-semibold text-blue-700 whitespace-nowrap">{currentPhase.name}</span>
              </div>
            )}

            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="w-9 h-9 rounded-xl bg-blue-50 border-0 cursor-pointer flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all relative focus-visible:ring-2 focus-visible:ring-blue-500">
                <Bell size={15} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {showNotif && (
                <div className="absolute right-0 top-11 bg-white border border-line rounded-2xl w-80 shadow-dropdown z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-line flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-900">Notifications</span>
                    <button onClick={() => { toast.success('All notifications marked as read'); setShowNotif(false); }} className="text-[10px] font-semibold text-blue-600 hover:underline bg-transparent border-0 cursor-pointer">Mark all read</button>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    <div className="flex items-start gap-3 px-4 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors bg-blue-50/30">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5"><AlertCircle size={12} /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900">Grievance SLA Breach Warning</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">Grievance #GRV-089 has exceeded the 14-day resolution window.</p>
                        <p className="text-[9px] text-slate-300 font-semibold mt-1.5">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                  <span>{user.avatar || 'SM'}</span>
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-28">{user.name || 'Dr. Sara Malik'}</div>
                  <div className="text-[10px] text-slate-400 leading-tight font-medium">In-charge</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 bg-surface scroll-smooth" onClick={() => setShowNotif(false)}>
          <div className="max-w-[1600px] mx-auto w-full animate-fadeSlideUp">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>
    </div>
  );
};

const InchargeLayout = () => (
  <PhaseProvider>
    <SessionProvider>
      <LayoutInner />
    </SessionProvider>
  </PhaseProvider>
);

export default InchargeLayout;
