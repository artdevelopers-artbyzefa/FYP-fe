import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCircle, 
  Users, 
  UserCheck, 
  Lightbulb, 
  ClipboardList, 
  LogOut, 
  ChevronDown, 
  ChevronUp,
  GraduationCap
} from 'lucide-react';
import { logoutUser } from '../services/auth.service';
import { toast } from 'sonner';

const Sidebar = () => {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({
    partners: true,
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
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive 
        ? 'bg-white/10 text-white shadow-lg shadow-black/5' 
        : 'text-blue-100/70 hover:bg-white/5 hover:text-white'
    }`;

  const subMenuClass = ({ isActive }) => 
    `flex items-center gap-3 pl-12 pr-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
      isActive 
        ? 'text-white font-semibold' 
        : 'text-blue-100/60 hover:text-white hover:bg-white/5'
    }`;

  return (
    <div className="w-72 bg-[#1e3a8a] h-screen text-white flex flex-col p-6 fixed left-0 top-0 overflow-y-auto border-r border-white/5 shadow-2xl z-50">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 backdrop-blur-sm">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-display font-black text-lg tracking-tight leading-none">CUI DFYP</span>
          <span className="text-[10px] font-bold text-blue-200/60 uppercase tracking-[0.2em] mt-1">Student Portal</span>
        </div>
      </div>

      <nav className="flex-grow space-y-8">
        {/* Overview Section */}
        <div>
          <p className="px-4 text-[11px] font-black text-blue-200/40 uppercase tracking-[0.2em] mb-3">Overview</p>
          <NavLink to="/dashboard" className={menuClass}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-semibold text-[15px]">Dashboard</span>
          </NavLink>
        </div>

        {/* Account Section */}
        <div>
          <p className="px-4 text-[11px] font-black text-blue-200/40 uppercase tracking-[0.2em] mb-3">Account</p>
          <NavLink to="/profile" className={menuClass}>
            <UserCircle className="w-5 h-5" />
            <span className="font-semibold text-[15px]">My Profile</span>
          </NavLink>
        </div>

        {/* Group & Supervisor Section */}
        <div>
          <p className="px-4 text-[11px] font-black text-blue-200/40 uppercase tracking-[0.2em] mb-3">Group & Supervisor</p>
          <div className="space-y-1">
            <button 
              onClick={() => toggleMenu('partners')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-blue-100/70 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <span className="font-semibold text-[15px]">FYP Partners</span>
              </div>
              {openMenus.partners ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {openMenus.partners && (
              <div className="space-y-1 mt-1">
                <NavLink to="/partners/new" className={subMenuClass}>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  New Request
                </NavLink>
                <NavLink to="/partners/requests" className={subMenuClass}>
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent border border-blue-400"></span>
                  Incoming Requests
                </NavLink>
              </div>
            )}

            <NavLink to="/supervisor-selection" className={menuClass}>
              <UserCheck className="w-5 h-5" />
              <span className="font-semibold text-[15px]">Supervisor Selection</span>
            </NavLink>
          </div>
        </div>

        {/* Project Execution Section */}
        <div>
          <p className="px-4 text-[11px] font-black text-blue-200/40 uppercase tracking-[0.2em] mb-3">Project Execution</p>
          <div className="space-y-1">
            <button 
              onClick={() => toggleMenu('project')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-blue-100/70 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5" />
                <span className="font-semibold text-[15px]">Project Idea</span>
              </div>
              {openMenus.project ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {openMenus.project && (
              <div className="space-y-1 mt-1">
                <NavLink to="/project/new" className={subMenuClass}>New Idea</NavLink>
                <NavLink to="/project/approved" className={subMenuClass}>Approved Ideas</NavLink>
              </div>
            )}

            <NavLink to="/task-manager" className={menuClass}>
              <ClipboardList className="w-5 h-5" />
              <span className="font-semibold text-[15px]">Task Manager</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Logout at bottom */}
      <div className="pt-6 mt-6 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-200/70 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-[15px]">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
