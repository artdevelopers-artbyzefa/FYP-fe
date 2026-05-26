import React, { useEffect, useState } from 'react';
import { getOfficeProjects } from '../../services/office-assistant.service';
import { Search } from 'lucide-react';

const AssistantProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    getOfficeProjects().then(res => setProjects(res.data)).catch(console.error);
  }, []);

  return (
    <>
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">Project Directory</h2>
        <p className="text-xs text-black mt-0.5 font-medium">Searchable repository of all proposed, active, and completed FYP projects</p>
      </div>

      <div className="bg-white rounded-2xl border border-black p-4 mb-6 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black text-sm" />
          <input type="text" placeholder="Search project title, student, or supervisor..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-black rounded-xl text-sm outline-none focus:border-black focus:bg-white transition-all" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/75 border-b border-black text-[11px] font-black text-black uppercase tracking-wider">
                <th className="py-3.5 px-6">Project Title</th>
                <th className="py-3.5 px-6">Group Leader</th>
                <th className="py-3.5 px-6">Supervisor Name</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black text-sm font-medium text-black">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-white/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-black max-w-md truncate">{p.title}</td>
                  <td className="py-4 px-6 text-black">{p.leader}</td>
                  <td className="py-4 px-6 text-black">{p.supervisor}</td>
                  <td className="py-4 px-6">
                    <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border ${p.status === 'Approved' ? 'bg-success/10 text-success border-success/20' : 'bg-white'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => setSelectedProject(p)} className="px-3 py-1.5 rounded-lg bg-white hover:bg-white hover:text-black border border-black text-xs font-bold transition-all cursor-pointer">View Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-black max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-black">
              <h3 className="text-lg font-black text-black">Project Detail View</h3>
              <i className="fas fa-times text-black hover:text-black cursor-pointer text-lg" onClick={() => setSelectedProject(null)}></i>
            </div>
            <div className="space-y-5">
              <div>
                <h4 className="text-xl font-black text-black">{selectedProject.title}</h4>
                <div className="flex gap-2 mt-2"><span className="bg-white text-black font-bold text-xs px-2.5 py-0.5 rounded-lg border border-black/20">{selectedProject.status}</span></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-black text-xs">
                <div><span className="text-black font-bold uppercase tracking-wider block mb-1">Group Leader</span><span className="font-bold text-black text-sm">{selectedProject.leader}</span></div>
                <div><span className="text-black font-bold uppercase tracking-wider block mb-1">Assigned Supervisor</span><span className="font-bold text-black text-sm">{selectedProject.supervisor}</span></div>
              </div>
              <div>
                <h5 className="text-xs font-bold text-black uppercase tracking-wider mb-2">Technology Stack</h5>
                <p className="text-xs font-bold text-black bg-white p-3 rounded-xl">{selectedProject.stack}</p>
              </div>
              <div>
                <h5 className="text-xs font-bold text-black uppercase tracking-wider mb-2">Project Abstract</h5>
                <p className="text-xs text-black leading-relaxed bg-white p-4 rounded-2xl border border-black">{selectedProject.desc}</p>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-black text-right">
              <button onClick={() => setSelectedProject(null)} className="bg-white hover:bg-white text-black px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">Close Detail</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantProjects;
