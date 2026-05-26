import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  User, 
  Users, 
  Lightbulb, 
  ClipboardList, 
  LogOut, 
  ChevronDown, 
  ChevronUp,
  GraduationCap
} from 'lucide-react';
import { logoutUser } from '../services/auth.service';
import { showToast as toast } from './AppToast';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({
    partners: false,
    project: false
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const menuClass = ({ isActive }) => 
    `flex items-center gap-3.5 px-4 py-3 rounded-[16px] transition-all duration-200 group font-poppins font-semibold text-[15px] ${
      isActive 
        ? 'bg-[#2563eb] text-white shadow-lg shadow-[#2563eb]/20' 
        : 'text-blue-100/70 hover:bg-white/5 hover:text-white'
    }`;

  const subMenuClass = ({ isActive }) => 
    `flex items-center gap-2.5 pl-12 pr-4 py-2.5 rounded-xl text-[13.5px] font-medium font-poppins transition-all duration-200 ${
      isActive 
        ? 'text-white font-bold' 
        : 'text-[#93c5fd]/70 hover:text-white'
    }`;

  const subMenuHeaderClass = (menuOpen) => 
    `w-full flex items-center justify-between px-4 py-3 rounded-[16px] transition-all duration-200 font-poppins font-semibold text-[15px] ${
      menuOpen 
        ? 'text-white' 
        : 'text-blue-100/70 hover:bg-white/5 hover:text-white'
    }`;

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Custom Styles to Hide Scrollbar Track */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Backdrop overlay on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-white/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <div className={`w-[260px] bg-[#1e3a8a] h-screen text-white flex flex-col p-6 fixed left-0 top-0 border-r border-white/5 shadow-2xl z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Logo */}
        <div className="flex items-center gap-3.5 mb-8 px-2 shrink-0">
          <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-sm shadow-sm shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[17px] tracking-tight leading-none text-white font-poppins">CUI DFYP</span>
            <span className="text-[11px] font-bold text-black/60 uppercase tracking-[0.1em] mt-1 font-poppins">Student Portal</span>
          </div>
        </div>

        {/* Scrollable Nav Area */}
        <nav className="flex-grow overflow-y-auto pr-1 -mr-2 space-y-7 select-none no-scrollbar">
          {/* Overview Section */}
          <div>
            <p className="px-4 text-[10.5px] font-bold text-[#93c5fd]/50 uppercase tracking-[0.08em] mb-2.5 block font-poppins">Overview</p>
            <NavLink to="/dashboard" onClick={handleLinkClick} className={menuClass}>
              <Home className="w-5 h-5 shrink-0" />
              <span>Dashboard</span>
            </NavLink>
          </div>

          {/* Account Section */}
          <div>
            <p className="px-4 text-[10.5px] font-bold text-[#93c5fd]/50 uppercase tracking-[0.08em] mb-2.5 block font-poppins">Account</p>
            <NavLink to="/profile" onClick={handleLinkClick} className={menuClass}>
              <User className="w-5 h-5 shrink-0" />
              <span>My Profile</span>
            </NavLink>
          </div>

          {/* Group & Supervisor Section */}
          <div>
            <p className="px-4 text-[10.5px] font-bold text-[#93c5fd]/50 uppercase tracking-[0.08em] mb-2.5 block font-poppins">Group & Supervisor</p>
            <div className="space-y-1">
              <button 
                onClick={() => toggleMenu('partners')}
                className={subMenuHeaderClass(openMenus.partners)}
              >
                <div className="flex items-center gap-3.5">
                  <Users className="w-5 h-5 shrink-0" />
                  <span>FYP Partners</span>
                </div>
                {openMenus.partners ? <ChevronUp className="w-4 h-4 text-black/60" /> : <ChevronDown className="w-4 h-4 text-black/60" />}
              </button>
              
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openMenus.partners ? 'max-h-[120px] opacity-100 mt-1' : 'max-h-0 opacity-0 pointer-events-none'
              }`}>
                <div className="space-y-0.5 mt-0.5">
                  <NavLink to="/partners/new" onClick={handleLinkClick} className={subMenuClass}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0"></span>
                    New Request
                  </NavLink>
                  <NavLink to="/partners/requests" onClick={handleLinkClick} className={subMenuClass}>
                    <span className="w-1.5 h-1.5 rounded-full bg-transparent border border-black shrink-0"></span>
                    Incoming Requests
                  </NavLink>
                </div>
              </div>

              <NavLink to="/supervisor-selection" onClick={handleLinkClick} className={menuClass}>
                <User className="w-5 h-5 shrink-0" />
                <span className="whitespace-nowrap">Supervisor Selection</span>
              </NavLink>
            </div>
          </div>

          {/* Project Execution Section */}
          <div>
            <p className="px-4 text-[10.5px] font-bold text-[#93c5fd]/50 uppercase tracking-[0.08em] mb-2.5 block font-poppins">Project Execution</p>
            <div className="space-y-1">
              <button 
                onClick={() => toggleMenu('project')}
                className={subMenuHeaderClass(openMenus.project)}
              >
                <div className="flex items-center gap-3.5">
                  <Lightbulb className="w-5 h-5 shrink-0" />
                  <span>Project Idea</span>
                </div>
                {openMenus.project ? <ChevronUp className="w-4 h-4 text-black/60" /> : <ChevronDown className="w-4 h-4 text-black/60" />}
              </button>
              
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openMenus.project ? 'max-h-[120px] opacity-100 mt-1' : 'max-h-0 opacity-0 pointer-events-none'
              }`}>
                <div className="space-y-0.5 mt-0.5">
                  <NavLink to="/project/new" onClick={handleLinkClick} className={subMenuClass}>New Idea</NavLink>
                  <NavLink to="/project/approved" onClick={handleLinkClick} className={subMenuClass}>Approved Ideas</NavLink>
                </div>
              </div>

              <NavLink to="/task-manager" onClick={handleLinkClick} className={menuClass}>
                <ClipboardList className="w-5 h-5 shrink-0" />
                <span>Project Management</span>
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Logout Option at Bottom */}
        <div className="pt-6 mt-6 border-t border-white/10 shrink-0">
          <button 
            onClick={() => {
              handleLinkClick();
              handleLogout();
            }}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-[16px] text-black/70 hover:bg-white/5 hover:text-white transition-all duration-200 font-poppins font-semibold text-[15px]"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
