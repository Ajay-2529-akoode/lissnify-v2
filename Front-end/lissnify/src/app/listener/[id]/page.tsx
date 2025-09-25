"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Phone, Users, ArrowLeft, Clock, MapPin, Heart, MessageCircle, StarIcon } from "lucide-react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import RatingFeedbackModal from "@/Components/RatingFeedbackModal";
import FeedbackDisplay from "@/Components/FeedbackDisplay";
import { listener, connection, submitRatingFeedback, getListenerRatings, getListenerRatingStats, RatingFeedback } from "@/utils/api";
import { API_CONFIG } from "@/config/api";
import { toast } from 'react-toastify';
import { useAuth } from "@/contexts/AuthContext";

interface ListenerProfile {
  l_id: string;
  username: string;
  name?: string;
  user?: {
    profile_image?: string;
    email?: string;
  };
  description?: string;
  rating?: number;
  preferences?: string[];
  languages?: string[];
  gender?: string;
  age?: number;
  experience_hours?: number;
  location?: string;
  badge?: string;
}

export default function ListenerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [listenerData, setListenerData] = useState<ListenerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Rating and Feedback states
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showFeedbackDropdown, setShowFeedbackDropdown] = useState(false);
  const [feedbacks, setFeedbacks] = useState<RatingFeedback[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

  const listenerId = params.id as string;

  useEffect(() => {
    const fetchListenerProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching listener profile for ID:', listenerId);
        const response = await listener(listenerId);
        console.log('API Response:', response);
        
        if (response.success && response.data) {
          // Handle different response structures
          let listenerData;
          if (Array.isArray(response.data)) {
            listenerData = response.data[0];
          } else if (response.data.data && Array.isArray(response.data.data)) {
            listenerData = response.data.data[0];
          } else {
            listenerData = response.data;
          }
          
          if (listenerData) {
            setListenerData(listenerData);
            // Fetch ratings and feedbacks after getting listener data
            await fetchRatingsAndFeedbacks();
          } else {
            setError("Profile not found. This listener may no longer be available.");
          }
        } else {
          setError(response.error || "Oops! Profile not found. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching listener profile:", err);
        setError("Oops! Profile not found. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (listenerId) {
      fetchListenerProfile();
    }
  }, [listenerId]);

  const fetchRatingsAndFeedbacks = async () => {
    try {
      setLoadingFeedbacks(true);
      
      // Fetch rating stats
      const statsResponse = await getListenerRatingStats(listenerId);
      if (statsResponse.success && statsResponse.data) {
        setAverageRating(statsResponse.data.average_rating);
        setTotalReviews(statsResponse.data.total_reviews);
      }
      
      // Fetch individual feedbacks
      const feedbacksResponse = await getListenerRatings(listenerId);
      if (feedbacksResponse.success && feedbacksResponse.data) {
        setFeedbacks(feedbacksResponse.data);
      }
    } catch (error) {
      console.error("Error fetching ratings and feedbacks:", error);
      // Don't show error to user as this is supplementary data
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const handleConnect = async () => {
    if (!listenerData?.l_id) return;
    
    try {
      setIsConnecting(true);
      const response = await connection(listenerData.l_id);
      
      if (response.success) {
        toast.success("Connection request sent successfully");
        console.log("Connection request sent successfully");
      } else {
        // Check for specific error messages
        if(response.error && response.error.includes("already sent")) {
          toast.info("Connection request already sent");
        } else if(response.error && response.error.includes("not found")) {
          toast.error("Listener not found");
        } else {
          toast.error('You must login or Sign up');
          setTimeout(() => {
            router.push('/login');
          }, 500);
        }
        console.error("Failed to send connection request:", response.error);
      }
    } catch (err) {
      console.error("Error sending connection request:", err);
      toast.error("Error sending connection request");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRatingSubmit = async (rating: number, feedback: string) => {
    if (!user) {
      toast.error("Please login to submit feedback");
      router.push('/login');
      return;
    }

    if (user.user_type !== 'seeker') {
      toast.error("Only seekers can rate and review listeners");
      return;
    }

    try {
      const response = await submitRatingFeedback({
        listener_id: listenerId,
        rating,
        feedback
      });

      if (response.success) {
        // Refresh ratings and feedbacks
        await fetchRatingsAndFeedbacks();
        toast.success("Thank you for your feedback!");
      } else {
        throw new Error(response.error || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      throw error;
    }
  };

  const handleRatingClick = () => {
    if (!user) {
      toast.error("Please login to rate this listener");
      router.push('/login');
      return;
    }

    if (user.user_type !== 'seeker') {
      toast.error("Only seekers can rate and review listeners");
      return;
    }

    setShowRatingModal(true);
  };

  const buildImageUrl = (img?: string) => {
    if (!img) return "/user.png";
    if (img.startsWith("http") || img.startsWith("data:")) return img;
    return `${API_CONFIG.BASE_URL}/${img}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] px-6">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-[#FFE0D5] border-t-[#FF8C5A] rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-[#FFF8B5] rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <h3 className="text-2xl font-bold text-[#8B4513] mb-2">Loading...</h3>
            <p className="text-lg text-[#8B4513]/70">Fetching listener details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !listenerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] px-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FFE0D5] to-[#FFF0E8] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-2 border-[#FFE0D5]">
              <Heart className="w-10 h-10 text-[#FF8C5A]" />
            </div>
            <h2 className="text-3xl font-bold text-[#8B4513] mb-4">Profile Not Found</h2>
            <p className="text-lg text-[#8B4513]/80 mb-8 leading-relaxed bg-gradient-to-r from-[#FFF8B5]/20 to-[#FFE0D5]/20 p-6 rounded-2xl border border-[#FFE0D5]">
              {error || "Oops! Profile not found. Please try again later."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gradient-to-r from-[#FF8C5A] to-[#e67848] text-white font-semibold rounded-lg hover:from-[#e67848] hover:to-[#d06640] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-white border-2 border-[#FF8C5A] text-[#FF8C5A] font-semibold rounded-lg hover:bg-[#FFE0D5] hover:border-[#e67848] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Heart className="w-4 h-4" />
                Browse Listeners
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const displayName = listenerData.name || listenerData.full_name || listenerData.user?.full_name || "Listener";
  const ratingValue = Number(averageRating > 0 ? averageRating : (listenerData.rating ?? 0)) || 0;
  const description = listenerData.description || "This listener is here to provide emotional support and guidance. They bring their personal experiences and empathy to help others navigate through challenging times.";
  const tags = listenerData.preferences || [];
  const languages = listenerData.languages || ["English", "Hindi"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      <Navbar />
      
      {/* Back Button
      <div className="max-w-4xl mx-auto px-6 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#8B4513] hover:text-[#FF8C5A] transition-colors duration-300 font-semibold group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Listeners
        </button>
      </div> */}

      {/* Main Profile Card */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-[#FFE0D5] hover:border-[#FF8C5A] transition-all duration-500">
          
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#FFF8B5]/30 to-[#FFE0D5]/30 p-8 border-b border-[#FFE0D5]">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-2xl ring-4 ring-[#FFE0D5] group-hover:ring-[#FF8C5A] transition-all duration-300">
                  <img
                    src={buildImageUrl(listenerData.user?.profile_image)}
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {listenerData.badge && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FF8C5A] to-[#e67848] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {listenerData.badge}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-bold text-[#8B4513] mb-2">{displayName}</h1>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < Math.floor(ratingValue)
                                ? "text-yellow-500 fill-current"
                                : i === Math.floor(ratingValue) && ratingValue % 1 !== 0
                                ? "text-yellow-500 fill-current opacity-50"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-[#8B4513]">
                        {ratingValue > 0 ? ratingValue.toFixed(1) : "0.0"}
                      </span>
                      {totalReviews > 0 && (
                        <span className="text-sm text-[#8B4513]/70">
                          ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                        </span>
                      )}
                    </div>

                    {/* Gender and Age */}
                    {(listenerData.gender || listenerData.age) && (
                      <div className="flex items-center gap-4 text-lg text-[#8B4513]/70 mb-4">
                        {listenerData.gender && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {listenerData.gender}
                          </span>
                        )}
                        {listenerData.age && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {listenerData.age} years old
                          </span>
                        )}
                      </div>
                    )}

                    {/* Location */}
                    {listenerData.location && (
                      <div className="flex items-center gap-2 text-lg text-[#8B4513]/70">
                        <MapPin className="w-4 h-4" />
                        {listenerData.location}
                      </div>
                    )}
                  </div>

                  {/* Connect Button */}
                  {/* <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="px-8 py-4 bg-gradient-to-r from-[#FF8C5A] to-[#e67848] text-white font-bold text-lg rounded-2xl hover:from-[#e67848] hover:to-[#d06640] transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Phone className="w-5 h-5" />
                    {isConnecting ? "Connecting..." : "Talk Now"}
                  </button> */}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#8B4513] mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-[#FF8C5A]" />
                About {displayName}
              </h2>
              <p className="text-lg text-[#8B4513]/80 leading-relaxed text-center bg-gradient-to-r from-[#FFF8B5]/20 to-[#FFE0D5]/20 p-6 rounded-2xl border border-[#FFE0D5]">
                {description}
              </p>
            </div>

            {/* Experience Hours */}
            {listenerData.experience_hours && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#8B4513] mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FF8C5A]" />
                  Experience
                </h3>
                <div className="bg-gradient-to-r from-[#FFF8B5]/30 to-[#FFE0D5]/30 p-4 rounded-xl border border-[#FFE0D5]">
                  {/* <span className="text-2xl font-bold text-[#8B4513]">
                    {listenerData.experience_hours}+ hours of listening
                  </span> */}
                </div>
              </div>
            )}

            {/* Issues They Can Help With */}
            {tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#8B4513] mb-4">Issues They Can Help With</h3>
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-gradient-to-r from-[#FFE0D5] to-[#FFF0E8] text-[#FF8C5A] text-lg font-semibold rounded-full border border-[#FFE0D5] hover:border-[#FF8C5A] transition-colors cursor-default shadow-sm hover:shadow-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages Spoken */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#8B4513] mb-4">Languages Spoken</h3>
              <div className="flex flex-wrap gap-3">
                {languages.map((language) => (
                  <span
                    key={language}
                    className="px-4 py-2 bg-gradient-to-r from-[#FF8C5A] to-[#e67848] text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* Rating and Feedback Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#8B4513] flex items-center gap-2">
                  <StarIcon className="w-6 h-6 text-[#FF8C5A]" />
                  Reviews & Feedback
                </h3>
                {user?.user_type === 'seeker' && (
                  <button
                    onClick={handleRatingClick}
                    className="px-6 py-3 bg-gradient-to-r from-[#FF8C5A] to-[#e67848] text-white font-semibold rounded-xl hover:from-[#e67848] hover:to-[#d06640] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Star className="w-5 h-5" />
                    Rate & Review
                  </button>
                )}
              </div>

              {/* Feedback Display Component */}
              <FeedbackDisplay
                feedbacks={feedbacks}
                averageRating={averageRating}
                totalReviews={totalReviews}
                isOpen={showFeedbackDropdown}
                onToggle={() => setShowFeedbackDropdown(!showFeedbackDropdown)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rating Feedback Modal */}
      <RatingFeedbackModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        listenerId={listenerId}
        listenerName={displayName}
        onSubmit={handleRatingSubmit}
      />

      <Footer />
    </div>
  );
}
