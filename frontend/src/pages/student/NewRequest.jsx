import React, { useState, useRef, useEffect } from 'react';
import { searchPartners, sendPartnerRequest, getSentRequests } from '../../services/student.service';
import { showToast as toast } from '../../components/AppToast';
import { Check, ChevronDown, ChevronUp, Clock, Loader, Search, Send, UserCheck, UserX, Users, X } from 'lucide-react';
import { motion } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
export default function NewRequest() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);
  const [sentOpen, setSentOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    loadSent();
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadSent = () => {
    setPageLoading(true);
    getSentRequests().then(data => {
      setSentRequests(Array.isArray(data) ? data : []);
    }).catch(() => {}).finally(() => {
      setPageLoading(false);
    });
  };

  const doSearch = (q) => {
    if (!q || q.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    searchPartners(q).then(data => {
      setResults(Array.isArray(data) ? data : []);
      setShowDropdown(true);
    }).catch(() => {
      toast.error('Search failed.');
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const handleSend = async (id) => {
    setSending({...sending, [id]: true});
    try {
      const res = await sendPartnerRequest(id);
      toast.success(res.message);
      setResults(prev => prev.filter(s => s.id !== id));
      loadSent();
    } catch {
      toast.error('Failed to send request.');
    } finally {
      setSending({...sending, [id]: false});
    }
  };

  const statusIcon = (status) => {
    if (status === 'accepted') return <UserCheck className="w-4 h-4 text-emerald-600" />;
    if (status === 'rejected') return <UserX className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-amber-500" />;
  };

  const statusBadge = (status) => {
    if (status === 'accepted') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'rejected') return 'bg-red-50 text-red-600 border-red-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="animate-in fade-in slide-in- duration-300">
      {pageLoading ? (
        <div className="space-y-6 animate-pulse bg-white rounded-2xl border border-line shadow-card p-6 max-w-2xl mx-auto">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-10 w-full rounded-xl" />
          <div className="skeleton h-32 w-full rounded-xl" />
          <div className="skeleton h-10 w-32 rounded-xl" />
        </div>
      ) : (
        <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Find FYP Partners</h2>
        <p className="text-sm text-slate-900 mb-6">Search for students by Registration Number or Email to send a group request.</p>

        <div className="relative" ref={wrapperRef}>
          <div className="flex items-center gap-2 bg-white border border-line rounded-xl px-4 py-2.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => { if (results.length) setShowDropdown(true); }}
              className="flex-1 bg-transparent border-0 text-sm outline-none p-0"
              placeholder="Search by name, reg no or email..."
            />
            {loading && <Loader className="w-4 h-4 animate-spin text-slate-400 flex-shrink-0" />}
            {query && !loading && (
              <button onClick={() => { setQuery(''); setResults([]); setShowDropdown(false); }} className="bg-transparent border-0 p-0 text-slate-400 hover:text-slate-500 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-line rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
              {results.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-slate-400">
                  <Users className="w-8 h-8 mb-2" />
                    <p className="text-sm font-medium text-slate-500">No available students found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
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
                    <button
                      disabled={sending[student.id]}
                      onClick={() => handleSend(student.id)}
                      className="ml-3 flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      {sending[student.id] ? <><Check className="w-3.5 h-3.5" /> Sent</> : <><Send className="w-3.5 h-3.5" /> Send</>}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {sentRequests.length > 0 && (
          <div className="mt-8 border-t border-line pt-6">
            <button
              onClick={() => setSentOpen(!sentOpen)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-sm font-bold text-slate-700">Sent Requests ({sentRequests.length})</h3>
              {sentOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {sentOpen && (
              <div className="mt-3 space-y-2">
                {sentRequests.map(r => (
                  <div key={r.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-line">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {r.name.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{r.name}</div>
                        <div className="text-xs text-slate-500">{r.regNo}</div>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${statusBadge(r.status)}`}>
                      {statusIcon(r.status)}
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
      )}
    </motion.div>
  );
}
