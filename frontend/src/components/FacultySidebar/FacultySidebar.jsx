import React from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import { 
  DashboardIcon, 
  TagIcon, 
  CalendarIcon, 
  ProposalsIcon, 
  GroupsIcon, 
 
  EvaluationsIcon, 
  HeadManagementIcon, 
  LogoutIcon,
  UniversityIcon
} from '../../assets/icons';
import { logoutUser } from '../../services/auth.service';
import { showToast as toast } from '../AppToast';

const FacultySidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const menuSections = [
    {
      title: 'OVERVIEW',
      items: [
        { to: '/faculty/dashboard', label: 'Dashboard', icon: DashboardIcon }
      ]
    },
    {
      title: 'PROFILE & SCHEDULE',
      items: [
        { to: '/faculty/profile', label: 'Committee Suggestion', icon: TagIcon },
        { to: '/faculty/availability', label: 'Timetable', icon: CalendarIcon, locked: true }
      ]
    },
    {
      title: 'FYP Management',
      items: [
        { to: '/faculty/proposals', label: 'Supervision Requests', icon: ProposalsIcon },
        { to: '/faculty/groups', label: 'Supervised Groups', icon: GroupsIcon },
        { to: '/faculty/evaluations', label: 'Committee Evaluations', icon: EvaluationsIcon, locked: true },
        { to: '/faculty/head-management', label: 'Head Management', icon: HeadManagementIcon, locked: true }
      ]
    }
  ];

  return (
    <>
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
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <div className={`w-[260px] bg-[#1a237e] h-screen text-white flex flex-col p-6 fixed left-0 top-0 border-r border-white/10 shadow-card z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Logo */}
        <div className="flex items-center gap-3.5 mb-8 px-2 shrink-0">
          <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0">
            <UniversityIcon className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm font-bold tracking-tight leading-none font-poppins">CUI ABBOTTABAD</span>
            <span className="text-blue-300 text-xs font-medium mt-1.5 font-poppins">Faculty Supervisor</span>
          </div>
        </div>

        {/* Scrollable Nav Area */}
        <nav className="flex-grow overflow-y-auto pr-1 -mr-2 space-y-7 select-none no-scrollbar">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              <p className="px-4 text-[10.5px] font-bold text-blue-300/60 mb-2.5 block font-poppins">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <SidebarItem 
                    key={itemIdx}
                    to={item.to}
                    label={item.label}
                    icon={item.icon}
                    onClick={handleLinkClick}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout Option at Bottom */}
        <div className="pt-6 mt-8 shrink-0">
          <button 
            onClick={() => {
              handleLinkClick();
              handleLogout();
            }}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-[16px] text-white hover:bg-white/10 hover:text-red-400 transition-all duration-200 font-poppins font-semibold text-[15px]"
          >
            <LogoutIcon className="w-5 h-5 shrink-0" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default FacultySidebar;
