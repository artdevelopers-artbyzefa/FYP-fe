import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { showToast as toast } from '../AppToast';
import { logoutUser, getCurrentUser } from '../../services/auth.service';
import { Bell, ChevronLeft, ChevronRight, Crown, Gavel, Landmark, LineChart, LogOut, Menu, PieChart, Presentation, X } from 'lucide-react';

const HodLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const navigate = useNavigate();

  const user = getCurrentUser() || { name: 'Prof. Dr. Zafar Ali', avatar: 'ZA' };

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navLinks = [
    { to: '/hod/dashboard', icon: PieChart, label: 'Dashboard', section: 'Executive' },
    { to: '/hod/escalations', icon: Gavel, label: 'Escalated Grievances', section: 'Grievance & Escalations' },
    { to: '/hod/faculty-oversight', icon: Presentation, label: 'Faculty Workload', section: 'Department Oversight' },
    { to: '/hod/governance', icon: Landmark, label: 'Governance Oversight', section: 'Department Oversight' },
    { to: '/hod/analytics', icon: LineChart, label: 'FYP Analytics', section: 'Department Oversight' },
  ];

  return (
    <div className="flex h-screen overflow-hidden relative bg-white font-poppins selection:bg-blue-600 selection:text-white">
      
      {/* SIDEBAR */}
      <div 
        className={`bg-blue-600 flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden fixed lg:relative z-[50] h-full ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'lg:w-[68px] sidebar-collapsed' : 'w-64 lg:w-64'} border-r border-white/10 shadow-2xl lg:shadow-none`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 relative">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <Landmark className="text-white text-sm" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden transition-all duration-300">
              <div className="text-white text-sm font-black whitespace-nowrap tracking-wide">CUI ABBOTTABAD</div>
              <div className="text-white/60 text-[11px] whitespace-nowrap leading-tight font-semibold">Head of Department</div>
            </div>
          )}
          <button onClick={() => setIsMobileOpen(false)} className="ml-auto lg:hidden bg-transparent border-0 text-white cursor-pointer p-1 rounded-lg hover:bg-white/15 transition-colors absolute right-4">
            <X className="text-lg" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1" style={{ scrollbarWidth: 'none' }}>
          {navLinks.map((link, index) => {
            const showSection = index === 0 || navLinks[index - 1].section !== link.section;
            return (
              <React.Fragment key={link.to}>
                {showSection && !isCollapsed && (
                  <div className={`text-[10px] font-bold uppercase tracking-widest text-white/40 px-3 mb-2 ${index !== 0 ? 'pt-4' : 'pt-2'}`}>
                    {link.section}
                  </div>
                )}
                <NavLink 
                  to={link.to} 
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-lg font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'} ${isCollapsed ? 'justify-center w-[44px] h-[44px] mx-auto p-[10px]' : ''}`}
                >
                  {React.createElement(link.icon, { className: "w-4 h-4" })}
                  {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap flex-1">{link.label}</span>}
                </NavLink>
              </React.Fragment>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 bg-blue-600/10">
          <div onClick={handleLogout} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-white/80 hover:bg-blue-600/10 transition-all duration-200 font-bold ${isCollapsed ? 'justify-center w-[44px] h-[44px] mx-auto p-[10px]' : ''}`} title="Logout">
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="text-sm">Logout</span>}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div onClick={() => setIsMobileOpen(false)} className="fixed inset-0 bg-blue-600/50 z-[40] lg:hidden backdrop-blur-sm"></div>
      )}

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col overflow-hidden w-full transition-all duration-300 ease-in-out">
        
        {/* TOPBAR */}
        <div className="bg-white border-b border-black px-4 md:px-6 h-16 flex items-center justify-between shadow-sm flex-shrink-0 z-[30] gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setIsMobileOpen(true)} className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-black hover:bg-white hover:text-blue-600 transition-all border-0 lg:hidden flex-shrink-0">
              <Menu className="text-sm" />
            </button>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex w-9 h-9 rounded-xl bg-white items-center justify-center text-black hover:bg-white hover:text-blue-600 transition-all border-0 flex-shrink-0 cursor-pointer">
                            {isCollapsed ? <ChevronRight className="text-sm" /> : <ChevronLeft className="text-sm" />}
            </button>
            <div className="min-w-0">
              <h2 className="text-base font-black text-black leading-tight truncate">Executive Portal</h2>
              <p className="text-[11px] text-black leading-tight hidden sm:block font-medium">COMSATS University Islamabad, Abbottabad Campus</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-black rounded-xl text-xs font-bold text-black whitespace-nowrap shadow-sm">
              <Crown className="text-black" />
              <span>Head of Department</span>
            </div>

            {/* Notification Center */}
            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="w-9 h-9 rounded-xl bg-white border border-black flex items-center justify-center text-black hover:bg-white hover:text-blue-600 transition-all cursor-pointer relative">
                <Bell className="text-sm" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-white rounded-full border-2 border-white animate-pulse"></span>
              </button>
              
              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-black overflow-hidden z-[100] animate-in fade-in-50 duration-200">
                  <div className="p-4 bg-white border-b border-black flex items-center justify-between">
                    <span className="text-sm font-black text-black">HOD Notifications</span>
                    <button onClick={() => {toast.success('All notifications marked as read'); setShowNotif(false);}} className="text-xs font-bold text-black hover:underline cursor-pointer">Mark all as read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-blue-600">
                    <div className="p-4 hover:bg-white/50 transition-colors flex gap-3 items-start border-l-4 border-black bg-white/20">
                      <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center text-xs flex-shrink-0 mt-0.5"><Gavel className="w-4 h-4" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-black">Grievance Escalation Alert</div>
                        <div className="text-[11px] text-black mt-0.5">FYP Office In-charge escalated Grievance #GRV-089 (Evaluation Dispute) for HOD binding decision.</div>
                        <div className="text-[10px] text-black mt-1 font-bold">30 mins ago</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-white border-t border-black text-center">
                    <button onClick={() => navigate('/hod/escalations')} className="text-xs font-bold text-black hover:text-blue-600 transition-colors cursor-pointer">View All</button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-white rounded-xl cursor-pointer border border-black hover:bg-white hover:border-blue-600 transition-all">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black text-xs font-bold shadow-sm flex-shrink-0">
                  <span>{user.avatar || 'ZA'}</span>
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-black leading-tight truncate max-w-28">{user.name || 'Prof. Dr. Zafar Ali'}</div>
                  <div className="text-[10px] text-black leading-tight font-bold">HOD CS</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-white scroll-smooth relative">
          <div className="max-w-[1600px] mx-auto w-full animate-[fadeIn_0.3s_ease-out]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HodLayout;
