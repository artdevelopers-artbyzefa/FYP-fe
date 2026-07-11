import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getEscalations, resolveEscalation } from '../../services/hod.service';
import { showAlert, showToast } from '../../components/AppToast';
import { AlertTriangle, CheckCircle, FileText, Gavel, Shield, UserPen, X, XCircle } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

const HodEscalations = () => {
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dismissReason, setDismissReason] = useState('');
  const [actionInProgress, setActionInProgress] = useState(null);

  const loadEscalations = () => {
    setLoading(true);
    getEscalations().then((res) => {
      setEscalations(Array.isArray(res.data) ? res.data : []);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { loadEscalations(); }, []);

  const handleAction = async (id, action, reason = '') => {
    setActionInProgress(action);
    try {
      await resolveEscalation(id, action, reason);
      showToast.success(`Binding ruling issued: ${action.replace(/_/g, ' ')}`);
      loadEscalations();
    } catch (err) {
      showToast.error(err.mappedError?.message || 'Failed to issue ruling');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleMandate = (id) => {
    showAlert.confirm(
      'Mandate Re-evaluation',
      'Are you sure you want to mandate formal committee re-evaluation? This is a binding HOD ruling and cannot be undone.',
      'Yes, Mandate',
      'Cancel'
    ).then((result) => {
      if (result.isConfirmed) handleAction(id, 'mandate_reevaluation');
    });
  };

  const handleReassign = (id) => {
    showAlert.confirm(
      'Re-assign Supervisor',
      'Are you sure you want to reassign student group supervisor? This is a binding HOD ruling and cannot be undone.',
      'Yes, Re-assign',
      'Cancel'
    ).then((result) => {
      if (result.isConfirmed) handleAction(id, 'reassign_supervisor');
    });
  };

  const handleDismissSubmit = (e, id) => {
    e.preventDefault();
    if (dismissReason.trim()) {
      handleAction(id, 'dismiss', dismissReason.trim());
      setIsModalOpen(false);
      setDismissReason('');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-72" />
        {[1, 2].map(i => <div key={i} className="skeleton h-48 w-full rounded-2xl" />)}
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Escalated Grievances & Binding Decisions</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Review severe student disputes escalated by the FYP Office In-charge and issue final, binding administrative rulings</p>
      </motion.div>

      {escalations.length === 0 ? (
        <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">All Clear</h3>
          <p className="text-sm text-slate-500">No escalated grievances requiring HOD ruling at this time.</p>
        </motion.div>
      ) : (
        escalations.map(esc => (
          <motion.div key={esc.id} variants={item} className="bg-white rounded-2xl border border-line shadow-card p-6 sm:p-8 relative overflow-hidden mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-line gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-slate-900 text-lg">{esc.student} ({esc.regNo})</span>
                  <span className="bg-amber-50 text-amber-700 font-semibold text-xs px-3 py-1 rounded-full">
                    <AlertTriangle size={14} className="inline mr-1" /> Escalated by In-charge
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Category: {esc.category} | Escalated: {esc.date ? new Date(esc.date).toLocaleDateString() : 'Unknown'}</p>
              </div>
              <span className="bg-red-50 text-red-600 font-semibold text-xs px-4 py-2 rounded-full">HOD Ruling Required</span>
            </div>

            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50/50 p-5 rounded-xl border border-line space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm pb-2 border-b border-line">
                    <FileText size={16} className="inline mr-2 text-slate-400" />Grievance Details & Evidence
                  </h4>
                  <p className="text-slate-600 leading-relaxed italic">"{esc.details}"</p>
                </div>
                <div className="bg-blue-50/30 p-5 rounded-xl border border-line space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm pb-2 border-b border-line">
                    <Shield size={16} className="inline mr-2 text-slate-400" />FYP Office In-charge Escalation Note
                  </h4>
                  <p className="text-slate-600 leading-relaxed">"{esc.inchargeNote}"</p>
                  <div className="pt-2"><span className="font-semibold text-slate-700">Escalated By:</span> <span className="font-medium text-slate-500">{esc.escalatedBy}</span></div>
                </div>
              </div>

              <div className="bg-slate-50/30 p-6 rounded-xl border border-line space-y-5">
                <h4 className="font-bold text-slate-900 text-sm border-b border-line pb-3">
                  <Gavel size={16} className="inline mr-2 text-slate-400" />Issue Binding HOD Ruling
                </h4>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => handleMandate(esc.id)}
                    disabled={actionInProgress === esc.id}
                    className="px-6 py-3 bg-btn hover:bg-btn-hover text-white rounded-xl font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-2 text-sm disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <CheckCircle size={16} /> Mandate Re-evaluation
                  </button>
                  <button
                    onClick={() => handleReassign(esc.id)}
                    disabled={actionInProgress === esc.id}
                    className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-2 text-sm disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <UserPen size={16} /> Re-assign Supervisor
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={actionInProgress === esc.id}
                    className="px-6 py-3 bg-white border border-line hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-2 text-sm disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <XCircle size={16} /> Dismiss Grievance
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-[150] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-dropdown border border-line">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-line">
              <h3 className="text-lg font-bold text-slate-900">Dismiss Escalated Grievance</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-1">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={(e) => handleDismissSubmit(e, escalations[0]?.id)} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Mandatory HOD Dismissal Reason</label>
                <textarea
                  value={dismissReason}
                  onChange={(e) => setDismissReason(e.target.value)}
                  placeholder="Provide official HOD binding justification for dismissing this escalated grievance..."
                  className="w-full bg-white border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all h-32 resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-btn hover:bg-btn-hover text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">Confirm Binding Dismissal</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default HodEscalations;
