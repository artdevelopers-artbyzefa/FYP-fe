import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { getUserInfo } from '../../utils/app.utils';
import FacultySidebar from '../../components/FacultySidebar/FacultySidebar';
import { Bell, ChevronDown, Menu } from 'lucide-react';

export default function FacultySupervisorLayout() {
  const location = useLocation();
  const user = getUserInfo() ?? null;

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const path = location.pathname;

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const pageTitles = {
    '/faculty/dashboard': 'Dashboard',
    '/faculty/research-tags': 'Research Tags',
    '/faculty/availability': 'Availability Grid',
    '/faculty/proposals': 'Supervision Requests',
    '/faculty/groups': 'Supervised Groups',
    '/faculty/messages': 'Student Messaging',
    '/faculty/evaluations': 'Committee Evaluations',
    '/faculty/head-management': 'Head Management'
  };

  const pageTitle = pageTitles[path] || 'Dashboard';

  return (
    <div className="flex h-screen overflow-hidden relative bg-surface selection:bg-blue-100 selection:text-blue-900 font-poppins">
      
      <FacultySidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden w-full transition-all duration-300 ease-in-out lg:ml-[260px]">
        
        <div className="bg-white border-b border-line px-3 md:px-6 h-14 md:h-16 flex items-center justify-between flex-shrink-0 z-[30] gap-3">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <button onClick={() => setMobileSidebarOpen(true)} className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all border-0 lg:hidden flex-shrink-0 focus-visible:ring-2 focus-visible:ring-blue-500">
              <Menu size={15} />
            </button>
            
            <div className="min-w-0">
              <h2 className="text-sm md:text-base font-bold text-slate-900 leading-tight truncate">{pageTitle}</h2>
              <p className="text-[10px] text-slate-400 leading-tight hidden sm:block">CUI Abbottabad | <span>{currentDate}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <div className="relative">
              <button className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all focus-visible:ring-2 focus-visible:ring-blue-500">
                <Bell size={15} />
              </button>
            </div>

            <Link to="/faculty/dashboard" className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-all focus-visible:ring-2 focus-visible:ring-blue-500">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                {user.avatar || 'FS'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-28">{user.name}</div>
                <div className="text-[10px] text-slate-400 leading-tight font-medium">{user.role}</div>
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
}
