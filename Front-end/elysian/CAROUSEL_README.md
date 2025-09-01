# Support Category Carousel Components

This project includes two responsive carousel components built with Swiper.js and Tailwind CSS, styled to match the Amaha mental health concerns section design.

## Components

### 1. SupportCategoryCarousel
A full-featured carousel component with comprehensive styling and features.

### 2. CompactSupportCarousel
A streamlined version perfect for integration into existing pages.

## Features

- ✅ **Responsive Design**: Adapts to different screen sizes
  - Mobile: 1 card per view
  - Tablet: 2 cards per view  
  - Desktop: 3-4 cards per view
- ✅ **Interactive Elements**: Navigation arrows, pagination dots
- ✅ **Hover Effects**: Scale up, enhanced shadows, smooth transitions
- ✅ **Equal Height Cards**: Clean, aligned appearance
- ✅ **Auto-play**: Optional automatic sliding
- ✅ **Touch Support**: Swipe gestures on mobile devices
- ✅ **Accessibility**: ARIA labels and keyboard navigation

## Installation

Swiper.js is already installed in this project. If you need to install it elsewhere:

```bash
npm install swiper
```

## Usage

### Basic Usage

```tsx
import SupportCategoryCarousel from '@/Components/SupportCategoryCarousel';
import CompactSupportCarousel from '@/Components/CompactSupportCarousel';

// Your categories data
const categories = [
  {
    id: "depression",
    title: "Depression",
    description: "Does your life feel impossible & hopeless?",
    Icon: Frown,
    bgAccent: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  // ... more categories
];

// Use the carousel
<SupportCategoryCarousel categories={categories} />
```

### SupportCategoryCarousel Props

```tsx
type Props = {
  categories: SupportCategory[];
  className?: string;
};

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
```

### CompactSupportCarousel Props

```tsx
type Props = {
  categories: CompactSupportCategory[];
  title?: string;
  subtitle?: string;
  className?: string;
};

export type CompactSupportCategory = {
  id: string;
  title: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
  bgAccent: string;
  iconColor: string;
};
```

## Styling

### Card Design
- **Background**: `bg-white`
- **Corners**: `rounded-xl`
- **Shadow**: `shadow-md` with `hover:shadow-lg`
- **Padding**: `p-6`
- **Border**: Subtle border with hover effects

### Hover Effects
- **Scale**: `hover:scale-105`
- **Transition**: `transition-all duration-300`
- **Shadow Enhancement**: `hover:shadow-lg`

### Responsive Breakpoints
```tsx
breakpoints={{
  640: {    // Tablet
    slidesPerView: 2,
    spaceBetween: 20,
  },
  1024: {   // Desktop
    slidesPerView: 3,
    spaceBetween: 24,
  },
  1280: {   // Large Desktop
    slidesPerView: 4,
    spaceBetween: 24,
  },
}}
```

## Demo Pages

### 1. Full Carousel Demo
Visit `/carousel-demo` to see the complete `SupportCategoryCarousel` in action.

### 2. Compact Carousel Demo  
Visit `/compact-carousel-demo` to see the streamlined `CompactSupportCarousel`.

## Customization

### Custom Colors
```tsx
const customCategories = [
  {
    id: "custom",
    title: "Custom Category",
    description: "Your description here",
    Icon: CustomIcon,
    bgAccent: "bg-purple-100",     // Custom background
    iconColor: "text-purple-600",  // Custom icon color
  }
];
```

### Custom Styling
```tsx
<SupportCategoryCarousel 
  categories={categories}
  className="my-custom-class"
/>
```

### Custom Navigation
The carousel includes built-in navigation, but you can customize the appearance by modifying the CSS classes in the component.

## Integration Examples

### In a Support Page
```tsx
import CompactSupportCarousel from '@/Components/CompactSupportCarousel';

export default function SupportPage() {
  return (
    <div>
      <h1>Mental Health Support</h1>
      <CompactSupportCarousel 
        categories={supportCategories}
        title="Mental health concerns we care for"
        subtitle="Explore some of the most common ones below to see how we approach care."
      />
    </div>
  );
}
```

### In a Homepage Section
```tsx
import SupportCategoryCarousel from '@/Components/SupportCategoryCarousel';

export default function HomePage() {
  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
      <SupportCategoryCarousel 
        categories={featuredCategories}
        className="mb-12"
      />
    </section>
  );
}
```

## Browser Support

- Modern browsers with ES6+ support
- Mobile browsers with touch support
- Responsive design for all screen sizes

## Performance

- Lazy loading of slides
- Optimized animations with CSS transforms
- Minimal JavaScript overhead
- Efficient re-rendering with React

## Troubleshooting

### Common Issues

1. **Swiper styles not loading**: Ensure you've imported the CSS files
2. **Cards not equal height**: Check that all cards have consistent content structure
3. **Navigation not working**: Verify the swiper ref is properly set

### Debug Mode
Add console logs to check if the swiper instance is properly initialized:

```tsx
useEffect(() => {
  if (swiperRef.current?.swiper) {
    console.log('Swiper initialized:', swiperRef.current.swiper);
  }
}, []);
```

## Contributing

When modifying these components:
1. Maintain the responsive design principles
2. Keep the hover effects consistent
3. Ensure accessibility features remain intact
4. Test across different screen sizes

## License

This component is part of the Elysian project and follows the same licensing terms.
