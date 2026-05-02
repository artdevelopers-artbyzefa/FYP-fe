import React from 'react';

/**
 * Reusable InfoCard Component for the "What the FYP program builds" section.
 */
const ObjectiveCard = ({ icon, title, desc }) => (
  <div className="bg-white border-2 border-[#eef2f8] rounded-[32px] p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
    <div className="w-12 h-12 bg-[#f0f4fd] rounded-2xl flex items-center justify-center mb-6 text-[#1a2a6c] group-hover:bg-[#1a2a6c] group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="font-syne font-extrabold text-xl text-[#111827] mb-4">{title}</h3>
    <p className="text-[#64748b] leading-relaxed text-[15px]">{desc}</p>
  </div>
);

/**
 * Reusable ListCard Component for Learning Outcomes and Portal Benefits.
 */
const ListCard = ({ icon, title, items }) => (
  <div className="bg-white border-2 border-[#eef2f8] rounded-[32px] p-8 lg:p-10 shadow-sm">
    <div className="w-10 h-10 bg-[#f0f4fd] rounded-xl flex items-center justify-center mb-6 text-[#1a2a6c]">
      {icon}
    </div>
    <h3 className="font-syne font-extrabold text-2xl text-[#111827] mb-6">{title}</h3>
    <ul className="space-y-4">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 text-[#64748b] text-[15px] leading-relaxed">
          <span className="w-1.5 h-1.5 bg-[#3b5bdb] rounded-full mt-2.5 flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const About = () => {
  const objectives = [
    {
      title: "Research Discipline",
      desc: "Encourage students to identify problems, review related work, define scope, and use an appropriate methodology.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    },
    {
      title: "Practical Engineering",
      desc: "Translate computing concepts into working software, systems, experiments, or prototypes that can be demonstrated.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
    },
    {
      title: "Team Practice",
      desc: "Strengthen collaboration, communication, planning, version control, and accountable delivery across project groups.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    }
  ];

  const learningOutcomes = [
    "Prepare a complete proposal, report, and presentation.",
    "Apply technical knowledge to solve a real problem.",
    "Evaluate results using suitable measures and evidence.",
    "Communicate decisions clearly to supervisors and panels."
  ];

  const portalBenefits = [
    "Centralizes proposal submission and supervisor review.",
    "Tracks milestones, progress logs, and project evidence.",
    "Improves coordination between students, supervisors, and coordinators.",
    "Supports transparent evaluation and report management."
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO SECTION ── */}
      <section className="bg-gradient-to-br from-[#dce8ff] via-[#eef3fd] to-[#f5f8ff] px-6 lg:px-20 py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white border border-[#dde3f0] rounded-full py-2 px-5 text-[11px] font-bold tracking-[0.15em] text-[#1a2a6c] uppercase mb-8">
            <span className="w-2 h-2 bg-[#3b5bdb] rounded-full animate-pulse" />
            About Program
          </div>
          <h1 className="font-syne font-extrabold text-4xl lg:text-7xl leading-[1.1] text-[#111827] mb-8">
            A structured path from classroom learning to professional project delivery.
          </h1>
          <p className="text-lg leading-relaxed text-[#64748b] max-w-2xl mb-10">
            The Final Year Project program helps students apply research, engineering, design, and teamwork skills to meaningful computing problems under faculty supervision.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-[#1a2a6c] text-white font-bold py-4 px-8 rounded-full flex items-center gap-2 hover:bg-[#3b5bdb] transition-all shadow-lg hover:shadow-[#1a2a6c]/20">
              Check Eligibility 
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            <button className="bg-[#f0f4fd] text-[#1a2a6c] font-bold py-4 px-8 rounded-full hover:bg-[#e2e8f5] transition-all">
              View Workflow
            </button>
          </div>
        </div>

        {/* Floating Side Card */}
        <div className="bg-white rounded-[40px] p-8 lg:p-10 shadow-2xl border border-white/50 max-w-md w-full">
          <div className="space-y-8">
            {[
              { title: "Innovation Focus", desc: "Students select, research, build, and defend a solution with measurable academic value.", icon: "💡" },
              { title: "Faculty Guidance", desc: "Supervisors guide scope, milestones, documentation, and evaluation readiness.", icon: "👤" },
              { title: "Digital Management", desc: "The portal keeps submissions, feedback, coordination, and progress records in one place.", icon: "📈" }
            ].map((feature, i) => (
              <div key={i} className="flex gap-5">
                <div className="w-10 h-10 bg-[#f0f4fd] rounded-full flex items-center justify-center flex-shrink-0 text-lg">{feature.icon}</div>
                <div>
                  <h4 className="font-bold text-[#111827] mb-1">{feature.title}</h4>
                  <p className="text-[13px] text-[#64748b] leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OBJECTIVES SECTION ── */}
      <section className="px-6 lg:px-20 py-24 bg-white">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[12px] font-bold tracking-[0.2em] text-[#3b5bdb] uppercase mb-4 block">Program Objectives</span>
          <h2 className="font-syne font-extrabold text-4xl lg:text-5xl text-[#111827]">What the FYP program builds</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {objectives.map((obj, i) => (
            <ObjectiveCard key={i} {...obj} />
          ))}
        </div>
      </section>

      {/* ── OUTCOMES SECTION ── */}
      <section className="px-6 lg:px-20 py-24 bg-[#f8faff]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <ListCard 
            title="Learning Outcomes" 
            items={learningOutcomes} 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <ListCard 
            title="How the Portal Helps" 
            items={portalBenefits} 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />
        </div>
      </section>
    </div>
  );
};

export default About;