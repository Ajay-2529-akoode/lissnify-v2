"use client"

import { useState, useEffect } from "react";
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
  Loader2
} from "lucide-react";
import ShareDropdown from "@/Components/ShareDropdown";
import CommentModal from "@/Components/CommentModal";
import { CommunityService, Category, CommunityPost } from "@/services/communityService";

export default function SeekerCommunityPage() {
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<number | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<{ id: number; title: string } | null>(null);

  // Load categories and posts on component mount
  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load categories
      const categoriesData = await CommunityService.getCategories();
      setCategories(categoriesData);
      
      // Load community posts
      const postsData = await CommunityService.getCommunityPosts('seeker', selectedCategory || undefined);
      setCommunityPosts(postsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsCreatingPost(true);
      setError(null);
      
      const newPost = await CommunityService.createCommunityPost({
        title: newPostTitle,
        content: newPostContent,
        category: newPostCategory,
        post_type: 'seeker'
      });
      
      // Add the new post to the beginning of the list
      setCommunityPosts(prev => [newPost, ...prev]);
      
      // Reset form
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostCategory(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      console.error('Error creating post:', err);
    } finally {
      setIsCreatingPost(false);
    }
  };

  const handleLikePost = async (postId: number, isLiked: boolean) => {
    try {
      if (isLiked) {
        await CommunityService.unlikePost(postId);
      } else {
        await CommunityService.likePost(postId);
      }
      
      // Update the post in the list
      setCommunityPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: !isLiked,
              likes_count: isLiked ? post.likes_count - 1 : post.likes_count + 1
            }
          : post
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleOpenComments = (postId: number, postTitle: string) => {
    setSelectedPostForComments({ id: postId, title: postTitle });
    setCommentModalOpen(true);
  };

  const handleCloseComments = () => {
    setCommentModalOpen(false);
    setSelectedPostForComments(null);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-lg">Loading community...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Create Post Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold">
                      JS
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Post title..."
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 mb-2"
                      />
                      <textarea
                        placeholder="Share your thoughts with the community..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 resize-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <select
                      value={newPostCategory || ''}
                      onChange={(e) => setNewPostCategory(e.target.value ? parseInt(e.target.value) : null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    >
                      <option value="">Select a category (optional)</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    
                    <button 
                      onClick={handleCreatePost}
                      disabled={isCreatingPost}
                      className="px-6 py-3 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreatingPost ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      {isCreatingPost ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleCategoryFilter(null)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === null 
                      ? "bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white" 
                      : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.id)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                      selectedCategory === category.id 
                        ? "bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white" 
                        : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Community Posts */}
              <div className="space-y-6">
                {communityPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600">No posts found. Be the first to share something!</p>
                  </div>
                ) : (
                  communityPosts.map((post) => (
                    <div key={post.id} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#CD853F] to-[#D2691E] rounded-full flex items-center justify-center text-white font-bold">
                          {getInitials(post.author.full_name)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-black">{post.author.full_name}</h3>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{formatTimeAgo(post.created_at)}</span>
                            {post.category_name && (
                              <span className="text-xs px-2 py-1 bg-gradient-to-r from-[#FFF8B5] to-[#FFB88C] text-[#8B4513] rounded-full">
                                {post.category_name}
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-bold text-black mb-2">{post.title}</h4>
                          <p className="text-gray-700 mb-4">{post.content}</p>
                          <div className="flex items-center gap-6">
                            <button 
                              onClick={() => handleLikePost(post.id, post.is_liked)}
                              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-200 ${
                                post.is_liked 
                                  ? "bg-red-100 text-red-600" 
                                  : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${post.is_liked ? "fill-current" : ""}`} />
                              <span>{post.likes_count}</span>
                            </button>
                            <button 
                              onClick={() => handleOpenComments(post.id, post.title)}
                              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.comments_count}</span>
                            </button>
                            <ShareDropdown
                              url={typeof window !== 'undefined' ? window.location.href : ''}
                              title={`Community Post by ${post.author.full_name}`}
                              description={post.content}
                              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Load More */}
              {communityPosts.length > 0 && (
                <div className="text-center">
                  <button className="px-8 py-3 bg-white/70 text-[#8B4513] font-semibold rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg border border-[#FFB88C]/30">
                    Load More Posts
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {commentModalOpen && selectedPostForComments && (
        <CommentModal
          isOpen={commentModalOpen}
          onClose={handleCloseComments}
          postId={selectedPostForComments.id}
          postTitle={selectedPostForComments.title}
        />
      )}
    </ProtectedRoute>
  );
}
