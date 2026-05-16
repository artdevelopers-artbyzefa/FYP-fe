import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Tag, User } from 'lucide-react';

const ApprovedIdeasPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#f4f7fe] font-poppins antialiased selection:bg-blue-500/10">
      {/* Header Section */}
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
            <h1 className="text-[22px] font-extrabold text-[#1e293b] tracking-tight leading-none">Approved Ideas</h1>
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

      {/* Main Content */}
      <main className="flex-1 px-6 md:px-8 lg:px-10 py-8 max-w-[1400px] w-full mx-auto">
        <h2 className="text-[26px] font-extrabold text-[#1e293b] tracking-tight mb-8">University Approved Ideas</h2>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 max-w-[800px]">
          {/* Project Idea Card */}
          <div className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 group">
            <h3 className="text-[22px] font-black text-[#2563eb] mb-3 tracking-tight">Blockchain Voting System</h3>
            <p className="text-[15px] text-gray-500 font-medium mb-6 leading-relaxed max-w-[700px]">
              A secure e-voting system using smart contracts to ensure data immutability and transparency.
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-gray-500 font-bold text-[13px]">
                <Tag className="w-4 h-4 text-gray-400" />
                Cybersecurity
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-bold text-[13px]">
                <User className="w-4 h-4 text-gray-400" />
                Dr. Zeeshan
              </div>
            </div>

            <button className="px-8 py-3 bg-white border border-gray-200 text-[#1e293b] rounded-[14px] text-[15px] font-bold tracking-wide hover:bg-gray-50 transition-all active:scale-[0.98] shadow-sm">
              Select Idea
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApprovedIdeasPage;
