import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ to, icon: Icon, label, onClick }) => {
  return (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) => {
        const baseClass = 'flex items-center gap-3.5 px-4 py-3 rounded-[16px] transition-all duration-200 group font-poppins font-semibold text-[15px] ';
        if (isActive) {
          return baseClass + 'bg-sidebar-active text-white font-semibold';
        }
        return baseClass + 'text-white hover:bg-white/10 hover:text-white';
      }}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarItem;
