import React, { useEffect, useState } from 'react';
import { getOfficeUsers } from '../../services/office-assistant.service';
import { showToast, showAlert } from '../../components/AppToast';
import { Search, UserPlus, X, Eye, EyeOff } from 'lucide-react';

const AssistantUsers = () => {
  const [users, setUsers] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showPassword, setShowPassword] = useState({});

  useEffect(() => {
    getOfficeUsers().then(res => setUsers(res.data)).catch(console.error);
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    showToast.success('User registered successfully!');
    setIsCreateOpen(false);
  };

  const handleDeactivate = (name) => {
    showAlert.confirm('Deactivate User', `Are you sure you want to deactivate ${name}?`, 'Deactivate', 'Cancel')
      .then((res) => { if (res.isConfirmed) showToast.warning(`${name} deactivated.`); });
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight">User Account Management</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Manage system accounts, assign or revoke roles, and handle account locks</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-secondary transition-all cursor-pointer shadow-sm">
          <UserPlus className="w-4 h-4" /> Create New User
        </button>
      </div>

      {/* Search and Filter */}
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

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-bold flex-shrink-0 text-xs">{u.id}</div>
                      <div>
                        <div className="font-bold text-gray-800">{u.name}</div>
                        <div className="text-xs text-gray-400">{u.roleDetail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{u.email}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r, i) => (
                        <span key={i} className="bg-secondary/5 text-secondary font-bold text-xs px-2.5 py-1 rounded-lg border border-secondary/10">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border ${
                      u.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : u.status === 'Locked'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {u.status === 'Locked' && (
                      <button onClick={() => showToast.success('Account unlocked!')} className="px-3 py-1.5 rounded-lg bg-primary/5 text-primary border border-primary/10 text-xs font-bold transition-all hover:bg-primary/10 cursor-pointer">
                        Unlock
                      </button>
                    )}
                    {u.status === 'Deactivated' && (
                      <button onClick={() => showToast.success('Account reactivated!')} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all hover:bg-emerald-100 cursor-pointer">
                        Reactivate
                      </button>
                    )}
                    {u.status === 'Active' && (
                      <button onClick={() => handleDeactivate(u.name)} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold transition-all hover:bg-rose-100 cursor-pointer">
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
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
