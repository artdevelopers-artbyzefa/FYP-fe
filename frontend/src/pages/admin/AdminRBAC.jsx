import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getRbacMatrix } from '../../services/admin.service';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function AdminRBAC() {
  const [rbac, setRbac] = useState([]);

  useEffect(() => {
    getRbacMatrix().then(setRbac);
  }, []);

  return (
    <div className="animate-in fade-in slide-in- duration-300">
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-black text-slate-900">Role Checklists & RBAC</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Verify role permissions and audit role assignments</p>
      </div>
      <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden mb-8">
        <div className="p-5 bg-white border-b border-line"><h3 className="text-base font-black text-slate-900">System Role Permission Matrix</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 border-b border-line text-[11px] font-black text-slate-900 uppercase tracking-wider">
                <th className="py-3.5 px-6">System Role</th>
                <th className="py-3.5 px-6">Core Permissions & Scope</th>
                <th className="py-3.5 px-6 text-center">Users</th>
                <th className="py-3.5 px-6 text-right">RBAC Status</th>
              </tr>
            </thead>
            <tbody className="divide-slate-50 text-xs font-medium text-slate-900">
              {rbac.map(r => (
                <tr key={r.role} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{r.role}</td>
                  <td className="py-4 px-6 text-slate-900">{r.permissions}</td>
                  <td className="py-4 px-6 text-center font-bold">{r.users} Users</td>
                  <td className="py-4 px-6 text-right"><span className="bg-white text-slate-900 font-bold px-2.5 py-1 rounded-lg border border-line">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
