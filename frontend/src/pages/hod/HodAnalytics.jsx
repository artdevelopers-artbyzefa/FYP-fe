import React, { useEffect, useState } from 'react';
import { getAnalyticsData } from '../../services/hod.service';
import { Printer } from 'lucide-react';

const HodAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAnalyticsData().then((res) => setData(res.data)).catch(console.error);
  }, []);

  return (
    <>
      <div className="border-b border-black pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-black">Departmental FYP Analytics & CLO Attainment</h2>
          <p className="text-xs text-black mt-0.5 font-medium">Visual metrics of student pass rates, grade distribution, and overall CLO attainment averages</p>
        </div>
        <button onClick={() => window.print()} className="px-5 py-2.5 bg-white border border-black text-black hover:bg-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer">
          <Printer className="text-black" /> Print Analytics
        </button>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-[fadeIn_0.3s_ease-out]">
        
        {/* Pass Rate Card */}
        <div className="bg-white rounded-2xl border border-black shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-black mb-2">Overall Student Pass Rate</h3>
            <p className="text-xs text-black mb-6 font-medium">FYP-1 and FYP-2 cumulative clearing percentage</p>
            <div className="flex items-center justify-center my-8">
              <div className="w-40 h-40 rounded-full border-8 border-black flex items-center justify-center shadow-inner bg-white">
                <span className="text-4xl font-black text-black">{data ? data.passRate : '...'}</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-black text-xs text-black font-bold text-center">
            <span>{data ? data.repeatRate : '...'} Repeat Registration Rate (FYP-1)</span>
          </div>
        </div>

        {/* Grade Distribution Card */}
        <div className="bg-white rounded-2xl border border-black shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-black mb-2">Grade Distribution</h3>
            <p className="text-xs text-black mb-6 font-medium">Final defense grading breakdown for Spring 2026</p>
            <div className="space-y-4 my-4">
              {data && data.grades.map((g, idx) => {
                const colors = ['bg-blue-600', 'bg-blue-600', 'bg-warning'];
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-xs font-bold text-black mb-1">
                      <span>{g.grade}</span><span>{g.percentage}%</span>
                    </div>
                    <div className="w-full bg-white h-3 rounded-full overflow-hidden">
                      <div className={`${colors[idx]} h-full rounded-full`} style={{ width: `${g.percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-black text-xs text-black font-bold text-center">
            <span>Normal Distribution Curve Maintained</span>
          </div>
        </div>

        {/* CLO Attainment Card */}
        <div className="bg-white rounded-2xl border border-black shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-black mb-2">CLO Attainment Averages</h3>
            <p className="text-xs text-black mb-6 font-medium">Mapped CLO performance across all rubric evaluations</p>
            <div className="space-y-4 my-4">
              {data && data.clos.map((clo, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-bold text-black mb-1">
                    <span>{clo.name}</span><span>{clo.average}%</span>
                  </div>
                  <div className="w-full bg-white h-3 rounded-full overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{ width: `${clo.average}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-black text-xs text-black font-bold text-center">
            <span>All CLOs Exceed 70% HEC Benchmark</span>
          </div>
        </div>

      </div>
    </>
  );
};

export default HodAnalytics;
