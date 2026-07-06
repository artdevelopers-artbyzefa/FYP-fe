import React, { useEffect, useState } from 'react';
import { getSupervisorPhase1Groups, submitSupervisorPhase1Evaluation } from '../../services/phase1.service';
import { showToast } from '../../components/AppToast';
import { Users, Loader2, CheckCircle, Clock, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const FacultyPhase1Evaluation = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [formState, setFormState] = useState({}); // { [groupId]: { marks, remarks, errors, expanded } }
  const [expandedMembers, setExpandedMembers] = useState({});

  useEffect(() => {
    setLoading(true);
    getSupervisorPhase1Groups()
      .then(res => setGroups(Array.isArray(res.data) ? res.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getForm = (groupId) => formState[groupId] || { marks: '', remarks: '', errors: {}, expanded: false };

  const setForm = (groupId, patch) =>
    setFormState(prev => ({ ...prev, [groupId]: { ...getForm(groupId), ...patch } }));

  const validate = (groupId) => {
    const f = getForm(groupId);
    const errs = {};
    const markVal = parseFloat(f.marks);
    if (isNaN(markVal) || markVal < 0 || markVal > 100) errs.marks = 'Must be 0–100';
    if (!f.remarks.trim()) errs.remarks = 'Remarks required';
    setForm(groupId, { errors: errs });
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (groupId) => {
    if (!validate(groupId)) return;
    setSubmittingId(groupId);
    const f = getForm(groupId);
    try {
      await submitSupervisorPhase1Evaluation({
        groupId,
        marks: parseFloat(f.marks),
        remarks: f.remarks.trim()
      });
      showToast.success('Evaluation submitted');
      setGroups(prev => prev.map(g =>
        g.groupId === groupId
          ? { ...g, supervisorMark: parseFloat(f.marks), supervisorRemarks: f.remarks.trim(), status: 'evaluated' }
          : g
      ));
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
        <div className="grid grid-cols-1 gap-3">
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

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Phase 1 (10%) — Supervisor Evaluation</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Submit marks and mandatory remarks for your supervised groups.</p>
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
          <p className="text-xs text-slate-400 mt-1">You have no groups to evaluate for Phase 1.</p>
        </motion.div>
      ) : (
        <motion.div variants={item} className="space-y-3">
          {groups.map(group => {
            const f = getForm(group.groupId);
            const isEvaluated = group.status === 'evaluated';
            const expanded = f.expanded;

            return (
              <div key={group.groupId} className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
                <div className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{group.name || `Group ${group.groupId}`}</h3>
                      <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${isEvaluated ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {isEvaluated ? 'Evaluated' : 'Pending'}
                      </span>
                    </div>
                    {group.title && <p className="text-[10px] text-slate-500 mt-0.5 truncate">{group.title}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isEvaluated ? (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <CheckCircle size={12} className="text-emerald-500" />
                        <span className="font-semibold">{group.supervisorMark}/100</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setForm(group.groupId, { expanded: !expanded })}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-[10px] hover:bg-blue-700 transition-all cursor-pointer border-0 whitespace-nowrap"
                      >
                        {expanded ? 'Cancel' : 'Evaluate'}
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedMembers(prev => ({ ...prev, [group.groupId]: !prev[group.groupId] }))}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer border-0 bg-transparent"
                    >
                      {expandedMembers[group.groupId] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                </div>

                {expandedMembers[group.groupId] && group.members?.length > 0 && (
                  <div className="border-t border-line bg-slate-50/50 divide-y divide-line">
                    {group.members.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 px-5 py-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {(m.name || '?').charAt(0)}
                        </div>
                        <div className="text-xs font-semibold text-slate-900">{m.name}</div>
                        {m.regNo && <div className="text-[9px] text-slate-400 font-mono ml-auto">{m.regNo}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {isEvaluated && (
                  <div className="border-t border-line px-5 py-3 bg-slate-50/30">
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-semibold text-slate-500 shrink-0 mt-0.5">Remarks:</span>
                      <p className="text-xs text-slate-700">{group.supervisorRemarks || '—'}</p>
                    </div>
                  </div>
                )}

                {expanded && !isEvaluated && (
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSubmit(group.groupId); }}
                    className="border-t border-line px-5 py-4 bg-slate-50/30 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1">
                          Marks <span className="text-slate-400">(0–100)</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={f.marks}
                          onChange={e => { setForm(group.groupId, { marks: e.target.value, errors: { ...f.errors, marks: null } }); }}
                          placeholder="0–100"
                          className={`w-full bg-white border rounded-lg px-3 py-2 text-xs outline-none transition-all focus:ring-1 ${f.errors.marks ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-line focus:border-blue-400 focus:ring-blue-400'}`}
                        />
                        {f.errors.marks && <p className="text-[9px] text-red-500 font-medium mt-0.5">{f.errors.marks}</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1">
                          Remarks <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={f.remarks}
                          onChange={e => { setForm(group.groupId, { remarks: e.target.value, errors: { ...f.errors, remarks: null } }); }}
                          placeholder="Provide detailed feedback on the group's Phase 1 work..."
                          rows={2}
                          className={`w-full bg-white border rounded-lg px-3 py-2 text-xs outline-none transition-all focus:ring-1 resize-none ${f.errors.remarks ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-line focus:border-blue-400 focus:ring-blue-400'}`}
                        />
                        {f.errors.remarks && <p className="text-[9px] text-red-500 font-medium mt-0.5">{f.errors.remarks}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={submittingId === group.groupId}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-[10px] hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-0 flex items-center gap-1.5"
                      >
                        {submittingId === group.groupId && <Loader2 size={12} className="animate-spin" />}
                        {submittingId === group.groupId ? 'Submitting…' : 'Submit Evaluation'}
                      </button>
                      <span className="text-[9px] text-slate-400 flex items-center gap-1">
                        <AlertTriangle size={10} /> Warning: submission cannot be modified
                      </span>
                    </div>
                  </form>
                )}
              </div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default FacultyPhase1Evaluation;
