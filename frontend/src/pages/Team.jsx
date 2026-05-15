import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
          role: "FYP Coordinator · Lecturer",
          desc: "Expertise in Trust in IoT devices. Coordinating project lifecycles and academic standards for the FYP Portal.",
        },
        
        {
          initials: "FA",
          name: "Dr. Faraz Ahmad",
          role: "FYP Coordinator · Lecturer",
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
          initials: "AR",
          name: "Mr.Arslan Ahmed Rathore",
          role: "Senior Full Stack Developer & AI/ML Developer",
          desc: "Senior Full Stack Developer & AI/ML Developer. Focused on high-performance systems and intelligent modules.",
        },
        {
          initials: "AM",
          name: "Mr.Ans Abdullah Malik",
          role: "Backend Developer",
          desc: "Expertise in backend systems, database optimization, and scalable API development.",
        },
        {
          initials: "SR",
          name: "Mr.Syed Azzaz Haider Rizvi",
          role: "Backend Developer",
          desc: "Focused on server-side logic, project records, and secure data handling.",
        },
      ],
    },
    {
      title: "Frontend Development",
      members: [
        {
          initials: "AF",
          name: "Ms.Arooj Fatima",
          role: "Frontend Developer & Backend Developer",
          desc: "Expertise in Frontend UI/UX & Backend. Designing seamless user journeys and responsive interfaces.",
        },
        {
          initials: "LA",
          name: "Ms.Laraib Ali",
          role: "Frontend Developer & Backend Developer",
          desc: "Expertise in Frontend UI/UX & Backend. Crafting high-fidelity UI patterns and modular frontend components.",
        },
      ],
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
                  <i className="fas fa-users-gear"></i> Development Team
                </div>
                <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-black text-gray-900 leading-tight mb-5">
                  The minds behind the FYP management experience.
                </h1>
                <p className="text-[15px] md:text-[17px] text-gray-500 leading-relaxed max-w-[600px]">
                  Our team is organized into specialized units to ensure every aspect of the portal—from core backend security to the final user interface—is handled with precision.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-xl space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0 text-lg">
                    <i className="fas fa-layer-group"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-base">Modular Architecture</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Built with a clean separation of concerns, mirrored in our team structure.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary shrink-0 text-lg">
                    <i className="fas fa-shield-halved"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-base">Reliable Delivery</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Ensuring every module is secure, performant, and user-friendly.</p>
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
              <div className="flex items-center gap-4 mb-12">
                <div className="h-px bg-blue-100 flex-grow"></div>
                <h2 className="text-[0.75rem] font-black text-secondary uppercase tracking-[0.3em] bg-blue-50 py-2 px-6 rounded-full border border-blue-100">
                  {category.title}
                </h2>
                <div className="h-px bg-blue-100 flex-grow"></div>
              </div>

              <div className={`grid grid-cols-1 sm:grid-cols-2 ${category.members.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2 max-w-[900px] mx-auto'} gap-8`}>
                {category.members.map((member, index) => (
                  <article key={index} className="bg-white border-[1.5px] border-blue-100 rounded-[2.5rem] p-10 text-center flex flex-col items-center group hover:border-primary hover:shadow-xl transition-all duration-300">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 border-[3px] border-white ring-1 ring-blue-100 overflow-hidden shadow-sm">
                      <img 
                        src={member.image || "/cuilogo.png"} 
                        alt={member.name} 
                        className={`w-full h-full ${member.image ? 'object-cover' : 'w-12 h-12 object-contain opacity-80'} group-hover:scale-110 transition-transform duration-300`} 
                      />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-1">{member.name}</h3>
                    <div className="text-[12px] font-black text-secondary uppercase tracking-wider mb-6">{member.role}</div>
                    <p className="text-[14px] text-gray-500 leading-relaxed font-medium mb-8">
                      {member.desc}
                    </p>
                    <div className="flex gap-4 mt-auto">
                      <a href="#" className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center transition-all hover:bg-primary hover:text-white">
                        <i className="fab fa-github"></i>
                      </a>
                      <a href="#" className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center transition-all hover:bg-primary hover:text-white">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </div>
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
