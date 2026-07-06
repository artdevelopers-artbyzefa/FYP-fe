import React, { useEffect, useState } from 'react';
import { getPhase1Marks } from '../../services/phase1.service';
import { FileText, Printer, Search, Loader2 } from 'lucide-react';

const AssistantPhase1Marks = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    getPhase1Marks()
      .then(res => setResults(Array.isArray(res.data) ? res.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = results.filter(r =>
    !search
    || (r.name || '').toLowerCase().includes(search.toLowerCase())
    || (r.groupName || '').toLowerCase().includes(search.toLowerCase())
    || (r.regNo || '').toLowerCase().includes(search.toLowerCase())
  );

  const calcTotal = (r) => {
    const sv = r.supervisorMark != null ? r.supervisorMark * 0.5 : 0;
    const cms = (r.committeeMarks || []).filter(m => m != null);
    const avg = cms.length ? cms.reduce((a, b) => a + b, 0) / cms.length * 0.5 : 0;
    return (sv + avg).toFixed(1);
  };

  const exportPDF = () => {
    const el = document.getElementById('printArea');
    if (!el) return;
    const html = document.body.innerHTML;
    document.body.innerHTML = el.outerHTML;
    window.print();
    document.body.innerHTML = html;
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4 mb-6">
          <div className="skeleton h-7 w-56 rounded-md" />
          <div className="skeleton h-4 w-80 rounded-md mt-2" />
        </div>
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-line">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <th key={i} className="py-3.5 px-6"><div className="skeleton h-4 rounded-md" style={{ width: i < 2 ? '100px' : '55px' }} /></th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(j => (
                      <td key={j} className="py-4 px-6"><div className="skeleton h-4 rounded-md" style={{ width: j < 2 ? '120px' : '45px' }} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Phase 1 (10%) Marks</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Consolidated marks with supervisor and committee breakdowns.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="bg-white border border-line hover:border-blue-500 text-slate-900 hover:text-blue-600 px-3.5 py-2 rounded-xl font-bold text-[10px] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer">
            <Printer size={13} /> Print
          </button>
          <button onClick={exportPDF} className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl font-bold text-[10px] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer">
            <FileText size={13} /> PDF
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="relative max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, group, reg no…"
            className="w-full bg-white border border-line rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
          />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden" id="printArea">
        <div className="hidden print:block p-6 text-center border-b border-line">
          <h1 className="text-lg font-bold text-slate-900">COMSATS University Islamabad, Abbottabad Campus</h1>
          <h2 className="text-sm font-bold text-slate-700 mt-1">FYP Phase 1 (10%) Evaluation — Spring 2026</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-line text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Student / Group</th>
                <th className="py-3 px-6">Reg No</th>
                <th className="py-3 px-6 text-center">Supervisor<br /><span className="text-[8px] font-normal normal-case">(50%)</span></th>
                <th className="py-3 px-6 text-center">CM1<br /><span className="text-[8px] font-normal normal-case">(12.5%)</span></th>
                <th className="py-3 px-6 text-center">CM2<br /><span className="text-[8px] font-normal normal-case">(12.5%)</span></th>
                <th className="py-3 px-6 text-center">CM3<br /><span className="text-[8px] font-normal normal-case">(12.5%)</span></th>
                <th className="py-3 px-6 text-center">CM4<br /><span className="text-[8px] font-normal normal-case">(12.5%)</span></th>
                <th className="py-3 px-6 text-center">Total<br /><span className="text-[8px] font-normal normal-case">(100%)</span></th>
                <th className="py-3 px-6 text-center">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-3" />
                    <p className="text-sm font-bold">No results</p>
                    <p className="text-xs mt-1">Marks appear once evaluations are submitted.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => {
                  const cm = r.committeeMarks || [];
                  const remarks = [
                    ...(r.supervisorRemarks ? [{ who: 'Supervisor', text: r.supervisorRemarks }] : []),
                    ...(r.committeeRemarks || []).map((t, i) => ({ who: `CM${i + 1}`, text: t }))
                  ];
                  return (
                    <tr key={r.id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 text-xs">{r.name || r.groupName}</td>
                      <td className="py-4 px-6 text-slate-500 font-mono text-[10px]">{r.regNo || '—'}</td>
                      <td className="py-4 px-6 text-center font-bold text-slate-900 text-xs">{r.supervisorMark ?? '—'}</td>
                      {[0, 1, 2, 3].map(i => (
                        <td key={i} className="py-4 px-6 text-center font-bold text-slate-900 text-xs">{cm[i] ?? '—'}</td>
                      ))}
                      <td className="py-4 px-6 text-center font-bold text-sm text-blue-700">{calcTotal(r)}</td>
                      <td className="py-4 px-6 text-center">
                        <div className="relative group inline-block">
                          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200 cursor-pointer whitespace-nowrap">
                            {remarks.length} remark{remarks.length !== 1 ? 's' : ''}
                          </span>
                          {remarks.length > 0 && (
                            <div className="absolute right-0 top-7 w-64 bg-white border border-line rounded-xl shadow-dropdown z-10 hidden group-hover:block text-left">
                              <div className="px-3 py-2 border-b border-line bg-slate-50 rounded-t-xl">
                                <span className="text-[10px] font-bold text-slate-700">Remarks</span>
                              </div>
                              <div className="max-h-40 overflow-y-auto divide-y divide-line">
                                {remarks.map((rem, i) => (
                                  <div key={i} className="px-3 py-2">
                                    <span className="text-[9px] font-bold text-blue-600 block mb-0.5">{rem.who}</span>
                                    <p className="text-[10px] text-slate-600 leading-relaxed">{rem.text}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssistantPhase1Marks;
