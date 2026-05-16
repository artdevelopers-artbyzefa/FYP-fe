import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar - Fixed width */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-grow min-h-screen">
        {/* Dynamic Content */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

