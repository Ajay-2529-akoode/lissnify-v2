"use client"

import Link from "next/link";
import Navbar from "@/Components/Navbar";
import CategoryCard from "@/Components/CategoryCard";
import ListenerCard from "@/Components/ListenerCard";
import { categories, listeners } from "@/app/listeners/data";
import { MessageCircle, Users, Heart, ArrowRight, UserCheck, Users2 } from "lucide-react";
import ProtectedRoute from "@/Components/ProtectedRoute";

export default function SeekerDashboard() {
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
      lastActive: "2 min ago"
    },
    {
      id: 2,
      name: "Sana Kapoor",
      specialty: "Relationship Issues",
      rating: 4.8,
      experience: "5 years",
      avatar: "SK",
      status: "online",
      lastActive: "1 hour ago"
    },
    {
      id: 3,
      name: "Kabir Singh",
      specialty: "Career Stress",
      rating: 4.7,
      experience: "6 years",
      avatar: "KS",
      status: "offline",
      lastActive: "3 hours ago"
    }
  ];

  // Static chat data
  const recentChats = [
    { id: 1, name: "Aarav Mehta", lastMessage: "How are you feeling today?", time: "2 min ago" },
    { id: 2, name: "Sana Kapoor", lastMessage: "Remember to breathe deeply", time: "1 hour ago" },
    { id: 3, name: "Kabir Singh", lastMessage: "You're doing great!", time: "3 hours ago" },
    { id: 4, name: "Isha Verma", lastMessage: "Let's talk about boundaries", time: "1 day ago" },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C]">
        <Navbar />
        
        <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Welcome to Your Support Dashboard
          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto">
            Connect with your listeners, explore support categories, and engage with our community
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns on desktop */}
          <div className="lg:col-span-2 space-y-8">
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
                <Link 
                  href="/listeners" 
                  className="px-4 py-2 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Find More
                </Link>
              </div>
              
              {connectedListeners.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {connectedListeners.map((listener) => (
                    <div key={listener.id} className="bg-gradient-to-br from-[#FFF8B5]/30 to-[#FFB88C]/30 rounded-2xl p-6 border border-[#FFB88C]/20 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {listener.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-black">{listener.name}</h3>
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
                        <button className="flex-1 px-4 py-2 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg">
                          Message
                        </button>
                        <button className="flex-1 px-4 py-2 bg-white/70 text-[#8B4513] font-semibold rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg border border-[#FFB88C]/30">
                          Schedule
                        </button>
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

            {/* Community Section */}
            <section className="bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users2 className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h2 className="text-3xl font-bold text-black mb-4">Join the Elysian Community</h2>
                <p className="text-lg text-black/80 mb-6 max-w-2xl mx-auto">
                  Connect with others who understand your journey. Share experiences, find support, and build meaningful connections in a safe, nurturing environment.
                </p>
                <Link href="/community" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#8B4513] font-bold rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-white/30">
                  Join Community
                  <ArrowRight className="w-5 h-5" />
                </Link>
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
                      <p className="font-semibold text-black truncate">{chat.name}</p>
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
                <Link href="/listeners">
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Find New Listener
                  </button>
                </Link>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Schedule Session
                </button>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] font-semibold rounded-xl hover:from-[#FFB88C] hover:to-[#FFF8B5] transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Emergency Support
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
