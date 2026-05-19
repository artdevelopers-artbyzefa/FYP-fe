import React, { useState } from 'react';

export default function RubricBuilder() {
  const [rubricType, setRubricType] = useState('proposal');

  const [criteria, setCriteria] = useState([
    { id: 1, title: 'Problem Statement & Relevance', clo: 'CLO-1 (Problem Identification)', weight: 30 },
    { id: 2, title: 'Literature Review & Methodology', clo: 'CLO-2 (Design & Methodology)', weight: 40 },
    { id: 3, title: 'Expected Outcomes & Deliverables', clo: 'CLO-3 (Modern Tool Usage)', weight: 30 }
  ]);

  const totalWeight = criteria.reduce((sum, item) => sum + Number(item.weight || 0), 0);
  const isValid = totalWeight === 100;

  const addCriterion = () => {
    setCriteria([...criteria, { id: Date.now(), title: '', clo: '', weight: 0 }]);
  };

  const updateCriterion = (id, field, value) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleRubricSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      alert('Rubric saved successfully!');
    } else {
      alert('Total weight must equal 100%.');
    }
  };

  return (
    <div className="animate-[fadeIn_0.4s_ease-out]">
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
              <button 
                onClick={() => setRubricType('proposal')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${rubricType === 'proposal' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Proposal Rubric
              </button>
              <button 
                onClick={() => setRubricType('fyp')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${rubricType === 'fyp' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                FYP Evaluation Rubric
              </button>
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
                <button type="button" onClick={addCriterion} className="text-xs font-bold text-secondary hover:underline cursor-pointer">
                  <i className="fas fa-plus mr-1"></i> Add Criterion
                </button>
              </div>
              
              {criteria.map((c, index) => (
                <div key={c.id} className="grid grid-cols-12 gap-3 items-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="col-span-6">
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Criterion Title</label>
                    <input type="text" value={c.title} onChange={(e) => updateCriterion(c.id, 'title', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-secondary" required />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Mapped CLO</label>
                    <input type="text" value={c.clo} onChange={(e) => updateCriterion(c.id, 'clo', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-secondary" required />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">Weight (%)</label>
                    <input type="number" value={c.weight} onChange={(e) => updateCriterion(c.id, 'weight', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-secondary" min="1" max="100" required />
                  </div>
                </div>
              ))}
            </div>

            {/* 100% Validation Box */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-600">Total Accumulation Weight:</span>
              <div className="flex items-center gap-3">
                <span className={`text-xl font-black ${isValid ? 'text-success' : 'text-danger'}`}>{totalWeight}%</span>
                {isValid ? (
                  <span className="bg-success/10 text-success font-bold text-xs px-3 py-1 rounded-lg border border-success/20">Valid Schema</span>
                ) : (
                  <span className="bg-red-50 text-danger font-bold text-xs px-3 py-1 rounded-lg border border-red-200">Invalid Weight</span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-end">
              <button type="submit" disabled={!isValid} className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer ${isValid ? 'bg-secondary hover:bg-blue-700 text-white shadow-blue-600/20' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                Publish Rubric Schema
              </button>
            </div>
          </form>
        </div>

        {/* Read-only Version History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h3 className="text-base font-black text-gray-800 pb-3 border-b border-gray-50">Rubric Version History</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center text-xs">
              <div><span className="font-bold text-gray-800 block">Proposal Rubric v3.0</span><span className="text-[11px] text-gray-500">Published: Jan 10, 2026</span></div>
              <span className="bg-gray-200 text-gray-600 font-bold text-[10px] px-2.5 py-1 rounded-lg">Archived</span>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center text-xs">
              <div><span className="font-bold text-gray-800 block">FYP Evaluation Rubric v2.1</span><span className="text-[11px] text-gray-500">Published: Sep 15, 2025</span></div>
              <span className="bg-gray-200 text-gray-600 font-bold text-[10px] px-2.5 py-1 rounded-lg">Archived</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}