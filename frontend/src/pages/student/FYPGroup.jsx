import React, { useState, useRef, useEffect } from 'react';
import { searchPartners, sendPartnerRequest, getSentRequests, getIncomingRequests, respondPartnerRequest, getStudentGroup } from '../../services/student.service';
import { showToast as toast } from '../../components/AppToast';
import { Check, Clock, Crown, Loader, Search, Send, UserCheck, UserX, Users, X } from 'lucide-react';
import { motion } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
export default function FYPGroup() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sending, setSending] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [group, setGroup] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const debounceRef = useRef(null);

  useEffect(() => {
    Promise.all([
      getStudentGroup().then(d => setGroup(d?.data || null)).catch(() => {}),
      getSentRequests().then(d => setSentRequests(Array.isArray(d) ? d : [])).catch(() => {}),
      getIncomingRequests().then(d => setIncomingRequests(Array.isArray(d) ? d : [])).catch(() => {})
    ]).finally(() => setLoadingData(false));
  }, []);

  const doSearch = (q) => {
    if (!q || q.length < 2) { setResults([]); setShowResults(false); return; }
    setSearchLoading(true);
    searchPartners(q).then(data => {
      setResults(Array.isArray(data) ? data : []);
      setShowResults(true);
    }).catch(() => toast.error('Search failed.')).finally(() => setSearchLoading(false));
  };

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const handleSend = async (id) => {
    setSending(p => ({...p, [id]: true}));
    try {
      await sendPartnerRequest(id);
      toast.success('Request sent');
      setResults(p => p.filter(s => s.id !== id));
      const d = await getSentRequests();
      setSentRequests(Array.isArray(d) ? d : []);
    } catch (e) { toast.error(e?.response?.data?.message || 'Failed to send request.'); }
    finally { setSending(p => ({...p, [id]: false})); }
  };

  const handleRespond = async (id, status) => {
    try {
      await respondPartnerRequest(id, status);
      toast.success(`Request ${status}`);
      setIncomingRequests(p => p.filter(r => r.id !== id));
      const d = await getStudentGroup();
      setGroup(d?.data || null);
    } catch (e) { toast.error(e?.response?.data?.message || 'Action failed.'); }
  };

  const refreshAll = async () => {
    const [g, s, i] = await Promise.all([
      getStudentGroup().then(d => d?.data || null).catch(() => null),
      getSentRequests().then(d => Array.isArray(d) ? d : []).catch(() => []),
      getIncomingRequests().then(d => Array.isArray(d) ? d : []).catch(() => [])
    ]);
    setGroup(g);
    setSentRequests(s);
    setIncomingRequests(i);
  };

  if (loadingData) return <div className="flex items-center justify-center min-h-[60vh]"><Loader className="animate-spin text-slate-900 text-3xl" /></div>;

  const isFull = group && group.members?.length >= 3;

  const statusBadge = (s) => {
    if (s === 'accepted') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s === 'rejected') return 'bg-red-50 text-red-600 border-red-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  const statusIcon = (s) => {
    if (s === 'accepted') return <UserCheck className="w-3.5 h-3.5" />;
    if (s === 'rejected') return <UserX className="w-3.5 h-3.5" />;
    return <Clock className="w-3.5 h-3.5" />;
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="animate-in fade-in slide-in- duration-300 max-w-3xl mx-auto space-y-6">
      <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">FYP Group</h2>
        <p className="text-sm text-slate-900 mb-6">
          {isFull ? 'Your group is complete.' : 'Search for students to build your FYP group. Maximum 3 members per group.'}
        </p>

        {group && group.members?.length > 0 && (
          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-line">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Current Members ({group.members.length}/3)</h3>
            <div className="space-y-2">
              {group.members.map((m, i) => (
                <div key={m._id || i} className="flex items-center gap-3 px-3 py-2 bg-white rounded-lg border border-line">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'}`}>
                    {i === 0 ? <Crown className="w-4 h-4" /> : (m.user?.name || '??').substring(0,2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-900 truncate">{m.user?.name || 'Unknown'}{i === 0 ? ' (Leader)' : ''}</div>
                    <div className="text-xs text-slate-500">{m.regNo || ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isFull && (
          <>
            <div className="flex items-center gap-2 bg-white border border-line rounded-xl px-4 py-2.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input type="text" value={query} onChange={handleQueryChange} className="flex-1 bg-transparent border-0 text-sm outline-none p-0" placeholder="Search by name, reg no or email..." />
              {searchLoading && <Loader className="w-4 h-4 animate-spin text-slate-400 flex-shrink-0" />}
              {query && !searchLoading && (
                <button onClick={() => { setQuery(''); setResults([]); setShowResults(false); }} className="bg-transparent border-0 p-0 text-slate-400 hover:text-slate-500 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {showResults && (
              <div className="mt-3 border border-line rounded-xl overflow-hidden">
                {results.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-slate-400">
                    <Users className="w-8 h-8 mb-2" />
                    <p className="text-sm font-medium">No available students found</p>
                  </div>
                ) : (
                  results.map(student => (
                    <div key={student.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {student.name.substring(0,2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-slate-900 truncate">{student.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{student.regNo} {student.semester ? `• Sem ${student.semester}` : ''} {student.cgpa ? `• CGPA: ${student.cgpa}` : ''}</div>
                        </div>
                      </div>
                      <button disabled={sending[student.id]} onClick={() => handleSend(student.id)} className="ml-3 flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500">
                        {sending[student.id] ? <><Check className="w-3.5 h-3.5" /> Sent</> : <><Send className="w-3.5 h-3.5" /> Send</>}
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </motion.div>

      {incomingRequests.length > 0 && !isFull && (
        <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Incoming Requests ({incomingRequests.length})</h3>
          <div className="space-y-3">
            {incomingRequests.map(r => (
              <div key={r.id} className="flex items-center justify-between px-4 py-3 border border-line rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold text-sm">{r.name.substring(0,2).toUpperCase()}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.regNo} {r.cgpa ? `• CGPA: ${r.cgpa}` : ''}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleRespond(r.id, 'accepted')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500"><Check className="w-3.5 h-3.5 focus-visible:ring-2 focus-visible:ring-blue-500" /> Accept</button>
                  <button onClick={() => handleRespond(r.id, 'rejected')} className="bg-red-500 hover:bg-red-600 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500"><X className="w-3.5 h-3.5 focus-visible:ring-2 focus-visible:ring-blue-500" /> Reject</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {sentRequests.length > 0 && (
        <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Sent Requests ({sentRequests.length})</h3>
          <div className="space-y-2">
            {sentRequests.map(r => (
              <div key={r.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-line">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold text-xs">{r.name.substring(0,2).toUpperCase()}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.regNo}</div>
                  </div>
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border capitalize ${statusBadge(r.status)}`}>
                  {statusIcon(r.status)} {r.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
