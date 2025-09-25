"use client";

import { Star, Phone, Users, ExternalLink } from "lucide-react";
import { connection, isListenerConnected } from "@/utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import { API_CONFIG } from "@/config/api";

type EnhancedListener = {
  l_id?: string;
  name?: string;
  username?: string;
  image?: string;
  category?: string;
  description?: string | null;
  badge?: string;
  rating?: number | null;
  tags?: string[];
  preferences?: string[];
  languages?: string[];
};

export type { EnhancedListener };

export default function EnhancedListenerCard({ 
  listener, 
  connectedListeners = [] 
}: { 
  listener: EnhancedListener;
  connectedListeners?: any[];
}) {
  const router = useRouter();
  const displayName = listener.name || listener.full_name || listener.user?.full_name || "Listener";
  const ratingValue = Number(listener.rating) || 4;
  const description = listener.description ?? "Listener description...";
  const tags =
    listener.tags && listener.tags.length > 0
      ? listener.tags
      : listener.preferences || [];
  const languages =
    listener.languages && listener.languages.length > 0
      ? listener.languages
      : ["English", "Hindi"];

  const buildImageUrl = (img?: string) => {
    if (!img) return "http://localhost:3000/user.png";
    if (img.startsWith("http") || img.startsWith("data:")) return img;
    return `${API_CONFIG.BASE_URL}/${img}`;
  };

  const handleConnect = async () => {
    try {
      // Check if listener ID exists
      if (!listener.l_id) {
        toast.error("Invalid listener information");
        return;
      }

      const data = await connection(listener.l_id);
      console.log("Connecting to listener:", listener.l_id, data);
      
      if (data.success) {
        toast.success("Connection request sent successfully");
        // Optionally refresh the connected listeners list or update UI state
      } else {
        // Check for specific error messages
        if (data.error && data.error.includes("already sent")) {
          toast.info("Connection request already sent");
        } else if (data.error && data.error.includes("not found")) {
          toast.error("Listener not found");
        } else if (data.error && data.error.includes("authentication") || data.error && data.error.includes("login")) {
          toast.error("You must login or sign up to connect");
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          toast.error("Failed to send connection request. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error connecting to listener:", error);
      toast.error("Network error. Please check your connection and try again.");
    }
  };

  return (
    
    <div className="bg-white rounded-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
      {/* Card Content */}
      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-md flex-shrink-0 ring-4 ring-[#FFE0D5] group-hover:ring-[#FF8C5A] transition-all duration-300">
            <img
              src={buildImageUrl(listener?.user?.profile_image)}
              alt={displayName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1">
            {/* Name and View Profile on same line */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#FF8C5A] transition-colors">
                {displayName}
              </h3>
              <button 
                onClick={() => router.push(`/listener/${listener.l_id}`)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF8C5A] transition-colors duration-300 font-medium"
              >
                <span>View Profile</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(ratingValue)
                        ? "text-yellow-500 fill-current"
                        : i === Math.floor(ratingValue) &&
                          ratingValue % 1 !== 0
                        ? "text-yellow-500 fill-current opacity-50"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-black">
                {ratingValue}
              </span>
              {listener.badge && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF0E8] text-[#FF8C5A] border border-[#FFD8C7] ml-2">
                  {listener.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-black text-sm leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gradient-to-r from-[#FFE0D5] to-[#FFF0E8] text-[#FF8C5A] text-sm font-semibold rounded-full border border-[#FFE0D5] hover:border-[#FF8C5A] transition-colors cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons - Side by Side */}
        {/* <div className="flex gap-2 mb-4">
          <button className="flex-1 py-2 px-3 bg-gradient-to-r from-[#FF8C5A] to-[#e67848] text-white text-sm font-semibold rounded-lg hover:from-[#e67848] hover:to-[#d06640] transition-all duration-300 flex items-center justify-center gap-1 shadow-md hover:shadow-lg transform hover:scale-[1.02]">
            <Phone className="w-3 h-3" />
            Call
          </button>
          <button className="flex-1 py-2 px-3 bg-white border-2 border-[#FF8C5A] text-[#FF8C5A] text-sm font-semibold rounded-lg hover:bg-[#FFE0D5] hover:border-[#e67848] transition-all duration-300 flex items-center justify-center gap-1 transform hover:scale-[1.02]">
            <Users className="w-3 h-3" />
            Meet
          </button>
        </div> */}

        {/* Languages Section */}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-gray-800">Languages</h4>
            <div className="flex items-center">
              {isListenerConnected(listener.l_id || "", connectedListeners) ? (
                <button
                  disabled
                  className="px-3 py-1 bg-gray-100 border-2 border-gray-300 text-gray-500 text-sm font-bold rounded-md cursor-not-allowed"
                >
                  Already Connected
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  className="px-3 py-1 bg-white border-2 border-[#FF8C5A] text-[#FF8C5A] text-sm font-bold rounded-md hover:bg-[#FFE0D5] hover:border-[#e67848] transition-all duration-300"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {languages.map((language) => (
              <span
                key={language}
                className="px-2 py-1 bg-gradient-to-r from-[#FF8C5A] to-[#e67848] text-white text-xs font-medium rounded-full shadow-sm"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
