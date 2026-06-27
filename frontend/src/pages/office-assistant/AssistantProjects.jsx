import React, { useEffect, useState } from 'react';
import { getOfficeProjects } from '../../services/office-assistant.service';
import { Search, ArrowLeft, Users, User, Mail, BookOpen, Code, Loader2, ChevronRight, Send, Clock, FileText, CheckCircle, X } from 'lucide-react';
import { GROUP_STATUS_MAP, IDEA_STATUS_MAP } from '../../utils/constants/status.constant';

export default function AssistantProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getOfficeProjects()
      .then(res => setProjects(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.supervisor?.toLowerCase().includes(search.toLowerCase()) || p.leader?.toLowerCase().includes(search.toLowerCase())
  );

  if (view === 'detail' && selected) {
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Project Directory</h2>
          <p className="text-xs text-slate-900 mt-0.5 font-medium">Searchable repository of all proposed, active, and completed FYP projects</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by title, leader, or supervisor..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-line rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-slate-500 font-medium">Loading projects...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
          <BookOpen className="w-10 h-10" />
          <p className="text-sm font-bold">No projects found</p>
          <p className="text-xs">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} onClick={() => { setSelected(p); setView('detail'); }}
              className="bg-white rounded-2xl border border-line p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-bold text-slate-900 text-sm truncate">{p.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${GROUP_STATUS_MAP[p.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                  {GROUP_STATUS_MAP[p.status]?.label || p.status}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                <User size={12} /> {p.supervisor}
                {p.memberCount > 0 && <><span className="text-gray-300">|</span> <Users size={12} /> {p.memberCount} members</>}
              </div>
              {p.description && (
                <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{p.description}</p>
              )}
              {p.techStack && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.techStack.split(',').slice(0, 3).map((t, i) => (
                    <span key={i} className="bg-gray-50 text-slate-900 font-bold text-[9px] px-1.5 py-0.5 rounded border border-line">{t.trim()}</span>
                  ))}
                  {p.techStack.split(',').length > 3 && <span className="text-[9px] text-gray-400 font-bold">+{p.techStack.split(',').length - 3}</span>}
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-line mt-auto">
                <div className="flex items-center gap-1.5">
                  {p.leader && <span className="text-[10px] text-slate-400 truncate max-w-[100px]">{p.leader}</span>}
                </div>
                <span className="text-blue-600 text-[10px] font-bold flex items-center gap-0.5">View Details <ChevronRight size={12} /></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
