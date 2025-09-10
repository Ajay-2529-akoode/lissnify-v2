"use client"

import { useState, use } from "react";
import Link from "next/link";
import Navbar from "@/Components/Navbar";
import { 
  ArrowLeft,
  MessageSquare,
  Users,
  Heart,
  Plus,
  MoreVertical,
  Send,
  User,
  Clock
} from "lucide-react";

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
}

const categoryData = {
  "stress-management": {
    title: "Stress Management",
    description: "Share strategies and experiences for managing daily stress, work pressure, and life challenges.",
    color: "from-blue-400 to-blue-600",
    posts: [
      {
        id: "1",
        author: "Sarah Chen",
        avatar: "SC",
        content: "I've been feeling overwhelmed with work lately. Does anyone have tips for managing stress during busy periods?",
        timestamp: "2 hours ago",
        likes: 12,
        replies: 8
      },
      {
        id: "2",
        author: "Mike Rodriguez",
        avatar: "MR",
        content: "Just wanted to share that taking 10-minute breaks every hour has really helped me stay focused and less stressed.",
        timestamp: "5 hours ago",
        likes: 24,
        replies: 15
      }
    ]
  },
  "career-guidance": {
    title: "Career Guidance",
    description: "Discuss career transitions, workplace challenges, and professional development.",
    color: "from-green-400 to-green-600",
    posts: [
      {
        id: "1",
        author: "Alex Thompson",
        avatar: "AT",
        content: "I'm considering a career change but feeling uncertain. Has anyone successfully transitioned to a completely different field?",
        timestamp: "1 day ago",
        likes: 18,
        replies: 12
      }
    ]
  },
  "emotional-support": {
    title: "Emotional Support",
    description: "A safe space to share feelings, seek comfort, and offer support to others.",
    color: "from-pink-400 to-pink-600",
    posts: [
      {
        id: "1",
        author: "Emma Wilson",
        avatar: "EW",
        content: "Today has been really tough. Just needed to share that it's okay to not be okay sometimes.",
        timestamp: "3 hours ago",
        likes: 45,
        replies: 23
      },
      {
        id: "2",
        author: "David Kim",
        avatar: "DK",
        content: "Remember, you're not alone in your struggles. We're all here to support each other.",
        timestamp: "6 hours ago",
        likes: 32,
        replies: 18
      }
    ]
  },
  "relationships": {
    title: "Relationships",
    description: "Navigate relationship challenges, communication, and personal connections.",
    color: "from-purple-400 to-purple-600",
    posts: [
      {
        id: "1",
        author: "Lisa Park",
        avatar: "LP",
        content: "How do you set healthy boundaries in relationships without feeling guilty?",
        timestamp: "1 day ago",
        likes: 28,
        replies: 19
      }
    ]
  },
  "mindfulness": {
    title: "Mindfulness",
    description: "Explore meditation, mindfulness practices, and inner peace techniques.",
    color: "from-yellow-400 to-yellow-600",
    posts: [
      {
        id: "1",
        author: "James Miller",
        avatar: "JM",
        content: "Started practicing daily meditation 2 weeks ago. The difference in my mental clarity is amazing!",
        timestamp: "2 days ago",
        likes: 36,
        replies: 14
      }
    ]
  },
  "personal-growth": {
    title: "Personal Growth",
    description: "Share your journey of self-improvement, goal-setting, and personal development.",
    color: "from-orange-400 to-orange-600",
    posts: []
  }
};

export default function CommunityTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const [newPost, setNewPost] = useState("");
  
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);
  const category = categoryData[resolvedParams.topic as keyof typeof categoryData];
  
  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C]">
        <Navbar />
        <div className="container mx-auto px-6 py-20 max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Category Not Found</h1>
          <p className="text-xl text-black/70 mb-8">The category you're looking for doesn't exist.</p>
          <Link 
            href="/community" 
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Community
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitPost = () => {
    if (newPost.trim()) {
      // In a real app, this would submit to the backend
      setNewPost("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C]">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/community" 
            className="inline-flex items-center gap-2 text-[#8B4513] hover:text-black transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community
          </Link>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            <h1 className="text-3xl font-bold text-black mb-2">{category.title}</h1>
            <p className="text-lg text-black/70">{category.description}</p>
          </div>
        </div>

        {/* Create New Post */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 mb-8">
          <h3 className="text-xl font-bold text-black mb-4">Share Your Thoughts</h3>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 resize-none"
                rows={3}
              />
              <div className="flex justify-between items-center mt-3">
                <div className="text-sm text-gray-500">
                  {newPost.length}/500 characters
                </div>
                <button
                  onClick={handleSubmitPost}
                  disabled={!newPost.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {category.posts.length > 0 ? (
            category.posts.map((post) => (
              <div key={post.id} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-semibold text-black">{post.author}</h4>
                      <span className="text-sm text-gray-500">{post.timestamp}</span>
                    </div>
                    <p className="text-black/80 mb-4 leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-[#8B4513] transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-[#8B4513] transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">{post.replies}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-[#8B4513] transition-colors">
                        <Send className="w-4 h-4" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/50 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-[#8B4513]" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-6">Be the first to share your thoughts in this category!</p>
              <button
                onClick={() => document.querySelector('textarea')?.focus()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Create First Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


