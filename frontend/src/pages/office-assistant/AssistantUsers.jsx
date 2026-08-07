import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { getOfficeUsers, deleteOfficeUser, updateOfficeUser } from '../../services/office-assistant.service';
import { showToast as toast } from '../../components/AppToast';
import { Search, ChevronLeft, ChevronRight, AlertCircle, Loader2, CheckSquare, Square, Pencil, RefreshCw, Ban, Trash2, X } from 'lucide-react';

const ROLE_OPTIONS = ['student', 'faculty', 'fyp_office', 'admin', 'hod', 'industry'];

const ROLES_MAP = {
  student: 'Student',
  faculty: 'Faculty Supervisor',
  fyp_office: 'FYP Office',
  admin: 'Administrator',
  hod: 'Head of Department',
  industry: 'Industry Supervisor'
};

const normalizeStatus = (u) => {
  if (u.isactive === false) return 'deactivated';
  if (u.locked || u.status === 'locked') return 'locked';
  return 'active';
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
};

const AssistantUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 20;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const loadUsers = useCallback((p, term, filter) => {
    setLoading(true);
    setError(null);
    getOfficeUsers(p || page, limit, term || search, filter || statusFilter).then(res => {
      setUsers(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    }).catch(err => {
      console.error(err);
      setError('Failed to load users.');
      setUsers([]);
    }).finally(() => setLoading(false));
  }, [page, search, statusFilter]);

  useEffect(() => { loadUsers(page); }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() || statusFilter) { setPage(1); loadUsers(1); }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const goToPage = (p) => { if (p >= 1 && p <= totalPages) setPage(p); };

  const handleDeactivate = async (u) => {
    if (!window.confirm(`Deactivate "${u.name}"? Their account will be disabled but data preserved.`)) return;
    setDeletingId(u.id);
    try {
      await deleteOfficeUser(u.id);
      toast.success('Deactivated', `${u.name} has been deactivated.`);
      loadUsers(page);
    } catch (err) {
      toast.error('Failed', err?.response?.data?.message || 'Could not deactivate.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleReactivate = async (u) => {
    if (!window.confirm(`Reactivate "${u.name}"?`)) return;
    setDeletingId(u.id);
    try {
      await fetch(`/api/office-assistant/users/${u.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ isactive: true })
      });
      toast.success('Reactivated', `${u.name} is now active.`);
      loadUsers(page);
    } catch (err) {
      toast.error('Failed', 'Could not reactivate.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleHardDelete = async (u) => {
    if (!window.confirm(`PERMANENTLY DELETE "${u.name}"?\n\nThis removes ALL data from the database forever. This CANNOT be undone.`)) return;
    if (!window.confirm(`FINAL WARNING: Delete "${u.name}" and all related records permanently?`)) return;
    setDeletingId(u.id);
    try {
      await fetch(`/api/office-assistant/users/${u.id}/hard`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Deleted', `${u.name} permanently removed.`);
      loadUsers(page);
    } catch (err) {
      toast.error('Failed', 'Could not delete user.');
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setEditForm({ name: u.name || '', email: u.email || '', role: u.roles?.[0] || u.roleDetail || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', email: '', role: '' });
  };

  const submitEdit = async (u) => {
    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.role) {
      toast.error('Name, email, and role are required.');
      return;
    }
    setSubmitting(true);
    try {
      await updateOfficeUser(u.id, {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        role: editForm.role
      });
      toast.success('Updated', `${editForm.name} saved.`);
      setEditingId(null);
      loadUsers(page);
    } catch (err) {
      toast.error('Failed', err?.response?.data?.message || 'Could not update.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const allIds = users.map(u => u.id);
    setSelectedIds(prev => prev.length === allIds.length ? [] : allIds);
  };

  const handleBulkDeactivate = async () => {
    const targets = users.filter(u => selectedIds.includes(u.id) && u.isactive !== false);
    if (targets.length === 0) { toast.error('No active users selected.'); return; }
    if (!window.confirm(`Deactivate ${targets.length} selected user(s)?`)) return;
    setBulkProcessing(true);
    let ok = 0, fail = 0;
    for (const u of targets) {
      try { await deleteOfficeUser(u.id); ok++; } catch { fail++; }
    }
    toast.success(`Done`, `${ok} deactivated${fail > 0 ? `, ${fail} failed` : ''}`);
    setSelectedIds([]);
    setBulkProcessing(false);
    loadUsers(page);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`PERMANENTLY DELETE ${selectedIds.length} selected user(s)? This cannot be undone.`)) return;
    if (!window.confirm(`FINAL WARNING: Delete ${selectedIds.length} users and ALL their data forever?`)) return;
    setBulkProcessing(true);
    let ok = 0, fail = 0;
    for (const id of selectedIds) {
      try {
        await fetch(`/api/office-assistant/users/${id}/hard`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        ok++;
      } catch { fail++; }
    }
    toast.success(`Done`, `${ok} deleted${fail > 0 ? `, ${fail} failed` : ''}`);
    setSelectedIds([]);
    setBulkProcessing(false);
    loadUsers(page);
  };

  const handleResetPassword = async (u) => {
    const pwd = window.prompt(`Enter new password for "${u.name}" (min 6 chars):`);
    if (!pwd || pwd.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    try {
      await fetch(`/api/office-assistant/users/${u.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ password: pwd })
      });
      toast.success('Password Updated', `New password sent to ${u.email || u.name}`);
    } catch (err) {
      toast.error('Failed', 'Could not update password.');
    }
  };

  const handleBulkResetPassword = async () => {
    const pwd = window.prompt(`Enter new password for ${selectedIds.length} selected user(s) (min 6 chars):`);
    if (!pwd || pwd.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    let ok = 0;
    for (const id of selectedIds) {
      try {
        await fetch(`/api/office-assistant/users/${id}/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify({ password: pwd })
        });
        ok++;
      } catch {}
    }
    toast.success('Done', `${ok} passwords updated and emailed`);
    setSelectedIds([]);
  };
  const pageNumbers = useMemo(() => {
    const pages = [];
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight">User Account Management</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Deactivate, reactivate, edit, or permanently delete user accounts</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or role..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-gray-400">Status:</span>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-primary cursor-pointer">
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="locked">Locked</option>
            <option value="inactive">Deactivated</option>
          </select>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-sm font-bold text-primary">{selectedIds.length} selected</span>
          <div className="flex gap-2">
            <button onClick={handleBulkDeactivate} disabled={bulkProcessing} className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 cursor-pointer border-0 disabled:opacity-50 flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5" /> Deactivate
            </button>
            <button onClick={handleBulkResetPassword} disabled={bulkProcessing} className="px-4 py-2 rounded-xl bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 cursor-pointer border-0 disabled:opacity-50 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Reset Password
            </button>
            <button onClick={handleBulkDelete} disabled={bulkProcessing} className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer border-0 disabled:opacity-50 flex items-center gap-1.5">
              {bulkProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete
            </button>
            <button onClick={() => setSelectedIds([])} className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-50 cursor-pointer flex items-center gap-1.5">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 tracking-wider">
                <th className="py-2.5 px-3 w-10">
                  <button onClick={toggleSelectAll} className="cursor-pointer border-0 bg-transparent p-0 text-gray-400 hover:text-primary transition-colors" title="Select all">
                    {selectedIds.length === users.length && users.length > 0 ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="py-2.5 px-4">User</th>
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4">Role</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right w-[80px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
              {loading ? (
                Array.from({ length: 6 }, (_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }, (_, j) => <td key={j} className="py-3 px-4"><div className="h-4 rounded-md bg-gray-100" /></td>)}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <AlertCircle className="w-8 h-8" />
                      <p className="text-sm font-bold">{error}</p>
                      <button onClick={() => loadUsers(1)} className="text-xs text-primary font-bold hover:underline cursor-pointer bg-transparent border-0">Retry</button>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Search className="w-8 h-8" />
                      <p className="text-sm font-bold">{search || statusFilter ? 'No users match.' : 'No users found.'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map(u => {
                  const status = normalizeStatus(u);
                  const isEditing = editingId === u.id;
                  const isDeleting = deletingId === u.id;

                  return (
                    <React.Fragment key={u.id || u._id}>
                      <tr className={`hover:bg-gray-50/50 transition-colors ${status === 'deactivated' ? 'opacity-50' : ''} ${isEditing ? 'bg-blue-50/30' : ''} ${selectedIds.includes(u.id) ? 'bg-primary/5' : ''}`}>
                        <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => toggleSelect(u.id)} className="cursor-pointer border-0 bg-transparent p-0 text-gray-400 hover:text-primary transition-colors">
                            {selectedIds.includes(u.id) ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
                          </button>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold flex-shrink-0 text-[10px]">{getInitials(u.name)}</div>
                            <div>
                              <div className="font-bold text-gray-800 text-sm leading-tight">{u.name || 'Unknown'}</div>
                              <div className="text-[10px] text-gray-400 leading-tight">{u.roleDetail || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-xs text-gray-500 truncate max-w-[180px]" title={u.email}>{u.email || '-'}</td>
                        <td className="py-2.5 px-4">
                          <span className="bg-secondary/5 text-secondary font-bold text-[10px] px-2 py-0.5 rounded-lg border border-secondary/10 whitespace-nowrap">{ROLES_MAP[u.roles?.[0]] || u.roleDetail || u.roles?.[0] || 'N/A'}</span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className={`font-bold text-[10px] px-2 py-0.5 rounded-lg border ${status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : status === 'locked' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                            {status === 'deactivated' ? 'Deactivated' : status === 'locked' ? 'Locked' : 'Active'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex justify-end gap-1">
                            {status === 'deactivated' ? (
                              <button onClick={() => handleReactivate(u)} disabled={isDeleting} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 cursor-pointer disabled:opacity-40" title="Reactivate">
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button onClick={() => isEditing ? cancelEdit() : startEdit(u)} className={`p-1.5 rounded-lg cursor-pointer border ${isEditing ? 'bg-gray-100 text-gray-600 border-gray-300' : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'}`} title={isEditing ? 'Cancel' : 'Edit'}>
                                {isEditing ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isEditing && (
                        <tr key={`edit-${u.id}`} className="bg-blue-50/20">
                          <td colSpan={6} className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">Name</label>
                                <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">Email</label>
                                <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">Role</label>
                                <select value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 outline-none focus:border-primary cursor-pointer">
                                  <option value="">Select...</option>
                                  {ROLE_OPTIONS.map(r => <option key={r} value={r}>{ROLES_MAP[r] || r}</option>)}
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-3">
                              <button onClick={cancelEdit} className="px-4 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer border-0">Cancel</button>
                              <button onClick={() => submitEdit(u)} disabled={submitting} className="px-5 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-navy-dark cursor-pointer border-0 disabled:opacity-50 flex items-center gap-1.5">
                                {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
                                Save
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-bold text-gray-400">{total} total users</span>
        <div className="flex items-center gap-1">
          <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="w-10 h-10 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          {pageNumbers.map(p => (
            <button key={p} onClick={() => goToPage(p)} className={`w-10 h-10 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${p === page ? 'bg-primary text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{p}</button>
          ))}
          <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="w-10 h-10 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantUsers;
