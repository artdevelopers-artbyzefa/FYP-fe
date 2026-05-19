import React, { useEffect, useState } from 'react';
import { getGovernanceData } from '../../services/hod.service';

const HodGovernance = () => {
  const [data, setData] = useState({ committees: [], rubrics: [] });

  useEffect(() => {
    getGovernanceData().then((res) => setData(res.data)).catch(console.error);
  }, []);

  return (
    <>
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">Committee & Rubric Governance Oversight</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Verify active evaluation boards, approved rubric schemas, and academic session integrity locks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-[fadeIn_0.3s_ease-out]">
        {/* Active Committees Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h3 className="text-base font-black text-gray-800 pb-3 border-b border-gray-50">Active Evaluation Boards</h3>
          <div className="space-y-4">
            {data.committees.map((com) => (
              <div key={com.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-900 block mb-0.5 text-sm">{com.name}</span>
                  <span className="text-gray-500">Head: {com.head} · {com.members} Members</span>
                </div>
                <span className="bg-success/10 text-success font-bold px-3 py-1 rounded-xl border border-success/20">{com.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Approved Rubrics Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h3 className="text-base font-black text-gray-800 pb-3 border-b border-gray-50">Approved Rubric Schemas</h3>
          <div className="space-y-4">
            {data.rubrics.map((rubric) => (
              <div key={rubric.id} className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-900 block mb-0.5 text-sm">{rubric.name}</span>
                  <span className="text-gray-500">{rubric.validation}</span>
                </div>
                <span className="bg-blue-100 text-secondary font-bold px-3 py-1 rounded-xl border border-blue-200">
                  <i className="fas fa-lock mr-1"></i> {rubric.status}
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
