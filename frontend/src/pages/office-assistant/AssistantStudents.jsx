import React, { useEffect, useState } from 'react';
import { getOfficeStudents } from '../../services/office-assistant.service';
import { showToast } from '../../components/AppToast';
import { Search, Send } from 'lucide-react';

const AssistantStudents = () => {
  const [students, setStudents] = useState([]);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  useEffect(() => {
    getOfficeStudents().then(res => setStudents(res.data)).catch(console.error);
  }, []);

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    showToast.success('Bulk message sent successfully!');
    setIsBulkOpen(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-black pb-4">
        <div>
          <h2 className="text-xl font-black text-black">Student Management</h2>
          <p className="text-xs text-black mt-0.5 font-medium">Search registration numbers, filter by FYP status, and dispatch bulk milestone messages</p>
        </div>
        <button onClick={() => setIsBulkOpen(true)} className="bg-white hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
          <Send className="w-4 h-4" /> Bulk Message
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-black p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-sm" />
          <input type="text" placeholder="Search student name or reg no..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-black rounded-xl text-sm outline-none focus:border-black focus:bg-white transition-all" />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-black">FYP Status:</span>
          <select className="bg-white border border-black rounded-xl px-4 py-2 text-sm font-bold text-black outline-none focus:border-black cursor-pointer">
            <option value="">All Statuses</option>
            <option value="No Project">No Project</option>
            <option value="FYP-1">FYP-1</option>
            <option value="FYP-2">FYP-2</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/75 border-b border-black text-[11px] font-black text-black uppercase tracking-wider">
                <th className="py-3.5 px-6 w-12"><input type="checkbox" className="accent-primary cursor-pointer" /></th>
                <th className="py-3.5 px-6">Student Name</th>
                <th className="py-3.5 px-6">Registration Number</th>
                <th className="py-3.5 px-6">FYP Status</th>
                <th className="py-3.5 px-6">Assigned Project</th>
                <th className="py-3.5 px-6 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-600 text-sm font-medium text-black">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-white/50 transition-colors">
                  <td className="py-4 px-6"><input type="checkbox" className="accent-primary cursor-pointer" /></td>
                  <td className="py-4 px-6 font-bold text-black">{s.name}</td>
                  <td className="py-4 px-6 text-black font-mono">{s.id}</td>
                  <td className="py-4 px-6">
                    <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border ${s.status === 'Completed' ? 'bg-success/10 text-success border-success/20' : s.status.includes('FYP-1') ? 'bg-blue-50 text-black border-blue-100' : 'bg-white'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-black truncate max-w-xs">{s.project}</td>
                  <td className="py-4 px-6 text-right"><button className="px-3 py-1.5 rounded-lg bg-white hover:bg-white hover:text-blue-600 border border-black text-xs font-bold transition-all cursor-pointer">View Profile</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isBulkOpen && (
        <div className="fixed inset-0 bg-blue-600/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-black">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-black">
              <h3 className="text-lg font-black text-black">Compose Bulk Message</h3>
              <i className="fas fa-times text-black hover:text-blue-600 cursor-pointer text-lg" onClick={() => setIsBulkOpen(false)}></i>
            </div>
            <form onSubmit={handleBulkSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Selected Recipients</label>
                <input type="text" readOnly className="w-full bg-white border border-black rounded-xl px-4 py-2.5 text-xs font-bold text-black outline-none" value="All Students Selected" />
              </div>
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Message Subject</label>
                <input type="text" placeholder="e.g. Urgent: FYP Milestone Deliverable Reminder" className="w-full bg-white border border-black rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black focus:bg-white transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Message Body</label>
                <textarea placeholder="Compose your official dispatch here..." className="w-full bg-white border border-black rounded-xl px-4 py-3 text-sm outline-none focus:border-black focus:bg-white transition-all h-32" required></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-black">
                <button type="button" onClick={() => setIsBulkOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-black hover:bg-white transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-white hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-2"><Send className="w-4 h-4" /> Send Broadcast</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantStudents;
