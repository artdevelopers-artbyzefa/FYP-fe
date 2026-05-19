import React, { useEffect, useState } from 'react';
import { getOfficeContent } from '../../services/office-assistant.service';
import { showToast } from '../../components/AppToast';

const AssistantContent = () => {
  const [content, setContent] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    getOfficeContent().then(res => setContent(res.data)).catch(console.error);
  }, []);

  const handleUpload = (e) => {
    e.preventDefault();
    showToast.success('Template uploaded successfully!');
    setIsUploadOpen(false);
  };

  return (
    <>
      <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-gray-800">FYP Content & Template Management</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Manage official documentation templates, track version history, and upload new releases</p>
        </div>
        <button onClick={() => setIsUploadOpen(true)} className="bg-secondary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer">
          <i className="fas fa-cloud-upload-alt"></i> Upload New Version
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-50">
                <div className={`w-12 h-12 rounded-xl text-2xl font-black flex items-center justify-center ${c.id === 'PT' ? 'bg-red-50 text-red-600' : c.id === 'TT' ? 'bg-blue-50 text-secondary' : 'bg-emerald-50 text-emerald-600'}`}>
                  <i className={`fas ${c.id === 'PT' ? 'fa-file-powerpoint' : c.id === 'TT' ? 'fa-file-word' : 'fa-file-pdf'}`}></i>
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-base">{c.title}</h3>
                  <p className="text-xs text-gray-400 font-bold mt-0.5">Current: {c.currentVersion}</p>
                </div>
              </div>
              <div className="space-y-3 mb-6 text-xs">
                <div className="flex justify-between items-center"><span className="text-gray-500 font-bold">Uploaded Date:</span><span className="font-bold text-gray-800">{c.date}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-500 font-bold">File Size:</span><span className="font-bold text-gray-800">{c.size}</span></div>
              </div>
              
              <div className="mb-6 border border-gray-100 rounded-xl overflow-hidden">
                <button className="w-full p-3 bg-gray-50 flex justify-between items-center text-xs font-bold text-gray-700 cursor-pointer">
                  <span>Version History</span>
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </button>
                <div className="p-3 bg-white divide-y divide-gray-50 text-xs">
                  {c.history.map((h, i) => (
                    <div key={i} className="py-2 flex justify-between items-center">
                      <span className="font-bold text-gray-600">{h.version} ({h.date})</span>
                      <button onClick={() => showToast.success(`Downloading ${h.version}...`)} className="text-secondary hover:underline font-bold cursor-pointer">Download</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => showToast.success('Downloading current template...')} className="flex-1 py-2.5 bg-secondary hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-blue-600/20">
                <i className="fas fa-download"></i> Download
              </button>
              <button onClick={() => showToast.warning('Template deleted!')} className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all cursor-pointer">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-50">
              <h3 className="text-lg font-black text-gray-900">Upload Official Template</h3>
              <i className="fas fa-times text-gray-400 hover:text-gray-600 cursor-pointer text-lg" onClick={() => setIsUploadOpen(false)}></i>
            </div>
            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Document Category</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 outline-none focus:border-secondary cursor-pointer" required>
                  <option value="Presentation Template">Presentation Template</option>
                  <option value="Thesis Template">Thesis Template</option>
                  <option value="Report Template">Report Template</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Version Number</label>
                <input type="text" placeholder="e.g. v3.2" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-secondary focus:bg-white transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Select File</label>
                <input type="file" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 cursor-pointer text-xs" required />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button type="button" onClick={() => setIsUploadOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-secondary hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all cursor-pointer">Upload Release</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantContent;
