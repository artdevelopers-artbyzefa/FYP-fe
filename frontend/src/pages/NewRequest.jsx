import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  Search,
  Send,
  ChevronLeft
} from 'lucide-react';

const NewRequestPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.toUpperCase() === 'SP21-BCS-005') {
      setSearchResult({
        id: 1,
        name: 'Zain Ali',
        details: 'BS CS • FA22 • CGPA: 3.45',
        avatar: 'ZA'
      });
    } else {
      setSearchResult(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#f4f7fe] font-poppins antialiased selection:bg-blue-500/10">
      {/* Header - Fixed height 90px, consistent padding */}
      <header className="h-[90px] bg-white border-b border-gray-200/65 flex items-center justify-between px-8 shrink-0 sticky top-0 z-40">
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
            <h1 className="text-[22px] font-extrabold text-[#1e293b] tracking-tight leading-none">New Request</h1>
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

      {/* Main Content - Responsive padding and max-width */}
      <main className="flex-1 px-6 md:px-8 lg:px-10 py-8 max-w-[1400px] w-full mx-auto">
        <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] max-w-[900px] w-full mx-auto">
          <h2 className="text-2xl md:text-[26px] lg:text-[28px] font-extrabold text-[#1e293b] tracking-tight mb-2">Find FYP Partners</h2>
          <p className="text-[14px] md:text-[15px] lg:text-[16px] text-gray-500 font-medium mb-8 md:mb-10 leading-relaxed">Search for students by Registration Number or Email to send a group request.</p>

          {/* Search Input and Button - Responsive layout */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mb-10">
            <input
              type="text"
              placeholder="SP21-BCS-005"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-[52px] md:h-[56px] lg:h-[60px] px-5 md:px-6 bg-[#f8fafc] border border-gray-200 rounded-[18px] text-[15px] md:text-[16px] font-bold text-[#1e293b] placeholder:text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
            />
            <button
              onClick={handleSearch}
              className="px-7 md:px-8 lg:px-9 h-[52px] md:h-[56px] lg:h-[60px] bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-[18px] font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all"
            >
              <Search className="w-5 h-5 stroke-[3]" />
              Search
            </button>
          </div>

          {/* Search Result Card - Responsive padding and alignment */}
          {searchResult && (
            <div className="bg-white border border-gray-100 rounded-[24px] p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_2px_15px_rgba(0,0,0,0.02)] animate-in fade-in slide-in-from-bottom-2 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-4 md:gap-5 w-full sm:w-auto">
                <div className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] lg:w-[68px] lg:h-[68px] bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[20px] md:text-[22px] font-bold border border-blue-100/50 shrink-0">
                  {searchResult.avatar}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[17px] md:text-[18px] lg:text-[19px] font-extrabold text-[#1e293b] tracking-tight">{searchResult.name}</h3>
                  <p className="text-[12px] md:text-[13px] lg:text-[14px] text-gray-400 font-bold mt-1 tracking-wide">{searchResult.details}</p>
                </div>
              </div>

              <button className="flex items-center justify-center gap-2.5 px-5 md:px-6 lg:px-7 py-3 md:py-3.5 bg-white border border-gray-200 text-[#1e293b] rounded-[14px] text-[14px] md:text-[15px] font-bold tracking-wide hover:bg-gray-50 transition-all active:scale-[0.98] shadow-sm w-full sm:w-auto">
                <Send className="w-[18px] h-[18px] stroke-[2.5]" />
                Send
              </button>
            </div>
          )}

          {/* No result message */}
          {!searchResult && searchQuery && searchQuery.length > 5 && (
            <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-[24px] p-6 md:p-8 text-center">
              <p className="text-gray-400 font-bold">No student found. Please check the registration number.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NewRequestPage;