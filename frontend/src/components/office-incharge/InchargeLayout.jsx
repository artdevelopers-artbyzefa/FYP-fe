import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { PhaseProvider, usePhase } from '../../contexts/PhaseContext';
import { showToast as toast } from '../AppToast';
import { logoutUser, getCurrentUser } from '../../services/auth.service';
import { AlertCircle, BarChart3, Bell, Calendar, ChevronLeft, ChevronRight, ClipboardList, GraduationCap, History, Home, LogOut, Menu, Scale, ToggleRight, User, UserPlus, Users, X } from 'lucide-react';

const Sidebar = ({ isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed, user, roleLabel, navLinks, handleLogout }) => {
  const { currentPhase, loading } = usePhase();

  return (
    <div
      className={`bg-primary flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden fixed lg:relative z-[50] h-full ${isMobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'lg:w-[68px]' : 'w-64 lg:w-64'}`}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        {!isCollapsed && (
          <div className="overflow-hidden flex-1">
            <div className="text-white text-sm font-bold whitespace-nowrap">CUI DIMS</div>
            <div className="text-white/60 text-xs whitespace-nowrap leading-tight">{roleLabel}</div>
          </div>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} className="ml-auto hidden lg:flex bg-transparent border-0 text-white cursor-pointer flex-shrink-0 p-1 rounded-lg hover:bg-white/15 transition-colors">
          {isCollapsed ? <ChevronRight className="text-sm" /> : <ChevronLeft className="text-sm" />}
        </button>
        <button onClick={() => setIsMobileOpen(false)} className="ml-auto lg:hidden bg-transparent border-0 text-white cursor-pointer p-1 rounded-lg hover:bg-white/15 transition-colors">
          <X className="text-lg" />
        </button>
      </div>

      {!isCollapsed && !loading && currentPhase && (
        <div className="mx-3 mt-2 px-3 py-2 bg-white/10 rounded-xl">
          <div className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Active Phase</div>
          <div className="text-white text-xs font-bold truncate">{currentPhase.name}</div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto p-2 sidebar-nav">
        {navLinks.map((link, index) => {
          const showSection = index === 0 || navLinks[index - 1].section !== link.section;
          return (
            <React.Fragment key={link.to}>
              {showSection && !isCollapsed && (
                <div className={`text-[10px] font-bold uppercase tracking-widest text-white/40 px-3 mb-1 ${index !== 0 ? 'pt-3' : 'pt-1'}`}>
                  {link.section}
                </div>
              )}
              <NavLink
                to={link.to}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 outline-none ${isActive ? 'bg-secondary text-white shadow-lg shadow-blue-600/30 font-bold' : 'text-white/80 hover:bg-white/15 hover:text-white'} ${isCollapsed ? 'justify-center w-[44px] h-[44px] mx-auto p-[10px]' : ''}`}
              >
                {React.createElement(link.icon, { className: "w-4 h-4 flex-shrink-0" })}
                {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1">{link.label}</span>}
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>

      <div className="p-2 border-t border-white/10">
        <div onClick={handleLogout} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-white/80 hover:bg-white/15 hover:text-white transition-all duration-200 ${isCollapsed ? 'justify-center w-[44px] h-[44px] mx-auto p-[10px]' : ''}`} title="Logout">
          <LogOut className="w-4 h-4 flex-shrink-0" />
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

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const roleLabel = 'FYP Office In-charge';

  const navLinks = [
    { to: '/office-incharge/dashboard', icon: Home, label: 'Dashboard', section: 'Overview' },
    { to: '/office-incharge/phases', icon: ToggleRight, label: 'Phase Control', section: 'Overview' },
    { to: '/office-incharge/rubrics', icon: ClipboardList, label: 'Rubric Builder', section: 'Curriculum & Sessions' },
    { to: '/office-incharge/sessions', icon: Calendar, label: 'Academic Sessions', section: 'Curriculum & Sessions' },
    { to: '/office-incharge/supervision-requests', icon: UserPlus, label: 'Supervision Requests', section: 'Governance & Oversight' },
    { to: '/office-incharge/committee-oversight', icon: Users, label: 'Committee Oversight', section: 'Governance & Oversight' },
    { to: '/office-incharge/grievances', icon: Scale, label: 'Grievances & SLAs', section: 'Governance & Oversight' },
    { to: '/office-incharge/faculty-reports', icon: BarChart3, label: 'Faculty Reports', section: 'Analytics & Logs' },
    { to: '/office-incharge/student-reports', icon: GraduationCap, label: 'Student Reports', section: 'Analytics & Logs' },
    { to: '/office-incharge/audit-log', icon: History, label: 'System Audit Logs', section: 'Analytics & Logs' },
  ];

  return (
    <div className="flex h-screen overflow-hidden relative bg-lightbg selection:bg-secondary/20 font-poppins">

      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} user={user} roleLabel={roleLabel} navLinks={navLinks} handleLogout={handleLogout} />

      {isMobileOpen && (
        <div onClick={() => setIsMobileOpen(false)} className="fixed inset-0 bg-black/50 z-[40] lg:hidden backdrop-blur-sm"></div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden w-full transition-all duration-300 ease-in-out">

        <div className="bg-white border-b border-gray-100 px-3 md:px-6 h-14 md:h-16 flex items-center justify-between shadow-sm flex-shrink-0 z-[30] gap-3">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <button onClick={() => { window.innerWidth >= 1024 ? setIsCollapsed(!isCollapsed) : setIsMobileOpen(true); }} className="w-9 h-9 rounded-xl bg-gray-50 border-0 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-all cursor-pointer flex-shrink-0">
              <Menu className="text-sm" />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm md:text-base font-bold text-primary leading-tight truncate">Dashboard</h2>
              <p className="text-[10px] text-gray-400 leading-tight hidden sm:block">CUI Abbottabad</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            {!loading && currentPhase && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-blue-700 whitespace-nowrap">{currentPhase.name}</span>
              </div>
            )}

            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="w-9 h-9 rounded-xl bg-gray-50 border-0 cursor-pointer flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-secondary transition-all relative">
                <Bell className="text-sm" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {showNotif && (
                <div className="absolute right-0 top-11 bg-white border border-gray-100 rounded-2xl w-80 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-primary">Notifications</span>
                    <button onClick={() => { toast.success('All notifications marked as read'); setShowNotif(false); }} className="text-[10px] font-bold text-secondary hover:underline bg-transparent border-0 cursor-pointer">Mark all read</button>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    <div className="flex items-start gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/80 cursor-pointer transition-colors bg-blue-50/30">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5"><AlertCircle className="text-xs" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-900">Grievance SLA Breach Warning</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">Grievance #GRV-089 has exceeded the 14-day resolution window.</p>
                        <p className="text-[9px] text-gray-300 font-bold mt-1.5">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-xs font-bold shadow-sm flex-shrink-0">
                  <User className="text-sm" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-gray-800 leading-tight truncate max-w-28">{user.name || 'Dr. Sara Malik'}</div>
                  <div className="text-[10px] text-gray-400 leading-tight font-bold">In-charge</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 bg-lightbg scroll-smooth" onClick={() => setShowNotif(false)}>
          <div className="max-w-[1600px] mx-auto w-full animate-[fadeIn_0.3s_ease-out]">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>
    </div>
  );
};

const InchargeLayout = () => (
  <PhaseProvider>
    <LayoutInner />
  </PhaseProvider>
);

export default InchargeLayout;


