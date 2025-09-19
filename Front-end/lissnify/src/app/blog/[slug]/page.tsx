"use client";
 
import React, { useState, useEffect, use } from "react";
// import "./blog-detail.css";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Eye, Bookmark, Share2, Heart, Star, Sparkles, Calendar, User, Tag, ArrowRight } from "lucide-react";
import { getBlogBySlug, toggleBlogLike, getBlogLikes, getBlogs } from "@/utils/api";
import { API_CONFIG } from "@/config/api";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import ShareDropdown from "@/Components/ShareDropdown";
 
// Types
interface Blog {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category?: {
    Category_name: string;
  };
}
 
interface RecentPost {
  id: number;
  slug: string;
  title: string;
  image: string;
  date: string;
  category: string;
  excerpt?: string;
}
 
// Helper function to estimate read time
const estimateReadTime = (text: string): string => {
  const wordsPerMinute = 200;
  const wordCount = text.split(' ').length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};
 
// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
 
// Helper function to generate random colors and gradients for blog posts
const getRandomBlogStyling = (index: number) => {
  const colorSchemes = [
    {
      bgGradient: "from-[#FF5722]/15 to-[#FF9800]/10",
      categoryColor: "text-[#FF5722]",
      categoryBg: "bg-[#FF5722]/10",
      borderColor: "border-[#FF5722]/20"
    },
    {
      bgGradient: "from-[#FF9800]/15 to-[#FF5722]/10",
      categoryColor: "text-[#FF9800]",
      categoryBg: "bg-[#FF9800]/10",
      borderColor: "border-[#FF9800]/20"
    },
    {
      bgGradient: "from-[#4CAF50]/15 to-[#2196F3]/10",
      categoryColor: "text-[#4CAF50]",
      categoryBg: "bg-[#4CAF50]/10",
      borderColor: "border-[#4CAF50]/20"
    },
    {
      bgGradient: "from-[#2196F3]/15 to-[#9C27B0]/10",
      categoryColor: "text-[#2196F3]",
      categoryBg: "bg-[#2196F3]/10",
      borderColor: "border-[#2196F3]/20"
    },
    {
      bgGradient: "from-[#9C27B0]/15 to-[#E91E63]/10",
      categoryColor: "text-[#9C27B0]",
      categoryBg: "bg-[#9C27B0]/10",
      borderColor: "border-[#9C27B0]/20"
    },
    {
      bgGradient: "from-[#E91E63]/15 to-[#FF5722]/10",
      categoryColor: "text-[#E91E63]",
      categoryBg: "bg-[#E91E63]/10",
      borderColor: "border-[#E91E63]/20"
    }
  ];
 
  return colorSchemes[index % colorSchemes.length];
};
 
export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [recentPostsLoading, setRecentPostsLoading] = useState(false);
  const [fallbackPosts, setFallbackPosts] = useState<RecentPost[]>([]);
  const [showFallback, setShowFallback] = useState(false);
 
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        // First try to get blog by slug using the new API
        if (resolvedParams.slug) {
          const response = await getBlogBySlug(resolvedParams.slug);
         
          if (response.success && response.data) {
            setBlog(response.data);
            // Fetch like information for this blog
            await fetchBlogLikes(response.data.id);
            // Fetch recent posts
            await fetchRecentPosts(response.data.id, response.data.category?.Category_name);
          } else {
            setError(response.error || 'Blog not found');
          }
        } else {
          setError('Failed to fetch blog');
        }
      } catch (err) {
        setError('An error occurred while fetching the blog');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };
 
    if (resolvedParams.slug) {
      fetchBlog();
    }
  }, [resolvedParams.slug]);
 
  const fetchBlogLikes = async (blogId: number) => {
    try {
      const response = await getBlogLikes(blogId);
      if (response.success) {
        setLikeCount(response.data?.count || 0);
        setIsLiked(response.data?.is_liked || false);
      }
    } catch (err) {
      console.error('Error fetching blog likes:', err);
    }
  };
 
  const fetchRecentPosts = async (currentBlogId: number, currentCategory?: string) => {
    try {
      setRecentPostsLoading(true);
      const response = await getBlogs();
     
      if (response.success) {
        const blogsData = response.data || [];
       
        // Filter out current blog
        let filteredPosts = blogsData.filter((post: any) => post.id !== currentBlogId);
       
        // If there's a category, prioritize posts from the same category
        if (currentCategory) {
          const sameCategoryPosts = filteredPosts.filter((post: any) =>
            post.category?.Category_name === currentCategory
          );
          const otherPosts = filteredPosts.filter((post: any) =>
            post.category?.Category_name !== currentCategory
          );
          filteredPosts = [...sameCategoryPosts, ...otherPosts];
        }
       
        // Sort by date (most recent first)
        const sortedPosts = filteredPosts
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
       
        // Transform posts to RecentPost format
        const transformedPosts = sortedPosts.map((post: any) => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          image: post.image,
          date: formatDate(post.date),
          category: post.category?.Category_name || 'Uncategorized',
          excerpt: post.description || ''
        }));
       
        // Check if we have recent posts (same category or recent posts)
        const recentPostsFromSameCategory = transformedPosts.filter((post: any) =>
          currentCategory && post.category === currentCategory
        );
       
        if (recentPostsFromSameCategory.length > 0) {
          // Show recent posts from same category
          setRecentPosts(recentPostsFromSameCategory.slice(0, 4));
          setShowFallback(false);
        } else if (transformedPosts.length > 0) {
          // Show recent posts from all categories
          setRecentPosts(transformedPosts.slice(0, 4));
          setShowFallback(false);
        } else {
          // No recent posts available, prepare fallback
          setRecentPosts([]);
          setFallbackPosts(transformedPosts.slice(0, 4));
          setShowFallback(true);
        }
      } else {
        // API failed, prepare fallback
        setRecentPosts([]);
        setFallbackPosts([]);
        setShowFallback(true);
      }
    } catch (err) {
      console.error('Error fetching recent posts:', err);
      // On error, prepare fallback
      setRecentPosts([]);
      setFallbackPosts([]);
      setShowFallback(true);
    } finally {
      setRecentPostsLoading(false);
    }
  };
 
  const handleBack = () => {
    router.push('/blog');
  };
 
  const handleLike = async () => {
    if (!blog || likeLoading) return;
   
    try {
      setLikeLoading(true);
      const response = await toggleBlogLike(blog.id);
     
      if (response.success) {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      } else {
        console.error('Failed to toggle like:', response.error);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('Failed to update like. Please try again.');
    } finally {
      setLikeLoading(false);
    }
  };
 
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };
 
  const handleRecentPostClick = (slug: string) => {
    router.push(`/blog/${slug}`);
  };
 
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5722] mx-auto mb-4"></div>
          <p className="text-lg text-black">Loading blog...</p>
        </div>
      </div>
    );
  }
 
  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto">
            <p className="font-bold text-lg">Error</p>
            <p className="text-sm">{error || 'Blog not found'}</p>
            <button
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-[#FF5722] text-white rounded-lg hover:bg-[#FF5722]/90 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
 
  const styling = getRandomBlogStyling(blog.id);
  const readTime = estimateReadTime(blog.description);
  const formattedDate = formatDate(blog.date);
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] relative overflow-hidden">
      <Navbar />
     
      {/* Decorative background elements */}
      <div className="absolute top-16 left-8 w-44 h-44 bg-gradient-to-br from-[#4CAF50]/6 to-[#2196F3]/4 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-12 w-52 h-52 bg-gradient-to-br from-[#E91E63]/6 to-[#9C27B0]/4 rounded-full blur-3xl animate-pulse delay-700"></div>
      <div className="absolute top-1/3 right-1/5 w-36 h-36 bg-gradient-to-br from-[#FF9800]/5 to-[#FF5722]/3 rounded-full blur-2xl animate-pulse delay-1000"></div>
 
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="group flex items-center gap-2 text-black/70 hover:text-black transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Blogs</span>
        </button>
 
        {/* Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Main Content - 70% width */}
          <main className="lg:w-[70%] animate-fade-in-up">
            <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden card-hover">
              {/* Blog Header */}
              <header className="p-8 border-b border-gray-100">
                {/* Category Tag */}
                <div className="mb-6">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 ${styling.categoryBg} ${styling.categoryColor} rounded-full text-sm font-semibold`}>
                    <Tag className="w-4 h-4" />
                    {blog.category?.Category_name || 'Uncategorized'}
                  </span>
                </div>
 
                {/* Blog Title with Like & Share */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                  <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight tracking-tight flex-1">
                    {blog.title}
                  </h1>
                 
                  {/* Like & Share Buttons */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={handleLike}
                      disabled={likeLoading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        isLiked
                          ? 'bg-red-50 text-red-600 border-2 border-red-200'
                          : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                      } ${likeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''} ${likeLoading ? 'animate-pulse' : ''}`} />
                      <span className="hidden sm:inline">
                        {likeLoading ? 'Updating...' : (isLiked ? 'Liked' : 'Like')}
                        {likeCount > 0 && ` (${likeCount})`}
                      </span>
                      {likeCount > 0 && <span className="sm:hidden">({likeCount})</span>}
                    </button>
 
                    <ShareDropdown
                      url={typeof window !== 'undefined' ? window.location.href : ''}
                      title={blog?.title || ''}
                      description={blog?.description || ''}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all duration-300"
                    />
                  </div>
                </div>
               
                {/* Blog Meta */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">{readTime}</span>
                  </div>
                </div>
              </header>
 
              {/* Featured Image */}
              <div className="px-8 py-6">
                <div className={`relative h-80 md:h-96 bg-gradient-to-br ${styling.bgGradient} rounded-xl overflow-hidden`}>
                  {blog.image ? (
                    <img
                      src={`${API_CONFIG.BASE_URL}/${blog.image}`}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-6xl drop-shadow-lg">
                        📝
                      </div>
                    </div>
                  )}
                 
                  {/* Floating elements */}
                  <div className="absolute top-4 right-4 opacity-20">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute bottom-4 left-4 opacity-15">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
 
              {/* Blog Content */}
              <div className="px-8 pb-8">
                <div className="prose prose-lg max-w-none">
                  <div className="text-lg leading-relaxed text-gray-800 font-normal">
                    {blog.description}
                  </div>
                </div>
              </div>
            </article>
          </main>
 
          {/* Sidebar - 30% width */}
          <aside className="lg:w-[30%]">
            <div className="sticky top-8 space-y-6">
              {/* Author Box */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 card-hover">
                <h3 className="text-lg font-bold text-gray-900 mb-4">About the Author</h3>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5] rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-black" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">Lissnify Team</h4>
                    <p className="text-sm text-gray-600 font-medium mb-2">Mental Health & Wellness Community</p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Dedicated to providing support, resources, and insights for mental wellness.
                    </p>
                  </div>
                </div>
              </div>
 
              {/* Recent Posts */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 card-hover">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {showFallback ? 'Other Posts' : 'Recent Posts'}
                </h3>
                {recentPostsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="flex items-center gap-3 animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (showFallback ? fallbackPosts : recentPosts).length > 0 ? (
                  <div className="space-y-4">
                    {(showFallback ? fallbackPosts : recentPosts).map((post) => (
                      <div
                        key={post.id}
                        onClick={() => handleRecentPostClick(post.slug)}
                        className="flex items-start gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                      >
                        <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          {post.image ? (
                            <img
                              src={`${API_CONFIG.BASE_URL}/${post.image}`}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              📝
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#FFB88C] transition-colors duration-200 line-clamp-2 mb-1">
                            {post.title}
                          </h4>
                          <p className="text-xs text-gray-500">{post.date}</p>
                          <span className="inline-block text-xs text-[#FFB88C] font-medium mt-1">
                            {post.category}
                          </span>
                          {post.excerpt && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {post.excerpt.length > 80
                                ? `${post.excerpt.substring(0, 80)}...`
                                : post.excerpt
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No posts available</p>
                )}
              </div>
 
              {/* Related Articles / Discover More */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 card-hover">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Discover More Insights</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Explore more articles on mental health, self-care, and wellness to continue your journey.
                </p>
                <button
                  onClick={handleBack}
                  className="group w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-black font-semibold bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5] hover:from-[#FFF8B5] hover:to-[#FFB88C] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg btn-hover"
                >
                  <span>Browse All Blogs</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
 
              {/* Consult Professional CTA */}
              <div className="bg-white rounded-xl border border-[#4CAF50]/20 p-6 card-hover">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Need Professional Support?</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  Connect with expert therapists and mental health professionals for personalized support.
                </p>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-black font-semibold bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5] hover:from-[#FFF8B5] hover:to-[#FFB88C] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg btn-hover">
                  <User className="w-4 h-4" />
                  <span>Consult Now</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
     
      <Footer />
    </div>
  );
}