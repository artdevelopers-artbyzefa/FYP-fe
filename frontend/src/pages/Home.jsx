import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="font-poppins bg-lightbg text-gray-700 min-h-screen overflow-x-hidden">
      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-[130px] pb-[80px] min-h-[88vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/95 via-blue-100/80 to-blue-50/90"></div>
            <div className="absolute w-[600px] h-[600px] rounded-full blur-[80px] pointer-events-none bg-[radial-gradient(circle,rgba(37,99,235,0.12)_0%,transparent_70%)] -top-[200px] -right-[100px]"></div>
            <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] pointer-events-none bg-[radial-gradient(circle,rgba(30,58,138,0.08)_0%,transparent_70%)] -bottom-[50px] -left-[50px]"></div>
          </div>
          
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-blue-900/5 border border-blue-900/10 rounded-full text-primary text-[0.7rem] font-extrabold uppercase tracking-[0.18em] mb-8 animate-[bounceSlow_3s_infinite]">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-[pulseDot_1.5s_infinite]"></span>
              <i className="fas fa-graduation-cap"></i>
              Empowering Research & Innovation
            </div>
            <h1 className="text-[clamp(2.2rem,6vw,4.5rem)] font-black text-gray-900 leading-[1.08] tracking-[-0.02em] mb-6">
              Professionalizing Your<br />
              <span className="text-primary italic">FYP Experience</span>
            </h1>
            <p className="max-w-[640px] mx-auto mb-10 text-[clamp(0.9rem,1.5vw,1.1rem)] text-gray-500 leading-[1.8]">
              Welcome to COMSATS University Islamabad, Abbottabad Campus's Digital Final Year Project
              Management System. Streamlining academic oversight, supervisor coordination, and evaluation workflows.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="/login" className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-3xl font-poppins text-[1.125rem] font-bold bg-primary text-white shadow-[0_8px_24px_rgba(30,58,138,0.18)] hover:bg-blue-800 hover:shadow-[0_16px_48px_rgba(30,58,138,0.22)] hover:-translate-y-px transition-all text-center">
                Access Portal <i className="fas fa-arrow-right"></i>
              </a>
              <a href="#about" className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-3xl font-poppins text-[1.125rem] font-bold bg-transparent text-gray-900 border-[1.5px] border-gray-200 hover:bg-gray-50 hover:border-secondary hover:text-secondary transition-all text-center">
                Learn More About Program
              </a>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <div className="bg-white border-y border-blue-100 py-6">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-4 justify-center">
              <div className="w-[44px] h-[44px] rounded-2xl flex items-center justify-center text-[1.1rem] shrink-0 bg-violet-100 text-violet-600"><i className="fas fa-book-open"></i></div>
              <div><div className="text-[1.5rem] font-black leading-none text-primary">300+</div><div className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-[0.08em] mt-[2px]">Active Projects</div></div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <div className="w-[44px] h-[44px] rounded-2xl flex items-center justify-center text-[1.1rem] shrink-0 bg-emerald-100 text-emerald-600"><i className="fas fa-users"></i></div>
              <div><div className="text-[1.5rem] font-black leading-none text-emerald-600">80+</div><div className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-[0.08em] mt-[2px]">Supervisors</div></div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <div className="w-[44px] h-[44px] rounded-2xl flex items-center justify-center text-[1.1rem] shrink-0 bg-amber-100 text-amber-600"><i className="fas fa-file-alt"></i></div>
              <div><div className="text-[1.5rem] font-black leading-none text-amber-600">100%</div><div className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-[0.08em] mt-[2px]">Digital Reports</div></div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <div className="w-[44px] h-[44px] rounded-2xl flex items-center justify-center text-[1.1rem] shrink-0 bg-rose-100 text-rose-500"><i className="fas fa-award"></i></div>
              <div><div className="text-[1.5rem] font-black leading-none text-rose-500">Top</div><div className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-[0.08em] mt-[2px]">Accreditations</div></div>
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <section id="about" className="py-16 md:py-24 bg-white border-b border-blue-100">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <p className="text-[0.7rem] font-extrabold text-secondary uppercase tracking-[0.24em] mb-3">The Program Purpose</p>
                <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-black text-gray-900 leading-[1.18] mb-5">Empowering Students Through Applied Research</h2>
                <p className="text-[15px] text-gray-500 leading-[1.75] mb-8">
                  The Final Year Project program is the cornerstone of our CS curriculum, providing students with
                  the opportunity to apply theoretical knowledge to real-world problems, guided by experienced faculty supervisors.
                </p>
                <div className="flex flex-col gap-8">
                  <div className="flex items-start gap-5">
                    <div className="w-[44px] h-[44px] bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary animate-[pulseDot_2s_infinite]"></div>
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-gray-900 mb-1">Research Excellence</h4>
                      <p className="text-[13px] text-gray-500 font-medium leading-[1.7]">Fostering innovation through structured research methodologies and academic rigor.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-[44px] h-[44px] bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary animate-[pulseDot_2s_infinite]"></div>
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-gray-900 mb-1">Expert Supervision</h4>
                      <p className="text-[13px] text-gray-500 font-medium leading-[1.7]">Dedicated faculty mentorship bridging theoretical knowledge and practical implementation.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-[44px] h-[44px] bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary animate-[pulseDot_2s_infinite]"></div>
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-gray-900 mb-1">Structured Evaluation</h4>
                      <p className="text-[13px] text-gray-500 font-medium leading-[1.7]">Comprehensive multi-stage evaluation ensuring academic integrity and project quality.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-[2.5rem] p-8 relative overflow-hidden">
                <div className="absolute w-[96px] h-[96px] bg-blue-900/10 blur-[24px] rounded-full -top-4 -right-4 pointer-events-none"></div>
                <div className="absolute w-[128px] h-[128px] bg-blue-500/10 blur-[32px] rounded-full -bottom-4 -left-4 pointer-events-none"></div>
                
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-white p-8 rounded-[2rem] border border-blue-100 flex flex-col justify-center min-h-[170px] transition-all duration-200 hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                    <i className="fas fa-book-open text-2xl mb-5 text-indigo-500"></i>
                    <div className="text-[1.75rem] font-black leading-none mb-1 text-primary">300+</div>
                    <div className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-[0.1em]">Active Projects</div>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] border border-blue-100 flex flex-col justify-center min-h-[170px] mt-8 transition-all duration-200 hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                    <i className="fas fa-users text-2xl mb-5 text-emerald-500"></i>
                    <div className="text-[1.75rem] font-black leading-none mb-1 text-emerald-600">80+</div>
                    <div className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-[0.1em]">Supervisors</div>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] border border-blue-100 flex flex-col justify-center min-h-[170px] transition-all duration-200 hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                    <i className="fas fa-tasks text-2xl mb-5 text-amber-500"></i>
                    <div className="text-[1.75rem] font-black leading-none mb-1 text-amber-600">100%</div>
                    <div className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-[0.1em]">Digital Tracking</div>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] border border-blue-100 flex flex-col justify-center min-h-[170px] mt-8 transition-all duration-200 hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                    <i className="fas fa-star text-2xl mb-5 text-rose-500"></i>
                    <div className="text-[1.75rem] font-black leading-none mb-1 text-rose-500">Top</div>
                    <div className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-[0.1em]">Accreditations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS SECTION */}
        <section id="process" className="py-16 md:py-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <p className="text-[0.7rem] font-extrabold text-secondary uppercase tracking-[0.24em] mb-3">FYP Lifecycle</p>
              <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-black text-gray-900 leading-[1.18] mb-5">Understanding the FYP Process</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', icon: 'fa-file-alt', title: 'Proposal Submission', desc: 'Students submit project proposals with title, abstract, objectives, and methodology for review.' },
                { step: '02', icon: 'fa-user-tie', title: 'Supervisor Assignment', desc: 'FYP coordinator assigns qualified supervisors based on domain expertise and availability.' },
                { step: '03', icon: 'fa-chart-line', title: 'Progress Tracking', desc: 'Regular progress updates, milestone submissions, and supervisor feedback cycles throughout the year.' },
                { step: '04', icon: 'fa-graduation-cap', title: 'Final Evaluation', desc: 'Comprehensive evaluation panel review, viva voce, and final grading by faculty committee.' }
              ].map((item, i) => (
                <div key={i} className="group bg-white border-[1.5px] border-blue-100 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                  <div className="absolute -top-10 -right-10 w-[120px] h-[120px] bg-blue-900/5 rounded-full transition-transform duration-500 group-hover:scale-[1.8]"></div>
                  <div className="text-6xl font-black text-blue-900/[0.07] leading-none mb-5 tracking-[-0.04em] transition-colors duration-200 group-hover:text-blue-900/[0.12]">{item.step}</div>
                  <div className="w-[44px] h-[44px] bg-blue-900/5 text-primary rounded-xl flex items-center justify-center text-[1.1rem] mb-6 transition-all duration-200 group-hover:bg-primary group-hover:text-white">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h3 className="text-[1.125rem] font-extrabold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-[13px] text-gray-500 font-medium leading-[1.7]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ANNOUNCEMENTS SECTION */}
        <section id="announcements" className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex flex-wrap justify-between items-end gap-6 mb-14">
              <div>
                <p className="text-[0.7rem] font-extrabold text-blue-300 uppercase tracking-[0.24em] mb-3">Latest Updates</p>
                <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-black text-white leading-[1.18]">FYP Announcements<br />&amp; News</h2>
              </div>
              <button className="bg-white/10 text-white border-[1.5px] border-white/20 px-5 py-2.5 rounded-full font-bold text-[13px] hover:bg-white/20 transition-colors flex items-center gap-2">
                View All <i className="fas fa-external-link-alt"></i>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { date: 'APRIL 20, 2026', title: 'FYP Proposal Submission Deadline Extended', desc: 'The deadline for FYP proposal submissions for the Spring 2026 semester has been extended to May 5, 2026.' },
                { date: 'APRIL 15, 2026', title: 'Mid-Term Progress Review Schedule Released', desc: 'The schedule for mid-term FYP progress reviews has been published. Students must submit progress reports by April 30.' },
                { date: 'APRIL 10, 2026', title: 'Final Year Project Exhibition — Registration Open', desc: 'Registration for the Annual FYP Exhibition 2026 is now open. All groups completing their FYP must register before April 28.' }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col gap-4 transition-colors hover:bg-white/10">
                  <div className="flex items-center gap-2 text-[0.6rem] font-extrabold text-blue-400 uppercase tracking-[0.15em]">
                    <i className="fas fa-bell"></i> {item.date}
                  </div>
                  <h3 className="text-lg font-bold text-white leading-[1.4]">{item.title}</h3>
                  <p className="text-[13px] text-slate-400 leading-[1.7] flex-1">{item.desc}</p>
                  <button className="inline-flex items-center gap-2 text-[13px] font-bold text-white mt-auto group transition-all">
                    Read Full Notice <i className="fas fa-arrow-right transition-transform group-hover:translate-x-1"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-16 md:py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="bg-primary rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row">
              <div className="p-8 sm:p-10 lg:p-16 flex-[3]">
                <p className="text-[0.7rem] font-extrabold text-blue-300 uppercase tracking-[0.24em] mb-3">Contact Us</p>
                <h2 className="text-[clamp(1.6rem,3vw,3rem)] font-black text-white leading-[1.2] mb-12">Need Assistance?<br />We're here to help.</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="w-[44px] h-[44px] bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0"><i className="fas fa-envelope"></i></div>
                    <div>
                      <h4 className="text-[13px] font-bold text-white mb-1">Email Us</h4>
                      <p className="text-[13px] text-blue-200 leading-[1.6]">csfyp@cuiatd.edu.pk</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-[44px] h-[44px] bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0"><i className="fas fa-phone"></i></div>
                    <div>
                      <h4 className="text-[13px] font-bold text-white mb-1">Call Us</h4>
                      <p className="text-[13px] text-blue-200 leading-[1.6]">+92-992-383591 Ext. 240</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 md:col-span-2">
                    <div className="w-[44px] h-[44px] bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0"><i className="fas fa-map-marker-alt"></i></div>
                    <div>
                      <h4 className="text-[13px] font-bold text-white mb-1">Our Location</h4>
                      <p className="text-[13px] text-blue-200 leading-[1.6]">FYP Office, CS Department, COMSATS University Islamabad, Abbottabad Campus</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-600/30 backdrop-blur-[12px] p-6 sm:p-10 flex-[2] flex items-center justify-center">
                <div className="bg-white rounded-[2rem] p-10 w-full max-w-[360px] shadow-[0_20px_40px_rgba(0,0,0,0.12)] text-center">
                  <h3 className="text-xl font-black text-gray-900 mb-2">FYP Office</h3>
                  <p className="text-[13px] text-gray-500 italic font-medium mb-6">Monday – Friday: 08:30 AM – 04:30 PM</p>
                  <a href="mailto:csfyp@cuiatd.edu.pk" className="block w-full py-3 px-5 rounded-xl font-bold bg-primary text-white shadow-[0_8px_24px_rgba(30,58,138,0.18)] hover:bg-blue-800 transition-all text-[13px] text-center flex items-center justify-center gap-2">
                    Submit Query <i className="fas fa-arrow-right"></i>
                  </a>
                  <a href="https://www.cuiatd.edu.pk/" target="_blank" rel="noopener noreferrer" className="block w-full mt-2 py-3 px-5 rounded-xl font-bold bg-transparent border-[1.5px] border-gray-200 text-gray-500 hover:bg-gray-50 transition-all text-[13px] text-center">
                    Official Website
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
