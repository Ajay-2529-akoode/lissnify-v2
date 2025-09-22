"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Tag, Search, Filter, ArrowRight, Heart, Eye } from "lucide-react";
import { getBlogs, getCategories } from "@/utils/api";
import { API_CONFIG } from "@/config/api";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

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

interface Category {
  id: number;
  Category_name: string;
  description: string;
  icon: string;
  slug: string;
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to estimate read time
const estimateReadTime = (text: string): string => {
  const wordsPerMinute = 200;
  const wordCount = text.split(' ').length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
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

export default function BlogListingPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Fetch blogs and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [blogsResponse, categoriesResponse] = await Promise.all([
          getBlogs(),
          getCategories()
        ]);

        if (blogsResponse.success) {
          setBlogs(blogsResponse.data || []);
        } else {
          setError(blogsResponse.error || 'Failed to fetch blogs');
        }

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data || []);
        }
      } catch (err) {
        setError('An error occurred while fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Transform blog data to match the expected format
  const transformedBlogs = blogs.map((blog, index) => {
    const styling = getRandomBlogStyling(index);
    return {
      id: blog.id,
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.description,
      category: blog.category?.Category_name || 'Uncategorized',
      image: blog.image,
      date: formatDate(blog.date),
      readTime: estimateReadTime(blog.description),
      ...styling
    };
  });

  // Get unique categories from blogs
  const availableCategories = ["All", ...new Set(transformedBlogs.map(blog => blog.category))];

  // Filter and sort blogs
  const filteredAndSortedBlogs = transformedBlogs
    .filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

  // Handle blog click navigation
  const handleBlogClick = (blogSlug: string) => {
    console.log("Navigating to blog:", blogSlug);
    router.push(`/blog/${blogSlug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5722] mx-auto mb-4"></div>
          <p className="text-lg text-black">Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto">
            <p className="font-bold text-lg">Error loading blogs</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] relative overflow-hidden">
      <Navbar />
      
      {/* Decorative background elements */}
      <div className="absolute top-16 left-8 w-44 h-44 bg-gradient-to-br from-[#4CAF50]/6 to-[#2196F3]/4 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-12 w-52 h-52 bg-gradient-to-br from-[#E91E63]/6 to-[#9C27B0]/4 rounded-full blur-3xl animate-pulse delay-700"></div>
      <div className="absolute top-1/3 right-1/5 w-36 h-36 bg-gradient-to-br from-[#FF9800]/5 to-[#FF5722]/3 rounded-full blur-2xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Mental Health
            <span className="block bg-gradient-to-r from-[#FF5722] to-[#FF9800] bg-clip-text text-transparent">
              Resources & Insights
            </span>
          </h1>
          <p className="text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Discover articles, guides, and resources to support your mental wellness journey. 
            Expert insights, practical tips, and community stories to help you thrive.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722] transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722] transition-all duration-300 bg-white"
              >
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722] transition-all duration-300 bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-lg text-black/70">
            {filteredAndSortedBlogs.length} article{filteredAndSortedBlogs.length !== 1 ? 's' : ''} found
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {filteredAndSortedBlogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-black mb-2">No articles found</h3>
              <p className="text-black/70 mb-6">
                {searchTerm || selectedCategory !== "All" 
                  ? "Try adjusting your search or filter criteria."
                  : "No articles are available at the moment."
                }
              </p>
              {(searchTerm || selectedCategory !== "All") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white font-semibold rounded-xl hover:from-[#FF9800] hover:to-[#FF5722] transition-all duration-300"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredAndSortedBlogs.map((post, index) => (
              <article
                key={post.id}
                className={`group bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] border-2 ${post.borderColor} hover:border-opacity-50 overflow-hidden cursor-pointer`}
                onClick={() => handleBlogClick(post.slug)}
              >
                {/* Post Header with Image */}
                <div className={`relative h-48 bg-gradient-to-br ${post.bgGradient} overflow-hidden`}>
                  {post.image ? (
                    <img
                      src={`${API_CONFIG.BASE_URL}/${post.image}`}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-6xl drop-shadow-lg">📝</div>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 ${post.categoryBg} ${post.categoryColor} rounded-full text-sm font-semibold backdrop-blur-sm`}>
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <ArrowRight className="w-6 h-6 text-[#FF5722]" />
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#FF5722] transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Post Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Call to Action Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 p-12 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Stay Updated with Our Latest Insights</h2>
          <p className="text-lg text-black/70 mb-8 max-w-2xl mx-auto">
            Get the latest mental health resources, wellness tips, and community stories delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722] transition-all duration-300"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white font-semibold rounded-xl hover:from-[#FF9800] hover:to-[#FF5722] transition-all duration-300 transform hover:scale-105">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}