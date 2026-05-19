import React, { useEffect, useState } from 'react';
import { getInchargeFacultyReports } from '../../services/office-incharge.service';

const InchargeFacultyReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getInchargeFacultyReports().then(res => setReports(res.data)).catch(console.error);
  }, []);

  return (
    <>
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">Faculty Supervision Reports</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Per-faculty analysis of supervision load, log approval rates, and evaluation performance</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Faculty Name</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Supervised Groups</th>
                <th className="py-3.5 px-6">Workload</th>
                <th className="py-3.5 px-6">Avg Eval Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
              {reports.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-900">{r.name}</td>
                  <td className="py-4 px-6 text-gray-600">{r.dept}</td>
                  <td className="py-4 px-6 text-gray-600">{r.groups} Groups</td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">{r.workload}</span>
                  </td>
                  <td className="py-4 px-6 font-black text-success">{r.evalScore}</td>
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
