'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, Users, MessageCircle, Briefcase, Brain, Frown, AlertTriangle, Shield,
  ArrowRight, ChevronDown
} from "lucide-react";

// All support categories data
const allSupportCategories = [
  {
    id: "breakup",
    slug: "breakup",
    title: "Breakup",
    description: "Going through heartbreak? Let someone help you heal and move forward.",
    encouragement: "Healing takes time, and that's okay",
    Icon: Heart,
    bgAccent: "bg-pink-100",
    iconColor: "text-pink-600",
    borderColor: "border-pink-200",
  },
  {
    id: "relationship-issues",
    slug: "relationship-issues",
    title: "Relationship Issues",
    description: "Navigating relationship challenges? Get guidance from experienced listeners.",
    encouragement: "Healthy relationships are possible",
    Icon: Users,
    bgAccent: "bg-purple-100",
    iconColor: "text-purple-600",
    borderColor: "border-purple-200",
  },
  {
    id: "loneliness",
    slug: "loneliness",
    title: "Loneliness",
    description: "Feeling isolated and disconnected? You're not alone in feeling alone. Don't Worry.",
    encouragement: "Connection is just a conversation away",
    Icon: MessageCircle,
    bgAccent: "bg-green-100",
    iconColor: "text-green-600",
    borderColor: "border-green-200",
  },
  {
    id: "career-stress",
    slug: "career-stress",
    title: "Career Stress",
    description: "Feeling overwhelmed by life's pressures? Find support and coping strategies.",
    encouragement: "You don't have to carry it alone",
    Icon: Briefcase,
    bgAccent: "bg-orange-100",
    iconColor: "text-orange-600",
    borderColor: "border-orange-200",
  },
  {
    id: "anxiety",
    slug: "anxiety",
    title: "Anxiety",
    description: "Feeling overwhelmed by worry and fear? Connect with someone who understands.",
    encouragement: "You're stronger than your anxiety",
    Icon: Brain,
    bgAccent: "bg-blue-100",
    iconColor: "text-blue-600",
    borderColor: "border-blue-200",
  },
  {
    id: "divorce-support",
    slug: "divorce-support",
    title: "Divorce Support",
    description: "Going through a divorce or separation? Find comfort, guidance, and strength to heal",
    encouragement: "You are worthy of love and respect",
    Icon: Users,
    bgAccent: "bg-purple-100",
    iconColor: "text-purple-600",
    borderColor: "border-purple-200",
  },
  {
    id: "depression",
    slug: "depression",
    title: "Depression",
    description: "Feeling down and hopeless? You don't have to face this alone.",
    encouragement: "There is hope and help available",
    Icon: Frown,
    bgAccent: "bg-gray-100",
    iconColor: "text-gray-600",
    borderColor: "border-gray-200",
  },
  {
    id: "suicidal-thoughts",
    slug: "suicidal-thoughts",
    title: "Suicidal Thoughts",
    description: "Having thoughts of self-harm? Please reach out immediately - you matter.",
    encouragement: "Your life has value and meaning",
    Icon: AlertTriangle,
    bgAccent: "bg-red-100",
    iconColor: "text-red-600",
    borderColor: "border-red-200",
  },
  {
    id: "trauma",
    slug: "trauma",
    title: "Trauma",
    description: "Dealing with past trauma? Find a safe space to process and heal.",
    encouragement: "Healing is possible with the right support",
    Icon: Shield,
    bgAccent: "bg-orange-100",
    iconColor: "text-orange-600",
    borderColor: "border-orange-200",
  },
  {
    id: "grief",
    slug: "grief-loss",
    title: "Grief & Loss",
    description: "Processing loss and grief? Find compassionate support during this difficult time.",
    encouragement: "It's okay to grieve in your own way",
    Icon: Heart,
    bgAccent: "bg-pink-100",
    iconColor: "text-pink-600",
    borderColor: "border-pink-200",
  },
  {
    id: "addiction",
    slug: "addiction-recovery",
    title: "Addiction Recovery",
    description: "Struggling with addiction? Find support and resources for your recovery journey.",
    encouragement: "Recovery is possible, one day at a time",
    Icon: Shield,
    bgAccent: "bg-blue-100",
    iconColor: "text-blue-600",
    borderColor: "border-blue-200",
  },
  {
    id: "eating-disorders",
    slug: "eating-disorders",
    title: "Eating Disorders",
    description: "Struggling with food and body image? Find understanding and support.",
    encouragement: "You are more than your relationship with food",
    Icon: Heart,
    bgAccent: "bg-pink-100",
    iconColor: "text-pink-600",
    borderColor: "border-pink-200",
  },
];

export default function SupportCategoriesDemoPage() {
  const [visibleCategories, setVisibleCategories] = useState(6);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLoadMore = () => {
    if (isExpanded) {
      setVisibleCategories(6);
      setIsExpanded(false);
    } else {
      setVisibleCategories(allSupportCategories.length);
      setIsExpanded(true);
    }
  };

  const displayedCategories = allSupportCategories.slice(0, visibleCategories);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Main Content */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-orange-500" />
              <h1 className="text-4xl font-bold text-gray-900">
                Support Categories
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with compassionate listeners who understand your unique needs and experiences.
            </p>
          </div>

          {/* Support Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {displayedCategories.map((category) => (
              <Link 
                key={category.id} 
                href={`/support/${category.slug}`} 
                className="block group"
              >
                <div className="h-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden border-t-4 border-orange-200">
                  <div className="p-6">
                    {/* Icon at top left */}
                    <div className="flex justify-start mb-4">
                      <div className={`p-2 rounded-lg ${category.bgAccent}`}>
                        <category.Icon className={`w-6 h-6 ${category.iconColor}`} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-orange-600 mb-3 group-hover:text-orange-700 transition-colors">
                      {category.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Encouragement */}
                    <p className="text-sm text-gray-700 mb-4 font-medium">
                      {category.encouragement}
                    </p>

                    {/* "You're not alone →" text at bottom */}
                    <div className="mt-auto">
                      <span className="text-sm text-orange-600 group-hover:text-orange-700 transition-colors flex items-center gap-1">
                        You're not alone
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isExpanded ? (
                <>
                  Show Less
                  <ChevronDown className="w-5 h-5 rotate-180 transition-transform" />
                </>
              ) : (
                <>
                  Load More Categories
                  <ChevronDown className="w-5 h-5 transition-transform" />
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Showing {visibleCategories} of {allSupportCategories.length} categories
            </p>
          </div>

          {/* Enhanced Social Media with warm styling */}
          <div className="mb-8">
            <p className="text-[#8B4513]/70 text-sm mb-5 font-semibold">Follow our healing journey</p>
            <div className="flex gap-4">
              {[
                { image: "/fb.jpeg", name: "Facebook" },
                { image: "/insta.jpeg", name: "Instagram" },
                { image: "/x.jpeg", name: "Twitter" },
                { image: "/ln.jpeg", name: "LinkedIn" }
              ].map(({ image, name }, index) => (
                <a
                  key={index}
                  href="#"
                  className={`group w-14 h-14 bg-white/70 rounded-2xl flex items-center justify-center hover:bg-gradient-to-br hover:from-[#FFB88C] hover:to-[#F9E79F] transition-all duration-300 hover:scale-110 hover:shadow-xl backdrop-blur-sm border-2 border-[#FFB88C]/20 hover:border-[#8B4513]/30`}
                  aria-label={name}
                >
                  <Image
                    src={image}
                    alt={name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded transition-all duration-300 group-hover:scale-110"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
