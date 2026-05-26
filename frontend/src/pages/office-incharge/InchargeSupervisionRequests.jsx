import React, { useEffect, useState } from 'react';
import { getInchargeSupervisionReqs } from '../../services/office-incharge.service';
import { showToast, showAlert } from '../../components/AppToast';
import { Check, X } from 'lucide-react';

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
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">Faculty Additional Supervision Requests</h2>
        <p className="text-xs text-black mt-0.5 font-medium">Review and approve or reject faculty requests for exceeding standard supervision slot caps</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((req, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-black shadow-sm p-6 flex flex-col justify-between hover:border-black transition-all">
            <div>
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-black">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center font-black text-xl border border-black">
                    {req.faculty.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-black text-black text-base">{req.faculty}</h3>
                    <p className="text-xs text-black font-medium">{req.designation}</p>
                  </div>
                </div>
                <span className="bg-white text-black font-bold text-xs px-2.5 py-1 rounded-lg border border-black">Pending Review</span>
              </div>
              <div className="space-y-2 text-xs mb-6">
                <div className="flex justify-between"><span className="text-black font-bold">Current Load:</span><span className="font-black text-black">{req.load} / 4 Slots Used</span></div>
                <div className="flex justify-between"><span className="text-black font-bold">Requested Slots:</span><span className="font-black text-black">+{req.requested} Additional Slot(s)</span></div>
                <div className="mt-2 bg-white p-3 rounded-xl border border-black">
                  <span className="font-bold text-black block mb-1">Faculty Justification:</span>
                  <p className="text-black italic">"{req.justification}"</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-black">
              <button onClick={() => handleApprove(req.faculty)} className="flex-1 py-2.5 bg-white hover:bg-white text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"><Check className="w-4 h-4" /> Approve</button>
              <button onClick={handleReject} className="px-5 py-2.5 bg-white hover:bg-white text-black rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"><X className="w-4 h-4" /> Reject</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default InchargeSupervisionRequests;
