import React from 'react';
import { showToast } from '../../components/AppToast';
import { Bot, CalendarCheck } from 'lucide-react';

const AssistantProposalCommittees = () => {
  const handleCommitteeSubmit = (e) => {
    e.preventDefault();
    showToast.success('Committee created successfully!');
  };

  const handleAssign = () => showToast.success('Proposal assigned successfully!');
  const handlePublish = () => showToast.success('Meeting schedule published to faculty and students!');

  return (
    <>
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">Proposal Evaluation Committee Management</h2>
        <p className="text-xs text-black mt-0.5 font-medium">Create evaluation boards, leverage AI-assisted faculty matching, assign pending proposals, and publish schedules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-black shadow-sm p-6">
          <h3 className="text-base font-black text-black mb-6 pb-3 border-b border-black">Create Proposal Committee</h3>
          <form onSubmit={handleCommitteeSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Committee Name</label>
                <input type="text" placeholder="e.g. PEC-1 (AI & Vision)" className="w-full bg-white border border-black rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black focus:bg-white transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Research Area / Track</label>
                <input type="text" placeholder="e.g. Artificial Intelligence" className="w-full bg-white border border-black rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black focus:bg-white transition-all" required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Assign Committee Head</label>
                <select className="w-full bg-white border border-black rounded-xl px-4 py-2.5 text-sm font-bold text-black outline-none focus:border-black cursor-pointer" required>
                  <option value="">Select Head...</option>
                  <option value="Dr. Ali Hassan">Dr. Ali Hassan (AI & Vision)</option>
                  <option value="Dr. Sara Malik">Dr. Sara Malik (Software Eng)</option>
                  <option value="Dr. Fatima Khan">Dr. Fatima Khan (IoT & Cyber)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Assign Members (Multi-select)</label>
                <select multiple className="w-full bg-white border border-black rounded-xl px-4 py-2 text-sm font-bold text-black outline-none focus:border-black cursor-pointer h-24" required>
                  <option value="Dr. Ali Hassan">Dr. Ali Hassan</option>
                  <option value="Dr. Sara Malik">Dr. Sara Malik</option>
                  <option value="Dr. Fatima Khan">Dr. Fatima Khan</option>
                  <option value="Dr. Usman Qureshi">Dr. Usman Qureshi</option>
                </select>
                <p className="text-[10px] text-black mt-1 font-bold">Hold Ctrl/Cmd to select multiple members</p>
              </div>
            </div>
            <div className="pt-4 border-t border-black flex justify-end">
              <button type="submit" className="bg-white hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer">
                Create Committee
              </button>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-black">
            <h3 className="text-base font-black text-black mb-4">Assign Pending Proposals & Publish Schedule</h3>
            <div className="bg-white rounded-2xl p-5 border border-black space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="w-full sm:w-1/2">
                  <label className="block text-xs font-bold text-black mb-1">Select Proposal</label>
                  <select className="w-full bg-white border border-black rounded-xl px-4 py-2 text-sm font-bold text-black outline-none focus:border-black cursor-pointer">
                    <option>Smart Energy Management Using IoT (G-005)</option>
                    <option>Blockchain Voting System (G-012)</option>
                  </select>
                </div>
                <div className="w-full sm:w-1/2">
                  <label className="block text-xs font-bold text-black mb-1">Target Committee</label>
                  <select className="w-full bg-white border border-black rounded-xl px-4 py-2 text-sm font-bold text-black outline-none focus:border-black cursor-pointer">
                    <option>PEC-1 (AI & Vision)</option>
                    <option>PEC-2 (IoT & Cyber)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={handleAssign} className="bg-blue-600 hover:bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer">Assign Proposal</button>
                <button onClick={handlePublish} className="bg-white hover:bg-white text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2"><CalendarCheck className="w-4 h-4" /> Publish Schedule</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-black">
            <Bot className="text-black text-lg" />
            <h3 className="text-sm font-black text-black">AI Faculty Matcher</h3>
          </div>
          <p className="text-xs text-black mb-6 font-medium leading-relaxed">The system automatically analyzes faculty research interests and teaching schedules to recommend optimal committee placements.</p>
          
          <div className="space-y-4 divide-y divide-blue-600">
            <div className="pt-2">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-black text-black text-xs">Dr. Ali Hassan</span>
                <span className="text-[10px] font-bold text-black bg-white px-2 py-0.5 rounded">Highly Recommended</span>
              </div>
              <p className="text-[11px] text-black font-medium mb-2">Track: AI, Machine Learning, Computer Vision</p>
              <div className="flex justify-between items-center text-[10px] bg-white p-2 rounded-lg">
                <span className="text-black font-bold">Availability:</span>
                <span className="font-bold text-black">Mon–Wed Mornings</span>
              </div>
            </div>
            <div className="pt-4">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-black text-black text-xs">Dr. Fatima Khan</span>
                <span className="text-[10px] font-bold text-black bg-white px-2 py-0.5 rounded">Available</span>
              </div>
              <p className="text-[11px] text-black font-medium mb-2">Track: IoT Systems, Cybersecurity</p>
              <div className="flex justify-between items-center text-[10px] bg-white p-2 rounded-lg">
                <span className="text-black font-bold">Availability:</span>
                <span className="font-bold text-black">Mon & Wed Afternoons</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssistantProposalCommittees;
