import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, X, ChevronDown } from 'lucide-react';

const IncomingRequestsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#f4f7fe] font-poppins antialiased selection:bg-blue-500/10">
      {/* 1. Header (Height: 90px, Padding: px-10) */}
      <header className="h-[90px] bg-white border-b border-gray-200/65 flex items-center justify-between px-10 shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-5">
          {/* Back Button (w-10 h-10, rounded-xl) */}
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
          >
            <svg className="w-5 h-5 stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="flex flex-col">
            <h1 className="text-[22px] font-extrabold text-[#1e293b] tracking-tight leading-none">Incoming Requests</h1>
            <span className="text-[13px] text-gray-400 font-semibold mt-1.5">CUI Abbottabad · Saturday, May 16, 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Phase Badge (px-4 py-2, text-[13px]) */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#16a34a]"></div>
            <span className="text-[13px] font-bold text-[#16a34a] tracking-tight">Phase 1: Student Registration</span>
          </div>

          {/* Notification Bell (w-10 h-10, Absolute Dot at top-2.5 right-2.5) */}
          <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all relative group">
            <Bell className="w-[19px] h-[19px] group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#f23c3c] border-2 border-white rounded-full"></span>
          </button>

          {/* Profile Section (Avatar w-10 h-10, Name text-[14px], Label text-[11px]) */}
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

      {/* 2. Main Content (p-10, max-w-[1400px], centered) */}
      <main className="flex-1 p-10 max-w-[1400px] w-full mx-auto">
        <h2 className="text-[28px] font-extrabold text-[#1e293b] tracking-tight mb-8">Incoming Requests</h2>

        {/* 3. Request Card (rounded-[24px], p-6, subtle shadow) */}
        <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 duration-300">
          <div className="flex items-center gap-5">
            {/* Student Avatar (w-[68px] h-[68px], rounded-[20px]) */}
            <div className="w-[68px] h-[68px] bg-blue-50 text-blue-600 rounded-[20px] flex items-center justify-center text-[22px] font-bold border border-blue-100/50">
              FK
            </div>
            <div className="flex flex-col">
              {/* Student Name (text-[19px]) and Meta (text-[14px]) */}
              <h3 className="text-[19px] font-extrabold text-[#1e293b] tracking-tight leading-snug">Fatima Khan</h3>
              <p className="text-[14px] text-gray-400 font-bold mt-1 tracking-wide">BS SE • FA23 • CGPA: 3.72</p>
            </div>
          </div>

          {/* 4. Action Buttons (px-7 py-3.5, rounded-[14px], gap-3.5) */}
          <div className="flex items-center gap-3.5">
            {/* Accept Button (Emerald with glow) */}
            <button className="flex items-center gap-2 px-7 py-3.5 bg-[#00a96e] hover:bg-[#009460] text-white rounded-[14px] text-[15px] font-bold tracking-wide shadow-lg shadow-[#00a96e]/10 transition-all active:scale-[0.98]">
              <Check className="w-[18px] h-[18px] stroke-[3]" />
              Accept
            </button>
            {/* Reject Button (Coral with glow) */}
            <button className="flex items-center gap-2 px-7 py-3.5 bg-[#f23c3c] hover:bg-[#df2c2c] text-white rounded-[14px] text-[15px] font-bold tracking-wide shadow-lg shadow-[#f23c3c]/20 transition-all active:scale-[0.98]">
              <X className="w-[18px] h-[18px] stroke-[3]" />
              Reject
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IncomingRequestsPage;
