import React, { useEffect, useState } from 'react';
import { getInchargeAuditLogs } from '../../services/office-incharge.service';
import { Search } from 'lucide-react';

const badgeColor = (type) => {
  switch (type) {
    case 'RUBRIC_UPDATE': return 'bg-white';
    case 'COMMITTEE_LOCK': return 'bg-blue-50 text-black border-blue-200';
    case 'USER_AUTH': return 'bg-white';
    case 'GRIEVANCE_FILE': return 'bg-white';
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
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">System Audit Log Viewer</h2>
        <p className="text-xs text-black mt-0.5 font-medium">Track timestamps, user emails, administrative actions, and affected database entities with multi-parameter filtering</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-black p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-sm" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search audit logs..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-black rounded-xl text-sm outline-none focus:border-black focus:bg-white transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-white border border-black rounded-xl px-4 py-2 text-sm font-bold text-black outline-none focus:border-black cursor-pointer"
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
      <div className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/75 border-b border-black text-[11px] font-black text-black uppercase tracking-wider">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">User Email</th>
                <th className="py-3.5 px-6">Action Type</th>
                <th className="py-3.5 px-6">Affected Entity</th>
                <th className="py-3.5 px-6">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-600 text-xs font-medium text-black font-mono">
              {filtered.map((log, idx) => (
                <tr key={idx} className="hover:bg-white/50 transition-colors">
                  <td className="py-4 px-6 text-black">{log.time}</td>
                  <td className="py-4 px-6 font-bold text-black">{log.user}</td>
                  <td className="py-4 px-6">
                    <span className={`font-bold px-2 py-0.5 rounded border text-[10px] ${badgeColor(log.type)}`}>{log.type}</span>
                  </td>
                  <td className="py-4 px-6 text-black">{log.entity}</td>
                  <td className="py-4 px-6 text-black">{log.ip}</td>
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
