import React, { useEffect, useState } from 'react';
import { getFacultySuggestions, suggestIdeaToGroup, getFacultySupervisedGroups } from '../../services/faculty.service';
import { submitSupervisorIdea, getSupervisorIdeas, getSupervisorIdeaRequests, respondToSupervisorIdeaRequest } from '../../services/supervisorIdea.service';
import { showToast } from '../../components/AppToast';
import { Lightbulb, Users, Loader2, Check, X, Clock, Plus, BookOpen, Code, ChevronDown, ChevronUp, Send, Eye } from 'lucide-react';

const CATEGORIES = [
  'Artificial Intelligence & ML',
  'Web Development',
  'Mobile Applications',
  'Internet of Things (IoT)',
  'Blockchain & Web3',
  'Cybersecurity',
  'Data Science & Analytics',
  'Cloud Computing & DevOps',
  'Computer Vision',
  'Natural Language Processing',
  'Game Development',
  'Embedded Systems',
  'Database Systems',
  'Software Engineering',
  'Other'
];

const STATUS_BADGE = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  accepted: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200'
};

const FacultySuggestions = () => {
  const [activeTab, setActiveTab] = useState('groups');
  const [suggestions, setSuggestions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [officeIdeas, setOfficeIdeas] = useState([]);
  const [officeRequests, setOfficeRequests] = useState([]);
  const [showOfficeForm, setShowOfficeForm] = useState(false);
  const [officeSubmitting, setOfficeSubmitting] = useState(false);
  const [loadingOffice, setLoadingOffice] = useState(false);
  const [respondingReq, setRespondingReq] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sugRes, grpRes] = await Promise.all([
        getFacultySuggestions(),
        getFacultySupervisedGroups()
      ]);
      setSuggestions(sugRes.data || []);
      setGroups(Array.isArray(grpRes.data) ? grpRes.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const fetchOfficeData = async () => {
    setLoadingOffice(true);
    try {
      const [ideasRes, reqsRes] = await Promise.all([
        getSupervisorIdeas(),
        getSupervisorIdeaRequests()
      ]);
      setOfficeIdeas(ideasRes.data || []);
      setOfficeRequests(reqsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOffice(false);
    }
  };

  useEffect(() => { if (activeTab === 'office') fetchOfficeData(); }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      groupId: formData.get('groupId'),
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      techStack: formData.get('techStack')
    };
    if (!payload.groupId || !payload.title) {
      showToast.error('Please select a group and provide a title.');
      return;
    }
    setSubmitting(true);
    try {
      await suggestIdeaToGroup(payload);
      showToast.success('Idea suggested successfully!');
      setShowForm(false);
      fetchData();
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to suggest idea.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOfficeSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      category: formData.get('category'),
      techStack: formData.get('techStack')
    };
    if (!payload.title) {
      showToast.error('Please provide a title.');
      return;
    }
    setOfficeSubmitting(true);
    try {
      await submitSupervisorIdea(payload);
      showToast.success('Idea submitted to FYP Office.');
      setShowOfficeForm(false);
      fetchOfficeData();
      e.target.reset();
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to submit.');
    } finally {
      setOfficeSubmitting(false);
    }
  };

  const handleRespondReq = async (requestId, action) => {
    setRespondingReq(requestId);
    try {
      await respondToSupervisorIdeaRequest(requestId, action);
      showToast.success(`Request ${action === 'accepted' ? 'accepted' : 'rejected'}.`);
      fetchOfficeData();
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed.');
    } finally {
      setRespondingReq(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Suggested Ideas</h2>
          <p className="text-xs text-slate-900 mt-0.5 font-medium">Suggest project ideas and track responses</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('groups')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === 'groups' ? 'bg-btn text-white border-btn' : 'bg-white text-slate-600 border-gray-200 hover:bg-blue-50'}`}>Group Suggestions</button>
          <button onClick={() => setActiveTab('office')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${activeTab === 'office' ? 'bg-btn text-white border-btn' : 'bg-white text-slate-600 border-gray-200 hover:bg-blue-50'}`}>FYP Office Ideas</button>
        </div>
      </div>

      {activeTab === 'groups' && (<>
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-btn hover:bg-btn-hover text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            {showForm ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Close' : 'New Suggestion'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-line">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <Lightbulb size={16} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Suggest New Project Idea</h3>
                <p className="text-[10px] text-slate-400">Propose a project idea to one of your supervised groups</p>
              </div>
            </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Target Group *</label>
                <div className="relative">
                  <Users size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    name="groupId"
                    className="w-full bg-white border border-line rounded-xl pl-9 pr-9 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select a supervised group...</option>
                    {groups.filter(g => g.status !== 'completed' && g.status !== 'rejected').map(g => (
                      <option key={g.groupId} value={g.groupId}>
                        {g.name} — {g.title} ({g.members.length} members)
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Category *</label>
                <div className="relative">
                  <BookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    name="category"
                    className="w-full bg-white border border-line rounded-xl pl-9 pr-9 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select category...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">Tech Stack</label>
              <div className="relative">
                <Code size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="techStack"
                  placeholder="e.g. React, Node.js, MongoDB"
                  className="w-full bg-white border border-line rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">Idea Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. AI-Powered Healthcare Diagnostic System"
                className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">Description</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe the project idea in detail — objectives, scope, expected outcomes..."
                className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <Lightbulb size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-blue-800">Tip</p>
                  <p className="text-[10px] text-blue-600 mt-0.5">Provide a clear title and detailed description. The group will be notified immediately and can accept or reject your suggestion.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 hover:bg-gray-50 transition-colors cursor-pointer border border-line"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-btn hover:bg-btn-hover text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                <Lightbulb size={14} /> Suggest Idea
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-slate-500 font-medium">Loading suggestions...</span>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
          <Lightbulb className="w-10 h-10" />
          <p className="text-sm font-bold">No suggestions made yet.</p>
          <p className="text-xs">Click "New Suggestion" to propose a project idea to one of your groups.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-line p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
                <span className={`font-bold text-[10px] px-2.5 py-1 rounded-lg border whitespace-nowrap ${STATUS_BADGE[s.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  {s.status}
                </span>
              </div>
              {s.description && (
                <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-3">{s.description}</p>
              )}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {s.category && (
                  <span className="bg-purple-50 text-purple-700 font-bold text-[10px] px-2 py-1 rounded-lg border border-purple-200 flex items-center gap-1">
                    <BookOpen size={10} /> {s.category}
                  </span>
                )}
                {s.techStack && s.techStack.split(',').map((t, i) => (
                  <span key={i} className="bg-gray-50 text-slate-900 font-bold text-[10px] px-2 py-1 rounded-lg border border-line">{t.trim()}</span>
                ))}
              </div>
              <div className="pt-3 border-t border-line space-y-2">
                {s.group && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Users size={12} />
                    <span className="font-medium">{s.group.name}</span>
                    {s.group.members?.length > 0 && (
                      <span className="text-gray-300">|</span>
                    )}
                    {s.group.members?.map((m, i) => (
                      <span key={i} className="text-gray-400 text-[10px]">{m.name}{i < s.group.members.length - 1 ? ',' : ''}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <Clock size={10} />
                  <span>{new Date(s.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  <span className={`font-bold px-2 py-0.5 rounded-full ${
                    s.status === 'pending' ? 'text-amber-600' : s.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {s.status === 'pending' && <><Clock size={10} className="inline mr-0.5" /> Awaiting response</>}
                    {s.status === 'accepted' && <><Check size={10} className="inline mr-0.5" /> Accepted by group</>}
                    {s.status === 'rejected' && <><X size={10} className="inline mr-0.5" /> Rejected by group</>}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </>)}

      {activeTab === 'office' && (<>
        <div className="flex justify-end">
          <button
            onClick={() => setShowOfficeForm(!showOfficeForm)}
            className="bg-btn hover:bg-btn-hover text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            {showOfficeForm ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showOfficeForm ? 'Close' : 'Submit to FYP Office'}
          </button>
        </div>

        {showOfficeForm && (
          <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-line">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Send size={16} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Submit Project Idea to FYP Office</h3>
                <p className="text-[10px] text-slate-400">Once approved, students can browse and request your idea</p>
              </div>
            </div>
            <form onSubmit={handleOfficeSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Title *</label>
                  <input type="text" name="title" placeholder="e.g. AI-Powered Healthcare Diagnostic System" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Category *</label>
                  <div className="relative">
                    <BookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select name="category" className="w-full bg-white border border-line rounded-xl pl-9 pr-9 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer" required>
                      <option value="">Select category...</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Tech Stack</label>
                <div className="relative">
                  <Code size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" name="techStack" placeholder="e.g. React, Node.js, MongoDB" className="w-full bg-white border border-line rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Description</label>
                <textarea name="description" rows={4} placeholder="Describe the project idea in detail..." className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all resize-none" />
              </div>
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex items-start gap-3">
                  <Eye size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-indigo-800">How it works</p>
                    <p className="text-[10px] text-indigo-600 mt-0.5">The FYP Office will review your idea. Once approved, it will appear in a public pool where students can browse and request to work on it.</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button type="button" onClick={() => setShowOfficeForm(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 hover:bg-gray-50 transition-colors cursor-pointer border border-line">Cancel</button>
                <button type="submit" disabled={officeSubmitting} className="bg-btn hover:bg-btn-hover text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2">
                  {officeSubmitting && <Loader2 size={14} className="animate-spin" />}
                  <Send size={14} /> Submit
                </button>
              </div>
            </form>
          </div>
        )}

        {loadingOffice ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {officeIdeas.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
                <Send className="w-10 h-10" />
                <p className="text-sm font-bold">No ideas submitted yet.</p>
                <p className="text-xs">Submit a project idea for FYP Office review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {officeIdeas.map(idea => (
                  <div key={idea.id} className="bg-white rounded-2xl border border-line p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-bold text-slate-900 text-base">{idea.title}</h3>
                      <span className={`font-bold text-[10px] px-2.5 py-1 rounded-lg border whitespace-nowrap ${STATUS_BADGE[idea.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {idea.status}
                      </span>
                    </div>
                    {idea.description && (
                      <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-3">{idea.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {idea.category && (
                        <span className="bg-purple-50 text-purple-700 font-bold text-[10px] px-2 py-1 rounded-lg border border-purple-200 flex items-center gap-1">
                          <BookOpen size={10} /> {idea.category}
                        </span>
                      )}
                      {idea.techStack && idea.techStack.split(',').map((t, i) => (
                        <span key={i} className="bg-gray-50 text-slate-900 font-bold text-[10px] px-2 py-1 rounded-lg border border-line">{t.trim()}</span>
                      ))}
                    </div>
                    {idea.fypOfficeFeedback && (
                      <div className="mb-3 p-2.5 rounded-lg bg-slate-50 border border-line">
                        <p className="text-[10px] font-bold text-slate-500 mb-0.5">FYP Office Feedback:</p>
                        <p className="text-xs text-slate-600">{idea.fypOfficeFeedback}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <Clock size={10} />
                      <span>{new Date(idea.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>

                    {idea.status === 'approved' && officeRequests.filter(r => r.idea && r.idea.id === idea.id).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-line">
                        <p className="text-[10px] font-bold text-slate-500 mb-2">Student Requests:</p>
                        {officeRequests.filter(r => r.idea && r.idea.id === idea.id).map(req => (
                          <div key={req.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-line mb-1.5">
                            <div>
                              <p className="text-[10px] font-bold text-slate-700">{req.student?.name}</p>
                              <p className="text-[9px] text-slate-400">{req.group?.name}</p>
                              {req.message && <p className="text-[9px] text-slate-500 italic">{req.message}</p>}
                            </div>
                            <div className="flex gap-1.5 flex-shrink-0">
                              {req.status === 'pending' ? (<>
                                <button onClick={() => handleRespondReq(req.id, 'accepted')} disabled={respondingReq === req.id}
                                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-all cursor-pointer disabled:opacity-50">
                                  {respondingReq === req.id ? <Loader2 size={10} className="animate-spin" /> : 'Accept'}
                                </button>
                                <button onClick={() => handleRespondReq(req.id, 'rejected')} disabled={respondingReq === req.id}
                                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all cursor-pointer disabled:opacity-50">
                                  Reject
                                </button>
                              </>) : (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${req.status === 'accepted' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                  {req.status === 'accepted' ? <><Check size={10} className="inline mr-0.5" /> Accepted</> : <><X size={10} className="inline mr-0.5" /> Rejected</>}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </>)}
    </div>
  );
};

export default FacultySuggestions;
