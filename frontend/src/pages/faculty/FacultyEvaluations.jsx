import React, { useEffect, useState } from 'react';
import { getFacultyEvaluations } from '../../services/faculty.service';
import { showToast } from '../../components/AppToast';
import { AlertTriangle, Lock, X } from 'lucide-react';
import { motion } from 'framer-motion';
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const FacultyEvaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [isScoreOpen, setIsScoreOpen] = useState(false);
  const [selectedEval, setSelectedEval] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacultyEvaluations().then(res => setEvaluations(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const openScoreModal = (evalRecord) => {
    setSelectedEval(evalRecord);
    setIsScoreOpen(true);
  };

  const handleScoreSubmit = (e) => {
    e.preventDefault();
    showToast.success('Locked rubric scorecard submitted successfully!');
    setIsScoreOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4 mb-6">
          <div className="skeleton h-7 w-48 rounded-md" />
          <div className="skeleton h-4 w-96 rounded-md mt-2" />
        </div>
        <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-line">
                  {Array.from({ length: 6 }, (_, i) => (
                    <th key={i} className="py-3.5 px-6"><div className="skeleton h-4 rounded-md" style={{ width: i === 0 ? '100px' : '80px' }} /></th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {Array.from({ length: 8 }, (_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }, (_, j) => (
                      <td key={j} className="py-4 px-6"><div className="skeleton h-4 rounded-md" style={{ width: j === 0 ? '120px' : '80px' }} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Committee Evaluations</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Input scores per CLO criteria for assigned defense presentations.</p>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-line text-[11px] font-semibold text-slate-900 tracking-wider">
                <th className="py-3.5 px-6">Evaluation Ref</th>
                <th className="py-3.5 px-6">Student</th>
                <th className="py-3.5 px-6">Committee</th>
                <th className="py-3.5 px-6">Defense Type</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-sm font-medium text-slate-900">
              {evaluations.map(e => (
                <tr key={e.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-slate-700 font-mono text-xs font-semibold">{e.id}</td>
                  <td className="py-4 px-6 font-semibold text-slate-900">{e.student}</td>
                  <td className="py-4 px-6 text-slate-600">{e.committee}</td>
                  <td className="py-4 px-6 text-slate-600">{e.type}</td>
                  <td className="py-4 px-6">
                    <span className={`font-semibold text-[10px] px-2.5 py-1 rounded-lg border ${e.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {e.status === 'Pending' ? (
                      <button onClick={() => openScoreModal(e)} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500">Input Scores</button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-semibold italic">
                        <Lock size={12} /> Locked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {isScoreOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-xl border border-line my-8">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-line">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Scorecard Entry</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{selectedEval?.student} - {selectedEval?.type}</p>
              </div>
              <button onClick={() => setIsScoreOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleScoreSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5 flex justify-between">
                    <span>CLO-1: Requirements Engineering</span>
                    <span className="text-slate-400">/ 10</span>
                  </label>
                  <input type="number" max="10" min="0" placeholder="0-10" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5 flex justify-between">
                    <span>CLO-2: System Design</span>
                    <span className="text-slate-400">/ 10</span>
                  </label>
                  <input type="number" max="10" min="0" placeholder="0-10" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5 flex justify-between">
                    <span>CLO-3: Implementation</span>
                    <span className="text-slate-400">/ 20</span>
                  </label>
                  <input type="number" max="20" min="0" placeholder="0-20" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1.5 flex justify-between">
                    <span>CLO-4: Communication/Presentation</span>
                    <span className="text-slate-400">/ 10</span>
                  </label>
                  <input type="number" max="10" min="0" placeholder="0-10" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all" required />
                </div>
              </div>
               
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">General Remarks (Optional)</label>
                <textarea placeholder="Any additional comments..." className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all h-20 resize-none"></textarea>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800 text-sm font-medium">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <p>Scores cannot be modified once submitted. They will be locked and sent to the Committee Head for consolidation.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button type="button" onClick={() => setIsScoreOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">Submit & Lock Scores</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FacultyEvaluations;
