import React, { useEffect, useState } from 'react';
import { getStudentPhase3Remarks } from '../../services/phase3.service';
import { Loader2, MessageSquareText, User, Shield, AlertCircle, EyeOff } from 'lucide-react';

const roleConfig = {
  supervisor: { icon: User, label: 'Supervisor', color: 'bg-blue-100 text-blue-700' },
  committee: { icon: Shield, label: 'Committee Member', color: 'bg-purple-100 text-purple-700' }
};

const StudentPhase3Remarks = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getStudentPhase3Remarks()
      .then(res => setData(res.data || null))
      .catch(() => setError('Failed to load Phase 3 remarks.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading remarks…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Header />
        <EmptyState icon={AlertCircle} title="Unable to load" message={error} />
      </div>
    );
  }

  const allRemarks = [
    ...(data?.supervisor ? [{ ...data.supervisor, role: 'supervisor' }] : []),
    ...(data?.committeeMembers || []).map(cm => ({ ...cm, role: 'committee' }))
  ];

  if (!allRemarks.length) {
    return (
      <div className="space-y-6">
        <Header />
        <EmptyState
          icon={MessageSquareText}
          title="No remarks available"
          message="Phase 3 evaluation remarks have not been published yet. Check back after your supervisor and committee have submitted their evaluations."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header />

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3 text-amber-800 text-xs">
        <EyeOff size={15} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-sm mb-0.5">Marks are hidden</p>
          <p className="text-amber-700">Only remarks are shown to students. Marks are visible only to FYP In-charge and FYP Office.</p>
        </div>
      </div>

      <div className="space-y-3">
        {allRemarks.map((item, i) => {
          const cfg = roleConfig[item.role] || roleConfig.committee;
          const Icon = cfg.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-line shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-line flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${cfg.color}`}>
                  <Icon size={15} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{item.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{cfg.label}</div>
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-start gap-2">
                  <MessageSquareText size={13} className="text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{item.remarks || 'No remarks provided.'}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Header = () => (
  <div className="border-b border-line pb-4">
    <h2 className="text-xl font-bold text-slate-900">Phase 3 Evaluation Remarks</h2>
    <p className="text-xs text-slate-500 mt-0.5 font-medium">Feedback from your supervisor and evaluation committee on your Phase 3 work.</p>
  </div>
);

const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="bg-white rounded-2xl border border-line shadow-sm p-12 text-center">
    <Icon size={40} className="text-slate-300 mx-auto mb-4" />
    <h3 className="text-sm font-bold text-slate-700 mb-1">{title}</h3>
    <p className="text-xs text-slate-400 max-w-sm mx-auto">{message}</p>
  </div>
);

export default StudentPhase3Remarks;
