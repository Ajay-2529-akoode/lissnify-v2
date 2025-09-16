"use client";

import React, { useState, useRef, useEffect } from "react";
import { Share2, Facebook, Instagram, Linkedin, MessageCircle, ChevronDown } from "lucide-react";

interface ShareDropdownProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export default function ShareDropdown({ url, title, description = "", className = "" }: ShareDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside and handle positioning
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      if (isOpen && buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;
        
        if (spaceBelow < 200 && spaceAbove > spaceBelow) {
          setDropdownPosition('top');
        } else {
          setDropdownPosition('bottom');
        }
      }
    };

    if (isOpen) {
      handleResize();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, [isOpen]);

  const shareOptions = [
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      color: "hover:bg-blue-50 hover:text-blue-600",
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(facebookUrl, "_blank", "width=600,height=400");
        setIsOpen(false);
      }
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      color: "hover:bg-pink-50 hover:text-pink-600",
      action: () => {
        // Instagram doesn't support direct URL sharing, so we'll copy the URL to clipboard
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard! You can now paste it in your Instagram story or post.");
        setIsOpen(false);
      }
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      color: "hover:bg-blue-50 hover:text-blue-700",
      action: () => {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(linkedinUrl, "_blank", "width=600,height=400");
        setIsOpen(false);
      }
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "hover:bg-green-50 hover:text-green-600",
      action: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`;
        window.open(whatsappUrl, "_blank");
        setIsOpen(false);
      }
    }
  ];

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: url,
      });
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-green-50 hover:text-green-500 hover:border-green-200 transition-all duration-300"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={`absolute left-0 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[9999] ${
            dropdownPosition === 'top' 
              ? 'bottom-full mb-2 ' 
              : 'top-full mt-2'
          }`}>
            {shareOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 transition-colors duration-200 ${option.color} first:rounded-t-xl last:rounded-b-xl`}
              >
                {option.icon}
                <span className="font-medium">{option.name}</span>
              </button>
            ))}
            
            {/* Native share option for mobile devices */}
            {navigator.share && (
              <>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200 rounded-b-xl"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">More Options</span>
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
