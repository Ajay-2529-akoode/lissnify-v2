// import SupportCategoryCarousel from '@/Components/SupportCategoryCarousel';
// import { 
//   Heart, Users, Briefcase, Brain, Frown, AlertTriangle, 
//   MessageCircle, Phone, Calendar, Users2, Shield, Target,
//   TrendingUp, Clock, Star, TreePine, Palette, Dumbbell,
//   Headphones, HeartHandshake, Wind, Waves, Sun,
//   Mountain, Flower, Bird, Fish, PawPrint,
//   Rainbow, Sparkles
// } from "lucide-react";

// // Sample data for demonstration - Amaha-style categories
// const sampleCategories = [
//   {
//     id: "breakup",
//     title: "Breakup",
//     subtitle: "1 out of every 4 people",
//     description: "has faced a breakup",
//     supportText: "It's okay to face a breakup",
//     Icon: Heart,
//     gradient: "from-[#E91E63] via-[#F06292] to-[#FF5722]",
//     glowColor: "shadow-[#E91E63]/30",
//     borderColor: "bg-[#E91E63]",
//     bgAccent: "bg-[#E91E63]/10",
//   },
//   {
//     id: "relationship",
//     title: "Relationship Issues",
//     subtitle: "Complex dynamics",
//     description: "Navigating relationship challenges",
//     supportText: "It's okay to have relationship issues",
//     Icon: Users,
//     gradient: "from-[#9C27B0] via-[#BA68C8] to-[#E1BEE7]",
//     glowColor: "shadow-[#9C27B0]/30",
//     borderColor: "bg-[#9C27B0]",
//     bgAccent: "bg-[#9C27B0]/10",
//   },
//   {
//     id: "divorce",
//     title: "Divorce",
//     subtitle: "Life transitions",
//     description: "Navigating divorce and separation",
//     supportText: "It's okay to have relationship issues",
//     Icon: Users,
//     gradient: "from-[#9C27B0] via-[#BA68C8] to-[#E1BEE7]",
//     glowColor: "shadow-[#9C27B0]/30",
//     borderColor: "bg-[#9C27B0]",
//     bgAccent: "bg-[#9C27B0]/10",
//   },
//   {
//     id: "loneliness",
//     title: "Loneliness",
//     subtitle: "Feeling isolated",
//     description: "Coping with social isolation",
//     supportText: "It's okay to feel lonely",
//     Icon: MessageCircle,
//     gradient: "from-[#4CAF50] via-[#81C784] to-[#C8E6C9]",
//     glowColor: "shadow-[#4CAF50]/30",
//     borderColor: "bg-[#4CAF50]",
//     bgAccent: "bg-[#4CAF50]/10",
//   },
//   {
//     id: "career",
//     title: "Career Stress",
//     subtitle: "Work pressure",
//     description: "Managing professional challenges",
//     supportText: "It's okay to feel overwhelmed about career",
//     Icon: Briefcase,
//     gradient: "from-[#FF9800] via-[#FFB74D] to-[#FFE0B2]",
//     glowColor: "shadow-[#FF9800]/30",
//     borderColor: "bg-[#FF9800]",
//     bgAccent: "bg-[#FF9800]/10",
//   },
//   {
//     id: "anxiety",
//     title: "Anxiety",
//     subtitle: "Chronic worry",
//     description: "Managing anxiety and stress",
//     supportText: "It's okay to feel anxious",
//     Icon: Brain,
//     gradient: "from-[#2196F3] via-[#64B5F6] to-[#BBDEFB]",
//     glowColor: "shadow-[#2196F3]/30",
//     borderColor: "bg-[#2196F3]",
//     bgAccent: "bg-[#2196F3]/10",
//   },
//   {
//     id: "depression",
//     title: "Depression",
//     subtitle: "Mental health support",
//     description: "Understanding and coping with depression",
//     supportText: "It's okay to feel depressed",
//     Icon: Frown,
//     gradient: "from-[#607D8B] via-[#90A4AE] to-[#CFD8DC]",
//     glowColor: "shadow-[#607D8B]/30",
//     borderColor: "bg-[#607D8B]",
//     bgAccent: "bg-[#607D8B]/10",
//   },
//   {
//     id: "suicidal",
//     title: "Suicidal Thoughts",
//     subtitle: "Crisis support",
//     description: "You're not alone—reach out",
//     supportText: "You're not alone—reach out",
//     Icon: AlertTriangle,
//     gradient: "from-[#F44336] via-[#EF5350] to-[#FFCDD2]",
//     glowColor: "shadow-[#F44336]/30",
//     borderColor: "bg-[#F44336]",
//     bgAccent: "bg-[#F44336]/10",
//   },
//   {
//     id: "trauma",
//     title: "Trauma",
//     subtitle: "Healing journey",
//     description: "Processing and healing from trauma",
//     supportText: "It's okay to seek help for trauma",
//     Icon: Shield,
//     gradient: "from-[#795548] via-[#A1887F] to-[#D7CCC8]",
//     glowColor: "shadow-[#795548]/30",
//     borderColor: "bg-[#795548]",
//     bgAccent: "bg-[#795548]/10",
//   },
// ];

// export default function CarouselDemoPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Explore Support Categories
//           </h1>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Connect with compassionate listeners who understand your unique needs and experiences.
//           </p>
//         </div>

//         {/* Carousel */}
//         <SupportCategoryCarousel 
//           categories={sampleCategories} 
//           className="mb-12"
//         />

//         {/* Features Section */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Responsive Design</h3>
//             <p className="text-gray-600">Adapts to different screen sizes with optimal card counts for each breakpoint.</p>
//           </div>
          
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Elements</h3>
//             <p className="text-gray-600">Hover effects, navigation arrows, and pagination dots for smooth user experience.</p>
//           </div>
          
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Modern Styling</h3>
//             <p className="text-gray-600">Clean cards with subtle shadows, rounded corners, and smooth transitions.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
