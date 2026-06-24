import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getHodStudents, updateHodStudent, deleteHodStudent } from '../../services/hod.service';
import { showToast, showAlert } from '../../components/AppToast';
import { ChevronLeft, ChevronRight, GraduationCap, Pencil, Trash2, Loader2, AlertCircle, Search, X } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const HodStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [editStudent, setEditStudent] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', regNo: '', email: '', semester: '', section: '', cgpa: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadStudents = useCallback((p) => {
    setLoading(true);
    setError(null);
    getHodStudents(p || page, limit).then(res => {
      setStudents(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    }).catch(err => {
      console.error(err);
      setError('Failed to load students.');
      setStudents([]);
    }).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { loadStudents(page); }, [page, loadStudents]);

  const goToPage = (p) => { if (p >= 1 && p <= totalPages) setPage(p); };

  const handleEdit = (s) => {
    setEditStudent(s);
    setEditForm({
      name: s.name || '',
      regNo: s.regNo || '',
      email: s.email || '',
      semester: s.semester?.toString() || '',
      section: s.section || '',
      cgpa: s.cgpa?.toString() || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim()) {
      showToast.error('Name and email are required.');
      return;
    }
    setSubmitting(true);
    try {
      await updateHodStudent(editStudent.id, {
        name: editForm.name.trim(),
        regNo: editForm.regNo,
        email: editForm.email.trim(),
        semester: editForm.semester,
        section: editForm.section.trim().toUpperCase(),
        cgpa: editForm.cgpa || undefined
      });
      showToast.success('Student updated successfully.');
      setEditStudent(null);
      loadStudents(page);
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to update student.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (s) => {
    showAlert.confirm('Deactivate Student', `Deactivate ${s.name}?`, 'Deactivate', 'Cancel').then(async (res) => {
      if (res.isConfirmed) {
        try {
          await deleteHodStudent(s.id);
          showToast.success(`${s.name} deactivated.`);
          loadStudents(page);
        } catch (err) {
          showToast.error(err?.response?.data?.message || 'Failed to deactivate.');
        }
      }
    });
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Students</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">View, edit, and manage all registered students</p>
        </div>
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
                <th className="py-2.5 px-4 text-right w-[80px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
              {loading ? (
                Array.from({ length: 8 }, (_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 8 }, (_, j) => (
                      <td key={j} className="py-3 px-4"><div className="h-4 rounded-md skeleton" /></td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <AlertCircle className="w-8 h-8" />
                      <p className="text-sm font-bold">{error}</p>
                      <button onClick={() => loadStudents(1)} className="text-xs text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-0">Retry</button>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <GraduationCap size={28} className="text-slate-300" />
                      <p className="text-sm font-bold">No students found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map(s => (
                  <tr key={s.id || s._id} className={`hover:bg-blue-50/30 transition-colors ${s.isactive === false ? 'opacity-50' : ''}`}>
                    <td className="py-2.5 px-4 font-bold text-slate-900 text-sm">{s.name}{s.isactive === false && <span className="ml-2 text-[9px] text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded">Inactive</span>}</td>
                    <td className="py-2.5 px-4 text-slate-400 font-mono text-xs">{s.regNo || '-'}</td>
                    <td className="py-2.5 px-4 text-slate-500 text-xs truncate max-w-[160px]" title={s.email}>{s.email || '-'}</td>
                    <td className="py-2.5 px-4 text-slate-500 text-xs">{s.semester ? `Sem ${s.semester}` : '-'}{s.section ? ` / ${s.section}` : ''}</td>
                    <td className="py-2.5 px-4 text-slate-500 text-xs">{s.cgpa || '-'}</td>
                    <td className="py-2.5 px-4">
                      <span className={`font-bold text-[10px] px-2 py-0.5 rounded-lg border tracking-wider ${
                        s.status === 'phase2_completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : s.status?.includes('phase2') ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : s.status?.includes('phase1') ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : s.status === 'proposal_approved' ? 'bg-violet-50 text-violet-700 border-violet-200'
                                : s.status === 'proposal_submitted' ? 'bg-orange-50 text-orange-700 border-orange-200'
                                  : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>{s.status?.replace(/_/g, ' ') || 'Not Started'}</span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 text-xs truncate max-w-[120px]" title={s.supervisor}>{s.supervisor || '-'}</td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleEdit(s)} className="px-2 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold transition-all hover:bg-blue-100 cursor-pointer flex items-center gap-1">
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                        {s.isactive !== false && (
                          <button onClick={() => handleDelete(s)} className="px-2 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold transition-all hover:bg-rose-100 cursor-pointer flex items-center gap-1">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {!loading && totalPages > 1 && (
        <motion.div variants={item} className="flex items-center justify-between mt-4 px-1">
          <span className="text-[11px] font-bold text-slate-400">{total} total students</span>
          <div className="flex items-center gap-1">
            <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="w-7 h-7 rounded-lg border border-line text-slate-400 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center">
              <ChevronLeft size={14} />
            </button>
            {pageNumbers.map(p => (
              <button key={p} onClick={() => goToPage(p)} className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${p === page ? 'bg-blue-600 text-white' : 'border border-line text-slate-500 hover:bg-blue-50'}`}>{p}</button>
            ))}
            <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="w-7 h-7 rounded-lg border border-line text-slate-400 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center">
              <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      )}

      {editStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Edit Student</h3>
              <button onClick={() => setEditStudent(null)} className="w-8 h-8 rounded-lg bg-gray-50 border-0 flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Full Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Reg No</label>
                <input type="text" value={editForm.regNo} onChange={e => setEditForm(f => ({ ...f, regNo: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all font-mono" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Email</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" required />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Semester</label>
                  <select value={editForm.semester} onChange={e => setEditForm(f => ({ ...f, semester: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-primary cursor-pointer">
                    <option value="">-</option>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Section</label>
                  <select value={editForm.section} onChange={e => setEditForm(f => ({ ...f, section: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-primary cursor-pointer">
                    <option value="">-</option>
                    {['A','B','C','D'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">CGPA</label>
                  <input type="text" inputMode="decimal" value={editForm.cgpa} onChange={e => setEditForm(f => ({ ...f, cgpa: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary transition-all" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setEditStudent(null)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer border-0">Cancel</button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 transition-all cursor-pointer border-0 disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HodStudents;
