import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../../services/admin.service';
import { showToast as toast } from '../../components/AppToast';

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
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="border-b border-gray-100 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-800">System Audit Logs & Security Index</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Track timestamps, users, actions, and affected entities</p>
        </div>
        <button onClick={() => toast.success('Audit logs export started.')} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer">
          <i className="fas fa-file-export text-blue-600"></i> Export Logs
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input type="text" value={searchAudit} onChange={e => setSearchAudit(e.target.value)} placeholder="Search audit logs..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" />
        </div>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-blue-500 cursor-pointer w-full sm:w-auto">
          <option value="">All Action Types</option>
          <option value="ACCOUNT_CREATE">ACCOUNT_CREATE</option>
          <option value="RUBRIC_UPDATE">RUBRIC_UPDATE</option>
          <option value="COMMITTEE_LOCK">COMMITTEE_LOCK</option>
          <option value="USER_AUTH">USER_AUTH</option>
          <option value="DB_BACKUP">DB_BACKUP</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">User Email</th>
                <th className="py-3.5 px-6">Action Type</th>
                <th className="py-3.5 px-6">Affected Entity</th>
                <th className="py-3.5 px-6">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700 font-mono">
              {filteredAudit.map((a, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-500">{a.timestamp}</td>
                  <td className="py-4 px-6 font-bold text-gray-900">{a.user}</td>
                  <td className="py-4 px-6"><span className="bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded border border-gray-200">{a.action}</span></td>
                  <td className="py-4 px-6 text-gray-600">{a.entity}</td>
                  <td className="py-4 px-6 text-gray-400">{a.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
