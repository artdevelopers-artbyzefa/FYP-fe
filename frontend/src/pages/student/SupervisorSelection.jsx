import React, { useState, useEffect, useRef } from 'react';
import { getAvailableSupervisors, requestSupervisor, cancelSupervisorRequest, getStudentGroup, getGroupIdeas } from '../../services/student.service';
import { showToast as toast } from '../../components/AppToast';
import { STATUS_MAP } from '../../utils/constants/status.constant';
import { Check, GraduationCap, Loader, Search, Send, Trash2, UserCheck, X, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function SupervisorSelection() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [requesting, setRequesting] = useState({});
  const [group, setGroup] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [ideas, setIdeas] = useState([]);
  const [filter, setFilter] = useState('all');
  const debounceRef = useRef(null);

  useEffect(() => {
    Promise.all([
      getStudentGroup().then(d => setGroup(d?.data || null)).catch(() => {}),
      getAvailableSupervisors('').then(d => setResults(Array.isArray(d) ? d : [])).catch(() => {}),
      getGroupIdeas().then(r => setIdeas(r?.data || [])).catch(() => {})
    ]).finally(() => setLoadingData(false));
  }, []);

  const doSearch = (q) => {
    setSearchLoading(true);
    getAvailableSupervisors(q).then(data => {
      setResults(Array.isArray(data) ? data : []);
    }).catch(() => toast.error('Search failed.')).finally(() => setSearchLoading(false));
  };

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const handleCancel = async () => {
    try {
      await cancelSupervisorRequest();
      toast.success('Supervisor request cancelled');
      const g = await getStudentGroup().then(d => d?.data || null).catch(() => null);
      setGroup(g);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to cancel');
    }
  };

  const handleRequest = async (id) => {
    setRequesting(p => ({...p, [id]: true}));
    try {
      await requestSupervisor(id);
      toast.success('Supervisor request sent');
      const d = await getStudentGroup();
      setGroup(d?.data || null);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Request failed.');
    } finally {
      setRequesting(p => ({...p, [id]: false}));
    }
  };

  if (loadingData) return <div className="flex items-center justify-center min-h-[60vh]"><Loader className="animate-spin text-slate-900 text-3xl" /></div>;

  const isPending = group?.supervisor && group?.status === 'pending_approval';
  const hasSupervisor = group?.supervisor && group?.status !== 'pending_approval';
  const idea = group?.idea;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="animate-in fade-in slide-in- duration-300 max-w-3xl mx-auto space-y-6">
      <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">FYP Supervisor</h2>
        <p className="text-sm text-slate-900 mb-6">
          {hasSupervisor ? 'Your supervisor has been assigned.' : isPending ? 'Your supervisor request is pending approval.' : 'Search for faculty members to request as your FYP supervisor.'}
        </p>

        {hasSupervisor && (
          <>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {group.supervisor.name?.substring(0,2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-800">Assigned Supervisor</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{group.supervisor.name}</div>
                  <div className="text-xs text-slate-500">{group.supervisor.email}</div>
                </div>
                <div className="ml-auto">
                  <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-200">
                    <UserCheck className="w-3.5 h-3.5" /> Assigned
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {isPending && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                {group.supervisor.name?.substring(0,2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-amber-800">Request Sent — Awaiting Approval</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{group.supervisor.name}</div>
                <div className="text-xs text-slate-500">{group.supervisor.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border bg-amber-50 text-amber-700 border-amber-200">
                  Pending
                </span>
                <button onClick={handleCancel} className="bg-white hover:bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-red-200 cursor-pointer flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {!hasSupervisor && !isPending && (
          <>
            <div className="flex items-center gap-2 bg-white border border-line rounded-xl px-4 py-2.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input type="text" value={query} onChange={handleQueryChange} className="flex-1 bg-transparent border-0 text-sm outline-none p-0" placeholder="Search faculty by name or email..." />
              {searchLoading && <Loader className="w-4 h-4 animate-spin text-slate-400 flex-shrink-0" />}
              {query && !searchLoading && (
                <button onClick={() => { setQuery(''); doSearch(''); }} className="bg-transparent border-0 p-0 text-slate-400 hover:text-slate-500 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="mt-4 border border-line rounded-xl overflow-hidden">
              {results.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-slate-400">
                  <GraduationCap className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium text-slate-500">No faculty found</p>
                </div>
              ) : (
                results.map(sup => (
                  <div key={sup.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{sup.avatar}</div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-slate-900 truncate">{sup.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5 truncate">{sup.email} {sup.tags?.length > 0 ? `• ${sup.tags.join(', ')}` : ''}</div>
                      </div>
                    </div>
                    <button disabled={requesting[sup.id] || !group} onClick={() => handleRequest(sup.id)}
                      className="ml-3 flex-shrink-0 bg-btn hover:bg-btn-hover text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5">
                      {requesting[sup.id] ? <><Check className="w-3.5 h-3.5" /> Sending</> : <><Send className="w-3.5 h-3.5" /> Request</>}
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {ideas.length > 0 && (
          <div className="mt-6 pt-6 border-t border-line">
            <h3 className="text-sm font-bold text-slate-900 mb-3">All Group Ideas</h3>
            {(() => {
              const filtered = filter === 'all' ? ideas : ideas.filter(i => i.agreementStatus === filter);
              return (<>
              <div className="flex gap-2 flex-wrap mb-4">
                {[
                  { key: 'all', label: `All (${ideas.length})` },
                  ...Object.entries(STATUS_MAP).map(([k, v]) => ({ key: k, label: `${v.label} (${ideas.filter(i => i.agreementStatus === k).length || 0})` }))
                ].map(f => (
                  <button key={f.key} onClick={() => setFilter(f.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      filter === f.key ? 'bg-btn text-white border-btn' : 'bg-white text-slate-600 border-gray-200 hover:bg-blue-50'
                    }`}>{f.label}</button>
                ))}
              </div>
              {filtered.length === 0 ? (
                <div className="text-center py-6">
                  <Lightbulb className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs text-slate-500">No ideas in this category.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map(ideaItem => {
                  const sm = STATUS_MAP[ideaItem.agreementStatus] || STATUS_MAP.agreed;
                  const Icon = sm.icon;
                  return (
                    <div key={ideaItem._id} className="p-4 rounded-xl border border-line bg-white">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-sm font-bold text-slate-900">{ideaItem.title}</p>
                        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border shrink-0 ${sm.color}`}>
                          <Icon size={11} /> {sm.label}
                        </span>
                      </div>
                      {ideaItem.description && <p className="text-xs text-slate-500 mb-2">{ideaItem.description}</p>}
                      {ideaItem.supervisorFeedback && (
                        <div className="p-2 rounded-lg bg-blue-50/50 border border-blue-100">
                          <p className="text-[10px] font-bold text-blue-700 mb-0.5">Supervisor Feedback:</p>
                          <p className="text-xs text-slate-700">{ideaItem.supervisorFeedback}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            </>);
            })()}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
