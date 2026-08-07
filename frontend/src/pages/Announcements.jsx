import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeft, ArrowRight, Bell, Calendar, ExternalLink } from 'lucide-react';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/announcements/public')
      .then(r => r.json())
      .then(res => {
        if (res.success) setAnnouncements(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="font-poppins bg-slate-50 text-slate-700 min-h-screen">
      <Header />

      <main>
        <section className="bg-primary pt-32 pb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-300/10 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm font-semibold mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-6 h-6 text-blue-300" />
              <h1 className="text-[clamp(2rem,4vw,3rem)] font-black text-white">News & Announcements</h1>
            </div>
            <p className="text-blue-200 text-sm max-w-[600px]">
              Stay up to date with the latest FYP updates, deadlines, and important notifications from the FYP Office.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse">
                    <div className="h-3 bg-slate-200 rounded w-1/3 mb-4"></div>
                    <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-20">
                <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-500 mb-2">No Announcements Yet</h3>
                <p className="text-slate-400 text-sm">Check back later for updates from the FYP Office.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map(item => (
                  <div key={item._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4 group">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-[0.6rem] font-extrabold text-blue-500 uppercase tracking-[0.15em]">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-[1.3] group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-[1.7] flex-1 whitespace-pre-line">{item.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
