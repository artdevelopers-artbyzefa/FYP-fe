import React, { useEffect, useState } from 'react';
import { getStudentGroup } from '../../services/student.service';
import apiClient from '../../api/apiClient';
import { Users, Star, Shield, Loader2, User, Mail, ChevronDown, ChevronUp } from 'lucide-react';

const StudentCommittee = () => {
  const [loading, setLoading] = useState(true);
  const [committee, setCommittee] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getStudentGroup(),
      apiClient.get('/office-assistant/eval-committee')
    ]).then(([groupRes, commRes]) => {
      const group = groupRes.data || {};
      setGroupName(group.name || '');
      const committeeIds = group.committeeMembers || [];
      const allComms = commRes.data?.data || [];
      if (committeeIds.length > 0) {
        const matched = allComms.find(c =>
          committeeIds.some(id => id === c.id || id === c._id)
        );
        setCommittee(matched || null);
      } else {
        setCommittee(null);
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading committee info...</span>
      </div>
    );
  }

  if (!committee) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900">My Evaluation Committee</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">View the committee assigned to evaluate your FYP project.</p>
        </div>
        <div className="bg-white rounded-2xl border border-line shadow-sm p-12 text-center">
          <Shield size={40} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-700 mb-1">No Committee Assigned</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Your group has not been assigned to an evaluation committee yet. Check back after the committee formation phase.
          </p>
        </div>
      </div>
    );
  }

  const members = committee.members || [];
  const headName = committee.head || 'Not assigned';

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">My Evaluation Committee</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">View the committee assigned to evaluate your FYP project.</p>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-line flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{committee.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${committee.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                {committee.status === 'active' ? 'Active' : committee.status || 'N/A'}
              </span>
              {groupName && (
                <>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1"><Users size={12} /> {groupName}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-line">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star size={14} className="text-amber-500" />
              <span className="text-xs font-bold text-slate-900 tracking-wider">Committee Head</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
                {headName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{headName}</div>
                <div className="text-[10px] text-slate-400 font-medium">Committee Head</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-blue-500" />
                <span className="text-xs font-bold text-slate-900 tracking-wider">Members ({members.length})</span>
              </div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer bg-transparent border-0"
              >
                {expanded ? 'Show less' : 'Show all'}
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
            <div className="space-y-2">
              {(expanded ? members : members.slice(0, 3)).map((m, i) => {
                const mName = typeof m === 'string' ? m : (m.name || 'Unknown');
                return (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-line">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {mName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{mName}</div>
                      {m.email && <div className="text-[10px] text-gray-400 truncate">{m.email}</div>}
                    </div>
                  </div>
                );
              })}
              {!expanded && members.length > 3 && (
                <button
                  onClick={() => setExpanded(true)}
                  className="w-full text-center text-[10px] font-bold text-blue-600 py-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border-0 bg-transparent"
                >
                  +{members.length - 3} more members
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-sm p-6">
        <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5">
          <Shield size={13} /> Committee Overview
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-semibold block mb-1">Committee Name</span>
            <span className="font-bold text-slate-900">{committee.name}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-semibold block mb-1">Status</span>
            <span className={`font-bold px-2 py-0.5 rounded-lg border text-[10px] inline-block ${committee.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
              {committee.status === 'active' ? 'Active' : committee.status || 'N/A'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 font-semibold block mb-1">Total Members</span>
            <span className="font-bold text-slate-900">{members.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCommittee;
