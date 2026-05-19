import React from 'react';

export default function Grievances() {
  const confirmAction = (actionName) => {
    if (window.confirm(`Are you sure you want to ${actionName}?`)) {
      alert(`Action completed: ${actionName}`);
    }
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">Grievance Management & SLA Monitoring</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Review student disputes, monitor strict SLA deadlines (3-day acknowledgment, 14-day resolution), and escalate critical issues</p>
      </div>

      <div className="space-y-6">
        {/* Grievance Card 1 */}
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-red-600"></div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-50 gap-4 pl-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-black text-gray-900 text-base">Ahmed Farooq (SP21-BCS-001)</span>
                <span className="bg-red-50 text-red-600 font-bold text-xs px-2.5 py-1 rounded-lg border border-red-200"><i className="fas fa-exclamation-circle mr-1"></i> SLA Breach (15 Days)</span>
              </div>
              <p className="text-xs text-gray-500 font-bold">Category: Evaluation Dispute · Filed: May 02, 2026</p>
            </div>
            <span className="bg-amber-50 text-amber-600 font-bold text-xs px-3 py-1.5 rounded-xl border border-amber-200 shadow-sm">Under Investigation</span>
          </div>

          <div className="pl-4 space-y-4 text-xs">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100"><span className="font-bold text-gray-700 block mb-1">Grievance Description:</span><p className="text-gray-600 leading-relaxed">"Our group was awarded 8.5/10 in the 10% milestone evaluation, but the committee rubric scorecard contained a calculation error in the CLO-2 summation."</p></div>
            <div className="flex items-center gap-2"><i className="fas fa-paperclip text-secondary"></i><span className="font-bold text-gray-700">Attached Evidence:</span><span className="text-secondary hover:underline font-bold cursor-pointer">rubric_scorecard_error.pdf (1.2 MB)</span></div>
            
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50 justify-end">
              <button onClick={() => confirmAction('request formal committee re-evaluation')} className="px-4 py-2.5 bg-primary hover:bg-blue-900 text-white rounded-xl font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2 border-0"><i className="fas fa-sync-alt"></i> Request Re-evaluation</button>
              <button onClick={() => confirmAction('escalate grievance to HOD')} className="px-4 py-2.5 bg-warning hover:bg-amber-600 text-white rounded-xl font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2 border-0"><i className="fas fa-level-up-alt"></i> Escalate to HOD</button>
              <button onClick={() => confirmAction('dismiss grievance')} className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 border-0"><i className="fas fa-times"></i> Dismiss</button>
            </div>
          </div>
        </div>

        {/* Grievance Card 2 */}
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-50 gap-4 pl-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-black text-gray-900 text-base">Aima Khalid (SP21-BCS-019)</span>
                <span className="bg-amber-50 text-amber-600 font-bold text-xs px-2.5 py-1 rounded-lg border border-amber-200"><i className="fas fa-clock mr-1"></i> SLA Warning (2 Days Left)</span>
              </div>
              <p className="text-xs text-gray-500 font-bold">Category: Supervision Dispute · Filed: May 15, 2026</p>
            </div>
            <span className="bg-blue-50 text-secondary font-bold text-xs px-3 py-1.5 rounded-xl border border-blue-200 shadow-sm">New Filing</span>
          </div>

          <div className="pl-4 space-y-4 text-xs">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100"><span className="font-bold text-gray-700 block mb-1">Grievance Description:</span><p className="text-gray-600 leading-relaxed">"Our assigned supervisor has not responded to our weekly meeting logs or draft submissions for the past 3 consecutive weeks."</p></div>
            
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50 justify-end">
              <button onClick={() => confirmAction('request formal supervisor review')} className="px-4 py-2.5 bg-primary hover:bg-blue-900 text-white rounded-xl font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2 border-0"><i className="fas fa-envelope"></i> Inquire Supervisor</button>
              <button onClick={() => confirmAction('escalate grievance to HOD')} className="px-4 py-2.5 bg-warning hover:bg-amber-600 text-white rounded-xl font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2 border-0"><i className="fas fa-level-up-alt"></i> Escalate to HOD</button>
              <button onClick={() => confirmAction('dismiss grievance')} className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 border-0"><i className="fas fa-times"></i> Dismiss</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
