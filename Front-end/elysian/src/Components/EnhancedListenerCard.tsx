"use client"

import { Star, Phone, Users, ExternalLink } from "lucide-react";

type EnhancedListener = {
  id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  badge?: string;
  rating: number;
  tags: string[];
  languages: string[];
};

export type { EnhancedListener };

export default function EnhancedListenerCard({ listener }: { listener: EnhancedListener }) {
  return (
    <div className="bg-white rounded-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
      {/* Card Content */}
      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-md flex-shrink-0 ring-4 ring-[#FFE0D5] group-hover:ring-[#FF8C5A] transition-all duration-300">
            <img 
              src={listener.image} 
              alt={listener.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1">
            {/* Name and View Profile on same line */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#FF8C5A] transition-colors">
                {listener.name}
              </h3>
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF8C5A] transition-colors duration-300 font-medium">
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
                      i < Math.floor(listener.rating) 
                        ? 'text-yellow-500 fill-current' 
                        : i === Math.floor(listener.rating) && listener.rating % 1 !== 0
                        ? 'text-yellow-500 fill-current opacity-50'
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-black">{listener.rating}</span>
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
          {listener.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {listener.tags.map((tag) => (
            <span 
              key={tag} 
              className="px-3 py-1 bg-gradient-to-r from-[#FFE0D5] to-[#FFF0E8] text-[#FF8C5A] text-sm font-semibold rounded-full border border-[#FFE0D5] hover:border-[#FF8C5A] transition-colors cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons - Side by Side */}
        <div className="flex gap-2 mb-4">
          <button className="flex-1 py-2 px-3 bg-gradient-to-r from-[#FF8C5A] to-[#e67848] text-white text-sm font-semibold rounded-lg hover:from-[#e67848] hover:to-[#d06640] transition-all duration-300 flex items-center justify-center gap-1 shadow-md hover:shadow-lg transform hover:scale-[1.02]">
            <Phone className="w-3 h-3" />
            Call
          </button>
          <button className="flex-1 py-2 px-3 bg-white border-2 border-[#FF8C5A] text-[#FF8C5A] text-sm font-semibold rounded-lg hover:bg-[#FFE0D5] hover:border-[#e67848] transition-all duration-300 flex items-center justify-center gap-1 transform hover:scale-[1.02]">
            <Users className="w-3 h-3" />
            Meet
          </button>
        </div>

        {/* Languages Section */}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-gray-800">Languages</h4>
            <button className="px-3 py-1 bg-white border-2 border-[#FF8C5A] text-[#FF8C5A] text-sm font-bold rounded-md hover:bg-[#FFE0D5] hover:border-[#e67848] transition-all duration-300">
              Connect
            </button>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {listener.languages.map((language) => (
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
