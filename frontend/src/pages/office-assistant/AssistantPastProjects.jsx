import React, { useEffect, useState, useCallback } from 'react';
import { getPastProjects, createPastProject, deletePastProject } from '../../services/office-assistant.service';
import { showToast } from '../../components/AppToast';
import { Search, Plus, X, ExternalLink, Loader2, BookOpen, Code, SlidersHorizontal, Users, Trash2, Archive } from 'lucide-react';

const CATEGORIES = [
  'Artificial Intelligence & ML',
  'Web Development',
  'Mobile Applications',
  'Internet of Things (IoT)',
  'Blockchain & Web3',
  'Cybersecurity',
  'Data Science & Analytics',
  'Cloud Computing & DevOps',
  'Computer Vision',
  'Natural Language Processing',
  'Game Development',
  'Embedded Systems',
  'Database Systems',
  'Software Engineering',
  'Other'
];

const AssistantPastProjects = () => {
  const [projects, setProjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sessionFilter, setSessionFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const limit = 20;

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPastProjects(page, limit, search, sessionFilter, domainFilter);
      setProjects(res.data || []);
      setSessions(res.sessions || []);
      setDomains(res.domains || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      showToast.error('Failed to load past projects.');
    } finally {
      setLoading(false);
    }
  }, [page, search, sessionFilter, domainFilter]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const students = [];
    const studentNames = formData.getAll('studentName');
    const studentRegs = formData.getAll('studentReg');
    studentNames.forEach((name, i) => {
      if (name.trim()) students.push({ name: name.trim(), regNo: studentRegs[i]?.trim() || '' });
    });
    const techStack = formData.get('techStack') ? formData.get('techStack').split(',').map(s => s.trim()).filter(Boolean) : [];
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      students,
      supervisor: { name: formData.get('supervisorName'), email: formData.get('supervisorEmail') },
      coSupervisor: formData.get('coSupervisor'),
      session: formData.get('session'),
      cohort: formData.get('cohort'),
      domain: formData.get('domain'),
      techStack
    };
    try {
      await createPastProject(payload);
      showToast.success('Past project added successfully!');
      setIsCreateOpen(false);
      fetchProjects();
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to create past project.');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deletePastProject(id);
      showToast.success('Past project deleted.');
      fetchProjects();
    } catch (err) {
      showToast.error('Failed to delete.');
    }
  };

  const [extraStudentFields, setExtraStudentFields] = useState([0]);

  const filteredProjects = techFilter
    ? projects.filter(p =>
        p.techStack?.some(t => t.toLowerCase().includes(techFilter.toLowerCase()))
      )
    : projects;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Past FYP Projects</h2>
          <p className="text-xs text-slate-900 mt-0.5 font-medium">Archive of all completed FYP projects from previous sessions</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" /> Add Past Project
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-line p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, student, or supervisor..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-line rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <select
            value={sessionFilter}
            onChange={e => { setSessionFilter(e.target.value); setPage(1); }}
            className="w-full sm:w-auto bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Sessions</option>
            {sessions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${showFilters ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-900 border-line hover:bg-gray-50'}`}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-line">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 tracking-wider mb-1.5 flex items-center gap-1.5">
                <BookOpen size={12} /> Category / Domain
              </label>
              <select
                value={domainFilter}
                onChange={e => { setDomainFilter(e.target.value); setPage(1); }}
                className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">All Categories</option>
                {CATEGORIES.filter(c => !domains.length || domains.includes(c)).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                {domains.filter(d => !CATEGORIES.includes(d)).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 tracking-wider mb-1.5 flex items-center gap-1.5">
                <Code size={12} /> Technology Stack
              </label>
              <div className="relative">
                <Code size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. React, Python, TensorFlow"
                  value={techFilter}
                  onChange={e => { setTechFilter(e.target.value); setPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-line rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-line p-5 shadow-sm animate-pulse">
              <div className="h-5 rounded-lg skeleton w-3/4 mb-4" />
              <div className="h-3 rounded skeleton w-full mb-2" />
              <div className="h-3 rounded skeleton w-2/3 mb-4" />
              <div className="flex gap-2 mb-3">
                <div className="h-6 rounded-lg skeleton w-20" />
                <div className="h-6 rounded-lg skeleton w-24" />
              </div>
              <div className="flex gap-2">
                <div className="h-4 rounded skeleton w-16" />
                <div className="h-4 rounded skeleton w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
          <Archive className="w-10 h-10" />
          <p className="text-sm font-bold">No past projects found.</p>
          <p className="text-xs">Try adjusting your search or filters, or add a new past project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-line p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-bold text-slate-900 text-base truncate">{p.title}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-1 rounded-lg border border-blue-200">{p.session || 'N/A'}</span>
                {p.domain && (
                  <span className="bg-purple-50 text-purple-700 font-bold text-[10px] px-2 py-1 rounded-lg border border-purple-200 flex items-center gap-1">
                    <BookOpen size={10} /> {p.domain}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mb-3">
                <span className="font-medium text-slate-900">{p.supervisor?.name || 'N/A'}</span>
                {p.students?.length > 0 && (
                  <span className="text-gray-300"> — </span>
                )}
                {p.students?.slice(0, 2).map(s => s.name).join(', ')}{p.students?.length > 2 ? '...' : ''}
              </div>
              {p.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.techStack.slice(0, 4).map((t, i) => (
                    <span key={i} className="bg-gray-50 text-slate-900 font-bold text-[10px] px-2 py-1 rounded-lg border border-line">{t}</span>
                  ))}
                  {p.techStack.length > 4 && <span className="text-[10px] text-gray-400 font-bold">+{p.techStack.length - 4}</span>}
                </div>
              )}
              <div className="flex items-center gap-2 pt-3 border-t border-line">
                <button onClick={() => setSelectedProject(p)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-all cursor-pointer">View Details</button>
                <button onClick={() => handleDelete(p.id, p.title)} className="px-3 py-1.5 rounded-lg bg-white text-red-400 border border-line text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer flex items-center gap-1">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-line text-sm font-bold text-slate-900 hover:bg-white transition-all disabled:opacity-40 cursor-pointer">Previous</button>
          <span className="text-sm font-bold text-slate-400 px-3">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-xl border border-line text-sm font-bold text-slate-900 hover:bg-white transition-all disabled:opacity-40 cursor-pointer">Next</button>
        </div>
      )}

      {selectedProject && (
        <div className="fixed inset-0 bg-blue-600/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-line max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-line">
              <h3 className="text-lg font-bold text-slate-900">Past Project Detail</h3>
              <button onClick={() => setSelectedProject(null)} className="w-8 h-8 rounded-xl bg-gray-50 border border-line flex items-center justify-center text-slate-400 hover:bg-gray-100 transition-all cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <h4 className="text-xl font-bold text-slate-900">{selectedProject.title}</h4>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-blue-200">{selectedProject.session || 'N/A'}</span>
                  {selectedProject.domain && <span className="bg-purple-50 text-purple-700 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-purple-200">{selectedProject.domain}</span>}
                </div>
              </div>
              {selectedProject.description && (
                <div>
                  <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-2">Description</h5>
                  <p className="text-xs text-slate-900 leading-relaxed bg-white p-4 rounded-2xl border border-line">{selectedProject.description}</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-line text-xs">
                <div>
                  <span className="text-slate-900 font-bold tracking-wider block mb-1">Supervisor</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedProject.supervisor?.name || 'N/A'}</span>
                  {selectedProject.supervisor?.email && <span className="block text-gray-400 text-xs mt-0.5">{selectedProject.supervisor.email}</span>}
                </div>
                {selectedProject.coSupervisor?.name && (
                  <div>
                    <span className="text-slate-900 font-bold tracking-wider block mb-1">Co-Supervisor</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedProject.coSupervisor.name}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-900 font-bold tracking-wider block mb-1">Session / Cohort</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedProject.session || 'N/A'}{selectedProject.cohort ? ` (${selectedProject.cohort})` : ''}</span>
                </div>
                <div>
                  <span className="text-slate-900 font-bold tracking-wider block mb-1">Added by</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedProject.createdBy || 'N/A'}</span>
                </div>
              </div>
              {selectedProject.students?.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-2">Team Members</h5>
                  <div className="space-y-2">
                    {selectedProject.students.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-line">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">{s.name?.charAt(0)}</div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{s.name}</div>
                          {s.regNo && <div className="text-xs text-gray-400">{s.regNo}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedProject.techStack?.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-2">Technology Stack</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((t, i) => (
                      <span key={i} className="bg-gray-50 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg border border-line">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {selectedProject.documentLinks?.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-2">Documents / Links</h5>
                  <div className="space-y-2">
                    {selectedProject.documentLinks.map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        <ExternalLink size={14} /> {link.label || link.url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-8 pt-4 border-t border-line flex justify-end gap-3">
              <button onClick={() => { handleDelete(selectedProject.id, selectedProject.title); setSelectedProject(null); }} className="px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer border border-line flex items-center gap-1">
                <Trash2 size={12} /> Delete
              </button>
              <button onClick={() => setSelectedProject(null)} className="bg-white hover:bg-white text-slate-900 px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 bg-blue-600/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-line max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-line">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add Past FYP Project</h3>
                <p className="text-xs text-slate-400 mt-0.5">Archive a completed project from any previous session</p>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="w-8 h-8 rounded-xl bg-gray-50 border border-line flex items-center justify-center text-slate-400 hover:bg-gray-100 transition-all cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Project Title *</label>
                <input type="text" name="title" placeholder="e.g. AI-Powered FYP Management System" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Description</label>
                <textarea name="description" rows={3} placeholder="Brief project description / abstract..." className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Session *</label>
                  <input type="text" name="session" placeholder="e.g. 2024" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Cohort</label>
                  <input type="text" name="cohort" placeholder="e.g. Fall 2024" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Category / Domain</label>
                <div className="relative">
                  <BookOpen size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    name="domain"
                    className="w-full bg-white border border-line rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select category...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Technology Stack (comma separated)</label>
                <div className="relative">
                  <Code size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" name="techStack" placeholder="e.g. React, Node.js, MongoDB" className="w-full bg-white border border-line rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Supervisor Name</label>
                  <input type="text" name="supervisorName" placeholder="e.g. Dr. Tariq Mehmood" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1.5">Supervisor Email</label>
                  <input type="email" name="supervisorEmail" placeholder="supervisor@cuiatd.edu.pk" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Co-Supervisor</label>
                <input type="text" name="coSupervisor" placeholder="e.g. Dr. Usman Qureshi" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-all" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-900">Team Members</label>
                  <button type="button" onClick={() => setExtraStudentFields([...extraStudentFields, extraStudentFields.length])} className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-transparent border-0 cursor-pointer">+ Add Member</button>
                </div>
                {extraStudentFields.map((_, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <input type="text" name="studentName" placeholder="Student name" className="w-full bg-white border border-line rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition-all" />
                    <input type="text" name="studentReg" placeholder="Reg No (optional)" className="w-full bg-white border border-line rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition-all" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 hover:bg-gray-50 transition-colors cursor-pointer border border-line">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-2"><Archive size={14} /> Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantPastProjects;
