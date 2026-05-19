import React, { useEffect, useState } from 'react';
import { getOfficeResults } from '../../services/office-assistant.service';
import { showToast } from '../../components/AppToast';

const AssistantResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    getOfficeResults().then(res => setResults(res.data)).catch(console.error);
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-800">Final Results & Reports</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Review milestone scorecards, print formatted official transcripts, and export PDF summaries</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="bg-white border border-gray-200 hover:border-primary text-gray-700 hover:text-primary px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer">
            <i className="fas fa-print text-secondary"></i> Print Report
          </button>
          <button onClick={() => showToast.success('Exporting official PDF report...')} className="bg-secondary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer">
            <i className="fas fa-file-pdf"></i> Export as PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" id="printArea">
        <div className="p-6 bg-gray-50 border-b border-gray-100 hidden print:block text-center mb-6">
          <h1 className="text-2xl font-black text-primary mb-1">COMSATS University Islamabad, Abbottabad Campus</h1>
          <h2 className="text-lg font-bold text-gray-700">Official Final Year Project Milestone Results — Spring 2026</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Student Name</th>
                <th className="py-3.5 px-6">Registration No</th>
                <th className="py-3.5 px-6">Project Title</th>
                <th className="py-3.5 px-6 text-center">10% Milestone</th>
                <th className="py-3.5 px-6 text-center">30% Milestone</th>
                <th className="py-3.5 px-6 text-center">60% Milestone</th>
                <th className="py-3.5 px-6 text-center">100% Defense</th>
                <th className="py-3.5 px-6 text-center font-black text-primary">Final Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
              {results.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-900">{r.name}</td>
                  <td className="py-4 px-6 text-gray-600 font-mono text-xs">{r.id}</td>
                  <td className="py-4 px-6 text-gray-600 max-w-xs truncate">{r.project}</td>
                  <td className="py-4 px-6 text-center font-bold">{r.m10}</td>
                  <td className="py-4 px-6 text-center font-bold">{r.m30}</td>
                  <td className="py-4 px-6 text-center font-bold">{r.m60}</td>
                  <td className="py-4 px-6 text-center font-bold">{r.m100}</td>
                  <td className="py-4 px-6 text-center font-black text-success text-base">{r.final}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AssistantResults;
