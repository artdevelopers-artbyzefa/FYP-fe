import React, { useEffect, useState } from 'react';
import { getPhases, updateActivePhase } from '../../services/office-incharge.service';
import { showToast, showAlert } from '../../components/AppToast';

const InchargePhaseControl = () => {
  const [phases, setPhases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeKey, setActiveKey] = useState('');

  // Fetch all phases from API
  const fetchPhases = async () => {
    setIsLoading(true);
    try {
      const response = await getPhases();
      if (response?.data?.success) {
        const sortedPhases = response.data.data.sort((a, b) => a.sequence - b.sequence);
        setPhases(sortedPhases);
        const active = sortedPhases.find(p => p.isActive);
        if (active) {
          setActiveKey(active.key);
        }
      } else {
        showToast.error('Failed to parse database phases.');
      }
    } catch (error) {
      console.error(error);
      showToast.error(error?.mappedError?.message || 'Error connecting to database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhases();
  }, []);

  // Handle phase activation transition
  const handleActivatePhase = async (phase) => {
    const isConfirmed = await showAlert.confirm(
      'Transition Academic Phase?',
      `Are you sure you want to change the active academic phase to "${phase.name}"? This will deactivate the current active phase and notify all students and faculty.`,
      'Confirm & Switch'
    );

    if (isConfirmed) {
      try {
        const response = await updateActivePhase(phase.key);
        if (response?.data?.success) {
          showToast.success(`Phase successfully switched to: ${phase.name}`);
          const sortedPhases = response.data.data.sort((a, b) => a.sequence - b.sequence);
          setPhases(sortedPhases);
          setActiveKey(phase.key);
        } else {
          showToast.error(response?.data?.message || 'Failed to update academic phase.');
        }
      } catch (error) {
        console.error(error);
        showToast.error(error?.mappedError?.message || 'Error updating academic phase.');
      }
    }
  };

  // Inline premium SVG collection to strictly respect "no emojis, completely SVGs should be used"
  const getPhaseIcon = (key) => {
    const iconClass = "w-6 h-6 text-white";
    switch (key) {
      case 'registration':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      case 'proposal_submission':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        );
      case 'proposal_defense':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'phase1_development':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case 'phase1_evaluation':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'phase2_development':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'phase2_defense':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getActivePhaseName = () => {
    const active = phases.find(p => p.isActive);
    return active ? active.name : 'Unknown Active Phase';
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">Academic Phase Control Center</h2>
        <p className="text-xs text-black mt-0.5 font-medium">
          Manage the sequential lifecycle phases of the Final Year Projects. Activate target milestones, advance semester guidelines, and update database state parameters.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-black shadow-sm">
          <svg className="animate-spin h-10 w-10 text-black mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-bold text-black">Connecting to database endpoints...</span>
        </div>
      ) : (
        <>
          {/* Active Phase Banner */}
          <div className="bg-white rounded-[2rem] border border-black shadow-sm p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6" >
            <div className="text-white">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 border border-white/30 rounded-xl text-[10px] font-black uppercase tracking-wider mb-3">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Current Active Phase
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mb-1.5 tracking-tight">
                {getActivePhaseName()}
              </h1>
              <p className="text-xs text-white/80 font-semibold max-w-2xl leading-relaxed">
                Currently visible system constraints, dynamic features, deadlines, and dashboard guidelines are calibrated for this phase.
              </p>
            </div>
            <div className="bg-white/10 border border-white/20 px-5 py-4 rounded-2xl text-white text-center flex-shrink-0 min-w-[160px]">
              <div className="text-[10px] font-black text-white/60 tracking-widest mb-0.5">Phase Sequence</div>
              <div className="text-3xl font-black">
                {phases.find(p => p.isActive)?.sequence || 1} / {phases.length}
              </div>
            </div>
          </div>

          {/* Sequential Stepper */}
          <div className="bg-white rounded-3xl border border-black p-6 sm:p-8 shadow-sm mb-8">
            <h3 className="text-sm font-black text-black tracking-wider mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Academic Lifeline Progress
            </h3>

            {/* Stepper Steps Wrapper */}
            <div className="relative flex flex-col md:flex-row justify-between items-center w-full gap-6 md:gap-2">
              {/* Stepper connector line (hidden on mobile, visible on desktop) */}
              <div className="absolute top-7 left-8 right-8 h-1 bg-white -z-0 hidden md:block rounded-full">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${((phases.findIndex(p => p.isActive)) / (phases.length - 1)) * 100}%`
                  }}
                ></div>
              </div>

              {phases.map((phase, index) => {
                const activeIndex = phases.findIndex(p => p.isActive);
                const isPassed = index < activeIndex;
                const isActive = phase.isActive;

                return (
                  <div key={phase.key} className="flex md:flex-col items-center gap-3 md:gap-2 text-center md:flex-1 relative z-10 w-full md:w-auto">
                    {/* Circle badge */}
                    <div 
                      className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-300 font-extrabold text-lg flex-shrink-0 ${
                        isActive 
                          ? 'bg-blue-600 border-white text-white ring-4 ring-blue-600/30 scale-110 shadow-lg' 
                          : isPassed 
                            ? 'bg-white' 
                            : 'bg-white border-gray-200 text-gray-400'
                      }`}
                    >
                      {isPassed ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span>{phase.sequence}</span>
                      )}
                    </div>

                    {/* Step Meta text */}
                    <div className="text-left md:text-center min-w-0">
                      <div className={`text-xs font-black truncate max-w-[200px] md:max-w-none ${isActive ? 'text-blue-600' : isPassed ? 'text-blue-600' : 'text-gray-500'}`}>
                        {phase.name}
                      </div>
                      <span className="text-[10px] font-bold text-black tracking-wider">
                        {isActive ? 'Active Now' : isPassed ? 'Completed' : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phase Grid Cards */}
          <h3 className="text-sm font-black text-black tracking-wider mb-5 flex items-center gap-2">
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Calibrate Academic Configurations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phases.map((phase) => (
              <div 
                key={phase.key} 
                className={`bg-white rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${
                  phase.isActive 
                    ? 'border-blue-500 ring-4 ring-blue-500/10 -translate-y-1 shadow-lg' 
                    : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                {/* Visual side highlights */}
                {phase.isActive && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full translate-x-8 -translate-y-8 flex items-center justify-center">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-full"></div>
                  </div>
                )}

                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex justify-between items-center mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${
                      phase.isActive ? 'bg-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {getPhaseIcon(phase.key)}
                    </div>

                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-xl border ${
                      phase.isActive 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'bg-gray-50 border-gray-100 text-gray-400'
                    }`}>
                      {phase.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Body Content */}
                  <h4 className="text-base font-black text-black mb-2 leading-tight">
                    {phase.name}
                  </h4>
                  <p className="text-xs text-black leading-relaxed font-medium mb-6">
                    {phase.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-black flex items-center justify-between">
                  <span className="text-[10px] font-black text-black tracking-widest">
                    Sequence: #{phase.sequence}
                  </span>
                  
                  {phase.isActive ? (
                    <span className="flex items-center gap-1.5 text-xs font-black text-black">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Active State Locked
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleActivatePhase(phase)}
                      className="px-4 py-2 bg-white hover:bg-blue-600 text-black hover:text-white border border-black hover:border-blue-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Activate Phase
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default InchargePhaseControl;
