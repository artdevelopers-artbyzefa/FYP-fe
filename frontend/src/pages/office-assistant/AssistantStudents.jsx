import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getOfficeStudents, createOfficeStudent, deleteOfficeStudent, updateOfficeStudent } from '../../services/office-assistant.service';
import { showToast, showAlert } from '../../components/AppToast';
import { sendWelcomeEmail } from '../../services/email.service';
import { Search, UserPlus, X, Send, Trash2, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';

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

const AssistantStudents = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);
  const [loading, setLoading] = useState(true);
  const [editStudent, setEditStudent] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [editErrors, setEditErrors] = useState({});
  const limit = 20;

  const loadStudents = useCallback((p) => {
    getOfficeStudents(p || page, limit).then(res => {
      setStudents(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    }).catch(err => {
      console.error(err);
      showToast.error('Failed to load students. Is the backend running?');
    }).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { loadStudents(page); }, [page, loadStudents]);

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const normalizeRegNumber = (input) => {
    let val = input.trim();
    if (!val) return '';
    val = val.replace(/^CIIT\//i, '').replace(/\/ATD$/i, '');
    const match = val.match(/^([a-z]{2}\d{2})-([a-z]{2,4})-(\d{1,3})$/i);
    if (match) {
      const session = match[1].toUpperCase();
      const program = match[2].toUpperCase();
      const number = match[3].padStart(3, '0');
      return `CIIT/${session}-${program}-${number}/ATD`;
    }
    return `CIIT/${val.toUpperCase()}/ATD`;
  };

  const handleRegBlur = (e) => {
    const normalized = normalizeRegNumber(e.target.value);
    if (normalized) setForm(f => ({ ...f, reg: normalized }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || submitLock.current) return;
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    submitLock.current = true;
    setSubmitting(true);
    try {
      await createOfficeStudent({
        name: form.name.trim(),
        regNo: form.reg,
        email: form.email.trim(),
        semester: form.semester,
        fatherName: form.fatherName.trim(),
        whatsappNumber: form.whatsappNumber.trim(),
        section: form.section.trim().toUpperCase(),
        cgpa: form.cgpa || undefined
      });
      showToast.success('Student onboarded successfully!');
      sendWelcomeEmail({
        name: form.name.trim(),
        email: form.email.trim(),
        regNo: form.reg,
      }).catch(() => {});
      setShowForm(false);
      setForm(initialForm);
      setPage(1);
      loadStudents(1);
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to create student.');
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  };

  const handleDelete = (student) => {
    showAlert.confirm(
      'Deactivate Student',
      `Deactivate ${student.name}? Their account will be disabled but all existing records (groups, proposals, evaluations) will be preserved.`,
      'Deactivate',
      'Cancel'
    ).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await deleteOfficeStudent(student.id);
          showToast.success(`${student.name} deactivated.`);
          loadStudents(page);
        } catch (err) {
          showToast.error(err?.response?.data?.message || 'Failed to deactivate student.');
        }
      }
    });
  };

  const handleEdit = (student) => {
    setEditStudent(student);
    setEditForm({
      name: student.name || '',
      reg: student.regNo || '',
      email: student.email || '',
      semester: student.semester?.toString() || '7',
      fatherName: student.fatherName || '',
      whatsappNumber: student.whatsappNumber || '',
      section: student.section || '',
      cgpa: student.cgpa?.toString() || ''
    });
    setEditErrors({});
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const errs = validateForm(editForm);
    setEditErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      await updateOfficeStudent(editStudent.id, {
        name: editForm.name.trim(),
        regNo: editForm.reg,
        email: editForm.email.trim(),
        semester: editForm.semester,
        fatherName: editForm.fatherName.trim(),
        whatsappNumber: editForm.whatsappNumber.trim(),
        section: editForm.section.trim().toUpperCase(),
        cgpa: editForm.cgpa || undefined
      });
      showToast.success('Student updated successfully!');
      setEditStudent(null);
      loadStudents(page);
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to update student.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    showToast.success('Bulk message sent successfully!');
    setIsBulkOpen(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight">Student Management</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Search registration numbers, filter by FYP status, onboard new students, and dispatch bulk milestone messages</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (showForm) { setForm(initialForm); setErrors({}); }
              setShowForm(!showForm);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${showForm ? 'bg-gray-50 text-gray-600 border border-gray-200' : 'bg-primary text-white border-0 hover:bg-navy-dark'}`}
          >
            <UserPlus className="w-4 h-4" /> {showForm ? 'Close' : 'Add Student'}
          </button>
          <button onClick={() => setIsBulkOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer shadow-sm">
            <Send className="w-4 h-4" /> Bulk Message
          </button>
        </div>
      </div>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? 'max-h-[800px] opacity-100 mb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-inner">
          <div className="flex items-center gap-3 sm:gap-4 mb-6">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-800 tracking-tight">Manual Registration</h3>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest">Pre-filling eligibility data for FYP cycle</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Full Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Student's Legal Name" className={`w-full bg-white border ${errors.name ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`} />
                {errors.name && <p className="text-[10px] font-bold text-rose-500 mt-1 tracking-wider">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Registration Number *</label>
                <input type="text" value={form.reg} onChange={e => setForm(f => ({ ...f, reg: e.target.value }))} onBlur={handleRegBlur} placeholder="FA21-BCS-001" className={`w-full bg-white border ${errors.reg ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-mono`} />
                {errors.reg && <p className="text-[10px] font-bold text-rose-500 mt-1 tracking-wider">{errors.reg}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Institutional Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="name@cuiatd.edu.pk" className={`w-full bg-white border ${errors.email ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`} />
                {errors.email && <p className="text-[10px] font-bold text-rose-500 mt-1 tracking-wider">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Current Semester</label>
                <select value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer">
                  {['1', '2', '3', '4', '5', '6', '7', '8'].map(s => <option key={s} value={s}>Sem {s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Father's Name</label>
                <input type="text" value={form.fatherName} onChange={e => setForm(f => ({ ...f, fatherName: e.target.value }))} placeholder="Parent/Guardian Name" className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">WhatsApp Number</label>
                <input type="text" value={form.whatsappNumber} onChange={e => setForm(f => ({ ...f, whatsappNumber: e.target.value }))} placeholder="03XXXXXXXXX" className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Section (A/B/C/D)</label>
                <input type="text" value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))} placeholder="e.g. A" className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Current CGPA</label>
                <input type="text" inputMode="decimal" autoCapitalize="none" value={form.cgpa} onChange={e => setForm(f => ({ ...f, cgpa: e.target.value }))} placeholder="e.g. 3.25" className={`w-full bg-white border ${errors.cgpa ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`} />
                {errors.cgpa && <p className="text-[10px] font-bold text-rose-500 mt-1 tracking-wider">{errors.cgpa}</p>}
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-200/50">
              <button type="submit" disabled={submitting} className="px-10 py-3 bg-primary text-white rounded-xl text-xs font-black tracking-widest shadow-lg shadow-primary/20 hover:bg-navy-dark hover:shadow-xl hover:shadow-primary/30 transition-all cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {submitting ? 'Processing...' : 'Complete Enrollment'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search student name or reg no..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-gray-400 tracking-wider">FYP Status:</span>
          <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer">
            <option value="">All Statuses</option>
            <option value="No Project">No Project</option>
            <option value="FYP-1">FYP-1</option>
            <option value="FYP-2">FYP-2</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[11px] font-bold text-gray-400 tracking-wider">
                <th className="py-3.5 px-6">Student Name</th>
                <th className="py-3.5 px-6">Registration Number</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Semester/Section</th>
                <th className="py-3.5 px-6">FYP Status</th>
                <th className="py-3.5 px-6">Assigned Project</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
              {loading
                ? Array.from({ length: 5 }, (_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 7 }, (_, j) => (
                        <td key={j} className="py-4 px-6"><div className="h-4 rounded-md skeleton w-24" /></td>
              ))}
                    </tr>
                  ))
                : students.map(s => (
                <tr key={s.id || s._id} className={`hover:bg-gray-50/50 transition-colors ${s.isactive === false ? 'opacity-50' : ''}`}>
                  <td className="py-4 px-6 font-bold text-gray-800">
                    {s.name}
                    {s.isactive === false && <span className="ml-2 text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg">Deactivated</span>}
                  </td>
                  <td className="py-4 px-6 text-gray-500 font-mono text-xs">{s.regNo || s.id}</td>
                  <td className="py-4 px-6 text-gray-600 text-xs">{s.email || '-'}</td>
                  <td className="py-4 px-6 text-gray-600 text-xs">{s.semester ? `Sem ${s.semester}` : '-'}{s.section ? ` / ${s.section}` : ''}</td>
                  <td className="py-4 px-6">
                    <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border tracking-wider ${
                      s.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : s.status?.includes('FYP-2') ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : s.status?.includes('FYP-1') ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}>{s.status || 'Not Started'}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 truncate max-w-[200px]" title={s.project}>{s.project || 'Not assigned'}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => handleEdit(s)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold transition-all hover:bg-blue-100 cursor-pointer flex items-center gap-1.5">
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      {s.isactive !== false && (
                        <button onClick={() => handleDelete(s)} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold transition-all hover:bg-rose-100 cursor-pointer flex items-center gap-1.5">
                          <Trash2 className="w-3 h-3" /> Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-xs font-bold text-gray-400">{total} total students</span>
          <div className="flex items-center gap-2">
            <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 3, totalPages - 6));
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <button key={p} onClick={() => goToPage(p)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${p === page ? 'bg-primary text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {editStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">Edit Student</h3>
              <button onClick={() => setEditStudent(null)} className="w-8 h-8 rounded-lg bg-gray-50 border-0 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Full Name *</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className={`w-full bg-white border ${editErrors.name ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`} />
                  {editErrors.name && <p className="text-[10px] font-bold text-rose-500 mt-1">{editErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Registration Number *</label>
                  <input type="text" value={editForm.reg} onChange={e => setEditForm(f => ({ ...f, reg: e.target.value }))} className={`w-full bg-white border ${editErrors.reg ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-mono`} />
                  {editErrors.reg && <p className="text-[10px] font-bold text-rose-500 mt-1">{editErrors.reg}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Email *</label>
                  <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className={`w-full bg-white border ${editErrors.email ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`} />
                  {editErrors.email && <p className="text-[10px] font-bold text-rose-500 mt-1">{editErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Semester</label>
                  <select value={editForm.semester} onChange={e => setEditForm(f => ({ ...f, semester: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-primary cursor-pointer">
                    {['1', '2', '3', '4', '5', '6', '7', '8'].map(s => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Father's Name</label>
                  <input type="text" value={editForm.fatherName} onChange={e => setEditForm(f => ({ ...f, fatherName: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">WhatsApp Number</label>
                  <input type="text" value={editForm.whatsappNumber} onChange={e => setEditForm(f => ({ ...f, whatsappNumber: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Section (A/B/C/D)</label>
                  <input type="text" value={editForm.section} onChange={e => setEditForm(f => ({ ...f, section: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Current CGPA</label>
                  <input type="text" inputMode="decimal" value={editForm.cgpa} onChange={e => setEditForm(f => ({ ...f, cgpa: e.target.value }))} className={`w-full bg-white border ${editErrors.cgpa ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all`} />
                  {editErrors.cgpa && <p className="text-[10px] font-bold text-rose-500 mt-1">{editErrors.cgpa}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setEditStudent(null)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-sm hover:bg-navy-dark transition-all cursor-pointer disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBulkOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">Compose Bulk Message</h3>
              <button onClick={() => setIsBulkOpen(false)} className="w-8 h-8 rounded-lg bg-gray-50 border-0 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleBulkSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Selected Recipients</label>
                <input type="text" readOnly className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-500 outline-none" value="All Students Selected" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Message Subject</label>
                <input type="text" placeholder="e.g. Urgent: FYP Milestone Deliverable Reminder" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Message Body</label>
                <textarea placeholder="Compose your official dispatch here..." className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all h-32" required></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsBulkOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer border-0 tracking-wider">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold tracking-widest shadow-sm hover:bg-navy-dark transition-all cursor-pointer border-0 flex items-center gap-2"><Send className="w-4 h-4" /> Send Broadcast</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantStudents;
