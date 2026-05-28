import React, { useEffect, useState, useCallback } from 'react';
import { getOfficeStudents, createOfficeStudent } from '../../services/office-assistant.service';
import { showToast } from '../../components/AppToast';
import { sendWelcomeEmail } from '../../services/email.service';
import { Search, UserPlus, X, Send } from 'lucide-react';

const initialForm = { name: '', reg: '', email: '', semester: '7', fatherName: '', whatsappNumber: '', section: '', cgpa: '' };

const validateForm = (form) => {
  const e = {};
  if (!form.name.trim()) e.name = 'Full name is required';
  if (!form.reg.trim()) e.reg = 'Registration number is required';
  if (!form.email.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
  else if (!form.email.toLowerCase().endsWith('@cuiatd.edu.pk')) e.email = 'Must be @cuiatd.edu.pk';
  if (form.cgpa && (parseFloat(form.cgpa) < 0 || parseFloat(form.cgpa) > 4.0)) e.cgpa = 'CGPA must be between 0.0 and 4.0';
  return e;
};

const AssistantStudents = () => {
  const [students, setStudents] = useState([]);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const loadStudents = useCallback(() => {
    getOfficeStudents().then(res => {
      const data = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
      setStudents(data);
    }).catch(console.error);
  }, []);

  useEffect(() => { loadStudents(); }, [loadStudents]);

  const normalizeRegNumber = (input) => {
    let val = input.trim();
    if (!val) return '';
    val = val.replace(/^CIIT\//i, '').replace(/\/ATD$/i, '');
    const match = val.match(/^([a-z]{2}\d{2})-([a-z]{2,4})-(\d{1,3})$/i);
    if (match) {
      const session = match[1].toUpperCase();
      const program = match[2].toUpperCase();
      const number = match[3].padStart(3, '0');
      return `CIIT/${session}-${program}-${number}/ATD`;
    }
    return `CIIT/${val.toUpperCase()}/ATD`;
  };

  const handleRegBlur = (e) => {
    const normalized = normalizeRegNumber(e.target.value);
    if (normalized) setForm(f => ({ ...f, reg: normalized }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      await createOfficeStudent({
        name: form.name.trim(),
        regNo: form.reg,
        email: form.email.trim(),
        semester: form.semester,
        fatherName: form.fatherName.trim(),
        whatsappNumber: form.whatsappNumber.trim(),
        section: form.section.trim().toUpperCase(),
        cgpa: form.cgpa || undefined
      });
      showToast.success('Student onboarded successfully!');
      sendWelcomeEmail({
        name: form.name.trim(),
        email: form.email.trim(),
        regNo: form.reg,
      }).then(res => {
        if (res.success) {
          showToast.success('Welcome email sent to student.');
        } else {
          showToast.error('Student created but welcome email failed to send.');
        }
      });
      setShowForm(false);
      setForm(initialForm);
      loadStudents();
    } catch (err) {
      showToast.error(err?.response?.data?.message || 'Failed to create student.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    showToast.success('Bulk message sent successfully!');
    setIsBulkOpen(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-800 tracking-tight uppercase">Student Management</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Search registration numbers, filter by FYP status, onboard new students, and dispatch bulk milestone messages</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (showForm) { setForm(initialForm); setErrors({}); }
              setShowForm(!showForm);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${showForm ? 'bg-gray-50 text-gray-600 border border-gray-200' : 'bg-primary text-white border-0 hover:bg-navy-dark'}`}
          >
            <UserPlus className="w-4 h-4" /> {showForm ? 'Close' : 'Add Student'}
          </button>
          <button onClick={() => setIsBulkOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer shadow-sm">
            <Send className="w-4 h-4" /> Bulk Message
          </button>
        </div>
      </div>

      {/* Inline Add Student Form */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showForm ? 'max-h-[800px] opacity-100 mb-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-inner">
          <div className="flex items-center gap-3 sm:gap-4 mb-6">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-800 uppercase tracking-tight">Manual Registration</h3>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Pre-filling eligibility data for FYP cycle</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Full Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Student's Legal Name" className={`w-full bg-white border ${errors.name ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`} />
                {errors.name && <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-wider">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Registration Number *</label>
                <input type="text" value={form.reg} onChange={e => setForm(f => ({ ...f, reg: e.target.value }))} onBlur={handleRegBlur} placeholder="FA21-BCS-001" className={`w-full bg-white border ${errors.reg ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-mono`} />
                {errors.reg && <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-wider">{errors.reg}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Institutional Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="name@cuiatd.edu.pk" className={`w-full bg-white border ${errors.email ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`} />
                {errors.email && <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-wider">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Current Semester</label>
                <select value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer">
                  {['1', '2', '3', '4', '5', '6', '7', '8'].map(s => <option key={s} value={s}>Sem {s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Father's Name</label>
                <input type="text" value={form.fatherName} onChange={e => setForm(f => ({ ...f, fatherName: e.target.value }))} placeholder="Parent/Guardian Name" className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">WhatsApp Number</label>
                <input type="text" value={form.whatsappNumber} onChange={e => setForm(f => ({ ...f, whatsappNumber: e.target.value }))} placeholder="03XXXXXXXXX" className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Section (A/B/C/D)</label>
                <input type="text" value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))} placeholder="e.g. A" className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 tracking-widest">Current CGPA</label>
                <input type="text" inputMode="decimal" autoCapitalize="none" value={form.cgpa} onChange={e => setForm(f => ({ ...f, cgpa: e.target.value }))} placeholder="e.g. 3.25" className={`w-full bg-white border ${errors.cgpa ? 'border-rose-300' : 'border-gray-100'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`} />
                {errors.cgpa && <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-wider">{errors.cgpa}</p>}
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-200/50">
              <button type="submit" disabled={submitting} className="px-10 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-navy-dark hover:shadow-xl hover:shadow-primary/30 transition-all cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {submitting ? 'Processing...' : 'Complete Enrollment'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search student name or reg no..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">FYP Status:</span>
          <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer">
            <option value="">All Statuses</option>
            <option value="No Project">No Project</option>
            <option value="FYP-1">FYP-1</option>
            <option value="FYP-2">FYP-2</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                <th className="py-3.5 px-6 w-12"><input type="checkbox" className="accent-primary cursor-pointer" /></th>
                <th className="py-3.5 px-6">Student Name</th>
                <th className="py-3.5 px-6">Registration Number</th>
                <th className="py-3.5 px-6">FYP Status</th>
                <th className="py-3.5 px-6">Assigned Project</th>
                <th className="py-3.5 px-6 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
              {students.map(s => (
                <tr key={s.id || s._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6"><input type="checkbox" className="accent-primary cursor-pointer" /></td>
                  <td className="py-4 px-6 font-bold text-gray-800">{s.name}</td>
                  <td className="py-4 px-6 text-gray-500 font-mono">{s.id || s.regNo}</td>
                  <td className="py-4 px-6">
                    <span className={`font-bold text-xs px-2.5 py-1 rounded-lg border uppercase tracking-wider ${
                      s.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : s.status?.includes('FYP-2') ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : s.status?.includes('FYP-1') ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}>{s.status || 'Not Started'}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 truncate max-w-xs">{s.project || 'Not assigned'}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 border border-gray-200 text-xs font-bold transition-all hover:bg-gray-100 cursor-pointer uppercase tracking-wider">View Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Message Modal */}
      {isBulkOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 uppercase tracking-tight">Compose Bulk Message</h3>
              <button onClick={() => setIsBulkOpen(false)} className="w-8 h-8 rounded-lg bg-gray-50 border-0 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleBulkSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Selected Recipients</label>
                <input type="text" readOnly className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-500 outline-none" value="All Students Selected" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Message Subject</label>
                <input type="text" placeholder="e.g. Urgent: FYP Milestone Deliverable Reminder" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Message Body</label>
                <textarea placeholder="Compose your official dispatch here..." className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all h-32" required></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsBulkOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer border-0 uppercase tracking-wider">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-navy-dark transition-all cursor-pointer border-0 flex items-center gap-2"><Send className="w-4 h-4" /> Send Broadcast</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantStudents;
