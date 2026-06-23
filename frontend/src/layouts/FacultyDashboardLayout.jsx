import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, User, Calendar, FileText, CheckCircle, Menu } from 'lucide-react';
import { getUserInfo } from '../utils/app.utils';
import FacultySidebar from '../components/FacultySidebar/FacultySidebar';

export default function FacultyDashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserInfo() ?? null;

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

  const pageTitles = {
    '/faculty/dashboard': 'Faculty Dashboard',
    '/faculty/research-tags': 'Research Profile & Tags',
    '/faculty/availability': 'Availability Grid',
    '/faculty/proposals': 'Supervision Requests',
    '/faculty/groups': 'Supervised Groups',
    '/faculty/messages': 'Student Messaging',
    '/faculty/evaluations': 'Committee Evaluations',
    '/faculty/head-management': 'Head Management'
  };

  const pageTitle = pageTitles[path] || 'Faculty Dashboard';

  return (
    <div className="flex h-screen overflow-hidden relative bg-surface font-poppins">
      
      <FacultySidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden w-full transition-all duration-300 ease-in-out lg:ml-[260px]">
        
        <header className="bg-white border-b border-line px-4 md:px-6 h-16 flex items-center justify-between flex-shrink-0 z-[30] gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={() => navigate(-1)} 
              className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="min-w-0">
              <h2 className="text-base md:text-lg font-bold text-slate-900 leading-tight truncate">{pageTitle}</h2>
              <p className="text-[11px] text-slate-400 leading-tight hidden sm:block font-medium">
                COMSATS University Islamabad, Abbottabad Campus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            <button 
              onClick={() => setMobileSidebarOpen(true)} 
              className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all border-0 lg:hidden flex-shrink-0 focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Menu size={15} />
            </button>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl text-xs font-semibold text-blue-700 whitespace-nowrap">
              <User size={13} />
              <span>Faculty Supervisor - Committee Head</span>
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Bell size={15} />
                {hasUnread && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
              </button>
              
              {showNotifications && (
                <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-dropdown border border-line z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                    <button onClick={handleMarkAllAsRead} className="text-xs font-semibold text-blue-600 hover:underline">Mark all as read</button>
                  </div>
                  
                  {hasUnread ? (
                    <div className="max-h-80 overflow-y-auto">
                      <div className="px-5 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                          <FileText size={15} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900">New Project Proposal Submitted</h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed">Group G-042 submitted proposal "AI Traffic Management System" for your review.</p>
                          <p className="text-[10px] text-slate-400 font-medium">2 hours ago</p>
                        </div>
                      </div>
                      <div className="px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                          <Calendar size={15} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900">Committee Defense Scheduled</h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed">PEC-1 defense evaluations are scheduled for May 20, 2026.</p>
                          <p className="text-[10px] text-slate-400 font-medium">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-sm font-bold text-slate-400">No new notifications</p>
                    </div>
                  )}

                  <div className="px-5 py-3 border-t border-line bg-white text-center">
                    <button className="text-xs font-semibold text-slate-500 hover:text-blue-600">View All Notifications</button>
                  </div>
                </div>
              )}
            </div>

            <Link to="/faculty/dashboard" className="flex items-center gap-2.5 p-1 px-2 py-1 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-all focus-visible:ring-2 focus-visible:ring-blue-500">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                {user.avatar || 'FS'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-28">
                  {user.id || 'AROOJ71004'}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight font-medium mt-0.5">
                  {user.designation || 'Assoc. Prof.'}
                </div>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 bg-surface scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full animate-fadeSlideUp">
            <Outlet context={{ user }} />
          </div>
        </main>
      </div>

      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-bold bg-blue-900 text-white border border-blue-800 shadow-dropdown">
            <CheckCircle size={18} className="text-emerald-400 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
