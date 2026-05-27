import React, { useEffect, useState } from 'react';
import { getInchargeFacultyReports } from '../../services/office-incharge.service';

const InchargeFacultyReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getInchargeFacultyReports().then(res => setReports(res.data)).catch(console.error);
  }, []);

  return (
    <>
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">Faculty Supervision Reports</h2>
        <p className="text-xs text-black mt-0.5 font-medium">Per-faculty analysis of supervision load, log approval rates, and evaluation performance</p>
      </div>

      <div className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/75 border-b border-black text-[11px] font-black text-black uppercase tracking-wider">
                <th className="py-3.5 px-6">Faculty Name</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Supervised Groups</th>
                <th className="py-3.5 px-6">Workload</th>
                <th className="py-3.5 px-6">Avg Eval Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-600 text-sm font-medium text-black">
              {reports.map((r, idx) => (
                <tr key={idx} className="hover:bg-white/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-black">{r.name}</td>
                  <td className="py-4 px-6 text-black">{r.dept}</td>
                  <td className="py-4 px-6 text-black">{r.groups} Groups</td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold text-black bg-white px-2 py-0.5 rounded-lg border border-black">{r.workload}</span>
                  </td>
                  <td className="py-4 px-6 font-black text-black">{r.evalScore}</td>
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
