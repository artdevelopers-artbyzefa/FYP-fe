import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getHodFacultyList, updateHodFaculty } from '../../services/hod.service';
import { showToast } from '../../components/AppToast';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Users, User, Mail, Pencil, ChevronRight as ChevronRightIcon, CheckCircle, XCircle, BookOpen, Code, FileText, GraduationCap, Clock, Check, X } from 'lucide-react';
import { GROUP_STATUS_MAP, IDEA_STATUS_MAP } from '../../utils/constants/status.constant';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const TYPE_COLORS = { committee: 'bg-purple-50 text-purple-700 border-purple-200', supervisor: 'bg-blue-50 text-blue-700 border-blue-200', both: 'bg-emerald-50 text-emerald-700 border-emerald-200' };

const SkeletonRow = ({ cols }) => (
  <tr className="animate-pulse">{Array.from({ length: cols }, (_, i) => <td key={i} className="py-4 px-6"><div className={`h-4 rounded-md skeleton ${i === 0 ? 'w-36' : i === cols - 1 ? 'w-16' : 'w-24'}`} /></td>)}</tr>
);

const HodFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const limit = 20;

  const loadFaculty = useCallback((p) => {
    setLoading(true);
    getHodFacultyList(p || page, limit).then(res => {
      setFaculty(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    }).catch(err => console.error(err)).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { loadFaculty(page); }, [page, loadFaculty]);

  if (view === 'detail' && selected) {
    return <FacultyDetail faculty={selected} onBack={() => { setView('list'); setSelected(null); }} onUpdate={() => loadFaculty(page)} />;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-line pb-4">
        <div><h2 className="text-xl font-bold text-slate-900 tracking-tight">Faculty</h2><p className="text-xs text-slate-500 mt-0.5 font-medium">View all faculty members and their supervision details</p></div>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="bg-blue-50 text-[11px] font-bold text-slate-500 tracking-wider"><th className="py-3.5 px-6">Name</th><th className="py-3.5 px-6">Email</th><th className="py-3.5 px-6">Phone</th><th className="py-3.5 px-6">Faculty Type</th><th className="py-3.5 px-6">Supervision Load</th><th className="py-3.5 px-6">Status</th><th className="py-3.5 px-6 text-right"></th></tr></thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
              {loading ? Array.from({ length: 8 }, (_, i) => <SkeletonRow key={i} cols={7} />) : faculty.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center"><div className="flex flex-col items-center gap-2"><Users size={32} className="text-slate-300" /><p className="text-sm font-bold text-slate-400">No faculty found</p></div></td></tr>
              ) : faculty.map(f => (
                <tr key={f.id} onClick={() => { setSelected(f); setView('detail'); }} className="hover:bg-blue-50/30 transition-colors cursor-pointer">
                  <td className="py-4 px-6 font-bold text-slate-900">{f.name}</td>
                  <td className="py-4 px-6 text-slate-500 text-xs">{f.email || '-'}</td>
                  <td className="py-4 px-6 text-slate-500 text-xs">{f.phone || '-'}</td>
                  <td className="py-4 px-6"><span className={`font-bold text-xs px-2.5 py-1 rounded-lg border tracking-wider ${TYPE_COLORS[f.facultyType] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>{f.facultyType}</span></td>
                  <td className="py-4 px-6 text-slate-500 text-xs font-bold">{f.supervisionLoad} group{f.supervisionLoad !== 1 ? 's' : ''}</td>
                  <td className="py-4 px-6"><span className={`font-bold text-xs px-2.5 py-1 rounded-lg border tracking-wider ${f.isactive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>{f.isactive ? 'Active' : 'Inactive'}</span></td>
                  <td className="py-4 px-6 text-right"><ChevronRightIcon size={14} className="text-slate-300" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {!loading && totalPages > 1 && (
        <motion.div variants={item} className="flex items-center justify-between mt-4 px-2">
          <span className="text-xs font-bold text-slate-400">{total} total faculty</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 rounded-lg border border-line text-slate-400 hover:bg-blue-50 disabled:opacity-30 cursor-pointer"><ChevronLeft size={16} /></button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => { const start = Math.max(1, Math.min(page - 3, totalPages - 6)); const p = start + i; if (p > totalPages) return null; return <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${p === page ? 'bg-blue-600 text-white' : 'border border-line text-slate-500 hover:bg-blue-50'}`}>{p}</button>; })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="p-2 rounded-lg border border-line text-slate-400 hover:bg-blue-50 disabled:opacity-30 cursor-pointer"><ChevronRight size={16} /></button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

function FacultyDetail({ faculty, onBack, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: faculty.name || '', email: faculty.email || '', facultyType: faculty.facultyType || 'supervisor' });
  const [submitting, setSubmitting] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateHodFaculty(faculty.id, { name: editForm.name.trim(), email: editForm.email.trim(), facultyType: editForm.facultyType });
      showToast.success('Faculty updated successfully.'); setEditing(false); onUpdate();
    } catch (err) { showToast.error(err?.response?.data?.message || 'Failed to update.'); }
    finally { setSubmitting(false); }
  };

  if (selectedGroup) {
    return <GroupDetail group={selectedGroup} onBack={() => setSelectedGroup(null)} />;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="border-b border-line pb-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3"><ArrowLeft size={14} /> Back to Faculty</button>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 ${faculty.isactive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{faculty.name?.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('') || '?'}</div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{faculty.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1"><Mail size={12} /> {faculty.email}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${TYPE_COLORS[faculty.facultyType] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{faculty.facultyType}</span>
              {faculty.isactive ? <span className="flex items-center gap-1 text-emerald-600"><CheckCircle size={12} /> Active</span> : <span className="flex items-center gap-1 text-slate-400"><XCircle size={12} /> Inactive</span>}
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all cursor-pointer border-0 flex items-center gap-1.5"><Pencil size={12} /> {editing ? 'Cancel' : 'Edit'}</button>
        </div>
      </motion.div>

      {editing ? (
        <motion.form variants={item} onSubmit={handleSave} className="bg-white rounded-2xl border border-line p-6 shadow-sm space-y-5">
          <h5 className="text-xs font-bold text-slate-900 tracking-wider">Edit Faculty Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div><label className="block text-[10px] font-bold text-slate-500 mb-1.5">Full Name</label><input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" required /></div>
            <div><label className="block text-[10px] font-bold text-slate-500 mb-1.5">Email</label><input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" required /></div>
            <div><label className="block text-[10px] font-bold text-slate-500 mb-1.5">Faculty Type</label><select value={editForm.facultyType} onChange={e => setEditForm(f => ({ ...f, facultyType: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer"><option value="supervisor">Supervisor</option><option value="committee">Committee</option><option value="both">Both</option></select></div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-line">
            <button type="button" onClick={() => setEditing(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 border border-line hover:bg-gray-50 cursor-pointer">Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50">{submitting ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </motion.form>
      ) : (
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><Users size={13} /> Supervised Groups ({faculty.groups?.length || 0})</h5>
              {faculty.groups?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {faculty.groups.map(g => (
                    <div key={g.id} onClick={() => setSelectedGroup(g)} className="p-4 rounded-xl border border-line cursor-pointer hover:border-blue-200 hover:bg-blue-50/20 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-bold text-slate-900 text-sm truncate">{g.title}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${GROUP_STATUS_MAP[g.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{GROUP_STATUS_MAP[g.status]?.label || g.status}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>Leader: {g.leader}</span>
                        {g.memberCount > 0 && <><span>|</span> <Users size={10} /> {g.memberCount} members</>}
                      </div>
                      {g.progress > 0 && <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${g.progress}%` }} /></div>}
                    </div>
                  ))}
                </div>
              ) : <p className="text-xs text-slate-400 py-4 text-center">No groups assigned yet</p>}
            </div>
          </div>
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Contact & Status</h5>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="font-bold text-slate-900">{faculty.email}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Phone</span><span className="font-bold text-slate-900">{faculty.phone || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Type</span><span className={`font-bold px-2 py-0.5 rounded-lg border ${TYPE_COLORS[faculty.facultyType] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{faculty.facultyType}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Status</span>{faculty.isactive ? <span className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle size={12} /> Active</span> : <span className="font-bold text-slate-400 flex items-center gap-1"><XCircle size={12} /> Inactive</span>}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function GroupDetail({ group, onBack }) {
  const evaluationData = [
    { name: 'Phase 1 (10%)', value: 10, fill: '#e2e8f0' },
    { name: 'Phase 2 (30%)', value: 30, fill: '#e2e8f0' },
    { name: 'Phase 3 (60%)', value: 60, fill: '#e2e8f0' },
    { name: 'Phase 4 (100%)', value: 100, fill: '#e2e8f0' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="border-b border-line pb-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3"><ArrowLeft size={14} /> Back to Faculty</button>
        <h2 className="text-xl font-bold text-slate-900">{group.title || group.name || 'Group Detail'}</h2>
        <div className="flex gap-2 mt-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${GROUP_STATUS_MAP[group.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{GROUP_STATUS_MAP[group.status]?.label || group.status}</span>
          {group.leader && <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-blue-200">Leader: {group.leader}</span>}
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {group.description && (
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><BookOpen size={13} /> Description</h5>
              <p className="text-sm text-slate-700 leading-relaxed">{group.description}</p>
            </div>
          )}
          {group.techStack && (
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><Code size={13} /> Technology Stack</h5>
              <div className="flex flex-wrap gap-2">{group.techStack.split(',').map((t, i) => <span key={i} className="bg-gray-50 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg border border-line">{t.trim()}</span>)}</div>
            </div>
          )}
          {group.ideas?.length > 0 && (
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><FileText size={13} /> Project Ideas</h5>
              <div className="space-y-3">{group.ideas.map((idea, i) => (
                <div key={i} className="p-4 rounded-xl border border-line">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-slate-900 text-sm">{idea.title}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ${IDEA_STATUS_MAP[idea.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{IDEA_STATUS_MAP[idea.status]?.label || idea.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Submitted by {idea.submittedBy}</p>
                  {idea.feedback && <p className="text-xs text-slate-500 mt-1">Feedback: {idea.feedback}</p>}
                </div>
              ))}</div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
            <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Evaluation Phases</h5>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={evaluationData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" startAngle={90} endAngle={-270}>
                  {evaluationData.map((_, i) => <Cell key={i} fill="#e2e8f0" stroke="#cbd5e1" />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-3">
              {[{p:'Phase 1',w:'10%'},{p:'Phase 2',w:'30%'},{p:'Phase 3',w:'60%'},{p:'Phase 4',w:'100%'}].map((ph,i) => (
                <div key={i} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-600">{ph.p}</span>
                  <span className="text-[10px] font-bold text-slate-400">{ph.w}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
            <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><Users size={13} /> Team Members ({group.memberCount})</h5>
            <div className="space-y-2">{group.members?.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-line">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">{m.name?.charAt(0)}</div>
                <div className="min-w-0"><div className="text-sm font-bold text-slate-900 truncate">{m.name}</div><div className="text-[10px] text-gray-400 truncate">{m.regNo || m.email}</div></div>
              </div>
            ))}</div>
          </div>

          <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
            <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Progress</h5>
            <div className="flex items-center gap-3"><div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${group.progress || 0}%` }} /></div><span className="text-sm font-black text-slate-900">{group.progress || 0}%</span></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default HodFaculty;
