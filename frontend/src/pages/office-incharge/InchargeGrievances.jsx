import React, { useEffect, useState } from 'react';
import { getInchargeGrievances } from '../../services/office-incharge.service';
import { showToast, showAlert } from '../../components/AppToast';
import { ArrowUpToLine, RefreshCw, X } from 'lucide-react';

const InchargeGrievances = () => {
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    getInchargeGrievances().then(res => setGrievances(res.data)).catch(console.error);
  }, []);

  const handleAction = (msg, type = 'success') => {
    showAlert.confirm('Confirm Action', msg).then(res => {
      if (res.isConfirmed) {
        if(type === 'success') showToast.success(msg);
        else showToast.warning(msg);
      }
    });
  };

  return (
    <>
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">Grievance Management & SLA Monitoring</h2>
        <p className="text-xs text-black mt-0.5 font-medium">Review student disputes, monitor strict SLA deadlines (3-day acknowledgment, 14-day resolution), and escalate critical issues</p>
      </div>

      <div className="space-y-6">
        {grievances.map((g, idx) => (
          <div key={idx} className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all relative overflow-hidden border ${g.sla.includes('Breach') ? 'border-black' : 'border-black'}`}>
            <div className={`absolute top-0 left-0 w-2 h-full ${g.sla.includes('Breach') ? 'bg-white' : 'bg-white'}`}></div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-black gap-4 pl-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-black text-black text-base">{g.student}</span>
                  <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border ${g.sla.includes('Breach') ? 'bg-white' : 'bg-white'}`}>
                    <i className={`fas ${g.sla.includes('Breach') ? 'fa-exclamation-circle' : 'fa-clock'} mr-1`}></i> {g.sla}
                  </span>
                </div>
                <p className="text-xs text-black font-bold">Category: {g.category} · Filed: {g.date}</p>
              </div>
              <span className={`font-bold text-xs px-3 py-1.5 rounded-xl border shadow-sm ${g.status === 'New Filing' ? 'bg-blue-50 text-black border-blue-200' : 'bg-white'}`}>{g.status}</span>
            </div>

            <div className="pl-4 space-y-4 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-black">
                <span className="font-bold text-black block mb-1">Grievance Description:</span>
                <p className="text-black leading-relaxed">"{g.desc}"</p>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-4 border-t border-black justify-end">
                <button onClick={() => handleAction('Action Requested Successfully')} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-600 text-white rounded-xl font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Take Action
                </button>
                <button onClick={() => handleAction('Grievance Escalated to HOD', 'warning')} className="px-4 py-2.5 bg-white hover:bg-white text-white rounded-xl font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2">
                  <ArrowUpToLine className="w-4 h-4" /> Escalate to HOD
                </button>
                <button onClick={() => handleAction('Grievance Dismissed')} className="px-4 py-2.5 bg-white hover:bg-white text-black rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2">
                  <X className="w-4 h-4" /> Dismiss
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default InchargeGrievances;
