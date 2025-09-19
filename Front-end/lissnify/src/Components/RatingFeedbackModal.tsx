"use client";

import { useState } from "react";
import { Star, X, Send, MessageCircle, User } from "lucide-react";
import { toast } from 'react-toastify';

interface RatingFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  listenerId: string;
  listenerName: string;
  onSubmit: (rating: number, feedback: string) => Promise<void>;
}

export default function RatingFeedbackModal({ 
  isOpen, 
  onClose, 
  listenerId, 
  listenerName, 
  onSubmit 
}: RatingFeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [ feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    if (feedback.trim().length < 10) {
      toast.error("Please provide feedback with at least 10 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(rating, feedback.trim());
      setRating(0);
      setFeedback("");
      onClose();
      toast.success("Thank you for your feedback!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setFeedback("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF8C5A] to-[#e67848] p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Rate & Review</h2>
                <p className="text-white/80 text-sm">Share your experience with {listenerName}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Section */}
            <div>
              <label className="block text-lg font-semibold text-[#8B4513] mb-4">
                How would you rate your experience?
              </label>
              <div className="flex items-center gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform duration-200 hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || rating)
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-center mt-2">
                <span className="text-sm text-gray-600">
                  {rating === 0 ? "Select a rating" : 
                   rating === 1 ? "Poor" :
                   rating === 2 ? "Fair" :
                   rating === 3 ? "Good" :
                   rating === 4 ? "Very Good" : "Excellent"}
                </span>
              </div>
            </div>

            {/* Feedback Section */}
            <div>
              <label className="block text-lg font-semibold text-[#8B4513] mb-3">
                <MessageCircle className="w-5 h-5 inline mr-2" />
                Share your feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell others about your experience with this listener. What did you like? How did they help you?"
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8C5A] focus:border-transparent resize-none transition-all duration-200"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {feedback.length}/500 characters
                </span>
                <span className="text-xs text-gray-500">
                  Minimum 10 characters required
                </span>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-gradient-to-r from-[#FFF8B5]/30 to-[#FFE0D5]/30 p-4 rounded-xl border border-[#FFE0D5]">
              <h4 className="font-semibold text-[#8B4513] mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Review Guidelines
              </h4>
              <ul className="text-sm text-[#8B4513]/80 space-y-1">
                <li>• Be honest and constructive</li>
                <li>• Focus on the listener's helpfulness</li>
                <li>• Avoid personal information</li>
                <li>• Help others make informed decisions</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || feedback.trim().length < 10}
              className="w-full bg-gradient-to-r from-[#FF8C5A] to-[#e67848] text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
