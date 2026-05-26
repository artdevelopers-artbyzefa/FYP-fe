import React, { useEffect, useState } from 'react';
import { getInchargeCommitteeOversight } from '../../services/office-incharge.service';
import { showToast, showAlert } from '../../components/AppToast';
import { Check, X } from 'lucide-react';

const InchargeCommitteeOversight = () => {
  const [data, setData] = useState({ boards: [], requests: [] });

  useEffect(() => {
    getInchargeCommitteeOversight().then(res => setData(res.data)).catch(console.error);
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
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">Committee Governance & Oversight</h2>
        <p className="text-xs text-black mt-0.5 font-medium">Monitor evaluation boards, manage committee head change requests, and trigger formal re-evaluations</p>
      </div>

      {/* Committees Table */}
      <div className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden mb-8">
        <div className="p-5 bg-white border-b border-black"><h3 className="text-base font-black text-black">Active Boards Overview</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/75 border-b border-black text-[11px] font-black text-black uppercase tracking-wider">
                <th className="py-3.5 px-6">Committee Name</th>
                <th className="py-3.5 px-6">Committee Head</th>
                <th className="py-3.5 px-6">Active Members</th>
                <th className="py-3.5 px-6">Evaluation Schedule</th>
                <th className="py-3.5 px-6 text-right">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black text-sm font-medium text-black">
              {data.boards.map((b, idx) => (
                <tr key={idx} className="hover:bg-white/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-black">{b.name}</td>
                  <td className="py-4 px-6 text-black font-bold">{b.head}</td>
                  <td className="py-4 px-6 text-black">{b.members} Members</td>
                  <td className="py-4 px-6 text-black text-xs font-mono">{b.schedule}</td>
                  <td className="py-4 px-6 text-right space-x-1">
                    <button onClick={() => handleReeval(b.name)} className="px-3 py-1.5 rounded-lg bg-white hover:bg-white text-black border border-black text-xs font-bold transition-all cursor-pointer">Request Re-eval</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Committee Head Change Requests */}
      <div className="bg-white rounded-2xl border border-black shadow-sm p-6">
        <h3 className="text-base font-black text-black mb-6 pb-3 border-b border-black">Committee Head Change Requests</h3>
        {data.requests.map((r, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-white border border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-black text-black text-sm">{r.title}</span>
                <span className="bg-white text-black font-bold text-[10px] px-2.5 py-0.5 rounded-lg border border-black">Pending Approval</span>
              </div>
              <p className="text-xs text-black font-medium max-w-2xl leading-relaxed">{r.description}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={handleTransferApprove} className="px-4 py-2 bg-white hover:bg-white text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"><Check className="w-4 h-4 mr-1" /> Approve</button>
              <button onClick={handleTransferReject} className="px-4 py-2 bg-white hover:bg-white text-black rounded-xl text-xs font-bold transition-all cursor-pointer"><X className="w-4 h-4 mr-1" /> Reject</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default InchargeCommitteeOversight;
