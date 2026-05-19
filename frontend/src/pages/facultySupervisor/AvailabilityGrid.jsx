import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getAvailability, saveAvailability } from '../../services/availabilityService';

const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

const defaultSchedule = [
  {
    time: '08:30 – 10:00',
    slots: [
      { status: 'Available', type: 'Office' },
      { status: 'Busy', type: 'Class' },
      { status: 'Available', type: 'Office' },
      { status: 'Busy', type: 'Research' },
      { status: 'Available', type: 'Office' },
    ],
  },
  {
    time: '10:00 – 11:30',
    slots: [
      { status: 'Busy', type: 'Class' },
      { status: 'Available', type: 'Consult' },
      { status: 'Busy', type: 'Meeting' },
      { status: 'Available', type: 'Consult' },
      { status: 'Busy', type: 'Jumma Prep' },
    ],
  },
  {
    time: '11:30 – 13:00',
    slots: [
      { status: 'Available', type: 'Consult' },
      { status: 'Available', type: 'Consult' },
      { status: 'Available', type: 'Consult' },
      { status: 'Available', type: 'Consult' },
      { status: 'Break', type: 'Jumma Break' },
    ],
  },
  {
    time: '14:00 – 16:30',
    slots: [
      { status: 'Busy', type: 'Research' },
      { status: 'Busy', type: 'Research' },
      { status: 'Available', type: 'Consult' },
      { status: 'Busy', type: 'Research' },
      { status: 'Available', type: 'Consult' },
    ],
  },
];

export default function AvailabilityGrid() {
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch schedule from backend on mount
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await getAvailability();
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setSchedule(response.data);
        }
      } catch (error) {
        // Backend not available — use default mock data silently
        console.warn('Backend unavailable, using default schedule data.', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  // Save schedule to backend
  const handleSave = async () => {
    setSaving(true);
    setShowError(false);
    try {
      await saveAvailability(schedule);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save availability schedule:', error);
      setErrorMsg(error?.response?.data?.message || 'Failed to save schedule. Backend may be offline.');
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  const getCellStyle = (slot, isFriday) => {
    const isAvailable = slot.status === 'Available';
    const isBreak = slot.status === 'Break';

    let bg = '';
    let text = '';
    let border = '';

    if (isAvailable) {
      bg = 'bg-emerald-50/60';
      text = 'text-emerald-600 font-semibold';
      if (isFriday) {
        border = 'border-r-[3px] border-r-emerald-400';
      }
    } else if (isBreak) {
      bg = 'bg-gray-50';
      text = 'text-gray-400 font-medium italic';
    } else {
      bg = 'bg-white';
      text = 'text-gray-400 font-medium';
    }

    return `${bg} ${text} ${border}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#2563eb] animate-spin" />
        <span className="ml-2 text-sm text-gray-500 font-medium">Loading schedule...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header Row: Title + Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            Weekly Availability & Consultation Matrix
          </h1>
          <p className="text-sm text-gray-500">
            Block out office hours and consultation slots for student meetings (Mon–Fri, 08:30 to 16:30)
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 active:scale-[0.97] transition-all duration-150 shadow-sm hover:shadow-md shrink-0 self-start disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Grid Schedule'}
        </button>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 w-[110px]">
                  Time Slot
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="px-4 py-3.5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {schedule.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  {/* Time Slot Cell */}
                  <td className="px-4 py-4 text-xs font-bold text-gray-700 whitespace-nowrap bg-white">
                    {row.time}
                  </td>

                  {/* Day Cells */}
                  {row.slots.map((slot, colIdx) => {
                    const isFriday = colIdx === 4;
                    return (
                      <td
                        key={colIdx}
                        className={`px-4 py-4 text-center text-sm whitespace-nowrap border-l border-gray-100 ${getCellStyle(slot, isFriday)}`}
                      >
                        {slot.status === 'Break'
                          ? slot.type
                          : `${slot.status} (${slot.type})`}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2.5 bg-gray-800 text-white px-6 py-3.5 rounded-full shadow-xl text-sm font-semibold">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="italic">Availability schedule saved successfully!</span>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {showError && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2.5 bg-red-600 text-white px-6 py-3.5 rounded-full shadow-xl text-sm font-semibold">
            <AlertCircle className="w-5 h-5 text-red-200 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
