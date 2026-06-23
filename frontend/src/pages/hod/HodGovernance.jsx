import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getGovernanceData } from '../../services/hod.service';
import { Lock, Landmark } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

const HodGovernance = () => {
  const [data, setData] = useState({ committees: [], rubrics: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGovernanceData().then((res) => setData(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Committee & Rubric Governance Oversight</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Verify active evaluation boards, approved rubric schemas, and academic session integrity locks</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-white rounded-2xl border border-line shadow-card p-6 space-y-6 animate-pulse">
            <div className="skeleton h-6 w-48" />
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-16 w-full rounded-xl" />)}
          </div>
          <div className="bg-white rounded-2xl border border-line shadow-card p-6 space-y-6 animate-pulse">
            <div className="skeleton h-6 w-48" />
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-16 w-full rounded-xl" />)}
          </div>
        </div>
      ) : (
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white rounded-2xl border border-line shadow-card p-6 space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-line">Active Evaluation Boards</h3>
          <div className="space-y-4">
            {data.committees.length === 0 ? (
              <div className="text-center py-8">
                <Landmark size={32} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">No committees found</p>
              </div>
            ) : (
              data.committees.map(com => (
                <div key={com.id} className="p-4 rounded-xl bg-white border border-line flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5 text-sm">{com.name}</span>
                    <span className="text-slate-500">Head: {com.head} | {Array.isArray(com.members) ? com.members.length : '0'} Members</span>
                  </div>
                  <span className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-lg text-[10px]">{com.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-line shadow-card p-6 space-y-6">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-line">Approved Rubric Schemas</h3>
          <div className="space-y-4">
            {data.rubrics.length === 0 ? (
              <div className="text-center py-8">
                <Lock size={32} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400 font-medium">No rubrics found</p>
              </div>
            ) : (
              data.rubrics.map(rubric => (
                <div key={rubric.id} className="p-4 rounded-xl bg-white border border-line flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5 text-sm">{rubric.name}</span>
                    <span className="text-slate-500">{rubric.validation}</span>
                  </div>
                  <span className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-lg text-[10px] flex items-center gap-1">
                    <Lock size={12} /> {rubric.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
      )}
    </motion.div>
  );
};

export default HodGovernance;
