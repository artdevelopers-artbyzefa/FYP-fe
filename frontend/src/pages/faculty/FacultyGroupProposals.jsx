import React, { useEffect, useState } from 'react';
import { getPendingGroupIdeas, approveGroupIdea, rejectGroupIdea } from '../../services/faculty.service';
import { X, Check, Loader2, CheckCircle, AlertCircle, Lightbulb, Users, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const FacultyGroupProposals = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  useEffect(() => { fetchIdeas(); }, []);

  const fetchIdeas = async () => {
    try {
      const res = await getPendingGroupIdeas();
      setIdeas(res.data || []);
    } catch { showToastMsg('error', 'Failed to load pending proposals.');
    } finally { setLoading(false); }
  };

  const showToastMsg = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 4000);
  };

  const handleApprove = async (ideaId) => {
    setActionLoading(ideaId);
    try {
      await approveGroupIdea(ideaId, feedback[ideaId] || '');
      showToastMsg('success', 'Proposal approved.');
      setIdeas(prev => prev.filter(i => i._id !== ideaId));
    } catch (err) { showToastMsg('error', err?.response?.data?.message || 'Failed to approve.');
    } finally { setActionLoading(null); }
  };

  const handleReject = async (ideaId) => {
    const reason = feedback[ideaId]?.trim();
    if (!reason) { showToastMsg('error', 'Please provide feedback explaining why this proposal is rejected.'); return; }
    setActionLoading(ideaId);
    try {
      await rejectGroupIdea(ideaId, reason);
      showToastMsg('success', 'Proposal rejected.');
      setIdeas(prev => prev.filter(i => i._id !== ideaId));
    } catch (err) { showToastMsg('error', err?.response?.data?.message || 'Failed to reject.');
    } finally { setActionLoading(null); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-blue-600 animate-spin" /><span className="ml-2 text-sm text-slate-500 font-medium">Loading proposals...</span></div>;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Incoming Group Proposals</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Your supervised groups have agreed on ideas that need your review.</p>
      </motion.div>
      <div className="space-y-4">
        {ideas.length === 0 ? (
          <motion.div variants={item} className="bg-white rounded-2xl border border-line p-8 text-center shadow-card">
            <Lightbulb className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-900">No pending proposals</p>
            <p className="text-xs text-slate-500 mt-1">When your supervised groups agree on an idea, it will appear here.</p>
          </motion.div>
        ) : (
          ideas.map(idea => (
            <motion.div key={idea._id} variants={item} className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
              <div className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-slate-900 text-base">{idea.title}</h3>
                      <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ThumbsUp size={12} /> Group Agreed
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
                </div>
                <div className="border-t border-line pt-4 mt-2 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Feedback (required for rejection)</label>
                    <textarea value={feedback[idea._id] || ''} onChange={e => setFeedback({ ...feedback, [idea._id]: e.target.value })}
                      placeholder="Provide feedback or approval notes..."
                      className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm min-h-[70px] focus:outline-none focus:ring-2 focus:ring-blue-600/20" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleApprove(idea._id)} disabled={actionLoading === idea._id}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 cursor-pointer border-0 focus-visible:ring-2 focus-visible:ring-emerald-500">
                      {actionLoading === idea._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Approve
                    </button>
                    <button onClick={() => handleReject(idea._id)} disabled={actionLoading === idea._id}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-slate-600 text-xs font-bold rounded-xl border border-line hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all disabled:opacity-50 cursor-pointer focus-visible:ring-2 focus-visible:ring-red-500">
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
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
    </motion.div>
  );
};

export default FacultyGroupProposals;
