import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Eye, EyeOff, Loader, User, GraduationCap,
  Calendar, Mail, Hash, Award, Users, FileText, BookOpen,
  ChevronDown, ChevronUp, ExternalLink, AlertCircle, CheckCircle,
  Shield, Database, RefreshCw, IdCard, Clock, BarChart3
} from 'lucide-react';
import axios from 'axios';
import { setAccessToken, setUserInfo } from '../utils/app.utils';

const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';

const sisRequest = (url, data) => axios.post(`${apiBase}${url}`, data, {
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' },
});

const SESSION_OPTIONS = [
  'FA01','FA02','FA03','FA04','FA05','FA06','FA07','FA08','FA09','FA10',
  'FA11','FA12','FA13','FA14','FA15','FA16','FA17','FA18','FA19','FA20',
  'FA21','FA22','FA23','FA24','FA25',
  'SP02','SP03','SP04','SP05','SP06','SP07','SP08','SP09','SP10',
  'SP11','SP12','SP13','SP14','SP15','SP16','SP17','SP18','SP19','SP20',
  'SP21','SP22','SP23','SP24','SP25','SP26',
];

const PROGRAM_OPTIONS = ['BCS', 'BSE'];

export default function StudentPortal() {
  const navigate = useNavigate();
  const [rollPart1, setRollPart1] = useState('FA23');
  const [rollPart2, setRollPart2] = useState('BCS');
  const [rollPart3, setRollPart3] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [showCourses, setShowCourses] = useState(false);
  const [showCurrentCourses, setShowCurrentCourses] = useState(false);
  const [showSemesters, setShowSemesters] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [studentData?.profilePicture]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setStudentData(null);

    if (!rollPart1 || !rollPart2 || !rollPart3.trim()) {
      setError('Please fill in all roll number fields');
      return;
    }
    if (!password) {
      setError('Please enter your SIS password');
      return;
    }

    const rollNumber = `${rollPart1.toUpperCase()}-${rollPart2.toUpperCase()}-${rollPart3.trim()}`;

    setLoading(true);
    try {
      const response = await sisRequest('/sis/login', { rollNumber, password });
      setStudentData(response.data.data);
      setSuccess('SIS login successful!');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!studentData) return;
    setLoading(true);
    setError('');
    try {
      const rollNumber = `${rollPart1.toUpperCase()}-${rollPart2.toUpperCase()}-${rollPart3.trim()}`;
      const response = await sisRequest('/sis/sync', { rollNumber, password });
      const data = response.data;
      if (data.token) setAccessToken(data.token);
      if (data.user) setUserInfo(data.user);
      setSuccess(data.message || 'Profile synced!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setStudentData(null);
    setRollPart3('');
    setPassword('');
    setError('');
    setSuccess('');
  };

  if (studentData) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins">
        {/* Syncing Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center">
              <div className="w-20 h-20 mx-auto mb-5 relative">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full animate-ping"></div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Fetching Your Details</h3>
              <p className="text-sm text-slate-500 mb-4">Syncing your data from the official student portal...</p>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
              <p className="text-xs text-slate-400">This may take a moment</p>
            </div>
          </div>
        )}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/cuilogo.png" alt="CUI" className="h-8 w-auto" />
              <div>
                <h1 className="text-sm font-bold text-[#1e3a8a]">CUI Abbottabad</h1>
                <p className="text-[9px] font-semibold text-gray-400 uppercase">Student Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!studentData._synced && (
                <button onClick={handleSync} disabled={loading}
                  className="h-9 px-4 text-xs font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 flex items-center gap-1.5">
                  {loading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                  Sync to FYP
                </button>
              )}
              <button onClick={handleLogout}
                className="h-9 px-4 text-xs font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {success && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-emerald-700">{success}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1e3a8a] via-[#1e3a8a] to-blue-700 px-6 py-8 relative overflow-hidden">
              <div className="relative z-10 flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white text-3xl font-black border-2 border-white/30 overflow-hidden">
                  {studentData.profilePicture && !imgError ? (
                    <img src={studentData.profilePicture} alt={studentData.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
                  ) : (
                    studentData.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST'
                  )}
                </div>
                <div className="text-white">
                  <h2 className="text-xl font-bold">{studentData.name || 'Student'}</h2>
                  <p className="text-sm text-blue-200 font-medium">{studentData.regNo || `${rollPart1}-${rollPart2}-${rollPart3}`}</p>
                  <p className="text-xs text-blue-300 mt-1">{studentData.campus || ''}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-gray-100 border-b border-gray-100">
              {[
                ['CGPA', studentData.cgpa != null ? studentData.cgpa.toFixed(2) : 'N/A'],
                ['Program', studentData.degree || 'N/A'],
                ['Courses Done', studentData.courses?.length || 0],
                ['Current Sem', studentData.currentCourses?.length || 0],
                ['Session', studentData.session || 'N/A'],
              ].map(([l, v]) => (
                <div key={l} className="py-4 px-4 text-center">
                  <p className="text-lg font-black text-gray-800">{v}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{l}</p>
                </div>
              ))}
            </div>

            <div className="p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Info icon={<User />} label="Full Name" value={studentData.name} />
                <Info icon={<Hash />} label="Registration No" value={studentData.regNo} />
                <Info icon={<GraduationCap />} label="Program" value={studentData.degree || 'BS CS'} />
                <Info icon={<BookOpen />} label="Session" value={studentData.session} />
                <Info icon={<Award />} label="CGPA" value={studentData.cgpa != null ? studentData.cgpa.toFixed(2) : 'N/A'} />
                <Info icon={<Calendar />} label="Campus" value={studentData.campus} />
                <Info icon={<FileText />} label="Registered Courses" value={`${studentData.registeredCourses || 0} / ${studentData.totalCourses || 0}`} />
                <Info icon={<Mail />} label="Email" value={studentData.email} />
              </div>
            </div>
          </div>

          {studentData.currentCourses?.length > 0 && (
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <button onClick={() => setShowCurrentCourses(!showCurrentCourses)}
                className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#1e3a8a] to-blue-700 text-white">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold text-sm">Current Courses & Attendance ({studentData.currentCourses.length})</span>
                </div>
                {showCurrentCourses ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showCurrentCourses && (
                <div className="p-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-100">
                        <th className="text-left py-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">#</th>
                        <th className="text-left py-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Course</th>
                        <th className="text-left py-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Class</th>
                        <th className="text-left py-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Faculty</th>
                        <th className="text-center py-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</th>
                        <th className="text-center py-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Present</th>
                        <th className="text-center py-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Absent</th>
                        <th className="text-center py-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Theory %</th>
                        <th className="text-center py-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lab %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentData.currentCourses.map((c, i) => (
                        <tr key={i} className={`border-b border-gray-50 hover:bg-blue-50/30 ${i % 2 === 0 ? 'bg-gray-50/30' : ''}`}>
                          <td className="py-3 px-3 text-xs font-semibold text-gray-500">{c.srNo}</td>
                          <td className="py-3 px-3 text-xs font-bold text-gray-800">{c.title}</td>
                          <td className="py-3 px-3 text-xs text-gray-600">{c.class}</td>
                          <td className="py-3 px-3 text-xs text-gray-600">{c.faculty}</td>
                          <td className="py-3 px-3 text-xs text-center font-semibold text-gray-700">{c.lectures}</td>
                          <td className="py-3 px-3 text-xs text-center font-semibold text-green-600">{c.present}</td>
                          <td className="py-3 px-3 text-xs text-center font-semibold text-red-500">{c.absent}</td>
                          <td className="py-3 px-3 text-xs text-center font-bold">{c.theoryPercent}</td>
                          <td className="py-3 px-3 text-xs text-center font-bold">{c.labPercent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {studentData.semesters?.length > 0 && (
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <button onClick={() => setShowSemesters(!showSemesters)}
                className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#1e3a8a] to-blue-700 text-white">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-bold text-sm">Semester GPA History ({studentData.semesters.length})</span>
                </div>
                {showSemesters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showSemesters && (
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
                    {studentData.semesters.map((sem, i) => (
                      <div key={i} className={`p-4 rounded-xl border ${sem.gpa === 0 ? 'bg-gray-50 border-gray-200' : 'bg-blue-50/50 border-blue-200'}`}>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{sem.semester}</p>
                        <p className={`text-xl font-black mt-1 ${sem.gpa === 0 ? 'text-gray-400' : sem.gpa >= 3 ? 'text-green-600' : sem.gpa >= 2.5 ? 'text-yellow-600' : 'text-red-500'}`}>
                          {sem.gpa > 0 ? sem.gpa.toFixed(2) : 'In Progress'}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{sem.totalCredits} Credits</p>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Per-Semester Course Details</h4>
                  {studentData.semesters.map((sem, si) => (
                    <div key={si} className="mb-4 last:mb-0">
                      <p className="text-xs font-bold text-gray-700 mb-2 bg-gray-50 px-3 py-2 rounded-lg">{sem.semester} - GPA: {sem.gpa > 0 ? sem.gpa.toFixed(2) : 'In Progress'}</p>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-gray-100">
                            <th className="text-left py-2 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Code</th>
                            <th className="text-left py-2 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Course</th>
                            <th className="text-center py-2 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cr</th>
                            <th className="text-center py-2 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Marks</th>
                            <th className="text-center py-2 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Grade</th>
                            <th className="text-center py-2 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">GP</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sem.courses.map((c, ci) => (
                            <tr key={ci} className="border-b border-gray-50">
                              <td className="py-2 px-3 text-xs font-semibold text-gray-600">{c.courseNo}</td>
                              <td className="py-2 px-3 text-xs text-gray-800">{c.title}</td>
                              <td className="py-2 px-3 text-xs text-center text-gray-600">{c.credit}</td>
                              <td className="py-2 px-3 text-xs text-center font-semibold text-gray-700">{c.marks || '-'}</td>
                              <td className="py-2 px-3 text-xs text-center font-bold">{c.grade || '-'}</td>
                              <td className="py-2 px-3 text-xs text-center font-semibold">{c.gradePoints || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {studentData.courses?.length > 0 && (
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <button onClick={() => setShowCourses(!showCourses)}
                className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#1e3a8a] to-blue-700 text-white">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span className="font-bold text-sm">All Courses ({studentData.courses.length})</span>
                </div>
                {showCourses ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showCourses && (
                <div className="p-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-100">
                        {Object.keys(studentData.courses[0]).map((key, i) => (
                          <th key={i} className="text-left py-3 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {studentData.courses.map((course, i) => (
                        <tr key={i} className={`border-b border-gray-50 hover:bg-blue-50/30 ${i % 2 === 0 ? 'bg-gray-50/30' : ''}`}>
                          {Object.values(course).map((val, j) => (
                            <td key={j} className="py-3 px-3 text-xs font-semibold text-gray-700">{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1d4a] via-[#1e3a8a] to-[#1e40af] font-poppins flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        <div className="text-center mb-8">
          <img src="/cuilogo.png" alt="CUI" className="h-16 w-auto mx-auto mb-4 brightness-0 invert" />
          <h1 className="text-2xl font-black text-white tracking-tight">CUI Abbottabad</h1>
          <p className="text-sm text-blue-200 font-medium">Student Information Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-8 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[#1e3a8a]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#1e3a8a]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Sign In</h2>
                <p className="text-[11px] text-gray-500">Use your SIS credentials</p>
              </div>
            </div>
          </div>

          <div className="px-8 pb-8">
            {error && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Roll Number</label>
                <div className="flex items-center gap-2">
                  <select value={rollPart1} onChange={(e) => setRollPart1(e.target.value)}
                    className="flex-[1.2] bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-xs font-bold text-gray-800 outline-none focus:border-[#1e3a8a] focus:bg-white focus:ring-2 focus:ring-[#1e3a8a]/10 transition-all cursor-pointer appearance-none">
                    {SESSION_OPTIONS.filter(o => /^(FA|SP)\d{2}$/i.test(o)).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <span className="text-gray-300 font-black text-lg shrink-0">-</span>
                  <select value={rollPart2} onChange={(e) => setRollPart2(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-xs font-bold text-gray-800 outline-none focus:border-[#1e3a8a] focus:bg-white focus:ring-2 focus:ring-[#1e3a8a]/10 transition-all cursor-pointer appearance-none">
                    {PROGRAM_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <span className="text-gray-300 font-black text-lg shrink-0">-</span>
                  <input type="text" placeholder="013" value={rollPart3}
                    onChange={(e) => setRollPart3(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                    className="flex-[0.7] bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm font-bold text-gray-800 text-center outline-none focus:border-[#1e3a8a] focus:bg-white focus:ring-2 focus:ring-[#1e3a8a]/10 transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <IdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Enter your SIS password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-[#1e3a8a] focus:bg-white focus:ring-2 focus:ring-[#1e3a8a]/10 transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-[#1e3a8a] to-blue-700 text-white rounded-xl py-3.5 font-bold text-sm hover:from-blue-800 hover:to-blue-800 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-[#1e3a8a]/25">
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>{loading ? 'Logging in...' : 'Sign In'}</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <Link to="/login" className="text-[11px] font-bold text-gray-400 hover:text-[#1e3a8a] transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> FYP Portal
              </Link>
              <a href="https://sis.cuiatd.edu.pk" target="_blank" rel="noopener noreferrer"
                className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> sis.cuiatd.edu.pk
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
      <div className="w-8 h-8 rounded-lg bg-[#1e3a8a]/10 flex items-center justify-center text-[#1e3a8a] shrink-0">
        {React.cloneElement(icon, { className: 'w-4 h-4' })}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-800 truncate">{value || 'N/A'}</p>
      </div>
    </div>
  );
}
