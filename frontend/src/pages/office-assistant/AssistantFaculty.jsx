import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getOfficeFaculty, createOfficeFaculty, deleteOfficeUser, sendFacultyInvite } from '../../services/office-assistant.service';
import { showToast, showAlert } from '../../components/AppToast';
import { Search, UserPlus, X, ChevronLeft, ChevronRight, Trash2, Send } from 'lucide-react';

const FACULTY_TYPES = ['committee', 'supervisor', 'both'];

const initialForm = { name: '', email: '', facultyType: 'supervisor', phone: '' };

const AssistantFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const loadFaculty = useCallback(() => {
    getOfficeFaculty().then(res => {
      const data = Array.isArray(res.data) ? res.data : [];
      setFaculty(data);
      setFiltered(data);
    }).catch(err => {
      console.error(err);
      showToast.error('Failed to load faculty. Is the backend running?');
    });
  }, []);

  useEffect(() => { loadFaculty(); }, [loadFaculty]);

  useEffect(() => {
    let result = faculty;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(f => f.name?.toLowerCase().includes(q) || f.email?.toLowerCase().includes(q));
    }
    if (typeFilter) {
      result = result.filter(f => f.facultyType === typeFilter);
    }
    setFiltered(result);
  }, [search, typeFilter, faculty]);

  const validateForm = (form) => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.facultyType) e.facultyType = 'Select a faculty type';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || submitLock.current) return;
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    submitLock.current = true;
    setSubmitting(true);
    try {
      await createOfficeFaculty({
        name: form.name.trim(),
        email: form.email.trim(),
        facultyType: form.facultyType,
        phone: form.phone.trim() || undefined
      });
      showToast.success('Faculty onboarded successfully!');
      setShowForm(false);
      setForm(initialForm);
      loadFaculty();
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to create faculty.');
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  };

  const handleDelete = (f) => {
    showAlert.confirm(
      'Deactivate Faculty',
      `Deactivate ${f.name}? Their account will be disabled but all existing records (groups, committees) will be preserved.`,
      'Deactivate',
      'Cancel'
    ).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await deleteOfficeUser(f.id);
          showToast.success(`${f.name} deactivated.`);
          loadFaculty();
        } catch (err) {
          showToast.error(err?.response?.data?.message || 'Failed to deactivate faculty.');
        }
      }
    });
  };

  const handleResendInvite = async (f) => {
    try {
      await sendFacultyInvite(f.id);
      showToast.success(`Invitation email resent to ${f.email}`);
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to resend invite.');
    }
  };

  const facultyTypeBadge = (type) => {
    const colors = {
      committee: 'bg-purple-50 text-purple-700 border-purple-200',
      supervisor: 'bg-blue-50 text-blue-700 border-blue-200',
      both: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
    return <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border tracking-wider ${colors[type] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>{type}</span>;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight">Faculty Management</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Manage committee and supervisor faculty, track supervision load, and onboard new members</p>
        </div>
        <button
          onClick={() => {
            if (showForm) { setForm(initialForm); setErrors({}); }
            setShowForm(!showForm);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${showForm ? 'bg-gray-50 text-gray-600 border border-gray-200' : 'bg-primary text-white border-0 hover:bg-navy-dark'}`}
        >
          <UserPlus className="w-4 h-4" /> {showForm ? 'Close' : 'Add Faculty'}
        </button>
      </div>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? 'max-h-[600px] opacity-100 mb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-inner">
          <div className="flex items-center gap-3 sm:gap-4 mb-6">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-800 tracking-tight">Manual Faculty Registration</h3>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest">Onboard new committee or supervisor faculty members</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Full Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Faculty Name" className={`w-full bg-white border ${errors.name ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`} />
                {errors.name && <p className="text-[10px] font-bold text-rose-500 mt-1 tracking-wider">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Institutional Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="name@cuiatd.edu.pk" className={`w-full bg-white border ${errors.email ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`} />
                {errors.email && <p className="text-[10px] font-bold text-rose-500 mt-1 tracking-wider">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Faculty Type *</label>
                <select value={form.facultyType} onChange={e => setForm(f => ({ ...f, facultyType: e.target.value }))} className={`w-full bg-white border ${errors.facultyType ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer`}>
                  <option value="supervisor">Supervisor Faculty</option>
                  <option value="committee">Committee Faculty</option>
                  <option value="both">Both</option>
                </select>
                {errors.facultyType && <p className="text-[10px] font-bold text-rose-500 mt-1 tracking-wider">{errors.facultyType}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Phone Number</label>
                <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="03XXXXXXXXX" className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-200/50">
              <button type="submit" disabled={submitting} className="px-10 py-3 bg-primary text-white rounded-xl text-xs font-black tracking-widest shadow-lg shadow-primary/20 hover:bg-navy-dark hover:shadow-xl hover:shadow-primary/30 transition-all cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {submitting ? 'Processing...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search faculty name or email..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-gray-400 tracking-wider">Type:</span>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer">
            <option value="">All Types</option>
            <option value="committee">Committee</option>
            <option value="supervisor">Supervisor</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[11px] font-bold text-gray-400 tracking-wider">
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Faculty Type</th>
                <th className="py-3.5 px-6">Proposed</th>
                <th className="py-3.5 px-6">In Progress</th>
                <th className="py-3.5 px-6">Completed</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
              {filtered.map(f => (
                <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-gray-800">{f.name}</td>
                  <td className="py-4 px-6 text-gray-600 text-xs">{f.email || '-'}</td>
                  <td className="py-4 px-6">{facultyTypeBadge(f.facultyType)}</td>
                  <td className="py-4 px-6 text-gray-600 text-xs font-bold">{f.proposed}</td>
                  <td className="py-4 px-6 text-gray-600 text-xs font-bold">{f.inProgress}</td>
                  <td className="py-4 px-6 text-gray-600 text-xs font-bold">{f.completed}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex gap-1.5 justify-end">
                      <button onClick={() => handleResendInvite(f)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold transition-all hover:bg-blue-100 cursor-pointer flex items-center gap-1.5">
                        <Send className="w-3 h-3" /> Resend Invite
                      </button>
                      <button onClick={() => handleDelete(f)} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold transition-all hover:bg-rose-100 cursor-pointer flex items-center gap-1.5">
                        <Trash2 className="w-3 h-3" /> Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 text-sm font-bold">No faculty found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AssistantFaculty;