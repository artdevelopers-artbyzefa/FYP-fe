import React, { useEffect, useState } from 'react';
import { getInchargeFacultyReports } from '../../services/office-incharge.service';

const InchargeFacultyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInchargeFacultyReports()
      .then(res => setReports(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Faculty Supervision Reports</h2>
        <p className="text-xs text-slate-900 mt-0.5 font-medium">Per-faculty analysis of supervision load, log approval rates, and evaluation performance</p>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 border-b border-line text-[11px] font-bold text-slate-900 tracking-wider">
                <th className="py-3.5 px-6">Faculty Name</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Supervised Groups</th>
                <th className="py-3.5 px-6">Workload</th>
                <th className="py-3.5 px-6">Avg Eval Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-900">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="py-4 px-6"><div className="h-4 rounded-md skeleton w-24" /></td>
                      ))}
                    </tr>
                  ))
                : reports.map((r, idx) => (
                    <tr key={idx} className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">{r.name}</td>
                      <td className="py-4 px-6 text-slate-900">{r.dept}</td>
                      <td className="py-4 px-6 text-slate-900">{r.groups} Groups</td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-line">{r.workload}</span>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">{r.evalScore}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default InchargeFacultyReports;
