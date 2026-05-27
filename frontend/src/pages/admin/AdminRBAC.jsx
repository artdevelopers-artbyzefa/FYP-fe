import React, { useState, useEffect } from 'react';
import { getRbacMatrix } from '../../services/admin.service';

export default function AdminRBAC() {
  const [rbac, setRbac] = useState([]);

  useEffect(() => {
    getRbacMatrix().then(setRbac);
  }, []);

  return (
    <div className="animate-in fade-in slide-in- duration-300">
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">Role Checklists & RBAC</h2>
        <p className="text-xs text-black mt-0.5 font-medium">Verify role permissions and audit role assignments</p>
      </div>
      <div className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden mb-8">
        <div className="p-5 bg-white border-b border-black"><h3 className="text-base font-black text-black">System Role Permission Matrix</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-black text-[11px] font-black text-black uppercase tracking-wider">
                <th className="py-3.5 px-6">System Role</th>
                <th className="py-3.5 px-6">Core Permissions & Scope</th>
                <th className="py-3.5 px-6 text-center">Users</th>
                <th className="py-3.5 px-6 text-right">RBAC Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-600 text-xs font-medium text-black">
              {rbac.map(r => (
                <tr key={r.role} className="hover:bg-white/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-black">{r.role}</td>
                  <td className="py-4 px-6 text-black">{r.permissions}</td>
                  <td className="py-4 px-6 text-center font-bold">{r.users} Users</td>
                  <td className="py-4 px-6 text-right"><span className="bg-white text-black font-bold px-2.5 py-1 rounded-lg border border-black">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
