import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AlertTriangle, CalendarCheck, Check, FileText, Info, Scale, Upload } from 'lucide-react';

const Guidelines = () => {
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
                  Rules and best practices for a smooth FYP cycle.
                </h1>
                <p className="text-[15px] md:text-[17px] text-slate-600 leading-relaxed max-w-[600px]">
                  Use these guidelines to prepare submissions, follow documentation standards, meet deadlines, and keep the project academically sound.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-xl space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0 text-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 text-base">Documentation</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">Keep every report, diagram, citation, and appendix complete and consistent.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0 text-lg">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 text-base">Deadlines</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">Late submissions can affect review scheduling and evaluation readiness.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guideline Layout */}
        <section className="py-16 md:py-24 bg-white border-b border-blue-100">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                <section className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <FileText className="text-primary" /> Documentation Requirements
                  </h2>
                  <ul className="space-y-4">
                    {[
                      "Use the department-approved proposal and final report structure.",
                      "Include problem statement, objectives, scope, methodology, tools, timeline, and expected outcomes.",
                      "Maintain proper citations and avoid plagiarism in all written submissions.",
                      "Attach relevant diagrams, screenshots, test results, and appendices where required."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[15px] text-slate-600 font-medium">
                        <Check className="text-primary mt-1" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Upload className="text-primary" /> Submission Format
                  </h2>
                  <ul className="space-y-4">
                    {[
                      "Submit documents in PDF unless another format is officially announced.",
                      "Name files clearly with group ID, project title, and submission type.",
                      "Upload source code, datasets, or supporting files only in the requested format.",
                      "Verify that all files open correctly before final submission."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[15px] text-slate-600 font-medium">
                        <Check className="text-primary mt-1" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Scale className="text-primary" /> Academic Policies
                  </h2>
                  <ul className="space-y-4">
                    {[
                      "All work must be original and completed by registered group members.",
                      "Major scope changes require supervisor and coordinator approval.",
                      "Students must attend scheduled reviews, demos, and final defense sessions.",
                      "Evaluation decisions are based on rubrics, deliverables, presentation, and technical quality."
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[15px] text-slate-600 font-medium">
                        <Check className="text-primary mt-1" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Sidebar Notices */}
              <aside className="space-y-6">
                <div className="bg-white border-[1.5px] border-blue-100 rounded-[2rem] p-8 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-primary" /> Important Note
                  </h3>
                  <p className="text-[14px] text-slate-600 font-medium leading-relaxed">
                    Missing a deadline or submitting incomplete documents can delay supervisor review and may affect eligibility for evaluation.
                  </p>
                </div>

                <div className="bg-white border-[1.5px] border-blue-100 rounded-[2rem] p-8 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-3">
                    <Info className="w-4 h-4 text-primary" /> Best Practice
                  </h3>
                  <p className="text-[14px] text-slate-600 font-medium leading-relaxed">
                    Meet your supervisor regularly, record feedback, update progress logs, and keep a backup of every submission.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Guidelines;