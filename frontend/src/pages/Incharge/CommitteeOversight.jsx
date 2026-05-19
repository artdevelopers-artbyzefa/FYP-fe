import React from 'react';

export default function CommitteeOversight() {
  const confirmAction = (actionName) => {
    if (window.confirm(`Are you sure you want to ${actionName}?`)) {
      alert(`Action completed: ${actionName}`);
    }
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">Committee Governance & Oversight</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Monitor evaluation boards, manage committee head change requests, and trigger formal re-evaluations</p>
      </div>

      {/* Committees Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="p-5 bg-gray-50 border-b border-gray-100"><h3 className="text-base font-black text-gray-800">Active Boards Overview</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Committee Name</th>
                <th className="py-3.5 px-6">Committee Head</th>
                <th className="py-3.5 px-6">Active Members</th>
                <th className="py-3.5 px-6">Evaluation Schedule</th>
                <th className="py-3.5 px-6 text-right">Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-bold text-gray-900">PEC-1 (AI & Vision)</td>
                <td className="py-4 px-6 text-gray-600 font-bold">Dr. Ali Hassan</td>
                <td className="py-4 px-6 text-gray-600">4 Members</td>
                <td className="py-4 px-6 text-gray-600 text-xs font-mono">Published (May 15)</td>
                <td className="py-4 px-6 text-right space-x-1">
                  <button onClick={() => confirmAction('trigger formal re-evaluation for PEC-1')} className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-all cursor-pointer">Request Re-eval</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-bold text-gray-900">FEC-FYP2-B</td>
                <td className="py-4 px-6 text-gray-600 font-bold">Dr. Sara Malik</td>
                <td className="py-4 px-6 text-gray-600">3 Members</td>
                <td className="py-4 px-6 text-gray-600 text-xs font-mono">Upcoming (Jun 10)</td>
                <td className="py-4 px-6 text-right space-x-1">
                  <button onClick={() => confirmAction('trigger formal re-evaluation for FEC-FYP2-B')} className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-all cursor-pointer">Request Re-eval</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Committee Head Change Requests */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-black text-gray-800 mb-6 pb-3 border-b border-gray-50">Committee Head Change Requests</h3>
        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-black text-gray-900 text-sm">FEC-FYP2-B Head Re-assignment</span>
              <span className="bg-amber-50 text-amber-600 font-bold text-[10px] px-2.5 py-0.5 rounded-lg border border-amber-200">Pending Approval</span>
            </div>
            <p className="text-xs text-gray-600 font-medium max-w-2xl leading-relaxed">Request from Dr. Sara Malik to transfer committee head responsibilities to Dr. Fatima Khan due to upcoming maternity leave.</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => confirmAction('approve committee head transfer')} className="px-4 py-2 bg-success hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm border-0"><i className="fas fa-check mr-1"></i> Approve</button>
            <button onClick={() => confirmAction('reject request')} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all cursor-pointer border-0"><i className="fas fa-times mr-1"></i> Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
}