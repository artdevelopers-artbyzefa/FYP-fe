import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Video } from 'lucide-react';

const VideoManager = () => {
    const [videos, setVideos] = useState([]);
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    const fetchVideos = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/videos', { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.success) setVideos(data.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchVideos(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!title || !videoUrl) return;
        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ title, videoUrl, description })
            });
            setTitle('');
            setVideoUrl('');
            setDescription('');
            fetchVideos();
        } catch (e) { console.error(e); }
        setUploading(false);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/videos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
            fetchVideos();
        } catch (e) { console.error(e); }
    };

    const getEmbedUrl = (url) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    };

    return (
        <div className="p-6 bg-white rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Video Gallery</h3>

            <form onSubmit={handleAdd} className="mb-6 space-y-3">
                <input
                    type="text"
                    placeholder="Video Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <input
                    type="text"
                    placeholder="YouTube / Video URL"
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows="2"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
                <button type="submit" disabled={uploading || !title || !videoUrl}
                    className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" /> {uploading ? 'Adding...' : 'Add Video'}
                </button>
            </form>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {videos.map((v) => (
                    <div key={v._id} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center">
                            {v.videoUrl.includes('youtube') || v.videoUrl.includes('youtu.be') ? (
                                <img src={`https://img.youtube.com/vi/${v.videoUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1] || ''}/mqdefault.jpg`} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <Video className="w-6 h-6 text-slate-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{v.title}</p>
                            <p className="text-xs text-slate-400 truncate">{v.description || 'No description'}</p>
                        </div>
                        <button onClick={() => handleDelete(v._id)}
                            className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors self-start">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {videos.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-8">No videos yet. Add one above.</p>
                )}
            </div>
        </div>
    );
};

export default VideoManager;
