import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowRight, Award, Bell, BookOpen, ClipboardList, ExternalLink, FileText, GraduationCap, LineChart, Mail, MapPin, Phone, Star, User, Users, Calendar } from 'lucide-react';

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [bgSlides, setBgSlides] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    fetch('/api/announcements/public')
      .then(r => r.json())
      .then(res => { if (res.success) setAnnouncements(res.data); })
      .catch(() => {});
    fetch('/api/hero/public')
      .then(r => r.json())
      .then(res => { if (res.success && res.data.length > 0) setBgSlides(res.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (bgSlides.length < 2) return;
    const timer = setInterval(() => {
      setBgIndex(prev => (prev + 1) % bgSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [bgSlides.length]);
  return (
    <div className="font-poppins bg-white text-slate-700 min-h-screen overflow-x-hidden">
      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-slate-900">
          <div className="absolute inset-0 z-0">
            {bgSlides.length > 0 ? bgSlides.map((slide, i) => (
              <img key={slide._id} src={slide.imageUrl} alt=""
                className={`absolute inset-0 w-full h-full object-cover scale-110 transition-opacity duration-1000 ${i === bgIndex ? 'opacity-100' : 'opacity-0'}`} />
            )) : (
              <img src="/HOMEPAGEBG.png" alt="" className="w-full h-full object-cover scale-110" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-blue-800/40 to-black/60"></div>
            <div className="absolute inset-0 backdrop-blur-[6px]"></div>
            <div className="absolute inset-0 bg-blue-500/10"></div>
          </div>

          <div className="max-w-[1400px] mx-auto px-6 sm:px-8 relative z-10 w-full pt-36 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left - Text Content */}
              <div className="text-center lg:text-left flex flex-col justify-center">
                <h1 className="text-[clamp(2.8rem,6vw,5.2rem)] font-black text-white leading-[1.1] tracking-[-0.03em] mb-4">
                  Professionalizing<br />
                  <span className="bg-gradient-to-r from-blue-300 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-lg inline-block mt-2">
                    Your FYP Experience
                  </span>
                </h1>
                <p className="max-w-[560px] text-[clamp(1rem,1.4vw,1.15rem)] text-white/70 leading-[1.8] mb-10">
                  Welcome to COMSATS University Islamabad, Abbottabad Campus's Digital Final Year Project
                  Management System.
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Link to="/login" className="inline-flex items-center gap-2 py-4 px-8 rounded-2xl font-bold text-[1.1rem] bg-white text-primary shadow-xl hover:bg-blue-50 hover:shadow-2xl hover:-translate-y-0.5 transition-all">
                    Access Portal <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/student-portal" className="inline-flex items-center gap-2 py-4 px-8 rounded-2xl font-bold text-[1.1rem] bg-white/10 text-white backdrop-blur-[8px] border border-white/20 hover:bg-white/20 transition-all">
                    <GraduationCap className="w-5 h-5" /> Student Portal
                  </Link>
                </div>
              </div>

              {/* Right - Updates */}
              <div className="flex flex-col gap-6 lg:pl-8">
                <div className="bg-white border-2 border-blue-200/60 p-4 shadow-lg w-full max-w-[520px] ml-auto relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50/60 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-blue-100 relative z-10">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <h3 className="text-slate-900 font-bold text-[0.8rem] uppercase tracking-wider">Latest Updates</h3>
                  </div>
                  <div className="space-y-0 relative z-10">
                    {announcements.length === 0 ? (
                      <p className="text-slate-400 text-[0.8rem] text-center py-4">No announcements yet</p>
                    ) : (
                      announcements.map((a, i) => (
                        <div key={a._id} className={`block group py-2.5 ${i > 0 ? 'border-t border-blue-50' : ''}`}>
                          <p className="text-slate-800 text-[0.85rem] font-medium group-hover:text-blue-600 transition-colors leading-snug">{a.title}</p>
                          <p className="text-slate-500 text-[0.7rem] mt-0.5 leading-snug">{a.content}</p>
                          <p className="text-blue-400 text-[0.7rem] mt-0.5 font-medium">{new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-16 md:py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-bold text-slate-900 leading-[1.18] mb-5">Empowering Students Through Applied Research</h2>
                <p className="text-[15px] text-slate-600 leading-[1.75] mb-8">
                  The Final Year Project program is the cornerstone of our CS curriculum, providing students with
                  the opportunity to apply theoretical knowledge to real-world problems, guided by experienced faculty supervisors.
                </p>
                <div className="flex flex-col gap-8">
                  <div className="flex items-start gap-5">
                    <div className="w-[44px] h-[44px] bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary animate-[pulseDot_2s_infinite]"></div>
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-slate-900 mb-1">Research Excellence</h4>
                      <p className="text-[13px] text-slate-600 font-medium leading-[1.7]">Fostering innovation through structured research methodologies and academic rigor.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-[44px] h-[44px] bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary animate-[pulseDot_2s_infinite]"></div>
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-slate-900 mb-1">Expert Supervision</h4>
                      <p className="text-[13px] text-slate-600 font-medium leading-[1.7]">Dedicated faculty mentorship bridging theoretical knowledge and practical implementation.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-[44px] h-[44px] bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary animate-[pulseDot_2s_infinite]"></div>
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-slate-900 mb-1">Structured Evaluation</h4>
                      <p className="text-[13px] text-slate-600 font-medium leading-[1.7]">Comprehensive multi-stage evaluation ensuring academic integrity and project quality.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-lightbg rounded-[2.5rem] p-8 relative overflow-hidden">
                <div className="absolute w-[96px] h-[96px] bg-primary/10 blur-[24px] rounded-full -top-4 -right-4 pointer-events-none"></div>
                <div className="absolute w-[128px] h-[128px] bg-primary/10 blur-[32px] rounded-full -bottom-4 -left-4 pointer-events-none"></div>
                
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-white p-8 rounded-[2rem] border border-blue-50 flex flex-col justify-center min-h-[170px] transition-all duration-200 hover:-translate-y-2 hover:shadow-premium-shadow">
                    <BookOpen className="text-2xl mb-5 text-primary" />
                    <div className="text-[1.75rem] font-bold leading-none mb-1 text-slate-900">300+</div>
                    <div className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-[0.1em]">Active Projects</div>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] border border-blue-50 flex flex-col justify-center min-h-[170px] mt-8 transition-all duration-200 hover:-translate-y-2 hover:shadow-premium-shadow">
                    <Users className="text-2xl mb-5 text-primary" />
                    <div className="text-[1.75rem] font-bold leading-none mb-1 text-slate-900">80+</div>
                    <div className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-[0.1em]">Supervisors</div>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] border border-blue-50 flex flex-col justify-center min-h-[170px] transition-all duration-200 hover:-translate-y-2 hover:shadow-premium-shadow">
                    <ClipboardList className="text-2xl mb-5 text-primary" />
                    <div className="text-[1.75rem] font-bold leading-none mb-1 text-slate-900">100%</div>
                    <div className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-[0.1em]">Digital Tracking</div>
                  </div>
                  <div className="bg-white p-8 rounded-[2rem] border border-blue-50 flex flex-col justify-center min-h-[170px] mt-8 transition-all duration-200 hover:-translate-y-2 hover:shadow-premium-shadow">
                    <Star className="text-2xl mb-5 text-primary" />
                    <div className="text-[1.75rem] font-bold leading-none mb-1 text-slate-900">Top</div>
                    <div className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-[0.1em]">Accreditations</div>
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
              <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-bold text-slate-900 leading-[1.18] mb-5">Understanding the FYP Process</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', icon: FileText, title: 'Proposal Submission', desc: 'Students submit project proposals with title, abstract, objectives, and methodology for review.' },
                { step: '02', icon: User, title: 'Supervisor Assignment', desc: 'FYP coordinator assigns qualified supervisors based on domain expertise and availability.' },
                { step: '03', icon: LineChart, title: 'Progress Tracking', desc: 'Regular progress updates, milestone submissions, and supervisor feedback cycles throughout the year.' },
                { step: '04', icon: GraduationCap, title: 'Final Evaluation', desc: 'Comprehensive evaluation panel review, viva voce, and final grading by faculty committee.' }
              ].map((item, i) => (
                <div key={i} className="group bg-white border-[1.5px] border-blue-100 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-premium-shadow">
                  <div className="absolute -top-10 -right-10 w-[120px] h-[120px] bg-primary/5 rounded-full transition-transform duration-500 group-hover:scale-[1.8]"></div>
                  <div className="text-6xl font-bold text-primary/[0.07] leading-none mb-5 tracking-[-0.04em] transition-colors duration-200 group-hover:text-primary/[0.12]">{item.step}</div>
                  <div className="w-[44px] h-[44px] bg-primary/5 text-primary rounded-xl flex items-center justify-center text-[1.1rem] mb-6 transition-all duration-200 group-hover:bg-primary group-hover:text-white">
                    {React.createElement(item.icon, { className: "w-4 h-4" })}
                  </div>
                  <h3 className="text-[1.125rem] font-extrabold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-[13px] text-slate-600 font-medium leading-[1.7]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ANNOUNCEMENTS SECTION */}
        <section id="announcements" className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex flex-wrap justify-between items-end gap-6 mb-14">
              <div>
<h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-bold text-white leading-[1.18]">FYP Announcements<br />&amp; News</h2>
              </div>
              <Link to="/announcements" className="bg-white/10 text-white border-[1.5px] border-white/20 px-5 py-2.5 rounded-full font-bold text-[13px] hover:bg-white/20 transition-colors flex items-center gap-2 no-underline">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Bell className="w-8 h-8 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">No announcements yet</p>
                </div>
              ) : (
                announcements.slice(0, 3).map((item, i) => (
                  <div key={item._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 transition-colors hover:bg-white/10">
                    <div className="flex items-center gap-2 text-[0.6rem] font-extrabold text-blue-400 uppercase tracking-[0.15em]">
                      <Bell className="w-4 h-4" /> {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
                    </div>
                    <h3 className="text-base font-bold text-white leading-[1.3]">{item.title}</h3>
                    <p className="text-[13px] text-white/70 leading-[1.6] flex-1">{item.content.length > 150 ? item.content.substring(0, 150) + '...' : item.content}</p>
                    <Link to="/announcements" className="inline-flex items-center gap-2 text-[13px] font-bold text-white/80 mt-auto group transition-all hover:text-white no-underline">
                      Read Full Notice <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-16 md:py-24 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="bg-primary rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row">
              <div className="p-8 sm:p-10 lg:p-16 flex-[3]">
<h2 className="text-[clamp(1.6rem,3vw,3rem)] font-bold text-white leading-[1.2] mb-12">Need Assistance?<br />We're here to help.</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="w-[44px] h-[44px] bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0"><Mail className="w-4 h-4" /></div>
                    <div>
                      <h4 className="text-[13px] font-bold text-white mb-1">Email Us</h4>
                      <p className="text-[13px] text-blue-200 leading-[1.6]">csfyp@cuiatd.edu.pk</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-[44px] h-[44px] bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0"><Phone className="w-4 h-4" /></div>
                    <div>
                      <h4 className="text-[13px] font-bold text-white mb-1">Call Us</h4>
                      <p className="text-[13px] text-blue-200 leading-[1.6]">+92-992-383591 Ext. 240</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 md:col-span-2">
                    <div className="w-[44px] h-[44px] bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0"><MapPin className="w-4 h-4" /></div>
                    <div>
                      <h4 className="text-[13px] font-bold text-white mb-1">Our Location</h4>
                      <p className="text-[13px] text-blue-200 leading-[1.6]">FYP Office, CS Department, COMSATS University Islamabad, Abbottabad Campus</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-primary/30 backdrop-blur-[12px] p-6 sm:p-10 flex-[2] flex items-center justify-center">
                <div className="bg-white rounded-[2rem] p-10 w-full max-w-[360px] shadow-2xl text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">FYP Office</h3>
                  <p className="text-[13px] text-slate-500 italic font-medium mb-6">Monday – Friday: 08:30 AM – 04:30 PM</p>
                  <a href="mailto:csfyp@cuiatd.edu.pk" className="block w-full py-3 px-5 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/25 hover:bg-blue-800 transition-all text-[13px] text-center flex items-center justify-center gap-2">
                    Submit Query <ArrowRight className="w-4 h-4" />
                  </a>
                  <a href="https://www.cuiatd.edu.pk/" target="_blank" rel="noopener noreferrer" className="block w-full mt-2 py-3 px-5 rounded-xl font-bold bg-transparent border-[1.5px] border-slate-200 text-slate-700 hover:bg-slate-50 transition-all text-[13px] text-center">
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
