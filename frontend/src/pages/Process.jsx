import React from 'react';

const Process = () => {
  const steps = [
    {
      num: '01',
      title: 'Topic Selection',
      desc: 'Students explore ideas, identify a problem, form a group, and prepare an initial project direction.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
        </svg>
      ),
    },
    {
      num: '02',
      title: 'Idea Submission',
      desc: 'The group submits title, abstract, objectives, tools, and expected outcomes for initial review.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      num: '03',
      title: 'Supervisor Allocation',
      desc: 'The coordinator assigns or confirms a supervisor according to domain fit and faculty availability.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      num: '04',
      title: 'Proposal Approval',
      desc: 'The proposal is reviewed, revised if needed, and approved before full implementation begins.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <polyline points="20,6 9,17 4,12" />
        </svg>
      ),
      active: true,
    },
    {
      num: '05',
      title: 'Development Phase',
      desc: 'Students build, test, document, and submit progress updates through milestones and logs.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <polyline points="16,18 22,12 16,6" /><polyline points="8,6 2,12 8,18" />
        </svg>
      ),
    },
    {
      num: '06',
      title: 'Final Defense',
      desc: 'The group presents the completed work, submits the final report, and receives evaluation panel feedback.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      ),
    },
  ];

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" className="w-5 h-5 text-[#1a2a6c]">
          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
        </svg>
      ),
      title: 'Milestone Based',
      desc: 'Each phase has clear submissions, reviews, and feedback checkpoints.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" className="w-5 h-5 text-[#1a2a6c]">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
      title: 'Coordinated Review',
      desc: 'Students, supervisors, coordinators, and evaluators stay aligned through the portal.',
    },
  ];

  return (
    <div className="bg-white font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#eef4ff] to-white px-6 lg:px-20 py-16 lg:py-24 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#e0eaff] border border-[#c2d6ff] rounded-full py-1.5 px-4 text-[11px] font-bold tracking-widest text-[#1a2a6c] uppercase mb-8">
            <span className="w-2.5 h-2.5 bg-[#3b5bdb] rounded-full animate-pulse" />
            FYP Workflow
          </div>
          <h1 className="font-syne font-extrabold text-5xl lg:text-7xl leading-[1.1] text-[#111827] mb-8">
            A clear lifecycle from project idea to final evaluation.
          </h1>
          <p className="text-lg leading-relaxed text-[#556172] max-w-xl">
            The process page gives students a practical view of each major stage, the expected output, and how the portal supports progress throughout the year.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="bg-white rounded-[40px] p-10 min-w-[320px] max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50">
          {features.map((feature, idx) => (
            <div key={idx} className={`flex items-start gap-5 ${idx !== 0 ? 'mt-10' : ''}`}>
              <div className="w-12 h-12 bg-[#f0f4ff] rounded-full flex items-center justify-center flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <p className="font-bold text-lg text-[#111827] mb-1">{feature.title}</p>
                <p className="text-[14px] text-[#6b7280] leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Steps Section */}
      <section className="px-6 lg:px-20 py-20 bg-white">
        <div className="flex max-w-7xl mx-auto">
          {/* Vertical Line and Icons */}
          <div className="relative flex flex-col items-center w-20 flex-shrink-0">
            <div className="absolute top-0 bottom-0 left-1/2 w-[1.5px] bg-[#e2e8f0] -translate-x-1/2 z-0" />
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div
                  className={`relative z-10 w-12 h-12 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 shadow-sm
                  ${step.num === '04' ? 'bg-[#1a2a6c] border-[#1a2a6c] text-white' : 'bg-white border-[#e2e8f0] text-[#1a2a6c]'}`}
                >
                  {step.icon}
                </div>
                {idx < steps.length - 1 && <div className="h-32" />}
              </React.Fragment>
            ))}
          </div>

          {/* Step Cards */}
          <div className="flex-1 flex flex-col gap-10">
            {steps.map((step) => (
              <div
                key={step.num}
                className="group bg-white border border-[#eef2f8] rounded-[32px] p-10 lg:p-12 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(59,91,219,0.06)] hover:border-[#3b5bdb]/20"
              >
                <p className="text-[12px] font-bold tracking-[0.2em] text-[#3b5bdb] uppercase mb-4">
                  Step {step.num}
                </p>
                <h3 className="font-syne font-extrabold text-2xl text-[#111827] mb-4">
                  {step.title}
                </h3>
                <p className="text-[16px] leading-relaxed text-[#6b7280] max-w-3xl">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Process;