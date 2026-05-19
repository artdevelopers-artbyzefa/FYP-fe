import React, { useEffect, useState } from 'react';
import { getInchargeGrievances } from '../../services/office-incharge.service';
import { showToast, showAlert } from '../../components/AppToast';

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
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">Grievance Management & SLA Monitoring</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Review student disputes, monitor strict SLA deadlines (3-day acknowledgment, 14-day resolution), and escalate critical issues</p>
      </div>

      <div className="space-y-6">
        {grievances.map((g, idx) => (
          <div key={idx} className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all relative overflow-hidden border ${g.sla.includes('Breach') ? 'border-red-200' : 'border-amber-200'}`}>
            <div className={`absolute top-0 left-0 w-2 h-full ${g.sla.includes('Breach') ? 'bg-red-600' : 'bg-amber-500'}`}></div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-50 gap-4 pl-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-black text-gray-900 text-base">{g.student}</span>
                  <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border ${g.sla.includes('Breach') ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                    <i className={`fas ${g.sla.includes('Breach') ? 'fa-exclamation-circle' : 'fa-clock'} mr-1`}></i> {g.sla}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-bold">Category: {g.category} · Filed: {g.date}</p>
              </div>
              <span className={`font-bold text-xs px-3 py-1.5 rounded-xl border shadow-sm ${g.status === 'New Filing' ? 'bg-blue-50 text-secondary border-blue-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>{g.status}</span>
            </div>

            <div className="pl-4 space-y-4 text-xs">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <span className="font-bold text-gray-700 block mb-1">Grievance Description:</span>
                <p className="text-gray-600 leading-relaxed">"{g.desc}"</p>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50 justify-end">
                <button onClick={() => handleAction('Action Requested Successfully')} className="px-4 py-2.5 bg-primary hover:bg-blue-900 text-white rounded-xl font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2">
                  <i className="fas fa-sync-alt"></i> Take Action
                </button>
                <button onClick={() => handleAction('Grievance Escalated to HOD', 'warning')} className="px-4 py-2.5 bg-warning hover:bg-amber-600 text-white rounded-xl font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2">
                  <i className="fas fa-level-up-alt"></i> Escalate to HOD
                </button>
                <button onClick={() => handleAction('Grievance Dismissed')} className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2">
                  <i className="fas fa-times"></i> Dismiss
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
