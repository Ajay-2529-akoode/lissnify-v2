"use client"

import { useState } from "react";
import { MessageCircle, Send, Phone, Video, X } from "lucide-react";

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'online' | 'offline';
}

interface ChatsPanelProps {
  chats: Chat[];
  selectedChat: number | null;
  onChatSelect: (chatId: number) => void;
  onCloseChat: () => void;
}

export default function ChatsPanel({ chats, selectedChat, onChatSelect, onCloseChat }: ChatsPanelProps) {
  const [message, setMessage] = useState("");

  // Mock messages for the selected chat
  const mockMessages = [
    { id: 1, sender: 'seeker', text: 'Hi, I\'m feeling really anxious about my upcoming presentation', time: '10:30 AM' },
    { id: 2, sender: 'listener', text: 'I understand that can be really stressful. What specifically is worrying you?', time: '10:32 AM' },
    { id: 3, sender: 'seeker', text: 'I\'m afraid I\'ll freeze up or forget what to say', time: '10:35 AM' },
    { id: 4, sender: 'listener', text: 'That\'s a very common fear. Let\'s work through some strategies together', time: '10:36 AM' },
    { id: 5, sender: 'seeker', text: 'Thank you, that would really help', time: '10:38 AM' }
  ];

  const getSelectedChatData = () => {
    return chats.find(chat => chat.id === selectedChat);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message to the backend
      setMessage("");
    }
  };

  return (
    <div className="hidden xl:block w-80 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 h-[calc(100vh-120px)] overflow-hidden">
      {selectedChat ? (
        /* Chat Interface */
        <div className="h-full flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#FFB88C] to-[#FFF8B5] p-4 border-b border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {getSelectedChatData()?.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-black">{getSelectedChatData()?.name}</h4>
                  <p className="text-sm text-black/70">Seeker</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <Phone className="w-4 h-4 text-black" />
                </button>
                <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <Video className="w-4 h-4 text-black" />
                </button>
                <button 
                  onClick={onCloseChat}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'listener' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    msg.sender === 'listener'
                      ? 'bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === 'listener' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
              />
              <button 
                onClick={handleSendMessage}
                className="p-2 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white rounded-full hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Chat List */
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-black mb-4">Recent Chats</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className="p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {chat.name.charAt(0)}
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      chat.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-black truncate">{chat.name}</h4>
                      {chat.unread > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    <p className="text-xs text-gray-500">{chat.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg">
              View All Chats
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
