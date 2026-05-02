import React from 'react';
import { 
  FileText, 
  Calendar, 
  UploadCloud, 
  ShieldCheck, 
  AlertTriangle, 
  Info 
} from 'lucide-react';

const Guidelines = () => {
  return (
    <div className="min-h-screen bg-[#f8faff] font-['DM_Sans']">
      
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#e8eeff] via-[#c7d9ff] to-[#dbeafe] px-6 lg:px-20 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-[#c7d4f5] rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              <FileText size={14} className="text-[#0d1b5e]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d1b5e]">Guidelines</span>
            </div>

            <h1 className="font-['Syne'] font-extrabold text-[#0d1b5e] text-5xl lg:text-7xl leading-[1.05] mb-8">
              Rules and best practices for a smooth FYP cycle.
            </h1>
            
            <p className="text-[#374151] text-lg leading-relaxed max-w-lg">
              Use these guidelines to prepare submissions, follow documentation standards, 
              meet deadlines, and keep the project academically sound.
            </p>
          </div>

          {/* Hero Side Card */}
          <div className="bg-white rounded-[32px] shadow-2xl p-8 lg:p-10 flex flex-col gap-8 max-w-md ml-auto border border-white/50">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#0d1b5e] text-lg mb-1">Documentation</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">
                  Keep every report, diagram, citation, and appendix complete and consistent.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#0d1b5e] text-lg mb-1">Deadlines</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">
                  Late submissions can affect review scheduling and evaluation readiness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-7xl mx-auto px-6 lg:px-20 py-16 grid lg:grid-cols-[1fr_380px] gap-12">
        
        {/* Left Column: Requirements Cards */}
        <div className="space-y-8">
          
          {/* Documentation Requirements */}
          <div className="bg-white rounded-[28px] border border-[#e9edf8] shadow-sm p-8 lg:p-10 transition-transform hover:scale-[1.01]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <FileText size={20} />
              </div>
              <h2 className="font-['Syne'] font-bold text-2xl text-[#0d1b5e]">Documentation Requirements</h2>
            </div>
            <ul className="space-y-5">
              {[
                "Use the department-approved proposal and final report structure.",
                "Include problem statement, objectives, scope, methodology, tools, timeline, and expected outcomes.",
                "Maintain proper citations and avoid plagiarism in all written submissions.",
                "Attach relevant diagrams, screenshots, test results, and appendices where required."
              ].map((item, i) => (
                <li key={i} className="flex gap-4 text-[#374151] text-base leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Submission Format */}
          <div className="bg-white rounded-[28px] border border-[#e9edf8] shadow-sm p-8 lg:p-10 transition-transform hover:scale-[1.01]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <UploadCloud size={20} />
              </div>
              <h2 className="font-['Syne'] font-bold text-2xl text-[#0d1b5e]">Submission Format</h2>
            </div>
            <ul className="space-y-5">
              {[
                "Submit documents in PDF unless another format is officially announced.",
                "Name files clearly with group ID, project title, and submission type.",
                "Upload source code, datasets, or supporting files only in the requested format.",
                "Verify that all files open correctly before final submission."
              ].map((item, i) => (
                <li key={i} className="flex gap-4 text-[#374151] text-base leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Academic Policies */}
          <div className="bg-white rounded-[28px] border border-[#e9edf8] shadow-sm p-8 lg:p-10 transition-transform hover:scale-[1.01]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <ShieldCheck size={20} />
              </div>
              <h2 className="font-['Syne'] font-bold text-2xl text-[#0d1b5e]">Academic Policies</h2>
            </div>
            <ul className="space-y-5">
              {[
                "All work must be original and completed by registered group members.",
                "Major scope changes require supervisor and coordinator approval.",
                "Students must attend scheduled reviews, demos, and final defense sessions.",
                "Evaluation decisions are based on rubrics, deliverables, presentation, and technical quality."
              ].map((item, i) => (
                <li key={i} className="flex gap-4 text-[#374151] text-base leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Sidebar Callouts */}
        <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="bg-[#fffbeb] border border-[#fcd34d] rounded-3xl p-7">
            <div className="flex items-center gap-3 text-[#92400e] font-bold mb-3">
              <AlertTriangle size={18} />
              <span>Important Note</span>
            </div>
            <p className="text-[#92400e] text-sm leading-relaxed font-medium">
              Missing a deadline or submitting incomplete documents can delay supervisor review 
              and may affect eligibility for evaluation.
            </p>
          </div>

          <div className="bg-[#eff6ff] border border-[#93c5fd] rounded-3xl p-7">
            <div className="flex items-center gap-3 text-[#1e40af] font-bold mb-3">
              <Info size={18} />
              <span>Best Practice</span>
            </div>
            <p className="text-[#1e40af] text-sm leading-relaxed font-medium">
              Meet your supervisor regularly, record feedback, update progress logs, 
              and keep a backup of every submission.
            </p>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default Guidelines;