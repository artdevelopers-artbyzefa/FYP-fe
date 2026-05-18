import React, { useState, useEffect } from 'react';
import { getRbacMatrix } from '../../services/admin.service';

export default function AdminRBAC() {
  const [rbac, setRbac] = useState([]);

  useEffect(() => {
    getRbacMatrix().then(setRbac);
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">Role Checklists & RBAC</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Verify role permissions and audit role assignments</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="p-5 bg-gray-50 border-b border-gray-100"><h3 className="text-base font-black text-gray-800">System Role Permission Matrix</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">System Role</th>
                <th className="py-3.5 px-6">Core Permissions & Scope</th>
                <th className="py-3.5 px-6 text-center">Users</th>
                <th className="py-3.5 px-6 text-right">RBAC Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
              {rbac.map(r => (
                <tr key={r.role} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-900">{r.role}</td>
                  <td className="py-4 px-6 text-gray-600">{r.permissions}</td>
                  <td className="py-4 px-6 text-center font-bold">{r.users} Users</td>
                  <td className="py-4 px-6 text-right"><span className="bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-lg border border-emerald-200">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
