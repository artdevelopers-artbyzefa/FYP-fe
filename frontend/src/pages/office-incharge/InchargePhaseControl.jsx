import React, { useEffect, useState, useCallback } from 'react';
import { getPhases, updateActivePhase } from '../../services/office-incharge.service';
import { showToast, showAlert } from '../../components/AppToast';
import { PhaseControlSkeleton } from '../../components/Skeleton';

function fmtDate(d) {
  if (!d) return '\u2014';
  try {
    return new Date(d).toLocaleString('en-PK', { timeZone: 'Asia/Karachi', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '\u2014';
  }
}

const phaseIcons = {
  registration: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  proposal_submission: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
  ),
  proposal_defense: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  phase1_development: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  phase1_evaluation: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  phase2_development: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  phase2_evaluation: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  phase2_defense: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
  phase3_development: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  phase3_evaluation: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  phase4_development: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  phase4_evaluation: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

function getIcon(key) {
  return phaseIcons[key] || phaseIcons.registration;
}

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const InchargePhaseControl = () => {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPhases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPhases();
      if (response?.data?.success) {
        setPhases(response.data.data || []);
      } else {
        showToast.error('Failed to load phases.');
      }
    } catch (error) {
      console.error(error);
      showToast.error(error?.mappedError?.message || 'Error loading phases.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPhases(); }, [fetchPhases]);

  const sorted = [...phases].sort((a, b) => a.sequence - b.sequence);
  const activePhase = sorted.find(p => p.isActive) || null;
  const activeIdx = activePhase ? sorted.findIndex(p => p.key === activePhase.key) : -1;

  const getStatus = (phase) => {
    if (phase.isActive) return 'active';
    const idx = sorted.findIndex(p => p.key === phase.key);
    if (idx < activeIdx) return 'completed';
    return 'upcoming';
  };

  const completed = sorted.filter(p => getStatus(p) === 'completed');
  const upcoming = sorted.filter(p => getStatus(p) === 'upcoming');

  const handleActivateNext = async () => {
    if (actionLoading) return;

    let target;
    if (!activePhase) {
      target = sorted.find(p => p.sequence === 1);
    } else {
      const next = sorted.find(p => p.sequence === activePhase.sequence + 1);
      if (!next) return;
      target = next;
    }
    if (!target) return;

    const confirmMsg = activePhase
      ? `Activate "${target.name}" (Phase ${target.sequence})? This will advance from "${activePhase.name}".`
      : `Start the programme by activating "${target.name}"?`;

    const confirmed = await showAlert.confirm('Activate Phase', confirmMsg, 'Activate');
    if (!confirmed) return;

    setActionLoading(true);
    try {
      const response = await updateActivePhase(target.key);
      if (response?.data?.success) {
        showToast.success(`"${target.name}" is now the active phase.`);
        setPhases(response.data.data || []);
      } else {
        showToast.error(response?.data?.message || 'Failed to activate phase.');
      }
    } catch (error) {
      console.error(error);
      showToast.error(error?.mappedError?.message || 'Error activating phase.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <PhaseControlSkeleton />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Phase Control</h2>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Advance the FYP programme one phase at a time. Only one phase is active at any given moment.
        </p>
      </div>

      {!activePhase && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-amber-900">No Active Phase</h3>
              <p className="text-sm text-amber-700 mt-1">
                No phase is currently active. Activate the first phase to begin.
              </p>
              <button
                onClick={handleActivateNext}
                disabled={actionLoading}
                className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-btn-hover transition-all disabled:opacity-60"
              >
                {actionLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                Start Phase 1
              </button>
            </div>
          </div>
        </div>
      )}

      {activePhase && (
        <>
          <div className="bg-white rounded-2xl shadow-sm border-2 border-emerald-200 p-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                {getIcon(activePhase.key)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Currently Active
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-800 mt-1">{activePhase.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{activePhase.description}</p>
                <p className="text-xs text-gray-400 mt-2 font-medium">
                  Phase {activePhase.sequence} of {sorted.length}
                  {activePhase.startedAt && <> &middot; Active since {fmtDate(activePhase.startedAt)}</>}
                </p>
              </div>
            </div>
          </div>

          {activeIdx + 1 < sorted.length && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 flex-shrink-0">
                  {getIcon(sorted[activeIdx + 1].key)}
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Next Phase
                  </span>
                  <h3 className="text-lg font-black text-gray-600 mt-1">{sorted[activeIdx + 1].name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{sorted[activeIdx + 1].description}</p>
                </div>
                <button
                  onClick={handleActivateNext}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-btn-hover transition-all disabled:opacity-60 flex-shrink-0"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  Activate Phase {sorted[activeIdx + 1].sequence}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {completed.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Completed Phases</h3>
          <div className="space-y-2">
            {completed.map(p => (
              <div key={p.key} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                  <CheckIcon />
                </span>
                <span className="font-semibold text-gray-600">{p.name}</span>
                <span className="text-[10px] text-gray-400 ml-auto">Phase {p.sequence}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Upcoming Phases</h3>
          <div className="space-y-2">
            {upcoming.map(p => (
              <div key={p.key} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 border-2 border-gray-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-gray-400 flex-shrink-0">
                  {p.sequence}
                </span>
                <span className="font-medium text-gray-500">{p.name}</span>
                <span className="text-[10px] text-gray-400 ml-auto">Phase {p.sequence}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InchargePhaseControl;
