import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="font-poppins bg-lightbg text-gray-700 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Page Hero */}
        <section className="bg-gradient-to-br from-blue-50/95 via-blue-100/80 to-blue-50/90 py-16 md:py-24 border-b border-blue-100">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-blue-900/5 border border-blue-900/10 rounded-full text-primary text-[0.7rem] font-extrabold uppercase tracking-[0.24em] mb-6">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                  <i className="fas fa-graduation-cap"></i> About Program
                </div>
                <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-black text-gray-900 leading-tight mb-5">
                  A structured path from classroom learning to professional project delivery.
                </h1>
                <p className="text-[15px] md:text-[17px] text-gray-500 leading-relaxed max-w-[600px] mb-8">
                  The Final Year Project program helps students apply research, engineering, design, and teamwork skills to meaningful computing problems under faculty supervision.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="/eligibility" className="inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full font-bold bg-primary text-white shadow-lg hover:bg-blue-800 hover:-translate-y-px transition-all text-sm">
                    Check Eligibility <i className="fas fa-arrow-right"></i>
                  </a>
                  <a href="/process" className="inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full font-bold bg-transparent text-gray-900 border-[1.5px] border-gray-200 hover:bg-gray-50 transition-all text-sm">
                    View Workflow
                  </a>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-xl space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0 text-lg">
                    <i className="fas fa-lightbulb"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-base">Innovation Focus</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Students select, research, build, and defend a solution with measurable academic value.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0 text-lg">
                    <i className="fas fa-user-tie"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-base">Faculty Guidance</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Supervisors guide scope, milestones, documentation, and evaluation readiness.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0 text-lg">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-base">Digital Management</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">The portal keeps submissions, feedback, coordination, and progress records in one place.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Objectives Section */}
        <section className="py-16 md:py-24 bg-white border-b border-blue-100">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <p className="text-[0.7rem] font-extrabold text-secondary uppercase tracking-[0.24em] mb-3">Program Objectives</p>
              <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-black text-gray-900 leading-tight">What the FYP program builds</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white border-[1.5px] border-blue-100 rounded-[2rem] p-8 hover:border-primary transition-all text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center text-xl mb-6">
                  <i className="fas fa-search"></i>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-4">Research Discipline</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">Encourage students to identify problems, review related work, define scope, and use an appropriate methodology.</p>
              </div>
              <div className="bg-white border-[1.5px] border-blue-100 rounded-[2rem] p-8 hover:border-primary transition-all text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center text-xl mb-6">
                  <i className="fas fa-code"></i>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-4">Practical Engineering</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">Translate computing concepts into working software, systems, experiments, or prototypes that can be demonstrated.</p>
              </div>
              <div className="bg-white border-[1.5px] border-blue-100 rounded-[2rem] p-8 hover:border-primary transition-all text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center text-xl mb-6">
                  <i className="fas fa-users"></i>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-4">Team Practice</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">Strengthen collaboration, communication, planning, version control, and accountable delivery across project groups.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Outcomes & Portal Helper Section */}
        <section className="py-16 md:py-24 bg-lightbg">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border-[1.5px] border-blue-100 rounded-[2.5rem] p-10 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center text-xl mb-6">
                  <i className="fas fa-award"></i>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-6">Learning Outcomes</h3>
                <ul className="space-y-4">
                  {[
                    "Prepare a complete proposal, report, and presentation.",
                    "Apply technical knowledge to solve a real problem.",
                    "Evaluate results using suitable measures and evidence.",
                    "Communicate decisions clearly to supervisors and panels."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-gray-500 font-medium">
                      <i className="fas fa-check text-emerald-500 mt-1"></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border-[1.5px] border-blue-100 rounded-[2.5rem] p-10 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center text-xl mb-6">
                  <i className="fas fa-laptop-file"></i>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-6">How the Portal Helps</h3>
                <ul className="space-y-4">
                  {[
                    "Centralizes proposal submission and supervisor review.",
                    "Tracks milestones, progress logs, and project evidence.",
                    "Improves coordination between students, supervisors, and coordinators.",
                    "Supports transparent evaluation and report management."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-gray-500 font-medium">
                      <i className="fas fa-check text-emerald-500 mt-1"></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
