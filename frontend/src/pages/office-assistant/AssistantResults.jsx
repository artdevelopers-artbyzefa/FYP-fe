import React, { useEffect, useState } from 'react';
import { getOfficeResults } from '../../services/office-assistant.service';
import { showToast } from '../../components/AppToast';
import { FileText, Printer } from 'lucide-react';

const AssistantResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOfficeResults().then(res => setResults(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Final Results & Reports</h2>
          <p className="text-xs text-slate-900 mt-0.5 font-medium">Review milestone scorecards, print formatted official transcripts, and export PDF summaries</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="bg-white border border-line hover:border-blue-500 text-slate-900 hover:text-blue-600 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer">
            <Printer className="text-slate-900" /> Print Report
          </button>
          <button onClick={() => showToast.success('Exporting official PDF report...')} className="bg-white hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
            <FileText className="w-4 h-4" /> Export as PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden" id="printArea">
        <div className="p-6 bg-white border-b border-line hidden print:block text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">COMSATS University Islamabad, Abbottabad Campus</h1>
          <h2 className="text-lg font-bold text-slate-900">Official Final Year Project Milestone Results — Spring 2026</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 border-b border-line text-[11px] font-bold text-slate-900 tracking-wider">
                <th className="py-3.5 px-6">Student Name</th>
                <th className="py-3.5 px-6">Registration No</th>
                <th className="py-3.5 px-6">Project Title</th>
                <th className="py-3.5 px-6 text-center">10% Milestone</th>
                <th className="py-3.5 px-6 text-center">30% Milestone</th>
                <th className="py-3.5 px-6 text-center">60% Milestone</th>
                <th className="py-3.5 px-6 text-center">100% Defense</th>
                <th className="py-3.5 px-6 text-center font-bold text-slate-900">Final Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-900">
              {loading
                ? Array.from({ length: 5 }, (_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 8 }, (_, j) => (
                        <td key={j} className="py-4 px-6"><div className="h-4 rounded-md skeleton w-16" /></td>
                      ))}
                    </tr>
                  ))
                : results.map(r => (
                <tr key={r.id} className="hover:bg-white/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{r.name}</td>
                  <td className="py-4 px-6 text-slate-900 font-mono text-xs">{r.id}</td>
                  <td className="py-4 px-6 text-slate-900 max-w-xs truncate">{r.project}</td>
                  <td className="py-4 px-6 text-center font-bold">{r.m10}</td>
                  <td className="py-4 px-6 text-center font-bold">{r.m30}</td>
                  <td className="py-4 px-6 text-center font-bold">{r.m60}</td>
                  <td className="py-4 px-6 text-center font-bold">{r.m100}</td>
                  <td className="py-4 px-6 text-center font-bold text-slate-900 text-base">{r.final}</td>
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
