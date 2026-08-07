import React, { useState } from 'react';
import { Megaphone, Image } from 'lucide-react';
import AnnouncementManager from '../../components/AnnouncementManager';
import HeroSlideManager from '../../components/HeroSlideManager';

const ContentManagement = () => {
    const [tab, setTab] = useState('announcements');

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Megaphone className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Content Management</h2>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">Manage announcements and hero carousel slides.</p>
                </div>
            </div>

            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
                <button onClick={() => setTab('announcements')}
                    className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'announcements' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Megaphone className="w-4 h-4 inline mr-1.5" />Announcements
                </button>
                <button onClick={() => setTab('slides')}
                    className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'slides' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Image className="w-4 h-4 inline mr-1.5" />Hero Slides
                </button>
            </div>

            <div>
                {tab === 'announcements' ? <AnnouncementManager /> : <HeroSlideManager />}
            </div>
        </div>
    );
};

export default ContentManagement;
