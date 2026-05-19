import React, { useEffect, useState } from 'react';
import { getInchargeSupervisionReqs } from '../../services/office-incharge.service';
import { showToast, showAlert } from '../../components/AppToast';

const InchargeSupervisionRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getInchargeSupervisionReqs().then(res => setRequests(res.data)).catch(console.error);
  }, []);

  const handleApprove = (faculty) => {
    showAlert.confirm('Approve Request', `Approve additional supervision slots for ${faculty}?`)
      .then(res => {
        if (res.isConfirmed) showToast.success('Supervision request approved!');
      });
  };

  const handleReject = () => {
    showToast.error('Supervision request rejected.');
  };

  return (
    <>
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">Faculty Additional Supervision Requests</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Review and approve or reject faculty requests for exceeding standard supervision slot caps</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((req, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between hover:border-secondary transition-all">
            <div>
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-secondary flex items-center justify-center font-black text-xl border border-blue-100">
                    {req.faculty.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-base">{req.faculty}</h3>
                    <p className="text-xs text-gray-500 font-medium">{req.designation}</p>
                  </div>
                </div>
                <span className="bg-amber-50 text-amber-600 font-bold text-xs px-2.5 py-1 rounded-lg border border-amber-200">Pending Review</span>
              </div>
              <div className="space-y-2 text-xs mb-6">
                <div className="flex justify-between"><span className="text-gray-500 font-bold">Current Load:</span><span className="font-black text-gray-800">{req.load} / 4 Slots Used</span></div>
                <div className="flex justify-between"><span className="text-gray-500 font-bold">Requested Slots:</span><span className="font-black text-secondary">+{req.requested} Additional Slot(s)</span></div>
                <div className="mt-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-600 block mb-1">Faculty Justification:</span>
                  <p className="text-gray-500 italic">"{req.justification}"</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-gray-50">
              <button onClick={() => handleApprove(req.faculty)} className="flex-1 py-2.5 bg-success hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"><i className="fas fa-check"></i> Approve</button>
              <button onClick={handleReject} className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"><i className="fas fa-times"></i> Reject</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default InchargeSupervisionRequests;
