import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    <div className="font-poppins bg-lightbg text-gray-700 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Page Hero */}
        <section className="bg-gradient-to-br from-blue-50/95 via-blue-100/80 to-blue-50/90 py-16 md:py-24 border-b border-blue-100">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-blue-900/5 border border-blue-900/10 rounded-full text-primary text-[0.7rem] font-extrabold uppercase tracking-[0.24em] mb-6">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                  <i className="fas fa-clipboard-check"></i> Eligibility Criteria
                </div>
                <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-black text-gray-900 leading-tight mb-5">
                  Know the academic requirements before starting your FYP.
                </h1>
                <p className="text-[15px] md:text-[17px] text-gray-500 leading-relaxed max-w-[600px]">
                  These criteria help ensure that students begin the Final Year Project with the required academic foundation, course coverage, and readiness for independent project work.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <i className="fas fa-circle-check"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Check First</h3>
                      <p className="text-sm text-gray-500">Confirm your credit hours, prerequisite courses, and academic standing before group registration.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Need Help?</h3>
                      <p className="text-sm text-gray-500">Students with pending cases should contact the FYP coordinator before submission deadlines.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Criteria Grid */}
        <section className="py-16 md:py-24 bg-white border-b border-blue-100">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {criteria.map((item, index) => (
                <div key={index} className="bg-white border-[1.5px] border-blue-100 rounded-[2rem] p-8 transition-all hover:border-primary hover:shadow-lg">
                  <div className="w-11 h-11 bg-blue-50 text-primary rounded-xl flex items-center justify-center text-lg mb-6">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h3 className="text-[1.125rem] font-extrabold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-6">{item.desc}</p>
                  <span className="inline-flex items-center gap-2 py-1 px-3 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase">
                    <i className="fas fa-check"></i> {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Band */}
        <section className="py-16 md:py-24 bg-lightbg">
          <div className="container max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="bg-primary rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="relative z-10 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-black mb-4">Do not meet a requirement yet?</h2>
                <p className="text-blue-100 max-w-[600px] leading-relaxed">
                  Consult the FYP coordinator or academic advisor early. They can confirm whether you should wait for the next cycle, resolve a pending prerequisite, or submit a formal approval request.
                </p>
              </div>
              <a href="/contact" className="relative z-10 shrink-0 inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full font-bold bg-white/10 text-white border-[1.5px] border-white/20 hover:bg-white/20 transition-all">
                Contact Office <i className="fas fa-arrow-right"></i>
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
