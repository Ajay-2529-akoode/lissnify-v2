"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/Components/DashboardLayout";
import CategoryCard from "@/Components/CategoryCard";
import ListenerCard from "@/Components/ListenerCard";
import { categories, listeners } from "@/app/listeners/data";
import { API_CONFIG } from "@/config/api";
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
  UserX,
  Star,
  BarChart3
} from "lucide-react";

export default function SeekerDashboard() {
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  
  // Mock data for connected listeners (in real app, this would come from backend)
  const connectedListeners = [
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

  // Mock data for previously connected listeners (in real app, this would come from backend)
  const previouslyConnectedListeners = [
    {
      id: 4,
      name: "Dr. Priya Sharma",
      specialty: "Trauma & PTSD",
      rating: 4.9,
      experience: "10 years",
      avatar: "PS",
      status: "offline",
      lastActive: "2 weeks ago",
      lastMessage: "Take care of yourself. Remember our breathing exercises.",
      lastChatDate: "2 weeks ago",
      totalSessions: 8
    },
    {
      id: 5,
      name: "Dr. Michael Chen",
      specialty: "Family Therapy",
      rating: 4.8,
      experience: "12 years",
      avatar: "MC",
      status: "offline",
      lastActive: "1 month ago",
      lastMessage: "You've made great progress. Keep up the good work!",
      lastChatDate: "1 month ago",
      totalSessions: 12
    },
    {
      id: 6,
      name: "Dr. Sarah Johnson",
      specialty: "Grief Counseling",
      rating: 4.7,
      experience: "7 years",
      avatar: "SJ",
      status: "offline",
      lastActive: "3 weeks ago",
      lastMessage: "It's okay to feel this way. Grief has no timeline.",
      lastChatDate: "3 weeks ago",
      totalSessions: 5
    },
    {
      id: 7,
      name: "Dr. Raj Patel",
      specialty: "Addiction Recovery",
      rating: 4.6,
      experience: "9 years",
      avatar: "RP",
      status: "offline",
      lastActive: "1 week ago",
      lastMessage: "One day at a time. You're stronger than you think.",
      lastChatDate: "1 week ago",
      totalSessions: 15
    }
  ];

  // Mock chat messages (in real app, this would come from backend)
  const mockMessages = [
    { id: 1, sender: 'listener', text: 'Hello! How are you feeling today?', time: '10:30 AM' },
    { id: 2, sender: 'user', text: 'Hi, I\'m feeling a bit anxious about my upcoming presentation', time: '10:32 AM' },
    { id: 3, sender: 'listener', text: 'I understand that can be really stressful. What specifically is worrying you?', time: '10:33 AM' },
    { id: 4, sender: 'user', text: 'I\'m afraid I\'ll freeze up or forget what to say', time: '10:35 AM' },
    { id: 5, sender: 'listener', text: 'That\'s a very common fear. Let\'s work through some strategies together', time: '10:36 AM' }
  ];

  const handleChatSelect = (listenerId: number) => {
    setSelectedChat(listenerId);
    router.push('/dashboard/seeker/chats');
  };

  const handleReconnect = (listenerId: number) => {
    // In a real app, this would send a reconnection request
    console.log('Reconnecting with listener:', listenerId);
    // You could show a toast notification or modal here
    alert('Reconnection request sent! The listener will be notified.');
  };

  const handleViewPreviousChats = (listenerId: number) => {
    // In a real app, this would open the chat history
    console.log('Viewing previous chats with listener:', listenerId);
    setSelectedChat(listenerId);
    router.push('/dashboard/seeker/chats');
  };

  return (
    <DashboardLayout userType="seeker">
      <div className="space-y-8">
                {/* Header */}
                <div className="text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                    Welcome to Your Support Dashboard
                  </h1>
                  <p className="text-xl text-black/80 max-w-2xl mx-auto">
                    Connect with your listeners, explore support categories, and engage with our community
                  </p>
                </div>

                {/* Support Categories Section */}
                <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <h2 className="text-3xl font-bold text-black">Support Categories</h2>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.slice(0, 6).map((category) => (
                      <div key={category.id} className="transform hover:scale-105 transition-all duration-300">
                        <CategoryCard
                          category={category}
                          href={`/listeners/${category.id}`}
                          className="h-full"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Connected Listeners Section */}
                <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-[#8B4513]" />
                      </div>
                      <h2 className="text-3xl font-bold text-black">Connected Listeners</h2>
                    </div>
                    {/* <Link
                      href="/listeners"
                      className="px-4 py-2 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Find More
                    </Link> */}
                  </div>

                  {connectedListeners.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {connectedListeners.map((listener) => (
                        <div key={listener.user_id} className="bg-gradient-to-br from-[#FFF8B5]/30 to-[#FFB88C]/30 rounded-2xl p-6 border border-[#FFB88C]/20 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {listener.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-bold text-black">{listener.username}</h3>
                                <span className={`w-3 h-3 rounded-full ${listener.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                              </div>
                              <p className="text-[#8B4513] font-medium mb-2">{listener.specialty}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <span>⭐ {listener.rating}</span>
                                <span>📚 {listener.experience}</span>
                              </div>
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
                            {/* <button className="flex-1 px-4 py-2 bg-white/70 text-[#8B4513] font-semibold rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg border border-[#FFB88C]/30">
                              Schedule
                            </button> */} 
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-[#8B4513]" />
                      </div>
                      <h3 className="text-xl font-semibold text-black mb-2">No Connected Listeners Yet</h3>
                      <p className="text-gray-600 mb-6">Start connecting with listeners to get the support you need</p>
                      <Link
                        href="/listeners"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        Find Listeners
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </section>

                {/* Previously Connected Listeners Section */}
                <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                        <UserX className="w-6 h-6 text-[#8B4513]" />
                      </div>
                      <h2 className="text-3xl font-bold text-black">Previously Connected Listeners</h2>
                    </div>
                  </div>

                  {previouslyConnectedListeners.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {previouslyConnectedListeners.map((listener) => (
                        <div
                          key={listener.id}
                          className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {listener.avatar}
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-bold text-black truncate">{listener.name}</h3>
                                <div className={`w-2 h-2 rounded-full ${
                                  listener.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                }`}></div>
                              </div>
                              
                              <p className="text-[#8B4513] font-medium mb-2">{listener.specialty}</p>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="font-medium">{listener.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <BarChart3 className="w-4 h-4" />
                                  <span>{listener.experience}</span>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-500 mb-2">Last active: {listener.lastActive}</p>
                              <p className="text-sm text-gray-500 mb-4">Last chat: {listener.lastChatDate} • {listener.totalSessions} sessions</p>
                              
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleReconnect(listener.id)}
                                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                                >
                                  Reconnect
                                </button>
                                <button
                                  onClick={() => handleViewPreviousChats(listener.id)}
                                  className="flex-1 px-4 py-2 bg-white/80 text-[#8B4513] font-semibold rounded-xl border border-[#CD853F] hover:bg-[#CD853F] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                                >
                                  View Previous Chats
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserX className="w-10 h-10 text-[#8B4513]" />
                      </div>
                      <h3 className="text-xl font-semibold text-black mb-2">No Previous Connections</h3>
                      <p className="text-gray-600">You haven't connected with any listeners yet</p>
                    </div>
                  )}
                </section>
      </div>
    </DashboardLayout>
  );
}
