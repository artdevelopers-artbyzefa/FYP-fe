import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { showToast as toast } from '../AppToast';
import { logoutUser, getCurrentUser } from '../../services/auth.service';
import api from '../../services/api';
import { Bell, ChevronLeft, ChevronRight, Crown, Gavel, GitBranch, Landmark, LineChart, Lock, LogOut, Menu, PieChart, Presentation, Shield, User, UserCheck, Users, X, Camera, Loader2, Mail, KeyRound } from 'lucide-react';

const HodLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [passStep, setPassStep] = useState('email'); // email | code
  const [passForm, setPassForm] = useState({ email: '', code: '', newPassword: '', confirmPassword: '' });
  const [passSubmitting, setPassSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const user = getCurrentUser() ?? null;

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const roleLabel = 'Head of Department';

  const navLinks = [
    { to: '/hod/dashboard', icon: PieChart, label: 'Dashboard', section: 'Executive' },
    { to: '/hod/escalations', icon: Gavel, label: 'Escalated Grievances', section: 'Grievance & Escalations' },
    { to: '/hod/students', icon: Users, label: 'Students', section: 'Department Oversight' },
    { to: '/hod/faculty', icon: UserCheck, label: 'Faculty', section: 'Department Oversight' },
    { to: '/hod/projects', icon: GitBranch, label: 'Project Directory', section: 'Department Oversight' },
    { to: '/hod/faculty-oversight', icon: Presentation, label: 'Faculty Workload', section: 'Department Oversight', locked: true },
    { to: '/hod/governance', icon: Landmark, label: 'Oversight', section: 'Department Oversight', locked: true },
    { to: '/hod/committees', icon: Shield, label: 'FYP Committees', section: 'Department Oversight' },
    { to: '/hod/analytics', icon: LineChart, label: 'FYP Analytics', section: 'Department Oversight', locked: true },
  ];

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!passForm.email.trim()) { toast.error('Email is required.'); return; }
    setPassSubmitting(true);
    try {
      await api.post('/auth/forgot-password', { email: passForm.email.trim() });
      toast.success('Verification code sent to your email.');
      setPassStep('code');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send code.');
    } finally {
      setPassSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (passForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setPassSubmitting(true);
    try {
      await api.post('/auth/reset-password', {
        email: passForm.email.trim(),
        code: passForm.code.trim(),
        password: passForm.newPassword
      });
      toast.success('Password changed successfully.');
      setShowProfileModal(false);
      setPassStep('email');
      setPassForm({ email: '', code: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password.');
    } finally {
      setPassSubmitting(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.post('/user/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const picUrl = res.data?.data?.profilepicture;
      if (picUrl) {
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        stored.profilepicture = picUrl;
        localStorage.setItem('user', JSON.stringify(stored));
      }
      toast.success('Profile picture updated.');
      window.location.reload();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to upload picture.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative bg-surface selection:bg-blue-100 selection:text-blue-900 font-poppins">
      <div 
        className={`bg-[#1a237e] border-r border-white/10 flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden fixed lg:relative z-[50] h-full ${isMobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'lg:w-[68px]' : 'w-64 lg:w-64'}`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <Landmark className="text-white" size={16} />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="text-white text-sm font-bold whitespace-nowrap">CUI DIMS</div>
              <div className="text-blue-300 text-xs whitespace-nowrap leading-tight">{roleLabel}</div>
            </div>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} className="ml-auto hidden lg:flex bg-transparent border-0 text-blue-200 cursor-pointer flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors">
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
          <button onClick={() => setIsMobileOpen(false)} className="ml-auto lg:hidden bg-transparent border-0 text-blue-200 cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 sidebar-nav">
          {navLinks.map((link, index) => {
            const showSection = index === 0 || navLinks[index - 1].section !== link.section;
            return (
              <React.Fragment key={link.to}>
                {showSection && !isCollapsed && (
                  <div className={`text-[10px] font-bold uppercase tracking-widest text-blue-300/60 px-3 mb-1 ${index !== 0 ? 'pt-3' : 'pt-1'}`}>
                    {link.section}
                  </div>
                )}
                {link.locked ? (
                  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-300/60 cursor-not-allowed select-none ${isCollapsed ? 'justify-center w-[44px] h-[44px] mx-auto p-[10px]' : ''}`} title={`${link.label} — locked during Phase 1`}>
                    {React.createElement(link.icon, { size: 16, className: "flex-shrink-0" })}
                    {!isCollapsed && (
                      <>
                        <span className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1">{link.label}</span>
                        <Lock size={12} className="flex-shrink-0 text-blue-300/60" />
                      </>
                    )}
                  </div>
                ) : (
                <NavLink 
                  to={link.to} 
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${isActive ? 'bg-[#1565c0] text-white font-semibold' : 'text-white hover:bg-white/10 hover:text-white'} ${isCollapsed ? 'justify-center w-[44px] h-[44px] mx-auto p-[10px]' : ''}`}
                >
                  {React.createElement(link.icon, { size: 16, className: "flex-shrink-0" })}
                  {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1">{link.label}</span>}
                </NavLink>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        <div className="p-2 pt-4">
          <div onClick={handleLogout} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-white hover:bg-white/10 hover:text-red-400 transition-all duration-200 ${isCollapsed ? 'justify-center w-[44px] h-[44px] mx-auto p-[10px]' : ''}`} title="Logout">
            <LogOut size={16} className="flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <div onClick={() => setIsMobileOpen(false)} className="fixed inset-0 bg-black/30 z-[40] lg:hidden" />
      )}

      <div className="flex-1 flex flex-col overflow-hidden w-full transition-all duration-300 ease-in-out">
        <div className="bg-white border-b border-line px-3 md:px-6 h-14 md:h-16 flex items-center justify-between flex-shrink-0 z-[30] gap-3">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <button onClick={() => { window.innerWidth >= 1024 ? setIsCollapsed(!isCollapsed) : setIsMobileOpen(true); }} className="w-9 h-9 rounded-xl bg-blue-50 border-0 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all cursor-pointer flex-shrink-0 focus-visible:ring-2 focus-visible:ring-blue-500">
              <Menu size={15} />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm md:text-base font-bold text-slate-900 leading-tight truncate">Executive Portal</h2>
              <p className="text-[10px] text-slate-400 leading-tight hidden sm:block">CUI Abbottabad</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl text-[10px] font-semibold text-blue-700 whitespace-nowrap">
              <Crown size={13} />
              <span>Head of Department</span>
            </div>

            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="w-9 h-9 rounded-xl bg-blue-50 border-0 cursor-pointer flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all relative focus-visible:ring-2 focus-visible:ring-blue-500">
                <Bell size={15} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              {showNotif && (
                <div className="absolute right-0 top-11 bg-white border border-line rounded-2xl w-80 shadow-dropdown z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-line flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-900">HOD Notifications</span>
                    <button onClick={() => { toast.success('All notifications marked as read'); setShowNotif(false); }} className="text-[10px] font-semibold text-blue-600 hover:underline bg-transparent border-0 cursor-pointer">Mark all read</button>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    <div className="flex items-start gap-3 px-4 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors bg-blue-50/30">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5"><Gavel size={12} /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900">Grievance Escalation Alert</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">FYP Office In-charge escalated Grievance #GRV-089 for HOD binding decision.</p>
                        <p className="text-[9px] text-slate-300 font-semibold mt-1.5">30 mins ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <div
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 flex-shrink-0 overflow-hidden">
                  {user?.profilepicture ? (
                    <img src={user.profilepicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-28">{user?.name || 'HOD'}</div>
                  <div className="text-[10px] text-slate-400 leading-tight font-medium">HOD CS</div>
                </div>
              </div>

              {showProfile && (
                <div className="absolute right-0 top-11 bg-white border border-line rounded-2xl w-56 shadow-dropdown z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-line">
                    <div className="text-xs font-semibold text-slate-900">{user?.name || 'HOD'}</div>
                    <div className="text-[10px] text-slate-400">{user?.email || ''}</div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { setShowProfile(false); setShowProfileModal(true); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-blue-50 transition-colors cursor-pointer bg-transparent border-0 text-left"
                    >
                      <User size={14} /> My Profile
                    </button>
                    <button
                      onClick={() => { setShowProfile(false); handleLogout(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-0 text-left"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 bg-surface scroll-smooth" onClick={() => setShowNotif(false)}>
          <div className="max-w-[1600px] mx-auto w-full animate-fadeSlideUp">
            <Outlet />
          </div>
        </main>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">My Profile</h3>
              <button onClick={() => { setShowProfileModal(false); setPassStep('email'); setPassForm({ email: '', code: '', newPassword: '', confirmPassword: '' }); }} className="w-8 h-8 rounded-lg bg-gray-50 border-0 flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="relative w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 overflow-hidden mb-3">
                {user?.profilepicture ? (
                  <img src={user.profilepicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={28} />
                )}
                <label className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer border-2 border-white hover:bg-blue-700 transition-colors">
                  {uploadingAvatar ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
              <div className="text-sm font-bold text-gray-800">{user?.name || 'HOD'}</div>
              <div className="text-xs text-gray-400">{user?.email || ''}</div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h4 className="text-xs font-bold text-gray-500 mb-4 flex items-center gap-2"><KeyRound size={14} /> Change Password</h4>

              {passStep === 'email' ? (
                <form onSubmit={handleSendCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" value={passForm.email} onChange={e => setPassForm(f => ({ ...f, email: e.target.value }))} placeholder="Enter your email" className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" required />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" disabled={passSubmitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 transition-all cursor-pointer border-0 disabled:opacity-50 flex items-center gap-2">
                      {passSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {passSubmitting ? 'Sending...' : 'Send Verification Code'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Verification Code</label>
                    <input type="text" value={passForm.code} onChange={e => setPassForm(f => ({ ...f, code: e.target.value }))} placeholder="6-digit code from email" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all font-mono tracking-widest text-center" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">New Password</label>
                    <input type="password" value={passForm.newPassword} onChange={e => setPassForm(f => ({ ...f, newPassword: e.target.value }))} placeholder="At least 6 characters" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Confirm New Password</label>
                    <input type="password" value={passForm.confirmPassword} onChange={e => setPassForm(f => ({ ...f, confirmPassword: e.target.value }))} placeholder="Re-enter new password" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" required />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <button type="button" onClick={() => setPassStep('email')} className="text-xs text-gray-500 hover:text-gray-700 font-medium bg-transparent border-0 cursor-pointer">Back</button>
                    <button type="submit" disabled={passSubmitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 transition-all cursor-pointer border-0 disabled:opacity-50 flex items-center gap-2">
                      {passSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {passSubmitting ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HodLayout;
