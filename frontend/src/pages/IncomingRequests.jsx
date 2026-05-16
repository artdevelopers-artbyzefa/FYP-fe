import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Bell, 
  Check, 
  X,
  ChevronDown
} from 'lucide-react';

const IncomingRequests = () => {
  const navigate = useNavigate();
  
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col w-full h-full font-poppins">
      {/* 100% Accurate Header from Screenshot 1 */}
      <header className="h-[88px] bg-white px-8 flex items-center justify-between border-b border-gray-100/80 sticky top-0 z-40">
        <div className="flex items-center gap-6">
          {/* Back Button with specific shadow and radius */}
          <button 
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-[14px] bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-[#0f172a] text-[22px] font-black leading-none tracking-tight">Incoming Requests</h1>
            <p className="text-gray-400 text-[12px] font-bold mt-1.5 opacity-80">CUI Abbottabad · {formattedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Phase Badge - Accurate Colors & Pill Style */}
          <div className="flex items-center gap-2.5 px-5 py-2.5 bg-[#f0fdf4] border border-[#dcfce7] rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#22c55e]"></div>
            <span className="text-[#15803d] text-[13px] font-black tracking-tight">Phase 1: Student Registration</span>
          </div>

          {/* Bell Icon with Red Dot */}
          <button className="relative w-11 h-11 rounded-[14px] bg-[#f8fafc] border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
            <Bell className="w-5 h-5 stroke-[2px]" />
            <span className="absolute top-[13px] right-[13px] w-2 h-2 bg-[#ef4444] border-2 border-white rounded-full"></span>
          </button>

          {/* Profile Card - Exact alignment and spacing */}
          <div className="flex items-center gap-3.5 bg-white border border-gray-100 rounded-2xl p-1.5 pr-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] group cursor-pointer hover:border-blue-100 transition-all">
            <div className="w-10 h-10 bg-[#e0e7ff] rounded-xl flex items-center justify-center text-[#4338ca] font-black text-sm">
              AR
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[#0f172a] text-[14px] font-black tracking-tight">AROOJ71004</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <span className="text-gray-400 text-[11px] font-extrabold uppercase tracking-[0.05em] mt-0.5">Student</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with 100% Accurate Gaps */}
      <main className="p-12 pl-12 flex-grow bg-[#f8fafc]">
        {/* Content Title - Aligned exactly as per screenshot */}
        <h2 className="text-[#0f172a] text-[32px] font-black tracking-tighter mb-10 ml-1">Incoming Requests</h2>

        {/* Request Card - Exact proportions and alignment */}
        <div className="max-w-[1100px] bg-white rounded-[32px] p-9 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-100/80 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Avatar Circle */}
            <div className="w-[72px] h-[72px] bg-[#eff6ff] rounded-[24px] flex items-center justify-center text-[#2563eb] text-2xl font-black shadow-inner">
              FK
            </div>
            
            <div className="flex flex-col">
              <h3 className="text-[#0f172a] text-[21px] font-black tracking-tight leading-tight">Fatima Khan</h3>
              <p className="text-gray-400 text-[15px] font-bold mt-2 tracking-wide opacity-90">BS SE • FA23 • CGPA: 3.72</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Accept Button - Exact padding and colors */}
            <button className="flex items-center gap-2.5 px-9 py-4 bg-[#059669] text-white rounded-[18px] font-black text-base hover:bg-[#047857] transition-all shadow-[0_10px_25px_-5px_rgba(5,150,105,0.3)] active:scale-95 group">
              <Check className="w-5 h-5 stroke-[3.5px] group-hover:scale-110 transition-transform" />
              Accept
            </button>
            
            {/* Reject Button - Exact padding and colors */}
            <button className="flex items-center gap-2.5 px-9 py-4 bg-[#ef4444] text-white rounded-[18px] font-black text-base hover:bg-[#dc2626] transition-all shadow-[0_10px_25px_-5px_rgba(239,68,68,0.3)] active:scale-95 group">
              <X className="w-5 h-5 stroke-[3.5px] group-hover:scale-110 transition-transform" />
              Reject
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IncomingRequests;
