import React, { useState } from 'react';
import { searchPartners, sendPartnerRequest } from '../../services/student.service';
import { showToast as toast } from '../../components/AppToast';
import { Check, Send } from 'lucide-react';

export default function NewRequest() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState({});

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const data = await searchPartners(query);
      setResults(data);
    } catch {
      toast.error('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (id) => {
    setSending({...sending, [id]: true});
    try {
      const res = await sendPartnerRequest(id);
      toast.success(res.message);
    } catch {
      toast.error('Failed to send request.');
    } finally {
      setSending({...sending, [id]: false});
    }
  };

  return (
    <div className="animate-in fade-in slide-in- duration-300">
      <div className="bg-white rounded-2xl border border-black shadow-sm p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-black mb-2">Find FYP Partners</h2>
        <p className="text-sm text-black mb-6">Search for students by Registration Number or Email to send a group request.</p>
        
        <div className="flex gap-2">
          <input 
            type="text" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-white border border-black rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-black" 
            placeholder="e.g. SP21-BCS-005" 
          />
          <button 
            className="bg-black hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors" 
            onClick={handleSearch}
            disabled={loading}
          >
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-search'} mr-2`}></i> {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {results.length > 0 && (
          <div className="mt-8 space-y-3">
            {results.map(student => (
              <div key={student.id} className="flex items-center justify-between p-4 border border-black rounded-xl bg-white hover:border-black transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-black text-lg">
                    {student.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-black">{student.name}</div>
                    <div className="text-xs text-black mt-0.5">{student.regNo} • CGPA: {student.cgpa}</div>
                  </div>
                </div>
                <button 
                  disabled={sending[student.id]}
                  className="border border-black hover:border-black hover:text-black px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:bg-white disabled:text-white disabled:border-black" 
                  onClick={() => handleSend(student.id)}
                >
                  {sending[student.id] ? <><Check className="w-4 h-4 mr-1.5" /> Sent</> : <><Send className="w-4 h-4 mr-1.5" /> Send</>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}