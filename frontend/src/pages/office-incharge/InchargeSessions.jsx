import React, { useEffect, useState } from 'react';
import { getInchargeSessions } from '../../services/office-incharge.service';
import { showToast, showAlert } from '../../components/AppToast';
import { Lock, Shield } from 'lucide-react';

const InchargeSessions = () => {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInchargeSessions()
      .then(res => setSessionData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
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
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Academic Session Management & Repeat Registrations</h2>
        <p className="text-xs text-slate-900 mt-0.5 font-medium">Configure session timelines, lock active session structures, and manage FYP-1 repeat enrollments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Session Creation Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-line shadow-sm p-6">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-line">
            <h3 className="text-base font-bold text-slate-900">Configure Academic Session</h3>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-line">
              <Lock className="text-slate-900 text-xs" />
              <span className="text-xs font-bold text-slate-900">Active Session Locked</span>
            </div>
          </div>

          <form onSubmit={handleSessionSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="block text-xs font-bold text-slate-900 mb-1.5">Session Name</label><input type="text" defaultValue={sessionData?.sessionName || "Spring 2026 (SP26)"} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500" required /></div>
              <div><label className="block text-xs font-bold text-slate-900 mb-1.5">Session Duration</label><input type="text" defaultValue={sessionData?.duration || "Feb 01, 2026 – Jul 15, 2026"} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500" required /></div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-900 tracking-wider block mb-2">Milestone Deadlines</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><label className="block text-[10px] font-bold text-slate-900 mb-1">Proposal Submission</label><input type="date" defaultValue="2026-03-01" className="w-full bg-white border border-line rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer" required /></div>
                <div><label className="block text-[10px] font-bold text-slate-900 mb-1">Mid-Term Defense (30%)</label><input type="date" defaultValue="2026-05-18" className="w-full bg-white border border-line rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer" required /></div>
                <div><label className="block text-[10px] font-bold text-slate-900 mb-1">Final Defense (100%)</label><input type="date" defaultValue="2026-07-05" className="w-full bg-white border border-line rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer" required /></div>
              </div>
            </div>

            <div className="pt-4 border-t border-line flex justify-end">
              <button type="submit" className="bg-white hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer">Save Session Configuration</button>
            </div>
          </form>

          {/* FYP-1 Repeat Management Table */}
          <div className="mt-10 pt-6 border-t border-line">
            <h3 className="text-base font-bold text-slate-900 mb-4">FYP-1 Repeat Management</h3>
            <div className="overflow-x-auto border border-line rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-[11px] font-bold text-slate-900 tracking-wider border-b border-line">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Reg Number</th>
                    <th className="py-3 px-4">Previous Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-900">
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          {Array.from({ length: 4 }).map((_, j) => (
                            <td key={j} className="py-3 px-4"><div className="h-4 rounded-md skeleton w-24" /></td>
                          ))}
                        </tr>
                      ))
                    : sessionData?.repeats?.map((r, idx) => (
                        <tr key={idx} className="hover:bg-white/50">
                          <td className="py-3 px-4 font-bold text-slate-900">{r.name}</td>
                          <td className="py-3 px-4 text-slate-900 font-mono">{r.regNo}</td>
                          <td className="py-3 px-4"><span className="bg-white text-slate-900 px-2 py-0.5 rounded-lg border border-line">{r.status}</span></td>
                          <td className="py-3 px-4 text-right space-x-1">
                            <button onClick={handleClear} className="px-2.5 py-1 rounded-lg bg-white text-slate-900 hover:bg-white border border-line transition-all cursor-pointer">Clear</button>
                            <button onClick={handleEnroll} className="px-2.5 py-1 rounded-lg bg-white text-slate-900 hover:bg-white border border-line transition-all cursor-pointer">Enroll</button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Active Session Details */}
        {loading ? (
          <div className="skeleton h-44 w-full rounded-2xl" />
        ) : (
          <div className="bg-white rounded-2xl border border-line shadow-sm p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-line">Session Integrity Lock</h3>
            <div className="p-4 rounded-2xl bg-white/50 border border-line flex items-start gap-3">
              <Shield className="text-slate-900 text-xl mt-0.5" />
              <div className="text-xs">
                <span className="block font-bold text-slate-900 mb-1">Padlock Protection Active</span>
                <p className="text-slate-900 leading-relaxed">Major structural changes (such as altering rubric criteria weights or deleting active student records) are locked during an ongoing semester to ensure academic compliance.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InchargeSessions;
