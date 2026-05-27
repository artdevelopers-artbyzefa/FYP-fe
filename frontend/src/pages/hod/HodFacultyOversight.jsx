import React, { useEffect, useState } from 'react';
import { getFacultyWorkload } from '../../services/hod.service';
import { ExternalLink } from 'lucide-react';

const HodFacultyOversight = () => {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    getFacultyWorkload().then((res) => setFaculty(res.data)).catch(console.error);
  }, []);

  return (
    <>
      <div className="border-b border-black pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-black">Faculty Workload & Performance Oversight</h2>
          <p className="text-xs text-black mt-0.5 font-medium">Monitor faculty supervision caps, research alignment tags, and weekly meeting log compliance</p>
        </div>
        <button className="px-4 py-2 bg-white text-white hover:bg-blue-600 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer">
          <ExternalLink className="w-4 h-4" /> View Full Faculty Reports Table
        </button>
      </div>

      {/* Faculty Workload Table */}
      <div className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        <div className="p-5 bg-white border-b border-black">
          <h3 className="text-base font-black text-black">Supervision Load Distribution (Computer Science)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/75 border-b border-black text-[11px] font-black text-black uppercase tracking-wider">
                <th className="py-3.5 px-6">Faculty Member</th>
                <th className="py-3.5 px-6">Designation</th>
                <th className="py-3.5 px-6 text-center">Supervision Load</th>
                <th className="py-3.5 px-6">Research Alignment</th>
                <th className="py-3.5 px-6 text-center">Meeting Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-600 text-sm font-medium text-black">
              {faculty.map((f) => (
                <tr key={f.id} className="hover:bg-white/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-black">{f.name}</td>
                  <td className="py-4 px-6 text-black text-xs font-bold">{f.designation}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`font-bold px-2.5 py-1 rounded-lg border text-xs ${f.slots.includes('Max') ? 'bg-blue-50 text-black border-blue-200' : 'bg-white'}`}>
                      {f.slots}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {f.research.map((tag, idx) => (
                        <span key={idx} className="bg-white text-black px-2 py-0.5 rounded text-[10px] font-bold">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-xs font-bold text-black bg-white px-2.5 py-1 rounded-lg border border-black/20">{f.compliance}</span>
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
