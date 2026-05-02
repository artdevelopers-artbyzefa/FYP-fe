import React, { useState } from 'react';
import { Search, Headset, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqData = [
    {
      question: "Who is eligible to enroll in FYP?",
      answer: "Students who meet the department's credit hour, prerequisite course, CGPA, and registration requirements can enroll. Confirm your status before forming a group."
    },
    {
      question: "How do we submit a project idea?",
      answer: "Log in to the portal, open the proposal section, and submit the required title, abstract, objectives, methodology, tools, and group details."
    },
    {
      question: "Can students choose their supervisor?",
      answer: "Students may indicate a preferred supervisor during registration. Allocation is subject to supervisor availability and department approval. Final assignments are made by the FYP coordinator."
    },
    {
      question: "Where are deadlines announced?",
      answer: "All official deadlines are posted on the FYP portal under the 'Schedule' section. Important dates are also communicated via department notice boards and email announcements."
    },
    {
      question: "What happens after proposal approval?",
      answer: "Once approved, your group enters the development phase. You will attend scheduled progress reviews, submit interim reports, and work toward the final demo and defense sessions."
    },
    {
      question: "How is final evaluation handled?",
      answer: "Final evaluation normally includes report review, project demonstration, viva or defense, evaluator remarks, and rubric-based scoring."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#f5f7ff] font-['DM_Sans']">
      
      {/* ─── HERO SECTION ─── */}
      <section className="bg-gradient-to-br from-[#e8eeff] via-[#c7d9ff] to-[#dbeafe] px-6 lg:px-20 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-[#c3d0f0] rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 bg-[#2563eb] rounded-full"></span>
              <HelpCircle size={14} className="text-[#0d1b5e]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#0d1b5e]">FAQ</span>
            </div>

            <h1 className="font-['Syne'] font-extrabold text-[#0d1b5e] text-5xl lg:text-7xl leading-[1.05] mb-8">
              Quick answers to common FYP questions.
            </h1>
            
            <p className="text-[#374151] text-lg leading-relaxed max-w-2xl">
              Find guidance on eligibility, submissions, supervisor coordination, deadlines, reviews, and how students should use the portal.
            </p>
          </div>

          {/* Hero Sidebar Card */}
          <div className="bg-white rounded-[24px] shadow-2xl shadow-blue-900/10 p-8 lg:p-10 flex flex-col gap-8">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-[#dbeafe] rounded-xl flex items-center justify-center shrink-0">
                <Search className="text-[#2563eb]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#0d1b5e] text-[17px] mb-1">Scan Faster</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">
                  Expand only the questions you need and keep the rest collapsed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-[#dbeafe] rounded-xl flex items-center justify-center shrink-0">
                <Headset className="text-[#2563eb]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#0d1b5e] text-[17px] mb-1">Still Unsure?</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">
                  Contact the FYP office for department-specific decisions or unusual cases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACCORDION SECTION ─── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-5">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`bg-white rounded-[22px] border-2 transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-[#93b4f0] shadow-lg shadow-blue-500/10' : 'border-[#e2e8f0] hover:border-[#b8caf5]'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-7 text-left group"
                >
                  <h3 className={`font-bold text-lg transition-colors ${isOpen ? 'text-[#2563eb]' : 'text-[#0d1b5e]'}`}>
                    {item.question}
                  </h3>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isOpen ? 'bg-[#2563eb] text-white' : 'bg-[#f5f7ff] text-[#0d1b5e]'
                  }`}>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>
                
                <div className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-7 pb-8 border-t border-[#eef0f8] pt-6">
                    <p className="text-[#4b5563] text-[15.5px] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default FAQ;