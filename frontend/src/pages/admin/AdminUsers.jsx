import React, { useState, useEffect } from 'react';
import { getAdminUsers, createAdminUser, resetUserPassword, toggleUserStatus } from '../../services/admin.service';
import { showToast as toast } from '../../components/AppToast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [createUserOpen, setCreateUserOpen] = useState(false);

  useEffect(() => {
    getAdminUsers().then(setUsers);
  }, []);

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    const res = await createAdminUser(payload);
    toast.success(res.message);
    setCreateUserOpen(false);
    e.target.reset();
  };

  const handleResetPassword = async (u) => {
    if (window.confirm(`Are you sure you want to reset password for ${u.name}?`)) {
      const res = await resetUserPassword(u.id);
      toast.success(res.message);
    }
  };

  const handleToggleStatus = async (u) => {
    if (window.confirm(`Are you sure you want to deactivate account for ${u.name}?`)) {
      const res = await toggleUserStatus(u.id);
      toast.warning(res.message || 'User account deactivated.');
    }
  };

  const filteredUsers = users.filter(u => 
    (u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())) &&
    (roleFilter === '' || u.role === roleFilter)
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="border-b border-gray-100 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-800">User Account Management & Credentials</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Create new user accounts, assign roles, and trigger password resets</p>
        </div>
        <button onClick={() => setCreateUserOpen(true)} className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer">
          <i className="fas fa-plus"></i> Create New User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input type="text" value={searchUser} onChange={e => setSearchUser(e.target.value)} placeholder="Search user name or email..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-blue-500 cursor-pointer w-full sm:w-auto">
          <option value="">All Roles</option>
          <option value="FYP Office Assistant">FYP Office Assistant</option>
          <option value="FYP Office In-charge">FYP Office In-charge</option>
          <option value="Faculty Supervisor">Faculty Supervisor</option>
          <option value="HOD">HOD</option>
          <option value="System Administrator">System Administrator</option>
          <option value="Industry Supervisor">Industry Supervisor</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Full Name</th>
                <th className="py-3.5 px-6">Email Address</th>
                <th className="py-3.5 px-6">Primary Role</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-900">{u.name}</td>
                  <td className="py-4 px-6 text-gray-600 font-mono">{u.email}</td>
                  <td className="py-4 px-6"><span className="bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-lg border border-blue-200">{u.role}</span></td>
                  <td className="py-4 px-6 text-center"><span className="bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-lg border border-emerald-200">{u.status}</span></td>
                  <td className="py-4 px-6 text-right space-x-1">
                    <button onClick={() => handleResetPassword(u)} className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold transition-all cursor-pointer">Reset</button>
                    <button onClick={() => handleToggleStatus(u)} className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold transition-all cursor-pointer">Deactivate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {createUserOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-50">
              <h3 className="text-lg font-black text-gray-900">Create New User Account</h3>
              <i className="fas fa-times text-gray-400 hover:text-gray-600 cursor-pointer text-lg" onClick={() => setCreateUserOpen(false)}></i>
            </div>
            <form onSubmit={handleCreateUserSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name</label>
                <input name="name" type="text" placeholder="e.g. Dr. Bilal Ahmed" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                <input name="email" type="email" placeholder="e.g. bilal@cuiatd.edu.pk" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Assign Primary System Role</label>
                <select name="role" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 cursor-pointer" required>
                  <option value="Faculty Supervisor">Faculty Supervisor</option>
                  <option value="FYP Office Assistant">FYP Office Assistant</option>
                  <option value="FYP Office In-charge">FYP Office In-charge</option>
                  <option value="HOD">HOD</option>
                  <option value="System Administrator">System Administrator</option>
                  <option value="Industry Supervisor">Industry Supervisor</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button type="button" onClick={() => setCreateUserOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
