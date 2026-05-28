import React from 'react';
import { AlertCircle, ArrowUpToLine, Clock, Mail, Paperclip, RefreshCw, X } from 'lucide-react';

export default function Grievances() {
  const confirmAction = (actionName) => {
    if (window.confirm(`Are you sure you want to ${actionName}?`)) {
      alert(`Action completed: ${actionName}`);
    }
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">Grievance Management & SLA Monitoring</h2>
        <p className="text-xs text-black mt-0.5 font-medium">Review student disputes, monitor strict SLA deadlines (3-day acknowledgment, 14-day resolution), and escalate critical issues</p>
      </div>

      <div className="space-y-6">
        {/* Grievance Card 1 */}
        <div className="bg-white rounded-2xl border border-black shadow-sm p-6 hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-white"></div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-black gap-4 pl-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-black text-black text-base">Ahmed Farooq (SP21-BCS-001)</span>
                <span className="bg-white text-black font-bold text-xs px-2.5 py-1 rounded-lg border border-black"><AlertCircle className="w-4 h-4 mr-1" /> SLA Breach (15 Days)</span>
              </div>
              <p className="text-xs text-black font-bold">Category: Evaluation Dispute | Filed: May 02, 2026</p>
            </div>
            <span className="bg-white text-black font-bold text-xs px-3 py-1.5 rounded-xl border border-black shadow-sm">Under Investigation</span>
          </div>

          <div className="pl-4 space-y-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-black"><span className="font-bold text-black block mb-1">Grievance Description:</span><p className="text-black leading-relaxed">"Our group was awarded 8.5/10 in the 10% milestone evaluation, but the committee rubric scorecard contained a calculation error in the CLO-2 summation."</p></div>
            <div className="flex items-center gap-2"><Paperclip className="text-black" /><span className="font-bold text-black">Attached Evidence:</span><span className="text-black hover:underline font-bold cursor-pointer">rubric_scorecard_error.pdf (1.2 MB)</span></div>
            
            <div className="flex flex-wrap gap-2 pt-4 border-t border-black justify-end">
              <button onClick={() => confirmAction('request formal committee re-evaluation')} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-600 text-white rounded-xl font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2 border-0"><RefreshCw className="w-4 h-4" /> Request Re-evaluation</button>
              <button onClick={() => confirmAction('escalate grievance to HOD')} className="px-4 py-2.5 bg-white hover:bg-white text-white rounded-xl font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2 border-0"><ArrowUpToLine className="w-4 h-4" /> Escalate to HOD</button>
              <button onClick={() => confirmAction('dismiss grievance')} className="px-4 py-2.5 bg-white hover:bg-white text-black rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 border-0"><X className="w-4 h-4" /> Dismiss</button>
            </div>
          </div>
        </div>

        {/* Grievance Card 2 */}
        <div className="bg-white rounded-2xl border border-black shadow-sm p-6 hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-white"></div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-black gap-4 pl-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-black text-black text-base">Aima Khalid (SP21-BCS-019)</span>
                <span className="bg-white text-black font-bold text-xs px-2.5 py-1 rounded-lg border border-black"><Clock className="w-4 h-4 mr-1" /> SLA Warning (2 Days Left)</span>
              </div>
              <p className="text-xs text-black font-bold">Category: Supervision Dispute | Filed: May 15, 2026</p>
            </div>
            <span className="bg-white text-black font-bold text-xs px-3 py-1.5 rounded-xl border border-black shadow-sm">New Filing</span>
          </div>

          <div className="pl-4 space-y-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-black"><span className="font-bold text-black block mb-1">Grievance Description:</span><p className="text-black leading-relaxed">"Our assigned supervisor has not responded to our weekly meeting logs or draft submissions for the past 3 consecutive weeks."</p></div>
            
            <div className="flex flex-wrap gap-2 pt-4 border-t border-black justify-end">
              <button onClick={() => confirmAction('request formal supervisor review')} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-600 text-white rounded-xl font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2 border-0"><Mail className="w-4 h-4" /> Inquire Supervisor</button>
              <button onClick={() => confirmAction('escalate grievance to HOD')} className="px-4 py-2.5 bg-white hover:bg-white text-white rounded-xl font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2 border-0"><ArrowUpToLine className="w-4 h-4" /> Escalate to HOD</button>
              <button onClick={() => confirmAction('dismiss grievance')} className="px-4 py-2.5 bg-white hover:bg-white text-black rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 border-0"><X className="w-4 h-4" /> Dismiss</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
