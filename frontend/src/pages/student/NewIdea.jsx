import React, { useState, useEffect } from 'react';
import { getGroupIdeas, getStudentGroup } from '../../services/student.service';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Clock, Lightbulb, Loader, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { motion } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const statusConfig = {
  voting: { label: 'Awaiting Group Votes', icon: Clock, class: 'bg-amber-50 text-amber-700 border-amber-200' },
  agreed: { label: 'Awaiting Supervisor Review', icon: Clock, class: 'bg-blue-50 text-blue-700 border-blue-200' },
  supervisor_approved: { label: 'Approved by Supervisor', icon: CheckCircle, class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  voting_rejected: { label: 'Rejected by Group', icon: ThumbsDown, class: 'bg-red-50 text-red-600 border-red-200' },
  supervisor_rejected: { label: 'Rejected by Supervisor', icon: X, class: 'bg-rose-50 text-rose-600 border-rose-200' }
};

export default function NewIdea() {
  const [activeIdea, setActiveIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    Promise.all([
      getGroupIdeas().then(r => setActiveIdea((r?.data || []).find(i => ['voting', 'agreed', 'supervisor_approved'].includes(i.agreementStatus)) || null)).catch(() => {}),
      getStudentGroup().then(r => setGroup(r?.data || null)).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <motion.div variants={container} initial="hidden" animate="show" className="animate-in fade-in slide-in- duration-300 max-w-3xl mx-auto">
        <div className="space-y-6 animate-pulse bg-white border border-line rounded-2xl p-6 shadow-card">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-10 w-full rounded-xl" />
          <div className="skeleton h-32 w-full rounded-xl" />
        </div>
      </motion.div>
    );
  }

  if (!group) {
    return (
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto">
        <motion.div variants={item} className="bg-white border border-line rounded-2xl p-6 shadow-card text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="text-blue-600" size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Group Yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">You need to be in an FYP group to propose ideas.</p>
          <Link to="/fyp-group" className="btn-primary mt-6 inline-flex items-center gap-1.5 no-underline">
            Form a Group
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  if (activeIdea) {
    const cfg = statusConfig[activeIdea.agreementStatus] || { label: activeIdea.agreementStatus, icon: Clock, class: 'bg-slate-50 text-slate-600 border-slate-200' };
    const StatusIcon = cfg.icon;
    const agreeCount = activeIdea.votes?.filter(v => v.decision === 'agree').length || 0;
    const totalMembers = group.members?.length || 0;

    return (
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item} className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
          <AlertTriangle className="text-amber-600 w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Idea in Progress</h3>
            <p className="text-xs text-slate-600 mt-0.5">Your group already has an active idea. You can only submit a new one after this idea is resolved.</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white border border-line rounded-2xl p-6 shadow-card">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-1">{activeIdea.title}</h3>
              <p className="text-xs text-slate-500">Proposed by {activeIdea.submittedBy?.name || 'Unknown'}</p>
            </div>
            <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border shrink-0 ${cfg.class}`}>
              <StatusIcon size={14} />
              {cfg.label}
            </span>
          </div>

          {activeIdea.description && (
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">{activeIdea.description}</p>
          )}

          {activeIdea.techStack && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeIdea.techStack.split(',').map((tag, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-100">{tag.trim()}</span>
              ))}
            </div>
          )}

          <div className="border-t border-line pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agreement — {agreeCount}/{totalMembers}</p>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${(agreeCount / Math.max(totalMembers, 1)) * 100}%` }} />
              </div>
            </div>
            {activeIdea.agreementStatus === 'supervisor_approved' && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-sm font-bold text-emerald-700">
                <CheckCircle size={16} /> This idea has been approved by your supervisor. No further proposals needed.
              </div>
            )}
            {activeIdea.agreementStatus === 'voting' && (
              <Link to="/project/group-ideas" className="btn-primary text-xs inline-flex items-center gap-1.5 no-underline">
                Vote Now
              </Link>
            )}
            {activeIdea.agreementStatus === 'agreed' && (
              <p className="text-xs text-slate-500 font-medium">Waiting for your supervisor to review this idea.</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto">
      <motion.div variants={item} className="bg-white border border-line rounded-2xl p-6 shadow-card">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Submit a Group Idea</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-slate-600">
            Your group has no active ideas. Propose a new idea below — all group members must agree before it goes to your supervisor.
          </p>
        </div>
        <Link to="/project/group-ideas" className="btn-primary inline-flex items-center gap-1.5 no-underline">
          <Lightbulb size={16} /> Go to Group Ideas
        </Link>
      </motion.div>
    </motion.div>
  );
}
