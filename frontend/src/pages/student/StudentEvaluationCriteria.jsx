import { useEffect, useState } from 'react';
import { getStudentEvaluationCriteria } from '../../services/evaluationService';
import { ClipboardList, Loader2, MessageSquareText } from 'lucide-react';

const StudentEvaluationCriteria = () => {
  const [criteria, setCriteria] = useState([]);
  const [remarks, setRemarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStudentEvaluationCriteria().then((critRes) => {
      const data = critRes.data || critRes;
      setCriteria(Array.isArray(data.criteria) ? data.criteria : (Array.isArray(data) ? data : []));
      setRemarks(Array.isArray(data.remarks) ? data.remarks : (data.remarks ? [data.remarks] : []));
    }).catch(() => {
      setError('Could not load evaluation criteria.');
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading evaluation criteria...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900">Evaluation Criteria</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Criteria used to evaluate your FYP project.</p>
        </div>
        <div className="bg-white rounded-2xl border border-line shadow-sm p-12 text-center">
          <ClipboardList size={40} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-700 mb-1">Unable to Load</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">{error}</p>
        </div>
      </div>
    );
  }

  if (criteria.length === 0) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900">Evaluation Criteria</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Criteria used to evaluate your FYP project.</p>
        </div>
        <div className="bg-white rounded-2xl border border-line shadow-sm p-12 text-center">
          <ClipboardList size={40} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-700 mb-1">No Criteria Defined</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Evaluation criteria have not been published yet. Check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Evaluation Criteria</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Criteria used to evaluate your FYP project.</p>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-line flex items-center gap-2">
          <ClipboardList size={14} className="text-blue-600" />
          <h3 className="text-xs font-bold text-slate-900 tracking-wider">Evaluation Criteria</h3>
        </div>
        <div className="divide-y divide-line">
          {criteria.map((c, idx) => (
            <div key={idx} className="px-6 py-4 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{c.title || c.name}</p>
                {(c.description) && (
                  <p className="text-xs text-slate-500 mt-0.5">{c.description}</p>
                )}
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex text-[10px] font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                  Wt: {c.weightage || c.weight || 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {remarks.length > 0 && (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-line flex items-center gap-2">
            <MessageSquareText size={14} className="text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 tracking-wider">Committee Remarks</h3>
          </div>
          <div className="divide-y divide-line">
            {remarks.map((r, idx) => (
              <div key={idx} className="px-6 py-4">
                <p className="text-sm text-slate-700">{typeof r === 'string' ? r : (r.text || r.remark || r.comment || '')}</p>
                {r.author && <p className="text-[10px] text-slate-400 font-medium mt-1">— {r.author}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentEvaluationCriteria;
