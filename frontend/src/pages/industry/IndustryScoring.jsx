import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAssignedProjects, submitScorecard } from '../../services/industry.service';
import { showToast as toast } from '../../components/AppToast';

export default function IndustryScoring() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('groupId');

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [scoringLocked, setScoringLocked] = useState(false);
  const [scores, setScores] = useState({ relevance: 30, innovation: 32, presentation: 28 });
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (groupId) {
      getAssignedProjects().then(projects => {
        const group = projects.find(p => p.groupId === groupId);
        if (group) setSelectedGroup(group);
      });
    }
  }, [groupId]);

  const totalScore = scores.relevance + scores.innovation + scores.presentation;

  const handleScorecardSubmit = async (e) => {
    e.preventDefault();
    if (!remarks.trim()) { toast.error('Please enter your evaluation remarks.'); return; }
    const payload = {
      groupId: selectedGroup?.groupId,
      scores: [
        { criterion: 'Industrial Relevance & Practicality', weight: 35, score: scores.relevance },
        { criterion: 'Innovation & Technical Depth',        weight: 35, score: scores.innovation },
        { criterion: 'Presentation & Defense Quality',      weight: 30, score: scores.presentation },
      ],
      remarks,
    };
    await submitScorecard(payload);
    setScoringLocked(true);
    toast.success('Scorecard locked and submitted successfully!');
    setTimeout(() => navigate('/industry-dashboard'), 1500);
  };

  if (!selectedGroup) return <div className="p-8 text-center text-gray-500 font-bold">Please select a project from the Dashboard first.</div>;

  return (
    <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">External Evaluation Rubric Scoring</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Input scores against HEC/CUI external evaluation criteria. Final submission locks the scorecard permanently.</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-100 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-black text-gray-900 text-lg">Group {selectedGroup.groupId}: {selectedGroup.title}</span>
              <span className="bg-amber-50 text-amber-700 font-bold text-xs px-3 py-1 rounded-xl border border-amber-200 shadow-sm">External Evaluation</span>
            </div>
            <p className="text-xs text-gray-500 font-bold">Internal Supervisor: {selectedGroup.internalSupervisor} · {selectedGroup.members} Students</p>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-200">
            <span className="text-xs font-bold text-gray-500">Evaluation Rubric:</span>
            <span className="text-xs font-black" style={{ color: '#2B3990' }}>HEC External Evaluation Rubric v2.0</span>
          </div>
        </div>

        {scoringLocked ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
            <i className="fas fa-check-circle text-emerald-600 text-3xl mb-3"></i>
            <h3 className="font-black text-gray-900 mb-1">Scorecard Submitted Successfully</h3>
            <p className="text-xs text-gray-600">This evaluation has been locked and cannot be modified. Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleScorecardSubmit} className="space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">External Criteria Scorecard Input</span>
              {[
                { key: 'relevance',     label: 'Industrial Relevance & Practicality', max: 35 },
                { key: 'innovation',    label: 'Innovation & Technical Depth',        max: 35 },
                { key: 'presentation',  label: 'Presentation & Defense Quality',      max: 30 },
              ].map(c => (
                <div key={c.key} className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 bg-gray-50 rounded-2xl border border-gray-200 items-center">
                  <div>
                    <span className="block font-black text-gray-800 text-xs mb-1">{c.label}</span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Weight: {c.max}%</span>
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-4">
                    <input
                      type="range" min="0" max={c.max}
                      value={scores[c.key]}
                      onChange={e => setScores(prev => ({ ...prev, [c.key]: +e.target.value }))}
                      className="w-full cursor-pointer accent-blue-600"
                    />
                    <span className="font-black text-gray-800 text-sm w-16 text-right whitespace-nowrap">{scores[c.key]} / {c.max}</span>
                  </div>
                </div>
              ))}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                <span className="text-sm font-black text-gray-800">Total Score</span>
                <span className="text-2xl font-black" style={{ color: '#2B3990' }}>{totalScore} / 100</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">External Evaluator Remarks & Industrial Feedback</label>
              <textarea
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Provide detailed industrial feedback regarding the commercial viability and technical implementation of the project..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all h-28 resize-none"
                required
              />
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <i className="fas fa-lock text-amber-600 text-xl mt-0.5"></i>
              <div className="text-xs">
                <span className="block font-black text-gray-900 mb-1">Submission Lock Warning</span>
                <p className="text-gray-600 leading-relaxed">Submitting this scorecard will lock your external evaluation permanently. No subsequent modifications will be permitted without HOD executive override.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center gap-3">
              <button type="button" onClick={() => navigate('/industry-dashboard')} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                ← Back to Projects
              </button>
              <button type="submit" className="text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer flex items-center gap-2" style={{ backgroundColor: '#2563EB' }}>
                <i className="fas fa-check-double"></i> Confirm & Lock Submission
              </button>
            </div>
          </form>
        )}
      </div>
      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
