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
          return baseClass + 'bg-blue-100 text-blue-700 font-semibold';
        }
        return baseClass + 'text-slate-600 hover:bg-blue-50 hover:text-blue-700';
      }}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarItem;
