import { useEffect, useState, useCallback } from 'react';
import { getSupervisorPhase2Groups, submitSupervisorPhase2Evaluation } from '../../services/phase2.service';
import { getRubricByPhase } from '../../services/rubric.service';
import RubricEvaluationForm, { calcTotal, buildInitialValues, buildCriteriaScoresPayload } from '../../components/RubricEvaluationForm';
import { showToast } from '../../components/AppToast';
import { Users, Loader2, CheckCircle, Check, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const FacultyPhase2Evaluation = () => {
  const [groups, setGroups] = useState([]);
  const [rubric, setRubric] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [values, setValues] = useState({});
  const [marks, setMarks] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState({});
  const [expandedMembers, setExpandedMembers] = useState({});

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getSupervisorPhase2Groups(),
      getRubricByPhase('phase2')
    ])
      .then(([groupsRes, rubricRes]) => {
        const g = Array.isArray(groupsRes.data) ? groupsRes.data : [];
        const r = rubricRes.data;
        setGroups(g);
        setRubric(r);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const selectGroup = useCallback((groupId) => {
    if (selectedId === groupId) {
      setSelectedId(null);
      return;
    }
    const g = groups.find(x => x.groupId === groupId);
    setSelectedId(groupId);
    if (g?.status === 'evaluated' && g.criteriaScores?.length > 0) {
      const initial = buildInitialValues(rubric, g.criteriaScores);
      setValues(initial);
      const total = calcTotal(initial, rubric);
      setMarks(total);
      setRemarks(g.supervisorRemarks ?? '');
    } else {
      const initial = buildInitialValues(rubric, []);
      setValues(initial);
      setMarks(0);
      setRemarks('');
    }
    setErrors({});
  }, [selectedId, groups, rubric]);

  const handleValuesChange = useCallback((newValues) => {
    setValues(newValues);
    const total = calcTotal(newValues, rubric);
    setMarks(total);
  }, [rubric]);

  const handleMarksChange = useCallback((m) => {
    setMarks(m);
  }, []);

  const handleRemarksChange = useCallback((r) => {
    setRemarks(r);
    setErrors(prev => ({ ...prev, remarks: null }));
  }, []);

  const validate = () => {
    const errs = {};
    if (!remarks.trim()) errs.remarks = 'Remarks required';
    if (marks <= 0 && rubric?.totalMarks > 0) errs.marks = 'Please select tiers for all criteria';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !selectedId) return;
    setSubmitting(true);
    const criteriaScores = buildCriteriaScoresPayload(values, rubric);
    try {
      await submitSupervisorPhase2Evaluation({
        groupId: selectedId,
        marks,
        remarks: remarks.trim(),
        criteriaScores
      });
      showToast.success('Evaluation submitted');
      setGroups(prev => prev.map(g =>
        g.groupId === selectedId
          ? { ...g, supervisorMark: marks, supervisorRemarks: remarks.trim(), criteriaScores, status: 'evaluated' }
          : g
      ));
    } catch (err) {
      const msg = err.response?.data?.message || err.mappedError?.message || 'Submission failed';
      showToast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4 mb-6">
          <div className="skeleton h-7 w-56 rounded-md" />
          <div className="skeleton h-4 w-80 rounded-md mt-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-line shadow-sm p-5">
              <div className="skeleton h-5 w-40 rounded-md mb-3" />
              <div className="skeleton h-4 w-56 rounded-md mb-2" />
              <div className="skeleton h-3 w-24 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const evaluated = groups.filter(g => g.status === 'evaluated').length;
  const pending = groups.length - evaluated;
  const selected = groups.find(g => g.groupId === selectedId);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="border-b border-line pb-4 mb-2">
        <h1 className="text-xl font-bold text-slate-900">Phase 2 (30%) — Supervisor Evaluation</h1>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Select a group card to evaluate using the Phase 2 rubric.</p>
      </motion.div>

      {groups.length > 0 && (
        <motion.div variants={item} className="flex items-center gap-4 text-xs text-slate-600 mb-2">
          <span><strong className="text-slate-900">{groups.length}</strong> groups</span>
          <span className="flex items-center gap-1"><CheckCircle size={13} className="text-emerald-600" /> <strong>{evaluated}</strong> evaluated</span>
          <span className="flex items-center gap-1"><Clock size={13} className="text-amber-600" /> <strong>{pending}</strong> pending</span>
        </motion.div>
      )}

      {groups.length === 0 ? (
        <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-sm p-12 text-center">
          <Users size={40} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-700">No supervised groups</h3>
          <p className="text-xs text-slate-400 mt-1">You have no groups to evaluate for Phase 2.</p>
        </motion.div>
      ) : (
        <>
          <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(group => {
              const isSelected = selectedId === group.groupId;
              const isEvald = group.status === 'evaluated';

              return (
                <button
                  key={group.groupId}
                  onClick={() => selectGroup(group.groupId)}
                  className={`relative text-left w-full rounded-2xl border-2 p-5 transition-all duration-200 cursor-pointer bg-white shadow-sm hover:shadow-md ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-300 bg-blue-50 -translate-y-0.5'
                      : isEvald
                        ? 'border-emerald-200 hover:border-emerald-300'
                        : 'border-line hover:border-slate-300'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md z-10">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{group.name || `Group ${String(group.groupId).substring(0, 6)}`}</h3>
                      {group.title && (
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">{group.title}</p>
                      )}
                    </div>
                    <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${
                      isEvald
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {isEvald ? 'Evaluated' : 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users size={11} /> {group.members?.length || 0}
                    </span>
                    {isEvald && (
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle size={11} /> {group.supervisorMark}/{rubric?.totalMarks || 45}
                      </span>
                    )}
                  </div>

                  {isEvald && group.supervisorRemarks && (
                    <div className="mt-2 pt-2 border-t border-dashed border-slate-200">
                      <p className="text-[9px] text-slate-400 leading-relaxed line-clamp-2">{group.supervisorRemarks}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </motion.div>

          <AnimatePresence>
            {selected && rubric && (
              <motion.div
                key={selected.groupId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                className="bg-white rounded-2xl border border-line shadow-md overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-line bg-slate-50/50 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{selected.name || `Group ${String(selected.groupId).substring(0, 6)}`}</h3>
                    {selected.title && <p className="text-[10px] text-slate-500 mt-0.5">{selected.title}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${
                      selected.status === 'evaluated'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {selected.status === 'evaluated' ? 'Evaluated' : 'Pending'}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedMembers(prev => ({ ...prev, [selected.groupId]: !prev[selected.groupId] })); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer border-0 bg-transparent"
                    >
                      {expandedMembers[selected.groupId] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                </div>

                {expandedMembers[selected.groupId] && selected.members?.length > 0 && (
                  <div className="border-b border-line bg-slate-50/30 divide-y divide-line px-6">
                    {selected.members.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 py-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {(m.name || '?').charAt(0)}
                        </div>
                        <div className="text-xs font-semibold text-slate-900">{m.name}</div>
                        {m.regNo && <div className="text-[9px] text-slate-400 font-mono ml-auto">{m.regNo}</div>}
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="p-6">
                  <RubricEvaluationForm
                    rubric={rubric}
                    values={values}
                    onChange={handleValuesChange}
                    marks={marks}
                    onMarksChange={handleMarksChange}
                    remarks={remarks}
                    onRemarksChange={handleRemarksChange}
                    errors={errors}
                  />

                  <div className="flex items-center gap-3 pt-4 mt-4 border-t border-line">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-[10px] hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-0 flex items-center gap-1.5"
                    >
                      {submitting && <Loader2 size={12} className="animate-spin" />}
                      {submitting ? 'Submitting…' : 'Submit Evaluation'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};

export default FacultyPhase2Evaluation;
