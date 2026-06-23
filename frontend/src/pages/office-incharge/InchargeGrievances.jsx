import React, { useEffect, useState } from 'react';
import { getInchargeGrievances } from '../../services/office-incharge.service';
import { showToast, showAlert } from '../../components/AppToast';
import { AlertCircle, ArrowUpToLine, Clock, RefreshCw, X } from 'lucide-react';

const InchargeGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInchargeGrievances()
      .then(res => setGrievances(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
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
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Grievance Management & SLA Monitoring</h2>
        <p className="text-xs text-slate-900 mt-0.5 font-medium">Review student disputes, monitor strict SLA deadlines (3-day acknowledgment, 14-day resolution), and escalate critical issues</p>
      </div>

      <div className="space-y-6">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-44 w-full rounded-2xl" />
            ))
          : grievances.map((g, idx) => (
              <div key={idx} className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all relative overflow-hidden border ${g.sla.includes('Breach') ? 'border-line' : 'border-line'}`}>
                <div className={`absolute top-0 left-0 w-2 h-full ${g.sla.includes('Breach') ? 'bg-white' : 'bg-white'}`}></div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-line gap-4 pl-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-slate-900 text-base">{g.student}</span>
                      <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border ${g.sla.includes('Breach') ? 'bg-white' : 'bg-white'}`}>
                        {g.sla.includes('Breach')  ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />} {g.sla}
                      </span>
                    </div>
                    <p className="text-xs text-slate-900 font-bold">Category: {g.category} | Filed: {g.date}</p>
                  </div>
                  <span className={`font-bold text-xs px-3 py-1.5 rounded-xl border shadow-sm ${g.status === 'New Filing' ? 'bg-blue-50 text-slate-900 border-blue-200' : 'bg-white'}`}>{g.status}</span>
                </div>

                <div className="pl-4 space-y-4 text-xs">
                  <div className="bg-white p-4 rounded-2xl border border-line">
                    <span className="font-bold text-slate-900 block mb-1">Grievance Description:</span>
                    <p className="text-slate-900 leading-relaxed">"{g.desc}"</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-line justify-end">
                    <button onClick={() => handleAction('Action Requested Successfully')} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-600 text-white rounded-xl font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" /> Take Action
                    </button>
                    <button onClick={() => handleAction('Grievance Escalated to HOD', 'warning')} className="px-4 py-2.5 bg-white hover:bg-white text-white rounded-xl font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2">
                      <ArrowUpToLine className="w-4 h-4" /> Escalate to HOD
                    </button>
                    <button onClick={() => handleAction('Grievance Dismissed')} className="px-4 py-2.5 bg-white hover:bg-white text-slate-900 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2">
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
