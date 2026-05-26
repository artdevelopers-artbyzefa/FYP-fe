import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, logout } from '../../utils/app.utils';
import { getAssignedProjects, submitScorecard, getIndustryNotifications } from '../../services/industry.service';
import { showToast as toast } from '../../components/AppToast';
import { Bell, CheckCheck, CheckCircle, FileText, GitBranch, Landmark, Lock, LogOut, Menu, Pencil, StarHalf, User, X } from 'lucide-react';

/* ─── Color palette from Figma ────────────────────────────────────────────────
   primary  : #2B3990   (sidebar bg)
   secondary: #2563EB   (active nav, buttons)
   lightbg  : #EFF6FF   (main bg)
   success  : #059669
   warning  : #D97706
   danger   : #DC2626
─────────────────────────────────────────────────────────────────────────────── */

const STATUS_BADGE = {
  pending: 'bg-white',
  submitted: 'bg-white',
};

export default function IndustrySupervisorDashboard() {
  const navigate = useNavigate();
  const user = getUserInfo() || { name: 'Engr. Kamran Shah', avatar: 'KS' };

  /* ── State ──────────────────────────────────────────────────────────────── */
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [scoringLocked, setScoringLocked] = useState(false);
  const [scores, setScores] = useState({ relevance: 30, innovation: 32, presentation: 28 });
  const [remarks, setRemarks] = useState('');
  const notifRef = useRef(null);

  /* ── Load data ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    getAssignedProjects().then(setProjects);
    getIndustryNotifications().then(setNotifications);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Helpers ────────────────────────────────────────────────────────────── */
  const goTo = (view, project) => {
    if (project) setSelectedGroup(project);
    setActiveView(view);
    setMobileSidebarOpen(false);
  };

  const handleLogout = () => { logout(); };

  const totalScore = scores.relevance + scores.innovation + scores.presentation;

  const handleScorecardSubmit = async (e) => {
    e.preventDefault();
    if (!remarks.trim()) { toast.error('Please enter your evaluation remarks.'); return; }
    const payload = {
      groupId: selectedGroup?.groupId,
      scores: [
        { criterion: 'Industrial Relevance & Practicality', weight: 35, score: scores.relevance },
        { criterion: 'Innovation & Technical Depth',        weight: 35, score: scores.innovation },
        { criterion: 'Presentation & Defense Quality',      weight: 30, score: scores.presentation },
      ],
      remarks,
    };
    await submitScorecard(payload);
    setScoringLocked(true);
    setProjects(prev => prev.map(p => p.groupId === selectedGroup?.groupId ? { ...p, evaluationStatus: 'submitted' } : p));
    toast.success('Scorecard locked and submitted successfully!');
    setTimeout(() => goTo('dashboard', null), 1500);
  };

  /* ── Nav items ──────────────────────────────────────────────────────────── */
  const navItems = [
    { id: 'dashboard', label: 'Assigned Projects', icon: GitBranch, section: 'Evaluation Console' },
    { id: 'scoring',   label: 'Rubric Scoring',    icon: StarHalf,   section: null },
  ];

  const pageTitle = navItems.find(n => n.id === activeView)?.label || 'Dashboard';
  const unreadCount = notifications.filter(n => !n.read).length;

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: '#EFF6FF' }}>

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside
        id="industry-sidebar"
        style={{ backgroundColor: '#2B3990', width: sidebarCollapsed ? 68 : 256, minWidth: sidebarCollapsed ? 68 : 256 }}
        className={`flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden z-50 h-full border-r border-white/10 shadow-2xl
          fixed lg:relative
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 relative flex-shrink-0">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <Landmark className="text-white text-sm" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden transition-all duration-300">
              <div className="text-white text-sm font-black whitespace-nowrap tracking-wide">CUI ABBOTTABAD</div>
              <div className="text-white/60 text-[11px] whitespace-nowrap leading-tight font-semibold">Industry Supervisor</div>
            </div>
          )}
          <button onClick={() => setMobileSidebarOpen(false)} className="ml-auto lg:hidden bg-transparent border-0 text-white cursor-pointer p-1 rounded-lg hover:bg-white/15 transition-colors absolute right-4">
            <X className="text-lg" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1" style={{ scrollbarWidth: 'none' }}>
          {navItems.map((item, idx) => (
            <React.Fragment key={item.id}>
              {item.section && !sidebarCollapsed && (
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-3 mb-2 pt-2">{item.section}</div>
              )}
              <button
                onClick={() => goTo(item.id, null)}
                title={sidebarCollapsed ? item.label : ''}
                style={activeView === item.id ? { backgroundColor: '#2563EB' } : {}}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 text-left
                  ${activeView === item.id ? 'text-white shadow-lg font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'}
                  ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                {React.createElement(item.icon, { className: "w-4 h-4" })}
                {!sidebarCollapsed && <span className="text-sm font-medium whitespace-nowrap flex-1">{item.label}</span>}
              </button>
            </React.Fragment>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10 bg-black/10 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-white/80 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 font-bold ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="text-sm w-5 text-center flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" />
      )}

      {/* ═══════════════ MAIN ═══════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">

        {/* TOPBAR */}
        <header className="bg-white border-b border-black px-4 md:px-6 h-16 flex items-center justify-between shadow-sm flex-shrink-0 z-30 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileSidebarOpen(true)} className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-black hover:bg-white transition-all border-0 lg:hidden flex-shrink-0 cursor-pointer">
              <Menu className="text-sm" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(p => !p)}
              className="hidden lg:flex w-9 h-9 rounded-xl bg-white items-center justify-center text-black hover:bg-white transition-all border-0 flex-shrink-0 cursor-pointer"
            >
              <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-sm`}></i>
            </button>
            <div className="min-w-0">
              <h2 className="text-base font-black leading-tight truncate" style={{ color: '#2B3990' }}>{pageTitle}</h2>
              <p className="text-[11px] text-black leading-tight hidden sm:block font-medium">COMSATS University Islamabad, Abbottabad Campus</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Role badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-black rounded-xl text-xs font-bold text-black whitespace-nowrap shadow-sm">
              <User className="text-black" />
              <span>Industry Supervisor</span>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(p => !p)} className="w-9 h-9 rounded-xl bg-white border border-black flex items-center justify-center text-black hover:bg-white transition-all cursor-pointer relative">
                <Bell className="text-sm" />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-white rounded-full border-2 border-white animate-pulse"></span>}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-black overflow-hidden z-[100]">
                  <div className="p-4 bg-white border-b border-black flex items-center justify-between">
                    <span className="text-sm font-black text-black">Notifications</span>
                    <button onClick={() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); toast.success('All notifications marked as read'); }} className="text-xs font-bold text-black hover:underline cursor-pointer">Mark all as read</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-black">
                    {notifications.length === 0 ? (
                      <p className="p-8 text-center text-xs text-black font-bold">No notifications</p>
                    ) : notifications.map(n => (
                      <div key={n.id} className={`p-4 hover:bg-blue-50/50 transition-colors flex gap-3 items-start border-l-4 ${n.read ? 'border-transparent' : 'border-blue-500 bg-blue-50/20'}`}>
                        <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          <i className={`fas fa-${n.icon}`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-black">{n.title}</div>
                          <div className="text-[11px] text-black mt-0.5">{n.body}</div>
                          <div className="text-[10px] text-black mt-1 font-bold">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-white border-t border-black text-center">
                    <button className="text-xs font-bold text-black hover:text-black transition-colors cursor-pointer">View All Notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-white rounded-xl cursor-pointer border border-black hover:bg-white hover:border-black transition-all">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black text-xs font-bold shadow-sm flex-shrink-0">
                {user.avatar || 'KS'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-black leading-tight truncate max-w-28">{user.name}</div>
                <div className="text-[10px] text-black leading-tight font-bold">External</div>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth" style={{ backgroundColor: '#EFF6FF' }}>
          <div className="max-w-[1600px] mx-auto w-full">

            {/* ── VIEW: ASSIGNED PROJECTS ── */}
            {activeView === 'dashboard' && (
              <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                {/* Welcome banner */}
                <div className="rounded-[2rem] p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-black shadow-sm"
                  >
                  <div className="text-white">
                    <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">External Evaluation Portal</h1>
                    <p className="text-sm text-white/80 font-medium max-w-2xl leading-relaxed">
                      Welcome, {user.name}. Review assigned final year projects, download thesis documents, and input external evaluation scores per HEC/CUI standards.
                    </p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {projects.filter(p => p.evaluationStatus === 'pending').length > 0 && (
                      <button
                        onClick={() => goTo('scoring', projects.find(p => p.evaluationStatus === 'pending'))}
                        className="bg-white hover:bg-white text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <StarHalf className="w-4 h-4" />
                        Pending Evaluations ({projects.filter(p => p.evaluationStatus === 'pending').length})
                      </button>
                    )}
                  </div>
                </div>

                {/* Projects table */}
                <div className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden mb-8">
                  <div className="p-5 bg-white border-b border-black">
                    <h3 className="text-base font-black text-black">Assigned Projects Roster</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/75 border-b border-black text-[11px] font-black text-black uppercase tracking-wider">
                          <th className="py-3.5 px-6">Project Title &amp; Group ID</th>
                          <th className="py-3.5 px-6">Internal Supervisor</th>
                          <th className="py-3.5 px-6">Thesis Document</th>
                          <th className="py-3.5 px-6 text-center">Evaluation Status</th>
                          <th className="py-3.5 px-6 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black text-sm font-medium text-black">
                        {projects.map(p => (
                          <tr key={p.groupId} className="hover:bg-white/50 transition-colors">
                            <td className="py-4 px-6">
                              <div>
                                <span className="font-bold text-black block">{p.title}</span>
                                <span className="text-xs text-black font-mono">Group {p.groupId} · {p.members} Members</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-black font-bold">{p.internalSupervisor}</td>
                            <td className="py-4 px-6">
                              <button onClick={() => toast.info(`Downloading ${p.thesisFile}...`)} className="text-xs font-bold text-black hover:underline">
                                <FileText className="w-4 h-4 mr-1" />{p.thesisFile}
                              </button>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className={`font-bold px-2.5 py-1 rounded-lg text-xs ${STATUS_BADGE[p.evaluationStatus]}`}>
                                {p.evaluationStatus === 'pending' ? 'Pending Scorecard' : 'Submitted '}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              {p.evaluationStatus === 'pending' ? (
                                <button
                                  onClick={() => goTo('scoring', p)}
                                  className="px-3 py-1.5 rounded-lg text-white hover:bg-black text-xs font-bold transition-all cursor-pointer shadow-sm"
                                  style={{ backgroundColor: '#2563EB' }}
                                >
                                  <Pencil className="w-4 h-4 mr-1" />Input Score
                                </button>
                              ) : (
                                <span className="text-xs text-black font-bold">Locked</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── VIEW: RUBRIC SCORING ── */}
            {activeView === 'scoring' && (
              <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                <div className="border-b border-black pb-4 mb-6">
                  <h2 className="text-xl font-black text-black">External Evaluation Rubric Scoring</h2>
                  <p className="text-xs text-black mt-0.5 font-medium">Input scores against HEC/CUI external evaluation criteria. Final submission locks the scorecard permanently.</p>
                </div>

                <div className="bg-white rounded-[2rem] border border-black shadow-sm p-6 sm:p-8 mb-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-black gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-black text-black text-lg">
                          Group {selectedGroup?.groupId}: {selectedGroup?.title}
                        </span>
                        <span className="bg-white text-black font-bold text-xs px-3 py-1 rounded-xl border border-black shadow-sm">External Evaluation</span>
                      </div>
                      <p className="text-xs text-black font-bold">Internal Supervisor: {selectedGroup?.internalSupervisor} · {selectedGroup?.members} Students</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-black">
                      <span className="text-xs font-bold text-black">Evaluation Rubric:</span>
                      <span className="text-xs font-black" style={{ color: '#2B3990' }}>HEC External Evaluation Rubric v2.0</span>
                    </div>
                  </div>

                  {scoringLocked ? (
                    <div className="p-6 bg-white border border-black rounded-2xl text-center">
                      <CheckCircle className="text-black text-3xl mb-3" />
                      <h3 className="font-black text-black mb-1">Scorecard Submitted Successfully</h3>
                      <p className="text-xs text-black">This evaluation has been locked and cannot be modified. Redirecting...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleScorecardSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <span className="text-xs font-bold text-black uppercase tracking-wider block mb-2">External Criteria Scorecard Input</span>

                        {[
                          { key: 'relevance',     label: 'Industrial Relevance & Practicality', max: 35 },
                          { key: 'innovation',    label: 'Innovation & Technical Depth',        max: 35 },
                          { key: 'presentation',  label: 'Presentation & Defense Quality',      max: 30 },
                        ].map(c => (
                          <div key={c.key} className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 bg-white rounded-2xl border border-black items-center">
                            <div>
                              <span className="block font-black text-black text-xs mb-1">{c.label}</span>
                              <span className="text-[10px] font-bold text-black bg-white px-2 py-0.5 rounded border border-black">Weight: {c.max}%</span>
                            </div>
                            <div className="sm:col-span-2 flex items-center gap-4">
                              <input
                                type="range" min="0" max={c.max}
                                value={scores[c.key]}
                                onChange={e => setScores(prev => ({ ...prev, [c.key]: +e.target.value }))}
                                className="w-full cursor-pointer accent-blue-600"
                              />
                              <span className="font-black text-black text-sm w-16 text-right whitespace-nowrap">{scores[c.key]} / {c.max}</span>
                            </div>
                          </div>
                        ))}

                        <div className="p-4 bg-white border border-black rounded-2xl flex items-center justify-between">
                          <span className="text-sm font-black text-black">Total Score</span>
                          <span className="text-2xl font-black" style={{ color: '#2B3990' }}>{totalScore} / 100</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-black mb-1.5">External Evaluator Remarks &amp; Industrial Feedback</label>
                        <textarea
                          value={remarks}
                          onChange={e => setRemarks(e.target.value)}
                          placeholder="Provide detailed industrial feedback regarding the commercial viability and technical implementation of the project..."
                          className="w-full bg-white border border-black rounded-xl px-4 py-3 text-sm outline-none focus:border-black focus:bg-white transition-all h-28 resize-none"
                          required
                        />
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-black flex items-start gap-3">
                        <Lock className="text-black text-xl mt-0.5" />
                        <div className="text-xs">
                          <span className="block font-black text-black mb-1">Submission Lock Warning</span>
                          <p className="text-black leading-relaxed">Submitting this scorecard will lock your external evaluation permanently. No subsequent modifications will be permitted without HOD executive override.</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-black flex justify-between items-center gap-3">
                        <button type="button" onClick={() => goTo('dashboard', null)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-black hover:bg-white transition-colors cursor-pointer">
                          ← Back to Projects
                        </button>
                        <button
                          type="submit"
                          className="text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer flex items-center gap-2"
                          style={{ backgroundColor: '#2563EB' }}
                        >
                          <CheckCheck className="w-4 h-4" /> Confirm &amp; Lock Submission
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}
