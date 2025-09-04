"use client"

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/Components/Navbar";
import DashboardSidebar from "@/Components/DashboardSidebar";
import ProtectedRoute from "@/Components/ProtectedRoute";
import { 
  ArrowRight, 
  Heart, 
  MessageCircle, 
  Share2, 
  ThumbsUp,
  Users,
  Plus,
  Search,
  Filter,
  Star,
  Award
} from "lucide-react";

export default function ListenerCommunityPage() {

  // Mock community posts data for listeners
  const communityPosts = [
    {
      id: 1,
      author: "Dr. Sarah Chen",
      avatar: "SC",
      timeAgo: "1 hour ago",
      title: "Effective Techniques for Managing Client Anxiety",
      content: "I've found that grounding techniques work really well with anxious clients. What methods have you found most effective? I'd love to share some resources.",
      likes: 15,
      comments: 7,
      category: "Professional Tips",
      isLiked: false,
      isVerified: true
    },
    {
      id: 2,
      author: "Michael Rodriguez",
      avatar: "MR",
      timeAgo: "3 hours ago",
      title: "Building Trust with New Seekers",
      content: "Starting with a new seeker can be challenging. How do you establish that initial connection and build trust? I'm always looking to improve my approach.",
      likes: 22,
      comments: 12,
      category: "Professional Development",
      isLiked: true,
      isVerified: false
    },
    {
      id: 3,
      author: "Dr. Priya Patel",
      avatar: "PP",
      timeAgo: "6 hours ago",
      title: "Self-Care for Mental Health Professionals",
      content: "We often focus so much on helping others that we forget to care for ourselves. What self-care practices do you find most beneficial?",
      likes: 28,
      comments: 18,
      category: "Self-Care",
      isLiked: false,
      isVerified: true
    },
    {
      id: 4,
      author: "Alex Thompson",
      avatar: "AT",
      timeAgo: "1 day ago",
      title: "Handling Difficult Conversations",
      content: "Sometimes seekers share very challenging experiences. How do you maintain your composure and provide the best support during these moments?",
      likes: 19,
      comments: 14,
      category: "Professional Tips",
      isLiked: true,
      isVerified: false
    }
  ];

  const categories = ["All", "Professional Tips", "Professional Development", "Self-Care", "Resources", "Case Studies", "General Discussion"];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C]">
        <Navbar />

        <div className="flex pt-20">
          {/* Left Sidebar */}
          <DashboardSidebar 
            userType="listener"
          />

          {/* Main Content Area */}
          <div className="md:ml-64 flex-1 p-4 md:p-8">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                  Listener Community
                </h1>
                <p className="text-xl text-black/80 max-w-2xl mx-auto">
                  Connect with fellow listeners, share professional insights, and grow together
                </p>
              </div>

              {/* Create Post Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold">
                    DL
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Share professional insights or ask for advice..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Post
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                      category === "All" 
                        ? "bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white" 
                        : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Community Posts */}
              <div className="space-y-6">
                {communityPosts.map((post) => (
                  <div key={post.id} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold">
                          {post.avatar}
                        </div>
                        {post.isVerified && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Award className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-black">{post.author}</h3>
                          {post.isVerified && (
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{post.timeAgo}</span>
                          <span className="text-xs px-2 py-1 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] rounded-full">
                            {post.category}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-black mb-2">{post.title}</h4>
                        <p className="text-gray-700 mb-4">{post.content}</p>
                        <div className="flex items-center gap-6">
                          <button className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-200 ${
                            post.isLiked 
                              ? "bg-red-100 text-red-600" 
                              : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                          }`}>
                            <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all duration-200">
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center">
                <button className="px-8 py-3 bg-white/70 text-[#8B4513] font-semibold rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg border border-[#FFB88C]/30">
                  Load More Posts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
