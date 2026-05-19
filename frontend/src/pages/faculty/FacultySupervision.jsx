import React, { useEffect, useState } from 'react';
import { getFacultySupervisedGroups } from '../../services/faculty.service';
import { showToast } from '../../components/AppToast';

const FacultySupervision = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getFacultySupervisedGroups().then(res => setGroups(res.data)).catch(console.error);
  }, []);

  const handleApproveLog = () => {
    showToast.success('Weekly log approved and added to student record.');
  };

  return (
    <>
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-black text-gray-800">Supervised Project Groups</h2>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">Monitor active groups, review submitted weekly logs, and evaluate draft thesis chapters.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Group Details</th>
                <th className="py-3.5 px-6">Project Title</th>
                <th className="py-3.5 px-6">Overall Progress</th>
                <th className="py-3.5 px-6">Log Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
              {groups.map(g => (
                <tr key={g.groupId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900">{g.groupId}</div>
                    <div className="text-[10px] text-gray-500">{g.members.join(', ')}</div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 truncate max-w-[200px]">{g.title}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div className="bg-secondary h-2 rounded-full" style={{ width: g.progress }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500">{g.progress}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-bold text-[10px] px-2.5 py-1 rounded-lg border ${g.logStatus === 'Up to Date' ? 'bg-success/10 text-success border-success/20' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                      {g.logStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-1">
                    {g.logStatus === 'Pending Review' ? (
                      <>
                        <button className="px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-secondary border border-gray-200 text-xs font-bold transition-all cursor-pointer">View</button>
                        <button onClick={handleApproveLog} className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all cursor-pointer">Approve</button>
                      </>
                    ) : (
                      <button className="px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 text-xs font-bold transition-all cursor-pointer">View History</button>
                    )}
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

export default FacultySupervision;
