import React, { useEffect, useState } from 'react';
import { getStudentSuggestions, respondToSuggestion } from '../../services/student.service';
import { showToast } from '../../components/AppToast';
import { Lightbulb, Check, X, Loader2, ExternalLink } from 'lucide-react';

const STATUS_BADGE = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  accepted: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200'
};

const StudentSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await getStudentSuggestions();
      setSuggestions(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleRespond = async (id, action) => {
    try {
      await respondToSuggestion(id, action);
      showToast.success(`Suggestion ${action} successfully.`);
      fetchSuggestions();
      setSelectedSuggestion(null);
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to respond.');
    }
  };

  return (
    <>
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Supervisor Suggestions</h2>
        <p className="text-xs text-slate-900 mt-0.5 font-medium">Project ideas suggested by your supervisor for your group</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-slate-500 font-medium">Loading suggestions...</span>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
          <Lightbulb className="w-10 h-10" />
          <p className="text-sm font-bold">No suggestions from your supervisor yet.</p>
          <p className="text-xs">Your supervisor may suggest project ideas here for your group to review.</p>
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
              {s.techStack && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {s.techStack.split(',').map((t, i) => (
                    <span key={i} className="bg-gray-50 text-slate-900 font-bold text-[10px] px-2 py-1 rounded-lg border border-line">{t.trim()}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-line">
                <div className="text-[10px] text-gray-400">
                  {s.supervisor?.name ? `by ${s.supervisor.name}` : ''}
                </div>
                {s.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleRespond(s.id, 'accepted')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs font-bold hover:bg-green-100 transition-all cursor-pointer">
                      <Check size={12} /> Accept
                    </button>
                    <button onClick={() => handleRespond(s.id, 'rejected')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100 transition-all cursor-pointer">
                      <X size={12} /> Reject
                    </button>
                  </div>
                )}
                {s.status !== 'pending' && (
                  <span className="text-[10px] font-bold text-gray-400">
                    {s.status === 'accepted' ? 'Accepted' : 'Rejected'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default StudentSuggestions;
