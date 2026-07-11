import React, { useEffect, useState } from 'react';
import { getFacultyAvailability } from '../../services/faculty.service';
import { showToast } from '../../components/AppToast';
import { Save } from 'lucide-react';
import { motion } from 'framer-motion';
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const FacultyAvailability = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeslots = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '14:00-15:00', '15:00-16:00'];
  
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacultyAvailability().then(res => {
      const availMap = {};
      res.data.forEach(item => {
        availMap[item.day] = item.slots;
      });
      setAvailability(availMap);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const toggleSlot = (day, slot) => {
    setAvailability(prev => {
      const updated = { ...prev };
      if (!updated[day]) updated[day] = [];
      if (updated[day].includes(slot)) {
        updated[day] = updated[day].filter(s => s !== slot);
      } else {
        updated[day].push(slot);
      }
      return updated;
    });
  };

  const isAvailable = (day, slot) => {
    return availability[day] && availability[day].includes(slot);
  };

  const handleSave = () => {
    showToast.success('Availability schedule saved successfully!');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4 mb-6">
          <div className="skeleton h-7 w-64 rounded-md" />
          <div className="skeleton h-4 w-80 rounded-md mt-2" />
        </div>
        <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs font-semibold">
              <thead>
                <tr className="bg-slate-50 border-b border-line">
                  <th className="py-4 px-4 text-left border-r border-line"><div className="skeleton h-4 w-16 rounded-md" /></th>
                  {days.map(d => <th key={d} className="py-4 px-4 border-r border-line last:border-r-0"><div className="skeleton h-4 w-20 rounded-md mx-auto" /></th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {Array.from({ length: 6 }, (_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4 text-left border-r border-line"><div className="skeleton h-4 w-24 rounded-md" /></td>
                    {days.map((_, j) => (
                      <td key={j} className="py-4 px-4 border-r border-line last:border-r-0">
                        <div className="skeleton h-4 w-[80px] rounded-md mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Weekly Availability Schedule</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Click on time slots to toggle your availability for student consultations and defense scheduling</p>
        </div>
        <button onClick={handleSave} className="bg-btn text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:bg-btn-hover transition-all flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">
          <Save size={15} /> Save Schedule
        </button>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-2xl border border-line shadow-card overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs font-semibold">
            <thead>
              <tr className="bg-slate-50 border-b border-line text-slate-900 uppercase tracking-wider">
                <th className="py-4 px-4 text-left border-r border-line">Time Slot</th>
                {days.map(d => <th key={d} className="py-4 px-4 border-r border-line last:border-r-0">{d}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {timeslots.map(slot => (
                <tr key={slot} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-4 text-left text-slate-900 border-r border-line whitespace-nowrap font-medium">{slot}</td>
                  {days.map(day => (
                    <td 
                      key={day} 
                      onClick={() => toggleSlot(day, slot)}
                      className={`py-4 px-4 border-r border-line last:border-r-0 cursor-pointer transition-colors font-medium ${isAvailable(day, slot) ? 'bg-emerald-50 text-emerald-700' : 'bg-white text-slate-400'}`}
                    >
                      {isAvailable(day, slot) ? 'Available (Consult)' : 'Blocked (Busy)'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FacultyAvailability;
