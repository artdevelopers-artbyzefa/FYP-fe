import React, { useEffect, useState, useCallback } from 'react';
import { getOfficeUsers, deleteOfficeUser } from '../../services/office-assistant.service';
import { showToast, showAlert } from '../../components/AppToast';
import { Search, UserPlus, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
};

const getUserKey = (u) => u._id || u.id || u.email || Math.random();

const STATUS_KEYS = {
  active: 'Active',
  locked: 'Locked',
  deactivated: 'Deactivated',
  inactive: 'Deactivated',
  pending: 'Locked',
};

const normalizeStatus = (raw) => {
  if (!raw) return 'Active';
  const lower = raw.toLowerCase();
  for (const [key, val] of Object.entries(STATUS_KEYS)) {
    if (lower === key || lower.startsWith(key)) return val;
  }
  if (raw === true || raw === 'true') return 'Active';
  if (raw === false || raw === 'false') return 'Deactivated';
  return 'Active';
};

const AssistantUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const limit = 20;

  const loadUsers = useCallback((p) => {
    getOfficeUsers(p || page, limit).then(res => {
      setUsers(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    }).catch(console.error);
  }, [page]);

  useEffect(() => { loadUsers(page); }, [page, loadUsers]);

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    showToast.success('User registered successfully!');
    setIsCreateOpen(false);
  };

  const handleDelete = (u) => {
    showAlert.confirm(
      'Deactivate User',
      `Deactivate ${u.name}? Their account will be disabled but all existing records will be preserved.`,
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

  const renderActions = (u) => {
    const status = normalizeStatus(u.status);
    return (
      <div className="flex flex-wrap gap-1.5 justify-end">
        {status === 'Locked' && (
          <button onClick={() => showToast.success('Account unlocked!')} className="px-3 py-1.5 rounded-lg bg-primary/5 text-primary border border-primary/10 text-xs font-bold transition-all hover:bg-primary/10 cursor-pointer whitespace-nowrap">
            Unlock
          </button>
        )}
        <button onClick={() => handleDelete(u)} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold transition-all hover:bg-rose-100 cursor-pointer whitespace-nowrap flex items-center gap-1">
          <Trash2 className="w-3 h-3" /> Delete
        </button>
      </div>
    );
  };

  const renderRoles = (roles) => {
    if (!roles || !roles.length) return <span className="text-xs text-gray-300">No roles</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((r, i) => (
          <span key={i} className="bg-secondary/5 text-secondary font-bold text-[10px] px-2 py-0.5 rounded-lg border border-secondary/10 whitespace-nowrap">{r}</span>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight">User Account Management</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Manage system accounts, assign or revoke roles, and handle account locks</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-secondary transition-all cursor-pointer shadow-sm">
          <UserPlus className="w-4 h-4" /> Create New User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search by name, email, or role..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-gray-400">Filter Status:</span>
          <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Locked">Locked</option>
            <option value="Deactivated">Deactivated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:hidden">
        {users.map(u => {
          const status = normalizeStatus(u.status);
          return (
            <div key={getUserKey(u)} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-bold flex-shrink-0 text-xs">
                  {getInitials(u.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-gray-800 text-sm truncate">{u.name || 'Unknown'}</div>
                  <div className="text-[11px] text-gray-400 truncate">{u.email || ''}</div>
                </div>
                <span className={`font-bold text-[10px] px-2 py-0.5 rounded-lg border shrink-0 ${
                  status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : status === 'Locked' ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-gray-50 text-gray-500 border-gray-200'
                }`}>{status}</span>
              </div>
              <div className="text-xs text-gray-400 mb-2 truncate">{u.roleDetail || ''}</div>
              <div className="mb-3">{renderRoles(u.roles)}</div>
              <div className="pt-3 border-t border-gray-50">{renderActions(u)}</div>
            </div>
          );
        })}
      </div>

      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[11px] font-bold text-gray-400 tracking-wider">
                <th className="py-3.5 px-6">User Details</th>
                <th className="py-3.5 px-6">Email Address</th>
                <th className="py-3.5 px-6">Assigned Role(s)</th>
                <th className="py-3.5 px-6">Account Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
              {users.map(u => {
                const status = normalizeStatus(u.status);
                return (
                  <tr key={getUserKey(u)} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-bold flex-shrink-0 text-xs">
                          {getInitials(u.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-gray-800 truncate">{u.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-400 truncate">{u.roleDetail || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 truncate max-w-[200px]" title={u.email}>{u.email || '-'}</td>
                    <td className="py-4 px-6">{renderRoles(u.roles)}</td>
                    <td className="py-4 px-6">
                      <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border whitespace-nowrap ${
                        status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : status === 'Locked' ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}>{status}</span>
                    </td>
                    <td className="py-4 px-6">{renderActions(u)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <span className="text-xs font-bold text-gray-400">{total} total users</span>
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

      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Create New System User</h3>
              <button onClick={() => setIsCreateOpen(false)} className="w-8 h-8 rounded-lg bg-gray-50 border-0 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Full Name</label>
                <input type="text" placeholder="Enter full name" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Email Address</label>
                <input type="email" placeholder="user@cuiatd.edu.pk" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <input type={showPassword.create ? 'text' : 'password'} placeholder="Default password" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all pr-10" required />
                  <button type="button" onClick={() => setShowPassword(p => ({ ...p, create: !p.create }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-0">
                    {showPassword.create ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Role Assignment</label>
                <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 max-h-40 overflow-y-auto">
                  {['Student', 'FYP Office Assistant', 'Faculty Supervisor', 'Industry Supervisor', 'HOD'].map(role => (
                    <label key={role} className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer hover:text-gray-800">
                      <input type="checkbox" className="accent-primary rounded" value={role} /> {role}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer border-0">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-sm hover:bg-secondary transition-all cursor-pointer border-0">Register User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantUsers;
