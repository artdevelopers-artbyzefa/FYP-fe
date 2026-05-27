import React, { useEffect, useState } from 'react';
import { getOfficeUsers } from '../../services/office-assistant.service';
import { showToast, showAlert } from '../../components/AppToast';
import { Search, UserPlus } from 'lucide-react';

const AssistantUsers = () => {
  const [users, setUsers] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-black pb-4">
        <div>
          <h2 className="text-xl font-black text-black">User Account Management</h2>
          <p className="text-xs text-black mt-0.5 font-medium">Manage system accounts, assign or revoke roles, and handle account locks</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="bg-white hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
          <UserPlus className="w-4 h-4" /> Create New User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-black p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-sm" />
          <input type="text" placeholder="Search by name, email, or role..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-black rounded-xl text-sm outline-none focus:border-black focus:bg-white transition-all" />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-black">Filter Status:</span>
          <select className="bg-white border border-black rounded-xl px-4 py-2 text-sm font-bold text-black outline-none focus:border-black cursor-pointer">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Locked">Locked</option>
            <option value="Deactivated">Deactivated</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/75 border-b border-black text-[11px] font-black text-black uppercase tracking-wider">
                <th className="py-3.5 px-6">User Details</th>
                <th className="py-3.5 px-6">Email Address</th>
                <th className="py-3.5 px-6">Assigned Role(s)</th>
                <th className="py-3.5 px-6">Account Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-600 text-sm font-medium text-black">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-white/50 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold flex-shrink-0">{u.id}</div>
                    <div>
                      <div className="font-bold text-black">{u.name}</div>
                      <div className="text-xs text-black">{u.roleDetail}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-black">{u.email}</td>
                  <td className="py-4 px-6">
                    {u.roles.map((r, i) => <span key={i} className="bg-white text-black font-bold text-xs px-2.5 py-1 rounded-lg border border-black mr-1 block sm:inline-block mt-1 sm:mt-0">{r}</span>)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border ${u.status === 'Active' ? 'bg-success/10 text-success border-success/20' : u.status === 'Locked' ? 'bg-white' : 'bg-white'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-1">
                    {u.status === 'Locked' && <button onClick={() => showToast.success('Account unlocked!')} className="px-3 py-1.5 rounded-lg bg-white text-black border border-black text-xs font-bold transition-all hover:bg-white">Unlock</button>}
                    {u.status === 'Deactivated' && <button onClick={() => showToast.success('Account reactivated!')} className="px-3 py-1.5 rounded-lg bg-white text-black border border-black text-xs font-bold transition-all hover:bg-white">Reactivate</button>}
                    {u.status === 'Active' && <button onClick={() => handleDeactivate(u.name)} className="px-3 py-1.5 rounded-lg bg-white text-black border border-black text-xs font-bold transition-all hover:bg-white">Deactivate</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 bg-blue-600/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-black">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-black">
              <h3 className="text-lg font-black text-black">Create New System User</h3>
              <i className="fas fa-times text-black hover:text-blue-600 cursor-pointer text-lg" onClick={() => setIsCreateOpen(false)}></i>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Full Name</label>
                <input type="text" placeholder="Enter full name" className="w-full bg-white border border-black rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black focus:bg-white transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Email Address</label>
                <input type="email" placeholder="user@cuiatd.edu.pk" className="w-full bg-white border border-black rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black focus:bg-white transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-black mb-2">Role Assignment (Checklist)</label>
                <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-2xl border border-black max-h-40 overflow-y-auto">
                  <label className="flex items-center gap-2 text-xs font-bold text-black cursor-pointer"><input type="checkbox" className="accent-primary" value="Student" /> Student</label>
                  <label className="flex items-center gap-2 text-xs font-bold text-black cursor-pointer"><input type="checkbox" className="accent-primary" value="FYP Office Assistant" /> FYP Office Assistant</label>
                  <label className="flex items-center gap-2 text-xs font-bold text-black cursor-pointer"><input type="checkbox" className="accent-primary" value="Faculty Supervisor" /> Faculty Supervisor</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-black">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-black hover:bg-white transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-white hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer">Register User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantUsers;
