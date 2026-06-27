import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getOfficeStudents, createOfficeStudent, deleteOfficeStudent, updateOfficeStudent } from '../../services/office-assistant.service';
import { showToast, showAlert } from '../../components/AppToast';
import { sendWelcomeEmail } from '../../services/email.service';
import { Search, UserPlus, X, Send, Trash2, Pencil, ArrowLeft, ArrowRight, ChevronRight, Users, Mail, BookOpen, Code, GraduationCap, User, ChevronDown } from 'lucide-react';
import { GROUP_STATUS_MAP } from '../../utils/constants/status.constant';
import { StudentRecordsSkeleton } from '../../components/Skeleton';

const initialForm = { name: '', reg: '', email: '', semester: '7', fatherName: '', whatsappNumber: '', section: '', cgpa: '' };

const validateForm = (form) => {
  const e = {};
  if (!form.name.trim()) e.name = 'Full name is required';
  if (!form.reg.trim()) e.reg = 'Registration number is required';
  if (!form.email.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
  else if (!form.email.toLowerCase().endsWith('@cuiatd.edu.pk')) e.email = 'Must be @cuiatd.edu.pk';
  if (form.cgpa && (parseFloat(form.cgpa) < 0 || parseFloat(form.cgpa) > 4.0)) e.cgpa = 'CGPA must be between 0.0 and 4.0';
  return e;
};

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

export default function AssistantStudents() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const limit = 20;

  const loadStudents = useCallback((p) => {
    setLoading(true);
    getOfficeStudents(p || page, limit).then(res => {
      setStudents(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    }).catch(() => showToast.error('Failed to load students.'))
    .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { loadStudents(page); }, [page, loadStudents]);

  const filtered = students.filter(s =>
    !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.regNo?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (view === 'detail' && selected) {
    return <StudentDetail student={selected} onBack={() => { setView('list'); setSelected(null); }} onUpdate={() => loadStudents(page)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Records</h2>
          <p className="text-xs text-slate-900 mt-0.5 font-medium">Manage student profiles, groups, and FYP status</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search by name, reg no, or email..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-line rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
        </div>
      </div>

      {loading ? <StudentRecordsSkeleton /> : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
          <GraduationCap className="w-10 h-10" />
          <p className="text-sm font-bold">No students found</p>
          <p className="text-xs">Try adjusting your search.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-50 border-b border-line text-[11px] font-bold text-slate-900 tracking-wider">
                  <th className="py-3.5 px-6">Student Name</th>
                  <th className="py-3.5 px-6">Registration No</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Semester/Section</th>
                  <th className="py-3.5 px-6">FYP Status</th>
                  <th className="py-3.5 px-6">Supervisor</th>
                  <th className="py-3.5 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-900">
                {filtered.map(s => (
                  <tr key={s.id || s._id} onClick={() => { setSelected(s); setView('detail'); }}
                    className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${s.isactive === false ? 'opacity-60' : ''}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${s.isactive === false ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700'}`}>
                          {s.name?.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs">{s.regNo || '-'}</td>
                    <td className="py-4 px-6 text-xs text-slate-500">{s.email}</td>
                    <td className="py-4 px-6 text-xs">{s.semester ? `Sem ${s.semester}${s.section ? `/${s.section}` : ''}` : '-'}</td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${fypStatusConfig[s.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        {fypStatusConfig[s.status]?.label || s.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs">{s.supervisor || 'No supervisor'}</td>
                    <td className="py-4 px-6">
                      <span className="text-blue-600 text-[10px] font-bold flex items-center gap-0.5">View Details <ChevronRight size={12} /></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">{total} total students</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
              className="p-2 rounded-xl border border-line text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
              <ArrowLeft size={14} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 3, totalPages - 6));
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${p === page ? 'bg-blue-600 text-white' : 'border border-line text-slate-500 hover:bg-blue-50'}`}>{p}</button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              className="p-2 rounded-xl border border-line text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StudentDetail({ student, onBack, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: student.name || '', reg: student.regNo || '', email: student.email || '',
    semester: student.semester?.toString() || '7', fatherName: student.fatherName || '',
    whatsappNumber: student.whatsappNumber || '', section: student.section || '', cgpa: student.cgpa?.toString() || ''
  });
  const [editErrors, setEditErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validateForm(editForm);
    setEditErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      await updateOfficeStudent(student.id, {
        name: editForm.name.trim(), regNo: editForm.reg, email: editForm.email.trim(),
        semester: editForm.semester, fatherName: editForm.fatherName.trim(),
        whatsappNumber: editForm.whatsappNumber.trim(), section: editForm.section.trim().toUpperCase(),
        cgpa: editForm.cgpa || undefined
      });
      showToast.success('Student updated successfully!');
      setEditing(false);
      onUpdate();
    } catch (err) { showToast.error(err?.response?.data?.message || 'Failed to update.'); }
    finally { setSubmitting(false); }
  };

  const handleDeactivate = () => {
    showAlert.confirm('Deactivate Student', `Deactivate ${student.name}?`, 'Deactivate', 'Cancel')
      .then(async (res) => {
        if (res.isConfirmed) {
          try {
            await deleteOfficeStudent(student.id);
            showToast.success(`${student.name} deactivated.`);
            onBack();
            onUpdate();
          } catch (err) { showToast.error(err?.response?.data?.message || 'Failed to deactivate.'); }
        }
      });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3">
          <ArrowLeft size={14} /> Back to Student Records
        </button>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 ${student.isactive === false ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700'}`}>
            {student.name?.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1"><GraduationCap size={12} /> {student.regNo || 'No Reg No'}</span>
              <span className="flex items-center gap-1"><Mail size={12} /> {student.email}</span>
              {student.semester && <span>Sem {student.semester}{student.section ? ` / ${student.section}` : ''}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all cursor-pointer border-0 flex items-center gap-1.5">
              <Pencil size={12} /> {editing ? 'Cancel' : 'Edit'}
            </button>
            {student.isactive !== false && (
              <button onClick={handleDeactivate}
                className="px-4 py-2 bg-white text-rose-600 text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-50 transition-all cursor-pointer flex items-center gap-1.5">
                <Trash2 size={12} /> Deactivate
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${fypStatusConfig[student.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
            {fypStatusConfig[student.status]?.label || student.status}
          </span>
          {student.cgpa > 0 && <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-blue-200">CGPA: {student.cgpa}</span>}
          {student.isactive === false && <span className="bg-gray-100 text-gray-500 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-gray-200">Deactivated</span>}
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-line p-6 shadow-sm space-y-5">
          <h5 className="text-xs font-bold text-slate-900 tracking-wider">Edit Student Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Full Name *</label>
              <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className={`w-full bg-white border ${editErrors.name ? 'border-rose-300' : 'border-line'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all`} />
              {editErrors.name && <p className="text-[10px] font-bold text-rose-500 mt-1">{editErrors.name}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Registration No *</label>
              <input type="text" value={editForm.reg} onChange={e => setEditForm(f => ({ ...f, reg: e.target.value }))} className={`w-full bg-white border ${editErrors.reg ? 'border-rose-300' : 'border-line'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all font-mono`} />
              {editErrors.reg && <p className="text-[10px] font-bold text-rose-500 mt-1">{editErrors.reg}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Email *</label>
              <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className={`w-full bg-white border ${editErrors.email ? 'border-rose-300' : 'border-line'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all`} />
              {editErrors.email && <p className="text-[10px] font-bold text-rose-500 mt-1">{editErrors.email}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Semester</label>
              <select value={editForm.semester} onChange={e => setEditForm(f => ({ ...f, semester: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer">
                {['1','2','3','4','5','6','7','8'].map(s => <option key={s} value={s}>Sem {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Section</label>
              <input type="text" value={editForm.section} onChange={e => setEditForm(f => ({ ...f, section: e.target.value }))} placeholder="A/B/C/D" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5">CGPA</label>
              <input type="text" inputMode="decimal" value={editForm.cgpa} onChange={e => setEditForm(f => ({ ...f, cgpa: e.target.value }))} className={`w-full bg-white border ${editErrors.cgpa ? 'border-rose-300' : 'border-line'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all`} />
              {editErrors.cgpa && <p className="text-[10px] font-bold text-rose-500 mt-1">{editErrors.cgpa}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5">Father's Name</label>
              <input type="text" value={editForm.fatherName} onChange={e => setEditForm(f => ({ ...f, fatherName: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5">WhatsApp</label>
              <input type="text" value={editForm.whatsappNumber} onChange={e => setEditForm(f => ({ ...f, whatsappNumber: e.target.value }))} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-line">
            <button type="button" onClick={() => setEditing(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 border border-line hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><User size={13} /> Assigned Supervisor</h5>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-line">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">{student.supervisor?.charAt(0) || '?'}</div>
                <div>
                  <span className="font-bold text-slate-900 text-sm">{student.supervisor || 'Not assigned'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><Users size={13} /> Project</h5>
              <div className="p-4 rounded-xl border border-line">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{student.project || 'Not assigned'}</span>
                  {student.progress > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${student.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-500">{student.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
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
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${student.progress || 0}%` }} />
                </div>
                <span className="text-sm font-black text-slate-900">{student.progress || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
