import React, { useEffect, useState } from 'react';
import { getInchargeFacultyReports, getInchargeFacultyDetail, getInchargeFacultyGroupDetail } from '../../services/office-incharge.service';
import { Search, ArrowLeft, Users, BookOpen, Code, Mail, User, GraduationCap, ChevronRight, ExternalLink, Send, FileText, BarChart3, Lock, Star, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { GROUP_STATUS_MAP, IDEA_STATUS_MAP } from '../../utils/constants/status.constant';
import api from '../../services/api';
import { FacultyOverviewSkeleton } from '../../components/Skeleton';



const InchargeFacultyReports = () => {
  const [view, setView] = useState('list');
  const [faculties, setFaculties] = useState([]);
  const [faculty, setFaculty] = useState(null);
  const [groupDetail, setGroupDetail] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false);
  const [committees, setCommittees] = useState([]);
  const [showCommDetails, setShowCommDetails] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getInchargeFacultyReports(),
      api.get('/office-assistant/eval-committee')
    ]).then(([reports, commRes]) => {
      setFaculties(reports.data || []);
      setCommittees(commRes.data?.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const getFacultyCommittees = (facultyId, facultyName) => {
    const matched = [];
    (committees || []).forEach(c => {
      const members = c.members || [];
      const isMember = members.some(m => {
        if (typeof m === 'string') return m === facultyId;
        return (m.id === facultyId || m._id === facultyId || m.name === facultyName);
      });
      const isHead = c.headId === facultyId || c.head === facultyName;
      if (isMember || isHead) {
        matched.push({ ...c, role: isHead ? 'Head' : 'Member' });
      }
    });
    return matched;
  };

  const openFaculty = async (id) => {
    setFacultyLoading(true);
    setView('faculty');
    try {
      const res = await getInchargeFacultyDetail(id);
      setFaculty(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFacultyLoading(false);
    }
  };

  const openGroup = async (facultyId, groupId) => {
    setGroupLoading(true);
    setView('group');
    try {
      const res = await getInchargeFacultyGroupDetail(facultyId, groupId);
      setGroupDetail(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setGroupLoading(false);
    }
  };

  const goBackToList = () => { setView('list'); setFaculty(null); setGroupDetail(null); setSelectedIdea(null); };
  const goBackToFaculty = () => { setView('faculty'); setGroupDetail(null); setSelectedIdea(null); };
  const goBackToGroup = () => { setView('group'); setSelectedIdea(null); };

  if (view === 'faculty' && facultyLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading faculty details...</span>
      </div>
    );
  }

  if (view === 'group' && groupLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading group details...</span>
      </div>
    );
  }

  if (view === 'faculty' && faculty) {
    const facultyComms = getFacultyCommittees(faculty._id, faculty.name);
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4">
          <button onClick={goBackToList} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3">
            <ArrowLeft size={14} /> Back to Faculty Overview
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xl shrink-0">
              {faculty.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{faculty.name}</h2>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Mail size={12} /> {faculty.email}</span>
                <span className="flex items-center gap-1"><GraduationCap size={12} /> {faculty.dept}</span>
              </div>
            </div>
          </div>
        </div>

        {facultyComms.length > 0 && (
          <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
            <button
              onClick={() => setShowCommDetails(!showCommDetails)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer border-0 bg-transparent text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Star size={16} />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">Committee Assignment</h5>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {facultyComms.length === 1
                      ? `${facultyComms[0].role} of ${facultyComms[0].name}`
                      : `Member of ${facultyComms.length} committees`}
                  </p>
                </div>
              </div>
              {showCommDetails ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {showCommDetails && (
              <div className="border-t border-line divide-y divide-line">
                {facultyComms.map(c => (
                  <div key={c.id || c.name} className="px-6 py-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{c.name}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ${c.role === 'Head' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                          {c.role}
                        </span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ${c.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {c.status === 'active' ? 'Active' : c.status || 'N/A'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block mb-0.5">Committee Head</span>
                        <span className="font-bold text-slate-900">{c.head || 'Not assigned'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block mb-0.5">Members ({c.members?.length || 0})</span>
                        <div className="flex flex-wrap gap-1">
                          {(c.members || []).map((m, i) => {
                            const mName = typeof m === 'string' ? m : (m.name || '');
                            return (
                              <span key={i} className="text-[9px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                                {mName}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
          <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Evaluation Phases</h5>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <ResponsiveContainer width={220} height={220}>
              <PieChart>
                <Pie data={[
                  { name: 'Phase 1 (10%)', value: 10, fill: '#94a3b8' },
                  { name: 'Phase 2 (30%)', value: 30, fill: '#94a3b8' },
                  { name: 'Phase 3 (60%)', value: 60, fill: '#94a3b8' },
                  { name: 'Phase 4 (100%)', value: 100, fill: '#94a3b8' },
                ]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" startAngle={90} endAngle={-270}>
                  {[0, 1, 2, 3].map((_, i) => (
                    <Cell key={i} fill='#e2e8f0' stroke='#cbd5e1' />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {[
                { phase: 'Phase 1', weight: '10%', desc: 'Proposal & SRS Evaluation', locked: true },
                { phase: 'Phase 2', weight: '30%', desc: 'Mid-Term Evaluation', locked: true },
                { phase: 'Phase 3', weight: '60%', desc: 'Final Evaluation', locked: true },
                { phase: 'Phase 4', weight: '100%', desc: 'Complete Assessment', locked: true },
              ].map((ph, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                    <Lock size={13} className="text-slate-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">{ph.phase}</span>
                      <span className="text-xs font-bold text-slate-400">{ph.weight}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{ph.desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-200 text-slate-500 text-[9px] font-bold">
                    <Lock size={10} /> Upcoming
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {(!faculty.groups || faculty.groups.length === 0) ? (
          <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
            <Users className="w-10 h-10" />
            <p className="text-sm font-bold">No supervised groups</p>
            <p className="text-xs">This faculty member has no groups assigned yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {faculty.groups.map(g => (
              <div key={g._id} onClick={() => openGroup(faculty._id, g._id)}
                className="bg-white rounded-2xl border border-line p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{g.fypTitle || g.name || 'Untitled Group'}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${GROUP_STATUS_MAP[g.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                    {GROUP_STATUS_MAP[g.status]?.label || g.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                  <Users size={12} /> {g.memberCount} members
                  {g.session && <><span className="text-gray-300">|</span> <Clock size={12} /> {g.session}</>}
                </div>
                {g.ideas?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {g.ideas.slice(0, 2).map((idea, i) => (
                      <span key={i} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${IDEA_STATUS_MAP[idea.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        {idea.title?.slice(0, 20)}{idea.title?.length > 20 ? '...' : ''}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 pt-3 border-t border-line">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${g.progress || 0}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{g.progress || 0}%</span>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (view === 'idea' && selectedIdea) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4">
          <button onClick={goBackToGroup} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3">
            <ArrowLeft size={14} /> Back to {groupDetail?.fypTitle || 'Group'}
          </button>
          <h2 className="text-xl font-bold text-slate-900">{selectedIdea.title}</h2>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${IDEA_STATUS_MAP[selectedIdea.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
              {IDEA_STATUS_MAP[selectedIdea.status]?.label || selectedIdea.status}
            </span>
            <span className="bg-slate-50 text-slate-700 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-slate-200">Submitted by {selectedIdea.submittedBy}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {selectedIdea.description && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><BookOpen size={13} /> Description</h5>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedIdea.description}</p>
              </div>
            )}
            {selectedIdea.techStack && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><Code size={13} /> Technology Stack</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedIdea.techStack.split(',').map((t, i) => (
                    <span key={i} className="bg-gray-50 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg border border-line">{t.trim()}</span>
                  ))}
                </div>
              </div>
            )}
            {selectedIdea.feedback && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><FileText size={13} /> Feedback</h5>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedIdea.feedback}</p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Idea Details</h5>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className={`font-bold px-2 py-0.5 rounded-lg border ${IDEA_STATUS_MAP[selectedIdea.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                    {IDEA_STATUS_MAP[selectedIdea.status]?.label || selectedIdea.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Submitted By</span>
                  <span className="font-bold text-slate-900">{selectedIdea.submittedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Group</span>
                  <span className="font-bold text-slate-900">{groupDetail?.name || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'group' && groupDetail) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4">
          <button onClick={goBackToFaculty} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3">
            <ArrowLeft size={14} /> Back to {faculty?.name || 'Faculty'}
          </button>
          <h2 className="text-xl font-bold text-slate-900">{groupDetail.fypTitle || groupDetail.name || 'Group Detail'}</h2>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${GROUP_STATUS_MAP[groupDetail.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
              {GROUP_STATUS_MAP[groupDetail.status]?.label || groupDetail.status}
            </span>
            {groupDetail.session && <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-blue-200">{groupDetail.session}</span>}
            {groupDetail.forwardedToFypOffice && <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1"><Send size={10} /> Forwarded to FYP Office</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {groupDetail.ideas?.length > 0 && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><FileText size={13} /> Project Ideas</h5>
                <div className="space-y-3">
                  {groupDetail.ideas.map((idea, i) => (
                    <div key={i} onClick={() => { setSelectedIdea(idea); setView('idea'); }} className="p-4 rounded-xl border border-line cursor-pointer hover:border-blue-200 hover:bg-blue-50/20 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-bold text-slate-900 text-sm">{idea.title}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${IDEA_STATUS_MAP[idea.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                          {IDEA_STATUS_MAP[idea.status]?.label || idea.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">Submitted by {idea.submittedBy}</p>
                      {idea.feedback && <p className="text-xs text-slate-500 mt-1">Feedback: {idea.feedback}</p>}
                      {idea.description && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{idea.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {groupDetail.evaluations?.length > 0 && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><BarChart3 size={13} /> Evaluations</h5>
                <div className="space-y-2">
                  {groupDetail.evaluations.map((ev, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-line">
                      <div>
                        <span className="text-sm font-bold text-slate-900">{ev.evaluator}</span>
                        <span className="text-[10px] text-slate-400 ml-2">{ev.phase}</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">{ev.totalScore}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><User size={13} /> Supervision</h5>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-0.5">Supervisor</span>
                  <span className="font-bold text-slate-900 text-sm">{groupDetail.supervisor?.name || 'N/A'}</span>
                  {groupDetail.supervisor?.email && <p className="text-[10px] text-slate-400">{groupDetail.supervisor.email}</p>}
                </div>
                {groupDetail.coSupervisor && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-0.5">Co-Supervisor</span>
                    <span className="font-bold text-slate-900 text-sm">{groupDetail.coSupervisor.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><Users size={13} /> Team Members ({groupDetail.memberCount})</h5>
              <div className="space-y-2">
                {groupDetail.members?.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-line">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">{m.name?.charAt(0)}</div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{m.name}</div>
                      <div className="text-[10px] text-gray-400 truncate">{m.regNo || m.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Progress</h5>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${groupDetail.progress || 0}%` }} />
                </div>
                <span className="text-sm font-black text-slate-900">{groupDetail.progress || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <h2 className="text-xl font-bold text-slate-900">Faculty Supervision Reports</h2>
        <p className="text-xs text-slate-900 mt-0.5 font-medium">Per-faculty analysis of supervision load, log approval rates, and evaluation performance</p>
      </div>

      {loading ? <FacultyOverviewSkeleton /> : (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-50 border-b border-line text-[11px] font-bold text-slate-900 tracking-wider">
                  <th className="py-3.5 px-6">Faculty Name</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6 text-center">Supervised Groups</th>
                  <th className="py-3.5 px-6 text-center">Committee</th>
                  <th className="py-3.5 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-900">
                {faculties.map((r, idx) => {
                  const facComms = getFacultyCommittees(r._id, r.name);
                  return (
                    <tr key={r._id || idx} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                            {r.name?.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-900">{r.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs">{r.email}</td>
                      <td className="py-4 px-6 text-slate-900">{r.dept}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-bold text-slate-900">{r.groups}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {facComms.length > 0 ? (
                          <span className="text-xs font-bold text-slate-900 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                            {facComms.map(c => c.name).join(', ')}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button onClick={() => openFaculty(r._id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all cursor-pointer border-0">
                          <User size={12} /> View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InchargeFacultyReports;
