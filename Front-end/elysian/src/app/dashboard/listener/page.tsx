"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DashboardLayout from "@/Components/DashboardLayout";
import ProtectedRoute from "@/Components/ProtectedRoute";
import { 
  Clock, 
  Users, 
  Star, 
  Heart, 
  UserCheck, 
  MessageCircle, 
  ArrowRight, 
  Calendar,
  Play,
  Plus,
  User,
  Settings,
  Check,
  X,
  Bell,
  Phone,
  Video,
  Send,
  MessageSquare
} from "lucide-react";

interface ConnectedSeeker {
  id: string;
  name: string;
  avatar: string;
  category: string;
  description: string;
  badge: 'New' | 'Regular';
  lastActive: string;
  status: 'online' | 'offline';
}

interface SessionRequest {
  id: string;
  seekerName: string;
  seekerAvatar: string;
  category: string;
  message: string;
  requestedTime: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface UpcomingSession {
  id: string;
  seekerName: string;
  seekerAvatar: string;
  category: string;
  date: string;
  time: string;
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'online' | 'offline';
}

export default function ListenerDashboard() {
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [sessionRequests, setSessionRequests] = useState<SessionRequest[]>([
    {
      id: 'req-1',
      seekerName: 'Priya Sharma',
      seekerAvatar: 'PS',
      category: 'Anxiety',
      message: 'I\'m feeling really overwhelmed with work stress and would love to talk to someone who understands.',
      requestedTime: '2 hours ago',
      status: 'pending'
    },
    {
      id: 'req-2',
      seekerName: 'Rahul Patel',
      seekerAvatar: 'RP',
      category: 'Relationship Issues',
      message: 'Going through a difficult breakup and need someone to talk to about moving forward.',
      requestedTime: '1 day ago',
      status: 'pending'
    },
    {
      id: 'req-3',
      seekerName: 'Anjali Desai',
      seekerAvatar: 'AD',
      category: 'Career Stress',
      message: 'Feeling stuck in my career and need guidance on next steps.',
      requestedTime: '3 days ago',
      status: 'pending'
    }
  ]);

  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([
    {
      id: 'session-1',
      seekerName: 'Vikram Singh',
      seekerAvatar: 'VS',
      category: 'Loneliness',
      date: 'Today',
      time: '2:00 PM'
    },
    {
      id: 'session-2',
      seekerName: 'Maya Rao',
      seekerAvatar: 'MR',
      category: 'Depression',
      date: 'Tomorrow',
      time: '10:00 AM'
    }
  ]);

  const connectedSeekers: ConnectedSeeker[] = [
    {
      id: "s1",
      name: "Priya Sharma",
      avatar: "PS",
      category: "Anxiety",
      description: "Looking for support with work-related stress and anxiety. Prefers mindfulness-based approaches.",
      badge: "New",
      lastActive: "2 hours ago",
      status: "online"
    },
    {
      id: "s2",
      name: "Rahul Patel",
      avatar: "RP",
      category: "Relationship Issues",
      description: "Navigating communication challenges in a long-term relationship. Needs help with boundaries.",
      badge: "Regular",
      lastActive: "1 day ago",
      status: "offline"
    },
    {
      id: "s3",
      name: "Anjali Desai",
      avatar: "AD",
      category: "Career Stress",
      description: "Feeling overwhelmed with career decisions and imposter syndrome. Seeking guidance and support.",
      badge: "New",
      lastActive: "3 days ago",
      status: "offline"
    },
    {
      id: "s4",
      name: "Vikram Singh",
      avatar: "VS",
      category: "Loneliness",
      description: "Recently moved to a new city and feeling isolated. Looking for connection and community.",
      badge: "Regular",
      lastActive: "1 week ago",
      status: "online"
    }
  ];

  const chats: Chat[] = [
    { id: 1, name: "Priya Sharma", lastMessage: "Thank you for the breathing exercise", time: "5 min ago", unread: 2, status: 'online' },
    { id: 2, name: "Rahul Patel", lastMessage: "I tried setting that boundary today", time: "2 hours ago", unread: 0, status: 'offline' },
    { id: 3, name: "Anjali Desai", lastMessage: "The career advice really helped", time: "1 day ago", unread: 1, status: 'offline' },
    { id: 4, name: "Vikram Singh", lastMessage: "I joined a local meetup group", time: "3 days ago", unread: 0, status: 'online' },
  ];

  const stats = [
    { label: "Total Sessions", value: "47", icon: Clock, color: "from-blue-400 to-blue-600" },
    { label: "Active Seekers", value: "12", icon: Users, color: "from-green-400 to-green-600" },
    { label: "Rating", value: "4.9", icon: Star, color: "from-yellow-400 to-yellow-600" },
    { label: "Hours Listened", value: "89", icon: Heart, color: "from-pink-400 to-pink-600" },
  ];

  const handleAcceptRequest = (requestId: string) => {
    const request = sessionRequests.find(r => r.id === requestId);
    if (request) {
      // Move to upcoming sessions
      const newSession: UpcomingSession = {
        id: `session-${Date.now()}`, // Generate unique ID
        seekerName: request.seekerName,
        seekerAvatar: request.seekerAvatar,
        category: request.category,
        date: 'Tomorrow',
        time: '2:00 PM'
      };
      setUpcomingSessions(prev => [...prev, newSession]);
      
      // Remove from requests
      setSessionRequests(prev => prev.filter(r => r.id !== requestId));
      
      toast.success(`Session request accepted from ${request.seekerName}`);
    }
  };

  const handleRejectRequest = (requestId: string) => {
    const request = sessionRequests.find(r => r.id === requestId);
    if (request) {
      setSessionRequests(prev => prev.filter(r => r.id !== requestId));
      toast.error(`Session request rejected from ${request.seekerName}`);
    }
  };

  const handleQuickAction = (action: string) => {
    toast.success(`${action} action triggered!`);
  };

  const handleChatSelect = (chatId: number) => {
    setSelectedChat(chatId);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

    return (
    <DashboardLayout userType="listener">
      <div className="space-y-8">
                {/* Header */}
                <div className="text-center">
                  <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                    Listener Dashboard
                  </h1>
                  <p className="text-xl text-black/80 max-w-2xl mx-auto">
                    Support seekers, track your impact, and grow your listening practice
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

                {/* Connected Seekers Section */}
                <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <h2 className="text-3xl font-bold text-black">Connected Seekers</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {connectedSeekers.map((seeker) => (
                      <div key={seeker.id} className="bg-gradient-to-br from-[#FFF8B5]/30 to-[#FFB88C]/30 rounded-2xl p-6 border border-[#FFB88C]/20 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {seeker.avatar}
                            </div>
                            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                              seeker.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                            }`}></span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-black">{seeker.name}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                seeker.badge === 'New' 
                                  ? 'bg-[#FFF0E8] text-[#FF8C5A] border border-[#FFD8C7]' 
                                  : 'bg-[#E8F5E8] text-[#4CAF50] border border-[#C8E6C9]'
                              }`}>
                                {seeker.badge}
                              </span>
                            </div>
                            <p className="text-[#8B4513] font-medium mb-2">{seeker.category}</p>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{seeker.description}</p>
                            <p className="text-xs text-gray-500">Last active: {seeker.lastActive}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => handleQuickAction('Message')}
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
                {/* <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                      <Play className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <h2 className="text-3xl font-bold text-black">Quick Actions</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <button 
                      onClick={() => handleQuickAction('Start Session')}
                      className="px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Start Session
                    </button>
                    <button 
                      onClick={() => handleQuickAction('Create Availability')}
                      className="px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Create Availability
                    </button>
                    <button 
                      onClick={() => handleQuickAction('View Profile')}
                      className="px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => handleQuickAction('Manage Categories')}
                      className="px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Manage Categories
                    </button>
                  </div>
                </section> */}

                {/* Requests Section */}
                <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                      <Bell className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <h2 className="text-3xl font-bold text-black">Session Requests</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {sessionRequests.map((request) => (
                      <div key={request.id} className="bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {request.seekerAvatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-black">{request.seekerName}</h4>
                              <span className="text-sm text-black/70">{request.category}</span>
                            </div>
                            <p className="text-sm text-black/80 mb-3">{request.message}</p>
                            <p className="text-xs text-black/60">Requested: {request.requestedTime}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleAcceptRequest(request.id)}
                              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              Accept
                            </button>
                            <button 
                              onClick={() => handleRejectRequest(request.id)}
                              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {sessionRequests.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bell className="w-10 h-10 text-[#8B4513]" />
                        </div>
                        <h3 className="text-xl font-semibold text-black mb-2">No Pending Requests</h3>
                        <p className="text-gray-600">You're all caught up!</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Upcoming Sessions Section */}
                <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <h2 className="text-3xl font-bold text-black">Upcoming Sessions</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {session.seekerAvatar}
                          </div>
                          <div>
                            <h4 className="font-semibold text-black">{session.seekerName}</h4>
                            <p className="text-sm text-black/70">{session.category} Support Session</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-black">{session.date}</p>
                          <p className="text-sm text-black/70">{session.time}</p>
                        </div>
                      </div>
                    ))}
                    
                    {upcomingSessions.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-10 h-10 text-[#8B4513]" />
                        </div>
                        <h3 className="text-xl font-semibold text-black mb-2">No Upcoming Sessions</h3>
                        <p className="text-gray-600">Schedule some sessions to get started</p>
                      </div>
                    )}
                  </div>
                </section>
      </div>
    </DashboardLayout>
  );
}
