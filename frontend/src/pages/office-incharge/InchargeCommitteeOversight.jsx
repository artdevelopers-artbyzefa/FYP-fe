import React, { useEffect, useState } from 'react';
import { getInchargeCommitteeOversight } from '../../services/office-incharge.service';
import { showToast, showAlert } from '../../components/AppToast';
import { Check, X } from 'lucide-react';

const InchargeCommitteeOversight = () => {
  const [data, setData] = useState({ boards: [], requests: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInchargeCommitteeOversight()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleReeval = (committee) => {
    showAlert.confirm('Request Re-evaluation', `Trigger formal re-evaluation for ${committee}?`)
      .then(res => {
        if (res.isConfirmed) showToast.warning('Re-evaluation workflow initiated!');
      });
  };

  const handleTransferApprove = () => {
    showToast.success('Committee head reassigned successfully!');
  };

  const handleTransferReject = () => {
    showToast.error('Transfer request rejected.');
  };

  return (
    <>
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Committee Governance & Oversight</h2>
        <p className="text-xs text-slate-900 mt-0.5 font-medium">Monitor evaluation boards, manage committee head change requests, and trigger formal re-evaluations</p>
      </div>

      {/* Committees Table */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden mb-8">
        <div className="p-5 bg-white border-b border-line"><h3 className="text-base font-bold text-slate-900">Active Boards Overview</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 border-b border-line text-[11px] font-bold text-slate-900 tracking-wider">
                <th className="py-3.5 px-6">Committee Name</th>
                <th className="py-3.5 px-6">Committee Head</th>
                <th className="py-3.5 px-6">Active Members</th>
                <th className="py-3.5 px-6">Evaluation Schedule</th>
                <th className="py-3.5 px-6 text-right">Governance Actions</th>
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
                : data.boards.map((b, idx) => (
                    <tr key={idx} className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">{b.name}</td>
                      <td className="py-4 px-6 text-slate-900 font-bold">{b.head}</td>
                      <td className="py-4 px-6 text-slate-900">{b.members} Members</td>
                      <td className="py-4 px-6 text-slate-900 text-xs font-mono">{b.schedule}</td>
                      <td className="py-4 px-6 text-right space-x-1">
                        <button onClick={() => handleReeval(b.name)} className="px-3 py-1.5 rounded-lg bg-white hover:bg-white text-slate-900 border border-line text-xs font-bold transition-all cursor-pointer">Request Re-eval</button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Committee Head Change Requests */}
      <div className="bg-white rounded-2xl border border-line shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-6 pb-3 border-b border-line">Committee Head Change Requests</h3>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="skeleton h-6 w-48 rounded-md" />
              </div>
            ))
          : data.requests.map((r, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-slate-900 text-sm">{r.title}</span>
                    <span className="bg-white text-slate-900 font-bold text-[10px] px-2.5 py-0.5 rounded-lg border border-line">Pending Approval</span>
                  </div>
                  <p className="text-xs text-slate-900 font-medium max-w-2xl leading-relaxed">{r.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={handleTransferApprove} className="px-4 py-2 bg-white hover:bg-white text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"><Check className="w-4 h-4 mr-1" /> Approve</button>
                  <button onClick={handleTransferReject} className="px-4 py-2 bg-white hover:bg-white text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer"><X className="w-4 h-4 mr-1" /> Reject</button>
                </div>
              </div>
            ))}
      </div>
    </>
  );
};

export default InchargeCommitteeOversight;
