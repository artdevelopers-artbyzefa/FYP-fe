import React from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import { 
  DashboardIcon, 
  TagIcon, 
  CalendarIcon, 
  ProposalsIcon, 
  GroupsIcon, 
  MessagesIcon, 
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
        { to: '/faculty/research-tags', label: 'Research Tags', icon: TagIcon },
        { to: '/faculty/availability', label: 'Availability Grid', icon: CalendarIcon }
      ]
    },
    {
      title: 'SUPERVISION WORKFLOWS',
      items: [
        { to: '/faculty/proposals', label: 'Supervision Requests', icon: ProposalsIcon },
        { to: '/faculty/groups', label: 'Supervised Groups', icon: GroupsIcon },
        { to: '/faculty/messages', label: 'Student Messaging', icon: MessagesIcon }
      ]
    },
    {
      title: 'COMMITTEE DUTIES',
      items: [
        { to: '/faculty/evaluations', label: 'Committee Evaluations', icon: EvaluationsIcon },
        { to: '/faculty/head-management', label: 'Head Management', icon: HeadManagementIcon }
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
            <UniversityIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[16px] tracking-tight leading-none text-white font-poppins uppercase">CUI ABBOTTABAD</span>
            <span className="text-[13px] font-medium text-white/60 mt-1.5 font-poppins">Faculty Supervisor</span>
          </div>
        </div>

        {/* Scrollable Nav Area */}
        <nav className="flex-grow overflow-y-auto pr-1 -mr-2 space-y-7 select-none no-scrollbar">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              <p className="px-4 text-[10.5px] font-bold text-[#93c5fd]/50 uppercase tracking-[0.08em] mb-2.5 block font-poppins">
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
        <div className="pt-6 mt-6 border-t border-white/10 shrink-0">
          <button 
            onClick={() => {
              handleLinkClick();
              handleLogout();
            }}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-[16px] text-white/90 hover:bg-white/5 hover:text-white transition-all duration-200 font-poppins font-semibold text-[15px]"
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
