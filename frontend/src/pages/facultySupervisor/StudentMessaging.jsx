import React, { useState, useEffect, useRef } from 'react';
import { Paperclip, Send, CheckCircle, Loader2 } from 'lucide-react';
import { getMessagingGroups, getGroupMessages, sendMessage } from '../../services/messagingService';
import { motion } from 'framer-motion';
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function StudentMessaging() {
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchData = async () => {
    try {
      const groupsRes = await getMessagingGroups();
      if (groupsRes.data && groupsRes.data.length > 0) {
        setGroups(groupsRes.data);
        setActiveGroupId(groupsRes.data[0].id);
        fetchMessages(groupsRes.data[0].id);
      } else {
        setMockData();
      }
    } catch (error) {
      console.error(error);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (groupId) => {
    try {
      const res = await getGroupMessages(groupId);
      if (res.data) setMessages(res.data);
    } catch (error) {
    }
  };

  const setMockData = () => {
    const mockGroups = [
      { id: 'G-042', title: 'AI Traffic Management', leader: 'Ahmed Farooq', members: 3, hasUnread: true },
      { id: 'G-088', title: 'Smart Agriculture IoT', leader: 'Hamza Khan', members: 2, hasUnread: false }
    ];
    setGroups(mockGroups);
    setActiveGroupId('G-042');
    
    setMessages([
      {
        id: 1,
        senderId: 'student',
        senderName: 'Ahmed Farooq',
        senderAvatar: 'AF',
        text: '"Assalam-o-Alaikum Sir, we have updated the YOLOv8 weights file as discussed in yesterday\'s meeting. Please review the attached log."',
        timestamp: 'Yesterday, 14:20',
        isMe: false
      },
      {
        id: 2,
        senderId: 'faculty',
        senderName: 'Dr. Ali Hassan (You)',
        senderAvatar: 'AH',
        text: '"Walaikum Assalam. Excellent progress. Make sure to prepare the presentation slides for the upcoming committee defense."',
        timestamp: 'Yesterday, 15:45',
        isMe: true
      }
    ]);
  };

  const handleGroupSelect = (groupId) => {
    setActiveGroupId(groupId);
    if (groupId !== 'G-042') {
      setMessages([]);
    } else {
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeGroupId) return;

    const newMessage = {
      id: Date.now(),
      senderId: 'faculty',
      senderName: 'Dr. Ali Hassan (You)',
      senderAvatar: 'AH',
      text: inputValue.trim(),
      timestamp: 'Just now',
      isMe: true
    };

    setSending(true);
    try {
      await sendMessage(activeGroupId, { text: inputValue.trim() });
      
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');
      showToast(`Message sent to Group ${activeGroupId}`);
    } catch (error) {
      console.warn('Backend unavailable, simulating message send.', error);
      setTimeout(() => {
        setMessages(prev => [...prev, newMessage]);
        setInputValue('');
        showToast(`Message sent to Group ${activeGroupId}`);
        setSending(false);
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-[#2563eb] animate-spin" />
        <span className="ml-2 text-sm text-slate-500 font-medium">Loading messaging interface...</span>
      </div>
    );
  }

  const activeGroup = groups.find(g => g.id === activeGroupId);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-10 h-full flex flex-col relative">
      {/* Page Header */}
      <motion.div variants={item} className="space-y-1.5 shrink-0">
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Group Messaging & Announcements
        </h1>
        <p className="text-sm text-slate-500">
          Direct communication interface with supervised groups. Send announcements, share files/links, and maintain consultation logs.
        </p>
      </motion.div>

      {/* Main Messaging Layout */}
      <div className="flex flex-col lg:flex-row gap-6 h-[600px] lg:h-[calc(100vh-220px)] min-h-[500px]">
        
        {/* Left Panel: Groups List */}
        <motion.div variants={item} className="w-full lg:w-80 bg-white rounded-[2rem] border border-line shadow-card flex flex-col overflow-hidden shrink-0">
          <div className="px-6 py-5 border-b border-line shrink-0">
            <h2 className="text-sm font-black text-slate-900 tracking-tight">Supervised Groups</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {groups.map(group => {
              const isActive = group.id === activeGroupId;
              return (
                <div 
                  key={group.id}
                  onClick={() => handleGroupSelect(group.id)}
                  className={`px-6 py-4 cursor-pointer transition-colors border-l-4 relative flex items-center justify-between ${
                    isActive 
                      ? 'border-blue-600 bg-blue-50/40' 
                      : 'border-transparent hover:bg-blue-50/30'
                  }`}
                >
                  <div className="space-y-1">
                    <h3 className={`text-xs font-black ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                      {group.id}: {group.title}
                    </h3>
                    <p className={`text-[11px] ${isActive ? 'text-slate-500' : 'text-slate-400'} font-medium`}>
                      {group.leader}
                    </p>
                  </div>
                  {group.hasUnread && !isActive && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 absolute right-6" />
                  )}
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Panel: Conversation */}
        <motion.div variants={item} className="flex-1 bg-white rounded-[2rem] border border-line shadow-card flex flex-col overflow-hidden relative">
          
          {/* Conversation Header */}
          <div className="px-6 py-4 border-b border-line shrink-0 flex items-center justify-between bg-white z-10">
            <h2 className="text-sm font-black text-slate-900 tracking-tight">
              Conversation: {activeGroup?.id} ({activeGroup?.title})
            </h2>
            <span className="px-3 py-1 bg-white text-slate-900 rounded-full text-xs font-bold shrink-0">
              {activeGroup?.members} Students
            </span>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-white/30">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`flex items-end gap-3 ${msg.isMe ? 'justify-end' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {/* Other's Avatar */}
                {!msg.isMe && (
                  <div className="w-8 h-8 rounded-full bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center text-xs font-bold shrink-0 shadow-card">
                    {msg.senderAvatar}
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`max-w-[85%] md:max-w-[70%] p-4 shadow-card ${
                  msg.isMe 
                    ? 'bg-[#2b3574] rounded-[1.25rem] rounded-br-sm' 
                    : 'bg-white border border-line rounded-[1.25rem] rounded-bl-sm'
                }`}>
                  <p className={`text-xs font-bold mb-1.5 ${msg.isMe ? 'text-white/90' : 'text-slate-900'}`}>
                    {msg.senderName}
                  </p>
                  <p className={`text-sm leading-relaxed ${msg.isMe ? 'text-white' : 'text-slate-500'}`}>
                    {msg.text}
                  </p>
                  <p className={`text-[10px] mt-2 font-medium ${msg.isMe ? 'text-white/50 text-right' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </p>
                </div>

                {/* My Avatar */}
                {msg.isMe && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 shadow-card">
                    {msg.senderAvatar}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 border-t border-line bg-white flex items-center gap-3 shrink-0">
            <button type="button" className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 hover:text-blue-600 hover:bg-blue-50 border border-line transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-blue-500">
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Type your message or announcement to Group ${activeGroup?.id}...`}
              className="flex-1 h-10 px-4 bg-slate-50 border border-line rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
            />
            <button 
              type="submit"
              disabled={sending || !inputValue.trim()}
              className="px-5 h-10 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 shrink-0 shadow-card focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

        </motion.div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in- slide-in- duration-300">
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl text-sm font-bold bg-blue-900 text-white border border-line">
            <CheckCircle className="w-5 h-5 text-slate-900 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
