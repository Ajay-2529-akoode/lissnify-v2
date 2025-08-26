'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ComponentType } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export type SupportCategory = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  supportText: string;
  Icon: ComponentType<{ className?: string }>;
  gradient: string;
  glowColor: string;
  borderColor: string;
  bgAccent: string;
};

type Props = {
  categories: SupportCategory[];
  className?: string;
};

export default function SupportCategoryCarousel({ categories, className }: Props) {
  const swiperRef = useRef<any>(null);

  const goNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  return (
    <div className={`relative ${className ?? ''}`}>
      {/* Navigation Arrows */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={goPrev}
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-gray-600 hover:text-gray-800"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={goNext}
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-gray-600 hover:text-gray-800"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="support-category-swiper"
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id}>
            <Link href={`/support/${category.id}`} className="block h-full">
                             <div className="h-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden group">
                 {/* Colored top border */}
                 <div className={`h-1 w-full ${category.borderColor}`} />
                 
                 <div className="p-6">
                   {/* Icon at top left */}
                   <div className="flex justify-start mb-4">
                     <div className={`p-2 rounded-lg ${category.bgAccent}`}>
                       <category.Icon className={`w-6 h-6 ${category.glowColor.replace('shadow-', 'text-').replace('/30', '')}`} />
                     </div>
                   </div>

                   {/* Title */}
                   <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                     {category.title}
                   </h3>

                   {/* Subtitle/Description */}
                   <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                     {category.description}
                   </p>

                   {/* Support Text */}
                   <p className="text-sm text-gray-700 mb-4">
                     {category.supportText}
                   </p>

                   {/* "You're not alone →" text at bottom */}
                   <div className="mt-auto">
                     <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                       You're not alone →
                     </span>
                   </div>
                 </div>
               </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Styles */}
      <style jsx global>{`
        .support-category-swiper .swiper-pagination {
          position: relative;
          margin-top: 2rem;
        }
        
        .support-category-swiper .swiper-pagination-bullet {
          background: #d1d5db;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        
        .support-category-swiper .swiper-pagination-bullet-active {
          background: #6b7280;
          opacity: 1;
          transform: scale(1.2);
        }
        
        .support-category-swiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </div>
  );
}
