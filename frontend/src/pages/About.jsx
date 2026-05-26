import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowRight, Award, Check, Code, GraduationCap, Laptop, Lightbulb, LineChart, Search, User, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="font-poppins bg-white text-black min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Page Hero */}
        <section className="bg-gradient- /95 /80 /90 py-16 md:py-24 border-b border-black">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-black/5 border border-black/10 rounded-full text-black text-[0.7rem] font-extrabold uppercase tracking-[0.24em] mb-6">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  <GraduationCap className="w-4 h-4" /> About Program
                </div>
                <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-black text-black leading-tight mb-5">
                  A structured path from classroom learning to professional project delivery.
                </h1>
                <p className="text-[15px] md:text-[17px] text-black leading-relaxed max-w-[600px] mb-8">
                  The Final Year Project program helps students apply research, engineering, design, and teamwork skills to meaningful computing problems under faculty supervision.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/eligibility" className="inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full font-bold bg-black text-white shadow-lg hover:bg-black hover:-translate-y-px transition-all text-sm">
                    Check Eligibility <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/process" className="inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full font-bold bg-transparent text-black border-[1.5px] border-black hover:bg-white transition-all text-sm">
                    View Workflow
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-black shadow-xl space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black shrink-0 text-lg">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-1 text-base">Innovation Focus</h3>
                    <p className="text-sm text-black leading-relaxed">Students select, research, build, and defend a solution with measurable academic value.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black shrink-0 text-lg">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-1 text-base">Faculty Guidance</h3>
                    <p className="text-sm text-black leading-relaxed">Supervisors guide scope, milestones, documentation, and evaluation readiness.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black shrink-0 text-lg">
                    <LineChart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-1 text-base">Digital Management</h3>
                    <p className="text-sm text-black leading-relaxed">The portal keeps submissions, feedback, coordination, and progress records in one place.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Objectives Section */}
        <section className="py-16 md:py-24 bg-white border-b border-black">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <p className="text-[0.7rem] font-extrabold text-black uppercase tracking-[0.24em] mb-3">Program Objectives</p>
              <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-black text-black leading-tight">What the FYP program builds</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white border-[1.5px] border-black rounded-[2rem] p-8 hover:border-black transition-all text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center text-xl mb-6">
                  <Search className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-black mb-4">Research Discipline</h3>
                <p className="text-sm text-black leading-relaxed font-medium">Encourage students to identify problems, review related work, define scope, and use an appropriate methodology.</p>
              </div>
              <div className="bg-white border-[1.5px] border-black rounded-[2rem] p-8 hover:border-black transition-all text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center text-xl mb-6">
                  <Code className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-black mb-4">Practical Engineering</h3>
                <p className="text-sm text-black leading-relaxed font-medium">Translate computing concepts into working software, systems, experiments, or prototypes that can be demonstrated.</p>
              </div>
              <div className="bg-white border-[1.5px] border-black rounded-[2rem] p-8 hover:border-black transition-all text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center text-xl mb-6">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-black mb-4">Team Practice</h3>
                <p className="text-sm text-black leading-relaxed font-medium">Strengthen collaboration, communication, planning, version control, and accountable delivery across project groups.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Outcomes & Portal Helper Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border-[1.5px] border-black rounded-[2.5rem] p-10 shadow-sm">
                <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center text-xl mb-6">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-black text-black mb-6">Learning Outcomes</h3>
                <ul className="space-y-4">
                  {[
                    "Prepare a complete proposal, report, and presentation.",
                    "Apply technical knowledge to solve a real problem.",
                    "Evaluate results using suitable measures and evidence.",
                    "Communicate decisions clearly to supervisors and panels."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-black font-medium">
                      <Check className="text-black mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border-[1.5px] border-black rounded-[2.5rem] p-10 shadow-sm">
                <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center text-xl mb-6">
                  <Laptop className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-black text-black mb-6">How the Portal Helps</h3>
                <ul className="space-y-4">
                  {[
                    "Centralizes proposal submission and supervisor review.",
                    "Tracks milestones, progress logs, and project evidence.",
                    "Improves coordination between students, supervisors, and coordinators.",
                    "Supports transparent evaluation and report management."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] text-black font-medium">
                      <Check className="text-black mt-1" />
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
