import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { getOfficeUsers, deleteOfficeUser, updateOfficeUser } from '../../services/office-assistant.service';
import { showToast, showAlert } from '../../components/AppToast';
import { Search, UserPlus, X, ChevronLeft, ChevronRight, Trash2, Pencil, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

const ROLE_OPTIONS = ['student', 'faculty', 'fyp_office', 'admin', 'hod', 'industry'];

const ROLES_MAP = {
  student: 'Student',
  faculty: 'Faculty Supervisor',
  fyp_office: 'FYP Office Assistant',
  admin: 'Administrator',
  hod: 'Head of Department',
  industry: 'Industry Supervisor'
};

const normalizeStatus = (u) => {
  if (u.isactive === false) return 'Deactivated';
  if (u.locked || u.status === 'locked') return 'Locked';
  return 'Active';
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

  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = useCallback((p, term, filter) => {
    setLoading(true);
    setError(null);
    getOfficeUsers(p || page, limit, term || search, filter || statusFilter).then(res => {
      setUsers(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    }).catch(err => {
      console.error(err);
      setError('Failed to load users. Is the backend running?');
      setUsers([]);
    }).finally(() => setLoading(false));
  }, [page, search, statusFilter]);

  useEffect(() => { loadUsers(page); }, [page]);

  const handleSearch = useCallback(() => {
    setPage(1);
    loadUsers(1);
  }, [loadUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() || statusFilter) {
        setPage(1);
        loadUsers(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const handleDelete = (u) => {
    showAlert.confirm(
      'Deactivate User',
      `Deactivate ${u.name}? Their account will be disabled.`,
      'Deactivate',
      'Cancel'
    ).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await deleteOfficeUser(u.id);
          showToast.success(`${u.name} deactivated.`);
          loadUsers(page);
        } catch (err) {
          showToast.error(err?.response?.data?.message || 'Failed to deactivate user.');
        }
      }
    });
  };

  const handleEdit = (u) => {
    setEditUser(u);
    setEditForm({ name: u.name || '', email: u.email || '', role: u.roles?.[0] || u.roleDetail || '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.role) {
      showToast.error('Name, email, and role are required.');
      return;
    }
    setSubmitting(true);
    try {
      await updateOfficeUser(editUser.id, {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        role: editForm.role
      });
      showToast.success('User updated successfully.');
      setEditUser(null);
      loadUsers(page);
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to update user.');
    } finally {
      setSubmitting(false);
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
          <h2 className="text-xl font-black text-gray-800 tracking-tight">User Account Management</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Manage system accounts, assign or revoke roles, and handle account locks</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => {
            const q = search.trim();
            if (q) { setPage(1); loadUsers(1); }
          }} className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer shadow-sm">
            <Search className="w-4 h-4" /> Search
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-gray-400">Status:</span>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer">
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="locked">Locked</option>
            <option value="inactive">Deactivated</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 tracking-wider">
                <th className="py-2.5 px-4">User</th>
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4">Role</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
              {loading ? (
                Array.from({ length: 6 }, (_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 5 }, (_, j) => (
                      <td key={j} className="py-3 px-4"><div className="h-4 rounded-md skeleton" /></td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <AlertCircle className="w-8 h-8" />
                      <p className="text-sm font-bold">{error}</p>
                      <button onClick={() => loadUsers(1)} className="text-xs text-primary font-bold hover:underline cursor-pointer bg-transparent border-0">Retry</button>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Search className="w-8 h-8" />
                      <p className="text-sm font-bold">{search || statusFilter ? 'No users match your search.' : 'No users found.'}</p>
                      {(search || statusFilter) && (
                        <button onClick={() => { setSearch(''); setStatusFilter(''); }} className="text-xs text-primary font-bold hover:underline cursor-pointer bg-transparent border-0">Clear filters</button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                users.map(u => {
                  const status = normalizeStatus(u);
                  return (
                    <tr key={u.id || u._id} className={`hover:bg-gray-50/50 transition-colors ${status === 'Deactivated' ? 'opacity-50' : ''}`}>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-bold flex-shrink-0 text-[10px]">
                            {getInitials(u.name)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800 text-sm leading-tight">{u.name || 'Unknown'}</div>
                            <div className="text-[10px] text-gray-400 leading-tight">{u.roleDetail || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-500 truncate max-w-[180px]" title={u.email}>{u.email || '-'}</td>
                      <td className="py-2.5 px-4">
                        <span className="bg-secondary/5 text-secondary font-bold text-[10px] px-2 py-0.5 rounded-lg border border-secondary/10 whitespace-nowrap">
                          {ROLES_MAP[u.roles?.[0]] || u.roleDetail || u.roles?.[0] || 'N/A'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`font-bold text-[10px] px-2 py-0.5 rounded-lg border ${
                          status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : status === 'Locked' ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}>{status}</span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => handleEdit(u)} className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold transition-all hover:bg-blue-100 cursor-pointer flex items-center gap-1">
                            <Pencil className="w-3 h-3" /> Edit
                          </button>
                          {status !== 'Deactivated' && (
                            <button onClick={() => handleDelete(u)} className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold transition-all hover:bg-rose-100 cursor-pointer flex items-center gap-1">
                              <Trash2 className="w-3 h-3" /> Del
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 px-1">
        <span className="text-[11px] font-bold text-gray-400">{total} total users</span>
        <div className="flex items-center gap-1">
          <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="w-10 h-10 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          {pageNumbers.map(p => (
            <button key={p} onClick={() => goToPage(p)} className={`w-10 h-10 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${p === page ? 'bg-primary text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
              {p}
            </button>
          ))}
          <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="w-10 h-10 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {editUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Edit User</h3>
              <button onClick={() => setEditUser(null)} className="w-8 h-8 rounded-lg bg-gray-50 border-0 flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Full Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Email Address</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Role</label>
                <select value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer" required>
                  <option value="">Select role...</option>
                  {ROLE_OPTIONS.map(r => (
                    <option key={r} value={r}>{ROLES_MAP[r] || r}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setEditUser(null)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer border-0">Cancel</button>
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

export default AssistantUsers;
