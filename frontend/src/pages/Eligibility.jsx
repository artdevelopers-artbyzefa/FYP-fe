import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowRight, Check, ClipboardCheck, Mail } from 'lucide-react';

const Eligibility = () => {
  const criteria = [
    {
      icon: "fa-book-open",
      title: "Completed Credit Hours",
      desc: "Students should have completed the minimum credit hour threshold required by the department before enrolling in FYP.",
      badge: "Academic Progress",
    },
    {
      icon: "fa-list-check",
      title: "Required Courses",
      desc: "Core software engineering, database, programming, and research-related courses should be completed or approved as per department policy.",
      badge: "Prerequisites",
    },
    {
      icon: "fa-chart-simple",
      title: "CGPA Standing",
      desc: "Students must satisfy the minimum CGPA condition defined by the academic office and remain in good academic standing.",
      badge: "Performance",
    },
    {
      icon: "fa-users",
      title: "Approved Group Formation",
      desc: "Project groups should be formed according to the allowed group size and registration rules announced by the FYP coordinator.",
      badge: "Registration",
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
                  <ClipboardCheck className="w-4 h-4" /> Eligibility Criteria
                </div>
                <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-black text-black leading-tight mb-5">
                  Know the academic requirements before starting your FYP.
                </h1>
                <p className="text-[15px] md:text-[17px] text-black leading-relaxed max-w-[600px]">
                  These criteria help ensure that students begin the Final Year Project with the required academic foundation, course coverage, and readiness for independent project work.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-black shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black shrink-0">
                      <i className="fas fa-circle-check"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-black mb-1">Check First</h3>
                      <p className="text-sm text-black">Confirm your credit hours, prerequisite courses, and academic standing before group registration.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black mb-1">Need Help?</h3>
                      <p className="text-sm text-black">Students with pending cases should contact the FYP coordinator before submission deadlines.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Criteria Grid */}
        <section className="py-16 md:py-24 bg-white border-b border-black">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {criteria.map((item, index) => (
                <div key={index} className="bg-white border-[1.5px] border-black rounded-[2rem] p-8 transition-all hover:border-blue-600 hover:shadow-lg">
                  <div className="w-11 h-11 bg-white text-black rounded-xl flex items-center justify-center text-lg mb-6">
                    {React.createElement(item.icon, { className: "w-4 h-4" })}
                  </div>
                  <h3 className="text-[1.125rem] font-extrabold text-black mb-3">{item.title}</h3>
                  <p className="text-[13px] text-black font-medium leading-relaxed mb-6">{item.desc}</p>
                  <span className="inline-flex items-center gap-2 py-1 px-3 bg-white text-black rounded-full text-[10px] font-bold uppercase">
                    <Check className="w-4 h-4" /> {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Band */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="bg-blue-600 rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="relative z-10 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-black mb-4">Do not meet a requirement yet?</h2>
                <p className="text-black max-w-[600px] leading-relaxed">
                  Consult the FYP coordinator or academic advisor early. They can confirm whether you should wait for the next cycle, resolve a pending prerequisite, or submit a formal approval request.
                </p>
              </div>
              <a href="/contact" className="relative z-10 shrink-0 inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full font-bold bg-white/10 text-white border-[1.5px] border-white/20 hover:bg-white/20 transition-all">
                Contact Office <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Eligibility;
