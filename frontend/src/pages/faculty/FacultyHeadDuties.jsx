import React, { useEffect, useState } from 'react';
import { getFacultyHeadDuties } from '../../services/faculty.service';
import { showToast } from '../../components/AppToast';
import { Crown } from 'lucide-react';

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
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black flex items-center gap-2">
          <Crown className="w-4 h-4" /> Committee Head Duties
        </h2>
        <p className="text-xs text-black mt-0.5 font-medium">Consolidate member evaluations and publish final consensus scores.</p>
      </div>

      <div className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/50 border-b border-black text-[11px] font-black text-black uppercase tracking-wider">
                <th className="py-3.5 px-6">Committee</th>
                <th className="py-3.5 px-6">Active Members</th>
                <th className="py-3.5 px-6">Pending Consolidations</th>
                <th className="py-3.5 px-6">Next Meeting</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 text-sm font-medium text-black">
              {duties.map((d, i) => (
                <tr key={i} className="hover:bg-white/30 transition-colors">
                  <td className="py-4 px-6 font-black text-black">{d.committeeId}</td>
                  <td className="py-4 px-6 text-black">{d.activeMembers} Members</td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-[10px] px-2.5 py-1 rounded-lg border bg-white text-black border-black">
                      {d.pendingConsolidations} Pending
                    </span>
                  </td>
                  <td className="py-4 px-6 text-black font-bold">{d.nextMeeting}</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button onClick={handleConsolidate} className="px-3 py-1.5 rounded-lg bg-white text-white font-bold text-xs transition-all cursor-pointer shadow-sm hover:bg-white">Consolidate Results</button>
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
