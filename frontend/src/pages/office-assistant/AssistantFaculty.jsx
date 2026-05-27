import React, { useEffect, useState } from 'react';
import { getOfficeFaculty } from '../../services/office-assistant.service';
import { showToast } from '../../components/AppToast';
import { Calendar } from 'lucide-react';

const AssistantFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    getOfficeFaculty().then(res => setFaculty(res.data)).catch(console.error);
  }, []);

  return (
    <>
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">Faculty Profiles & Availability</h2>
        <p className="text-xs text-black mt-0.5 font-medium">Read-only view of faculty supervision load, research areas, and weekly availability schedule</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map(f => (
          <div key={f.id} className="bg-white rounded-2xl border border-black shadow-sm p-6 flex flex-col justify-between hover:border-blue-600 transition-all">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center text-xl font-black flex-shrink-0 border border-black">{f.id}</div>
                <div>
                  <h3 className="font-black text-black text-base">{f.name}</h3>
                  <p className="text-xs text-black font-medium mt-0.5">{f.designation}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 mb-4 space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-black font-bold">Proposed Projects:</span><span className="font-black text-black">{f.proposed}</span></div>
                <div className="flex justify-between"><span className="text-black font-bold">In-Progress (Supervising):</span><span className="font-black text-black">{f.inProgress}</span></div>
                <div className="flex justify-between"><span className="text-black font-bold">Completed Projects:</span><span className="font-black text-black">{f.completed}</span></div>
              </div>
              <div className="mb-6">
                <span className="text-xs font-bold text-black uppercase tracking-wider block mb-2">Research Areas</span>
                <div className="flex flex-wrap gap-1.5">
                  {f.research.map((r, i) => (
                    <span key={i} className="bg-white text-black text-[10px] font-bold px-2.5 py-1 rounded-lg">{r}</span>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedSchedule({ name: f.name, schedule: f.schedule })} className="w-full py-2.5 bg-white hover:bg-white hover:text-blue-600 border border-black rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" /> View Weekly Schedule
            </button>
          </div>
        ))}
      </div>

      {selectedSchedule && (
        <div className="fixed inset-0 bg-blue-600/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-6 sm:p-8 shadow-2xl border border-black">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-black">
              <h3 className="text-lg font-black text-black">Weekly Availability Schedule</h3>
              <i className="fas fa-times text-black hover:text-blue-600 cursor-pointer text-lg" onClick={() => setSelectedSchedule(null)}></i>
            </div>
            <div className="space-y-3 text-sm">
              <div className="text-xs font-bold text-black mb-2">Schedule for {selectedSchedule.name}</div>
              {selectedSchedule.schedule.map((slot, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-black font-bold text-black">{slot}</div>
              ))}
            </div>
            <div className="mt-8 pt-4 border-t border-black text-right">
              <button onClick={() => setSelectedSchedule(null)} className="bg-white hover:bg-white text-black px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">Close Schedule</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantFaculty;
