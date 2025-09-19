
"use client"

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/Components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { CommunityService, Category, CommunityPost } from "@/services/communityService";
import CommentModal from "@/Components/CommentModal";
import { 
  Send, 
  Users, 
  MessageCircle, 
  Heart,
  ThumbsUp,
  Reply,
  Loader2
} from "lucide-react";

export default function CommunityPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newMessage, setNewMessage] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentModal, setCommentModal] = useState<{
    isOpen: boolean;
    postId: number | null;
    postTitle: string;
  }>({
    isOpen: false,
    postId: null,
    postTitle: ''
  });
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Determine user type from auth context
  const userType: 'seeker' | 'listener' = (user?.user_type?.toLowerCase() as 'seeker' | 'listener') || 'seeker';

  // Helper function to create a complete post object
  const createCompletePost = (newPost: any): CommunityPost => {
    return {
      id: newPost.id || Date.now() + Math.random(), // Ensure unique ID
      author: newPost.author || {
        u_id: 0,
        full_name: user?.full_name || 'Unknown User',
        email: user?.email || '',
        profile_image: ''
      },
      post_type: newPost.post_type || userType,
      title: newPost.title || '',
      content: newPost.content || '',
      category: newPost.category || null,
      category_name: selectedCategory === 'All' ? 'General' : selectedCategory,
      created_at: newPost.created_at || new Date().toISOString(),
      updated_at: newPost.updated_at || new Date().toISOString(),
      is_verified: newPost.is_verified || false,
      likes_count: newPost.likes_count || 0,
      comments_count: newPost.comments_count || 0,
      is_liked: newPost.is_liked || false,
      comments: newPost.comments || []
    };
  };

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData();
    }
  }, [isAuthenticated]);

  // Auto-scroll to bottom when posts change
  useEffect(() => {
    if (posts.length > 0 && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [posts]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load categories and posts in parallel
      const [categoriesData, postsData] = await Promise.all([
        CommunityService.getCategories().catch(err => {
          console.error('Error loading categories:', err);
          // Return some default categories as fallback
          return [
            { id: 1, name: 'Breakup', description: 'Breakup support', icon: '', supportText: '', slug: 'breakup' },
            { id: 2, name: 'Relationship Issues', description: 'Relationship support', icon: '', supportText: '', slug: 'relationship-issues' },
            { id: 3, name: 'Career Stress', description: 'Career support', icon: '', supportText: '', slug: 'career-stress' },
            { id: 4, name: 'Anxiety', description: 'Anxiety support', icon: '', supportText: '', slug: 'anxiety' },
            { id: 5, name: 'Depression', description: 'Depression support', icon: '', supportText: '', slug: 'depression' },
            { id: 6, name: 'Family Issues', description: 'Family support', icon: '', supportText: '', slug: 'family-issues' }
          ];
        }),
        CommunityService.getCommunityPosts().catch(err => {
          console.error('Error loading posts:', err);
          return [];
        })
      ]);
      
      console.log('Loaded categories:', categoriesData);
      console.log('Loaded posts:', postsData);
      setCategories(categoriesData || []);
      
      // Sort posts by creation date (oldest first, newest at bottom)
      const sortedPosts = (postsData || []).sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setPosts(sortedPosts);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Failed to load community data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category_name === selectedCategory);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || submitting || !isAuthenticated) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Find selected category ID
      const selectedCategoryId = selectedCategory === 'All' 
        ? null 
        : categories.find(cat => cat.name === selectedCategory)?.id || null;
      
      const newPost = await CommunityService.createCommunityPost({
        title: newMessage.trim().substring(0, 100), // Use first 100 chars as title
        content: newMessage.trim(),
        category: selectedCategoryId,
        post_type: userType
      });
      
      console.log('Created post response:', newPost);
      console.log('Current user object:', user);
      
      // Create a complete post object with all necessary fields
      const completePost = createCompletePost(newPost);
      console.log('Complete post object:', completePost);
      console.log('Post ID:', completePost.id);
      
      // Add the new post to the end of the list (newest messages at bottom)
      setPosts(prev => {
        const updatedPosts = [...prev, completePost];
        console.log('Updated posts list:', updatedPosts);
        return updatedPosts;
      });
      setNewMessage('');
      
      // Show success feedback
      console.log('Message sent successfully and added to list');
      
      // Auto-scroll to bottom to show the new message
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);
      
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: number) => {
    if (!isAuthenticated) return;
    
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      
      let response;
      if (post.is_liked) {
        response = await CommunityService.unlikePost(postId);
      } else {
        response = await CommunityService.likePost(postId);
      }
      
      // Update the post in the list
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              likes_count: response.like_count,
              is_liked: response.is_liked
            }
          : p
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Failed to update like. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openCommentModal = (postId: number, postTitle: string) => {
    setCommentModal({
      isOpen: true,
      postId,
      postTitle
    });
  };

  const closeCommentModal = () => {
    setCommentModal({
      isOpen: false,
      postId: null,
      postTitle: ''
    });
  };

  return (
    <DashboardLayout userType={userType}>
      <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#8B4513]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-black">
                  Community
                </h1>
              </div>
              <p className="text-xl text-black/80 max-w-2xl mx-auto">
                Connect, share, and support each other in our safe community space
              </p>
        </div>

            {/* Category Tags */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 mb-6">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Discussion Categories
              </h3>
              <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white shadow-lg'
                  : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
              }`}
            >
              All
            </button>
            {loading ? (
              // Show loading placeholders for categories
              Array.from({ length: 6 }, (_, i) => (
                <div
                  key={`loading-category-${i}`}
                  className="px-4 py-2 rounded-full bg-gray-200 animate-pulse"
                  style={{ width: '100px' }}
                />
              ))
            ) : (
              categories.map((category) => (
                  <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category.name
                        ? 'bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white shadow-lg'
                        : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
                    }`}
                  >
                  {category.name}
                  </button>
              ))
            )}
              </div>
            </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={loadInitialData}
              className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
            
            {/* Messages Area */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-black">
                    {selectedCategory === 'All' ? 'All Discussions' : `${selectedCategory} Discussions`}
                  </h3>
                  <span className="text-sm text-gray-600">
                {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
              </span>
                </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#8B4513]" />
                <span className="ml-2 text-gray-600">Loading discussions...</span>
              </div>
            )}

            {/* Messages List */}
            {!loading && (
              <div ref={messagesContainerRef} className="space-y-2 max-h-96 overflow-y-auto">
                {console.log('Rendering posts:', filteredPosts.length, 'posts')}
                {filteredPosts.map((post, index) => (
                    <div
                    key={post.id || `post-${index}`}
                      className={`p-3 rounded-2xl transition-all duration-200 hover:shadow-md ${
                      post.post_type === 'seeker'
                          ? 'bg-orange-100 border-l-4 border-orange-400'
                          : 'bg-yellow-100 border-l-4 border-yellow-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          post.post_type === 'seeker'
                              ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                              : 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                          }`}>
                          {post.author.full_name.charAt(0).toUpperCase()}
          </div>
        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-black">{post.author.full_name}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            post.post_type === 'seeker'
                                ? 'bg-blue-200 text-blue-800'
                                : 'bg-green-200 text-green-800'
                            }`}>
                            {post.post_type === 'seeker' ? 'Seeker' : 'Listener'}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                            <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                            {post.category_name || 'General'}
                            </span>
          </div>
          
                        <p className="text-gray-800 mb-3 leading-relaxed">{post.content}</p>
                          
                          <div className="flex items-center gap-4">
                            <button
                            onClick={() => handleLike(post.id)}
                              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all duration-200 ${
                              post.is_liked
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                              }`}
                            >
                            <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
                            <span className="text-sm">{post.likes_count}</span>
                            </button>
                            
                          <button 
                            onClick={() => openCommentModal(post.id, post.title)}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                          >
                              <Reply className="w-4 h-4" />
                            <span className="text-sm">{post.comments_count}</span>
                            </button>
                    </div>
                      </div>
                      </div>
                    </div>
                  ))}
                  
                {filteredPosts.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-10 h-10 text-[#8B4513]" />
                      </div>
                    <h3 className="text-xl font-semibold text-black mb-2">No posts yet</h3>
                      <p className="text-gray-600">Be the first to start a discussion in this category!</p>
                      </div>
                    )}
                  </div>
            )}
          </div>
        </div>

            {/* Message Input */}
        {isAuthenticated && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                userType === 'seeker'
                    ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                    : 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                }`}>
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                <div className="flex-1">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share your thoughts with the community..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
                  disabled={submitting}
                  />
            </div>
            
                <button
                  onClick={handleSendMessage}
                disabled={!newMessage.trim() || submitting}
                  className="p-3 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white rounded-full hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                </button>
              </div>
              
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <span>Posting as:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                userType === 'seeker'
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-green-200 text-green-800'
                }`}>
                {userType === 'seeker' ? 'Seeker' : 'Listener'}
                </span>
                <span>•</span>
                <span>Category: {selectedCategory === 'All' ? 'General' : selectedCategory}</span>
              </div>
            </div>
        )}

        {/* Not Authenticated Message */}
        {!isAuthenticated && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-[#8B4513]" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Join the Community</h3>
            <p className="text-gray-600">Please log in to participate in community discussions.</p>
          </div>
        )}
      </div>

      {/* Comment Modal */}
      {commentModal.postId && (
        <CommentModal
          isOpen={commentModal.isOpen}
          onClose={closeCommentModal}
          postId={commentModal.postId}
          postTitle={commentModal.postTitle}
        />
      )}
    </DashboardLayout>
  );
}

