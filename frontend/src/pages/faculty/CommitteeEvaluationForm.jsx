import React, { useEffect, useState } from 'react';
import { getFacultyEvaluations } from '../../services/faculty.service';
import { getFacultyEvaluationCriteria, submitScorecard, getEvaluationData } from '../../services/evaluationService';
import { showToast } from '../../components/AppToast';
import { ClipboardList, Star, ChevronDown, ChevronRight, Lock, Loader2, AlertTriangle } from 'lucide-react';

const CommitteeEvaluationForm = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expandedComm, setExpandedComm] = useState(null);
  const [selectedEval, setSelectedEval] = useState(null);
  const [scores, setScores] = useState({});
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    Promise.all([
      getFacultyEvaluations(),
      getFacultyEvaluationCriteria(),
    ]).then(([evalRes, critRes]) => {
      setEvaluations(evalRes.data || []);
      setCriteria(Array.isArray(critRes.data) ? critRes.data : (critRes.data?.data || []));
    }).catch(() => {
      showToast.error('Failed to load evaluation data.');
    }).finally(() => setLoading(false));
  }, []);

  const openEvaluation = async (evalRecord) => {
    setSelectedEval(evalRecord);
    setScores({});
    setRemarks('');
    try {
      const res = await getEvaluationData(evalRecord.groupId || evalRecord.id);
      const data = res.data || {};
      if (data.scores) {
        const initialScores = {};
        data.scores.forEach(s => { initialScores[s.criterion] = s.score ?? ''; });
        setScores(initialScores);
      }
      if (data.remarks) setRemarks(data.remarks);
    } catch {
      // No pre-existing data
    }
  };

  const closeEvaluation = () => {
    setSelectedEval(null);
    setScores({});
    setRemarks('');
  };

  const handleScoreChange = (criterionName, value) => {
    setScores(prev => ({ ...prev, [criterionName]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEval) return;

    const scoresArray = criteria.map(c => ({
      criterion: c.title || c.name,
      weight: Number(c.weightage || c.weight || 0),
      score: Number(scores[c.title || c.name]) || 0,
    }));

    setSubmitting(true);
    try {
      await submitScorecard({
        groupId: selectedEval.groupId || selectedEval.id,
        scores: scoresArray,
        remarks: remarks.trim() || undefined,
      });
      showToast.success('Evaluation submitted successfully.');
      closeEvaluation();
      const evalRes = await getFacultyEvaluations();
      setEvaluations(evalRes.data || []);
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to submit evaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  const committees = React.useMemo(() => {
    const map = new Map();
    evaluations.forEach(e => {
      if (!map.has(e.committee)) {
        map.set(e.committee, { name: e.committee, evaluations: [] });
      }
      map.get(e.committee).evaluations.push(e);
    });
    return Array.from(map.values());
  }, [evaluations]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4 mb-6">
          <div className="skeleton h-7 w-48 rounded-md" />
          <div className="skeleton h-4 w-96 rounded-md mt-2" />
        </div>
        <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-line">
                  {Array.from({ length: 5 }, (_, i) => (
                    <th key={i} className="py-3.5 px-6"><div className="skeleton h-4 rounded-md" style={{ width: i === 0 ? '100px' : '80px' }} /></th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {Array.from({ length: 8 }, (_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 5 }, (_, j) => (
                      <td key={j} className="py-4 px-6"><div className="skeleton h-4 rounded-md" style={{ width: j === 0 ? '120px' : '80px' }} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Committee Evaluation Form</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Evaluate assigned groups using the configured criteria. Weightage is shown for reference.</p>
      </div>

      {committees.length > 0 && (
        <div className="space-y-4">
          {committees.map(comm => {
            const total = comm.evaluations.length;
            const pending = comm.evaluations.filter(e => e.status === 'Pending').length;
            const completed = total - pending;
            const isExpanded = expandedComm === comm.name;
            return (
              <div key={comm.name} className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
                <button
                  onClick={() => setExpandedComm(isExpanded ? null : comm.name)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer border-0 bg-transparent text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                      <Star size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{comm.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                        {pending} pending · {completed} completed
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {total} eval{total > 1 ? 's' : ''}
                    </span>
                    {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                  </div>
                </button>
                {isExpanded && (
                  <div className="border-t border-line divide-y divide-line">
                    {comm.evaluations.map(e => (
                      <div key={e.id} className="flex items-center justify-between px-5 py-3 hover:bg-blue-50/30 transition-colors">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-900">{e.student}</span>
                            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{e.type}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono font-semibold mt-0.5">{e.id}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${e.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            {e.status}
                          </span>
                          {e.status === 'Pending' ? (
                            <button onClick={() => openEvaluation(e)} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-[10px] hover:bg-blue-700 transition-all cursor-pointer shadow-sm border-0 whitespace-nowrap">Evaluate</button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-semibold italic px-2">
                              <Lock size={10} /> Submitted
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {evaluations.length === 0 && (
        <div className="bg-white rounded-2xl border border-line shadow-sm p-12 text-center">
          <ClipboardList size={40} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-700 mb-1">No Evaluations Assigned</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You have no pending evaluations. Check back when committees are assigned.
          </p>
        </div>
      )}

      {selectedEval && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-xl border border-line my-8">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-line">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Evaluation Form</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{selectedEval.student} - {selectedEval.type}</p>
              </div>
              <button onClick={closeEvaluation} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList size={14} className="text-blue-600" />
                  <span className="text-xs font-bold text-slate-700">Scoring Criteria</span>
                </div>
                <div className="space-y-3">
                  {criteria.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No criteria configured. Contact the FYP Office.</p>
                  ) : (
                    criteria.map((c, idx) => {
                      const criterionName = c.title || c.name;
                      const weightage = c.weightage || c.weight || 0;
                      const maxMarks = c.maxMarks || 100;
                      return (
                        <div key={idx} className="p-4 rounded-xl border border-line bg-white">
                          <div className="flex items-start justify-between mb-2">
                            <div className="min-w-0 flex-1">
                              <label className="text-sm font-semibold text-slate-900">{criterionName}</label>
                              {c.description && <p className="text-[10px] text-slate-400 mt-0.5">{c.description}</p>}
                            </div>
                            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">Wt: {weightage}%</span>
                              <span className="text-[10px] font-bold text-slate-400">/ {maxMarks}</span>
                            </div>
                          </div>
                          <input
                            type="number"
                            value={scores[criterionName] ?? ''}
                            onChange={e => handleScoreChange(criterionName, e.target.value)}
                            placeholder={`Enter marks (0-${maxMarks})`}
                            min="0"
                            max={maxMarks}
                            className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                            required
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="Optional comments on the group's performance..."
                  className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all h-20 resize-none"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800 text-sm font-medium">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <p>Scores cannot be modified once submitted. They will be locked and sent to the Committee Head for consolidation.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button type="button" onClick={closeEvaluation} className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">Cancel</button>
                <button type="submit" disabled={submitting || criteria.length === 0} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {submitting ? 'Submitting...' : 'Submit & Lock Scores'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitteeEvaluationForm;
