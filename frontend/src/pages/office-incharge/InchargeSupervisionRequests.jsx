import React, { useEffect, useState } from 'react';
import { getInchargeSupervisionReqs } from '../../services/office-incharge.service';
import { showToast, showAlert } from '../../components/AppToast';
import { Check, X } from 'lucide-react';

const InchargeSupervisionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInchargeSupervisionReqs()
      .then(res => setRequests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
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
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Faculty Additional Supervision Requests</h2>
        <p className="text-xs text-slate-900 mt-0.5 font-medium">Review and approve or reject faculty requests for exceeding standard supervision slot caps</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-56 w-full rounded-2xl" />
            ))
          : requests.map((req, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-line shadow-sm p-6 flex flex-col justify-between hover:border-blue-500 transition-all">
                <div>
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-line">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white text-slate-900 flex items-center justify-center font-black text-xl border border-line">
                        {req.faculty.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{req.faculty}</h3>
                        <p className="text-xs text-slate-900 font-medium">{req.designation}</p>
                      </div>
                    </div>
                    <span className="bg-white text-slate-900 font-bold text-xs px-2.5 py-1 rounded-lg border border-line">Pending Review</span>
                  </div>
                  <div className="space-y-2 text-xs mb-6">
                    <div className="flex justify-between"><span className="text-slate-900 font-bold">Current Load:</span><span className="font-bold text-slate-900">{req.load} / 4 Slots Used</span></div>
                    <div className="flex justify-between"><span className="text-slate-900 font-bold">Requested Slots:</span><span className="font-bold text-slate-900">+{req.requested} Additional Slot(s)</span></div>
                    <div className="mt-2 bg-white p-3 rounded-xl border border-line">
                      <span className="font-bold text-slate-900 block mb-1">Faculty Justification:</span>
                      <p className="text-slate-900 italic">"{req.justification}"</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-line">
                  <button onClick={() => handleApprove(req.faculty)} className="flex-1 py-2.5 bg-white hover:bg-white text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"><Check className="w-4 h-4" /> Approve</button>
                  <button onClick={handleReject} className="px-5 py-2.5 bg-white hover:bg-white text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"><X className="w-4 h-4" /> Reject</button>
                </div>
              </div>
            ))}
      </div>
    </>
  );
};

export default InchargeSupervisionRequests;
