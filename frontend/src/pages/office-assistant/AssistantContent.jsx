import React, { useEffect, useState } from 'react';
import { getOfficeContent } from '../../services/office-assistant.service';
import { showToast } from '../../components/AppToast';
import { ChevronDown, CloudUpload, Download, FileText, Presentation, Trash2, X } from 'lucide-react';

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
      <div className="border-b border-black pb-4 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-black">FYP Content & Template Management</h2>
          <p className="text-xs text-black mt-0.5 font-medium">Manage official documentation templates, track version history, and upload new releases</p>
        </div>
        <button onClick={() => setIsUploadOpen(true)} className="bg-white hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer">
          <CloudUpload className="w-4 h-4" /> Upload New Version
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-black shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-black">
                <div className={`w-12 h-12 rounded-xl text-2xl font-black flex items-center justify-center ${c.id === 'PT' ? 'bg-white' : c.id === 'TT' ? 'bg-blue-50 text-black' : 'bg-white'}`}>
                  {c.id === 'PT' ? <Presentation className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-black text-black text-base">{c.title}</h3>
                  <p className="text-xs text-black font-bold mt-0.5">Current: {c.currentVersion}</p>
                </div>
              </div>
              <div className="space-y-3 mb-6 text-xs">
                <div className="flex justify-between items-center"><span className="text-black font-bold">Uploaded Date:</span><span className="font-bold text-black">{c.date}</span></div>
                <div className="flex justify-between items-center"><span className="text-black font-bold">File Size:</span><span className="font-bold text-black">{c.size}</span></div>
              </div>
              
              <div className="mb-6 border border-black rounded-xl overflow-hidden">
                <button className="w-full p-3 bg-white flex justify-between items-center text-xs font-bold text-black cursor-pointer">
                  <span>Version History</span>
                  <ChevronDown className="text-black" />
                </button>
                <div className="p-3 bg-white divide-y divide-blue-600 text-xs">
                  {c.history.map((h, i) => (
                    <div key={i} className="py-2 flex justify-between items-center">
                      <span className="font-bold text-black">{h.version} ({h.date})</span>
                      <button onClick={() => showToast.success(`Downloading ${h.version}...`)} className="text-black hover:underline font-bold cursor-pointer">Download</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => showToast.success('Downloading current template...')} className="flex-1 py-2.5 bg-white hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md">
                <Download className="w-4 h-4" /> Download
              </button>
              <button onClick={() => showToast.warning('Template deleted!')} className="px-4 py-2.5 bg-white hover:bg-white text-black rounded-xl text-xs font-bold transition-all cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 bg-blue-600/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-black">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-black">
              <h3 className="text-lg font-black text-black">Upload Official Template</h3>
              <X className="w-4 h-4 cursor-pointer cursor-pointer text-lg" onClick={() => setIsUploadOpen(false)} />
            </div>
            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Document Category</label>
                <select className="w-full bg-white border border-black rounded-xl px-4 py-2.5 text-sm font-bold text-black outline-none focus:border-black cursor-pointer" required>
                  <option value="Presentation Template">Presentation Template</option>
                  <option value="Thesis Template">Thesis Template</option>
                  <option value="Report Template">Report Template</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Version Number</label>
                <input type="text" placeholder="e.g. v3.2" className="w-full bg-white border border-black rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black focus:bg-white transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-black mb-1.5">Select File</label>
                <input type="file" className="w-full bg-white border border-black rounded-xl px-4 py-2 cursor-pointer text-xs" required />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-black">
                <button type="button" onClick={() => setIsUploadOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-bold text-black hover:bg-white transition-colors cursor-pointer">Cancel</button>
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
