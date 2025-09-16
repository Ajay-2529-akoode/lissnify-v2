import type { Category as ApiCategory } from './api';
import type { Category as CategoryCardType } from '@/Components/CategoryCard';
import { getApiUrl } from '@/config/api';

/**
 * Transforms API category data to match CategoryCard component format
 */
export const transformCategoryForCard = (apiCategory: ApiCategory): CategoryCardType => {
  return {
    id: apiCategory.slug || apiCategory.id.toString(), // Use slug as primary identifier, fallback to id
    title: apiCategory.name,
    subtitle: apiCategory.description,
    supportText: apiCategory.supportText,
    iconSrc: apiCategory.icon ? getApiUrl(`/${apiCategory.icon}`) : undefined,
    colors: {
      bg: "bg-[#FFF7E9]",
      borderTop: "bg-[#FFD39B]",
      icon: "text-[#FF9800]",
      accent: "text-[#FF9800]"
    }
  };
};

/**
 * Transforms multiple API categories to CategoryCard format
 */
export const transformCategoriesForCards = (apiCategories: ApiCategory[]): CategoryCardType[] => {
  return apiCategories.map(transformCategoryForCard);
};
