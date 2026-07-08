import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getHodStudents, updateHodStudent, deleteHodStudent } from '../../services/hod.service';
import { showToast, showAlert } from '../../components/AppToast';
import { ArrowLeft, ChevronLeft, ChevronRight, GraduationCap, Pencil, Trash2, Loader2, AlertCircle, Mail, User, Users, BookOpen, Code, FileText, ChevronRight as ChevronRightIcon, Search } from 'lucide-react';
import { GROUP_STATUS_MAP, IDEA_STATUS_MAP } from '../../utils/constants/status.constant';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const fypStatusConfig = {
  not_started: { label: 'Not Started', color: 'bg-gray-50 text-gray-500 border-gray-200' },
  proposal_submitted: { label: 'Proposal Submitted', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  proposal_approved: { label: 'Proposal Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  proposal_rejected: { label: 'Proposal Rejected', color: 'bg-rose-50 text-rose-600 border-rose-200' },
  phase1_ongoing: { label: 'Phase 1 Ongoing', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  phase1_completed: { label: 'Phase 1 Completed', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  phase2_ongoing: { label: 'Phase 2 Ongoing', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  phase2_completed: { label: 'Phase 2 Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  failed: { label: 'Failed', color: 'bg-rose-50 text-rose-600 border-rose-200' },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const HodStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const limit = 20;

  const loadStudents = useCallback((p) => {
    setLoading(true); setError(null);
    getHodStudents(p || page, limit).then(res => {
      setStudents(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    }).catch(err => { console.error(err); setError('Failed to load students.'); setStudents([]); }).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { loadStudents(page); }, [page, loadStudents]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  if (view === 'detail' && selected) {
    return <StudentDetail student={selected} onBack={() => { setView('list'); setSelected(null); }} onUpdate={() => loadStudents(page)} />;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-line pb-4">
        <div><h2 className="text-xl font-bold text-slate-900 tracking-tight">Students</h2><p className="text-xs text-slate-500 mt-0.5 font-medium">View, edit, and manage all registered students</p></div>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Student Name</th>
                <th className="py-2.5 px-4">Reg No</th>
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4">Sem/Sec</th>
                <th className="py-2.5 px-4">CGPA</th>
                <th className="py-2.5 px-4">FYP Status</th>
                <th className="py-2.5 px-4">Supervisor</th>
                <th className="py-2.5 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
              {loading ? Array.from({ length: 8 }, (_, i) => (
                <tr key={i} className="animate-pulse">{Array.from({ length: 8 }, (_, j) => <td key={j} className="py-3 px-4"><div className="h-4 rounded-md skeleton" /></td>)}</tr>
              )) : error ? (
                <tr><td colSpan={8} className="py-10 text-center"><div className="flex flex-col items-center gap-2 text-slate-400"><AlertCircle className="w-8 h-8" /><p className="text-sm font-bold">{error}</p><button onClick={() => loadStudents(1)} className="text-xs text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-0">Retry</button></div></td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={8} className="py-10 text-center"><div className="flex flex-col items-center gap-2 text-slate-400"><GraduationCap size={28} className="text-slate-300" /><p className="text-sm font-bold">No students found</p></div></td></tr>
              ) : students.map(s => (
                <tr key={s.id || s._id} className={`hover:bg-blue-50/30 transition-colors ${s.isactive === false ? 'opacity-50' : ''}`}>
                  <td className="py-2.5 px-4 font-bold text-slate-900 text-sm">{s.name}{s.isactive === false && <span className="ml-2 text-[9px] text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded">Inactive</span>}</td>
                  <td className="py-2.5 px-4 text-slate-400 font-mono text-xs">{s.regNo || '-'}</td>
                  <td className="py-2.5 px-4 text-slate-500 text-xs truncate max-w-[160px]">{s.email || '-'}</td>
                  <td className="py-2.5 px-4 text-slate-500 text-xs">{s.semester ? `Sem ${s.semester}` : '-'}{s.section ? ` / ${s.section}` : ''}</td>
                  <td className="py-2.5 px-4 text-slate-500 text-xs">{s.cgpa || '-'}</td>
                  <td className="py-2.5 px-4"><span className={`font-bold text-[10px] px-2 py-0.5 rounded-lg border tracking-wider ${fypStatusConfig[s.status]?.color || 'bg-slate-50 text-slate-500 border-slate-200'}`}>{fypStatusConfig[s.status]?.label || s.status?.replace(/_/g, ' ') || 'Not Started'}</span></td>
                  <td className="py-2.5 px-4 text-slate-500 text-xs truncate max-w-[120px]">{s.supervisor || '-'}</td>
                  <td className="py-2.5 px-4 text-right">
                    <button onClick={() => { setSelected(s); setView('detail'); }} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold hover:bg-blue-700 transition-all cursor-pointer border-0 flex items-center gap-1 ml-auto">
                      <User size={11} /> View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {!loading && totalPages > 1 && (
        <motion.div variants={item} className="flex items-center justify-between mt-4 px-1">
          <span className="text-[11px] font-bold text-slate-400">{total} total students</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="w-10 h-10 rounded-lg border border-line text-slate-400 hover:bg-blue-50 disabled:opacity-30 cursor-pointer flex items-center justify-center"><ChevronLeft size={14} /></button>
            {pageNumbers.map(p => <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${p === page ? 'bg-blue-600 text-white' : 'border border-line text-slate-500 hover:bg-blue-50'}`}>{p}</button>)}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="w-10 h-10 rounded-lg border border-line text-slate-400 hover:bg-blue-50 disabled:opacity-30 cursor-pointer flex items-center justify-center"><ChevronRight size={14} /></button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

function StudentDetail({ student, onBack, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: student.name || '', regNo: student.regNo || '', email: student.email || '', semester: student.semester?.toString() || '', section: student.section || '', cgpa: student.cgpa?.toString() || '' });
  const [submitting, setSubmitting] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim()) { showToast.error('Name and email are required.'); return; }
    setSubmitting(true);
    try {
      await updateHodStudent(student.id, { name: editForm.name.trim(), regNo: editForm.regNo, email: editForm.email.trim(), semester: editForm.semester, section: editForm.section.trim().toUpperCase(), cgpa: editForm.cgpa || undefined });
      showToast.success('Student updated successfully.'); setEditing(false); onUpdate();
    } catch (err) { showToast.error(err?.response?.data?.message || 'Failed to update.'); }
    finally { setSubmitting(false); }
  };

  const handleDeactivate = () => {
    showAlert.confirm('Deactivate Student', `Deactivate ${student.name}?`, 'Deactivate', 'Cancel').then(async (res) => {
      if (res.isConfirmed) { try { await deleteHodStudent(student.id); showToast.success(`${student.name} deactivated.`); onBack(); onUpdate(); } catch (err) { showToast.error('Failed to deactivate.'); } }
    });
  };

  if (selectedGroup) {
    return <GroupDetail group={selectedGroup} onBack={() => setSelectedGroup(null)} />;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="border-b border-line pb-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3"><ArrowLeft size={14} /> Back to Students</button>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 ${student.isactive === false ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700'}`}>{student.name?.charAt(0)}</div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1"><GraduationCap size={12} /> {student.regNo || 'No Reg No'}</span>
              <span className="flex items-center gap-1"><Mail size={12} /> {student.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditing(!editing)} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all cursor-pointer border-0 flex items-center gap-1.5"><Pencil size={12} /> {editing ? 'Cancel' : 'Edit'}</button>
            {student.isactive !== false && <button onClick={handleDeactivate} className="px-4 py-2 bg-white text-rose-600 text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-50 transition-all cursor-pointer flex items-center gap-1.5"><Trash2 size={12} /> Deactivate</button>}
          </div>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${fypStatusConfig[student.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{fypStatusConfig[student.status]?.label || student.status}</span>
          {student.cgpa > 0 && <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-blue-200">CGPA: {student.cgpa}</span>}
          {student.isactive === false && <span className="bg-gray-100 text-gray-500 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-gray-200">Deactivated</span>}
        </div>
      </motion.div>

      {editing ? (
        <motion.form variants={item} onSubmit={handleSave} className="bg-white rounded-2xl border border-line p-6 shadow-sm space-y-5">
          <h5 className="text-xs font-bold text-slate-900 tracking-wider">Edit Student Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div><label className="block text-[10px] font-bold text-slate-500 mb-1.5">Full Name</label><input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" required /></div>
            <div><label className="block text-[10px] font-bold text-slate-500 mb-1.5">Reg No</label><input type="text" value={editForm.regNo} onChange={e => setEditForm(f => ({ ...f, regNo: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all font-mono" /></div>
            <div><label className="block text-[10px] font-bold text-slate-500 mb-1.5">Email</label><input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" required /></div>
            <div><label className="block text-[10px] font-bold text-slate-500 mb-1.5">Semester</label><select value={editForm.semester} onChange={e => setEditForm(f => ({ ...f, semester: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer"><option value="">-</option>{[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}</select></div>
            <div><label className="block text-[10px] font-bold text-slate-500 mb-1.5">Section</label><select value={editForm.section} onChange={e => setEditForm(f => ({ ...f, section: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer"><option value="">-</option>{['A','B','C','D'].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className="block text-[10px] font-bold text-slate-500 mb-1.5">CGPA</label><input type="text" inputMode="decimal" value={editForm.cgpa} onChange={e => setEditForm(f => ({ ...f, cgpa: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" /></div>
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
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><User size={13} /> Assigned Supervisor</h5>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-line">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">{student.supervisor?.charAt(0) || '?'}</div>
                <div><span className="font-bold text-slate-900 text-sm">{student.supervisor || 'Not assigned'}</span></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><GraduationCap size={13} /> Project</h5>
              {student.groupData ? (
                <div onClick={() => setSelectedGroup(student.groupData)} className="p-4 rounded-xl border border-line cursor-pointer hover:border-blue-200 hover:bg-blue-50/20 transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-slate-900 text-sm">{student.groupData.title}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ${GROUP_STATUS_MAP[student.groupData.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{GROUP_STATUS_MAP[student.groupData.status]?.label || student.groupData.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>Leader: {student.groupData.leader}</span>
                    <span>|</span> <Users size={10} /> {student.groupData.memberCount} members
                  </div>
                  {student.groupData.progress > 0 && <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${student.groupData.progress}%` }} /></div>}
                </div>
              ) : <div className="p-4 rounded-xl border border-line"><p className="text-xs text-slate-400 text-center">No project assigned</p></div>}
            </div>
          </div>
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Student Info</h5>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Reg No</span><span className="font-bold text-slate-900 font-mono">{student.regNo || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="font-bold text-slate-900">{student.email}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Semester</span><span className="font-bold text-slate-900">{student.semester || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Section</span><span className="font-bold text-slate-900">{student.section || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">CGPA</span><span className="font-bold text-slate-900">{student.cgpa || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">FYP Status</span><span className={`font-bold px-2 py-0.5 rounded-lg border ${fypStatusConfig[student.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{fypStatusConfig[student.status]?.label || student.status}</span></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Progress</h5>
              <div className="flex items-center gap-3"><div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${student.progress || 0}%` }} /></div><span className="text-sm font-black text-slate-900">{student.progress || 0}%</span></div>
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
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3"><ArrowLeft size={14} /> Back to Student</button>
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

export default HodStudents;
