import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getHodCommittees } from '../../services/hod.service';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const SkeletonRow = ({ cols }) => (
  <tr className="animate-pulse">
    {Array.from({ length: cols }, (_, i) => (
      <td key={i} className="py-4 px-6">
        <div className={`h-4 rounded-md skeleton ${i === 0 ? 'w-36' : i === 3 ? 'w-44' : 'w-20'}`} />
      </td>
    ))}
  </tr>
);

const HodCommittees = () => {
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const loadCommittees = useCallback((p) => {
    setLoading(true);
    getHodCommittees(p || page, limit).then(res => {
      setCommittees(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    }).catch(err => {
      console.error(err);
    }).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { loadCommittees(page); }, [page, loadCommittees]);

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">FYP Committees</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">View all evaluation and proposal committees</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 text-[11px] font-bold text-slate-500 tracking-wider">
                <th className="py-3.5 px-6">Committee Name</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Head</th>
                <th className="py-3.5 px-6">Members</th>
                <th className="py-3.5 px-6">Schedule</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
              {loading ? (
                Array.from({ length: 8 }, (_, i) => <SkeletonRow key={i} cols={6} />)
              ) : committees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Shield size={32} className="text-slate-300" />
                      <p className="text-sm font-bold text-slate-400">No committees found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                committees.map(c => (
                  <tr key={c.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{c.name}</td>
                    <td className="py-4 px-6">
                      <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border tracking-wider ${
                        c.type === 'evaluation' ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : c.type === 'proposal' ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : c.type === 'pec' ? 'bg-violet-50 text-violet-700 border-violet-200'
                              : c.type === 'fec' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>{c.type?.toUpperCase()}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-700 text-xs font-bold">{c.head}</td>
                    <td className="py-4 px-6 text-slate-500 text-xs">{c.members?.join(', ') || '-'}</td>
                    <td className="py-4 px-6 text-slate-500 text-xs">{c.schedule ? new Date(c.schedule).toLocaleDateString() : '-'}</td>
                    <td className="py-4 px-6">
                      <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border tracking-wider ${
                        c.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : c.status === 'inactive' ? 'bg-slate-50 text-slate-500 border-slate-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>{c.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {!loading && totalPages > 1 && (
        <motion.div variants={item} className="flex items-center justify-between mt-4 px-2">
          <span className="text-xs font-bold text-slate-400">{total} total committees</span>
          <div className="flex items-center gap-2">
            <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="p-2 rounded-lg border border-line text-slate-400 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 3, totalPages - 6));
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <button key={p} onClick={() => goToPage(p)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 ${p === page ? 'bg-blue-600 text-white' : 'border border-line text-slate-500 hover:bg-blue-50'}`}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="p-2 rounded-lg border border-line text-slate-400 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HodCommittees;
