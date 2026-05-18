import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Spacer to reserve space for the fixed sidebar */}
      <div className="w-72 shrink-0" />
      
      {/* Sidebar - Fixed on the left */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-grow min-h-screen min-w-0">
        {/* Dynamic Content */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

