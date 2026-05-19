import React, { useEffect, useState } from 'react';
import { getFacultyHeadDuties } from '../../services/faculty.service';
import { showToast } from '../../components/AppToast';

const FacultyHeadDuties = () => {
  const [duties, setDuties] = useState([]);

  useEffect(() => {
    getFacultyHeadDuties().then(res => setDuties(res.data)).catch(console.error);
  }, []);

  const handleConsolidate = () => {
    showToast.success('Member evaluations consolidated. Final score published to FYP Office.');
  };

  return (
    <>
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-amber-600 flex items-center gap-2">
          <i className="fas fa-crown"></i> Committee Head Duties
        </h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Consolidate member evaluations and publish final consensus scores.</p>
      </div>

      <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-amber-50/50 border-b border-amber-100 text-[11px] font-black text-amber-700 uppercase tracking-wider">
                <th className="py-3.5 px-6">Committee</th>
                <th className="py-3.5 px-6">Active Members</th>
                <th className="py-3.5 px-6">Pending Consolidations</th>
                <th className="py-3.5 px-6">Next Meeting</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 text-sm font-medium text-gray-700">
              {duties.map((d, i) => (
                <tr key={i} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-4 px-6 font-black text-gray-900">{d.committeeId}</td>
                  <td className="py-4 px-6 text-gray-600">{d.activeMembers} Members</td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-[10px] px-2.5 py-1 rounded-lg border bg-amber-50 text-amber-600 border-amber-200">
                      {d.pendingConsolidations} Pending
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 font-bold">{d.nextMeeting}</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button onClick={handleConsolidate} className="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-bold text-xs transition-all cursor-pointer shadow-sm hover:bg-amber-600">Consolidate Results</button>
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

export default FacultyHeadDuties;
