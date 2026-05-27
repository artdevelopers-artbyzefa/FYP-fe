import React, { useEffect, useState } from 'react';
import { getFacultyMessages } from '../../services/faculty.service';
import { showToast } from '../../components/AppToast';
import { MoreVertical, Send } from 'lucide-react';

const FacultyMessaging = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    getFacultyMessages().then(res => setMessages(res.data)).catch(console.error);
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

  return (
    <>
      <div className="border-b border-black pb-4 mb-6">
        <h2 className="text-xl font-black text-black">Student Group Messaging</h2>
        <p className="text-xs text-black mt-0.5 font-medium">Direct communication channel with your supervised project groups</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
        {/* Contacts Sidebar */}
        <div className="w-full lg:w-80 bg-white rounded-2xl border border-black shadow-sm flex flex-col overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-black bg-white font-bold text-sm text-black">Your Groups</div>
          <div className="flex-1 overflow-y-auto divide-y divide-blue-600">
            <div className="p-4 hover:bg-white/50 cursor-pointer transition-colors bg-white/30 border-l-4 border-black">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-bold text-black text-sm">Group G-042</span>
                <span className="text-[10px] text-black font-bold">10:30 AM</span>
              </div>
              <p className="text-xs text-black truncate">Sir, we have uploaded the revised...</p>
            </div>
            <div className="p-4 hover:bg-white cursor-pointer transition-colors border-l-4 border-transparent">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-bold text-black text-sm">Group G-019</span>
                <span className="text-[10px] text-black font-bold">Yesterday</span>
              </div>
              <p className="text-xs text-black truncate">Meeting confirmed for tomorrow.</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-2xl border border-black shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-black bg-white flex justify-between items-center">
            <div>
              <div className="font-bold text-black text-sm">Group G-042</div>
              <div className="text-[11px] text-black">Ahmed Farooq, Sana Mehmood</div>
            </div>
            <button className="text-black hover:text-blue-600 transition-colors"><MoreVertical className="w-4 h-4" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-white/50 flex flex-col" id="chatMessages">
            <div className="text-center text-[10px] font-bold text-black uppercase tracking-widest my-4">Today, May 19</div>
            
            {messages.map((msg, idx) => {
              const isYou = msg.sender.includes('You');
              return (
                <div key={idx} className={`flex gap-3 items-start ${isYou ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${isYou ? 'bg-blue-100 text-black' : 'bg-gray-200 text-gray-600'}`}>
                    {isYou ? 'AH' : 'G'}
                  </div>
                  <div className={`p-4 rounded-2xl max-w-md shadow-sm ${isYou ? 'bg-blue-600 text-white' : 'bg-white border border-gray-100 text-gray-700'}`}>
                    <span className={`font-bold text-xs block mb-1 ${isYou ? 'text-white' : 'text-gray-800'}`}>{msg.sender}</span>
                    <p className={`text-xs leading-relaxed ${isYou ? 'text-white/90' : 'text-gray-600'}`}>{msg.text}</p>
                    <span className={`text-[10px] mt-2 block font-bold ${isYou ? 'text-white/60 text-right' : 'text-gray-400 text-right'}`}>{msg.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-black bg-white">
            <form onSubmit={handleSend} className="flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message here..." 
                className="flex-1 bg-white border border-black rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-all"
              />
              <button type="submit" className="bg-white hover:bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm cursor-pointer">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyMessaging;
