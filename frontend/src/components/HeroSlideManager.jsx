import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Star, StarOff, Image } from 'lucide-react';

const HeroSlideManager = () => {
    const [slides, setSlides] = useState([]);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [caption, setCaption] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef();

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchSlides = async () => {
        try {
            const res = await fetch('/api/hero', { headers });
            const data = await res.json();
            if (data.success) setSlides(data.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchSlides(); }, []);

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const uploadRes = await fetch('/api/upload?folder=hero', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
            const uploadData = await uploadRes.json();
            if (!uploadData.success) throw new Error('Upload failed');

            await fetch('/api/hero', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ imageUrl: uploadData.data.url, caption, order: slides.length })
            });
            setFile(null); setPreview(''); setCaption('');
            fetchSlides();
        } catch (e) { console.error(e); }
        setUploading(false);
    };

    const handleDelete = async (id) => {
        await fetch(`/api/hero/${id}`, { method: 'DELETE', headers });
        fetchSlides();
    };

    const handleToggle = async (id, current) => {
        await fetch(`/api/hero/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ isActive: !current })
        });
        fetchSlides();
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Image className="w-5 h-5 text-blue-600" />
                    Hero Slides
                </h3>
            </div>
            <div className="p-6 space-y-6">
                <form onSubmit={handleAdd} className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                    <div className="flex items-center gap-2 mb-4">
                        <Upload className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-bold text-slate-800">Add New Slide</span>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-slate-300 bg-white cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                                <Upload className="w-5 h-5 text-slate-400" />
                                <span className="text-sm text-slate-500 font-medium">{file ? file.name : 'Choose image file'}</span>
                                <input type="file" ref={fileRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            </label>
                            {preview && (
                                <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                    <img src={preview} alt="Preview" className="max-h-32 object-contain mx-auto" />
                                </div>
                            )}
                        </div>
                        <input type="text" placeholder="Caption (optional)" value={caption} onChange={e => setCaption(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 bg-white" />
                        <button type="submit" disabled={uploading || !file}
                            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                            <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Add Slide'}
                        </button>
                    </div>
                </form>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {slides.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <Image className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm font-medium text-slate-400">No slides</p>
                        </div>
                    ) : (
                        slides.map((slide) => (
                            <div key={slide._id} className="group flex items-center gap-4 p-3 rounded-xl bg-white border border-slate-100 hover:border-blue-200 transition-all">
                                <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center">
                                    {slide.imageUrl.startsWith('/uploads/') ? (
                                        <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{slide.caption || <span className="text-slate-400 italic">No caption</span>}</p>
                                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{slide.imageUrl}</p>
                                </div>
                                <button onClick={() => handleToggle(slide._id, slide.isActive)}
                                    className={`p-2 rounded-lg transition-colors shrink-0 ${slide.isActive ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-300 hover:bg-slate-100'}`}
                                    title={slide.isActive ? 'Active' : 'Inactive'}>
                                    {slide.isActive ? <Star className="w-4 h-4 fill-amber-500" /> : <StarOff className="w-4 h-4" />}
                                </button>
                                <button onClick={() => handleDelete(slide._id)}
                                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors shrink-0 opacity-0 group-hover:opacity-100" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeroSlideManager;
