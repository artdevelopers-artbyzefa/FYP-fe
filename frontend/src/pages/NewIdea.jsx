import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
} from 'lucide-react';

const NewIdeaPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    problemStatement: '',
    techStack: '',
    proposal: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, proposal: e.target.files[0] }));
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#f4f7fe] font-poppins antialiased selection:bg-blue-500/10">
      {/* 1. Header Section - Fixed height 90px, sticky, with shadow and border */}
      <header className="h-[90px] bg-white border-b border-gray-200/65 shadow-sm shadow-gray-200/20 flex items-center justify-between px-8 shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
          >
            <svg className="w-5 h-5 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="flex flex-col">
            <h1 className="text-[22px] font-extrabold text-[#1e293b] tracking-tight leading-none">New Idea</h1>
            <span className="text-[13px] text-gray-400 font-semibold mt-1.5">CUI Abbottabad · Saturday, May 16, 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#16a34a]"></div>
            <span className="text-[13px] font-bold text-[#16a34a] tracking-tight">Phase 1: Student Registration</span>
          </div>

          <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all relative group">
            <Bell className="w-[19px] h-[19px] group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#f23c3c] border-2 border-white rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 group cursor-pointer">
            <div className="w-10 h-10 bg-blue-100 border border-blue-200 rounded-xl flex items-center justify-center text-blue-700 font-bold text-[14px] shadow-sm">
              AR
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-[14px] font-bold text-gray-800 leading-tight">AROOJ71004</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:translate-y-0.5 transition-transform" />
              </div>
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Student</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Form Card - Centered, max-width 900px, 32px rounded, 40px padding */}
      <main className="flex-1 px-6 md:px-8 lg:px-10 py-10 max-w-[1400px] w-full mx-auto">
        <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] max-w-[900px] w-full mx-auto">
          <h2 className="text-[26px] font-extrabold text-[#1e293b] tracking-tight mb-8">Submit Project Idea</h2>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Title Field (56px height) */}
            <div className="space-y-2.5">
              <label className="text-[15px] font-bold text-[#1e293b] ml-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter project title"
                className="w-full h-[56px] px-6 bg-[#f8fafc] border border-gray-200 rounded-[18px] text-[15px] font-bold text-[#1e293b] placeholder:text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
              />
            </div>

            {/* Problem Statement Field (160px height) */}
            <div className="space-y-2.5">
              <label className="text-[15px] font-bold text-[#1e293b] ml-1">Problem Statement</label>
              <textarea
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleInputChange}
                placeholder="Describe the problem you aim to solve..."
                className="w-full h-[160px] p-6 bg-[#f8fafc] border border-gray-200 rounded-[18px] text-[15px] font-bold text-[#1e293b] placeholder:text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none"
              />
            </div>

            {/* Technology Stack Field */}
            <div className="space-y-2.5">
              <label className="text-[15px] font-bold text-[#1e293b] ml-1">Technology Stack</label>
              <input
                type="text"
                name="techStack"
                placeholder="e.g. React, Node.js"
                value={formData.techStack}
                onChange={handleInputChange}
                className="w-full h-[56px] px-6 bg-[#f8fafc] border border-gray-200 rounded-[18px] text-[15px] font-bold text-[#1e293b] placeholder:text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
              />
            </div>

            {/* Proposal (PDF) Field with preview */}
            <div className="space-y-2.5">
              <label className="text-[15px] font-bold text-[#1e293b] ml-1">Proposal (PDF)</label>
              <div className="relative w-full h-[56px] px-4 bg-[#f8fafc] border border-gray-200 rounded-[18px] flex items-center gap-4 group cursor-pointer hover:border-gray-300 transition-all">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="px-5 py-2 bg-[#eff6ff] text-[#2563eb] rounded-[10px] font-bold text-[14px] shrink-0 group-hover:bg-[#e0f0ff] transition-colors">
                  Choose File
                </div>
                <span className="text-[14px] font-medium text-gray-400 truncate">
                  {formData.proposal ? formData.proposal.name : 'No file chosen'}
                </span>
              </div>
            </div>

            {/* 3. Submit Button - 60px height, #2563eb, active scale */}
            <button
              type="submit"
              className="w-full h-[60px] bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-[18px] font-bold text-base shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all mt-8"
            >
              Submit Idea
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewIdeaPage;
