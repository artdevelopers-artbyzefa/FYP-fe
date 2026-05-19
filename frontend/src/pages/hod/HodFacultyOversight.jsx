import React, { useEffect, useState } from 'react';
import { getFacultyWorkload } from '../../services/hod.service';

const HodFacultyOversight = () => {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    getFacultyWorkload().then((res) => setFaculty(res.data)).catch(console.error);
  }, []);

  return (
    <>
      <div className="border-b border-gray-100 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-800">Faculty Workload & Performance Oversight</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Monitor faculty supervision caps, research alignment tags, and weekly meeting log compliance</p>
        </div>
        <button className="px-4 py-2 bg-secondary text-white hover:bg-blue-700 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer">
          <i className="fas fa-external-link-alt"></i> View Full Faculty Reports Table
        </button>
      </div>

      {/* Faculty Workload Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        <div className="p-5 bg-gray-50 border-b border-gray-100">
          <h3 className="text-base font-black text-gray-800">Supervision Load Distribution (Computer Science)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Faculty Member</th>
                <th className="py-3.5 px-6">Designation</th>
                <th className="py-3.5 px-6 text-center">Supervision Load</th>
                <th className="py-3.5 px-6">Research Alignment</th>
                <th className="py-3.5 px-6 text-center">Meeting Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
              {faculty.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-900">{f.name}</td>
                  <td className="py-4 px-6 text-gray-500 text-xs font-bold">{f.designation}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`font-bold px-2.5 py-1 rounded-lg border text-xs ${f.slots.includes('Max') ? 'bg-blue-50 text-secondary border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      {f.slots}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {f.research.map((tag, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-lg border border-success/20">{f.compliance}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HodFacultyOversight;
