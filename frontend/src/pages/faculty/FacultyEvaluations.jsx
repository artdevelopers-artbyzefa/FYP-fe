import React, { useEffect, useState } from 'react';
import { getFacultyEvaluations } from '../../services/faculty.service';
import { showToast } from '../../components/AppToast';

const FacultyEvaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [isScoreOpen, setIsScoreOpen] = useState(false);
  const [selectedEval, setSelectedEval] = useState(null);

  useEffect(() => {
    getFacultyEvaluations().then(res => setEvaluations(res.data)).catch(console.error);
  }, []);

  const openScoreModal = (evalRecord) => {
    setSelectedEval(evalRecord);
    setIsScoreOpen(true);
  };

  const handleScoreSubmit = (e) => {
    e.preventDefault();
    showToast.success('Locked rubric scorecard submitted successfully!');
    setIsScoreOpen(false);
  };

  return (
    <>
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">Committee Evaluations</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Input scores per CLO criteria for assigned defense presentations.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Evaluation Ref</th>
                <th className="py-3.5 px-6">Student</th>
                <th className="py-3.5 px-6">Committee</th>
                <th className="py-3.5 px-6">Defense Type</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
              {evaluations.map(e => (
                <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-500 font-mono text-xs font-bold">{e.id}</td>
                  <td className="py-4 px-6 font-bold text-gray-900">{e.student}</td>
                  <td className="py-4 px-6 text-gray-600">{e.committee}</td>
                  <td className="py-4 px-6 text-gray-600">{e.type}</td>
                  <td className="py-4 px-6">
                    <span className={`font-bold text-[10px] px-2.5 py-1 rounded-lg border ${e.status === 'Completed' ? 'bg-success/10 text-success border-success/20' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {e.status === 'Pending' ? (
                      <button onClick={() => openScoreModal(e)} className="px-3 py-1.5 rounded-lg bg-secondary text-white font-bold text-xs transition-all cursor-pointer shadow-sm hover:bg-blue-700">Input Scores</button>
                    ) : (
                      <span className="text-xs text-gray-400 font-bold italic"><i className="fas fa-lock mr-1"></i> Locked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isScoreOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-gray-100 my-8">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-50">
              <div>
                <h3 className="text-lg font-black text-gray-900">Scorecard Entry</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{selectedEval?.student} - {selectedEval?.type}</p>
              </div>
              <i className="fas fa-times text-gray-400 hover:text-gray-600 cursor-pointer text-lg" onClick={() => setIsScoreOpen(false)}></i>
            </div>
            <form onSubmit={handleScoreSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex justify-between">
                    <span>CLO-1: Requirements Engineering</span>
                    <span className="text-gray-400">/ 10</span>
                  </label>
                  <input type="number" max="10" min="0" placeholder="0-10" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-secondary focus:bg-white transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex justify-between">
                    <span>CLO-2: System Design</span>
                    <span className="text-gray-400">/ 10</span>
                  </label>
                  <input type="number" max="10" min="0" placeholder="0-10" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-secondary focus:bg-white transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex justify-between">
                    <span>CLO-3: Implementation</span>
                    <span className="text-gray-400">/ 20</span>
                  </label>
                  <input type="number" max="20" min="0" placeholder="0-20" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-secondary focus:bg-white transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex justify-between">
                    <span>CLO-4: Communication/Presentation</span>
                    <span className="text-gray-400">/ 10</span>
                  </label>
                  <input type="number" max="10" min="0" placeholder="0-10" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-secondary focus:bg-white transition-all" required />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">General Remarks (Optional)</label>
                <textarea placeholder="Any additional comments..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-secondary focus:bg-white transition-all h-20"></textarea>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800 text-sm font-medium">
                <i className="fas fa-exclamation-triangle mt-0.5"></i>
                <p>Scores cannot be modified once submitted. They will be locked and sent to the Committee Head for consolidation.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button type="button" onClick={() => setIsScoreOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-secondary hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer">Submit & Lock Scores</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FacultyEvaluations;
