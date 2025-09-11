"use client"

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/Components/Navbar";
import DashboardSidebar from "@/Components/DashboardSidebar";
import ProtectedRoute from "@/Components/ProtectedRoute";
import { 
  MessageCircle, 
  Users, 
  Heart, 
  ArrowRight, 
  UserCheck, 
  Users2, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  LayoutDashboard,
  MessageSquare,
  LogOut,
  X,
  Clock,
  Star,
  Calendar,
  Plus
} from "lucide-react";

interface ConnectedListener {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  avatar: string;
  status: 'online' | 'offline';
  lastActive: string;
  lastMessage: string;
  unreadCount: number;
}

export default function SeekerPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'chats' | 'community'>('dashboard');
  
  // Mock data for connected listeners
  const connectedListeners: ConnectedListener[] = [
    {
      id: 1,
      name: "Dr. Aarav Mehta",
      specialty: "Anxiety & Depression",
      rating: 4.9,
      experience: "8 years",
      avatar: "AM",
      status: "online",
      lastActive: "2 min ago",
      lastMessage: "How are you feeling today?",
      unreadCount: 2
    },
    {
      id: 2,
      name: "Sana Kapoor",
      specialty: "Relationship Issues",
      rating: 4.8,
      experience: "5 years",
      avatar: "SK",
      status: "online",
      lastActive: "1 hour ago",
      lastMessage: "I'm here to listen whenever you need me",
      unreadCount: 0
    },
    {
      id: 3,
      name: "Kabir Singh",
      specialty: "Career Stress",
      rating: 4.7,
      experience: "6 years",
      avatar: "KS",
      status: "offline",
      lastActive: "3 hours ago",
      lastMessage: "Let's work through this together",
      unreadCount: 1
    }
  ];

  // Mock chat messages
  const mockMessages = [
    { id: 1, sender: 'listener', text: 'Hello! How are you feeling today?', time: '10:30 AM' },
    { id: 2, sender: 'user', text: 'Hi, I\'m feeling a bit anxious about my upcoming presentation', time: '10:32 AM' },
    { id: 3, sender: 'listener', text: 'I understand that can be really stressful. What specifically is worrying you?', time: '10:33 AM' },
    { id: 4, sender: 'user', text: 'I\'m afraid I\'ll freeze up or forget what to say', time: '10:35 AM' },
    { id: 5, sender: 'listener', text: 'That\'s a very common fear. Let\'s work through some strategies together', time: '10:36 AM' }
  ];

  const stats = [
    { label: "Sessions Completed", value: "12", icon: Clock, color: "from-blue-400 to-blue-600" },
    { label: "Listeners Connected", value: "5", icon: Users, color: "from-green-400 to-green-600" },
    { label: "Average Rating", value: "4.8", icon: Star, color: "from-yellow-400 to-yellow-600" },
    { label: "Hours of Support", value: "24", icon: Heart, color: "from-pink-400 to-pink-600" },
  ];

  const handleChatSelect = (listenerId: number) => {
    setSelectedChat(listenerId);
    setActiveView('chats');
  };

  const getSelectedListener = () => {
    return connectedListeners.find(listener => listener.id === selectedChat);
  };

  const closeChat = () => {
    setSelectedChat(null);
    setActiveView('dashboard');
  };

  const handleNavItemClick = (view: string) => {
    setActiveView(view as 'dashboard' | 'chats' | 'community');
    if (view === 'dashboard') {
      setSelectedChat(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C]">
        <Navbar />

        <div className="flex pt-20">
          {/* Left Sidebar */}
          <DashboardSidebar 
            activeView={activeView}
            onViewChange={handleNavItemClick}
            userType="seeker"
          />

          {/* Main Content Area */}
          <div className="md:ml-64 flex-1 p-4 md:p-8">
            {activeView === 'dashboard' && (
              <div className="space-y-8">
                {/* Header */}
                <div className="text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                    Seeker Dashboard
                  </h1>
                  <p className="text-xl text-black/80 max-w-2xl mx-auto">
                    Connect with listeners, track your progress, and find the support you need
                  </p>
                </div>

                {/* Stats Section */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 text-center">
                        <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-black mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    );
                  })}
                </section>

                {/* Connected Listeners Section */}
                <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <h2 className="text-3xl font-bold text-black">Connected Listeners</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {connectedListeners.map((listener) => (
                      <div key={listener.id} className="bg-gradient-to-br from-[#FFF8B5]/30 to-[#FFB88C]/30 rounded-2xl p-6 border border-[#FFB88C]/20 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {listener.avatar}
                            </div>
                            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                              listener.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                            }`}></span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-black">{listener.name}</h3>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-semibold text-black">{listener.rating}</span>
                              </div>
                            </div>
                            <p className="text-[#8B4513] font-medium mb-2">{listener.specialty}</p>
                            <p className="text-sm text-gray-600 mb-3">{listener.experience} experience</p>
                            <p className="text-xs text-gray-500">Last active: {listener.lastActive}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => handleChatSelect(listener.id)}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            Message
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Quick Actions Section */}
                <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                      <Plus className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <h2 className="text-3xl font-bold text-black">Quick Actions</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    <Link href="/listeners" className="px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg text-center">
                      Find New Listener
                    </Link>
                    <Link href="/community" className="px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg text-center">
                      Join Community
                    </Link>
                    <Link href="/resources" className="px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg text-center">
                      Mental Health Resources
                    </Link>
                  </div>
                </section>

                {/* Recent Activity Section */}
                <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <h2 className="text-3xl font-bold text-black">Recent Activity</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          AM
                        </div>
                        <div>
                          <h4 className="font-semibold text-black">Session with Dr. Aarav Mehta</h4>
                          <p className="text-sm text-black/70">Anxiety & Depression Support</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-black">Today</p>
                        <p className="text-sm text-black/70">2:00 PM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          SK
                        </div>
                        <div>
                          <h4 className="font-semibold text-black">Chat with Sana Kapoor</h4>
                          <p className="text-sm text-black/70">Relationship Issues Discussion</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-black">Yesterday</p>
                        <p className="text-sm text-black/70">10:30 AM</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Chats View */}
            {activeView === 'chats' && (
              <div className="h-[calc(100vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                  {/* Left Panel - Chat List */}
                  <div className="lg:col-span-1">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 h-full">
                      <h3 className="text-xl font-bold text-black mb-4">Recent Chats</h3>
                      <div className="space-y-3">
                        {connectedListeners.map((listener) => (
                          <div
                            key={listener.id}
                            onClick={() => handleChatSelect(listener.id)}
                            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                              selectedChat === listener.id ? 'bg-gradient-to-r from-[#FFB88C] to-[#FFF8B5] border border-orange-300' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {listener.avatar}
                                </div>
                                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                  listener.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                }`}></span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-black truncate">{listener.name}</h4>
                                  {listener.unreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                      {listener.unreadCount}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 truncate">{listener.lastMessage}</p>
                                <p className="text-xs text-gray-500">{listener.lastActive}</p>
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
                      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 h-full overflow-hidden">
                        {/* Chat Header */}
                        <div className="bg-gradient-to-r from-[#FFB88C] to-[#FFF8B5] p-4 border-b border-orange-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {getSelectedListener()?.avatar}
                              </div>
                              <div>
                                <h4 className="font-semibold text-black">{getSelectedListener()?.name}</h4>
                                <p className="text-sm text-black/70">{getSelectedListener()?.specialty}</p>
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
                                onClick={closeChat}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4 text-black" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="h-[calc(100%-140px)] overflow-y-auto p-4 space-y-3">
                          {mockMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs px-4 py-2 rounded-2xl ${
                                  message.sender === 'user'
                                    ? 'bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                <p className="text-sm">{message.text}</p>
                                <p className={`text-xs mt-1 ${
                                  message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
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
                            <MessageSquare className="w-10 h-10 text-[#8B4513]" />
                          </div>
                          <h3 className="text-xl font-semibold text-black mb-2">Select a Chat</h3>
                          <p className="text-gray-600">Choose a conversation from the left panel to start messaging</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Community View */}
            {activeView === 'community' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                    Community
                  </h1>
                  <p className="text-xl text-black/80 max-w-2xl mx-auto">
                    Connect with others, share experiences, and find support in our community
                  </p>
                </div>

                <div className="text-center">
                  <Link 
                    href="/community" 
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-bold rounded-2xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Go to Community
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}


