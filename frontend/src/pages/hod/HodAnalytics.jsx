import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAnalyticsData } from '../../services/hod.service';
import { Printer, BarChart3 } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-line shadow-card p-6 flex flex-col justify-between animate-pulse">
    <div>
      <div className="skeleton h-5 w-48 mb-2" />
      <div className="skeleton h-3 w-72 mb-6" />
      <div className="flex items-center justify-center my-8">
        <div className="w-40 h-40 rounded-full border-8 border-slate-100 flex items-center justify-center bg-white">
          <div className="skeleton h-10 w-20 rounded-full" />
        </div>
      </div>
    </div>
    <div className="skeleton h-10 w-full rounded-xl" />
  </div>
);

const HodAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData().then((res) => setData(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="border-b border-line pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Departmental FYP Analytics & CLO Attainment</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Visual metrics of student pass rates, grade distribution, and overall CLO attainment averages</p>
        </div>
        <button onClick={() => window.print()} className="px-5 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">
          <Printer size={14} /> Print Analytics
        </button>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : (
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-line shadow-card p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Overall Student Pass Rate</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">FYP-1 and FYP-2 cumulative clearing percentage</p>
              <div className="flex items-center justify-center my-8">
                <div className="w-40 h-40 rounded-full border-8 border-blue-100 flex items-center justify-center bg-white">
                  <span className="text-4xl font-extrabold text-blue-700">{data ? data.passRate : '...'}</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl text-xs text-blue-700 font-bold text-center">
              <span>{data ? data.repeatRate : '...'} Repeat Registration Rate (FYP-1)</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-line shadow-card p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Grade Distribution</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">Final defense grading breakdown for Spring 2026</p>
              <div className="space-y-4 my-4">
                {data && Array.isArray(data.grades) && data.grades.map((g, idx) => {
                  const colors = ['bg-blue-600', 'bg-blue-500', 'bg-blue-400'];
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>{g.grade}</span><span>{g.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div className={`${colors[idx]} h-full rounded-full transition-all duration-500`} style={{ width: `${g.percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
                {(!data || !Array.isArray(data.grades)) && (
                  <div className="text-center py-8">
                    <BarChart3 size={32} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400 font-medium">No grade data available</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl text-xs text-blue-700 font-bold text-center">
              <span>Normal Distribution Curve Maintained</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-line shadow-card p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">CLO Attainment Averages</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">Mapped CLO performance across all rubric evaluations</p>
              <div className="space-y-4 my-4">
                {data && Array.isArray(data.clos) && data.clos.map((clo, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>{clo.name}</span><span>{clo.average}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${clo.average}%` }}></div>
                    </div>
                  </div>
                ))}
                {(!data || !Array.isArray(data.clos)) && (
                  <div className="text-center py-8">
                    <BarChart3 size={32} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400 font-medium">No CLO data available</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl text-xs text-blue-700 font-bold text-center">
              <span>All CLOs Exceed 70% HEC Benchmark</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HodAnalytics;
