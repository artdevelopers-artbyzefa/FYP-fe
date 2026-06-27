import React, { useEffect, useState, useCallback } from 'react';
import { getOfficeProjects, getPastProjects } from '../../services/office-assistant.service';
import { Search, ArrowLeft, Users, User, BookOpen, Code, Loader2, ChevronRight, Send, FileText, Clock, Calendar, GraduationCap } from 'lucide-react';
import { GROUP_STATUS_MAP, IDEA_STATUS_MAP } from '../../utils/constants/status.constant';

const TABS = [
  { key: 'current', label: 'Current Projects' },
  { key: 'past', label: 'Past Projects' },
];

function SkeletonRow({ cols }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4" /></td>
      ))}
    </tr>
  );
}

export default function AssistantProjects() {
  const [tab, setTab] = useState('current');
  const [projects, setProjects] = useState([]);
  const [pastProjects, setPastProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pastLoading, setPastLoading] = useState(false);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [pastPage, setPastPage] = useState(1);
  const [pastTotal, setPastTotal] = useState(0);
  const [pastTotalPages, setPastTotalPages] = useState(1);

  const loadCurrent = useCallback(() => {
    setLoading(true);
    getOfficeProjects()
      .then(res => setProjects(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadPast = useCallback((p) => {
    setPastLoading(true);
    getPastProjects(p || pastPage, 20, search, '', '')
      .then(res => {
        setPastProjects(res.data || []);
        setPastTotal(res.total || 0);
        setPastTotalPages(res.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setPastLoading(false));
  }, [pastPage, search]);

  useEffect(() => { if (tab === 'current') loadCurrent(); }, [tab, loadCurrent]);
  useEffect(() => { if (tab === 'past') loadPast(); }, [tab, pastPage, loadPast]);

  useEffect(() => {
    if (tab === 'current') {
      loadCurrent();
    } else {
      setPastPage(1);
      loadPast(1);
    }
  }, [search]);

  useEffect(() => { loadCurrent(); }, []);

  const filtered = tab === 'current'
    ? projects.filter(p =>
        !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.supervisor?.toLowerCase().includes(search.toLowerCase()) || p.leader?.toLowerCase().includes(search.toLowerCase())
      )
    : pastProjects.filter(p =>
        !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.supervisor?.name?.toLowerCase().includes(search.toLowerCase()) || p.students?.some(s => s.name?.toLowerCase().includes(search.toLowerCase()))
      );

  if (view === 'detail' && selected) {
    if (tab === 'current') {
      return (
        <div className="space-y-6">
          <div className="border-b border-line pb-4">
            <button onClick={() => { setView('list'); setSelected(null); }} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3">
              <ArrowLeft size={14} /> Back to Project Directory
            </button>
            <h2 className="text-xl font-bold text-slate-900">{selected.title}</h2>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${GROUP_STATUS_MAP[selected.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                {GROUP_STATUS_MAP[selected.status]?.label || selected.status}
              </span>
              {selected.forwardedToFypOffice && <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1"><Send size={10} /> Forwarded</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {selected.description && (
                <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                  <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><BookOpen size={13} /> Description</h5>
                  <p className="text-sm text-slate-700 leading-relaxed">{selected.description}</p>
                </div>
              )}
              {selected.techStack && (
                <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                  <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><Code size={13} /> Technology Stack</h5>
                  <div className="flex flex-wrap gap-2">
                    {selected.techStack.split(',').map((t, i) => (
                      <span key={i} className="bg-gray-50 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg border border-line">{t.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
              {selected.ideas?.length > 0 && (
                <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                  <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><FileText size={13} /> Project Ideas</h5>
                  <div className="space-y-3">
                    {selected.ideas.map((idea, i) => (
                      <div key={i} className="p-4 rounded-xl border border-line">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-bold text-slate-900 text-sm">{idea.title}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${IDEA_STATUS_MAP[idea.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                            {IDEA_STATUS_MAP[idea.status]?.label || idea.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">Submitted by {idea.submittedBy}</p>
                        {idea.feedback && <p className="text-xs text-slate-500 mt-1">Feedback: {idea.feedback}</p>}
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
                    <span className="font-bold text-slate-900 text-sm">{selected.supervisor || 'N/A'}</span>
                    {selected.supervisorEmail && <p className="text-[10px] text-slate-400">{selected.supervisorEmail}</p>}
                  </div>
                  {selected.coSupervisor && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-0.5">Co-Supervisor</span>
                      <span className="font-bold text-slate-900 text-sm">{selected.coSupervisor}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><Users size={13} /> Team Members ({selected.memberCount})</h5>
                <div className="space-y-2">
                  {selected.members?.map((m, i) => (
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
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${selected.progress || 0}%` }} />
                  </div>
                  <span className="text-sm font-black text-slate-900">{selected.progress || 0}%</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Group Info</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Leader</span><span className="font-bold text-slate-900">{selected.leader}</span></div>
                  {selected.leaderEmail && <div className="flex justify-between"><span className="text-slate-400">Leader Email</span><span className="font-bold text-slate-900">{selected.leaderEmail}</span></div>}
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
          <button onClick={() => { setView('list'); setSelected(null); }} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3">
            <ArrowLeft size={14} /> Back to Past Projects
          </button>
          <h2 className="text-xl font-bold text-slate-900">{selected.title}</h2>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-lg border border-slate-200">{selected.session || 'N/A'}</span>
            {selected.domain && <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-0.5 rounded-lg border border-indigo-100">{selected.domain}</span>}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {selected.description && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><BookOpen size={13} /> Description</h5>
                <p className="text-sm text-slate-700 leading-relaxed">{selected.description}</p>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><Code size={13} /> Technology Stack</h5>
              <div className="flex flex-wrap gap-2">
                {(selected.techStack || []).map((t, i) => (
                  <span key={i} className="bg-gray-50 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg border border-line">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><GraduationCap size={13} /> Students</h5>
              <div className="space-y-2">
                {(selected.students || []).map((s, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">{s.name?.charAt(0)}</div>
                    <div className="text-xs font-bold text-slate-900">{s.name}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Details</h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Supervisor</span><span className="font-bold text-slate-900">{selected.supervisor?.name || 'N/A'}</span></div>
                {selected.coSupervisor?.name && <div className="flex justify-between"><span className="text-slate-400">Co-Supervisor</span><span className="font-bold text-slate-900">{selected.coSupervisor.name}</span></div>}
                <div className="flex justify-between"><span className="text-slate-400">Session</span><span className="font-bold text-slate-900">{selected.session || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Domain</span><span className="font-bold text-slate-900">{selected.domain || 'N/A'}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isPast = tab === 'past';
  const activeLoading = tab === 'current' ? loading : pastLoading;
  const activeData = tab === 'current' ? filtered : filtered;
  const activeCols = isPast ? 6 : 6;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Project Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Browse current and past FYP projects</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-line rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
        </div>
      </div>

      <div className="flex gap-2">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              tab === t.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-gray-200 hover:bg-blue-50'
            }`}>{t.label}</button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-line text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {isPast ? (
                  <>
                    <th className="py-3.5 px-6">Project Title</th>
                    <th className="py-3.5 px-6">Students</th>
                    <th className="py-3.5 px-6">Supervisor</th>
                    <th className="py-3.5 px-6">Session</th>
                    <th className="py-3.5 px-6">Domain</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </>
                ) : (
                  <>
                    <th className="py-3.5 px-6">Project Title</th>
                    <th className="py-3.5 px-6">Leader</th>
                    <th className="py-3.5 px-6">Supervisor</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Tech Stack</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-sm">
              {activeLoading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={activeCols} />)
              ) : activeData.length === 0 ? (
                <tr>
                  <td colSpan={activeCols} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <BookOpen className="w-10 h-10" />
                      <p className="text-sm font-bold">No {isPast ? 'past' : 'current'} projects found</p>
                      <p className="text-xs">Try adjusting your search terms.</p>
                    </div>
                  </td>
                </tr>
              ) : isPast ? (
                activeData.map(p => (
                  <tr key={p.id} onClick={() => { setSelected(p); setView('detail'); }}
                    className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="py-4 px-6 font-bold text-slate-900 text-sm truncate max-w-[240px]">{p.title}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <GraduationCap size={12} className="text-slate-400" />
                        {p.students?.length || 0}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600">{p.supervisor?.name || 'N/A'}</td>
                    <td className="py-4 px-6"><span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-slate-200">{p.session || '—'}</span></td>
                    <td className="py-4 px-6 text-xs text-slate-600">{p.domain || '—'}</td>
                    <td className="py-4 px-6 text-right"><span className="text-blue-600 text-[10px] font-bold flex items-center justify-end gap-0.5">View <ChevronRight size={11} /></span></td>
                  </tr>
                ))
              ) : (
                activeData.map(p => (
                  <tr key={p.id} onClick={() => { setSelected(p); setView('detail'); }}
                    className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="py-4 px-6 font-bold text-slate-900 text-sm truncate max-w-[240px]">{p.title}</td>
                    <td className="py-4 px-6 text-xs text-slate-600">{p.leader || '-'}</td>
                    <td className="py-4 px-6 text-xs text-slate-600">{p.supervisor || 'N/A'}</td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${GROUP_STATUS_MAP[p.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        {GROUP_STATUS_MAP[p.status]?.label || p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {p.techStack ? (
                        <div className="flex flex-wrap gap-1">
                          {p.techStack.split(',').slice(0, 2).map((t, i) => (
                            <span key={i} className="bg-gray-50 text-slate-900 font-bold text-[9px] px-1.5 py-0.5 rounded border border-line">{t.trim()}</span>
                          ))}
                          {p.techStack.split(',').length > 2 && <span className="text-[9px] text-gray-400 font-bold">+{p.techStack.split(',').length - 2}</span>}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="py-4 px-6 text-right"><span className="text-blue-600 text-[10px] font-bold flex items-center justify-end gap-0.5">View <ChevronRight size={11} /></span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isPast && pastTotalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">{pastTotal} total past projects</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPastPage(p => Math.max(1, p - 1))} disabled={pastPage <= 1}
              className="p-2 rounded-xl border border-line text-slate-500 hover:bg-white disabled:opacity-30 cursor-pointer">Prev</button>
            <span className="text-xs font-bold text-slate-500">{pastPage} / {pastTotalPages}</span>
            <button onClick={() => setPastPage(p => Math.min(pastTotalPages, p + 1))} disabled={pastPage >= pastTotalPages}
              className="p-2 rounded-xl border border-line text-slate-500 hover:bg-white disabled:opacity-30 cursor-pointer">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
