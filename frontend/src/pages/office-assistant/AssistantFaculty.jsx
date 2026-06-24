import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { getOfficeFaculty, createOfficeFaculty, deleteOfficeFaculty, sendFacultyInvite, updateOfficeFaculty } from '../../services/office-assistant.service';
import { showToast, showAlert } from '../../components/AppToast';
import { Search, UserPlus, X, Send, Trash2, Pencil, Loader2, AlertCircle, ChevronLeft, ChevronRight, UserCheck, UserX } from 'lucide-react';

const FACULTY_TYPES = ['committee', 'supervisor', 'both'];
const initialForm = { name: '', email: '', facultyType: 'supervisor', phone: '' };
const TYPE_COLORS = { committee: 'bg-purple-50 text-purple-700 border-purple-200', supervisor: 'bg-blue-50 text-blue-700 border-blue-200', both: 'bg-emerald-50 text-emerald-700 border-emerald-200' };

const AssistantFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 20;

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);

  const [editFaculty, setEditFaculty] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);

  const loadFaculty = useCallback((p) => {
    setLoading(true);
    setError(null);
    getOfficeFaculty(p || page, limit, search, typeFilter, statusFilter).then(res => {
      setFaculty(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    }).catch(err => {
      console.error(err);
      setError('Failed to load faculty.');
      setFaculty([]);
    }).finally(() => setLoading(false));
  }, [page, search, typeFilter, statusFilter]);

  useEffect(() => { loadFaculty(page); }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadFaculty(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, typeFilter, statusFilter]);

  const goToPage = (p) => { if (p >= 1 && p <= totalPages) setPage(p); };

  const validateForm = (form) => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.facultyType) e.facultyType = 'Select a faculty type';
    return e;
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
      await createOfficeFaculty({ name: form.name.trim(), email: form.email.trim(), facultyType: form.facultyType, phone: form.phone.trim() || undefined });
      showToast.success('Faculty onboarded successfully.');
      setShowForm(false);
      setForm(initialForm);
      setPage(1);
      loadFaculty(1);
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to create faculty.');
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  };

  const handleDelete = (f) => {
    showAlert.confirm('Delete Faculty', `Permanently delete ${f.name}?`, 'Delete', 'Cancel').then(async (res) => {
      if (res.isConfirmed) {
        try {
          await deleteOfficeFaculty(f.id);
          showToast.success(`${f.name} deleted.`);
          loadFaculty(page);
        } catch (err) {
          showToast.error(err?.response?.data?.message || 'Failed to delete.');
        }
      }
    });
  };

  const handleEdit = (f) => {
    setEditFaculty(f);
    setEditForm({ name: f.name || '', email: f.email || '', facultyType: f.facultyType || 'supervisor', phone: f.phone || '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm(editForm);
    if (Object.keys(errs).length) { showToast.error('Please fill in all required fields.'); return; }
    setSubmitting(true);
    try {
      await updateOfficeFaculty(editFaculty.id, { name: editForm.name.trim(), email: editForm.email.trim(), facultyType: editForm.facultyType, phone: editForm.phone.trim() });
      showToast.success('Faculty updated successfully.');
      setEditFaculty(null);
      loadFaculty(page);
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to update.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendInvite = async (f) => {
    try {
      await sendFacultyInvite(f.id);
      showToast.success(`Invitation resent to ${f.email}`);
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to resend.');
    }
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight">Faculty Management</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Supervisor & Committee Faculty — onboard, invite, edit, and monitor status</p>
        </div>
        <button onClick={() => { if (showForm) { setForm(initialForm); setErrors({}); } setShowForm(!showForm); }} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${showForm ? 'bg-gray-50 text-gray-600 border border-gray-200' : 'bg-primary text-white border-0 hover:bg-navy-dark'}`}>
          <UserPlus className="w-4 h-4" /> {showForm ? 'Close' : 'Add Faculty'}
        </button>
      </div>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? 'max-h-[600px] opacity-100 mb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-inner">
          <div className="flex items-center gap-3 sm:gap-4 mb-6">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0"><UserPlus className="w-5 h-5" /></div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-800 tracking-tight">Manual Faculty Registration</h3>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest">Onboard new committee or supervisor faculty</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Full Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Faculty Name" className={`w-full bg-white border ${errors.name ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all`} />
                {errors.name && <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="name@cuiatd.edu.pk" className={`w-full bg-white border ${errors.email ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all`} />
                {errors.email && <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Faculty Type *</label>
                <select value={form.facultyType} onChange={e => setForm(f => ({ ...f, facultyType: e.target.value }))} className={`w-full bg-white border ${errors.facultyType ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-primary cursor-pointer`}>
                  <option value="supervisor">Supervisor Faculty</option>
                  <option value="committee">Committee Faculty</option>
                  <option value="both">Both</option>
                </select>
                {errors.facultyType && <p className="text-[10px] font-bold text-rose-500 mt-1">{errors.facultyType}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Phone Number</label>
                <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="03XXXXXXXXX" className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-200/50">
              <button type="submit" disabled={submitting} className="px-10 py-3 bg-primary text-white rounded-xl text-xs font-black tracking-widest shadow-lg shadow-primary/20 hover:bg-navy-dark transition-all cursor-pointer border-0 disabled:opacity-50 flex items-center gap-2">
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {submitting ? 'Processing...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search faculty name or email..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-primary transition-all" />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-gray-400">Type:</span>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-primary cursor-pointer">
            <option value="">All</option>
            <option value="committee">Committee</option>
            <option value="supervisor">Supervisor</option>
            <option value="both">Both</option>
          </select>
          <span className="text-xs font-bold text-gray-400 ml-2">Status:</span>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-primary cursor-pointer">
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 tracking-wider">
                <th className="py-2.5 px-4">Faculty</th>
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Groups</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
              {loading ? (
                Array.from({ length: 6 }, (_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }, (_, j) => (
                      <td key={j} className="py-3 px-4"><div className="h-4 rounded-md skeleton" /></td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <AlertCircle className="w-8 h-8" />
                      <p className="text-sm font-bold">{error}</p>
                      <button onClick={() => loadFaculty(1)} className="text-xs text-primary font-bold hover:underline cursor-pointer bg-transparent border-0">Retry</button>
                    </div>
                  </td>
                </tr>
              ) : faculty.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Search className="w-8 h-8" />
                      <p className="text-sm font-bold">{search || typeFilter || statusFilter ? 'No faculty match your filters.' : 'No faculty found.'}</p>
                      {(search || typeFilter || statusFilter) && (
                        <button onClick={() => { setSearch(''); setTypeFilter(''); setStatusFilter(''); }} className="text-xs text-primary font-bold hover:underline cursor-pointer bg-transparent border-0">Clear filters</button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                faculty.map(f => (
                  <tr key={f.id} className={`hover:bg-gray-50/50 transition-colors ${!f.active ? 'opacity-50' : ''}`}>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0 text-[10px] ${f.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {f.name?.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'}
                        </div>
                        <div className="font-bold text-gray-800 text-sm leading-tight">{f.name}</div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-gray-500 truncate max-w-[180px]" title={f.email}>{f.email || '-'}</td>
                    <td className="py-2.5 px-4">
                      <span className={`font-bold text-[10px] px-2 py-0.5 rounded-lg border ${TYPE_COLORS[f.facultyType] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{f.facultyType}</span>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-gray-500">
                      <span className="font-bold">{f.proposed}</span> proposed, <span className="font-bold">{f.inProgress}</span> active
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-lg border w-fit ${f.active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        {f.active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        {f.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleEdit(f)} className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold transition-all hover:bg-blue-100 cursor-pointer flex items-center gap-1">
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                        {!f.active && (
                          <button onClick={() => handleResendInvite(f)} className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold transition-all hover:bg-amber-100 cursor-pointer flex items-center gap-1" title="Resend Invite">
                            <Send className="w-3 h-3" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(f)} className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold transition-all hover:bg-rose-100 cursor-pointer flex items-center gap-1">
                          <Trash2 className="w-3 h-3" /> Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 px-1">
        <span className="text-[11px] font-bold text-gray-400">{total} total faculty</span>
        <div className="flex items-center gap-1">
          <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          {pageNumbers.map(p => (
            <button key={p} onClick={() => goToPage(p)} className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${p === page ? 'bg-primary text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{p}</button>
          ))}
          <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {editFaculty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Edit Faculty</h3>
              <button onClick={() => setEditFaculty(null)} className="w-8 h-8 rounded-lg bg-gray-50 border-0 flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Full Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Email</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Faculty Type</label>
                <select value={editForm.facultyType} onChange={e => setEditForm(f => ({ ...f, facultyType: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-primary cursor-pointer" required>
                  <option value="supervisor">Supervisor Faculty</option>
                  <option value="committee">Committee Faculty</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Phone Number</label>
                <input type="text" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setEditFaculty(null)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer border-0">Cancel</button>
                <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-sm hover:bg-navy-dark transition-all cursor-pointer border-0 disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantFaculty;
