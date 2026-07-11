import React, { useState, useEffect, useRef } from 'react';
import { submitGroupIdea, getGroupIdeas, voteOnGroupIdea, getStudentGroup, generateAIDescription, getAvailableSupervisors, resubmitGroupIdea } from '../../services/student.service';
import { getApprovedSupervisorIdeas, requestSupervisorIdea } from '../../services/studentSupervisorIdea.service';
import { showToast as toast } from '../../components/AppToast';
import { IDEA_STATUS_MAP as statusConfig } from '../../utils/constants/status.constant';
import { getUserInfo } from '../../utils/app.utils';
import { Check, ChevronDown, ChevronUp, Clock, Lightbulb, Loader, Plus, RefreshCw, Sparkles, ThumbsDown, ThumbsUp, Upload, X, Send, BookOpen, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const PROJECT_FIELDS = [
  'Artificial Intelligence', 'Machine Learning', 'Deep Learning',
  'Data Science', 'Web Development', 'Mobile Development',
  'Cybersecurity', 'Cloud Computing', 'DevOps', 'Blockchain',
  'Internet of Things (IoT)', 'Computer Vision', 'Natural Language Processing',
  'Robotics', 'Game Development', 'Database Systems', 'Software Engineering',
  'Network Engineering', 'Augmented Reality (AR)', 'Virtual Reality (VR)',
  'Embedded Systems', 'Bioinformatics', 'Human-Computer Interaction',
  'Distributed Systems', 'Quantum Computing', 'Big Data Analytics',
  'Edge Computing', 'Voice/Audio Processing', 'Recommender Systems',
  'Information Retrieval',
];


export default function GroupIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: '', description: '', fields: [], techStack: [], selectedSupervisor: null });
  const [techInput, setTechInput] = useState('');
  const [fieldInput, setFieldInput] = useState('');
  const [showFieldDropdown, setShowFieldDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resubmitIdea, setResubmitIdea] = useState({ description: '', techStack: [] });
  const [resubmitTechInput, setResubmitTechInput] = useState('');
  const [resubmitting, setResubmitting] = useState(null);
  const [voting, setVoting] = useState({});
  const [generating, setGenerating] = useState(false);
  const [aiRemaining, setAiRemaining] = useState(null);
  const [filter, setFilter] = useState('fyp_approved');
  const [supervisors, setSupervisors] = useState([]);
  const [loadingSupervisors, setLoadingSupervisors] = useState(false);
  const [showSupervisorDropdown, setShowSupervisorDropdown] = useState(false);
  const [supervisorSearch, setSupervisorSearch] = useState('');
  const [showApprovedIdeas, setShowApprovedIdeas] = useState(false);
  const [approvedIdeas, setApprovedIdeas] = useState([]);
  const [loadingApproved, setLoadingApproved] = useState(false);
  const [requestingId, setRequestingId] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (showApprovedIdeas) loadApprovedIdeas();
  }, [showApprovedIdeas]);

  const loadApprovedIdeas = async () => {
    setLoadingApproved(true);
    try {
      const res = await getApprovedSupervisorIdeas();
      setApprovedIdeas(res.data || []);
    } catch {
      toast.error('Failed to load approved ideas');
    } finally {
      setLoadingApproved(false);
    }
  };

  const handleRequestIdea = async (ideaId) => {
    setRequestingId(ideaId);
    try {
      await requestSupervisorIdea(ideaId, '');
      toast.success('Request sent to supervisor.');
      loadApprovedIdeas();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to request');
    } finally {
      setRequestingId(null);
    }
  };

  useEffect(() => {
    if (showForm) {
      loadSupervisors();
    }
  }, [showForm]);

  const loadSupervisors = async () => {
    setLoadingSupervisors(true);
    try {
      const res = await getAvailableSupervisors();
      setSupervisors(res || []);
    } catch {
      toast.error('Failed to load supervisors');
    } finally {
      setLoadingSupervisors(false);
    }
  };

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
      formData.append('fields', newIdea.fields.join(', '));
      formData.append('techStack', newIdea.techStack.join(', '));
      if (newIdea.documentFile) formData.append('document', newIdea.documentFile);
      if (newIdea.selectedSupervisor) formData.append('supervisorId', newIdea.selectedSupervisor);
      const res = await submitGroupIdea(formData);
      toast.success(res.message);
      setNewIdea({ title: '', description: '', fields: [], techStack: [], selectedSupervisor: null, documentFile: null });
      setSupervisorSearch('');
      setShowForm(false);
      const ideasRes = await getGroupIdeas();
      setIdeas(ideasRes?.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit idea');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResubmit = async (ideaId) => {
    const idea = ideas.find(i => i._id === ideaId);
    if (!idea) return;
    setResubmitting(ideaId);
    try {
      const formData = new FormData();
      formData.append('description', resubmitIdea.description || idea.description || '');
      formData.append('techStack', (resubmitIdea.techStack.length ? resubmitIdea.techStack : (idea.techStack ? idea.techStack.split(',').map(t => t.trim()).filter(Boolean) : [])).join(', '));
      formData.append('fields', idea.fields || '');
      if (resubmitIdea.documentFile) formData.append('document', resubmitIdea.documentFile);
      const res = await resubmitGroupIdea(ideaId, formData);
      toast.success(res.message);
      setResubmitIdea({ description: '', techStack: [], documentFile: null });
      setResubmitTechInput('');
      setResubmitting(null);
      const ideasRes = await getGroupIdeas();
      setIdeas(ideasRes?.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to resubmit idea');
      setResubmitting(null);
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

  const currentUser = getUserInfo();
  const currentUserId = currentUser?._id || currentUser?.id || '';

  const getMyVote = (idea) => {
    if (!currentUserId) return null;
    const vote = idea.votes?.find(v => v.member?.user?._id === currentUserId);
    return vote?.decision || null;
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
            className="bg-btn hover:bg-btn-hover text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-0 cursor-pointer flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-blue-500"
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
              <label className="block text-sm font-bold text-slate-900 mb-1.5">
                Field / Domain <span className="text-xs font-normal text-slate-400">({newIdea.fields.length}/3 selected)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {newIdea.fields.map((field, i) => (
                  <span key={i} className="flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-purple-200">
                    {field}
                    <button type="button" onClick={() => setNewIdea({ ...newIdea, fields: newIdea.fields.filter((_, j) => j !== i) })}
                      className="bg-transparent border-0 p-0 text-purple-500 hover:text-purple-700 cursor-pointer text-xs">×</button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={fieldInput}
                  onChange={e => {
                    setFieldInput(e.target.value);
                    setShowFieldDropdown(true);
                  }}
                  onFocus={() => setShowFieldDropdown(true)}
                  onBlur={() => setTimeout(() => setShowFieldDropdown(false), 200)}
                  className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  placeholder="Search and select project fields..."
                  disabled={newIdea.fields.length >= 3}
                />
                {showFieldDropdown && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-line rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {PROJECT_FIELDS.filter(f =>
                      f.toLowerCase().includes(fieldInput.toLowerCase()) && !newIdea.fields.includes(f)
                    ).length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-400">No matching fields</div>
                    ) : (
                      PROJECT_FIELDS.filter(f =>
                        f.toLowerCase().includes(fieldInput.toLowerCase()) && !newIdea.fields.includes(f)
                      ).map(f => (
                        <button
                          key={f}
                          type="button"
                          onMouseDown={e => {
                            e.preventDefault();
                            if (newIdea.fields.length < 3) {
                              setNewIdea({ ...newIdea, fields: [...newIdea.fields, f] });
                              setFieldInput('');
                            }
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer border-0 bg-transparent"
                        >
                          {f}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1.5">
                Request Supervisor <span className="text-xs font-normal text-slate-400">(select who should supervise this project)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={supervisorSearch}
                  onChange={e => {
                    setSupervisorSearch(e.target.value);
                    setShowSupervisorDropdown(true);
                  }}
                  onFocus={() => setShowSupervisorDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSupervisorDropdown(false), 200)}
                  className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  placeholder={loadingSupervisors ? 'Loading supervisors...' : 'Search for a supervisor...'}
                  disabled={loadingSupervisors}
                />
                {newIdea.selectedSupervisor && (
                  <div className="mt-2 flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-2 rounded-lg border border-emerald-200">
                    <Check size={14} />
                    <span>
                      Selected: {supervisors.find(s => s.id === newIdea.selectedSupervisor)?.name || 'Supervisor'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setNewIdea({ ...newIdea, selectedSupervisor: null });
                        setSupervisorSearch('');
                      }}
                      className="ml-auto bg-transparent border-0 p-0 text-emerald-500 hover:text-emerald-700 cursor-pointer text-xs font-bold"
                    >
                      ×
                    </button>
                  </div>
                )}
                {showSupervisorDropdown && !newIdea.selectedSupervisor && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-line rounded-xl shadow-lg max-h-56 overflow-y-auto">
                    {supervisors.filter(s =>
                      s.available && (
                        !supervisorSearch ||
                        s.name.toLowerCase().includes(supervisorSearch.toLowerCase()) ||
                        s.email.toLowerCase().includes(supervisorSearch.toLowerCase())
                      )
                    ).length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-400">
                        {supervisors.length === 0 ? 'No supervisors available' : 'No matching supervisors'}
                      </div>
                    ) : (
                      supervisors.filter(s =>
                        s.available && (
                          !supervisorSearch ||
                          s.name.toLowerCase().includes(supervisorSearch.toLowerCase()) ||
                          s.email.toLowerCase().includes(supervisorSearch.toLowerCase())
                        )
                      ).map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onMouseDown={e => {
                            e.preventDefault();
                            setNewIdea({ ...newIdea, selectedSupervisor: s.id });
                            setSupervisorSearch(s.name);
                            setShowSupervisorDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {s.avatar || s.name.charAt(0).toUpperCase()}
                            </span>
                            <div className="text-left min-w-0">
                              <div className="font-medium truncate">{s.name}</div>
                              <div className="text-[10px] text-slate-400 truncate">{s.email}</div>
                            </div>
                          </div>
                          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.currentGroups < s.maxGroups ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                            {s.currentGroups}/{s.maxGroups} groups
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
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
                  className="px-4 py-2.5 bg-btn text-white rounded-xl text-sm font-bold hover:bg-btn-hover transition-all cursor-pointer disabled:opacity-50 border-0">Add</button>
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
                className="bg-btn hover:bg-btn-hover text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-blue-500"
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
          ...Object.entries(statusConfig).map(([k, v]) => ({ key: k, label: `${v.label} (${ideas.filter(i => i.agreementStatus === k).length || 0})`, color: v.color.split(' ')[0] }))
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              filter === f.key ? 'bg-btn text-white border-btn' : 'bg-white text-slate-600 border-gray-200 hover:bg-blue-50'
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
            const allowedForVoting = ['voting', 'agreed', 'voting_rejected'];
            const canVote = allowedForVoting.includes(idea.agreementStatus) && !myVote;

            return (
              <motion.div key={idea._id} variants={item} className="bg-white rounded-2xl border border-line shadow-card p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{idea.title}</h3>
                    <p className="text-sm text-slate-500">
                      Proposed by {idea.submittedBy?.name || 'Unknown'}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border shrink-0 ${statusConfig[idea.agreementStatus]?.color || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    <StatusIcon size={14} />
                    {statusConfig[idea.agreementStatus]?.label || idea.agreementStatus}
                  </span>
                </div>

                {idea.description && (
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{idea.description}</p>
                )}

                {idea.fields && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {idea.fields.split(',').map((field, i) => (
                      <span key={i} className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-purple-100">
                        {field.trim()}
                      </span>
                    ))}
                  </div>
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

                {idea.agreementStatus === 'needs_improvement' && (
                  <div className="mb-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                        <RefreshCw size={16} className="text-orange-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-orange-700 mb-1">Supervisor Requested Changes</p>
                        <p className="text-sm text-orange-800 mb-3">{idea.supervisorFeedback || 'Please improve your proposal based on the feedback.'}</p>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">Updated Description</label>
                            <textarea
                              value={resubmitIdea.description}
                              onChange={e => setResubmitIdea(p => ({ ...p, description: e.target.value }))}
                              className="w-full bg-white border border-orange-200 rounded-xl px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                              placeholder={idea.description || 'Improve your project description...'}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">Technology Stack</label>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {(resubmitIdea.techStack.length ? resubmitIdea.techStack : (idea.techStack ? idea.techStack.split(',').map(t => t.trim()).filter(Boolean) : [])).map((tag, i) => (
                                <span key={i} className="flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-lg border border-orange-200">
                                  {tag}
                                  <button type="button" onClick={() => {
                                    const current = resubmitIdea.techStack.length ? resubmitIdea.techStack : (idea.techStack ? idea.techStack.split(',').map(t => t.trim()).filter(Boolean) : []);
                                    setResubmitIdea(p => ({ ...p, techStack: current.filter((_, j) => j !== i) }));
                                  }} className="bg-transparent border-0 p-0 text-orange-500 hover:text-orange-700 cursor-pointer text-xs">×</button>
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <input type="text" value={resubmitTechInput} onChange={e => setResubmitTechInput(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault();
                                    const val = resubmitTechInput.trim();
                                    if (val) {
                                      const current = resubmitIdea.techStack.length ? resubmitIdea.techStack : (idea.techStack ? idea.techStack.split(',').map(t => t.trim()).filter(Boolean) : []);
                                      if (!current.includes(val)) setResubmitIdea(p => ({ ...p, techStack: [...current, val] }));
                                    }
                                    setResubmitTechInput('');
                                  }
                                }}
                                className="flex-1 bg-white border border-orange-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                                placeholder="Add technology..." />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">Updated Document (optional)</label>
                            <input type="file" accept=".pdf" onChange={e => {
                              const file = e.target.files?.[0];
                              if (file && file.size > 10 * 1024 * 1024) { toast.error('File too large (max 10MB).'); return; }
                              setResubmitIdea(p => ({ ...p, documentFile: file }));
                            }} className="w-full bg-white border border-orange-200 rounded-xl px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 file:text-xs file:font-bold cursor-pointer" />
                          </div>
                          <button
                            onClick={() => handleResubmit(idea._id)}
                            disabled={resubmitting === idea._id}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {resubmitting === idea._id ? <Loader size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                            {resubmitting === idea._id ? 'Resubmitting...' : 'Resubmit Improved Proposal'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {idea.supervisorFeedback && idea.agreementStatus !== 'needs_improvement' && (
                  <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-line">
                    <p className="text-xs font-bold text-slate-500 mb-1">Supervisor Feedback</p>
                    <p className="text-sm text-slate-700">{idea.supervisorFeedback}</p>
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

                <div className="border-t border-line pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Agreement Status &mdash; {agreeCount}/{totalMembers} agreed
                    </p>
                    {allowedForVoting.includes(idea.agreementStatus) && (
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
                      const memberUserId = member?.user?._id || '';
                      const memberVote = idea.votes?.find(v => v.member?.user?._id === memberUserId);
                      const memberName = member?.user?.name || member?.name || 'Unknown';
                      return (
                        <div key={member._id} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border ${memberVote?.decision === 'agree' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : memberVote?.decision === 'disagree' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                          <span className="w-5 h-5 rounded-full bg-inherit flex items-center justify-center text-[10px] font-bold">
                            {memberName.charAt(0).toUpperCase()}
                          </span>
                          <span className="truncate max-w-[80px]">{memberName.split(' ')[0]}</span>
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

                  {myVote && allowedForVoting.includes(idea.agreementStatus) && (
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

      <div className="border-t border-line pt-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Lightbulb size={16} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Browse Approved Ideas</h3>
              <p className="text-[10px] text-slate-400">Project ideas approved by FYP Office that you can request to work on</p>
            </div>
          </div>
          <button onClick={() => setShowApprovedIdeas(!showApprovedIdeas)}
            className="bg-btn hover:bg-btn-hover text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer">
            {showApprovedIdeas ? <ChevronUp size={14} /> : <Eye size={14} />}
            {showApprovedIdeas ? 'Hide' : 'Browse Ideas'}
          </button>
        </div>

        {showApprovedIdeas && (
          loadingApproved ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-slate-400" size={24} />
            </div>
          ) : approvedIdeas.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-slate-400">
              <BookOpen size={24} />
              <p className="text-xs font-bold">No approved ideas available yet.</p>
              <p className="text-[10px]">Ideas submitted by supervisors and approved by FYP Office will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedIdeas.map(idea => (
                <div key={idea.id} className="bg-white rounded-2xl border border-line p-5 shadow-sm hover:shadow-md transition-all">
                  <h3 className="font-bold text-slate-900 text-sm mb-2">{idea.title}</h3>
                  {idea.description && <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-3">{idea.description}</p>}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {idea.category && <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-purple-200">{idea.category}</span>}
                    {idea.techStack && idea.techStack.split(',').map((t, i) => <span key={i} className="bg-gray-50 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-lg border border-line">{t.trim()}</span>)}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-line">
                    <span className="text-[10px] text-slate-400">by <strong className="text-slate-600">{idea.supervisor?.name || 'Unknown'}</strong></span>
                    <div className="flex items-center gap-2">
                      {idea.requested ? (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          idea.requested === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          idea.requested === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                          {idea.requested === 'pending' ? 'Requested' : idea.requested === 'accepted' ? 'Accepted' : 'Rejected'}
                        </span>
                      ) : (
                        <button onClick={() => handleRequestIdea(idea.id)} disabled={requestingId === idea.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-btn text-white text-[10px] font-bold hover:bg-btn-hover transition-all cursor-pointer border-0 disabled:opacity-50">
                          {requestingId === idea.id ? <Loader className="animate-spin" size={12} /> : <Send size={12} />}
                          Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}
