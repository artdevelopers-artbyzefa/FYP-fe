import React, { useEffect, useState } from 'react';
import { getFacultyHeadDuties } from '../../services/faculty.service';
import { showToast } from '../../components/AppToast';
import { Crown } from 'lucide-react';
import { motion } from 'framer-motion';
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const FacultyHeadDuties = () => {
  const [duties, setDuties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacultyHeadDuties().then(res => setDuties(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleConsolidate = () => {
    showToast.success('Member evaluations consolidated. Final score published to FYP Office.');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4 mb-6">
          <div className="skeleton h-7 w-64 rounded-md" />
          <div className="skeleton h-4 w-96 rounded-md mt-2" />
        </div>
        <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-line">
                  {Array.from({ length: 5 }, (_, i) => (
                    <th key={i} className="py-3.5 px-6"><div className="skeleton h-4 rounded-md" style={{ width: i === 0 ? '100px' : '80px' }} /></th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {Array.from({ length: 6 }, (_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 5 }, (_, j) => (
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
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Crown size={20} /> Committee Head Duties
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Consolidate member evaluations and publish final consensus scores.</p>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-line text-[11px] font-semibold text-slate-900 uppercase tracking-wider">
                <th className="py-3.5 px-6">Committee</th>
                <th className="py-3.5 px-6">Active Members</th>
                <th className="py-3.5 px-6">Pending Consolidations</th>
                <th className="py-3.5 px-6">Next Meeting</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-sm font-medium text-slate-900">
              {duties.map((d, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">{d.committeeId}</td>
                  <td className="py-4 px-6 text-slate-600">{d.activeMembers} Members</td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-[10px] px-2.5 py-1 rounded-lg border bg-amber-50 text-amber-700 border-amber-200">
                      {d.pendingConsolidations} Pending
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-semibold">{d.nextMeeting}</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button onClick={handleConsolidate} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500">Consolidate Results</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FacultyHeadDuties;
