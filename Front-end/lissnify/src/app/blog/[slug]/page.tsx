"use client";

import React, { useState, useEffect,use } from "react";
// import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Eye, Bookmark, Share2, Heart, Star, Sparkles, Calendar, User, Tag } from "lucide-react";
import { getBlogBySlug } from "@/utils/api";
import { API_CONFIG } from "@/config/api";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

// Helper function to estimate read time
const estimateReadTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text.split(' ').length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Helper function to generate random colors and gradients for blog posts
const getRandomBlogStyling = (index) => {
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
      bgGradient: "from-[#E91E63]/15 to-[#9C27B0]/10",
      categoryColor: "text-[#E91E63]",
      categoryBg: "bg-[#E91E63]/10",
      borderColor: "border-[#E91E63]/20"
    },
    {
      bgGradient: "from-[#9C27B0]/15 to-[#FF5722]/10",
      categoryColor: "text-[#9C27B0]",
      categoryBg: "bg-[#9C27B0]/10",
      borderColor: "border-[#9C27B0]/20"
    },
    {
      bgGradient: "from-[#2196F3]/15 to-[#4CAF50]/10",
      categoryColor: "text-[#2196F3]",
      categoryBg: "bg-[#2196F3]/10",
      borderColor: "border-[#2196F3]/20"
    }
  ];
  
  return colorSchemes[index % colorSchemes.length];
};

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        // First try to get blog by slug using the new API
        if (resolvedParams.slug) {
          const response = await getBlogBySlug(resolvedParams.slug);
          
          if (response.success && response.data) {
            setBlog(response.data);
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

  const handleBack = () => {
    router.push('/blog');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.description,
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
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
          className="group flex items-center gap-2 text-black hover:text-[#FF5722] transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-semibold">Back to Blogs</span>
        </button>

        {/* Blog Content */}
        <article className="max-w-4xl mx-auto">
          {/* Blog Header */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/20 overflow-hidden mb-8">
            {/* Featured Image */}
            <div className={`relative h-96 bg-gradient-to-br ${styling.bgGradient} flex items-center justify-center border-b ${styling.borderColor}`}>
              {blog.image ? (
                <img 
                  src={`${API_CONFIG.BASE_URL}/${blog.image}`} 
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-8xl drop-shadow-lg">
                  📝
                </div>
              )}
              
              {/* Floating elements */}
              <div className="absolute top-6 right-6 opacity-20">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="absolute bottom-6 left-6 opacity-15">
                <Star className="w-6 h-6 text-white" />
              </div>
              
              {/* Category Tag */}
              <div className={`absolute top-6 left-6 px-4 py-2 ${styling.categoryBg} ${styling.categoryColor} rounded-full text-sm font-bold border ${styling.borderColor}`}>
                <Tag className="w-4 h-4 inline mr-2" />
                {blog.category?.Category_name || 'Uncategorized'}
              </div>
            </div>

            {/* Blog Meta */}
            <div className="p-8">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-black mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{Math.floor(Math.random() * 5000) + 100} views</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                    isLiked 
                      ? 'bg-red-100 text-red-600 border-2 border-red-200' 
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{isLiked ? 'Liked' : 'Like'}</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                    isBookmarked 
                      ? 'bg-blue-100 text-blue-600 border-2 border-blue-200' 
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-green-50 hover:text-green-500 hover:border-green-200 transition-all duration-300"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-white/20 p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <div className="text-xl leading-relaxed text-black font-medium">
                {blog.description}
              </div>
            </div>

            {/* Author Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4CAF50] to-[#2196F3] rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black">Lissnify Team</h3>
                  <p className="text-gray-600">Mental Health & Wellness Community</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles CTA */}
          <div className="mt-12 text-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-white/20">
              <h3 className="text-2xl font-bold text-black mb-4">
                Discover More Insights
              </h3>
              <p className="text-gray-600 mb-6">
                Explore more articles on mental health, self-care, and wellness.
              </p>
              <button
                onClick={handleBack}
                className="group px-8 py-4 rounded-full text-white font-bold bg-gradient-to-r from-[#4CAF50] to-[#2196F3] hover:from-[#2196F3] hover:to-[#4CAF50] transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  Browse All Blogs
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </div>
          </div>
        </article>
      </div>
      
      <Footer />
    </div>
  );
}
