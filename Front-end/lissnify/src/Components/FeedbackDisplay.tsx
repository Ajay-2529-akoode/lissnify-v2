"use client";

import { useState } from "react";
import { Star, ChevronDown, ChevronUp, MessageCircle, User, Calendar } from "lucide-react";

interface Feedback {
  id: string;
  seeker_name: string;
  rating: number;
  feedback: string;
  created_at: string;
  seeker_avatar?: string;
}

interface FeedbackDisplayProps {
  feedbacks: Feedback[];
  averageRating: number;
  totalReviews: number;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FeedbackDisplay({ 
  feedbacks, 
  averageRating, 
  totalReviews, 
  isOpen, 
  onToggle 
}: FeedbackDisplayProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-500 fill-current"
            : i === Math.floor(rating) && rating % 1 !== 0
            ? "text-yellow-500 fill-current opacity-50"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#FFE0D5] overflow-hidden">
      {/* Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full p-6 bg-gradient-to-r from-[#FFF8B5]/30 to-[#FFE0D5]/30 hover:from-[#FFF8B5]/40 hover:to-[#FFE0D5]/40 transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(Number(averageRating || 0))}
              </div>
              <span className="text-2xl font-bold text-[#8B4513] ml-2">
                {Number(averageRating || 0).toFixed(1)}
              </span>
            </div>
            <div className="text-left">
              <p className="text-lg font-semibold text-[#8B4513]">
                {totalReviews} Review{totalReviews !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-[#8B4513]/70">
                Based on seeker feedback
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#8B4513]">
            <MessageCircle className="w-5 h-5" />
            {isOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>
      </button>

      {/* Feedback List - Collapsible */}
      {isOpen && (
        <div className="max-h-96 overflow-y-auto">
          {feedbacks.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FFE0D5] to-[#FFF0E8] rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-[#FF8C5A]" />
              </div>
              <h3 className="text-lg font-semibold text-[#8B4513] mb-2">No Reviews Yet</h3>
              <p className="text-[#8B4513]/70">
                Be the first to share your experience with this listener!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#FFE0D5]">
              {feedbacks.map((feedback, index) => (
                <div key={feedback.id || index} className="p-6 hover:bg-[#FFF8B5]/10 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Seeker Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C5A] to-[#e67848] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {feedback.seeker_avatar ? (
                        <img
                          src={feedback.seeker_avatar}
                          alt={feedback.seeker_name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>

                    {/* Feedback Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-[#8B4513] truncate">
                            {feedback.seeker_name}
                          </h4>
                          <div className="flex items-center">
                            {renderStars(feedback.rating)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-[#8B4513]/70">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(feedback.created_at)}</span>
                        </div>
                      </div>
                      
                      <p className="text-[#8B4513]/80 leading-relaxed">
                        {feedback.feedback}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
