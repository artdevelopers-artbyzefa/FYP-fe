import React from 'react';
import { 
  CheckCircle2, 
  Mail, 
  BookOpen, 
  ListTodo, 
  BarChart3, 
  Users2, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

const Eligibility = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* ── HERO SECTION ── */}
      <section className="bg-gradient-to-br from-[#dce8f7] via-[#e9f1fb] to-[#f8faff] px-6 lg:px-20 py-16 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-3xl text-left">
          <div className="inline-flex items-center gap-2 bg-white/60 border border-[#2a3fa5]/10 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-[#2a3fa5] rounded-full"></span>
            <GraduationCap size={14} className="text-[#1a2b6b]" />
            <span className="text-[12px] font-black uppercase tracking-widest text-[#1a2b6b]">Eligibility Criteria</span>
          </div>
          
          <h1 className="text-[#111827] text-5xl lg:text-[72px] font-black leading-[1.1] tracking-tight mb-8">
            Know the academic requirements before starting your FYP.
          </h1>
          
          <p className="text-[#4b5563] text-lg leading-relaxed max-w-xl">
            These criteria help ensure that students begin the Final Year Project with the required academic foundation, course coverage, and readiness for independent project work.
          </p>
        </div>

        {/* Floating Info Card */}
        <div className="bg-white p-8 rounded-[24px] shadow-xl shadow-blue-900/5 border border-[#e5eaf5] w-full max-w-sm flex flex-col gap-8">
          <div className="flex gap-4">
            <div className="bg-[#eef1fb] p-3 rounded-full h-fit flex items-center justify-center">
              <CheckCircle2 className="text-[#2a3fa5] w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#111827] text-[17px]">Check First</h4>
              <p className="text-sm text-[#4b5563] leading-snug mt-1">Confirm your credit hours, prerequisite courses, and academic standing before group registration.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#eef1fb] p-3 rounded-full h-fit flex items-center justify-center">
              <Mail className="text-[#2a3fa5] w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#111827] text-[17px]">Need Help?</h4>
              <p className="text-sm text-[#4b5563] leading-snug mt-1">Students with pending cases should contact the FYP coordinator before submission deadlines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARDS GRID ── */}
      <section className="px-6 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          
          {/* Card 1: Credit Hours */}
          <div className="p-8 lg:p-10 rounded-[32px] border border-[#d1dbe8] hover:border-[#b0c0df] hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 bg-white">
            <div className="bg-[#eef1fb] w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="text-[#2a3fa5] w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-[#111827] mb-4">Completed Credit Hours</h3>
            <p className="text-[#4b5563] leading-relaxed mb-8">
              Students should have completed the minimum credit hour threshold required by the department before enrolling in FYP.
            </p>
            <span className="inline-flex items-center gap-2 bg-[#eef1fb] text-[#2a3fa5] px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-wider">
              <CheckCircle2 size={12} /> Academic Progress
            </span>
          </div>

          {/* Card 2: Required Courses */}
          <div className="p-8 lg:p-10 rounded-[32px] border border-[#d1dbe8] hover:border-[#b0c0df] hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 bg-white">
            <div className="bg-[#eef1fb] w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <ListTodo className="text-[#2a3fa5] w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-[#111827] mb-4">Required Courses</h3>
            <p className="text-[#4b5563] leading-relaxed mb-8">
              Core software engineering, database, programming, and research-related courses should be completed or approved as per department policy.
            </p>
            <span className="inline-flex items-center gap-2 bg-[#eef1fb] text-[#2a3fa5] px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-wider">
              <CheckCircle2 size={12} /> Prerequisites
            </span>
          </div>

          {/* Card 3: CGPA */}
          <div className="p-8 lg:p-10 rounded-[32px] border border-[#d1dbe8] hover:border-[#b0c0df] hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 bg-white">
            <div className="bg-[#eef1fb] w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <BarChart3 className="text-[#2a3fa5] w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-[#111827] mb-4">CGPA Standing</h3>
            <p className="text-[#4b5563] leading-relaxed mb-8">
              Students must satisfy the minimum CGPA condition defined by the academic office and remain in good academic standing.
            </p>
            <span className="inline-flex items-center gap-2 bg-[#eef1fb] text-[#2a3fa5] px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-wider">
              <CheckCircle2 size={12} /> Performance
            </span>
          </div>

          {/* Card 4: Group Formation */}
          <div className="p-8 lg:p-10 rounded-[32px] border border-[#d1dbe8] hover:border-[#b0c0df] hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 bg-white">
            <div className="bg-[#eef1fb] w-14 h-14 rounded-full flex items-center justify-center mb-6">
              <Users2 className="text-[#2a3fa5] w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-[#111827] mb-4">Approved Group Formation</h3>
            <p className="text-[#4b5563] leading-relaxed mb-8">
              Project groups should be formed according to the allowed group size and registration rules announced by the FYP coordinator.
            </p>
            <span className="inline-flex items-center gap-2 bg-[#eef1fb] text-[#2a3fa5] px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-wider">
              <CheckCircle2 size={12} /> Registration
            </span>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-6 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto bg-[#1a2b6b] rounded-[40px] p-12 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-white text-4xl lg:text-6xl font-black leading-[1.1] mb-6">
              Do not meet a requirement yet?
            </h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
              Consult the FYP coordinator or academic advisor early. They can confirm whether you should wait for the next cycle, resolve a pending prerequisite, or submit a formal approval request.
            </p>
          </div>
          
          <button className="relative z-10 border-2 border-white/40 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-all whitespace-nowrap">
            Contact Office <ArrowRight size={20} />
          </button>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 rounded-full translate-x-1/3 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl"></div>
        </div>
      </section>
    </div>
  );
};

export default Eligibility;