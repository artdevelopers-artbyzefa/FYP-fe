import React, { useEffect, useState } from 'react';
import { getFacultyAvailability } from '../../services/faculty.service';
import { showToast } from '../../components/AppToast';

const FacultyAvailability = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeslots = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '14:00-15:00', '15:00-16:00'];
  
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    getFacultyAvailability().then(res => {
      const availMap = {};
      res.data.forEach(item => {
        availMap[item.day] = item.slots;
      });
      setAvailability(availMap);
    }).catch(console.error);
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
    // In a real app, this should trigger a debounced API save
  };

  const isAvailable = (day, slot) => {
    return availability[day] && availability[day].includes(slot);
  };

  const handleSave = () => {
    showToast.success('Availability schedule saved successfully!');
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-800">Weekly Availability Schedule</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Click on time slots to toggle your availability for student consultations and defense scheduling</p>
        </div>
        <button onClick={handleSave} className="bg-secondary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer">
          <i className="fas fa-save"></i> Save Schedule
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs font-bold">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-4 text-left border-r border-gray-100">Time Slot</th>
                {days.map(d => <th key={d} className="py-4 px-4 border-r border-gray-100">{d}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {timeslots.map(slot => (
                <tr key={slot} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 text-left text-gray-800 border-r border-gray-100 whitespace-nowrap">{slot}</td>
                  {days.map(day => (
                    <td 
                      key={day} 
                      onClick={() => toggleSlot(day, slot)}
                      className={`py-4 px-4 border-r border-gray-100 cursor-pointer transition-colors ${isAvailable(day, slot) ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-300' : 'bg-gray-100 text-gray-400'}`}
                    >
                      {isAvailable(day, slot) ? 'Available (Consult)' : 'Busy (Blocked)'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FacultyAvailability;
