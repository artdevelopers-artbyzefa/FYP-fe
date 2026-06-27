import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../api/apiClient';
import { ArrowLeft, Users, User, ChevronRight, BookOpen, Code, Loader2, Search, FileText, CheckCircle, X } from 'lucide-react';
import { GROUP_STATUS_MAP, IDEA_STATUS_MAP } from '../../utils/constants/status.constant';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function HodProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiClient.get('/hod/projects').then(res => setProjects(res.data?.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.supervisor?.toLowerCase().includes(search.toLowerCase()) || p.leader?.toLowerCase().includes(search.toLowerCase())
  );

  if (view === 'detail' && selected) {
    return (
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="border-b border-line pb-4">
          <button onClick={() => { setView('list'); setSelected(null); }} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3"><ArrowLeft size={14} /> Back to Project Directory</button>
          <h2 className="text-xl font-bold text-slate-900">{selected.title}</h2>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${GROUP_STATUS_MAP[selected.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{GROUP_STATUS_MAP[selected.status]?.label || selected.status}</span>
          </div>
        </motion.div>
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {selected.description && <div className="bg-white rounded-2xl border border-line p-6 shadow-sm"><h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><BookOpen size={13} /> Description</h5><p className="text-sm text-slate-700 leading-relaxed">{selected.description}</p></div>}
            {selected.techStack && <div className="bg-white rounded-2xl border border-line p-6 shadow-sm"><h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><Code size={13} /> Technology Stack</h5><div className="flex flex-wrap gap-2">{selected.techStack.split(',').map((t, i) => <span key={i} className="bg-gray-50 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg border border-line">{t.trim()}</span>)}</div></div>}
            {selected.ideas?.length > 0 && <div className="bg-white rounded-2xl border border-line p-6 shadow-sm"><h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><FileText size={13} /> Project Ideas</h5><div className="space-y-3">{selected.ideas.map((idea, i) => (<div key={i} className="p-4 rounded-xl border border-line"><div className="flex items-start justify-between gap-2 mb-2"><span className="font-bold text-slate-900 text-sm">{idea.title}</span><span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ${IDEA_STATUS_MAP[idea.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{IDEA_STATUS_MAP[idea.status]?.label || idea.status}</span></div><p className="text-[10px] text-slate-400">Submitted by {idea.submittedBy}</p>{idea.feedback && <p className="text-xs text-slate-500 mt-1">Feedback: {idea.feedback}</p>}</div>))}</div></div>}
          </div>
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm"><h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><User size={13} /> Supervision</h5><div className="space-y-3"><div><span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-0.5">Supervisor</span><span className="font-bold text-slate-900 text-sm">{selected.supervisor || 'N/A'}</span>{selected.supervisorEmail && <p className="text-[10px] text-slate-400">{selected.supervisorEmail}</p>}</div>{selected.coSupervisor && <div><span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-0.5">Co-Supervisor</span><span className="font-bold text-slate-900 text-sm">{selected.coSupervisor}</span></div>}</div></div>
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm"><h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><Users size={13} /> Team Members ({selected.memberCount})</h5><div className="space-y-2">{selected.members?.map((m, i) => (<div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-line"><div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">{m.name?.charAt(0)}</div><div className="min-w-0"><div className="text-sm font-bold text-slate-900 truncate">{m.name}</div><div className="text-[10px] text-gray-400 truncate">{m.regNo || m.email}</div></div></div>))}</div></div>
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm"><h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Progress</h5><div className="flex items-center gap-3"><div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${selected.progress || 0}%` }} /></div><span className="text-sm font-black text-slate-900">{selected.progress || 0}%</span></div></div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div><h2 className="text-xl font-bold text-slate-900">Project Directory</h2><p className="text-xs text-slate-500 mt-0.5 font-medium">All FYP projects across the department</p></div>
        <div className="relative w-full sm:w-72"><Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search by title, leader, or supervisor..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-line rounded-xl text-sm outline-none focus:border-blue-500 transition-all" /></div>
      </motion.div>

      {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div> : (
        <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-50 text-[11px] font-bold text-slate-500 tracking-wider">
                  <th className="py-3.5 px-6">Project Title</th>
                  <th className="py-3.5 px-6">Leader</th>
                  <th className="py-3.5 px-6">Supervisor</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Tech Stack</th>
                  <th className="py-3.5 px-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-12 text-center"><p className="text-sm font-bold text-slate-400">No projects found</p></td></tr>
                ) : filtered.map(p => (
                  <tr key={p.id} onClick={() => { setSelected(p); setView('detail'); }} className="hover:bg-blue-50/30 transition-colors cursor-pointer">
                    <td className="py-4 px-6 font-bold text-slate-900 truncate max-w-[220px]">{p.title}</td>
                    <td className="py-4 px-6 text-slate-500 text-xs">{p.leader}</td>
                    <td className="py-4 px-6 text-slate-500 text-xs">{p.supervisor}</td>
                    <td className="py-4 px-6"><span className={`font-bold text-[10px] px-2 py-0.5 rounded-lg border ${GROUP_STATUS_MAP[p.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{GROUP_STATUS_MAP[p.status]?.label || p.status}</span></td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {p.techStack ? <div className="flex gap-1">{p.techStack.split(',').slice(0, 2).map((t, i) => <span key={i} className="bg-gray-50 text-slate-900 font-bold text-[9px] px-1.5 py-0.5 rounded border border-line">{t.trim()}</span>)}{p.techStack.split(',').length > 2 && <span className="text-[9px] text-gray-400 font-bold">+{p.techStack.split(',').length - 2}</span>}</div> : '-'}
                    </td>
                    <td className="py-4 px-6 text-right"><ChevronRight size={14} className="text-slate-300" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
