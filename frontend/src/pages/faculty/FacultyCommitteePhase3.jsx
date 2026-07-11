import { useEffect, useState, useMemo, useCallback } from 'react';
import { getCommitteePhase3Evaluations, submitCommitteePhase3Evaluation } from '../../services/phase3.service';
import { getRubricByPhase } from '../../services/rubric.service';
import RubricEvaluationForm, { calcTotal, buildInitialValues, buildCriteriaScoresPayload } from '../../components/RubricEvaluationForm';
import { showToast } from '../../components/AppToast';
import { Users, Loader2, Star, ClipboardList, CheckCircle, Clock, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const FacultyCommitteePhase3 = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [rubric, setRubric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [formState, setFormState] = useState({});
  const [expandedComm, setExpandedComm] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCommitteePhase3Evaluations(),
      getRubricByPhase('phase3', 'committee')
    ])
      .then(([evRes, rubricRes]) => {
        setEvaluations(Array.isArray(evRes.data) ? evRes.data : []);
        setRubric(rubricRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const committees = useMemo(() => {
    const map = new Map();
    evaluations.forEach(e => {
      const key = e.committee || 'Unnamed Committee';
      if (!map.has(key)) map.set(key, { name: key, evaluations: [] });
      map.get(key).evaluations.push(e);
    });
    return Array.from(map.values());
  }, [evaluations]);

  const getForm = (id) => formState[id] || { values: {}, marks: 0, remarks: '', errors: {}, expanded: false };

  const setForm = (id, patch) =>
    setFormState(prev => ({ ...prev, [id]: { ...getForm(id), ...patch } }));

  const openForm = useCallback((ev) => {
    if (ev.status === 'Completed') return;
    const existing = getForm(ev.id);
    if (existing.expanded) {
      setForm(ev.id, { expanded: false });
      return;
    }
    const initial = buildInitialValues(rubric, ev.criteriaScores || []);
    setForm(ev.id, {
      expanded: true,
      values: initial,
      marks: calcTotal(initial, rubric),
      remarks: ev.remarks || '',
      errors: {}
    });
  }, [rubric]);

  const handleValuesChange = useCallback((id, newValues) => {
    setForm(id, {
      values: newValues,
      marks: calcTotal(newValues, rubric),
      errors: { ...getForm(id).errors, marks: null }
    });
  }, [rubric]);

  const handleRemarksChange = useCallback((id, val) => {
    setForm(id, { remarks: val, errors: { ...getForm(id).errors, remarks: null } });
  }, []);

  const validate = (id) => {
    const f = getForm(id);
    const errs = {};
    if (f.marks <= 0 && rubric?.totalMarks > 0) errs.marks = 'Please select tiers for all criteria';
    if (!f.remarks.trim()) errs.remarks = 'Remarks required';
    setForm(id, { errors: errs });
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (ev) => {
    const id = ev.id;
    if (!validate(id)) return;
    setSubmittingId(id);
    const f = getForm(id);
    const criteriaScores = buildCriteriaScoresPayload(f.values, rubric);
    try {
      await submitCommitteePhase3Evaluation({
        evaluationId: id,
        marks: f.marks,
        remarks: f.remarks.trim(),
        criteriaScores
      });
      showToast.success('Evaluation submitted');
      setEvaluations(prev => prev.map(e =>
        e.id === id
          ? { ...e, marks: f.marks, remarks: f.remarks.trim(), criteriaScores, status: 'Completed' }
          : e
      ));
      setForm(id, { expanded: false });
    } catch (err) {
      const msg = err.response?.data?.message || err.mappedError?.message || 'Submission failed';
      showToast.error(msg);
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4 mb-6">
          <div className="skeleton h-7 w-56 rounded-md" />
          <div className="skeleton h-4 w-80 rounded-md mt-2" />
        </div>
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-line">
                  {[1, 2, 3, 4, 5].map(i => (
                    <th key={i} className="py-3.5 px-6"><div className="skeleton h-4 rounded-md" style={{ width: i < 2 ? '100px' : '70px' }} /></th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {[1, 2, 3, 4].map(i => (
                  <tr key={i} className="animate-pulse">
                    {[1, 2, 3, 4, 5].map(j => (
                      <td key={j} className="py-4 px-6"><div className="skeleton h-4 rounded-md" style={{ width: j < 2 ? '120px' : '60px' }} /></td>
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

  const completed = evaluations.filter(e => e.status === 'Completed').length;
  const pending = evaluations.length - completed;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="border-b border-line pb-4 mb-6">
        <h1 className="text-xl font-bold text-slate-900">Phase 3 (60%) — Committee Evaluation</h1>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Evaluate groups using the Phase 3 committee rubric.</p>
      </motion.div>

      {evaluations.length > 0 && (
        <motion.div variants={item} className="flex items-center gap-4 text-xs text-slate-600 mb-2">
          <span><strong className="text-slate-900">{evaluations.length}</strong> evaluations</span>
          <span className="flex items-center gap-1"><CheckCircle size={13} className="text-emerald-600" /> <strong>{completed}</strong> completed</span>
          <span className="flex items-center gap-1"><Clock size={13} className="text-amber-600" /> <strong>{pending}</strong> pending</span>
        </motion.div>
      )}

      {evaluations.length === 0 ? (
        <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-sm p-12 text-center">
          <ClipboardList size={40} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-700">No evaluations assigned</h3>
          <p className="text-xs text-slate-400 mt-1">You have no Phase 3 committee evaluations.</p>
        </motion.div>
      ) : (
        <>
          {committees.length > 0 && (
            <motion.div variants={item} className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <Users size={15} className="text-blue-600" />
                Your Committees
              </div>
              <div className="grid grid-cols-1 gap-3">
                {committees.map(comm => {
                  const total = comm.evaluations.length;
                  const done = comm.evaluations.filter(e => e.status === 'Completed').length;
                  const isExpanded = expandedComm === comm.name;
                  return (
                    <div key={comm.name} className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
                      <button
                        onClick={() => setExpandedComm(isExpanded ? null : comm.name)}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer border-0 bg-transparent text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                            <Star size={15} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-900 truncate">{comm.name}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{done}/{total} completed</div>
                          </div>
                        </div>
                        {isExpanded ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
                      </button>
                      {isExpanded && (
                        <div className="border-t border-line divide-y divide-line">
                          {comm.evaluations.map(ev => {
                            const f = getForm(ev.id);
                            const isDone = ev.status === 'Completed';

                            return (
                              <div key={ev.id}>
                                <div className="flex items-center justify-between px-5 py-3 hover:bg-blue-50/30 transition-colors">
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-semibold text-slate-900">{ev.groupName || `Group ${ev.groupId}`}</div>
                                    {ev.projectTitle && (
                                      <div className="text-[9px] text-slate-400 mt-0.5 truncate">{ev.projectTitle}</div>
                                    )}
                                    <div className="text-[9px] text-slate-400 font-mono mt-0.5">{ev.id}</div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${isDone ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                      {isDone ? 'Completed' : 'Pending'}
                                    </span>
                                    {!isDone ? (
                                      <button
                                        onClick={() => openForm(ev)}
                                        className="px-3 py-1.5 rounded-lg bg-btn text-white font-semibold text-[10px] hover:bg-btn-hover transition-all cursor-pointer border-0 whitespace-nowrap"
                                      >
                                        {f.expanded ? 'Cancel' : 'Evaluate'}
                                      </button>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-semibold italic px-2">
                                        <CheckCircle size={10} /> Done
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {f.expanded && !isDone && rubric && (
                                  <div className="border-t border-line">
                                    <form
                                      onSubmit={(e) => { e.preventDefault(); handleSubmit(ev); }}
                                      className="p-5 bg-slate-50/30 space-y-4"
                                    >
                                      <RubricEvaluationForm
                                        rubric={rubric}
                                        values={f.values}
                                        onChange={(v) => handleValuesChange(ev.id, v)}
                                        marks={f.marks}
                                        onMarksChange={() => {}}
                                        remarks={f.remarks}
                                        onRemarksChange={(v) => handleRemarksChange(ev.id, v)}
                                        errors={f.errors}
                                      />
                                      <div className="flex items-center gap-3 pt-2">
                                        <button
                                          type="submit"
                                          disabled={submittingId === ev.id}
                                          className="px-4 py-2 rounded-lg bg-btn text-white font-semibold text-[10px] hover:bg-btn-hover transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-0 flex items-center gap-1.5"
                                        >
                                          {submittingId === ev.id && <Loader2 size={12} className="animate-spin" />}
                                          {submittingId === ev.id ? 'Submitting…' : 'Submit Evaluation'}
                                        </button>
                                        <span className="text-[9px] text-slate-400 flex items-center gap-1">
                                          <AlertTriangle size={10} /> Cannot be modified after submission
                                        </span>
                                      </div>
                                    </form>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-line flex items-center gap-2">
              <ClipboardList size={13} className="text-blue-600" />
              <span className="text-xs font-bold text-slate-700">All Evaluations</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-line text-[11px] font-semibold text-slate-900 tracking-wider">
                    <th className="py-3.5 px-6">Ref</th>
                    <th className="py-3.5 px-6">Group</th>
                    <th className="py-3.5 px-6">Committee</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-sm font-medium text-slate-900">
                  {evaluations.map(ev => {
                    const isDone = ev.status === 'Completed';
                    return (
                      <tr key={ev.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-4 px-6 text-slate-700 font-mono text-xs font-semibold">{ev.id}</td>
                        <td className="py-4 px-6 font-semibold text-slate-900">{ev.groupName || `Group ${ev.groupId}`}</td>
                        <td className="py-4 px-6 text-slate-600 text-xs">{ev.committee}</td>
                        <td className="py-4 px-6">
                          <span className={`font-semibold text-[10px] px-2.5 py-1 rounded-lg border ${isDone ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            {ev.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right text-xs font-bold text-slate-700">
                          {isDone ? `${ev.marks?.toFixed(1) ?? '—'} / ${rubric?.totalMarks ?? 15}` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default FacultyCommitteePhase3;
