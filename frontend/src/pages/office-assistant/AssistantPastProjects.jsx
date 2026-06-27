import React, { useEffect, useState, useCallback } from 'react';
import { getPastProjects, createPastProject, deletePastProject, getOfficeStudents } from '../../services/office-assistant.service';
import { showToast } from '../../components/AppToast';
import { Search, Plus, X, ArrowLeft, ExternalLink, Loader2, BookOpen, Code, SlidersHorizontal, Users, Trash2, Archive, User, ChevronDown, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  'Artificial Intelligence & ML', 'Web Development', 'Mobile Applications',
  'Internet of Things (IoT)', 'Blockchain & Web3', 'Cybersecurity',
  'Data Science & Analytics', 'Cloud Computing & DevOps', 'Computer Vision',
  'Natural Language Processing', 'Game Development', 'Embedded Systems',
  'Database Systems', 'Software Engineering', 'Other'
];

export default function AssistantPastProjects() {
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
  const [view, setView] = useState('list');
  const limit = 20;

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPastProjects(page, limit, search, sessionFilter, domainFilter);
      setProjects(res.data || []);
      setSessions(res.sessions || []);
      setDomains(res.domains || []);
      setTotalPages(res.totalPages || 1);
    } catch { showToast.error('Failed to load past projects.'); }
    finally { setLoading(false); }
  }, [page, search, sessionFilter, domainFilter]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const filteredProjects = techFilter
    ? projects.filter(p => p.techStack?.some(t => t.toLowerCase().includes(techFilter.toLowerCase())))
    : projects;

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deletePastProject(id);
      showToast.success('Past project deleted.');
      fetchProjects();
    } catch { showToast.error('Failed to delete.'); }
  };

  if (view === 'create') {
    return <CreatePastProjectForm sessions={sessions} onBack={() => setView('list')} onSaved={() => { setView('list'); fetchProjects(); }} />;
  }

  if (view === 'detail' && selectedProject) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4">
          <button onClick={() => { setView('list'); setSelectedProject(null); }} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3">
            <ArrowLeft size={14} /> Back to Past Projects
          </button>
          <h2 className="text-xl font-bold text-slate-900">{selectedProject.title}</h2>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-blue-200">{selectedProject.session || 'N/A'}</span>
            {selectedProject.domain && <span className="bg-purple-50 text-purple-700 font-bold text-xs px-2.5 py-0.5 rounded-lg border border-purple-200">{selectedProject.domain}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {selectedProject.description && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><BookOpen size={13} /> Description</h5>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedProject.description}</p>
              </div>
            )}
            {selectedProject.techStack?.length > 0 && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><Code size={13} /> Technology Stack</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.techStack.map((t, i) => (
                    <span key={i} className="bg-gray-50 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg border border-line">{t}</span>
                  ))}
                </div>
              </div>
            )}
            {selectedProject.documentLinks?.length > 0 && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-3 flex items-center gap-1.5"><ExternalLink size={13} /> Documents / Links</h5>
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

          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><User size={13} /> Supervision</h5>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-0.5">Supervisor</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedProject.supervisor?.name || 'N/A'}</span>
                  {selectedProject.supervisor?.email && <p className="text-[10px] text-slate-400">{selectedProject.supervisor.email}</p>}
                </div>
                {selectedProject.coSupervisor?.name && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-0.5">Co-Supervisor</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedProject.coSupervisor.name}</span>
                  </div>
                )}
              </div>
            </div>

            {selectedProject.students?.length > 0 && (
              <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
                <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4 flex items-center gap-1.5"><Users size={13} /> Team Members ({selectedProject.students.length})</h5>
                <div className="space-y-2">
                  {selectedProject.students.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-line">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">{s.name?.charAt(0)}</div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">{s.name}</div>
                        {s.regNo && <div className="text-[10px] text-gray-400 truncate">{s.regNo}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
              <h5 className="text-xs font-bold text-slate-900 tracking-wider mb-4">Details</h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Session</span><span className="font-bold text-slate-900">{selectedProject.session || 'N/A'}</span></div>
                {selectedProject.cohort && <div className="flex justify-between"><span className="text-slate-400">Cohort</span><span className="font-bold text-slate-900">{selectedProject.cohort}</span></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Past FYP Projects</h2>
          <p className="text-xs text-slate-900 mt-0.5 font-medium">Archive of all completed FYP projects from previous sessions</p>
        </div>
        <button onClick={() => setView('create')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
          <Plus className="w-4 h-4" /> Add Past Project
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-line p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by title, student, or supervisor..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-line rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
          </div>
          <select value={sessionFilter} onChange={e => { setSessionFilter(e.target.value); setPage(1); }}
            className="w-full sm:w-auto bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 cursor-pointer">
            <option value="">All Sessions</option>
            {sessions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${showFilters ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-900 border-line hover:bg-gray-50'}`}>
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-line">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 tracking-wider mb-1.5 flex items-center gap-1.5"><BookOpen size={12} /> Category / Domain</label>
              <select value={domainFilter} onChange={e => { setDomainFilter(e.target.value); setPage(1); }}
                className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 cursor-pointer">
                <option value="">All Categories</option>
                {CATEGORIES.filter(c => !domains.length || domains.includes(c)).map(c => (<option key={c} value={c}>{c}</option>))}
                {domains.filter(d => !CATEGORIES.includes(d)).map(d => (<option key={d} value={d}>{d}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 tracking-wider mb-1.5 flex items-center gap-1.5"><Code size={12} /> Technology Stack</label>
              <div className="relative">
                <Code size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="e.g. React, Python, TensorFlow" value={techFilter}
                  onChange={e => { setTechFilter(e.target.value); setPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-line rounded-xl text-sm outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-line p-5 shadow-sm animate-pulse">
              <div className="h-5 rounded-lg skeleton w-3/4 mb-4" /><div className="h-3 rounded skeleton w-full mb-2" /><div className="h-3 rounded skeleton w-2/3 mb-4" />
              <div className="flex gap-2 mb-3"><div className="h-6 rounded-lg skeleton w-20" /><div className="h-6 rounded-lg skeleton w-24" /></div>
              <div className="flex gap-2"><div className="h-4 rounded skeleton w-16" /><div className="h-4 rounded skeleton w-20" /></div>
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
                {p.domain && <span className="bg-purple-50 text-purple-700 font-bold text-[10px] px-2 py-1 rounded-lg border border-purple-200 flex items-center gap-1"><BookOpen size={10} /> {p.domain}</span>}
              </div>
              <div className="text-xs text-slate-500 mb-3">
                <span className="font-medium text-slate-900">{p.supervisor?.name || 'N/A'}</span>
                {p.students?.length > 0 && <span className="text-gray-300"> — </span>}
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
                <button onClick={() => { setSelectedProject(p); setView('detail'); }} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-all cursor-pointer">View Details</button>
                <button onClick={() => handleDelete(p.id, p.title)} className="px-3 py-1.5 rounded-lg bg-white text-red-400 border border-line text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer flex items-center gap-1"><Trash2 size={12} /> Delete</button>
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
    </div>
  );
}

function CreatePastProjectForm({ sessions, onBack, onSaved }) {
  const [extraMembers, setExtraMembers] = useState([0]);
  const [students, setStudents] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');

  useEffect(() => {
    getOfficeStudents(1, 200).then(res => setStudents(res.data || [])).catch(() => {});
  }, []);

  const filteredStudents = students.filter(s =>
    !studentSearch || s.name?.toLowerCase().includes(studentSearch.toLowerCase()) || s.regNo?.toLowerCase().includes(studentSearch.toLowerCase())
  ).slice(0, 10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const members = [];
    extraMembers.forEach((_, i) => {
      const name = formData.get(`studentName_${i}`);
      if (name?.trim()) members.push({ name: name.trim(), regNo: formData.get(`studentReg_${i}`)?.trim() || '' });
    });
    const techStack = formData.get('techStack') ? formData.get('techStack').split(',').map(s => s.trim()).filter(Boolean) : [];
    const payload = {
      title: formData.get('title'), description: formData.get('description'),
      students: members, session: formData.get('session'), cohort: formData.get('cohort'),
      domain: formData.get('domain'), techStack,
      supervisor: { name: formData.get('supervisorName'), email: formData.get('supervisorEmail') },
      coSupervisor: formData.get('coSupervisor'),
    };
    if (!payload.title) { showToast.error('Project title is required.'); return; }
    setSubmitting(true);
    try {
      await createPastProject(payload);
      showToast.success('Past project added successfully!');
      onSaved();
    } catch (err) { showToast.error(err?.response?.data?.message || 'Failed to create past project.'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-line pb-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer mb-3">
          <ArrowLeft size={14} /> Back to Past Projects
        </button>
        <h2 className="text-xl font-bold text-slate-900">Add Past FYP Project</h2>
        <p className="text-xs text-slate-400 mt-0.5">Archive a completed project from any previous session</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
        <div className="bg-white rounded-2xl border border-line p-6 shadow-sm space-y-5">
          <h5 className="text-xs font-bold text-slate-900 tracking-wider">Project Information</h5>
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
              <div className="relative">
                <select name="session" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer" required>
                  <option value="">Select session...</option>
                  {sessions.map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="2026">2026</option><option value="2025">2025</option><option value="2024">2024</option>
                  <option value="2023">2023</option><option value="2022">2022</option><option value="2021">2021</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">Cohort</label>
              <div className="relative">
                <select name="cohort" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer">
                  <option value="">Select cohort...</option>
                  <option value="Fall 2026">Fall 2026</option><option value="Spring 2026">Spring 2026</option>
                  <option value="Fall 2025">Fall 2025</option><option value="Spring 2025">Spring 2025</option>
                  <option value="Fall 2024">Fall 2024</option><option value="Spring 2024">Spring 2024</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5">Category / Domain</label>
            <div className="relative">
              <BookOpen size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select name="domain" className="w-full bg-white border border-line rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer">
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
        </div>

        <div className="bg-white rounded-2xl border border-line p-6 shadow-sm space-y-4">
          <h5 className="text-xs font-bold text-slate-900 tracking-wider">Supervision</h5>
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
        </div>

        <div className="bg-white rounded-2xl border border-line p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-900 tracking-wider">Team Members</h5>
            <button type="button" onClick={() => setExtraMembers([...extraMembers, extraMembers.length])} className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-transparent border-0 cursor-pointer flex items-center gap-1">
              <Plus size={12} /> Add Member
            </button>
          </div>
          {extraMembers.map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-line">
              <div className="flex-1 space-y-2">
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" name={`studentName_${i}`} placeholder="Student name"
                    list={`student-suggestions-${i}`}
                    onChange={e => setStudentSearch(e.target.value)}
                    className="w-full bg-white border border-line rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500 transition-all" />
                  <datalist id={`student-suggestions-${i}`}>
                    {filteredStudents.map(s => (
                      <option key={s._id || s.regNo} value={s.name || ''} />
                    ))}
                  </datalist>
                </div>
                <input type="text" name={`studentReg_${i}`} placeholder="Reg No (optional)" className="w-full bg-white border border-line rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition-all" />
              </div>
              {extraMembers.length > 1 && (
                <button type="button" onClick={() => setExtraMembers(extraMembers.filter((_, j) => j !== i))} className="p-2 text-slate-300 hover:text-red-500 transition-colors bg-transparent border-0 cursor-pointer">
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onBack} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 hover:bg-gray-50 transition-colors cursor-pointer border border-line">Cancel</button>
          <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2">
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Archive size={14} />} Save Project
          </button>
        </div>
      </form>
    </div>
  );
}
