import React, { useEffect, useState } from 'react';
import { getPendingOfficeApprovals, getOfficeApprovalHistory, approveOfficeApproval, rejectOfficeApproval, getPendingSupervisorIdeas, getSupervisorIdeasHistory, approveSupervisorIdea, rejectSupervisorIdea } from '../../services/officeApprovals.service';
import { showToast as toast } from '../../components/AppToast';
import { X, Check, CheckCircle, Users, ThumbsDown, Clock, History, Loader2, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProjectApprovalsSkeleton } from '../../components/Skeleton';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const TAB_CONFIG = {
  pending: { label: 'Pending', icon: Clock },
  history: { label: 'History', icon: History },
  supervisorIdeas: { label: 'Supervisor Ideas', icon: Lightbulb }
};

const STATUS_MAP = {
  supervisor_approved: { label: 'Pending Office Review', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  fyp_office_approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  fyp_office_rejected: { label: 'Rejected', color: 'bg-rose-50 text-rose-600 border-rose-200', icon: ThumbsDown }
};

export default function OfficeApprovals() {
  const [activeTab, setActiveTab] = useState('pending');
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [supervisorIdeas, setSupervisorIdeas] = useState([]);
  const [supervisorIdeasHistory, setSupervisorIdeasHistory] = useState([]);
  const [siView, setSiView] = useState('pending');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pending') {
        const res = await getPendingOfficeApprovals();
        setPending(res.data || []);
      } else if (activeTab === 'history') {
        const res = await getOfficeApprovalHistory();
        setHistory(res.data || []);
      } else if (activeTab === 'supervisorIdeas') {
        const [sip, sih] = await Promise.all([
          getPendingSupervisorIdeas(),
          getSupervisorIdeasHistory()
        ]);
        setSupervisorIdeas(sip.data || []);
        setSupervisorIdeasHistory(sih.data || []);
      }
    } catch {
      toast.error('Failed to load approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (ideaId) => {
    setActionLoading(ideaId);
    try {
      await approveOfficeApproval(ideaId, feedback[ideaId] || '');
      toast.success('Project approved successfully');
      setFeedback(p => ({ ...p, [ideaId]: '' }));
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (ideaId) => {
    const reason = feedback[ideaId]?.trim();
    if (!reason) { toast.error('Please provide feedback for rejection'); return; }
    setActionLoading(ideaId);
    try {
      await rejectOfficeApproval(ideaId, reason);
      toast.success('Project rejected');
      setFeedback(p => ({ ...p, [ideaId]: '' }));
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const currentList = activeTab === 'pending' ? pending : history;

  const handleSIApprove = async (ideaId) => {
    setActionLoading(ideaId);
    try {
      await approveSupervisorIdea(ideaId, feedback[ideaId] || '');
      toast.success('Idea approved.');
      setFeedback(p => ({ ...p, [ideaId]: '' }));
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSIReject = async (ideaId) => {
    const reason = feedback[ideaId]?.trim();
    if (!reason) { toast.error('Please provide feedback for rejection'); return; }
    setActionLoading(ideaId);
    try {
      await rejectSupervisorIdea(ideaId, reason);
      toast.success('Idea rejected.');
      setFeedback(p => ({ ...p, [ideaId]: '' }));
      loadData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Project Approvals</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {activeTab === 'pending'
              ? 'Review and approve/reject projects sent by supervisors for final office approval.'
              : 'View all projects that have been reviewed by the FYP Office.'}
          </p>
        </div>
      </motion.div>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(TAB_CONFIG).map(([key, tab]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeTab === key ? 'bg-btn text-white border-btn' : 'bg-white text-slate-600 border-gray-200 hover:bg-blue-50'
            }`}>
            {React.createElement(tab.icon, { size: 14 })}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab !== 'supervisorIdeas' && (<>
      {loading ? <ProjectApprovalsSkeleton /> : currentList.length === 0 ? (
        <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card p-10 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {activeTab === 'pending' ? <Clock className="text-slate-300" size={28} /> : <History className="text-slate-300" size={28} />}
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {activeTab === 'pending' ? 'No Pending Approvals' : 'No Reviewed Projects'}
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            {activeTab === 'pending'
              ? 'When supervisors approve projects and send them for office approval, they will appear here.'
              : 'Projects reviewed by the FYP Office will appear in the history.'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {currentList.map(idea => {
            const sm = STATUS_MAP[idea.agreementStatus] || STATUS_MAP.supervisor_approved;
            const Icon = sm.icon;
            const isPending = idea.agreementStatus === 'supervisor_approved';

            return (
              <motion.div key={idea._id} variants={item} className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
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

                  {idea.description && (
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">{idea.description}</p>
                  )}

                  {idea.techStack && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {idea.techStack.split(',').map((tag, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-100">{tag.trim()}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-4">
                    <span>Proposed by <strong className="text-slate-700">{idea.submittedBy?.name || 'Unknown'}</strong></span>
                    <span>Supervisor: <strong className="text-slate-700">{idea.group?.supervisor?.name || 'N/A'}</strong></span>
                    {idea.reviewedBy?.name && <span>Reviewed by Supervisor: <strong className="text-slate-700">{idea.reviewedBy.name}</strong></span>}
                    {idea.fypOfficeReviewedBy?.name && (
                      <span>Office Review by: <strong className="text-slate-700">{idea.fypOfficeReviewedBy.name}</strong></span>
                    )}
                  </div>

                  {idea.fypOfficeFeedback && (
                    <div className={`mb-4 p-3 rounded-xl border ${idea.agreementStatus === 'fyp_office_rejected' ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                      <p className={`text-xs font-bold mb-1 ${idea.agreementStatus === 'fyp_office_rejected' ? 'text-red-500' : 'text-emerald-500'}`}>
                        Office Feedback &mdash; {idea.fypOfficeReviewedBy?.name || idea.fypOfficeReviewedByRole || 'Office'}
                      </p>
                      <p className={`text-sm ${idea.agreementStatus === 'fyp_office_rejected' ? 'text-red-700' : 'text-emerald-700'}`}>{idea.fypOfficeFeedback}</p>
                    </div>
                  )}

                  {idea.supervisorFeedback && (
                    <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-line">
                      <p className="text-xs font-bold text-slate-500 mb-1">Supervisor Feedback</p>
                      <p className="text-sm text-slate-700">{idea.supervisorFeedback}</p>
                    </div>
                  )}

                  {idea.fypOfficeReviewedAt && (
                    <p className="text-xs text-slate-400 mb-4">
                      Reviewed on {new Date(idea.fypOfficeReviewedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}

                  {isPending && (
                    <div className="border-t border-line pt-4 mt-2 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Feedback <span className="text-red-500">*</span></label>
                        <textarea
                          value={feedback[idea._id] || ''}
                          onChange={e => setFeedback({ ...feedback, [idea._id]: e.target.value })}
                          placeholder="Provide feedback or approval notes..."
                          className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm min-h-[70px] outline-none focus:ring-2 focus:ring-blue-600/20"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(idea._id)}
                          disabled={actionLoading === idea._id}
                          className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 cursor-pointer border-0"
                        >
                          {actionLoading === idea._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(idea._id)}
                          disabled={actionLoading === idea._id}
                          className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-slate-600 text-xs font-bold rounded-xl border border-line hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {actionLoading === idea._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      </>)}

      {activeTab === 'supervisorIdeas' && (
        <div className="space-y-6">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setSiView('pending')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${siView === 'pending' ? 'bg-btn text-white border-btn' : 'bg-white text-slate-600 border-gray-200 hover:bg-blue-50'}`}>Pending ({supervisorIdeas.length})</button>
            <button onClick={() => setSiView('history')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${siView === 'history' ? 'bg-btn text-white border-btn' : 'bg-white text-slate-600 border-gray-200 hover:bg-blue-50'}`}>History ({supervisorIdeasHistory.length})</button>
          </div>

          {(siView === 'pending' ? supervisorIdeas : supervisorIdeasHistory).length === 0 ? (
            <div className="bg-white rounded-2xl border border-line shadow-card p-10 text-center">
              <Lightbulb className="text-slate-300 mx-auto mb-4" size={28} />
              <p className="text-sm font-bold text-slate-900">No {siView === 'pending' ? 'pending' : 'reviewed'} supervisor ideas.</p>
              <p className="text-xs text-slate-500 mt-1">Ideas submitted by supervisors will appear here for {siView === 'pending' ? 'review' : 'records'}.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(siView === 'pending' ? supervisorIdeas : supervisorIdeasHistory).map(idea => (
                <div key={idea._id} className="bg-white rounded-2xl border border-line shadow-card p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{idea.title}</h3>
                      <p className="text-xs text-slate-500">Supervisor: <strong>{idea.supervisor?.name || 'Unknown'}</strong></p>
                    </div>
                    <span className={`font-bold text-[10px] px-2.5 py-1 rounded-lg border whitespace-nowrap ${idea.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : idea.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{idea.status}</span>
                  </div>
                  {idea.description && <p className="text-sm text-slate-600 mb-3">{idea.description}</p>}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {idea.category && <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-purple-200">{idea.category}</span>}
                    {idea.techStack && idea.techStack.split(',').map((t, i) => <span key={i} className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-100">{t.trim()}</span>)}
                  </div>
                  {idea.fypOfficeFeedback && (
                    <div className={`mb-3 p-3 rounded-xl border ${idea.status === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                      <p className="text-xs font-bold mb-1">Office Feedback:</p>
                      <p className="text-sm">{idea.fypOfficeFeedback}</p>
                    </div>
                  )}
                  {siView === 'pending' && (
                    <div className="border-t border-line pt-4 mt-2 space-y-3">
                      <textarea value={feedback[idea._id] || ''} onChange={e => setFeedback({ ...feedback, [idea._id]: e.target.value })}
                        placeholder="Provide feedback or approval notes..."
                        className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm min-h-[70px] outline-none" />
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleSIApprove(idea._id)} disabled={actionLoading === idea._id}
                          className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 cursor-pointer border-0">
                          {actionLoading === idea._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Approve
                        </button>
                        <button onClick={() => handleSIReject(idea._id)} disabled={actionLoading === idea._id}
                          className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-slate-600 text-xs font-bold rounded-xl border border-line hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all disabled:opacity-50 cursor-pointer">
                          {actionLoading === idea._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />} Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}