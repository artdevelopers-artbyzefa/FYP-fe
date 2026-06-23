import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAuditLogs } from '../../services/admin.service';
import { showToast as toast } from '../../components/AppToast';
import { FileUp, Search } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function AdminAuditLogs() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [searchAudit, setSearchAudit] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    getAuditLogs().then(setAuditLogs);
  }, []);

  const filteredAudit = auditLogs.filter(a =>
    (a.entity.toLowerCase().includes(searchAudit.toLowerCase()) || a.user.toLowerCase().includes(searchAudit.toLowerCase())) &&
    (actionFilter === '' || a.action === actionFilter)
  );

  return (
    <div className="animate-in fade-in slide-in- duration-300">
      <div className="border-b border-line pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">System Audit Logs & Security Index</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Track timestamps, users, actions, and affected entities</p>
        </div>
        <button onClick={() => toast.success('Audit logs export started.')} className="px-5 py-2.5 bg-white border border-line text-slate-900 hover:bg-white rounded-xl text-xs font-bold shadow-card transition-all flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none">
          <FileUp className="text-slate-900" /> Export Logs
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-line p-4 mb-6 shadow-card flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 text-sm" />
          <input type="text" value={searchAudit} onChange={e => setSearchAudit(e.target.value)} placeholder="Search audit logs..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-line rounded-xl text-sm outline-none focus:border-line focus:bg-white transition-all" />
        </div>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="bg-white border border-line rounded-xl px-4 py-2 text-sm font-bold text-slate-900 outline-none focus:border-line cursor-pointer w-full sm:w-auto">
          <option value="">All Action Types</option>
          <option value="ACCOUNT_CREATE">ACCOUNT_CREATE</option>
          <option value="RUBRIC_UPDATE">RUBRIC_UPDATE</option>
          <option value="COMMITTEE_LOCK">COMMITTEE_LOCK</option>
          <option value="USER_AUTH">USER_AUTH</option>
          <option value="DB_BACKUP">DB_BACKUP</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 border-b border-line text-[11px] font-black text-slate-900 tracking-wider">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">User Email</th>
                <th className="py-3.5 px-6">Action Type</th>
                <th className="py-3.5 px-6">Affected Entity</th>
                <th className="py-3.5 px-6">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-slate-50 text-xs font-medium text-slate-900 font-mono">
              {filteredAudit.map((a, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-slate-900">{a.timestamp}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">{a.user}</td>
                  <td className="py-4 px-6"><span className="bg-white text-slate-900 font-bold px-2 py-0.5 rounded border border-line">{a.action}</span></td>
                  <td className="py-4 px-6 text-slate-900">{a.entity}</td>
                  <td className="py-4 px-6 text-slate-900">{a.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
