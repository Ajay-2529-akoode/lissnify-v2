"use client";
import React, { useState } from "react";
import { BookOpen, Heart, Brain, Shield, Users, ArrowRight, Clock, Eye, Bookmark, Sparkles, Star, Coffee, Sunrise, Moon, Flower2 } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Understanding Your Emotional Patterns",
    excerpt: "Learn to recognize and navigate the cycles of your emotions with gentle, evidence-based techniques that honor your journey.",
    category: "Emotional Intelligence",
    readTime: "5 min read",
    views: "2.3k views",
    image: "🌸",
    bgGradient: "from-[#E91E63]/15 to-[#9C27B0]/10",
    categoryColor: "text-[#E91E63]",
    categoryBg: "bg-[#E91E63]/10",
    borderColor: "border-[#E91E63]/20"
  },
  {
    id: 2,
    title: "Creating Safe Spaces for Mental Wellness",
    excerpt: "Practical steps to build environments—both physical and emotional—where healing can flourish naturally.",
    category: "Self-Care",
    readTime: "7 min read",
    views: "1.8k views",
    image: "🌿",
    bgGradient: "from-[#4CAF50]/15 to-[#2196F3]/10",
    categoryColor: "text-[#4CAF50]",
    categoryBg: "bg-[#4CAF50]/10",
    borderColor: "border-[#4CAF50]/20"
  },
  {
    id: 3,
    title: "The Science of Human Connection",
    excerpt: "Why authentic relationships are fundamental to mental health, and how to nurture them with intention and care.",
    category: "Mental Health",
    readTime: "6 min read",
    views: "3.1k views",
    image: "💝",
    bgGradient: "from-[#FF9800]/15 to-[#FF5722]/10",
    categoryColor: "text-[#FF9800]",
    categoryBg: "bg-[#FF9800]/10",
    borderColor: "border-[#FF9800]/20"
  },
  {
    id: 4,
    title: "Mindful Breathing for Anxious Moments",
    excerpt: "Simple, effective breathing techniques you can use anywhere to find calm in the storm of overwhelming feelings.",
    category: "Wellness Tools",
    readTime: "4 min read",
    views: "4.2k views",
    image: "🌺",
    bgGradient: "from-[#9C27B0]/15 to-[#E91E63]/10",
    categoryColor: "text-[#9C27B0]",
    categoryBg: "bg-[#9C27B0]/10",
    borderColor: "border-[#9C27B0]/20"
  },
  {
    id: 5,
    title: "Building Resilience Through Community",
    excerpt: "How shared experiences and mutual support create the foundation for lasting emotional strength and growth.",
    category: "Community",
    readTime: "8 min read",
    views: "2.7k views",
    image: "🌻",
    bgGradient: "from-[#2196F3]/15 to-[#4CAF50]/10",
    categoryColor: "text-[#2196F3]",
    categoryBg: "bg-[#2196F3]/10",
    borderColor: "border-[#2196F3]/20"
  },
  {
    id: 6,
    title: "Gentle Self-Compassion Practices",
    excerpt: "Transform your inner dialogue with proven techniques for treating yourself with the kindness you deserve.",
    category: "Self-Care",
    readTime: "6 min read",
    views: "1.9k views",
    image: "🦋",
    bgGradient: "from-[#FF5722]/15 to-[#FF9800]/10",
    categoryColor: "text-[#FF5722]",
    categoryBg: "bg-[#FF5722]/10",
    borderColor: "border-[#FF5722]/20"
  }
];

const resourceCategories = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Mental Health",
    count: "24 articles",
    color: "text-[#E91E63]",
    bg: "bg-[#E91E63]/10",
    border: "border-[#E91E63]/20"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Self-Care",
    count: "18 articles",
    color: "text-[#4CAF50]",
    bg: "bg-[#4CAF50]/10",
    border: "border-[#4CAF50]/20"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Community",
    count: "12 articles",
    color: "text-[#FF9800]",
    bg: "bg-[#FF9800]/10",
    border: "border-[#FF9800]/20"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Wellness Tools",
    count: "15 articles",
    color: "text-[#9C27B0]",
    bg: "bg-[#9C27B0]/10",
    border: "border-[#9C27B0]/20"
  }
];

export default function ResourcesBlogPreview() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredPost, setHoveredPost] = useState(null);

  const categories = ["All", "Mental Health", "Self-Care", "Community", "Wellness Tools", "Emotional Intelligence"];

  const filteredPosts = activeCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <section className="bg-gradient-to-br from-[#FFF8B5] to-[#FFB88C] py-10 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-16 left-8 w-44 h-44 bg-gradient-to-br from-[#4CAF50]/6 to-[#2196F3]/4 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-12 w-52 h-52 bg-gradient-to-br from-[#E91E63]/6 to-[#9C27B0]/4 rounded-full blur-3xl animate-pulse delay-700"></div>
      <div className="absolute top-1/3 right-1/5 w-36 h-36 bg-gradient-to-br from-[#FF9800]/5 to-[#FF5722]/3 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 right-24 opacity-15 animate-bounce">
        <BookOpen className="w-10 h-10 text-[#4CAF50]" />
      </div>
      <div className="absolute bottom-32 left-24 opacity-20 animate-pulse">
        <Heart className="w-8 h-8 text-[#E91E63]" />
      </div>
      <div className="absolute top-1/2 left-12 opacity-15 animate-bounce delay-500">
        <Sparkles className="w-6 h-6 text-[#FF9800]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          {/* <div className="inline-flex items-center gap-3 mb-8 px-8 py-4 rounded-full bg-white/95 backdrop-blur-sm border-2 border-[#4CAF50]/20 shadow-lg">
            <BookOpen className="w-5 h-5 text-[#4CAF50] animate-pulse" />
            <span className="text-[#2E2E2E] font-semibold text-sm tracking-wider">FREE RESOURCES</span>
            <Heart className="w-5 h-5 text-[#E91E63] animate-pulse" />
          </div> */}
          
          {/* <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#2E2E2E] mb-8 leading-tight">
            Nurture Your 
            <span className="block text-transparent bg-gradient-to-r from-[#4CAF50] via-[#E91E63] to-[#9C27B0] bg-clip-text font-extrabold">
              Well-being
            </span>
          </h2> */}

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent mb-6 leading-tight">
            Blogs
          </h2>
          
          <div className="max-w-4xl mx-auto mb-6">
            <p className="text-2xl md:text-2xl text-black leading-relaxed font-medium mb-4">
              Discover gentle, evidence-based insights on mental health, self-care, and emotional wellness. Created with care by our community of healers and helpers.
              {/* <span className="font-bold text-black px-3 py-1 bg-[#FFB88C] rounded-lg mx-1 border border-[#FFB88C]/30"> Created with care</span>  */}
              
            </p>
          </div>
        </div>

        {/* Resource Categories */}
        {/* <div className="grid md:grid-cols-4 gap-6 mb-16">
          {resourceCategories.map((category, index) => (
            <div
              key={index}
              className={`group bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 ${category.border} hover:border-opacity-50 cursor-pointer`}
            >
              <div className={`w-16 h-16 ${category.bg} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 border ${category.border}`}>
                {React.cloneElement(category.icon, {
                  className: `${category.icon.props.className} ${category.color} group-hover:animate-pulse`
                })}
              </div>
              
              <h3 className="text-lg font-bold text-[#2E2E2E] text-center mb-2">
                {category.title}
              </h3>
              
              <p className="text-[#666] text-sm text-center font-medium">
                {category.count}
              </p>
            </div>
          ))}
        </div> */}

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold text-xl transition-all duration-300 transform hover:scale-105 shadow-md ${
                activeCategory === category
                  ? "bg-gradient-to-br from-[#FFB88C] to-[#FFB88C] text-black shadow-lg"
                  : "bg-white/95 backdrop-blur-sm text-[#2E2E2E] border-2 border-[#E91E63]/20 hover:border-[#E91E63]/40 hover:bg-[#E91E63]/5"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredPosts.map((post, index) => (
            <article
              key={post.id}
              className={`group bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] border-2 ${post.borderColor} hover:border-opacity-50 overflow-hidden cursor-pointer`}
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              {/* Post Header with Emoji Illustration */}
              <div className={`relative h-48 bg-gradient-to-br ${post.bgGradient} flex items-center justify-center border-b ${post.borderColor}`}>
                <div className="text-6xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 drop-shadow-lg">
                  {post.image}
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-4 left-4 opacity-15 group-hover:opacity-30 transition-opacity duration-300">
                  <Star className="w-5 h-5 text-white" />
                </div>
                
                {/* Category Tag */}
                <div className={`absolute top-4 left-4 px-3 py-1 ${post.categoryBg} ${post.categoryColor} rounded-full text-xs font-bold border ${post.borderColor}`}>
                  {post.category}
                </div>
              </div>
              
              {/* Post Content */}
              <div className="p-8">
                <h3 className="text-xl font-bold text-black mb-4 leading-tight group-hover:text-opacity-90 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-black text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                
                {/* Post Meta */}
                <div className="flex items-center justify-between text-xs text-black mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Bookmark className={`w-4 h-4 ${post.categoryColor} hover:scale-110 transition-transform duration-200 cursor-pointer`} />
                  </div>
                </div>
                
                {/* Read More Button */}
                <div className="flex items-center justify-between">
                  <button className={`group/btn flex items-center gap-2 ${post.categoryColor} font-semibold text-sm hover:gap-3 transition-all duration-300`}>
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                  
                  <div className={`w-12 h-1 ${post.categoryBg} rounded-full group-hover:w-16 transition-all duration-500`}></div>
                </div>
              </div>
              
              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${post.bgGradient.replace('/15', '').replace('/10', '')} blur-xl -z-10`}></div>
            </article>
          ))}
        </div>

        {/* Newsletter Subscription */}
        {/* <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border-2 border-[#4CAF50]/20 mb-16 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Coffee className="w-8 h-8 text-[#FF9800]" />
              <h3 className="text-3xl font-bold text-[#2E2E2E]">
                Weekly Wellness
              </h3>
              <Sunrise className="w-8 h-8 text-[#E91E63]" />
            </div>
            
            <p className="text-lg text-[#666] mb-8 leading-relaxed">
              Get gentle reminders, helpful resources, and community highlights delivered to your inbox every Sunday morning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="your.email@example.com"
                className="flex-1 px-6 py-4 rounded-full border-2 border-[#4CAF50]/20 focus:border-[#4CAF50]/50 focus:outline-none bg-white/50 backdrop-blur-sm text-[#2E2E2E] placeholder-[#666]/70"
              />
              <button className="group px-8 py-4 rounded-full text-white font-bold bg-gradient-to-r from-[#4CAF50] to-[#2196F3] hover:from-[#2196F3] hover:to-[#4CAF50] transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <span className="flex items-center justify-center gap-2">
                  Subscribe
                  <Heart className="w-5 h-5 group-hover:animate-bounce" />
                </span>
              </button>
            </div>
            
            <p className="text-xs text-[#666] mt-4">
              No spam, unsubscribe anytime. We respect your privacy. 💚
            </p>
          </div>
        </div> */}

        {/* Final CTA */}
        {/* <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-[#4CAF50]/10 via-[#E91E63]/5 to-[#9C27B0]/10 backdrop-blur-sm rounded-3xl p-12 border-2 border-[#4CAF50]/20 shadow-2xl">
            <h3 className="text-3xl font-bold text-[#2E2E2E] mb-6">
              Ready to Start Your 
              <span className="text-transparent bg-gradient-to-r from-[#4CAF50] to-[#E91E63] bg-clip-text"> Healing Journey?</span>
            </h3>
            <p className="text-lg text-[#2E2E2E] mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
              Join thousands who've found support, understanding, and hope in our caring community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group relative px-12 py-6 rounded-full text-white font-bold text-lg bg-gradient-to-r from-[#4CAF50] via-[#2196F3] to-[#E91E63] hover:from-[#E91E63] hover:via-[#4CAF50] hover:to-[#9C27B0] transition-all duration-500 transform hover:scale-110 shadow-xl hover:shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center justify-center gap-3 drop-shadow-sm">
                  Join Elysian Community
                  <Users className="w-6 h-6 group-hover:animate-bounce" />
                </span>
              </button>
              
              <button className="group px-12 py-6 rounded-full text-[#2E2E2E] font-bold text-lg border-3 border-[#4CAF50] bg-white/95 backdrop-blur-sm hover:bg-[#4CAF50]/10 hover:border-[#E91E63] hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                <span className="flex items-center justify-center gap-3">
                  Browse All Resources
                  <BookOpen className="w-5 h-5 group-hover:animate-pulse text-[#4CAF50]" />
                </span>
              </button>
            </div>
          </div>
        </div> */}

        {/* Bottom decorative elements */}
        {/* <div className="mt-16 flex items-center justify-center gap-8 opacity-30">
          <Flower2 className="w-8 h-8 text-[#E91E63] animate-pulse" />
          <Moon className="w-6 h-6 text-[#9C27B0] animate-bounce delay-300" />
          <Sparkles className="w-7 h-7 text-[#4CAF50] animate-pulse delay-700" />
          <Heart className="w-6 h-6 text-[#FF9800] animate-bounce delay-1000" />
        </div> */}
        
        {/* Bottom gradient line */}
        {/* <div className="mt-8 w-full h-3 bg-gradient-to-r from-[#4CAF50]/40 via-[#E91E63]/50 to-[#9C27B0]/40 rounded-full blur-sm shadow-lg"></div> */}
      </div>
    </section>
  );
}