import React, { useState } from 'react';
import { searchPartners, sendPartnerRequest } from '../../services/student.service';
import { showToast as toast } from '../../components/AppToast';

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
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Find FYP Partners</h2>
        <p className="text-sm text-gray-500 mb-6">Search for students by Registration Number or Email to send a group request.</p>
        
        <div className="flex gap-2">
          <input 
            type="text" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary" 
            placeholder="e.g. SP21-BCS-005" 
          />
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors" 
            onClick={handleSearch}
            disabled={loading}
          >
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-search'} mr-2`}></i> {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {results.length > 0 && (
          <div className="mt-8 space-y-3">
            {results.map(student => (
              <div key={student.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-white hover:border-secondary transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-lg">
                    {student.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{student.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{student.regNo} • CGPA: {student.cgpa}</div>
                  </div>
                </div>
                <button 
                  disabled={sending[student.id]}
                  className="border border-gray-200 hover:border-secondary hover:text-secondary px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:bg-emerald-500 disabled:text-white disabled:border-emerald-500" 
                  onClick={() => handleSend(student.id)}
                >
                  {sending[student.id] ? <><i className="fas fa-check mr-1.5"></i> Sent</> : <><i className="fas fa-paper-plane mr-1.5"></i> Send</>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}