"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/Components/DashboardLayout";
import { 
  Star, 
  MessageSquare, 
  Send,
  User,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { createTestimonial } from "@/utils/api";

interface FeedbackFormData {
  name: string;
  rating: number;
  description: string;
  role: string;
}

export default function FeedbackPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: "",
    rating: 0,
    description: "",
    role: "seeker"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Set user name when component mounts
  useEffect(() => {
    if (user?.full_name) {
      setFormData(prev => ({
        ...prev,
        name: user.full_name
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (formData.rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the API to create testimonial
      const response = await createTestimonial({
        name: formData.name,
        role: formData.role,
        feedback: formData.description,
        rating: formData.rating
      });

      if (response.success) {
        setSuccess("Feedback submitted successfully! Thank you for your input.");
        toast.success("Feedback submitted successfully!");
        
        // Reset form
        setFormData({
          name: user?.full_name || "",
          rating: 0,
          description: "",
          role: "seeker"
        });
      } else {
        setError(response.error || "Failed to submit feedback. Please try again.");
        toast.error(response.error || "Failed to submit feedback");
      }
      
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback. Please try again.");
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoveredRating || formData.rating);
      
      return (
        <button
          key={index}
          type="button"
          className={`p-1 transition-colors duration-200 ${
            isFilled ? 'text-yellow-400' : 'text-gray-300'
          } hover:text-yellow-400`}
          onClick={() => handleRatingClick(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <Star className="w-8 h-8 fill-current" />
        </button>
      );
    });
  };

  return (
    <DashboardLayout userType="seeker">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Share Your Feedback
          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto">
            Help us improve our platform by sharing your experience and suggestions
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* API Feedback Messages */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}
              
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>{success}</span>
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-lg font-semibold text-black">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB88C] focus:border-transparent transition-all duration-200"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              {/* Role Field (Read-only) */}
              <div className="space-y-2">
                <label htmlFor="role" className="block text-lg font-semibold text-black">
                  Role
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value="Seeker"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                    disabled
                  />
                </div>
                <p className="text-sm text-gray-500">Your role is automatically set as Seeker</p>
              </div>

              {/* Rating Field */}
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-black">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {renderStars()}
                  <span className="ml-4 text-lg font-medium text-gray-600">
                    {formData.rating > 0 ? `${formData.rating}/5` : 'Select a rating'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Click on the stars to rate your experience</p>
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-lg font-semibold text-black">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB88C] focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us about your experience, suggestions, or any issues you encountered..."
                    required
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {formData.description.length}/1000 characters
                </p>
              </div>


              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#CD853F] to-[#D2691E] text-white font-semibold rounded-xl hover:from-[#D2691E] hover:to-[#CD853F] transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
