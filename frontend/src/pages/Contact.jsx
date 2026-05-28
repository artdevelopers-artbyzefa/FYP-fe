import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowRight, Clock, Mail, MapPin, Phone, Reply } from 'lucide-react';

const Contact = () => {
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
                  Reach the FYP office for support, guidance, and coordination.
                </h1>
                <p className="text-[15px] md:text-[17px] text-slate-600 leading-relaxed max-w-[600px]">
                  Use the contact form for general questions, eligibility concerns, portal issues, or guidance about submissions and review schedules.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Office Hours</h3>
                      <p className="text-sm text-slate-600">Monday to Friday, 08:30 AM to 04:30 PM.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <Reply className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Support Scope</h3>
                      <p className="text-sm text-slate-600">Eligibility, deadlines, portal access, proposal review, and evaluation coordination.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Layout */}
        <section className="py-16 md:py-24 bg-white border-b border-blue-100">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact Form */}
              <div className="bg-white border-[1.5px] border-blue-100 rounded-[2.5rem] p-8 sm:p-10 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8">How can we help?</h2>
                
                <form className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700" htmlFor="name">Name</label>
                    <input 
                      className="w-full py-3 px-4 border-[1.5px] border-slate-200 rounded-xl text-sm text-slate-700 bg-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all" 
                      id="name" 
                      name="name" 
                      type="text" 
                      placeholder="Enter your name" 
                      required 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700" htmlFor="email">Email</label>
                    <input 
                      className="w-full py-3 px-4 border-[1.5px] border-slate-200 rounded-xl text-sm text-slate-700 bg-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all" 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      required 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700" htmlFor="message">Message</label>
                    <textarea 
                      className="w-full py-3 px-4 border-[1.5px] border-slate-200 rounded-xl text-sm text-slate-700 bg-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all min-h-[120px] resize-y" 
                      id="message" 
                      name="message" 
                      placeholder="Write your message" 
                      required 
                    ></textarea>
                  </div>
                  <button type="submit" className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full font-bold bg-primary text-white shadow-lg hover:bg-blue-800 hover:-translate-y-px transition-all">
                    Submit Query <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Contact Details */}
              <div className="space-y-8">
                <div className="bg-white/50 border border-blue-100 rounded-[2.5rem] p-10">
                  <div className="space-y-8">
                    <div className="flex items-start gap-5">
                      <div className="w-11 h-11 bg-white border border-blue-100 rounded-xl flex items-center justify-center text-primary shrink-0 shadow-sm">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Email</h3>
                        <a href="mailto:csfyp@cuiatd.edu.pk" className="text-sm text-slate-600 font-medium hover:text-primary">csfyp@cuiatd.edu.pk</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-5">
                      <div className="w-11 h-11 bg-white border border-blue-100 rounded-xl flex items-center justify-center text-primary shrink-0 shadow-sm">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Phone</h3>
                        <p className="text-sm text-slate-600">+92-992-383591 Ext. 240</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-5">
                      <div className="w-11 h-11 bg-white border border-blue-100 rounded-xl flex items-center justify-center text-primary shrink-0 shadow-sm">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Address</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">FYP Office, CS Department, COMSATS University Islamabad, Abbottabad Campus</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-blue-100 rounded-[2.5rem] p-10 flex items-center gap-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center text-xl shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Campus Location</h3>
                    <p className="text-[13px] text-slate-600 leading-relaxed">Use the official university website or campus contact desk for precise route guidance and visitor information.</p>
                  </div>
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

export default Contact;