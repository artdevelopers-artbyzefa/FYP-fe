import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Award, CheckCircle, Clock, Code, FileEdit, Lightbulb, MessageSquare, Route, User } from 'lucide-react';

const Process = () => {
  const steps = [
    {
      step: "Step 01",
      icon: Lightbulb,
      title: "Topic Selection",
      desc: "Students explore ideas, identify a problem, form a group, and prepare an initial project direction.",
    },
    {
      step: "Step 02",
      icon: FileEdit,
      title: "Idea Submission",
      desc: "The group submits title, abstract, objectives, tools, and expected outcomes for initial review.",
    },
    {
      step: "Step 03",
      icon: User,
      title: "Supervisor Allocation",
      desc: "The coordinator assigns or confirms a supervisor according to domain fit and faculty availability.",
    },
    {
      step: "Step 04",
      icon: CheckCircle,
      title: "Proposal Approval",
      desc: "The proposal is reviewed, revised if needed, and approved before full implementation begins.",
    },
    {
      step: "Step 05",
      icon: Code,
      title: "Development Phase",
      desc: "Students build, test, document, and submit progress updates through milestones and logs.",
    },
    {
      step: "Step 06",
      icon: Award,
      title: "Final Defense",
      desc: "The group presents the completed work, submits the final report, and receives evaluation panel feedback.",
    },
  ];

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
                  <Route className="w-4 h-4" /> FYP Workflow
                </div>
                <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-black text-black leading-tight mb-5">
                  A clear lifecycle from project idea to final evaluation.
                </h1>
                <p className="text-[15px] md:text-[17px] text-black leading-relaxed max-w-[600px]">
                  The process page gives students a practical view of each major stage, the expected output, and how the portal supports progress throughout the year.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-black shadow-xl space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black shrink-0 text-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-1 text-base">Milestone Based</h3>
                    <p className="text-sm text-black leading-relaxed">Each phase has clear submissions, reviews, and feedback checkpoints.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black shrink-0 text-lg">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-1 text-base">Coordinated Review</h3>
                    <p className="text-sm text-black leading-relaxed">Students, supervisors, coordinators, and evaluators stay aligned through the portal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-16 md:py-24 bg-white border-b border-black">
          <div className="container max-w-[1000px] mx-auto px-4 sm:px-6">
            <div className="relative">
              {/* Vertical line for the timeline */}
              <div className="absolute left-[22px] md:left-[27px] top-8 bottom-8 w-[2px] bg-white"></div>
              
              <div className="space-y-10">
                {steps.map((item, index) => (
                  <div key={index} className="relative flex items-start gap-8 md:gap-12">
                    <div className="relative z-10 w-11 md:w-14 h-11 md:h-14 bg-white border-[1.5px] border-black text-black rounded-full flex items-center justify-center text-lg md:text-xl shadow-sm shrink-0">
                      {React.createElement(item.icon, { className: "w-4 h-4" })}
                    </div>
                    <div className="bg-white border-[1.5px] border-black rounded-[2rem] p-8 md:p-10 shadow-sm flex-grow transition-all hover:border-blue-600 hover:shadow-md">
                      <div className="text-[12px] font-black text-black uppercase tracking-[0.15em] mb-3">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-black text-black mb-4">{item.title}</h3>
                      <p className="text-[15px] text-black font-medium leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Process;