import React, { useEffect, useState, useCallback } from 'react';
import { getPhases, updateActivePhase } from '../../services/office-incharge.service';
import { showToast, showAlert } from '../../components/AppToast';
import { PhaseControlSkeleton } from '../../components/Skeleton';

const STATUS_CFG = {
  pending: { label: 'Pending', bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200', dot: 'bg-gray-300' },
  active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  completed: { label: 'Completed', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
};

function fmtDate(d) {
  if (!d) return '\u2014';
  try {
    return new Date(d).toLocaleString('en-PK', { timeZone: 'Asia/Karachi', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '\u2014';
  }
}

function getPhaseIcon(key) {
  const cls = 'w-5 h-5';
  switch (key) {
    case 'registration':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      );
    case 'proposal_submission':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      );
    case 'proposal_defense':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'phase1_development':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case 'phase1_evaluation':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'phase2_development':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    case 'phase2_evaluation':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'phase2_defense':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

function ProgressRing({ progress, count, total }) {
  const r = 15.9155;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none" stroke="#1e3a8a" strokeWidth="3"
          strokeDasharray={`${progress}, 100`}
          className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-black text-primary">{count}/{total}</span>
      </div>
    </div>
  );
}

function StatusDot({ status }) {
  const dotMap = { pending: 'bg-gray-300', active: 'bg-emerald-500', completed: 'bg-blue-500' };
  return <span className={`w-2 h-2 rounded-full ${dotMap[status] || 'bg-gray-300'}`} />;
}

function LiveIndicator() {
  return (
    <span className="flex items-center gap-2 self-center">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
      </span>
      <span className="text-xs text-emerald-700 font-bold">Live</span>
    </span>
  );
}

const InchargePhaseControl = () => {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const fetchPhases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPhases();
      if (response?.data?.success) {
        const sorted = [...(response.data.data || [])].sort((a, b) => a.sequence - b.sequence);
        setPhases(sorted);
      } else {
        showToast.error('Failed to load phases from database.');
      }
    } catch (error) {
      console.error(error);
      showToast.error(error?.mappedError?.message || 'Error connecting to database.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPhases(); }, [fetchPhases]);

  const getStatus = (phase) => {
    const activeIdx = phases.findIndex(p => p.isActive);
    const idx = phases.findIndex(p => p.key === phase.key);
    if (phase.isActive) return 'active';
    if (idx < activeIdx) return 'completed';
    return 'pending';
  };

  const activePhase = phases.find(p => p.isActive);
  const progressCount = phases.filter(p => getStatus(p) !== 'pending').length;
  const progress = phases.length ? Math.round((progressCount / phases.length) * 100) : 0;
  const nextUpPhase = phases.find((p, i) => getStatus(p) === 'pending' && (i === 0 || getStatus(phases[i - 1]) !== 'pending'));
  const activeIdx = phases.findIndex(p => p.isActive);

  const handleActivatePhase = async (phase) => {
    const isConfirmed = await showAlert.confirm(
      'Activate Phase',
      `Are you sure you want to activate "${phase.name}"? This will deactivate the current active phase.`,
      activePhase ? 'Yes, Switch Phase' : 'Yes, Activate'
    );
    if (!isConfirmed) return;

    setActionId(phase.key + 'start');
    try {
      const response = await updateActivePhase(phase.key);
      if (response?.data?.success) {
        showToast.success(`Phase "${phase.name}" is now active.`);
        const sorted = [...(response.data.data || [])].sort((a, b) => a.sequence - b.sequence);
        setPhases(sorted);
      } else {
        showToast.error(response?.data?.message || 'Failed to update phase.');
      }
    } catch (error) {
      console.error(error);
      showToast.error(error?.mappedError?.message || 'Error updating phase.');
    } finally {
      setActionId(null);
    }
  };

  const handleCompleteAndAdvance = async () => {
    if (!activePhase || activeIdx === -1 || activeIdx + 1 >= phases.length) return;
    const nextPhase = phases[activeIdx + 1];
    const isConfirmed = await showAlert.confirm(
      'Complete & Advance',
      `Mark "${activePhase.name}" as completed and activate "${nextPhase.name}"?`,
      'Yes, Complete & Advance'
    );
    if (!isConfirmed) return;

    setActionId('advance');
    try {
      const response = await updateActivePhase(nextPhase.key);
      if (response?.data?.success) {
        showToast.success(`"${activePhase.name}" completed. "${nextPhase.name}" is now active.`);
        const sorted = [...(response.data.data || [])].sort((a, b) => a.sequence - b.sequence);
        setPhases(sorted);
      } else {
        showToast.error(response?.data?.message || 'Failed to advance phase.');
      }
    } catch (error) {
      console.error(error);
      showToast.error(error?.mappedError?.message || 'Error advancing phase.');
    } finally {
      setActionId(null);
    }
  };

  const handleReverse = async () => {
    if (activeIdx <= 0) return;
    const prevPhase = phases[activeIdx - 1];
    const isConfirmed = await showAlert.confirm(
      'Reverse Phase Status',
      `Move back to "${prevPhase.name}"? This will deactivate "${activePhase.name}".`,
      'Yes, Reverse'
    );
    if (!isConfirmed) return;

    setActionId('reverse');
    try {
      const response = await updateActivePhase(prevPhase.key);
      if (response?.data?.success) {
        showToast.success(`Reversed to "${prevPhase.name}".`);
        const sorted = [...(response.data.data || [])].sort((a, b) => a.sequence - b.sequence);
        setPhases(sorted);
      } else {
        showToast.error(response?.data?.message || 'Failed to reverse phase.');
      }
    } catch (error) {
      console.error(error);
      showToast.error(error?.mappedError?.message || 'Error reversing phase.');
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <PhaseControlSkeleton />;

  return (
    <div className="space-y-6">

      {/* ── Header & Overall Progress ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Programme Phase Control</h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Manage and progress through the {phases.length} official phases of the FYP programme.
              Phases can be activated manually as milestones are reached.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Overall Progress</p>
              <p className="text-3xl font-black text-primary">{progress}%</p>
            </div>
            <ProgressRing progress={progress} count={progressCount} total={phases.length} />
          </div>
        </div>

        {/* Active Phase Banner */}
        {activePhase && (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
              {getPhaseIcon(activePhase.key)}
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">Currently Active</p>
              <p className="font-black text-emerald-900">{activePhase.name}</p>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">
                Phase {activePhase.sequence} of {phases.length}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <LiveIndicator />
            </div>
          </div>
        )}
      </div>

      {/* ── Next Phase Prompt ── */}
      {nextUpPhase && (
        <div className="bg-white rounded-2xl border-2 border-secondary shadow-lg shadow-secondary/5 p-5 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-secondary/5 rounded-full -mr-12 -mt-12 pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center shadow-inner border border-secondary/20 flex-shrink-0">
                {getPhaseIcon(nextUpPhase.key)}
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-secondary uppercase tracking-widest mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  Next Phase to Activate
                  <span className="ml-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">Phase {nextUpPhase.sequence}</span>
                </span>
                <h2 className="text-xl font-black text-gray-800">{nextUpPhase.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{nextUpPhase.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleActivatePhase(nextUpPhase)}
              disabled={actionId === nextUpPhase.key + 'start'}
              className="inline-flex items-center justify-center gap-2 font-semibold font-poppins rounded-xl transition-all duration-200 cursor-pointer border-0 w-full md:w-auto px-8 py-5 text-sm font-black h-auto shadow-lg shadow-secondary/20 flex-shrink-0 bg-secondary text-white hover:bg-btn-hover hover:-translate-y-px hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {actionId === nextUpPhase.key + 'start' ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              Activate Phase {nextUpPhase.sequence}
            </button>
          </div>
          {activePhase && (
            <div className="mt-4 flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
              <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-bold text-amber-700">
                Activating this phase will automatically complete the current <span className="font-black">&ldquo;{activePhase.name}&rdquo;</span>.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Phase Timeline ── */}
      <div className="space-y-3">
        {phases.map((phase, idx) => {
          const status = getStatus(phase);
          const cfg = STATUS_CFG[status];
          const isEx = expanded === phase.key;
          const prevDone = idx === 0 || getStatus(phases[idx - 1]) !== 'pending';
          const canStart = status === 'pending' && prevDone;

          return (
            <div key={phase.key} className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden
              ${status === 'active' ? 'border-emerald-200 shadow-md shadow-emerald-50'
                : status === 'completed' ? 'border-blue-100' : 'border-gray-100'}`}>

              {/* Row header */}
              <div
                className="flex items-center gap-3 md:gap-4 p-4 md:p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setExpanded(isEx ? null : phase.key)}
              >
                {/* Step icon */}
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-base transition-all
                  ${status === 'completed' ? 'bg-btn text-white'
                    : status === 'active' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                      : 'bg-gray-100 text-gray-400'}`}>
                  {status === 'completed' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : status === 'active' ? (
                    <div className="w-5 h-5">{getPhaseIcon(phase.key)}</div>
                  ) : (
                    <span className="text-sm">{phase.sequence}</span>
                  )}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`font-black text-sm truncate
                      ${status === 'active' ? 'text-emerald-800'
                        : status === 'completed' ? 'text-blue-800' : 'text-gray-600'}`}>
                      {phase.name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border} whitespace-nowrap`}>
                      {cfg.label}
                    </span>
                    {status === 'active' && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate hidden sm:block">{phase.description}</p>
                </div>

                {/* Dates — desktop */}
                <div className="hidden lg:flex flex-col items-end text-[10px] text-gray-400 font-medium gap-0.5 pr-2">
                  {phase.startedAt && <span>{fmtDate(phase.startedAt)}</span>}
                </div>

                <svg className={`w-3 h-3 text-gray-300 transition-transform duration-300 flex-shrink-0 ${isEx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Expanded detail */}
              {isEx && (
                <div className="border-t border-gray-50 p-5 md:p-6 bg-gray-50/30 space-y-6 animate-in slide-in-from-top-2 duration-200">

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {canStart && (
                      <button
                        onClick={() => handleActivatePhase(phase)}
                        disabled={actionId === phase.key + 'start'}
                        className="inline-flex items-center justify-center gap-2 font-semibold font-poppins rounded-xl transition-all duration-200 cursor-pointer border-0 px-3.5 py-1.5 text-xs bg-secondary text-white hover:bg-btn-hover hover:-translate-y-px hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {actionId === phase.key + 'start' ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        Activate This Phase
                      </button>
                    )}
                    {status === 'pending' && !prevDone && (
                      <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
                        </svg>
                        Complete the previous phase before activating this one.
                      </div>
                    )}
                    {status === 'active' && (
                      <>
                        {idx + 1 < phases.length && (
                          <button
                            onClick={handleCompleteAndAdvance}
                            disabled={actionId === 'advance'}
                            className="inline-flex items-center justify-center gap-2 font-semibold font-poppins rounded-xl transition-all duration-200 cursor-pointer border-0 px-3.5 py-1.5 text-xs bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-px hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {actionId === 'advance' ? (
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                              </svg>
                            )}
                            Complete &amp; Advance
                          </button>
                        )}
                      </>
                    )}
                    {status === 'completed' && (
                      <span className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl font-bold">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Phase completed
                      </span>
                    )}
                    {status === 'active' && activeIdx > 0 && (
                      <button
                        onClick={handleReverse}
                        disabled={actionId === 'reverse'}
                        className="inline-flex items-center justify-center gap-2 font-semibold font-poppins rounded-xl transition-all duration-200 cursor-pointer px-3.5 py-1.5 text-xs bg-transparent text-amber-600 border border-amber-200 hover:bg-amber-50 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {actionId === 'reverse' ? (
                          <div className="w-3 h-3 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        )}
                        Reverse Status
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6 px-2 text-xs text-gray-400 font-medium">
        {Object.entries(STATUS_CFG).map(([key, cfg]) => (
          <span key={key} className="flex items-center gap-2">
            <StatusDot status={key} />
            {cfg.label}
          </span>
        ))}
        <span className="ml-auto italic hidden sm:block">Select any phase row to expand details and controls</span>
      </div>

    </div>
  );
};

export default InchargePhaseControl;
