import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f4f7fe] font-poppins">
      {/* Desktop Sidebar Spacer */}
      <div className="hidden lg:block w-[260px] shrink-0" />
      
      {/* Sidebar - Fixed on left, drawer on mobile */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-grow min-h-screen min-w-0 flex flex-col">
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-[#1e3a8a] text-white flex items-center justify-between p-4 shadow-md sticky top-0 z-40 select-none">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors focus:outline-none flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-extrabold text-[16px] tracking-tight">CUI DFYP Student Portal</span>
          </div>
        </header>

        {/* Dynamic Content Outlet */}
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

