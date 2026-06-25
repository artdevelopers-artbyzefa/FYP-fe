import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { showToast as toast } from '../AppToast';
import { logoutUser, getCurrentUser } from '../../services/auth.service';
import { Bell, Calendar, ChevronLeft, ChevronRight, Crown, FileSignature, GitBranch, Landmark, Lightbulb, Lightbulb as IdeaIcon, Lock, LogOut, Menu, Presentation, Star, Tags, X } from 'lucide-react';

const FacultyLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();

  const user = getCurrentUser() ?? null;

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const roleLabel = 'Faculty Portal';

  const navLinks = [
    { to: '/faculty/dashboard', icon: Presentation, label: 'Dashboard', section: 'Overview' },
    { to: '/faculty/profile', icon: Tags, label: 'Committee Suggestion', section: 'Profile & Schedule' },
    { to: '/faculty/availability', icon: Calendar, label: 'Timetable', section: 'Profile & Schedule', locked: true },
    { to: '/faculty/proposals', icon: FileSignature, label: 'Supervision Requests', section: 'FYP Management' },
    { to: '/faculty/group-proposals', icon: Lightbulb, label: 'Group Proposals', section: 'FYP Management' },
    { to: '/faculty/supervision', icon: GitBranch, label: 'Supervised Groups', section: 'FYP Management' },
    { to: '/faculty/suggestions', icon: IdeaIcon, label: 'Suggested Ideas', section: 'FYP Management' },
    { to: '/faculty/evaluations', icon: Star, label: 'Committee Evaluations', section: 'FYP Management', locked: true },
    { to: '/faculty/head-duties', icon: Crown, label: 'Head Management', section: 'FYP Management', locked: true },
  ];

  return (
    <div className="flex h-screen overflow-hidden relative bg-surface selection:bg-blue-100 selection:text-blue-900 font-poppins">
      <div 
        className={`bg-white border-r border-line flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden fixed lg:relative z-[50] h-full ${isMobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'lg:w-[68px]' : 'w-64 lg:w-64'}`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-line">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Landmark className="text-blue-600" size={16} />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="text-slate-900 text-sm font-bold whitespace-nowrap">CUI DIMS</div>
              <div className="text-slate-400 text-xs whitespace-nowrap leading-tight">{roleLabel}</div>
            </div>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} className="ml-auto hidden lg:flex bg-transparent border-0 text-slate-300 cursor-pointer flex-shrink-0 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
          <button onClick={() => setIsMobileOpen(false)} className="ml-auto lg:hidden bg-transparent border-0 text-slate-400 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 sidebar-nav">
          {navLinks.map((link, index) => {
            const showSection = index === 0 || navLinks[index - 1].section !== link.section;
            return (
              <React.Fragment key={link.to}>
                {showSection && !isCollapsed && (
                  <div className={`text-[10px] font-bold text-slate-400 px-3 mb-1 ${index !== 0 ? 'pt-3' : 'pt-1'}`}>
                    {link.section}
                  </div>
                )}
                {link.locked ? (
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 cursor-not-allowed select-none ${isCollapsed ? 'justify-center w-[44px] h-[44px] mx-auto p-[10px]' : ''}`} title={`${link.label} — locked`}>
                    {React.createElement(link.icon, { size: 16, className: "flex-shrink-0" })}
                    {!isCollapsed && (
                      <>
                        <span className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1">{link.label}</span>
                        <Lock size={12} className="flex-shrink-0 text-slate-300" />
                      </>
                    )}
                  </div>
                ) : (
                <NavLink 
                  to={link.to} 
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${isActive ? 'bg-blue-100 text-blue-700 font-semibold' : link.highlight ? 'text-blue-500' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'} ${isCollapsed ? 'justify-center w-[44px] h-[44px] mx-auto p-[10px]' : ''}`}
                >
                  {React.createElement(link.icon, { size: 16, className: "flex-shrink-0" })}
                  {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1">{link.label}</span>}
                </NavLink>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        <div className="p-2 border-t border-line">
          <div onClick={handleLogout} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 ${isCollapsed ? 'justify-center w-[44px] h-[44px] mx-auto p-[10px]' : ''}`} title="Logout">
            <LogOut size={16} className="flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </div>
        </div>
      </div>

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
              <h2 className="text-sm md:text-base font-bold text-slate-900 leading-tight truncate">Faculty Portal</h2>
              <p className="text-[10px] text-slate-400 leading-tight hidden sm:block">CUI Abbottabad</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl text-[10px] font-semibold text-blue-700 whitespace-nowrap">
              <Presentation size={13} />
              <span>Faculty Supervisor</span>
            </div>

            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="w-9 h-9 rounded-xl bg-blue-50 border-0 cursor-pointer flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all relative focus-visible:ring-2 focus-visible:ring-blue-500">
                <Bell size={15} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              {showNotif && (
                <div className="absolute right-0 top-11 bg-white border border-line rounded-2xl w-80 shadow-dropdown z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-line flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-900">Faculty Notifications</span>
                    <button onClick={() => { toast.success('All notifications marked as read'); setShowNotif(false); }} className="text-[10px] font-semibold text-blue-600 hover:underline bg-transparent border-0 cursor-pointer">Mark all read</button>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    <div className="flex items-start gap-3 px-4 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors bg-blue-50/30">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5"><FileSignature size={12} /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900">New Project Proposal Submitted</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">Group G-042 submitted proposal "AI Traffic Management System" for your review.</p>
                        <p className="text-[9px] text-slate-300 font-semibold mt-1.5">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                  <span>{user.avatar || 'AH'}</span>
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-28">{user.name || 'Dr. Ali Hassan'}</div>
                  <div className="text-[10px] text-slate-400 leading-tight font-medium">Faculty</div>
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

export default FacultyLayout;
