import React, { useEffect, useState } from 'react';
import { getGovernanceData } from '../../services/hod.service';
import { Lock } from 'lucide-react';

const HodGovernance = () => {
  const [data, setData] = useState({ committees: [], rubrics: [] });

  useEffect(() => {
    getGovernanceData().then((res) => setData(res.data)).catch(console.error);
  }, []);

  return (
    <>
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">Committee & Rubric Governance Oversight</h2>
        <p className="text-xs text-black mt-0.5 font-medium">Verify active evaluation boards, approved rubric schemas, and academic session integrity locks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-[fadeIn_0.3s_ease-out]">
        {/* Active Committees Card */}
        <div className="bg-white rounded-2xl border border-black shadow-sm p-6 space-y-6">
          <h3 className="text-base font-black text-black pb-3 border-b border-black">Active Evaluation Boards</h3>
          <div className="space-y-4">
            {data.committees.map((com) => (
              <div key={com.id} className="p-4 rounded-2xl bg-white border border-black flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-black block mb-0.5 text-sm">{com.name}</span>
                  <span className="text-black">Head: {com.head} · {com.members} Members</span>
                </div>
                <span className="bg-white text-black font-bold px-3 py-1 rounded-xl border border-black/20">{com.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Approved Rubrics Card */}
        <div className="bg-white rounded-2xl border border-black shadow-sm p-6 space-y-6">
          <h3 className="text-base font-black text-black pb-3 border-b border-black">Approved Rubric Schemas</h3>
          <div className="space-y-4">
            {data.rubrics.map((rubric) => (
              <div key={rubric.id} className="p-4 rounded-2xl bg-white/50 border border-black flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-black block mb-0.5 text-sm">{rubric.name}</span>
                  <span className="text-black">{rubric.validation}</span>
                </div>
                <span className="bg-white text-black font-bold px-3 py-1 rounded-xl border border-black">
                  <Lock className="w-4 h-4 mr-1" /> {rubric.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HodGovernance;
