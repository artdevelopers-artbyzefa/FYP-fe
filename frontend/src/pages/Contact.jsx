import React from 'react';
import { Mail, Phone, MapPin, Clock, RotateCcw, ArrowRight, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#f5f7fc] font-sans selection:bg-blue-100">
      
      {/* ─── HERO SECTION ─── */}
      <section className="bg-[#dde8f8] px-6 lg:px-20 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/50 border border-[#b0c4e8] rounded-full px-4 py-1.5 shadow-sm">
              <span className="w-2 h-2 bg-[#2251f3] rounded-full animate-pulse"></span>
              <Mail size={14} className="text-[#0d1b4b]" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#0d1b4b]">
                Contact
              </span>
            </div>

            <h1 className="font-['Manrope'] font-[900] text-[#0d1b4b] text-5xl lg:text-7xl leading-[1.05] tracking-tight">
              Reach the FYP office for support, guidance, and coordination.
            </h1>
            
            <p className="text-[#6b7280] text-lg leading-relaxed max-w-2xl">
              Use the contact form for general questions, eligibility concerns, portal issues, 
              or guidance about submissions and review schedules.
            </p>
          </div>

          {/* Hero Sidebar Card */}
          <div className="bg-white rounded-[24px] shadow-2xl shadow-blue-900/10 p-8 lg:p-10 flex flex-col gap-8 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-[#eef2fb] rounded-full flex items-center justify-center shrink-0">
                <Clock className="text-[#1e3fa8]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#111827] text-[17px] mb-1">Office Hours</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">
                  Monday to Friday, 08:30 AM to 04:30 PM.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-[#eef2fb] rounded-full flex items-center justify-center shrink-0">
                <RotateCcw className="text-[#1e3fa8]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#111827] text-[17px] mb-1">Support Scope</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">
                  Eligibility, deadlines, portal access, proposal review, and evaluation coordination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          
          {/* Left Column: Form */}
          <div className="bg-white border-2 border-[#d1daf0] rounded-[24px] p-8 lg:p-12 shadow-sm">
            <span className="text-[11px] font-bold text-[#2251f3] tracking-widest uppercase mb-4 block">
              Send Message
            </span>
            <h2 className="font-['Manrope'] font-[900] text-[#111827] text-4xl mb-10">
              How can we help?
            </h2>

            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#111827]">Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name"
                  className="w-full px-5 py-4 rounded-xl border-2 border-[#d1daf0] focus:border-[#2251f3] focus:ring-4 focus:ring-blue-50/50 outline-none transition-all placeholder:text-[#b0b8cc]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#111827]">Email</label>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full px-5 py-4 rounded-xl border-2 border-[#d1daf0] focus:border-[#2251f3] focus:ring-4 focus:ring-blue-50/50 outline-none transition-all placeholder:text-[#b0b8cc]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#111827]">Message</label>
                <textarea 
                  rows="5"
                  placeholder="Write your message"
                  className="w-full px-5 py-4 rounded-xl border-2 border-[#d1daf0] focus:border-[#2251f3] focus:ring-4 focus:ring-blue-50/50 outline-none transition-all placeholder:text-[#b0b8cc] resize-none"
                ></textarea>
              </div>

              <button className="w-full bg-[#0d1b4b] hover:bg-[#1e3fa8] text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
                Submit Query <ArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* Right Column: Info Cards */}
          <div className="flex flex-col gap-6">
            
            {/* Details Card */}
            <div className="bg-white border-2 border-[#d1daf0] rounded-[24px] p-8 shadow-sm">
              <span className="text-[11px] font-bold text-[#2251f3] tracking-widest uppercase mb-8 block">
                Official Details
              </span>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-11 h-11 bg-[#eef2fb] rounded-full flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-[#1e3fa8]" />
                  </div>
                  <div>
                    <strong className="block text-[#111827]">Email</strong>
                    <span className="text-[#6b7280] text-sm">csfyp@cuiatd.edu.pk</span>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-11 h-11 bg-[#eef2fb] rounded-full flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-[#1e3fa8]" />
                  </div>
                  <div>
                    <strong className="block text-[#111827]">Phone</strong>
                    <span className="text-[#6b7280] text-sm">+92-992-383591 Ext. 240</span>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-11 h-11 bg-[#eef2fb] rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-[#1e3fa8]" />
                  </div>
                  <div>
                    <strong className="block text-[#111827]">Address</strong>
                    <span className="text-[#6b7280] text-sm leading-relaxed block">
                      FYP Office, CS Department, COMSATS University Islamabad, Abbottabad Campus
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Campus Card (Visual Grid styling) */}
            <div className="bg-white border-2 border-[#d1daf0] rounded-[24px] p-8 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0d1b4b_1px,transparent_1px)] [background-size:20px_20px]"></div>
              
              <div className="w-14 h-14 bg-[#0d1b4b] rounded-full flex items-center justify-center mb-6">
                <MapPin size={24} className="text-white" />
              </div>
              <h3 className="font-['Manrope'] font-extrabold text-xl text-[#111827] mb-3">Campus Location</h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Use the official university website or campus contact desk for precise route guidance and visitor information.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;