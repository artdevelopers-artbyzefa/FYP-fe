import React, { useEffect, useState } from 'react';
import { getFacultySupervisedGroups } from '../../services/faculty.service';
import { showToast } from '../../components/AppToast';
import { motion } from 'framer-motion';
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const FacultySupervision = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacultySupervisedGroups().then(res => setGroups(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleApproveLog = () => {
    showToast.success('Weekly log approved and added to student record.');
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
                {Array.from({ length: 8 }, (_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 5 }, (_, j) => (
                      <td key={j} className="py-4 px-6"><div className="skeleton h-4 rounded-md" style={{ width: j === 0 ? '140px' : '80px' }} /></td>
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
        <h2 className="text-xl font-bold text-slate-900">Supervised Project Groups</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Monitor active groups, review submitted weekly logs, and evaluate draft thesis chapters.</p>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-line text-[11px] font-semibold text-slate-900 uppercase tracking-wider">
                <th className="py-3.5 px-6">Group Details</th>
                <th className="py-3.5 px-6">Project Title</th>
                <th className="py-3.5 px-6">Overall Progress</th>
                <th className="py-3.5 px-6">Log Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-sm font-medium text-slate-900">
              {groups.map(g => (
                <tr key={g.groupId} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-900">{g.groupId}</div>
                    <div className="text-[10px] text-slate-500">{g.members.join(', ')}</div>
                  </td>
                  <td className="py-4 px-6 text-slate-900 truncate max-w-[200px]">{g.title}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: g.progress }}></div>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-700">{g.progress}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-semibold text-[10px] px-2.5 py-1 rounded-lg border ${g.logStatus === 'Up to Date' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {g.logStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-1">
                    {g.logStatus === 'Pending Review' ? (
                      <>
                        <button className="px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-line text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">View</button>
                        <button onClick={handleApproveLog} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">Approve</button>
                      </>
                    ) : (
                      <button className="px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-line text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">View History</button>
                    )}
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

export default FacultySupervision;
