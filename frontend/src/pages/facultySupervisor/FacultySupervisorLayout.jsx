import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { getUserInfo } from '../../utils/app.utils';
import FacultySidebar from '../../components/FacultySidebar/FacultySidebar';

export default function FacultySupervisorLayout() {
  const location = useLocation();
  const user = getUserInfo() || { name: 'Faculty Supervisor', avatar: 'FS', role: 'Supervisor' };

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const path = location.pathname;

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  // Map paths to titles
  const pageTitles = {
    '/faculty/dashboard': 'Dashboard',
    '/faculty/research-tags': 'Research Tags',
    '/faculty/availability': 'Availability Grid',
    '/faculty/proposals': 'Student Proposals',
    '/faculty/groups': 'Supervised Groups',
    '/faculty/messages': 'Student Messaging',
    '/faculty/evaluations': 'Committee Evaluations',
    '/faculty/head-management': 'Head Management'
  };

  const pageTitle = pageTitles[path] || 'Dashboard';

  return (
    <div className={`flex h-screen overflow-hidden relative bg-lightbg selection:bg-secondary/20`} style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: '#EFF6FF' }}>
      
      <FacultySidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden w-full transition-all duration-300 ease-in-out lg:ml-[260px]">
        
        <div className="bg-white border-b border-gray-100 px-3 md:px-6 h-14 md:h-16 flex items-center justify-between shadow-sm flex-shrink-0 z-[30] gap-3">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <button onClick={() => setMobileSidebarOpen(true)} className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-[#1e3a8a] transition-all border-0 lg:hidden flex-shrink-0">
              <i className="fas fa-bars text-sm"></i>
            </button>
            
            <div className="min-w-0">
              <h2 className="text-sm md:text-base font-bold text-[#1e3a8a] leading-tight truncate">{pageTitle}</h2>
              <p className="text-[10px] text-gray-400 leading-tight hidden sm:block">CUI Abbottabad · <span>{currentDate}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <div className="relative">
              <button className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-[#2563eb] transition-all">
                <i className="fas fa-bell text-sm"></i>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>

            <Link to="/faculty/dashboard" className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-gray-50 rounded-xl cursor-pointer border border-gray-100 hover:bg-blue-50 hover:border-blue-100 transition-all">
              <div className="w-8 h-8 bg-blue-100/50 rounded-lg flex items-center justify-center text-[#1e3a8a] text-xs font-bold shadow-sm flex-shrink-0">
                {user.avatar || 'FS'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-gray-800 leading-tight truncate max-w-28">{user.name}</div>
                <div className="text-[10px] text-gray-400 leading-tight font-bold">{user.role}</div>
              </div>
              <i className="fas fa-chevron-down text-gray-400 ml-0.5 hidden sm:block text-[9px]"></i>
            </Link>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 bg-lightbg scroll-smooth relative" style={{ backgroundColor: '#EFF6FF' }}>
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
