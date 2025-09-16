import CompactSupportCarousel from '@/Components/CompactSupportCarousel';
import { 
  CloudRain, Activity, Shield, Users, Brain, MessageCircle, Venus
} from "lucide-react";

// Exact Amaha-style mental health concerns data
const amahaCategories = [
  {
    id: "depression",
    title: "Depression",
    description: "Does your life feel impossible & hopeless? You don't have to manage it alone.",
    Icon: CloudRain,
    bgAccent: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "anxiety",
    title: "Anxiety",
    description: "Chronic worry, mental fatigue, and feeling like your thoughts are always one step ahead of you?",
    Icon: Activity,
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
    Icon: Venus,
    bgAccent: "bg-pink-100",
    iconColor: "text-pink-600",
  },
];

export default function AmahaStyleDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-green-800 mb-6">
              Mental health concerns we care for
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Amaha offers support for 30+ mental health conditions. Explore some of the most common ones below to see how we approach care.
            </p>
          </div>

          {/* Amaha-Style Carousel */}
          <CompactSupportCarousel 
            categories={amahaCategories}
            title=""
            subtitle=""
            className="!py-0"
          />

          {/* Additional Information */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Why Choose Amaha?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Expert Care</h3>
                <p className="text-gray-600 text-sm">
                  Licensed mental health professionals with specialized training in various conditions.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Personalized Approach</h3>
                <p className="text-gray-600 text-sm">
                  Tailored treatment plans that address your unique needs and circumstances.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">24/7 Support</h3>
                <p className="text-gray-600 text-sm">
                  Round-the-clock access to mental health resources and crisis support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
