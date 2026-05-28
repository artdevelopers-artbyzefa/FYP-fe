import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowRight, Award, BookOpen, Briefcase, Check, Code, GraduationCap, Laptop, Lightbulb, LineChart, MessageSquare, Rocket, Search, Target, TrendingUp, User, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="font-poppins bg-white text-slate-700 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Page Hero */}
        <section className="bg-lightbg py-16 md:py-24 border-b border-blue-100">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
<h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-black text-slate-900 leading-tight mb-5">
                  A structured path from classroom learning to professional project delivery.
                </h1>
                <p className="text-[15px] md:text-[17px] text-slate-600 leading-relaxed max-w-[600px] mb-8">
                  The Final Year Project program helps students apply research, engineering, design, and teamwork skills to meaningful computing problems under faculty supervision.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/eligibility" className="inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full font-bold bg-primary text-white shadow-lg hover:bg-blue-800 hover:-translate-y-px transition-all text-sm">
                    Check Eligibility <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/process" className="inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full font-bold bg-transparent text-slate-700 border-[1.5px] border-slate-300 hover:bg-slate-50 transition-all text-sm">
                    View Workflow
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-xl space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0 text-lg">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 text-base">Innovation Focus</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">Students select, research, build, and defend a solution with measurable academic value.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0 text-lg">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 text-base">Faculty Guidance</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">Supervisors guide scope, milestones, documentation, and evaluation readiness.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0 text-lg">
                    <LineChart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 text-base">Digital Management</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">The portal keeps submissions, feedback, coordination, and progress records in one place.</p>
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
              <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-black text-slate-900 leading-tight">What the FYP program builds</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white border-[1.5px] border-blue-100 rounded-[2rem] p-8 hover:border-primary transition-all text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center text-xl mb-6">
                  <Search className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-4">Research Discipline</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">Encourage students to identify problems, review related work, define scope, and use an appropriate methodology.</p>
              </div>
              <div className="bg-white border-[1.5px] border-blue-100 rounded-[2rem] p-8 hover:border-primary transition-all text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center text-xl mb-6">
                  <Code className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-4">Practical Engineering</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">Translate computing concepts into working software, systems, experiments, or prototypes that can be demonstrated.</p>
              </div>
              <div className="bg-white border-[1.5px] border-blue-100 rounded-[2rem] p-8 hover:border-primary transition-all text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center text-xl mb-6">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-4">Team Practice</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">Strengthen collaboration, communication, planning, version control, and accountable delivery across project groups.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Outcomes & Portal Helper Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border-[1.5px] border-blue-100 rounded-[2.5rem] p-10 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center text-xl mb-6">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-6">Learning Outcomes</h3>
                <ul className="space-y-4">
                  {[
                    "Prepare a complete proposal, report, and presentation.",
                    "Apply technical knowledge to solve a real problem.",
                    "Evaluate results using suitable measures and evidence.",
                    "Communicate decisions clearly to supervisors and panels."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-slate-600 font-medium">
                      <Check className="text-primary mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border-[1.5px] border-blue-100 rounded-[2.5rem] p-10 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center text-xl mb-6">
                  <Laptop className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-6">How the Portal Helps</h3>
                <ul className="space-y-4">
                  {[
                    "Centralizes proposal submission and supervisor review.",
                    "Tracks milestones, progress logs, and project evidence.",
                    "Improves coordination between students, supervisors, and coordinators.",
                    "Supports transparent evaluation and report management."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-slate-600 font-medium">
                      <Check className="text-primary mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ACADEMIC JOURNEY ARC */}
        <section className="py-16 md:py-24 bg-white border-b border-blue-100">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-bold text-slate-900 leading-[1.18] mb-5">The Academic Journey Arc</h2>
              <p className="text-[15px] text-slate-600 max-w-[640px] mx-auto leading-relaxed">
                FYP sits at the center of a student's transformation — bridging foundational knowledge with professional readiness.
              </p>
            </div>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-[72px] left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-[2px] bg-blue-100"></div>
              
              {[
                {
                  step: "01",
                  icon: BookOpen,
                  title: "Foundation Years",
                  desc: "Students build core competencies through coursework in programming, data structures, algorithms, databases, and software engineering — establishing the technical base for project work.",
                  highlight: "Academic Groundwork"
                },
                {
                  step: "02",
                  icon: Target,
                  title: "FYP Catalyst",
                  desc: "The FYP program channels this knowledge into a structured research project — teaching students to define problems, apply methods, manage timelines, and deliver results under supervision.",
                  highlight: "Applied Learning"
                },
                {
                  step: "03",
                  icon: TrendingUp,
                  title: "Professional Transition",
                  desc: "Graduates enter the job market or higher education with a demonstrable portfolio, hands-on experience, and the confidence to tackle complex, real-world computing challenges.",
                  highlight: "Career Readiness"
                }
              ].map((item, i) => (
                <div key={i} className="relative flex flex-col items-center text-center bg-white border-[1.5px] border-blue-100 rounded-[2rem] p-10 transition-all hover:border-primary hover:shadow-premium-shadow">
                  <div className="relative z-10 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-8 shadow-lg shadow-primary/20">
                    {React.createElement(item.icon, { className: "w-6 h-6" })}
                  </div>
                  <div className="absolute -top-3 right-8 text-5xl font-bold text-primary/[0.06] leading-none">{item.step}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-[14px] text-slate-600 font-medium leading-relaxed mb-6">{item.desc}</p>
                  <span className="inline-flex items-center gap-2 py-1.5 px-4 bg-blue-50 text-primary rounded-full text-[11px] font-bold">{item.highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPETENCIES BUILT THROUGH FYP */}
        <section className="py-16 md:py-24 bg-white border-b border-blue-100">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-bold text-slate-900 leading-[1.18] mb-5">Competencies Built Through FYP</h2>
              <p className="text-[15px] text-slate-600 max-w-[640px] mx-auto leading-relaxed">
                More than a project — FYP develops the complete skill set that defines a career-ready computing professional.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Code, title: "Technical Depth", desc: "Full-stack development, system architecture, API design, cloud deployment, and modern toolchain mastery through hands-on implementation." },
                { icon: Search, title: "Research & Analysis", desc: "Literature review, problem formulation, methodology selection, data collection, and rigorous evaluation aligned with academic standards." },
                { icon: LineChart, title: "Project Execution", desc: "Milestone planning, agile iteration, risk management, progress tracking, and on-time delivery within a structured academic timeline." },
                { icon: MessageSquare, title: "Professional Communication", desc: "Technical writing, documentation, presentation delivery, defense preparation, and clear articulation of complex ideas to diverse audiences." },
                { icon: Lightbulb, title: "Critical Thinking", desc: "Problem decomposition, trade-off analysis, creative solution design, iterative refinement, and evidence-based decision making throughout the project lifecycle." },
                { icon: Users, title: "Collaboration & Leadership", desc: "Team coordination, role distribution, conflict resolution, peer code review, and shared accountability — mirroring real-world engineering teams." }
              ].map((item, i) => (
                <div key={i} className="bg-white border-[1.5px] border-blue-100 rounded-[2rem] p-8 transition-all hover:border-primary hover:shadow-premium-shadow group">
                  <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center text-xl mb-6 transition-all group-hover:bg-primary group-hover:text-white">
                    {React.createElement(item.icon, { className: "w-5 h-5" })}
                  </div>
                  <h3 className="text-[1.125rem] font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-[13px] text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POST-FYP PATHWAYS */}
        <section className="py-16 md:py-24 bg-white border-b border-blue-100">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-bold text-slate-900 leading-[1.18] mb-5">Pathways After FYP</h2>
              <p className="text-[15px] text-slate-600 max-w-[640px] mx-auto leading-relaxed">
                A strong FYP opens doors across multiple career and academic trajectories.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Briefcase, title: "Industry Placement", stat: "80%+", statLabel: "Placement Rate", desc: "Graduates with strong FYP projects stand out in interviews, using their work as proof of technical and project delivery capability.", color: "text-blue-600" },
                { icon: GraduationCap, title: "Higher Education", stat: "40+", statLabel: "University Admissions", desc: "Research-oriented FYPs strengthen MS/PhD applications with publication potential and demonstrated research methodology.", color: "text-emerald-600" },
                { icon: Rocket, title: "Entrepreneurship", stat: "15+", statLabel: "Startups Launched", desc: "Market-aligned projects evolve into incubated startups, with support from CUI's innovation ecosystem and industry partners.", color: "text-purple-600" },
                { icon: Award, title: "Research Publication", stat: "25+", statLabel: "Papers Published", desc: "Select FYPs are published in IEEE, ACM, and Scopus-indexed conferences, giving students early research credentials.", color: "text-amber-600" }
              ].map((item, i) => (
                <div key={i} className="bg-white border-[1.5px] border-blue-100 rounded-[2rem] p-8 transition-all hover:border-primary hover:shadow-premium-shadow group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-150"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center text-xl mb-6">
                      {React.createElement(item.icon, { className: "w-5 h-5" })}
                    </div>
                    <div className={`text-3xl font-bold leading-none mb-1 ${item.color}`}>{item.stat}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-5">{item.statLabel}</div>
                    <h3 className="text-[1.125rem] font-bold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="bg-primary rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row relative">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="p-10 sm:p-14 lg:p-16 flex-[3] relative z-10">
                <h2 className="text-[clamp(1.8rem,3vw,3rem)] font-bold text-white leading-[1.2] mb-4">Ready to shape your academic future?</h2>
                <p className="text-[15px] md:text-[17px] text-blue-200 leading-relaxed max-w-[560px] mb-8">
                  The Final Year Project is your launchpad into the professional world. Start your journey today with the right guidance, tools, and support.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/eligibility" className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full font-bold bg-white text-primary shadow-lg hover:bg-blue-50 hover:-translate-y-px transition-all">
                    Check Eligibility <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/process" className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full font-bold bg-white/10 text-white border-[1.5px] border-white/30 hover:bg-white/20 transition-all">
                    View Workflow
                  </Link>
                </div>
              </div>
              <div className="bg-primary/30 backdrop-blur-[12px] p-8 sm:p-12 flex-[2] flex items-center justify-center relative z-10">
                <div className="bg-white/10 rounded-[2rem] p-8 w-full max-w-[320px] text-center border border-white/10">
                  <GraduationCap className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">FYP Portal</h3>
                  <p className="text-[13px] text-blue-200 leading-relaxed">Streamlined academic oversight, supervisor coordination, and evaluation workflows — all in one place.</p>
                </div>
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
