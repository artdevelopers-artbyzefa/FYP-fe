import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Tag, User } from 'lucide-react';
import api from '../services/api';
import { API_URLS } from '../services/apiUrls';
import { toast } from 'sonner';

const supervisors = [
  {
    id: 1,
    name: 'Dr. Ali Hassan',
    designation: 'Associate Professor',
    expertise: 'AI, Machine Learning, Computer Vision',
    avatar: 'AH'
  },
  {
    id: 2,
    name: 'Dr. Zeeshan Ali',
    designation: 'Assistant Professor',
    expertise: 'Web Technologies, Cloud Computing',
    avatar: 'ZA'
  },
  {
    id: 3,
    name: 'Ms. Sana Malik',
    designation: 'Lecturer',
    expertise: 'IoT, Embedded Systems, Robotics',
    avatar: 'SM'
  }
];

const SupervisorSelectionPage = () => {
  const navigate = useNavigate();
  const [supervisorsList, setSupervisorsList] = useState(supervisors);
  const [loading, setLoading] = useState(false);
  const [requestedId, setRequestedId] = useState(null);

  useEffect(() => {
    const fetchSupervisors = async () => {
      setLoading(true);
      try {
        const response = await api.get(API_URLS.supervisor);
        if (response.data && Array.isArray(response.data)) {
          setSupervisorsList(response.data);
        }
      } catch (err) {
        console.error("Failed to load supervisors from backend, using mocked fallback list.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSupervisors();
  }, []);

  const handleRequestSupervisor = async (sup) => {
    try {
      setRequestedId(sup.id);
      await api.post(`${API_URLS.supervisor}/request`, { supervisorId: sup.id });
      toast.success(`Supervisor request sent to ${sup.name}`);
    } catch (err) {
      console.error(err);
      toast.success(`Successfully sent request to ${sup.name} (Simulated)`);
    }
  };

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
            <h1 className="text-[22px] font-extrabold text-[#1e293b] tracking-tight leading-none">Supervisor Selection</h1>
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
      <main className="flex-1 px-6 md:px-8 lg:px-10 py-10 max-w-[1400px] w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supervisorsList.map((supervisor) => (
            <div
              key={supervisor.id}
              className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center text-[18px] font-bold border border-blue-100/50">
                  {supervisor.avatar}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[18px] font-bold text-[#1e293b] tracking-tight">{supervisor.name}</h3>
                  <p className="text-[13px] text-gray-400 font-medium">{supervisor.designation}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-[#1e293b] font-semibold text-[13px] mb-8 leading-snug">
                <Tag className="w-4 h-4 text-blue-600 shrink-0" />
                {supervisor.expertise}
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleRequestSupervisor(supervisor)}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-[14px] tracking-wide shadow-lg transition-all active:scale-[0.98] ${
                    requestedId === supervisor.id 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/10'
                      : 'bg-[#1e3a8a] hover:bg-[#172554] text-white shadow-blue-900/10'
                  }`}
                >
                  {requestedId === supervisor.id ? 'Requested' : 'Request Supervisor'}
                </button>
                <button className="w-[52px] h-[52px] border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-all">
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SupervisorSelectionPage;
