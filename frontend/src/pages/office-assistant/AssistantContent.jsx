import React, { useEffect, useState } from 'react';
import { getOfficeContent } from '../../services/office-assistant.service';
import { showToast } from '../../components/AppToast';
import { ChevronDown, CloudUpload, Download, FileText, Presentation, Trash2, X } from 'lucide-react';

const AssistantContent = () => {
  const [content, setContent] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOfficeContent().then(res => setContent(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleUpload = (e) => {
    e.preventDefault();
    showToast.success('Template uploaded successfully!');
    setIsUploadOpen(false);
  };

  return (
    <>
      <div className="border-b border-line pb-4 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">FYP Content & Template Management</h2>
          <p className="text-xs text-slate-900 mt-0.5 font-medium">Manage official documentation templates, track version history, and upload new releases</p>
        </div>
        <button onClick={() => setIsUploadOpen(true)} className="bg-white hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
          <CloudUpload className="w-4 h-4" /> Upload New Version
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-line shadow-sm p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-line">
                  <div className="w-12 h-12 rounded-xl skeleton" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-5 w-32" />
                    <div className="skeleton h-3 w-20" />
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-3 w-3/4" />
                </div>
                <div className="mb-6 border border-line rounded-xl overflow-hidden">
                  <div className="skeleton h-10 w-full" />
                  <div className="p-3 space-y-2">
                    <div className="skeleton h-3 w-full" />
                    <div className="skeleton h-3 w-2/3" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="skeleton h-10 flex-1 rounded-xl" />
                  <div className="skeleton h-10 w-12 rounded-xl" />
                </div>
              </div>
            ))
          : content.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-line shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-line">
                <div className={`w-12 h-12 rounded-xl text-2xl font-black flex items-center justify-center ${c.id === 'PT' ? 'bg-white' : c.id === 'TT' ? 'bg-blue-50 text-slate-900' : 'bg-white'}`}>
                  {c.id === 'PT' ? <Presentation className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{c.title}</h3>
                  <p className="text-xs text-slate-900 font-bold mt-0.5">Current: {c.currentVersion}</p>
                </div>
              </div>
              <div className="space-y-3 mb-6 text-xs">
                <div className="flex justify-between items-center"><span className="text-slate-900 font-bold">Uploaded Date:</span><span className="font-bold text-slate-900">{c.date}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-900 font-bold">File Size:</span><span className="font-bold text-slate-900">{c.size}</span></div>
              </div>
              
              <div className="mb-6 border border-line rounded-xl overflow-hidden">
                <button className="w-full p-3 bg-white flex justify-between items-center text-xs font-bold text-slate-900 cursor-pointer">
                  <span>Version History</span>
                  <ChevronDown className="text-slate-900" />
                </button>
                <div className="p-3 bg-white divide-y divide-slate-50 text-xs">
                  {c.history.map((h, i) => (
                    <div key={i} className="py-2 flex justify-between items-center">
                      <span className="font-bold text-slate-900">{h.version} ({h.date})</span>
                      <button onClick={() => showToast.success(`Downloading ${h.version}...`)} className="text-slate-900 hover:underline font-bold cursor-pointer">Download</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => showToast.success('Downloading current template...')} className="flex-1 py-2.5 bg-white hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md">
                <Download className="w-4 h-4" /> Download
              </button>
              <button onClick={() => showToast.warning('Template deleted!')} className="px-4 py-2.5 bg-white hover:bg-white text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 bg-blue-600/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-line">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-line">
              <h3 className="text-lg font-bold text-slate-900">Upload Official Template</h3>
              <X className="w-4 h-4 cursor-pointer cursor-pointer text-lg" onClick={() => setIsUploadOpen(false)} />
            </div>
            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Document Category</label>
                <select className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 cursor-pointer" required>
                  <option value="Presentation Template">Presentation Template</option>
                  <option value="Thesis Template">Thesis Template</option>
                  <option value="Report Template">Report Template</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Version Number</label>
                <input type="text" placeholder="e.g. v3.2" className="w-full bg-white border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">Select File</label>
                <input type="file" className="w-full bg-white border border-line rounded-xl px-4 py-2 cursor-pointer text-xs" required />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button type="button" onClick={() => setIsUploadOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 hover:bg-white transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-white hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer">Upload Release</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantContent;
