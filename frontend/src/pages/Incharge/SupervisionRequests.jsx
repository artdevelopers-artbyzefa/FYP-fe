import React from 'react';
import { Check, X } from 'lucide-react';

export default function SupervisionRequests() {
  const confirmAction = (actionName) => {
    if (window.confirm(`Are you sure you want to ${actionName}?`)) {
      alert(`Action completed: ${actionName}`);
    }
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Faculty Additional Supervision Requests</h2>
        <p className="text-xs text-slate-900 mt-0.5 font-medium">Review and approve or reject faculty requests for exceeding standard supervision slot caps</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Request Card 1 */}
        <div className="bg-white rounded-2xl border border-line shadow-sm p-6 flex flex-col justify-between hover:border-blue-500 transition-all">
          <div>
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-line">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white text-slate-900 flex items-center justify-center font-black text-xl border border-line">AH</div>
                <div><h3 className="font-bold text-slate-900 text-base">Dr. Ali Hassan</h3><p className="text-xs text-slate-900 font-medium">Associate Professor</p></div>
              </div>
              <span className="bg-white text-slate-900 font-bold text-xs px-2.5 py-1 rounded-lg border border-line">Pending Review</span>
            </div>
            <div className="space-y-2 text-xs mb-6">
              <div className="flex justify-between"><span className="text-slate-900 font-bold">Current Load:</span><span className="font-bold text-slate-900">4 / 4 Slots Used</span></div>
              <div className="flex justify-between"><span className="text-slate-900 font-bold">Requested Slots:</span><span className="font-bold text-slate-900">+1 Additional Slot</span></div>
              <div className="mt-2 bg-white p-3 rounded-xl border border-line"><span className="font-bold text-slate-900 block mb-1">Faculty Justification:</span><p className="text-slate-900 italic">"An exceptional student group proposed an AI traffic signal optimization project that aligns perfectly with my active HEC research grant."</p></div>
            </div>
          </div>
          <div className="flex gap-2 pt-4 border-t border-line">
            <button onClick={() => confirmAction('approve additional supervision slot for Dr. Ali Hassan')} className="flex-1 py-2.5 bg-white hover:bg-white text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md border-0"><Check className="w-4 h-4" /> Approve</button>
            <button onClick={() => confirmAction('reject request')} className="px-5 py-2.5 bg-white hover:bg-white text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border-0"><X className="w-4 h-4" /> Reject</button>
          </div>
        </div>

        {/* Request Card 2 */}
        <div className="bg-white rounded-2xl border border-line shadow-sm p-6 flex flex-col justify-between hover:border-blue-500 transition-all">
          <div>
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-line">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white text-slate-900 flex items-center justify-center font-black text-xl border border-line">FK</div>
                <div><h3 className="font-bold text-slate-900 text-base">Dr. Fatima Khan</h3><p className="text-xs text-slate-900 font-medium">Assistant Professor</p></div>
              </div>
              <span className="bg-white text-slate-900 font-bold text-xs px-2.5 py-1 rounded-lg border border-line">Pending Review</span>
            </div>
            <div className="space-y-2 text-xs mb-6">
              <div className="flex justify-between"><span className="text-slate-900 font-bold">Current Load:</span><span className="font-bold text-slate-900">4 / 4 Slots Used</span></div>
              <div className="flex justify-between"><span className="text-slate-900 font-bold">Requested Slots:</span><span className="font-bold text-slate-900">+2 Additional Slots</span></div>
              <div className="mt-2 bg-white p-3 rounded-xl border border-line"><span className="font-bold text-slate-900 block mb-1">Faculty Justification:</span><p className="text-slate-900 italic">"Requesting extension to accommodate two cybersecurity groups transferred from departing faculty."</p></div>
            </div>
          </div>
          <div className="flex gap-2 pt-4 border-t border-line">
            <button onClick={() => confirmAction('approve additional supervision slots for Dr. Fatima')} className="flex-1 py-2.5 bg-white hover:bg-white text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md border-0"><Check className="w-4 h-4" /> Approve</button>
            <button onClick={() => confirmAction('reject request')} className="px-5 py-2.5 bg-white hover:bg-white text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border-0"><X className="w-4 h-4" /> Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
}