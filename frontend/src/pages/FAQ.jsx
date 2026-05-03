import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const FAQ = () => {
  const faqs = [
    {
      question: "Who is eligible to enroll in FYP?",
      answer: "Students who meet the department's credit hour, prerequisite course, CGPA, and registration requirements can enroll. Confirm your status before forming a group.",
    },
    {
      question: "How do we submit a project idea?",
      answer: "Log in to the portal, open the proposal section, and submit the required title, abstract, objectives, methodology, tools, and group details.",
    },
    {
      question: "Can students choose their supervisor?",
      answer: "Students may suggest a preferred supervisor where allowed, but final allocation depends on domain fit, workload, and coordinator approval.",
    },
    {
      question: "Where are deadlines announced?",
      answer: "Deadlines are posted through portal announcements and may also be communicated by the FYP coordinator or department office.",
    },
    {
      question: "What happens after proposal approval?",
      answer: "The group enters the development phase, submits progress updates, meets the supervisor, and prepares milestone evidence for review.",
    },
    {
      question: "How is final evaluation handled?",
      answer: "Final evaluation normally includes report review, project demonstration, viva or defense, evaluator remarks, and rubric-based scoring.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
                  <i className="fas fa-circle-question"></i> FAQ
                </div>
                <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-black text-gray-900 leading-tight mb-5">
                  Quick answers to common FYP questions.
                </h1>
                <p className="text-[15px] md:text-[17px] text-gray-500 leading-relaxed max-w-[600px]">
                  Find guidance on eligibility, submissions, supervisor coordination, deadlines, reviews, and how students should use the portal.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <i className="fas fa-magnifying-glass"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Scan Faster</h3>
                      <p className="text-sm text-gray-500">Expand only the questions you need and keep the rest collapsed.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <i className="fas fa-headset"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Still Unsure?</h3>
                      <p className="text-sm text-gray-500">Contact the FYP office for department-specific decisions or unusual cases.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-16 md:py-24 bg-white border-b border-blue-100">
          <div className="container max-w-[800px] mx-auto px-4 sm:px-6">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`border-[1.5px] rounded-[1.5rem] overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-primary shadow-md' : 'border-blue-100 hover:border-blue-200'}`}
                >
                  <button 
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 group"
                  >
                    <span className={`text-[15px] font-bold transition-colors ${openIndex === index ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
                      {faq.question}
                    </span>
                    <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary' : 'text-gray-400 group-hover:text-primary'}`}></i>
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === index ? 'pb-6 max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;