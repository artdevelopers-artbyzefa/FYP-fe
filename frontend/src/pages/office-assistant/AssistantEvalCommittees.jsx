import React, { useState } from 'react';
import { showToast } from '../../components/AppToast';

const AssistantEvalCommittees = () => {
  const [activeBoard, setActiveBoard] = useState('fyp1');

  const handleCommitteeSubmit = (e) => {
    e.preventDefault();
    showToast.success('Committee configuration saved successfully!');
  };

  return (
    <>
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">FYP Evaluation Committee Management</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Configure FYP-1 & FYP-2 boards, enforce 50% rotation rules, monitor workload counters, and manage milestone locks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-50">
            <h3 className="text-base font-black text-gray-800">Configure Evaluation Board</h3>
            <div className="flex gap-2">
              <button onClick={() => setActiveBoard('fyp1')} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeBoard === 'fyp1' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>FYP-1 Board</button>
              <button onClick={() => setActiveBoard('fyp2')} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeBoard === 'fyp2' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>FYP-2 Board</button>
            </div>
          </div>

          <form onSubmit={handleCommitteeSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Committee Name</label>
                <input type="text" placeholder="e.g. FEC-FYP1-A" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-secondary focus:bg-white transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Milestone Window</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 outline-none focus:border-secondary cursor-pointer" required>
                  <option value="10">10% Milestone</option>
                  <option value="30">30% Milestone</option>
                  <option value="60">60% Milestone</option>
                  <option value="100">100% Final Defense</option>
                  <option value="External">External Evaluation</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                  <span>Assign Committee Head</span>
                  <i className="fas fa-info-circle text-secondary"></i>
                </label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 outline-none focus:border-secondary cursor-pointer" required>
                  <option value="Dr. Ali Hassan">Dr. Ali Hassan</option>
                  <option value="Dr. Sara Malik">Dr. Sara Malik</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Assign Members (Max 50% change for FYP-2)</label>
                <select multiple className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-800 outline-none focus:border-secondary cursor-pointer h-24" required defaultValue={['Dr. Ali Hassan', 'Dr. Sara Malik']}>
                  <option value="Dr. Ali Hassan">Dr. Ali Hassan (Workload: 4)</option>
                  <option value="Dr. Sara Malik">Dr. Sara Malik (Workload: 3)</option>
                  <option value="Dr. Fatima Khan">Dr. Fatima Khan (Workload: 1)</option>
                  <option value="Dr. Usman Qureshi">Dr. Usman Qureshi (Workload: 0)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-end">
              <button type="submit" className="bg-secondary hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all cursor-pointer">
                Save Committee Configuration
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h3 className="text-base font-black text-gray-800 pb-3 border-b border-gray-50">Active Boards & Locking</h3>
          
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
            <div>
              <div className="font-black text-gray-900 text-sm mb-0.5 flex items-center gap-2">
                <span>FEC-FYP1-A</span>
                <i className="fas fa-lock text-gray-400 text-xs" title="Locked after evaluations began"></i>
              </div>
              <div className="text-xs text-gray-500 font-medium">Head: Dr. Ali Hassan</div>
            </div>
            <span className="bg-gray-200 text-gray-700 font-bold text-[10px] px-2.5 py-1 rounded-lg border border-gray-300">Locked</span>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
            <div>
              <div className="font-black text-gray-900 text-sm mb-0.5 flex items-center gap-2">
                <span>FEC-FYP2-B</span>
                <i className="fas fa-lock-open text-success text-xs" title="Unlocked. Evaluations have not reached the 10% threshold."></i>
              </div>
              <div className="text-xs text-gray-500 font-medium">Head: Dr. Sara Malik</div>
            </div>
            <span className="bg-success/10 text-success font-bold text-[10px] px-2.5 py-1 rounded-lg border border-success/20">Active</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssistantEvalCommittees;
