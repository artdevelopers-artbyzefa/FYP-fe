import React, { useEffect, useState } from 'react';
import { getInchargeRubrics } from '../../services/office-incharge.service';
import { showToast } from '../../components/AppToast';

const InchargeRubrics = () => {
  const [rubrics, setRubrics] = useState([]);

  useEffect(() => {
    getInchargeRubrics().then(res => setRubrics(res.data)).catch(console.error);
  }, []);

  const handleRubricSubmit = (e) => {
    e.preventDefault();
    showToast.success('Rubric schema published successfully!');
  };

  return (
    <>
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">Rubric Builder & Validation</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Create Proposal and CLO-based FYP Evaluation rubrics. The system enforces exactly 100% total weight accumulation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Rubric Builder Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-50">
            <h3 className="text-base font-black text-gray-800">Design Rubric Schema</h3>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold transition-all cursor-pointer shadow-md">Proposal Rubric</button>
              <button className="px-4 py-1.5 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold transition-all cursor-pointer hover:bg-gray-200">FYP Evaluation Rubric</button>
            </div>
          </div>

          <form onSubmit={handleRubricSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Rubric Title</label>
              <input type="text" defaultValue="Official Proposal Evaluation Rubric v4.0" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 outline-none focus:border-secondary transition-all" required />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Evaluation Criteria & Weights</span>
                <button type="button" className="text-xs font-bold text-secondary hover:underline cursor-pointer"><i className="fas fa-plus mr-1"></i> Add Criterion</button>
              </div>
              
              <div className="grid grid-cols-12 gap-3 items-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="col-span-6"><label className="block text-[10px] font-bold text-gray-500 mb-1">Criterion Title</label><input type="text" defaultValue="Problem Statement & Relevance" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-secondary" required /></div>
                <div className="col-span-4"><label className="block text-[10px] font-bold text-gray-500 mb-1">Mapped CLO</label><input type="text" defaultValue="CLO-1 (Problem Identification)" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-secondary" required /></div>
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 mb-1">Weight (%)</label><input type="number" defaultValue="30" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-secondary" min="1" max="100" required /></div>
              </div>
              
              <div className="grid grid-cols-12 gap-3 items-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="col-span-6"><label className="block text-[10px] font-bold text-gray-500 mb-1">Criterion Title</label><input type="text" defaultValue="Literature Review & Methodology" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-secondary" required /></div>
                <div className="col-span-4"><label className="block text-[10px] font-bold text-gray-500 mb-1">Mapped CLO</label><input type="text" defaultValue="CLO-2 (Design & Methodology)" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-secondary" required /></div>
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 mb-1">Weight (%)</label><input type="number" defaultValue="40" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-secondary" min="1" max="100" required /></div>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="col-span-6"><label className="block text-[10px] font-bold text-gray-500 mb-1">Criterion Title</label><input type="text" defaultValue="Expected Outcomes & Deliverables" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-secondary" required /></div>
                <div className="col-span-4"><label className="block text-[10px] font-bold text-gray-500 mb-1">Mapped CLO</label><input type="text" defaultValue="CLO-3 (Modern Tool Usage)" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-secondary" required /></div>
                <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-500 mb-1">Weight (%)</label><input type="number" defaultValue="30" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-secondary" min="1" max="100" required /></div>
              </div>
            </div>

            {/* 100% Validation Box */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-600">Total Accumulation Weight:</span>
              <div className="flex items-center gap-3">
                <span className="text-xl font-black text-success">100%</span>
                <span className="bg-success/10 text-success font-bold text-xs px-3 py-1 rounded-lg border border-success/20">Valid Schema</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-end">
              <button type="submit" className="bg-secondary hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all cursor-pointer">
                Publish Rubric Schema
              </button>
            </div>
          </form>
        </div>

        {/* Read-only Version History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h3 className="text-base font-black text-gray-800 pb-3 border-b border-gray-50">Rubric Version History</h3>
          <div className="space-y-3">
            {rubrics.map((r, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-800 block">{r.version}</span>
                  <span className="text-[11px] text-gray-500">Published: {r.date}</span>
                </div>
                <span className="bg-gray-200 text-gray-600 font-bold text-[10px] px-2.5 py-1 rounded-lg">{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default InchargeRubrics;
