import React, { useEffect, useState, useMemo } from 'react';
import { getInchargeAuditLogs } from '../../services/office-incharge.service';
import { Search, Loader2, AlertCircle, ChevronLeft, ChevronRight, History } from 'lucide-react';

const BADGE_COLORS = {
  proposal: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  supervisor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  committee: 'bg-purple-50 text-purple-700 border-purple-200',
  faculty: 'bg-blue-50 text-blue-700 border-blue-200',
  student: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  user: 'bg-orange-50 text-orange-700 border-orange-200',
  other: 'bg-gray-50 text-gray-500 border-gray-200'
};

const actionCategory = (action) => {
  if (action?.startsWith('proposal_')) return 'proposal';
  if (action?.startsWith('supervisor_')) return 'supervisor';
  if (action?.startsWith('committee_')) return 'committee';
  if (action?.startsWith('faculty_')) return 'faculty';
  if (action?.startsWith('student_')) return 'student';
  if (action?.startsWith('user_')) return 'user';
  return 'other';
};

const formatTime = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const InchargeAuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 25;

  useEffect(() => {
    setLoading(true);
    setError(null);
    getInchargeAuditLogs()
      .then(res => setLogs(Array.isArray(res.data) ? res.data : []))
      .catch(err => { console.error(err); setError('Failed to load audit logs.'); setLogs([]); })
      .finally(() => setLoading(false));
  }, []);

  const allTypes = useMemo(() => {
    const types = new Set();
    logs.forEach(l => { if (l.type) types.add(l.type); });
    return [...types].sort();
  }, [logs]);

  const filtered = useMemo(() => {
    let result = logs;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        (l.user?.toLowerCase() || '').includes(q) ||
        (l.type?.toLowerCase() || '').includes(q) ||
        (l.entity?.toLowerCase() || '').includes(q) ||
        (l.details?.toLowerCase() || '').includes(q)
      );
    }
    if (typeFilter) result = result.filter(l => l.type === typeFilter);
    return result;
  }, [logs, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => { setPage(1); }, [search, typeFilter]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  return (
    <>
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">System Audit Log Viewer</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Track timestamps, users, actions, and affected entities across the entire system</p>
      </div>

      <div className="bg-white rounded-2xl border border-line p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by user, action, entity..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-gray-400">Action:</span>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-blue-500 cursor-pointer">
            <option value="">All Actions</option>
            {allTypes.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">User</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Details</th>
                <th className="py-2.5 px-4">Entity</th>
                <th className="py-2.5 px-4">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
              {loading ? (
                Array.from({ length: 8 }, (_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }, (_, j) => (
                      <td key={j} className="py-3 px-4"><div className="h-4 rounded-md skeleton" /></td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <AlertCircle className="w-8 h-8" />
                      <p className="text-sm font-bold">{error}</p>
                      <button onClick={() => window.location.reload()} className="text-xs text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-0">Retry</button>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <History className="w-8 h-8" />
                      <p className="text-sm font-bold">{search || typeFilter ? 'No logs match your filters.' : 'No audit logs recorded yet.'}</p>
                      {(search || typeFilter) && (
                        <button onClick={() => { setSearch(''); setTypeFilter(''); }} className="text-xs text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-0">Clear filters</button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((log, idx) => {
                  const cat = actionCategory(log.type);
                  return (
                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">{formatTime(log.time)}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{log.user || 'System'}</td>
                      <td className="py-2.5 px-4">
                        <span className={`font-bold text-[10px] px-2 py-0.5 rounded-lg border ${BADGE_COLORS[cat] || BADGE_COLORS.other}`}>
                          {(log.type || '').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 max-w-xs truncate" title={log.details}>{log.details || '-'}</td>
                      <td className="py-2.5 px-4 text-slate-500">{log.entity || '-'}</td>
                      <td className="py-2.5 px-4 text-slate-400 font-mono text-[10px]">{log.ip || '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <span className="text-[11px] font-bold text-slate-400">{filtered.length} total entries</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="w-7 h-7 rounded-lg border border-line text-slate-400 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center">
              <ChevronLeft size={14} />
            </button>
            {pageNumbers.map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${p === page ? 'bg-blue-600 text-white' : 'border border-line text-slate-500 hover:bg-blue-50'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="w-7 h-7 rounded-lg border border-line text-slate-400 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InchargeAuditLog;
