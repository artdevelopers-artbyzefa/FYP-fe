import React, { useEffect, useState } from 'react';
import { getInchargeAuditLogs } from '../../services/office-incharge.service';

const badgeColor = (type) => {
  switch (type) {
    case 'RUBRIC_UPDATE': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'COMMITTEE_LOCK': return 'bg-blue-50 text-secondary border-blue-200';
    case 'USER_AUTH': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'GRIEVANCE_FILE': return 'bg-red-50 text-red-600 border-red-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const InchargeAuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    getInchargeAuditLogs().then(res => setLogs(res.data)).catch(console.error);
  }, []);

  const filtered = logs.filter(l => {
    const matchSearch = search === '' || JSON.stringify(l).toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === '' || l.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <>
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">System Audit Log Viewer</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Track timestamps, user emails, administrative actions, and affected database entities with multi-parameter filtering</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search audit logs..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-secondary focus:bg-white transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-secondary cursor-pointer"
          >
            <option value="">All Action Types</option>
            <option value="RUBRIC_UPDATE">RUBRIC_UPDATE</option>
            <option value="COMMITTEE_LOCK">COMMITTEE_LOCK</option>
            <option value="USER_AUTH">USER_AUTH</option>
            <option value="GRIEVANCE_FILE">GRIEVANCE_FILE</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">User Email</th>
                <th className="py-3.5 px-6">Action Type</th>
                <th className="py-3.5 px-6">Affected Entity</th>
                <th className="py-3.5 px-6">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700 font-mono">
              {filtered.map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-500">{log.time}</td>
                  <td className="py-4 px-6 font-bold text-gray-900">{log.user}</td>
                  <td className="py-4 px-6">
                    <span className={`font-bold px-2 py-0.5 rounded border text-[10px] ${badgeColor(log.type)}`}>{log.type}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{log.entity}</td>
                  <td className="py-4 px-6 text-gray-400">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default InchargeAuditLog;
