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
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">Faculty Additional Supervision Requests</h2>
        <p className="text-xs text-black mt-0.5 font-medium">Review and approve or reject faculty requests for exceeding standard supervision slot caps</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Request Card 1 */}
        <div className="bg-white rounded-2xl border border-black shadow-sm p-6 flex flex-col justify-between hover:border-blue-600 transition-all">
          <div>
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-black">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center font-black text-xl border border-black">AH</div>
                <div><h3 className="font-black text-black text-base">Dr. Ali Hassan</h3><p className="text-xs text-black font-medium">Associate Professor</p></div>
              </div>
              <span className="bg-white text-black font-bold text-xs px-2.5 py-1 rounded-lg border border-black">Pending Review</span>
            </div>
            <div className="space-y-2 text-xs mb-6">
              <div className="flex justify-between"><span className="text-black font-bold">Current Load:</span><span className="font-black text-black">4 / 4 Slots Used</span></div>
              <div className="flex justify-between"><span className="text-black font-bold">Requested Slots:</span><span className="font-black text-black">+1 Additional Slot</span></div>
              <div className="mt-2 bg-white p-3 rounded-xl border border-black"><span className="font-bold text-black block mb-1">Faculty Justification:</span><p className="text-black italic">"An exceptional student group proposed an AI traffic signal optimization project that aligns perfectly with my active HEC research grant."</p></div>
            </div>
          </div>
          <div className="flex gap-2 pt-4 border-t border-black">
            <button onClick={() => confirmAction('approve additional supervision slot for Dr. Ali Hassan')} className="flex-1 py-2.5 bg-white hover:bg-white text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md border-0"><Check className="w-4 h-4" /> Approve</button>
            <button onClick={() => confirmAction('reject request')} className="px-5 py-2.5 bg-white hover:bg-white text-black rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border-0"><X className="w-4 h-4" /> Reject</button>
          </div>
        </div>

        {/* Request Card 2 */}
        <div className="bg-white rounded-2xl border border-black shadow-sm p-6 flex flex-col justify-between hover:border-blue-600 transition-all">
          <div>
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-black">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center font-black text-xl border border-black">FK</div>
                <div><h3 className="font-black text-black text-base">Dr. Fatima Khan</h3><p className="text-xs text-black font-medium">Assistant Professor</p></div>
              </div>
              <span className="bg-white text-black font-bold text-xs px-2.5 py-1 rounded-lg border border-black">Pending Review</span>
            </div>
            <div className="space-y-2 text-xs mb-6">
              <div className="flex justify-between"><span className="text-black font-bold">Current Load:</span><span className="font-black text-black">4 / 4 Slots Used</span></div>
              <div className="flex justify-between"><span className="text-black font-bold">Requested Slots:</span><span className="font-black text-black">+2 Additional Slots</span></div>
              <div className="mt-2 bg-white p-3 rounded-xl border border-black"><span className="font-bold text-black block mb-1">Faculty Justification:</span><p className="text-black italic">"Requesting extension to accommodate two cybersecurity groups transferred from departing faculty."</p></div>
            </div>
          </div>
          <div className="flex gap-2 pt-4 border-t border-black">
            <button onClick={() => confirmAction('approve additional supervision slots for Dr. Fatima')} className="flex-1 py-2.5 bg-white hover:bg-white text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md border-0"><Check className="w-4 h-4" /> Approve</button>
            <button onClick={() => confirmAction('reject request')} className="px-5 py-2.5 bg-white hover:bg-white text-black rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border-0"><X className="w-4 h-4" /> Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
}