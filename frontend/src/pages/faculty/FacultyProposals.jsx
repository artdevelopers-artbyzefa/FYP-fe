import React, { useEffect, useState } from 'react';
import { getFacultyProposals } from '../../services/faculty.service';
import { showToast, showAlert } from '../../components/AppToast';

const FacultyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  useEffect(() => {
    getFacultyProposals().then(res => setProposals(res.data)).catch(console.error);
  }, []);

  const handleApprove = () => {
    showToast.success('Proposal officially accepted.');
  };

  const handleRevisionSubmit = (e) => {
    e.preventDefault();
    showToast.warning('Revision request dispatched to group.');
    setIsRevisionOpen(false);
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    showAlert.confirm('Reject Proposal', 'Are you sure you want to reject this proposal?', 'Reject', 'Cancel')
      .then(res => {
        if (res.isConfirmed) {
          showToast.error('Proposal rejected with official justification.');
          setIsRejectOpen(false);
        }
      });
  };

  const openModal = (modalSetter, proposal) => {
    setSelectedProposal(proposal);
    modalSetter(true);
  };

  return (
    <>
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">Student Proposals</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Review incoming project proposals, request revisions, or issue final approvals/rejections.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Proposal Ref</th>
                <th className="py-3.5 px-6">Project Title</th>
                <th className="py-3.5 px-6">Student Group</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
              {proposals.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-500 font-mono text-xs font-bold">{p.id}</td>
                  <td className="py-4 px-6 font-bold text-gray-900 max-w-xs truncate">{p.title}</td>
                  <td className="py-4 px-6 text-gray-600 text-xs">
                    {p.students.map((s, i) => <div key={i}>{s}</div>)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-bold text-[10px] px-2.5 py-1 rounded-lg border ${p.status === 'Approved' ? 'bg-success/10 text-success border-success/20' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {p.status === 'Pending Review' ? (
                      <div className="flex justify-end gap-1">
                        <button onClick={handleApprove} className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all cursor-pointer">Accept</button>
                        <button onClick={() => openModal(setIsRevisionOpen, p)} className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-all cursor-pointer">Revise</button>
                        <button onClick={() => openModal(setIsRejectOpen, p)} className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-all cursor-pointer">Reject</button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 font-bold italic">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isRevisionOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-50">
              <h3 className="text-lg font-black text-gray-900">Request Mandatory Revisions</h3>
              <i className="fas fa-times text-gray-400 hover:text-gray-600 cursor-pointer text-lg" onClick={() => setIsRevisionOpen(false)}></i>
            </div>
            <form onSubmit={handleRevisionSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Revision Comments</label>
                <textarea placeholder="Outline required changes here..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-secondary focus:bg-white transition-all h-32" required></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button type="button" onClick={() => setIsRevisionOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer">Submit Revisions</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isRejectOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-50">
              <h3 className="text-lg font-black text-gray-900">Reject Proposal</h3>
              <i className="fas fa-times text-gray-400 hover:text-gray-600 cursor-pointer text-lg" onClick={() => setIsRejectOpen(false)}></i>
            </div>
            <form onSubmit={handleRejectSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Rejection Justification</label>
                <textarea placeholder="Explain why the proposal is not viable..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-secondary focus:bg-white transition-all h-32" required></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button type="button" onClick={() => setIsRejectOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-red-500/20 transition-all cursor-pointer">Confirm Rejection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FacultyProposals;
