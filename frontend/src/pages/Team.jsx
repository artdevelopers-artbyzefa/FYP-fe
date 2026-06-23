import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Layers, Shield, Users } from 'lucide-react';

const Team = () => {
  const categories = [
    {
      title: "Faculty Leadership & Supervision",
      members: [
        {
          initials: "MG",
          name: "Dr. Muhammad Ibtisam Gul",
          image: "/ibtisam.png",
          role: "Lecturer & Head Of CS Internship Office",
          desc: "Expertise in Parallel and Distributed Computing. Managing internship workflows and industry relations.",
        },
        {
          initials: "MF",
          name: "Muhammad Ali Faisal",
          image: "/mfaisal.jpeg",
          role: "Lecturer & Head Of CS Liaison Office",
          desc: "Specializing in Big Data, IoT, Multimedia, and Wireless Networks. Bridging the gap between academia and industry.",
        },
        {
          initials: "AI",
          name: "Ms. Ayesha Irshad",
          role: "FYP Coordinator - Lecturer",
          desc: "Expertise in Trust in IoT devices. Coordinating project lifecycles and academic standards for the FYP Portal.",
        },
        
        {
          initials: "FA",
          name: "Dr. Faraz Ahmad",
          role: "FYP Coordinator - Lecturer",
          desc: "Focused on core computing principles and guiding student development across various technology stacks.",
        },
      ],
    },
    {
      title: "Leadership & Management",
      members: [
        {
          initials: "HS",
          name: "Mr.Huzaifa Safdar",
          role: "Team Lead & DevOps Engineer",
          desc: "Expertise in DevOps & Full Stack development. Leading technical architecture and deployment strategies.",
        },
        {
          initials: "EU",
          name: "Ms.Eman Umar",
          role: "Project Manager & AI/ML Developer",
          desc: "Expertise in AI/ML and Project Management. Coordinating workflows and ensuring academic standards.",
        },
      ],
    },
    {
      title: "Backend Development",
      members: [
        {
          initials: "AM",
          name: "Mr.Arslan Rathore",
          role: "Backend Developer",
          desc: "Built the Backend & Integrated with the Frontend",
        },
         {
          initials: "AF",
          name: "Mr.Ahsan Faraz ",
          role: "Secuirty Engineer",
          desc: "Tackled different Secuirty Protocols & made the website pentesting-pruned.",
        },
        {
          initials: "SR",
          name: "Mudasir",
          role: "UI/UX & Security Developer",
          desc: "Specialized in Secuirty Audits & Desigining the Frontend Figma.",
        },
      ],
    },
    {
      title: "Frontend Development",
      members: [
        {
          initials: "AF",
          name: "Ms.Arooj Fatima",
          role: "Frontend Developer",
          desc: "Expertise in Frontend UI/UX & Backend. Designing seamless user journeys and responsive interfaces.",
        },
        {
          initials: "LA",
          name: "Ms.Laraib Ali",
          role: "Frontend Developer",
          desc: "Expertise in Frontend UI/UX & Backend. Crafting high-fidelity UI patterns and modular frontend components.",
        },
      ],
    },
  ];

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
                  The minds behind building of the FYP Portal
                </h1>
                <p className="text-[15px] md:text-[17px] text-slate-600 leading-relaxed max-w-[600px]">
                  Our team is organized into specialized units to ensure every aspect of the portal from core backend security to the final user interface everything is handled with precision.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-xl space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0 text-lg">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 text-base">Modular Architecture</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">Built with a clean separation of concerns, mirrored in our team structure.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0 text-lg">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 text-base">Reliable Delivery</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">Ensuring every module is secure, performant, and user-friendly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <div className="py-16 md:py-24 bg-white space-y-24">
          {categories.map((category, catIdx) => (
            <section key={catIdx} className="container max-w-[1280px] mx-auto px-4 sm:px-6">
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${category.members.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2 max-w-[900px] mx-auto'} gap-8`}>
                {category.members.map((member, index) => (
                  <article key={index} className="bg-white border-[1.5px] border-blue-100 rounded-[2.5rem] p-10 text-center flex flex-col items-center group hover:border-blue-600 hover:shadow-xl transition-all duration-300">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 border-[3px] border-white ring-1 ring-blue-100 overflow-hidden shadow-sm">
                      <img 
                        src={member.image || "/cuilogo.png"} 
                        alt={member.name} 
                        className={`w-full h-full ${member.image ? 'object-cover' : 'w-12 h-12 object-contain opacity-80'} group-hover:scale-110 transition-transform duration-300`} 
                      />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-1">{member.name}</h3>
                    <div className="text-[12px] font-black text-primary tracking-wider mb-6">{member.role}</div>
                    <p className="text-[14px] text-slate-600 leading-relaxed font-medium mb-8">
                      {member.desc}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Team;
