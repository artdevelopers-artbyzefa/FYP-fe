import React, { useEffect, useState } from 'react';
import { getInchargeSessions } from '../../services/office-incharge.service';
import { showToast, showAlert } from '../../components/AppToast';

const InchargeSessions = () => {
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    getInchargeSessions().then(res => setSessionData(res.data)).catch(console.error);
  }, []);

  const handleSessionSubmit = (e) => {
    e.preventDefault();
    showToast.success('Session configuration saved successfully.');
  };

  const handleClear = () => {
    showAlert.confirm('Clear Student', 'Clear student for re-registration?').then(res => {
      if (res.isConfirmed) showToast.success('Student cleared for re-registration!');
    });
  };

  const handleEnroll = () => {
    showToast.success('Student enrolled in new group G-088!');
  };

  return (
    <>
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">Academic Session Management & Repeat Registrations</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Configure session timelines, lock active session structures, and manage FYP-1 repeat enrollments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Session Creation Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-50">
            <h3 className="text-base font-black text-gray-800">Configure Academic Session</h3>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
              <i className="fas fa-lock text-gray-600 text-xs"></i>
              <span className="text-xs font-bold text-gray-700">Active Session Locked</span>
            </div>
          </div>

          <form onSubmit={handleSessionSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="block text-xs font-bold text-gray-700 mb-1.5">Session Name</label><input type="text" defaultValue={sessionData?.sessionName || "Spring 2026 (SP26)"} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 outline-none focus:border-secondary" required /></div>
              <div><label className="block text-xs font-bold text-gray-700 mb-1.5">Session Duration</label><input type="text" defaultValue={sessionData?.duration || "Feb 01, 2026 – Jul 15, 2026"} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 outline-none focus:border-secondary" required /></div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Milestone Deadlines</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Proposal Submission</label><input type="date" defaultValue="2026-03-01" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-secondary cursor-pointer" required /></div>
                <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Mid-Term Defense (30%)</label><input type="date" defaultValue="2026-05-18" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-secondary cursor-pointer" required /></div>
                <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Final Defense (100%)</label><input type="date" defaultValue="2026-07-05" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-secondary cursor-pointer" required /></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-end">
              <button type="submit" className="bg-secondary hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all cursor-pointer">Save Session Configuration</button>
            </div>
          </form>

          {/* FYP-1 Repeat Management Table */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <h3 className="text-base font-black text-gray-800 mb-4">FYP-1 Repeat Management</h3>
            <div className="overflow-x-auto border border-gray-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-black text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Reg Number</th>
                    <th className="py-3 px-4">Previous Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-bold text-gray-700">
                  {sessionData?.repeats?.map((r, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-black text-gray-900">{r.name}</td>
                      <td className="py-3 px-4 text-gray-500 font-mono">{r.regNo}</td>
                      <td className="py-3 px-4"><span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-lg border border-red-100">{r.status}</span></td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button onClick={handleClear} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer">Clear</button>
                        <button onClick={handleEnroll} className="px-2.5 py-1 rounded-lg bg-blue-50 text-secondary hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer">Enroll</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Active Session Details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h3 className="text-base font-black text-gray-800 pb-3 border-b border-gray-50">Session Integrity Lock</h3>
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
            <i className="fas fa-shield-alt text-secondary text-xl mt-0.5"></i>
            <div className="text-xs">
              <span className="block font-black text-gray-900 mb-1">Padlock Protection Active</span>
              <p className="text-gray-600 leading-relaxed">Major structural changes (such as altering rubric criteria weights or deleting active student records) are locked during an ongoing semester to ensure academic compliance.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InchargeSessions;
