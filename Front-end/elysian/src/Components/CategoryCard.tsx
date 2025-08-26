import Link from "next/link";
import type { ComponentType } from "react";

export type Category = {
  id: string;
  title: string;
  subtitle: string;
  supportText: string;
  Icon?: ComponentType<{ className?: string }>;
  iconSrc?: string;
  colors: {
    bg: string;
    borderTop: string;
    icon: string;
    accent: string;
  };
};

type Props = {
  category: Category;
  href: string;
  className?: string;
};

export default function CategoryCard({ category, href, className }: Props) {
  return (
    <Link href={href} className="group block">
      <div
        className={`
          relative rounded-2xl bg-gradient-to-b from-white to-gray-50/50 
          shadow-md hover:shadow-xl 
          transition-all duration-300 ease-out 
          cursor-pointer border border-gray-100 
          hover:border-gray-200
          hover:-translate-y-2 hover:scale-[1.02]
          overflow-hidden h-full
          ${className ?? ''}
        `}
      >
        {/* Top border accent */}
        <div className={`h-1 w-full ${category.colors.borderTop}`} />
        
        {/* Card content */}
        <div className="p-6 h-full flex flex-col">
          {/* Icon container */}
          <div className="flex justify-center mb-6">
            <div className={`
              w-16 h-16 rounded-full ${category.colors.bg} 
              flex items-center justify-center 
              shadow-sm group-hover:shadow-md transition-shadow duration-300
            `}>
              {category.iconSrc ? (
                <img 
                  src={category.iconSrc} 
                  alt={category.title}
                  className="w-8 h-8 object-contain"
                />
              ) : category.Icon ? (
                <category.Icon className={`w-8 h-8 ${category.colors.icon}`} />
              ) : (
                <div className={`w-8 h-8 rounded-full ${category.colors.icon}`} />
              )}
            </div>
          </div>
          
          {/* Content section */}
          <div className="text-center flex-grow flex flex-col">
            {/* Title */}
            <h3 className={`
              text-xl font-bold mb-3 
              ${category.colors.accent} 
              group-hover:scale-105 transition-transform duration-300
            `}>
              {category.title}
            </h3>
            
            {/* Subtitle */}
            <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-grow">
              {category.subtitle}
            </p>
            
            {/* Support text */}
            <p className="text-xs text-gray-500 mb-6 font-medium">
              {category.supportText}
            </p>
            
            {/* CTA */}
            <div className="mt-auto">
              <span className={`
                inline-flex items-center gap-2 text-sm font-semibold
                ${category.colors.accent} 
                border-b-2 border-transparent 
                group-hover:border-current
                transition-all duration-300
                group-hover:gap-3
              `}>
                You're not alone
                <svg 
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </div>
        
        {/* Subtle gradient overlay on hover */}
        <div className="
          absolute inset-0 
          bg-gradient-to-br from-white/0 to-gray-100/0 
          group-hover:from-white/20 group-hover:to-gray-50/20 
          transition-all duration-300 pointer-events-none
          rounded-2xl
        " />
      </div>
    </Link>
  );
}