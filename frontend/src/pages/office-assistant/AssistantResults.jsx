import React, { useEffect, useState } from 'react';
import { getOfficeResults } from '../../services/office-assistant.service';
import { showToast } from '../../components/AppToast';
import { FileText, Printer } from 'lucide-react';

const SKELETON_WIDTHS = ['w-32', 'w-28', 'w-48', 'w-12', 'w-12', 'w-12', 'w-12', 'w-14'];

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {SKELETON_WIDTHS.map((w, i) => (
        <td key={i} className="py-4 px-6"><div className={`h-4 bg-slate-200 rounded ${w}`} /></td>
      ))}
    </tr>
  );
}

const AssistantResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOfficeResults().then(res => setResults(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleExportPDF = () => {
    const printContent = document.getElementById('printArea');
    if (!printContent) return;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent.outerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Final Results & Reports</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Review milestone scorecards, print formatted official transcripts, and export PDF summaries</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="bg-white border border-line hover:border-blue-500 text-slate-900 hover:text-blue-600 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer">
            <Printer size={15} /> Print Report
          </button>
          <button onClick={handleExportPDF} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer">
            <FileText size={15} /> Export as PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden" id="printArea">
        <div className="p-6 bg-white border-b border-line hidden print:block text-center">
          <h1 className="text-xl font-bold text-slate-900 mb-1">COMSATS University Islamabad, Abbottabad Campus</h1>
          <h2 className="text-sm font-bold text-slate-700">Official Final Year Project Milestone Results — Spring 2026</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-line text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Student Name</th>
                <th className="py-3.5 px-6">Reg No</th>
                <th className="py-3.5 px-6">Project Title</th>
                <th className="py-3.5 px-6 text-center">10%</th>
                <th className="py-3.5 px-6 text-center">30%</th>
                <th className="py-3.5 px-6 text-center">60%</th>
                <th className="py-3.5 px-6 text-center">100%</th>
                <th className="py-3.5 px-6 text-center">Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-sm">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-3" />
                    <p className="text-sm font-bold">No results available</p>
                    <p className="text-xs mt-1">Evaluation scores will appear once milestone evaluations are completed.</p>
                  </td>
                </tr>
              ) : (
                results.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{r.name}</td>
                    <td className="py-4 px-6 text-slate-500 font-mono text-xs">{r.regNo || r.id?.slice(-6) || '—'}</td>
                    <td className="py-4 px-6 text-slate-700 max-w-xs truncate">{r.project}</td>
                    <td className="py-4 px-6 text-center font-bold text-slate-900">{r.m10}</td>
                    <td className="py-4 px-6 text-center font-bold text-slate-900">{r.m30}</td>
                    <td className="py-4 px-6 text-center font-bold text-slate-900">{r.m60}</td>
                    <td className="py-4 px-6 text-center font-bold text-slate-900">{r.m100}</td>
                    <td className="py-4 px-6 text-center font-bold text-slate-900 text-base">{r.final}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssistantResults;
