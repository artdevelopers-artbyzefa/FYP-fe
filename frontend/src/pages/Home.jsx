import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, BookOpen, Users, Rocket, Award, 
  CheckCircle2, FileText, ClipboardCheck, Presentation 
} from 'lucide-react';

function Home() {
  return (
    <div className="bg-[#f5f7fc] min-h-screen">
      
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden bg-[#dde8f8] py-20 lg:py-32">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#0d1b4b_1px,transparent_1px)] [background-size:30px_30px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/60 border border-[#b0c4e8] rounded-full px-4 py-1.5 shadow-sm mb-8">
              <span className="w-2 h-2 bg-[#2251f3] rounded-full animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d1b4b]">
                CUI Abbottabad Official
              </span>
            </div>
            
            <h1 className="font-['Manrope'] font-[900] text-5xl md:text-7xl text-[#0d1b4b] leading-[1.1] tracking-tight mb-8">
              Empowering Innovation <br /> 
              <span className="text-[#2251f3]">One Project at a Time</span>
            </h1>
            
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
              The official Final Year Project Management Portal for the Department of Computer Science. 
              Bridging the gap between academic theory and professional engineering excellence.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/process" className="bg-[#0d1b4b] hover:bg-[#1e3fa8] text-white font-bold py-4 px-8 rounded-xl flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-blue-900/20">
                Start Your Journey <ArrowRight size={20} />
              </Link>
              <Link to="/eligibility" className="bg-white hover:bg-[#f8fafc] text-[#0d1b4b] border-2 border-[#d1daf0] font-bold py-4 px-8 rounded-xl transition-all shadow-sm">
                Check Eligibility
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="relative -mt-12 z-20 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-[24px] shadow-2xl shadow-blue-900/5 grid grid-cols-2 md:grid-cols-4 border border-[#d1daf0] divide-x divide-[#d1daf0]">
          {[
            { label: 'Annual Projects', value: '150+' },
            { label: 'Active Supervisors', value: '45+' },
            { label: 'Industry Partners', value: '20+' },
            { label: 'Success Rate', value: '98%' },
          ].map((stat, i) => (
            <div key={i} className="py-8 text-center px-4">
              <div className="text-2xl font-[900] text-[#0d1b4b]">{stat.value}</div>
              <div className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── OBJECTIVES SECTION ─── */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#2251f3] text-xs font-[900] tracking-[0.2em] uppercase">Core Philosophy</span>
            <h2 className="font-['Manrope'] font-[900] text-[#0d1b4b] text-4xl mt-4">Program Objectives</h2>
            <div className="w-16 h-1 bg-[#2251f3] mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, title: 'Research Discipline', desc: 'Master the art of problem identification and systematic literature review.', color: 'blue' },
              { icon: Users, title: 'Team Practice', desc: 'Simulate industry environments through collaborative project management.', color: 'indigo' },
              { icon: Rocket, title: 'Engineering Excellence', desc: 'Build robust, scalable software solutions with modern tech stacks.', color: 'blue' },
              { icon: Award, title: 'Professional Growth', desc: 'Showcase your technical prowess to global recruiters and stakeholders.', color: 'indigo' }
            ].map((item, idx) => (
              <div key={idx} className="group bg-white border-2 border-[#d1daf0] p-8 rounded-[24px] hover:border-[#2251f3] transition-all duration-300 hover:shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-[#eef2fb] flex items-center justify-center mb-6 group-hover:bg-[#2251f3] transition-colors">
                  <item.icon className="w-7 h-7 text-[#1e3fa8] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-['Manrope'] font-extrabold text-xl text-[#0d1b4b] mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── QUICK STEPS SECTION ─── */}
      <section className="py-24 bg-white border-y border-[#d1daf0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#2251f3] text-xs font-[900] tracking-[0.2em] uppercase">The Workflow</span>
              <h2 className="font-['Manrope'] font-[900] text-[#0d1b4b] text-4xl mt-4 mb-6">How the Portal Works</h2>
              <p className="text-gray-500 text-lg mb-8">A structured pathway designed to guide students from their initial proposal to the final degree award.</p>
              
              <div className="space-y-6">
                {[
                  { icon: CheckCircle2, title: 'Check Eligibility', text: 'Verify credit hours and GPA requirements automatically.' },
                  { icon: FileText, title: 'Proposal Submission', text: 'Submit your project abstract for departmental review.' },
                  { icon: ClipboardCheck, title: 'Internal Evaluation', text: 'Regular progress tracking with assigned supervisors.' },
                  { icon: Presentation, title: 'Final Defense', text: 'Present your hard work to the external examination board.' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="mt-1 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <step.icon size={14} className="text-[#2251f3]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0d1b4b]">{step.title}</h4>
                      <p className="text-sm text-gray-500">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#2251f3]/10 to-transparent rounded-[32px] blur-2xl"></div>
              <div className="relative bg-[#dde8f8] rounded-[32px] p-2 border-4 border-white shadow-2xl">
                {/* Visual Placeholder for a portal screenshot or graphic */}
                <div className="aspect-video bg-[#0d1b4b] rounded-[24px] flex items-center justify-center overflow-hidden">
                   <img 
                    src="/api/placeholder/800/450" 
                    alt="Portal Preview" 
                    className="opacity-50 object-cover w-full h-full"
                   />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-md p-6 rounded-full">
                        <Rocket size={48} className="text-white" />
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-[#0d1b4b] rounded-[40px] p-12 lg:p-20 text-center relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
          
          <h2 className="font-['Manrope'] font-[900] text-3xl md:text-5xl text-white mb-6 relative z-10">
            Ready to build something <br />extraordinary?
          </h2>
          <p className="text-blue-100/70 text-lg mb-10 max-w-xl mx-auto relative z-10">
            Access the portal now to register your team, find a supervisor, and begin your final year journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <button className="bg-[#2251f3] hover:bg-blue-600 text-white font-[900] px-10 py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/20">
              Access Student Portal
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-[900] px-10 py-4 rounded-2xl transition-all border border-white/20">
              Faculty Login
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;