import { transformCategoryForCard } from '../categoryTransform';
import { API_CONFIG } from '@/config/api';

// Mock the API_CONFIG
jest.mock('@/config/api', () => ({
  API_CONFIG: {
    BASE_URL: 'http://127.0.0.1:8000'
  },
  getApiUrl: (endpoint: string) => `http://127.0.0.1:8000${endpoint}`
}));

describe('categoryTransform', () => {
  it('should transform API category data correctly with icon', () => {
    const apiCategory = {
      id: 1,
      name: 'Anxiety',
      description: 'Support for anxiety-related concerns',
      icon: 'public/categories/anxiety.png',
      supportText: 'You are not alone in this journey',
      slug: 'anxiety'
    };

    const result = transformCategoryForCard(apiCategory);

    expect(result).toEqual({
      id: '1',
      title: 'Anxiety',
      subtitle: 'Support for anxiety-related concerns',
      supportText: 'You are not alone in this journey',
      iconSrc: 'http://127.0.0.1:8000/public/categories/anxiety.png',
      colors: {
        bg: 'bg-[#FFF7E9]',
        borderTop: 'bg-[#FFD39B]',
        icon: 'text-[#FF9800]',
        accent: 'text-[#FF9800]'
      }
    });
  });

  it('should handle category without icon', () => {
    const apiCategory = {
      id: 2,
      name: 'Depression',
      description: 'Support for depression-related concerns',
      icon: null,
      supportText: 'We are here to support you',
      slug: 'depression'
    };

    const result = transformCategoryForCard(apiCategory);

    expect(result.iconSrc).toBeUndefined();
    expect(result.title).toBe('Depression');
  });

  it('should handle empty icon string', () => {
    const apiCategory = {
      id: 3,
      name: 'Stress',
      description: 'Support for stress-related concerns',
      icon: '',
      supportText: 'Take it one day at a time',
      slug: 'stress'
    };

    const result = transformCategoryForCard(apiCategory);

    expect(result.iconSrc).toBeUndefined();
  });
});
