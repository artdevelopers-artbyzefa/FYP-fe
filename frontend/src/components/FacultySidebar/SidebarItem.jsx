import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ to, icon: Icon, label, onClick }) => {
  const isHeadManagement = label === 'Head Management';

  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) => {
        let baseClass = 'flex items-center gap-3.5 px-4 py-3 rounded-[16px] transition-all duration-200 group font-poppins font-semibold text-[15px] ';
        let colorClass = '';

        if (isActive) {
          if (isHeadManagement) {
            colorClass = 'bg-[#2563eb] text-yellow-400 shadow-lg shadow-[#2563eb]/20';
          } else {
            colorClass = 'bg-[#2563eb] text-white shadow-lg shadow-[#2563eb]/20';
          }
        } else {
          if (isHeadManagement) {
            colorClass = 'text-yellow-400 hover:bg-white/5 hover:text-yellow-300';
          } else {
            colorClass = 'text-blue-100/70 hover:bg-white/5 hover:text-white';
          }
        }

        return baseClass + colorClass;
      }}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarItem;
