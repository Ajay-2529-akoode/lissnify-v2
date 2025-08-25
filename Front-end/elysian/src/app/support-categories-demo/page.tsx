import CompactSupportCarousel from '@/Components/CompactSupportCarousel';
import { 
  Heart, Users, MessageCircle, Briefcase, Brain, Frown, AlertTriangle, Shield
} from "lucide-react";

// Exact "Explore Support Categories" data from the reference image
const supportCategories = [
  {
    id: "breakup",
    title: "Breakup",
    description: "It's okay to face a breakup",
    Icon: Heart,
    bgAccent: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    id: "relationship-issues",
    title: "Relationship Issues",
    description: "It's okay to have relationship issues",
    Icon: Users,
    bgAccent: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: "divorce",
    title: "Divorce",
    description: "It's okay to have relationship issues",
    Icon: Users,
    bgAccent: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: "loneliness",
    title: "Loneliness",
    description: "It's okay to feel lonely",
    Icon: MessageCircle,
    bgAccent: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: "career-stress",
    title: "Career Stress",
    description: "It's okay to feel overwhelmed about career",
    Icon: Briefcase,
    bgAccent: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: "anxiety",
    title: "Anxiety",
    description: "It's okay to feel anxious",
    Icon: Brain,
    bgAccent: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "depression",
    title: "Depression",
    description: "It's okay to feel depressed",
    Icon: Frown,
    bgAccent: "bg-gray-100",
    iconColor: "text-gray-600",
  },
  {
    id: "suicidal-thoughts",
    title: "Suicidal Thoughts",
    description: "You're not alone—reach out",
    Icon: AlertTriangle,
    bgAccent: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: "trauma",
    title: "Trauma",
    description: "It's okay to seek help for trauma",
    Icon: Shield,
    bgAccent: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

export default function SupportCategoriesDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Main Content */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Support Categories 
            </h1> 
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with compassionate listeners who understand your unique needs and experiences.
            </p>
          </div>

          {/* Support Categories Carousel */}
          <CompactSupportCarousel 
            categories={supportCategories}
            title=""
            subtitle=""
            className="!py-0"
          />
        </div>
      </div>
    </div>
  );
}
