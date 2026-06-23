import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getFacultyWorkload } from '../../services/hod.service';
import { ExternalLink, Presentation } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const HodFacultyOversight = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacultyWorkload().then((res) => {
      setFaculty(Array.isArray(res.data) ? res.data : []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const complianceBadge = (status) => {
    switch (status) {
      case 'Compliant': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Partial': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Non-Compliant': return 'bg-rose-50 text-rose-600 border-rose-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="border-b border-line pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Faculty Workload & Performance Oversight</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Monitor faculty supervision caps, research alignment tags, and weekly meeting log compliance</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-card transition-all flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">
          <Presentation size={14} /> View Full Faculty Reports Table
        </button>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        <div className="p-5 bg-white border-b border-line">
          <h3 className="text-base font-bold text-slate-900">Supervision Load Distribution (Computer Science)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Faculty Member</th>
                <th className="py-3.5 px-6">Designation</th>
                <th className="py-3.5 px-6 text-center">Supervision Load</th>
                <th className="py-3.5 px-6">Research Alignment</th>
                <th className="py-3.5 px-6 text-center">Meeting Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
              {loading ? (
                Array.from({ length: 6 }, (_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 5 }, (_, j) => (
                      <td key={j} className="py-4 px-6">
                        <div className={`h-4 rounded-md skeleton ${j === 0 ? 'w-36' : j === 1 ? 'w-20' : 'w-16'}`} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : faculty.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-slate-400 font-medium">No faculty data available</td>
                </tr>
              ) : (
                faculty.map(f => (
                  <tr key={f.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{f.name}</td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">{f.designation}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border ${f.slots >= 6 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-slate-700 border-slate-200'}`}>
                        {f.slots}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(f.research) && f.research.length > 0
                          ? f.research.map((tag, idx) => (
                              <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-medium">{tag}</span>
                            ))
                          : <span className="text-[10px] text-slate-400 italic">No tags</span>
                        }
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${complianceBadge(f.compliance)}`}>
                        {f.compliance || 'Unknown'}
                      </span>
                      {f.complianceScore !== undefined && (
                        <span className="ml-1.5 text-[9px] text-slate-400 font-medium">({f.complianceScore}%)</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HodFacultyOversight;
