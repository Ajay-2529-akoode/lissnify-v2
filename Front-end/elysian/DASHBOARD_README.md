# Elysian Dashboard Structure

## Overview
The Elysian mental health support application now includes comprehensive dashboard pages for both support seekers and listeners with empathy.

## Dashboard Routes

### 1. Support Seeker Dashboard (`/dashboard/seeker`)
**Purpose**: Provides support seekers with tools to find listeners, explore categories, and manage their support journey.

**Sections**:
- **Support Categories**: Grid display of 6 mental health support categories using the same CategoryCard design as homepage
- **Available Listeners**: Grid of listener profiles with "Connect" buttons using the same ListenerCard design
- **Community Section**: Call-to-action to join the Elysian community
- **Recent Chats**: Sidebar showing recent conversations with listeners
- **Quick Actions**: Buttons for common actions (Find New Listener, Schedule Session, Emergency Support)

**Features**:
- Responsive 3-column layout (2 main + 1 sidebar on desktop, stacked on mobile)
- Consistent design language with homepage components
- Static data for demonstration purposes

### 2. Listener with Empathy Dashboard (`/dashboard/listener`)
**Purpose**: Empowers listeners to manage their practice, track connections, and support seekers effectively.

**Sections**:
- **Stats Overview**: 4 key metrics (Total Sessions, Active Seekers, Rating, Hours Listened)
- **Connected Seekers**: Grid of seeker profiles adapted from ListenerCard design
- **Community Section**: Call-to-action to join the listener community
- **Upcoming Sessions**: List of scheduled support sessions
- **Recent Chats**: Sidebar with unread message indicators
- **Quick Actions**: Buttons for common listener tasks
- **Availability Status**: Current status and toggle functionality

**Features**:
- Comprehensive statistics tracking
- Session management tools
- Availability controls
- Responsive design matching seeker dashboard

## Design Consistency

### Reused Components
- **CategoryCard**: Identical styling and behavior as homepage
- **ListenerCard**: Same design adapted for both listeners and seekers
- **Navbar**: Consistent navigation across all pages
- **Color Scheme**: Pastel mental-health-friendly palette maintained
- **Typography**: Consistent font weights and sizes
- **Spacing**: Uniform padding, margins, and grid gaps

### Visual Elements
- **Background**: Gradient from `#FFF8B5` to `#FFB88C`
- **Cards**: White/80% opacity with backdrop blur and rounded corners
- **Shadows**: Consistent shadow-xl for depth
- **Hover Effects**: Scale transforms and shadow transitions
- **Icons**: Lucide React icons with consistent sizing

## Technical Implementation

### File Structure
```
src/app/dashboard/
├── seeker/
│   └── page.tsx          # Support Seeker Dashboard
└── listener/
    └── page.tsx          # Listener Dashboard
```

### Dependencies
- **Next.js 15**: App Router for routing
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **TypeScript**: Type safety

### Data Sources
- **Categories**: Imported from `@/app/listeners/data`
- **Listeners**: Imported from `@/app/listeners/data`
- **Static Data**: Mock data for chats, sessions, and stats

## Responsive Design

### Desktop Layout
- **Main Content**: 2 columns (lg:col-span-2)
- **Sidebar**: 1 column with chat history and quick actions
- **Grid Systems**: md:grid-cols-2 for medium screens, lg:grid-cols-3 for large screens

### Mobile Layout
- **Stacked**: All sections stack vertically
- **Full Width**: Content spans full width on small screens
- **Touch Friendly**: Appropriate button sizes and spacing

## Future Enhancements

### Planned Features
- **Real-time Chat**: Integration with chat system
- **Session Scheduling**: Calendar integration
- **Analytics Dashboard**: Detailed listener performance metrics
- **Notification System**: Real-time updates and alerts
- **Profile Management**: User profile editing and preferences

### Data Integration
- **API Endpoints**: Replace static data with dynamic API calls
- **Authentication**: User session management
- **Database**: Persistent storage for user data and interactions
- **Real-time Updates**: WebSocket integration for live features

## Usage

### Navigation
Users can access dashboards by:
1. Clicking "Support Seeker" or "Listener with Empathy" cards on homepage
2. Direct navigation to `/dashboard/seeker` or `/dashboard/listener`
3. Navigation through the main navbar (when implemented)

### User Flow
1. **Homepage Selection**: User chooses their role (Seeker/Listener)
2. **Dashboard Access**: Redirected to appropriate dashboard
3. **Feature Usage**: Access to role-specific tools and information
4. **Community Engagement**: Join relevant community spaces

## Maintenance

### Code Quality
- **ESLint**: Configured for Next.js and TypeScript
- **Type Safety**: Full TypeScript implementation
- **Component Reuse**: Maximized component sharing for consistency
- **Responsive Design**: Mobile-first approach with progressive enhancement

### Performance
- **Static Generation**: Dashboard pages are statically generated
- **Image Optimization**: Consider replacing `<img>` with Next.js `<Image>` component
- **Bundle Size**: Minimal dependencies, optimized imports
- **Lazy Loading**: Components loaded on demand


