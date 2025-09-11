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
  Filter
} from "lucide-react";

export default function SeekerCommunityPage() {

  // Mock community posts data
  const communityPosts = [
    {
      id: 1,
      author: "Sarah M.",
      avatar: "SM",
      timeAgo: "2 hours ago",
      title: "Coping with Anxiety During Work Presentations",
      content: "I've been struggling with anxiety before presentations at work. Does anyone have tips for managing this? I've tried deep breathing but still feel overwhelmed.",
      likes: 12,
      comments: 8,
      category: "Anxiety",
      isLiked: false
    },
    {
      id: 2,
      author: "Mike R.",
      avatar: "MR",
      timeAgo: "5 hours ago",
      title: "Building Healthy Boundaries in Relationships",
      content: "After years of people-pleasing, I'm finally learning to set boundaries. It's scary but so liberating. Anyone else on this journey?",
      likes: 24,
      comments: 15,
      category: "Relationships",
      isLiked: true
    },
    {
      id: 3,
      author: "Priya K.",
      avatar: "PK",
      timeAgo: "1 day ago",
      title: "Gratitude Practice - What's Working for You?",
      content: "I started a daily gratitude journal last month and it's been amazing for my mental health. What gratitude practices have helped you?",
      likes: 18,
      comments: 11,
      category: "Wellness",
      isLiked: false
    },
    {
      id: 4,
      author: "Alex T.",
      avatar: "AT",
      timeAgo: "2 days ago",
      title: "Career Change at 30 - Feeling Overwhelmed",
      content: "I'm considering a major career change but feel paralyzed by fear. How do you know when it's the right time to take a leap?",
      likes: 31,
      comments: 22,
      category: "Career",
      isLiked: true
    }
  ];

  const categories = ["All", "Anxiety", "Relationships", "Wellness", "Career", "Depression", "Loneliness"];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C]">
        <Navbar />

        <div className="flex pt-20">
          {/* Left Sidebar */}
          <DashboardSidebar 
            userType="seeker"
          />

          {/* Main Content Area */}
          <div className="md:ml-64 flex-1 p-4 md:p-8">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                  Community
                </h1>
                <p className="text-xl text-black/80 max-w-2xl mx-auto">
                  Connect with others, share experiences, and find support in our community
                </p>
              </div>

              {/* Create Post Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold">
                    JS
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Share your thoughts with the community..."
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
                      <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold">
                        {post.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-black">{post.author}</h3>
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
