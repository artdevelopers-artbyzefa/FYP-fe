import React, { useState, useEffect } from 'react';
import { Users, User, Mail, Calendar, ArrowLeft, ChevronRight, ChevronLeft, BookOpen, Code, FileText, BarChart3, Send, GraduationCap, CheckCircle, AlertTriangle, X, AlertCircle, Check } from 'lucide-react';
import { getForwardedProposals, processForwardedProposal } from '../../services/office-incharge.service';
import { GROUP_STATUS_MAP, IDEA_STATUS_MAP } from '../../utils/constants/status.constant';
import { ForwardedProposalsSkeleton } from '../../components/Skeleton';

const ITEMS_PER_PAGE = 12;

export default function InchargeForwardedProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [officeFeedback, setOfficeFeedback] = useState('');
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [page, setPage] = useState(1);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 4000);
  };

  const handleOfficeDecision = async (decision) => {
    if (decision === 'reject' && !officeFeedback.trim()) return;
    setActionLoading(decision);
    try {
      await processForwardedProposal(selected.id, decision, officeFeedback);
      await load();
      showToast('success', `Proposal ${decision === 'approve' ? 'approved' : 'rejected'} successfully`);
      setView('list');
      setSelected(null);
    } catch (err) {
      showToast('error', err?.response?.data?.message || `Failed to ${decision} proposal`);
    } finally {
      setActionLoading(null);
    }
  };

  const isAlreadyProcessed = selected?.ideas?.some(i => i.status === 'fyp_office_approved' || i.status === 'fyp_office_rejected');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await getForwardedProposals();
      setProposals(res.data || []);
    } catch { setProposals([]); }
    finally { setLoading(false); }
  };

  const totalPages = Math.ceil(proposals.length / ITEMS_PER_PAGE);
  const paginatedProposals = proposals.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getOfficeStatus = (p) => {
    if (!p.ideas) return null;
    const officeIdea = p.ideas.find(i => i.status === 'fyp_office_approved' || i.status === 'fyp_office_rejected');
    return officeIdea ? officeIdea.status : null;
  };

  if (loading) return <ForwardedProposalsSkeleton />;

  if (view === 'detail' && selected) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4">
          <button onClick={() => { setView('list'); setSelected(null); setOfficeFeedback(''); }} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3">
            <ArrowLeft size={14} /> Back to Forwarded Proposals
          </button>
          <h2 className="text-xl font-bold text-slate-900">{selected.fypTitle || selected.name || 'Project Detail'}</h2>
          <div className="flex gap-2 mt-2 flex-wrap">
            {selected.status && (
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${GROUP_STATUS_MAP[selected.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                {GROUP_STATUS_MAP[selected.status]?.label || selected.status}
              </span>
            )}
            <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-blue-200 flex items-center gap-1">
              <Send size={10} /> Forwarded {selected.forwardedAt ? new Date(selected.forwardedAt).toLocaleDateString() : ''}
            </span>
          </div>
        </div>

        {!isAlreadyProcessed && (
          <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <CheckCircle size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Office Decision Required</h3>
                <p className="text-[10px] text-slate-500">Approve or reject this forwarded proposal</p>
              </div>
            </div>
            <div className="space-y-3">
              <textarea value={officeFeedback} onChange={e => setOfficeFeedback(e.target.value)}
                placeholder="Feedback (required for rejection)..."
                className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm min-h-[70px] outline-none focus:ring-2 focus:ring-blue-600/20 resize-none" />
              <div className="flex items-center gap-2">
                <button onClick={() => handleOfficeDecision('approve')} disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 cursor-pointer border-0">
                  {actionLoading === 'approve' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle size={14} />} Approve Proposal
                </button>
                <button onClick={() => handleOfficeDecision('reject')} disabled={actionLoading || !officeFeedback.trim()}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-rose-600 text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-50 transition-all disabled:opacity-50 cursor-pointer">
                  {actionLoading === 'reject' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X size={14} />} Reject Proposal
                </button>
              </div>
            </div>
          </div>
        )}

        {isAlreadyProcessed && (
          <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected.ideas.some(i => i.status === 'fyp_office_approved') ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                {selected.ideas.some(i => i.status === 'fyp_office_approved') ? <CheckCircle size={18} className="text-emerald-600" /> : <X size={18} className="text-rose-500" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {selected.ideas.some(i => i.status === 'fyp_office_approved') ? 'Proposal Approved' : 'Proposal Rejected'}
                </h3>
                <p className="text-[10px] text-slate-500">Decision recorded by FYP Office</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {selected.description && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><BookOpen size={13} /> Project Description</h5>
                <p className="text-sm text-slate-700 leading-relaxed">{selected.description}</p>
              </div>
            )}

            {selected.techStack && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><Code size={13} /> Technology Stack</h5>
                <div className="flex flex-wrap gap-2">
                  {selected.techStack.split(',').map((t, i) => (
                    <span key={i} className="bg-gray-50 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg border border-line">{t.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {selected.ideas?.length > 0 && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><FileText size={13} /> Project Ideas History</h5>
                <div className="space-y-3">
                  {selected.ideas.map((idea, i) => (
                    <div key={i} className="p-4 rounded-xl border border-line">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-bold text-slate-900 text-sm">{idea.title}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${IDEA_STATUS_MAP[idea.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                          {IDEA_STATUS_MAP[idea.status]?.label || idea.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">Submitted by {idea.submittedBy}</p>
                      {idea.feedback && <p className="text-xs text-slate-500 mt-1">Feedback: {idea.feedback}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selected.evaluations?.length > 0 && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><BarChart3 size={13} /> Evaluations</h5>
                <div className="space-y-2">
                  {selected.evaluations.map((ev, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-line">
                      <div>
                        <span className="text-sm font-bold text-slate-900">{ev.evaluator}</span>
                        <span className="text-xs text-slate-400 ml-2">{ev.phase}</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">{ev.totalScore}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><User size={13} /> Supervision</h5>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-0.5">Supervisor</span>
                  <span className="font-bold text-slate-900 text-sm">{selected.supervisor || 'N/A'}</span>
                  {selected.supervisorEmail && <p className="text-[10px] text-slate-400">{selected.supervisorEmail}</p>}
                </div>
                {selected.coSupervisor && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-0.5">Co-Supervisor</span>
                    <span className="font-bold text-slate-900 text-sm">{selected.coSupervisor}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><Users size={13} /> Team Members ({selected.memberCount})</h5>
              <div className="space-y-2">
                {selected.members?.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-line">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">{m.name?.charAt(0)}</div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{m.name}</div>
                      <div className="text-[10px] text-gray-400 truncate">{m.regNo || m.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><GraduationCap size={13} /> Suggested Committee</h5>
              {selected.committeeMembers?.length > 0 ? (
                <div className="space-y-2">
                  {selected.committeeMembers.map((cm, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-100">
                      <User size={12} className="text-blue-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-900">{cm.name || cm}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4 text-slate-400">
                  <AlertTriangle size={16} />
                  <p className="text-xs font-medium">No committee assigned yet</p>
                  <p className="text-[10px] text-center">Assign an evaluation committee from the Proposal Committee Management section.</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Progress</h5>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${selected.progress || 0}%` }} />
                </div>
                <span className="text-sm font-black text-slate-900">{selected.progress || 0}%</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><Calendar size={13} /> Timeline</h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Created</span>
                  <span className="font-bold text-slate-900">{selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Forwarded</span>
                  <span className="font-bold text-slate-900">{selected.forwardedAt ? new Date(selected.forwardedAt).toLocaleString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {toast.show && (
          <div className="fixed bottom-8 right-8 z-50 animate-fadeSlideUp">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg text-sm font-semibold border ${toast.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white text-slate-800 border-line'}`}>
              {toast.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <h2 className="text-xl font-bold text-slate-900">Forwarded Proposals</h2>
        <p className="text-xs text-slate-900 mt-0.5 font-medium">Groups forwarded by supervisors for FYP Office review</p>
      </div>

      {proposals.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
          <Send className="w-10 h-10" />
          <p className="text-sm font-bold">No forwarded proposals yet</p>
          <p className="text-xs">When supervisors forward approved proposals, they will appear here.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedProposals.map(p => {
              const officeStatus = getOfficeStatus(p);
              return (
                <div key={p.id} onClick={() => { setSelected(p); setView('detail'); setOfficeFeedback(''); }}
                  className="bg-white rounded-2xl border border-line p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer relative overflow-hidden">
                  {officeStatus === 'fyp_office_approved' && (
                    <div className="absolute top-3 right-3 rotate-[12deg]">
                      <div className="bg-emerald-600 text-white text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded border-2 border-emerald-700 shadow-sm">
                        <Check size={10} className="inline mr-0.5" /> Approved
                      </div>
                    </div>
                  )}
                  {officeStatus === 'fyp_office_rejected' && (
                    <div className="absolute top-3 right-3 rotate-[12deg]">
                      <div className="bg-rose-600 text-white text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded border-2 border-rose-700 shadow-sm">
                        <X size={10} className="inline mr-0.5" /> Rejected
                      </div>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{p.fypTitle || p.name || 'Project'}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border whitespace-nowrap ${GROUP_STATUS_MAP[p.status]?.color || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                      {GROUP_STATUS_MAP[p.status]?.label || p.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <User size={12} /> {p.supervisor}
                    {p.memberCount > 0 && <><span className="text-gray-300">|</span> <Users size={12} /> {p.memberCount} members</>}
                  </div>
                  {p.description && (
                    <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{p.description}</p>
                  )}
                  {p.techStack && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.techStack.split(',').slice(0, 3).map((t, i) => (
                        <span key={i} className="bg-gray-50 text-slate-900 font-bold text-[9px] px-1.5 py-0.5 rounded border border-line">{t.trim()}</span>
                      ))}
                      {p.techStack.split(',').length > 3 && <span className="text-[9px] text-gray-400 font-bold">+{p.techStack.split(',').length - 3}</span>}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-line mt-auto">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar size={10} /> {p.forwardedAt ? new Date(p.forwardedAt).toLocaleDateString() : ''}
                    </span>
                    <span className="text-blue-600 text-[10px] font-bold flex items-center gap-0.5">
                      View Details <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-line text-xs font-bold text-slate-600 hover:bg-white transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1">
                <ChevronLeft size={14} /> Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer border ${page === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-line hover:bg-blue-50'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 rounded-xl border border-line text-xs font-bold text-slate-600 hover:bg-white transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1">
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}

      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50 animate-fadeSlideUp">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg text-sm font-semibold border ${toast.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white text-slate-800 border-line'}`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
