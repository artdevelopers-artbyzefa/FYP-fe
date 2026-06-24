import React, { useEffect, useState } from 'react';
import { getProposalReviews, processProposalReview } from '../../services/office-incharge.service';
import { showToast, showAlert } from '../../components/AppToast';
import { Check, X, Loader2, AlertCircle, BookOpen, FileText, MessageSquare, ChevronDown, ChevronUp, Users } from 'lucide-react';

const STATUS_MAP = {
  submitted: { label: 'Submitted', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  under_review: { label: 'Under Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  accepted: { label: 'Accepted', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  revisions_requested: { label: 'Revisions Requested', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  rejected: { label: 'Rejected', color: 'bg-rose-50 text-rose-600 border-rose-200' },
};

const InchargeSupervisionRequests = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackFor, setFeedbackFor] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchProposals(); }, []);

  const fetchProposals = async () => {
    setLoading(true); setError(null);
    try {
      const res = await getProposalReviews();
      setProposals(Array.isArray(res.data) ? res.data : []);
    } catch { setError('Failed to load proposals.'); setProposals([]); }
    finally { setLoading(false); }
  };

  const filtered = filter === 'all' ? proposals : proposals.filter(p => p.status === filter);
  const pending = proposals.filter(p => p.status === 'submitted' || p.status === 'under_review').length;
  const accepted = proposals.filter(p => p.status === 'accepted').length;

  const handleAction = async (id, status) => {
    if (status === 'revisions_requested' && !feedback.trim()) { showToast.error('Please provide revision comments.'); return; }
    if (status === 'rejected' && !feedback.trim()) { showToast.error('Please provide rejection justification.'); return; }
    if (status === 'accepted') {
      const confirmed = await showAlert.confirm('Accept Proposal', 'Accept this proposal?');
      if (!confirmed.isConfirmed) return;
    }
    setActionLoading(id);
    try {
      await processProposalReview(id, { status, feedback: feedback.trim() || undefined });
      showToast.success(`Proposal ${status.replace(/_/g, ' ')}.`);
      setFeedback('');
      setFeedbackFor(null);
      fetchProposals();
    } catch (err) { showToast.error(err?.response?.data?.message || 'Failed.'); }
    finally { setActionLoading(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Proposal Reviews</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Review proposals submitted by groups. Accept, request revisions, or reject.</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> {pending} pending</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {accepted} accepted</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[{ key: 'all', label: 'All' }, ...Object.entries(STATUS_MAP).map(([k, v]) => ({ key: k, label: v.label }))].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              filter === f.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-gray-200 hover:bg-blue-50'
            }`}>{f.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
      ) : error ? (
        <div className="flex flex-col items-center gap-2 py-12 text-slate-400">
          <AlertCircle className="w-8 h-8" />
          <p className="text-sm font-bold">{error}</p>
          <button onClick={fetchProposals} className="text-xs text-blue-600 font-bold hover:underline cursor-pointer bg-transparent border-0">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-slate-400">
          <BookOpen className="w-8 h-8" />
          <p className="text-sm font-bold">No {filter === 'all' ? '' : `${STATUS_MAP[filter]?.label || ''} `}proposals found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(p => {
            const isPending = p.status === 'submitted' || p.status === 'under_review';
            return (
              <div key={p.id} className="card overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText size={15} className="text-slate-400 flex-shrink-0" />
                        <h3 className="font-bold text-slate-900 text-base truncate">{p.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="font-medium">{p.groupName}</span>
                        <span>·</span>
                        <span>by {p.submittedBy}</span>
                        {p.members.length > 0 && <><span>·</span><span className="flex items-center gap-1"><Users size={12} /> {p.members.length} member{p.members.length !== 1 ? 's' : ''}</span></>}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border whitespace-nowrap ${STATUS_MAP[p.status]?.color || ''}`}>
                      {STATUS_MAP[p.status]?.label || p.status}
                    </span>
                  </div>

                  {p.feedback && (
                    <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-slate-600 mb-3">
                      <span className="font-bold text-slate-800">Feedback: </span>{p.feedback}
                    </div>
                  )}

                  {isPending && feedbackFor === p.id && (
                    <div className="mb-3">
                      <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
                        placeholder="Enter revision comments or rejection justification..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500 transition-all h-20" />
                    </div>
                  )}

                  {isPending && (
                    <div className="flex gap-2 pt-3 border-t border-line">
                      <button onClick={() => { setFeedbackFor(p.id); handleAction(p.id, 'accepted'); }}
                        disabled={actionLoading === p.id}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer disabled:opacity-50">
                        {actionLoading === p.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={13} />}
                        Accept
                      </button>
                      <button onClick={() => setFeedbackFor(feedbackFor === p.id ? null : p.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-all cursor-pointer">
                        <MessageSquare size={13} /> Request Revisions
                      </button>
                      {feedbackFor === p.id && (
                        <button onClick={() => handleAction(p.id, 'revisions_requested')}
                          disabled={actionLoading === p.id || !feedback.trim()}
                          className="px-3 py-2 bg-amber-700 text-white rounded-xl text-xs font-bold hover:bg-amber-800 transition-all cursor-pointer disabled:opacity-50">
                          Submit
                        </button>
                      )}
                      <button onClick={() => { setFeedbackFor(p.id); handleAction(p.id, 'rejected'); }}
                        disabled={actionLoading === p.id}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white text-rose-600 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-50 transition-all cursor-pointer disabled:opacity-50">
                        <X size={13} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InchargeSupervisionRequests;
