import CompactSupportCarousel from '@/Components/CompactSupportCarousel';
import { 
  Heart, Users, Briefcase, Brain, Frown, AlertTriangle, 
  MessageCircle, Shield
} from "lucide-react";

// Sample data for the compact carousel - Exact Amaha-style categories
const compactCategories = [
  {
    id: "depression",
    title: "Depression",
    description: "Does your life feel impossible & hopeless? You don't have to manage it alone.",
    Icon: Frown,
    bgAccent: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "anxiety",
    title: "Anxiety",
    description: "Chronic worry, mental fatigue, and feeling like your thoughts are always one step ahead of you?",
    Icon: Brain,
    bgAccent: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: "ocd",
    title: "Obsessive Compulsive Disorder (OCD)",
    description: "Are your thoughts out of control & making you feel overwhelmed? You can find ways to cope better.",
    Icon: Shield,
    bgAccent: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: "bipolar",
    title: "Bipolar Disorder",
    description: "Are you struggling with episodes of mania or depression? You can find the care you need with us.",
    Icon: Users,
    bgAccent: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    id: "adhd",
    title: "Adult ADHD",
    description: "Have you always struggled with difficulty focussing, being restless, or impulsivity? There are ways to manage it better.",
    Icon: Brain,
    bgAccent: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    id: "social-anxiety",
    title: "Social Anxiety",
    description: "Do social settings make you anxious and fearful? We can help you cope with social situations better.",
    Icon: MessageCircle,
    bgAccent: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    id: "womens-health",
    title: "Women's Health",
    description: "Is your mental health taking a toll due to hormonal, sexual or fertility concerns? We can help improve your well-being.",
    Icon: Heart,
    bgAccent: "bg-pink-100",
    iconColor: "text-pink-600",
  },
];

export default function CompactCarouselDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mental Health Support
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional mental health care and support for your well-being journey.
          </p>
        </div>
      </div>

      {/* Compact Carousel */}
      <CompactSupportCarousel 
        categories={compactCategories}
        title="Mental health concerns we care for"
        subtitle="Amaha offers support for 30+ mental health conditions. Explore some of the most common ones below to see how we approach care."
      />

      {/* Additional Info */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Responsive Design</h3>
              <p className="text-gray-600 text-sm">
                Automatically adjusts card count based on screen size for optimal viewing experience.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Interactive Elements</h3>
              <p className="text-gray-600 text-sm">
                Smooth hover effects, navigation arrows, and pagination dots for enhanced user interaction.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Easy Integration</h3>
              <p className="text-gray-600 text-sm">
                Simple props interface makes it easy to customize and integrate into any page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
