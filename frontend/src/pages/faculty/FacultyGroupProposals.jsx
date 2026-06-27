import React, { useEffect, useState } from 'react';
import { getPendingGroupIdeas, approveGroupIdea, rejectGroupIdea, resetGroupIdea, forwardGroupIdea } from '../../services/faculty.service';
import { STATUS_MAP } from '../../utils/constants/status.constant';
import { X, Check, Loader2, CheckCircle, AlertCircle, Lightbulb, Users, ThumbsUp, RotateCcw, Send, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };


const FacultyGroupProposals = () => {
  const [allIdeas, setAllIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [filter, setFilter] = useState('supervisor_approved');
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [confirm, setConfirm] = useState({ show: false, title: '', message: '', action: null });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const res = await getPendingGroupIdeas();
      setAllIdeas(res.data || []);
    } catch { showToastMsg('error', 'Failed to load proposals.');
    } finally { setLoading(false); }
  };

  const showToastMsg = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 4000);
  };

  const showConfirm = (title, message, action) => {
    setConfirm({ show: true, title, message, action });
  };

  const handleConfirm = async () => {
    if (!confirm.action) return;
    setConfirm({ show: false, title: '', message: '', action: null });
    await confirm.action();
  };

  const filtered = filter === 'all' ? allIdeas : allIdeas.filter(i => i.agreementStatus === filter);
  const counts = {};
  allIdeas.forEach(i => { counts[i.agreementStatus] = (counts[i.agreementStatus] || 0) + 1; });

  const handleApprove = async (ideaId) => {
    setActionLoading(ideaId);
    try {
      await approveGroupIdea(ideaId, feedback[ideaId] || '');
      showToastMsg('success', 'Proposal approved.');
      fetchAll();
    } catch (err) { showToastMsg('error', err?.response?.data?.message || 'Failed to approve.');
    } finally { setActionLoading(null); }
  };

  const handleReset = async (ideaId) => {
    setActionLoading(ideaId);
    try {
      await resetGroupIdea(ideaId);
      showToastMsg('success', 'Proposal reset to pending review.');
      fetchAll();
    } catch (err) { showToastMsg('error', err?.response?.data?.message || 'Failed to reset.');
    } finally { setActionLoading(null); }
  };

  const handleReject = async (ideaId) => {
    const reason = feedback[ideaId]?.trim();
    if (!reason) { showToastMsg('error', 'Please provide feedback for rejection.'); return; }
    setActionLoading(ideaId);
    try {
      await rejectGroupIdea(ideaId, reason);
      showToastMsg('success', 'Proposal rejected.');
      fetchAll();
    } catch (err) { showToastMsg('error', err?.response?.data?.message || 'Failed to reject.');
    } finally { setActionLoading(null); }
  };

  const handleForward = async (groupId) => {
    setActionLoading('forward_' + groupId);
    try {
      await forwardGroupIdea(groupId);
      showToastMsg('success', 'Group forwarded to FYP Office successfully.');
      fetchAll();
    } catch (err) { showToastMsg('error', err?.response?.data?.message || 'Failed to forward.');
    } finally { setActionLoading(null); }
  };

  if (loading) return <div className="flex-center py-20"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /><span className="ml-2 text-sm text-slate-500 font-medium">Loading proposals...</span></div>;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Group Proposals</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">All proposals from your supervised groups — pending, accepted, and rejected.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          {Object.entries(STATUS_MAP).map(([k, v]) => (
            counts[k] ? <span key={k} className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${v.color.split(' ')[0]}`} /> {v.label}: {counts[k]}</span> : null
          ))}
        </div>
      </motion.div>

      <div className="flex gap-2 flex-wrap">
        {[{ key: 'all', label: `All (${allIdeas.length})` }, ...Object.entries(STATUS_MAP).map(([k, v]) => ({ key: k, label: `${v.label} (${counts[k] || 0})` }))].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              filter === f.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-gray-200 hover:bg-blue-50'
            }`}>{f.label}</button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <motion.div variants={item} className="card p-8 text-center">
            <Lightbulb className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-900">No {filter === 'all' ? '' : `${STATUS_MAP[filter]?.label || ''} `}proposals</p>
            <p className="text-xs text-slate-500 mt-1">When your groups submit proposals, they will appear here.</p>
          </motion.div>
        ) : (
          filtered.map(idea => {
            const sm = STATUS_MAP[idea.agreementStatus] || STATUS_MAP.agreed;
            const Icon = sm.icon;
            return (
              <motion.div key={idea._id} variants={item} className={`card overflow-hidden relative ${idea.group?.forwardedToFypOffice ? 'ring-2 ring-emerald-400 ring-offset-1' : ''}`}>
                {idea.group?.forwardedToFypOffice && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="text-emerald-600 text-lg font-black tracking-wider uppercase border-[3px] border-emerald-600 rounded-lg px-4 py-2 rotate-[-15deg] opacity-80">
                      Forwarded
                    </div>
                  </div>
                )}
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-slate-900 text-base">{idea.title}</h3>
                        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border ${sm.color}`}>
                          <Icon size={11} /> {sm.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Users size={12} /> {idea.group?.name || 'Group'} &bull; {idea.group?.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                  {idea.description && <p className="text-sm text-slate-600 mb-4 leading-relaxed">{idea.description}</p>}
                  {idea.techStack && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {idea.techStack.split(',').map((tag, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-100">{tag.trim()}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-4">
                    <span>Proposed by <strong className="text-slate-700">{idea.submittedBy?.name || 'Unknown'}</strong></span>
                    <span>Votes: {idea.votes?.filter(v => v.decision === 'agree').length || 0}/{idea.votes?.length || 0} agreed</span>
                  {idea.supervisorFeedback && <span className="text-slate-400">Feedback: {idea.supervisorFeedback}</span>}
                </div>

                  {idea.agreementStatus === 'supervisor_approved' && (
                    <div className="mb-4 p-3 bg-purple-50 rounded-xl border border-purple-200">
                      <p className="text-xs font-bold text-purple-500">Sent for FYP Office Approval</p>
                      <p className="text-sm text-purple-700 mt-0.5">This project has been sent to the FYP Office for final approval. Waiting for the Office Assistant or FYP In-charge to review.</p>
                    </div>
                  )}

                  {idea.fypOfficeFeedback && (
                    <div className={`mb-4 p-3 rounded-xl border ${idea.agreementStatus === 'fyp_office_rejected' ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                      <p className={`text-xs font-bold mb-1 ${idea.agreementStatus === 'fyp_office_rejected' ? 'text-red-500' : 'text-emerald-500'}`}>
                        {idea.agreementStatus === 'fyp_office_rejected' ? 'Rejected by ' : 'Approved by '}
                        {idea.fypOfficeReviewedByRole || 'FYP Office'}
                      </p>
                      <p className={`text-sm ${idea.agreementStatus === 'fyp_office_rejected' ? 'text-red-700' : 'text-emerald-700'}`}>{idea.fypOfficeFeedback}</p>
                    </div>
                  )}

                  {!idea.group?.forwardedToFypOffice && (idea.agreementStatus === 'supervisor_approved' || idea.agreementStatus === 'supervisor_rejected') && (
                    <div className="border-t border-line pt-4 mt-2 flex items-center gap-2">
                      <button onClick={() => showConfirm('Reset Proposal', 'Reset this proposal to pending review? This allows you to re-review it.', () => handleReset(idea._id))}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white text-slate-600 text-xs font-bold rounded-xl border border-line hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all disabled:opacity-50 cursor-pointer">
                        <RotateCcw className="w-3.5 h-3.5" /> Reset to Pending
                      </button>
                      {idea.agreementStatus === 'supervisor_approved' && (
                        <button onClick={() => showConfirm('Forward to FYP Office', 'Forward this group to FYP Office for further review?', () => handleForward(idea.group?._id || idea.group))}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all cursor-pointer border-0">
                          <Send className="w-3.5 h-3.5" /> Forward to FYP Office
                        </button>
                      )}
                    </div>
                  )}

                  {idea.agreementStatus === 'agreed' && (
                    <div className="border-t border-line pt-4 mt-2 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Feedback (required for rejection)</label>
                        <textarea value={feedback[idea._id] || ''} onChange={e => setFeedback({ ...feedback, [idea._id]: e.target.value })}
                          placeholder="Provide feedback or approval notes..."
                          className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm min-h-[70px] outline-none focus:ring-2 focus:ring-blue-600/20" />
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleApprove(idea._id)} disabled={actionLoading === idea._id}
                          className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 cursor-pointer border-0">
                          {actionLoading === idea._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Approve
                        </button>
                        <button onClick={() => handleReject(idea._id)} disabled={actionLoading === idea._id}
                          className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-slate-600 text-xs font-bold rounded-xl border border-line hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all disabled:opacity-50 cursor-pointer">
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50 animate-fadeSlideUp">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg text-sm font-semibold border ${toast.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white text-slate-800 border-line'}`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <AnimatePresence>
        {confirm.show && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-600/20 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl border border-line w-full max-w-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{confirm.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{confirm.message}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setConfirm({ show: false, title: '', message: '', action: null })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 border border-line hover:bg-gray-50 transition-all cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleConfirm}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer border-0">
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FacultyGroupProposals;
