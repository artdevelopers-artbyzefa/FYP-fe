import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getHodStudents } from '../../services/hod.service';
import { ChevronLeft, ChevronRight, GraduationCap, Loader2 } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const SkeletonRow = ({ cols }) => (
  <tr className="animate-pulse">
    {Array.from({ length: cols }, (_, i) => (
      <td key={i} className="py-4 px-6">
        <div className={`h-4 rounded-md skeleton ${i === 0 ? 'w-32' : i === cols - 1 ? 'w-16' : 'w-24'}`} />
      </td>
    ))}
  </tr>
);

const HodStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const loadStudents = useCallback((p) => {
    setLoading(true);
    getHodStudents(p || page, limit).then(res => {
      setStudents(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  }, [page]);

  useEffect(() => { loadStudents(page); }, [page, loadStudents]);

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Students</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">View all registered students</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 text-[11px] font-bold text-slate-500 tracking-wider">
                <th className="py-3.5 px-6">Student Name</th>
                <th className="py-3.5 px-6">Registration Number</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Semester/Section</th>
                <th className="py-3.5 px-6">CGPA</th>
                <th className="py-3.5 px-6">FYP Status</th>
                <th className="py-3.5 px-6">Supervisor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
              {loading ? (
                Array.from({ length: 8 }, (_, i) => <SkeletonRow key={i} cols={7} />)
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <GraduationCap size={32} className="text-slate-300" />
                      <p className="text-sm font-bold text-slate-400">No students found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map(s => (
                  <tr key={s.id || s._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{s.name}</td>
                    <td className="py-4 px-6 text-slate-400 font-mono text-xs">{s.regNo || '-'}</td>
                    <td className="py-4 px-6 text-slate-500 text-xs">{s.email || '-'}</td>
                    <td className="py-4 px-6 text-slate-500 text-xs">{s.semester ? `Sem ${s.semester}` : '-'}{s.section ? ` / ${s.section}` : ''}</td>
                    <td className="py-4 px-6 text-slate-500 text-xs">{s.cgpa || '-'}</td>
                    <td className="py-4 px-6">
                      <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border tracking-wider ${
                        s.status === 'phase2_completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : s.status?.includes('phase2') ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : s.status?.includes('phase1') ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : s.status === 'proposal_approved' ? 'bg-violet-50 text-violet-700 border-violet-200'
                                : s.status === 'proposal_submitted' ? 'bg-orange-50 text-orange-700 border-orange-200'
                                  : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>{s.status?.replace(/_/g, ' ') || 'Not Started'}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs">{s.supervisor || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {!loading && totalPages > 1 && (
        <motion.div variants={item} className="flex items-center justify-between mt-4 px-2">
          <span className="text-xs font-bold text-slate-400">{total} total students</span>
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

export default HodStudents;
