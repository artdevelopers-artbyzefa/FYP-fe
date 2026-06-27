import React, { useState, useEffect, useRef } from 'react';
import { submitGroupIdea, getGroupIdeas, voteOnGroupIdea, getStudentGroup, generateAIDescription } from '../../services/student.service';
import { showToast as toast } from '../../components/AppToast';
import { IDEA_STATUS_MAP as statusConfig } from '../../utils/constants/status.constant';
import { Check, ChevronDown, ChevronUp, Clock, Lightbulb, Loader, Plus, Sparkles, ThumbsDown, ThumbsUp, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function GroupIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: '', description: '', techStack: [] });
  const [techInput, setTechInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [voting, setVoting] = useState({});
  const [generating, setGenerating] = useState(false);
  const [aiRemaining, setAiRemaining] = useState(null);
  const [filter, setFilter] = useState('supervisor_approved');
  const formRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ideasRes, groupRes] = await Promise.all([
        getGroupIdeas(),
        getStudentGroup()
      ]);
      setIdeas(ideasRes?.data || []);
      setGroup(groupRes?.data || null);
    } catch {
      toast.error('Failed to load group ideas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newIdea.title.trim()) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', newIdea.title);
      formData.append('description', newIdea.description);
      formData.append('techStack', newIdea.techStack.join(', '));
      if (newIdea.documentFile) formData.append('document', newIdea.documentFile);
      const res = await submitGroupIdea(formData);
      toast.success(res.message);
      setNewIdea({ title: '', description: '', techStack: [], documentFile: null });
      setShowForm(false);
      const ideasRes = await getGroupIdeas();
      setIdeas(ideasRes?.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit idea');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerate = async () => {
    if (!newIdea.title.trim()) { toast.error('Enter a title first.'); return; }
    setGenerating(true);
    try {
      const res = await generateAIDescription(newIdea.title);
      setNewIdea({ ...newIdea, description: res.data.description });
      setAiRemaining(res.remaining);
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to generate description.');
      if (err?.response?.status === 429) toast.error(err.response.data.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleVote = async (ideaId, decision) => {
    setVoting(p => ({ ...p, [ideaId]: true }));
    try {
      const res = await voteOnGroupIdea(ideaId, decision);
      toast.success(res.message);
      const ideasRes = await getGroupIdeas();
      setIdeas(ideasRes?.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to vote');
    } finally {
      setVoting(p => ({ ...p, [ideaId]: false }));
    }
  };

  const currentStudentId = group?.members?.[0]?._id || '';

  const getMyVote = (idea) => {
    if (!currentStudentId) return null;
    const vote = idea.votes?.find(v => v.member?._id === currentStudentId);
    return vote?.decision || null;
  };

  const getMemberName = (member) => {
    return member?.user?.name || member?.name || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="animate-spin text-slate-900 text-3xl" />
      </div>
    );
  }

  if (!group) {
    return (
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto">
        <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card p-10 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="text-blue-600" size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Group Yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">You need to be in an FYP group to propose and vote on ideas. Form your group first.</p>
        </motion.div>
      </motion.div>
    );
  }

  const groupMemberIds = group.members?.map(m => m._id) || [];
  const totalMembers = groupMemberIds.length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Group Ideas</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {group.name || 'Your group'} &bull; {totalMembers} member{totalMembers !== 1 ? 's' : ''}
          </p>
        </div>
        {!ideas.some(i => i.agreementStatus === 'supervisor_approved') && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-0 cursor-pointer flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Plus size={16} />
            {showForm ? 'Cancel' : 'New Idea'}
          </button>
        )}
      </motion.div>

      {showForm && (
        <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">Propose a Group Idea</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Title</label>
              <input
                type="text"
                value={newIdea.title}
                onChange={e => setNewIdea({ ...newIdea, title: e.target.value })}
                className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                placeholder="e.g., AI-Powered Learning Platform"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-slate-900">Description</label>
                <button type="button" onClick={handleGenerate} disabled={generating || !newIdea.title.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] font-bold hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 border-0">
                  {generating ? <Loader size={11} className="animate-spin" /> : <Sparkles size={11} />}
                  {generating ? 'Generating...' : `Generate with AI${aiRemaining !== null ? ` (${aiRemaining} left)` : ''}`}
                </button>
              </div>
              <textarea
                value={newIdea.description}
                onChange={e => setNewIdea({ ...newIdea, description: e.target.value })}
                className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                placeholder="Describe the problem and your proposed solution..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Technology Stack</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {newIdea.techStack.map((tag, i) => (
                  <span key={i} className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-200">
                    {tag}
                    <button type="button" onClick={() => setNewIdea({ ...newIdea, techStack: newIdea.techStack.filter((_, j) => j !== i) })}
                      className="bg-transparent border-0 p-0 text-blue-500 hover:text-blue-700 cursor-pointer text-xs">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={techInput} onChange={e => setTechInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const val = techInput.trim();
                      if (val && !newIdea.techStack.includes(val)) {
                        setNewIdea({ ...newIdea, techStack: [...newIdea.techStack, val] });
                      }
                      setTechInput('');
                    }
                  }}
                  className="flex-1 bg-white border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  placeholder="Type a technology and press Enter or comma to add..." />
                <button type="button" onClick={() => {
                    const val = techInput.trim();
                    if (val && !newIdea.techStack.includes(val)) {
                      setNewIdea({ ...newIdea, techStack: [...newIdea.techStack, val] });
                    }
                    setTechInput('');
                  }} disabled={!techInput.trim()}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50 border-0">Add</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">Proposal Document (PDF)</label>
              <input type="file" accept=".pdf" onChange={e => {
                const file = e.target.files?.[0];
                if (file && file.size > 10 * 1024 * 1024) { toast.error('File too large (max 10MB).'); return; }
                setNewIdea({ ...newIdea, documentFile: file });
              }} className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:text-xs file:font-bold cursor-pointer" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all border-0 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Upload size={16} />}
                {submitting ? 'Submitting...' : 'Submit Idea'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: `All (${ideas.length})`, color: 'bg-slate-500' },
          ...Object.entries(statusConfig).map(([k, v]) => ({ key: k, label: `${v.label} (${ideas.filter(i => i.agreementStatus === k).length || 0})`, color: v.class.split(' ')[0] }))
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              filter === f.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-gray-200 hover:bg-blue-50'
            }`}>{f.label}</button>
        ))}
      </div>

      {(filter === 'all' ? ideas : ideas.filter(i => i.agreementStatus === filter)).length === 0 ? (
        <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card p-10 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="text-slate-300" size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No {filter === 'all' ? '' : `${statusConfig[filter]?.label || ''} `}Ideas</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">Propose the first idea for your group. All members must agree before it goes to your supervisor.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {(filter === 'all' ? ideas : ideas.filter(i => i.agreementStatus === filter)).map(idea => {
            const StatusIcon = statusConfig[idea.agreementStatus]?.icon || Clock;
            const agreeCount = idea.votes?.filter(v => v.decision === 'agree').length || 0;
            const disagreeCount = idea.votes?.filter(v => v.decision === 'disagree').length || 0;
            const myVote = getMyVote(idea);
            const canVote = idea.agreementStatus === 'voting' && !myVote;

            return (
              <motion.div key={idea._id} variants={item} className="bg-white rounded-2xl border border-line shadow-card p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{idea.title}</h3>
                    <p className="text-sm text-slate-500">
                      Proposed by {idea.submittedBy?.name || 'Unknown'}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border shrink-0 ${statusConfig[idea.agreementStatus]?.class || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    <StatusIcon size={14} />
                    {statusConfig[idea.agreementStatus]?.label || idea.agreementStatus}
                  </span>
                </div>

                {idea.description && (
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{idea.description}</p>
                )}

                {idea.techStack && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {idea.techStack.split(',').map((tag, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-100">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {idea.supervisorFeedback && (
                  <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-line">
                    <p className="text-xs font-bold text-slate-500 mb-1">Supervisor Feedback</p>
                    <p className="text-sm text-slate-700">{idea.supervisorFeedback}</p>
                  </div>
                )}

                <div className="border-t border-line pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Agreement Status &mdash; {agreeCount}/{totalMembers} agreed
                    </p>
                    {idea.agreementStatus === 'voting' && (
                      <span className="text-xs font-bold text-slate-500">{totalMembers - (agreeCount + disagreeCount)} remaining</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${(agreeCount / totalMembers) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-600 w-8 text-right">{totalMembers > 0 ? Math.round((agreeCount / totalMembers) * 100) : 0}%</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {group.members.map(member => {
                      const memberVote = idea.votes?.find(v => v.member?._id === member._id);
                      return (
                        <div key={member._id} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border ${memberVote?.decision === 'agree' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : memberVote?.decision === 'disagree' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                          <span className="w-5 h-5 rounded-full bg-inherit flex items-center justify-center text-[10px] font-bold">
                            {getMemberName(member).charAt(0).toUpperCase()}
                          </span>
                          <span className="truncate max-w-[80px]">{getMemberName(member).split(' ')[0]}</span>
                          {memberVote?.decision === 'agree' && <ThumbsUp size={12} />}
                          {memberVote?.decision === 'disagree' && <ThumbsDown size={12} />}
                          {!memberVote && <Clock size={12} />}
                        </div>
                      );
                    })}
                  </div>

                  {canVote && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVote(idea._id, 'agree')}
                        disabled={voting[idea._id]}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-500"
                      >
                        {voting[idea._id] ? <Loader className="w-4 h-4 animate-spin" /> : <ThumbsUp size={16} />}
                        Agree
                      </button>
                      <button
                        onClick={() => handleVote(idea._id, 'disagree')}
                        disabled={voting[idea._id]}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        {voting[idea._id] ? <Loader className="w-4 h-4 animate-spin" /> : <ThumbsDown size={16} />}
                        Disagree
                      </button>
                    </div>
                  )}

                  {myVote && idea.agreementStatus === 'voting' && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Check size={16} className="text-emerald-500" />
                      You voted <span className="font-bold">{myVote}</span>
                      <button
                        onClick={() => handleVote(idea._id, myVote === 'agree' ? 'disagree' : 'agree')}
                        className="text-blue-600 hover:underline bg-transparent border-0 cursor-pointer text-xs font-bold"
                      >
                        Change vote
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
