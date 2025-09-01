"use client"

import Link from "next/link";
import Navbar from "@/Components/Navbar";
import { MessageCircle, Users, Heart, ArrowRight, Star, Clock, UserCheck } from "lucide-react";

export default function ListenerDashboard() {
  // Mock data for connected seekers (using listener data structure but adapting for seekers)
  const connectedSeekers = [
    {
      id: "s1",
      name: "Priya Sharma",
      image: "https://i.pravatar.cc/100?img=25",
      category: "Anxiety",
      description: "Looking for support with work-related stress and anxiety. Prefers mindfulness-based approaches.",
      badge: "New",
      lastActive: "2 hours ago"
    },
    {
      id: "s2",
      name: "Rahul Patel",
      image: "https://i.pravatar.cc/100?img=35",
      category: "Relationship Issues",
      description: "Navigating communication challenges in a long-term relationship. Needs help with boundaries.",
      badge: "Regular",
      lastActive: "1 day ago"
    },
    {
      id: "s3",
      name: "Anjali Desai",
      image: "https://i.pravatar.cc/100?img=42",
      category: "Career Stress",
      description: "Feeling overwhelmed with career decisions and imposter syndrome. Seeking guidance and support.",
      badge: "New",
      lastActive: "3 days ago"
    },
    {
      id: "s4",
      name: "Vikram Singh",
      image: "https://i.pravatar.cc/100?img=28",
      category: "Loneliness",
      description: "Recently moved to a new city and feeling isolated. Looking for connection and community.",
      badge: "Regular",
      lastActive: "1 week ago"
    }
  ];

  // Static chat data
  const recentChats = [
    { id: 1, name: "Priya Sharma", lastMessage: "Thank you for the breathing exercise", time: "5 min ago", unread: 2 },
    { id: 2, name: "Rahul Patel", lastMessage: "I tried setting that boundary today", time: "2 hours ago", unread: 0 },
    { id: 3, name: "Anjali Desai", lastMessage: "The career advice really helped", time: "1 day ago", unread: 1 },
    { id: 4, name: "Vikram Singh", lastMessage: "I joined a local meetup group", time: "3 days ago", unread: 0 },
  ];

  // Stats data
  const stats = [
    { label: "Total Sessions", value: "47", icon: Clock, color: "from-blue-400 to-blue-600" },
    { label: "Active Seekers", value: "12", icon: Users, color: "from-green-400 to-green-600" },
    { label: "Rating", value: "4.9", icon: Star, color: "from-yellow-400 to-yellow-600" },
    { label: "Hours Listened", value: "89", icon: Heart, color: "from-pink-400 to-pink-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C]">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Listener Dashboard
          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto">
            Support seekers, track your impact, and grow your listening practice
          </p>
        </div>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns on desktop */}
          <div className="lg:col-span-2 space-y-8">
            {/* Connected Seekers Section */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-[#8B4513]" />
                </div>
                <h2 className="text-3xl font-bold text-black">Connected Seekers</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {connectedSeekers.map((seeker) => (
                  <div key={seeker.id} className="transform hover:scale-105 transition-all duration-300">
                    <div className="relative">
                      <div className="rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#EEE] p-5">
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={seeker.image}
                            alt={seeker.name}
                            className="w-14 h-14 rounded-full object-cover border border-[#EEE]"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-[#111]">{seeker.name}</h3>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF0E8] text-[#FF8C5A] border border-[#FFD8C7]">
                                {seeker.badge}
                              </span>
                            </div>
                            <p className="text-xs text-[#666] mt-0.5">{seeker.category}</p>
                            <p className="text-xs text-[#666] mt-1">Last active: {seeker.lastActive}</p>
                          </div>
                        </div>
                        <p className="text-sm text-[#222] leading-relaxed line-clamp-3">
                          {seeker.description}
                        </p>
                      </div>
                      <button className="absolute bottom-4 right-4 px-4 py-2 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Community Section */}
            <section className="bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-black mb-4">Join the Elysian Community</h2>
                <p className="text-lg text-black/80 mb-6 max-w-2xl mx-auto">
                  Connect with other listeners, share experiences, and learn from each other. Build your skills and grow your practice in a supportive environment.
                </p>
                <Link href="/community" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#8B4513] font-bold rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/30">
                  Join Community
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </section>

            {/* Upcoming Sessions */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#8B4513]" />
                </div>
                <h2 className="text-3xl font-bold text-black">Upcoming Sessions</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <span className="text-[#8B4513] font-bold text-lg">P</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Priya Sharma</h4>
                      <p className="text-sm text-black/70">Anxiety Support Session</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-black">Today</p>
                    <p className="text-sm text-black/70">2:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <span className="text-[#8B4513] font-bold text-lg">R</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-black">Rahul Patel</h4>
                      <p className="text-sm text-black/70">Relationship Guidance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-black">Tomorrow</p>
                    <p className="text-sm text-black/70">10:00 AM</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar - 1 column on desktop */}
          <div className="space-y-6">
            {/* Recent Chats Section */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#8B4513]" />
                </div>
                <h3 className="text-xl font-bold text-black">Recent Chats</h3>
              </div>
              
              <div className="space-y-4">
                {recentChats.map((chat) => (
                  <div key={chat.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/50 transition-all duration-300 cursor-pointer group">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-full flex items-center justify-center text-sm font-bold text-[#8B4513]">
                      {chat.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-black truncate">{chat.name}</p>
                        {chat.unread > 0 && (
                          <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    </div>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg">
                View All Chats
              </button>
            </section>

            {/* Quick Actions */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <h3 className="text-xl font-bold text-black mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Schedule Session
                </button>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg">
                  View Analytics
                </button>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Training Resources
                </button>
              </div>
            </section>

            {/* Availability Status */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <h3 className="text-xl font-bold text-black mb-4">Availability Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Status</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Available
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Next Available</span>
                  <span className="text-sm font-medium">Now</span>
                </div>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Toggle Availability
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
