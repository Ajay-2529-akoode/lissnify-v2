"use client"

import { useState } from "react";
import DashboardLayout from "@/Components/DashboardLayout";
import { 
  MessageCircle, 
  Phone, 
  Video, 
  Send, 
  MoreVertical,
  X,
  Search,
  Filter,
  User
} from "lucide-react";

export default function ListenerChatsPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for connected seekers
  const connectedSeekers = [
    {
      id: 1,
      name: "Priya Sharma",
      specialty: "Anxiety",
      avatar: "PS",
      status: "online",
      lastActive: "5 min ago",
      lastMessage: "Thank you for the breathing exercise",
      unreadCount: 2
    },
    {
      id: 2,
      name: "Rahul Patel",
      specialty: "Relationship Issues",
      avatar: "RP",
      status: "offline",
      lastActive: "2 hours ago",
      lastMessage: "I tried setting that boundary today",
      unreadCount: 0
    },
    {
      id: 3,
      name: "Anjali Desai",
      specialty: "Career Stress",
      avatar: "AD",
      status: "offline",
      lastActive: "1 day ago",
      lastMessage: "The career advice really helped",
      unreadCount: 1
    },
    {
      id: 4,
      name: "Vikram Singh",
      specialty: "Loneliness",
      avatar: "VS",
      status: "online",
      lastActive: "3 days ago",
      lastMessage: "I joined a local meetup group",
      unreadCount: 0
    }
  ];

  // Mock chat messages
  const mockMessages = [
    { id: 1, sender: 'seeker', text: 'Hi, I\'m feeling really anxious about my upcoming presentation', time: '10:30 AM' },
    { id: 2, sender: 'listener', text: 'I understand that can be really stressful. What specifically is worrying you?', time: '10:32 AM' },
    { id: 3, sender: 'seeker', text: 'I\'m afraid I\'ll freeze up or forget what to say', time: '10:35 AM' },
    { id: 4, sender: 'listener', text: 'That\'s a very common fear. Let\'s work through some strategies together', time: '10:36 AM' },
    { id: 5, sender: 'seeker', text: 'Thank you, that would really help', time: '10:38 AM' }
  ];

  const getSelectedSeeker = () => {
    return connectedSeekers.find(seeker => seeker.id === selectedChat);
  };

  const filteredSeekers = connectedSeekers.filter(seeker =>
    seeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seeker.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout userType="listener">
      <div className="h-[calc(100vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Left Panel - Chat List */}
                <div className="lg:col-span-1">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 h-full flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-black mb-4">Your Seekers</h3>
                      
                      {/* Search Bar */}
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search seekers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3">
                      {filteredSeekers.map((seeker) => (
                        <div
                          key={seeker.id}
                          onClick={() => setSelectedChat(seeker.id)}
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                            selectedChat === seeker.id ? 'bg-gradient-to-r from-[#FFB88C] to-[#FFF8B5] border border-orange-300' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {seeker.avatar}
                              </div>
                              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                seeker.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                              }`}></span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-black truncate">{seeker.name}</h4>
                                {seeker.unreadCount > 0 && (
                                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                    {seeker.unreadCount}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 truncate">{seeker.lastMessage}</p>
                              <p className="text-xs text-gray-500">{seeker.lastActive}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Panel - Chat Area */}
                <div className="lg:col-span-2">
                  {selectedChat ? (
                    /* Chat Interface */
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 h-full overflow-hidden flex flex-col">
                      {/* Chat Header */}
                      <div className="bg-gradient-to-r from-[#FFB88C] to-[#FFF8B5] p-4 border-b border-orange-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {getSelectedSeeker()?.avatar}
                            </div>
                            <div>
                              <h4 className="font-semibold text-black">{getSelectedSeeker()?.name}</h4>
                              <p className="text-sm text-black/70">{getSelectedSeeker()?.specialty} Seeker</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                              <Phone className="w-4 h-4 text-black" />
                            </button>
                            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                              <Video className="w-4 h-4 text-black" />
                            </button>
                            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4 text-black" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {mockMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === 'listener' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs px-4 py-2 rounded-2xl ${
                                message.sender === 'listener'
                                  ? 'bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender === 'listener' ? 'text-white/70' : 'text-gray-500'
                              }`}>
                                {message.time}
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
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                          />
                          <button className="p-2 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white rounded-full hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300">
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Placeholder when no chat is selected */
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="w-10 h-10 text-[#8B4513]" />
                        </div>
                        <h3 className="text-xl font-semibold text-black mb-2">Select a Conversation</h3>
                        <p className="text-gray-600">Choose a conversation from the left panel to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
      </div>
    </DashboardLayout>
  );
}
