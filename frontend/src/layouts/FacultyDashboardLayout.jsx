import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, User, Calendar, FileText, CheckCircle } from 'lucide-react';
import { getUserInfo } from '../utils/app.utils';
import FacultySidebar from '../components/FacultySidebar/FacultySidebar';

export default function FacultyDashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserInfo() || { 
    id: 'AROOJ71004', 
    name: 'Dr. Ali Hassan', 
    avatar: 'AH', 
    role: 'Faculty Supervisor',
    designation: 'Assoc. Prof.' 
  };

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleMarkAllAsRead = () => {
    setHasUnread(false);
    setShowNotifications(false);
    setToast({ show: true, message: 'All notifications marked as read' });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };
  const path = location.pathname;

  // Map paths to header titles
  const pageTitles = {
    '/faculty/dashboard': 'Faculty Dashboard',
    '/faculty/research-tags': 'Research Profile & Tags',
    '/faculty/availability': 'Availability Grid',
    '/faculty/proposals': 'Student Proposals',
    '/faculty/groups': 'Supervised Groups',
    '/faculty/messages': 'Student Messaging',
    '/faculty/evaluations': 'Committee Evaluations',
    '/faculty/head-management': 'Head Management'
  };

  const pageTitle = pageTitles[path] || 'Faculty Dashboard';

  return (
    <div className="flex h-screen overflow-hidden relative bg-[#f1f5f9]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      
      {/* Sidebar Navigation */}
      <FacultySidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden w-full transition-all duration-300 ease-in-out lg:ml-[260px]">
        
        {/* Top Header */}
        <header className="bg-white border-b border-blue-100 px-4 md:px-6 h-16 flex items-center justify-between shadow-sm flex-shrink-0 z-[30] gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Back Button */}
            <button 
              onClick={() => navigate(-1)} 
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-primary transition-all border border-blue-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="min-w-0">
              <h2 className="text-base md:text-lg font-bold text-[#1e3a8a] leading-tight truncate">{pageTitle}</h2>
              <p className="text-[11px] text-slate-500 leading-tight hidden sm:block font-medium">
                COMSATS University Islamabad, Abbottabad Campus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            {/* Mobile Hamburger menu */}
            <button 
              onClick={() => setMobileSidebarOpen(true)} 
              className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-primary transition-all border-0 lg:hidden flex-shrink-0"
            >
              <span className="text-xl"></span>
            </button>

            {/* Status Capsule */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-100 rounded-full text-xs font-bold text-secondary whitespace-nowrap">
              <User className="w-3.5 h-3.5" />
              <span>Faculty Supervisor · Committee Head</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-primary transition-all border border-blue-100"
              >
                <Bell className="w-4 h-4" />
                {hasUnread && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full border border-white"></span>}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-blue-100 z-50 overflow-hidden animate-in fade-in slide-in-">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-blue-100 bg-white/50">
                    <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                    <button onClick={handleMarkAllAsRead} className="text-xs font-semibold text-[#2563eb] hover:underline">Mark all as read</button>
                  </div>
                  
                  {hasUnread ? (
                    <div className="max-h-80 overflow-y-auto">
                      <div className="px-5 py-4 border-b border-blue-100 hover:bg-white/50 transition-colors cursor-pointer flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-primary shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900">New Project Proposal Submitted</h4>
                          <p className="text-[11px] text-slate-600 leading-relaxed">Group G-042 submitted proposal "AI Traffic Management System" for your review.</p>
                          <p className="text-[10px] text-slate-500 font-medium">2 hours ago</p>
                        </div>
                      </div>
                      <div className="px-5 py-4 hover:bg-white/50 transition-colors cursor-pointer flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-primary shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900">Committee Defense Scheduled</h4>
                          <p className="text-[11px] text-slate-600 leading-relaxed">PEC-1 defense evaluations are scheduled for May 20, 2026.</p>
                          <p className="text-[10px] text-slate-500 font-medium">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-sm font-bold text-slate-500">No new notifications</p>
                    </div>
                  )}

                  <div className="px-5 py-3 border-t border-blue-100 bg-white text-center">
                    <button className="text-xs font-semibold text-slate-600 hover:text-primary">View All Notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Card */}
            <Link to="/faculty/dashboard" className="flex items-center gap-2.5 p-1 px-2 py-1 bg-white rounded-xl cursor-pointer border border-blue-100 hover:bg-blue-50 hover:border-primary transition-all">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-primary text-xs font-black shadow-sm flex-shrink-0">
                {user.avatar || 'FS'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-28">
                  {user.id || 'AROOJ71004'}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight font-bold mt-0.5">
                  {user.designation || 'Assoc. Prof.'}
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 bg-[#f8fafc] scroll-smooth relative">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>

      {/* Layout-level Toast */}
      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in- slide-in- duration-300">
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl text-sm font-bold bg-slate-800 text-white border border-slate-700">
            <CheckCircle className="w-5 h-5 text-white shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}
