import React, { useEffect, useState } from 'react';
import { getFacultyMessages } from '../../services/faculty.service';
import { showToast } from '../../components/AppToast';
import { MoreVertical, Send } from 'lucide-react';
import { motion } from 'framer-motion';
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const FacultyMessaging = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacultyMessages().then(res => setMessages(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages([...messages, {
      sender: 'Dr. Ali Hassan (You)',
      text: newMessage,
      time: 'Just now'
    }]);
    setNewMessage('');
    showToast.success('Message sent to Group G-042');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="border-b border-line pb-4 mb-6">
          <div className="skeleton h-7 w-56 rounded-md" />
          <div className="skeleton h-4 w-80 rounded-md mt-2" />
        </div>
        <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
          <div className="w-full lg:w-80 bg-white rounded-2xl border border-line shadow-card flex flex-col overflow-hidden flex-shrink-0">
            <div className="p-4 border-b border-line bg-slate-50"><div className="skeleton h-5 w-24 rounded-md" /></div>
            <div className="flex-1 overflow-y-auto divide-y divide-line">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="skeleton h-4 w-28 rounded-md" />
                    <div className="skeleton h-3 w-14 rounded-md" />
                  </div>
                  <div className="skeleton h-3 w-full rounded-md mt-2" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-white rounded-2xl border border-line shadow-card flex flex-col overflow-hidden">
            <div className="p-4 border-b border-line bg-white">
              <div className="skeleton h-5 w-28 rounded-md" />
              <div className="skeleton h-3 w-40 rounded-md mt-1.5" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className={`flex gap-3 items-start ${i % 2 === 0 ? 'flex-row-reverse' : ''} animate-pulse`}>
                  <div className="skeleton h-8 w-8 rounded-xl flex-shrink-0" />
                  <div className={`p-4 rounded-2xl ${i % 2 === 0 ? 'w-64' : 'w-72'}`}>
                    <div className="skeleton h-3 w-20 rounded-md mb-1" />
                    <div className="skeleton h-3 w-full rounded-md mt-1" />
                    <div className="skeleton h-3 w-16 rounded-md mt-2 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-line bg-white">
              <div className="flex gap-2">
                <div className="skeleton h-12 flex-1 rounded-xl" />
                <div className="skeleton h-12 w-12 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="border-b border-line pb-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Student Group Messaging</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">Direct communication channel with your supervised project groups</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
        {/* Contacts Sidebar */}
        <motion.div variants={item} className="w-full lg:w-80 bg-white rounded-2xl border border-line shadow-card flex flex-col overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-line bg-slate-50 font-semibold text-sm text-slate-900">Your Groups</div>
          <div className="flex-1 overflow-y-auto divide-y divide-line">
            <div className="p-4 hover:bg-blue-50 cursor-pointer transition-colors bg-blue-50/30 border-l-4 border-blue-600">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-slate-900 text-sm">Group G-042</span>
                <span className="text-[10px] text-slate-400 font-semibold">10:30 AM</span>
              </div>
              <p className="text-xs text-slate-500 truncate">Sir, we have uploaded the revised...</p>
            </div>
            <div className="p-4 hover:bg-blue-50 cursor-pointer transition-colors border-l-4 border-transparent">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-slate-900 text-sm">Group G-019</span>
                <span className="text-[10px] text-slate-400 font-semibold">Yesterday</span>
              </div>
              <p className="text-xs text-slate-500 truncate">Meeting confirmed for tomorrow.</p>
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div variants={item} className="flex-1 bg-white rounded-2xl border border-line shadow-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-line bg-white flex justify-between items-center">
            <div>
              <div className="font-semibold text-slate-900 text-sm">Group G-042</div>
              <div className="text-[11px] text-slate-500">Ahmed Farooq, Sana Mehmood</div>
            </div>
            <button className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"><MoreVertical size={16} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50 flex flex-col" id="chatMessages">
            <div className="text-center text-[10px] font-semibold text-slate-400 tracking-widest my-4">Today, May 19</div>
            
            {messages.map((msg, idx) => {
              const isYou = msg.sender.includes('You');
              return (
                <div key={idx} className={`flex gap-3 items-start ${isYou ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-semibold text-xs flex-shrink-0 ${isYou ? 'bg-btn text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {isYou ? 'AH' : 'G'}
                  </div>
                  <div className={`p-4 rounded-2xl max-w-md ${isYou ? 'bg-btn text-white' : 'bg-white border border-line text-slate-700 shadow-sm'}`}>
                    <span className={`font-semibold text-xs block mb-1 ${isYou ? 'text-white' : 'text-slate-900'}`}>{msg.sender}</span>
                    <p className={`text-xs leading-relaxed ${isYou ? 'text-white/90' : 'text-slate-500'}`}>{msg.text}</p>
                    <span className={`text-[10px] mt-2 block font-semibold ${isYou ? 'text-white/60 text-right' : 'text-slate-400 text-right'}`}>{msg.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-line bg-white">
            <form onSubmit={handleSend} className="flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message here..." 
                className="flex-1 bg-white border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
              />
              <button type="submit" className="bg-btn text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-btn-hover transition-all shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500">
                <Send size={16} />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FacultyMessaging;
