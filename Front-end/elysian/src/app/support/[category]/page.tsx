import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryById, allCategoryIds } from "../categories";
import { 
  ArrowLeft, 
  Heart, 
  Users, 
  Phone, 
  MessageCircle, 
  Calendar,
  Star,
  TrendingUp,
  Shield,
  Target,
  Clock,
  TreePine,
  Palette,
  Dumbbell,
  Headphones,
  HeartHandshake,
  Wind,
  Waves,
  Sun,
  Mountain,
  Flower,
  Bird,
  Fish,
  PawPrint,
  Rainbow,
  Sparkles,
  AlertTriangle,
  Users2,
  Brain
} from "lucide-react";

type Params = {
  params: {
    category: string;
  };
};

export function generateStaticParams() {
  return allCategoryIds();
}

export default function SupportCategoryPage({ params }: Params) {
  const { category } = params;
  const data = getCategoryById(category);

  if (!data) {
    notFound();
  }

  const Icon = data.Icon;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFE4CC] to-[#F0E6FF]">
      {/* Navigation */}
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#555] hover:text-[#2E2E2E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-8 px-8 py-4 rounded-full bg-white/95 backdrop-blur-sm border-2 border-[#FFE4CC] shadow-lg">
            <Icon className="w-6 h-6 text-[#E91E63] animate-pulse" />
            <span className="text-[#2E2E2E] font-semibold text-sm tracking-wider">MENTAL HEALTH SUPPORT</span>
            <Users className="w-6 h-6 text-[#4CAF50] animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-[#2E2E2E] leading-tight mb-8 drop-shadow-sm">
            {data.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-[#2E2E2E] max-w-4xl mx-auto leading-relaxed font-medium mb-6">
            {data.supportText}
          </p>

          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/95 backdrop-blur-sm border-2 border-[#FFE4CC] shadow-lg">
            <span className="text-lg font-semibold text-[#2E2E2E]">{data.subtitle}</span>
            <span className="text-[#555]">{data.description}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description */}
            <div className="bg-white/90 rounded-3xl shadow-xl border-2 border-[#EEE] p-8">
              <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-3">
                <Icon className="w-8 h-8 text-[#E91E63]" />
                About {data.title}
              </h2>
              <div className="space-y-4">
                {data.longDescription.map((paragraph, index) => (
                  <p key={index} className="text-[#2E2E2E] leading-relaxed text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div className="bg-white/90 rounded-3xl shadow-xl border-2 border-[#EEE] p-8">
              <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-[#F44336]" />
                Common Symptoms
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.symptoms.map((symptom, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-[#F8F9FA] rounded-xl">
                    <div className="w-2 h-2 bg-[#E91E63] rounded-full"></div>
                    <span className="text-[#2E2E2E]">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coping Strategies */}
            <div className="bg-white/90 rounded-3xl shadow-xl border-2 border-[#EEE] p-8">
              <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-3">
                <Shield className="w-8 h-8 text-[#4CAF50]" />
                Coping Strategies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.copingStrategies.map((strategy, index) => {
                  const StrategyIcon = strategy.icon;
                  return (
                    <div key={index} className="p-6 bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] rounded-2xl border border-[#DEE2E6]">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                          <StrategyIcon className="w-6 h-6 text-[#E91E63]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#2E2E2E]">{strategy.title}</h3>
                      </div>
                      <p className="text-[#555] leading-relaxed">{strategy.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Personal Stories */}
            <div className="bg-white/90 rounded-3xl shadow-xl border-2 border-[#EEE] p-8">
              <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-3">
                <Heart className="w-8 h-8 text-[#E91E63]" />
                Stories from Our Community
              </h2>
              <div className="space-y-6">
                {data.personalStories.map((story, index) => (
                  <div key={index} className="p-6 bg-gradient-to-br from-[#FFF8F0] to-[#FFE4CC] rounded-2xl border border-[#FFE4CC]">
                    <h3 className="text-xl font-semibold text-[#2E2E2E] mb-3">{story.title}</h3>
                    <p className="text-[#555] leading-relaxed mb-4 italic">"{story.excerpt}"</p>
                    <div className="flex items-center gap-4 text-sm text-[#666]">
                      <span className="font-medium">{story.author}</span>
                      <span>•</span>
                      <span>{story.age} years old</span>
                      <span>•</span>
                      <span>{story.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Affirmations */}
            <div className="bg-white/90 rounded-3xl shadow-xl border-2 border-[#EEE] p-8">
              <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-3">
                <Star className="w-8 h-8 text-[#FF9800]" />
                Daily Affirmations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.dailyAffirmations.map((affirmation, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-[#FFF8F0] to-[#FFE4CC] rounded-xl border border-[#FFE4CC] text-center">
                    <p className="text-[#2E2E2E] font-medium leading-relaxed">"{affirmation}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column - Resources & Tools */}
          <div className="space-y-8">
            
            {/* Community Resources */}
            <div className="bg-white/90 rounded-3xl shadow-xl border-2 border-[#EEE] p-6">
              <h2 className="text-xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-3">
                <Users2 className="w-6 h-6 text-[#4CAF50]" />
                Community Resources
              </h2>
              <div className="space-y-4">
                {data.communityResources.map((resource, index) => {
                  const ResourceIcon = resource.icon;
                  return (
                    <div key={index} className="p-4 bg-[#F8F9FA] rounded-xl hover:bg-[#E9ECEF] transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          <ResourceIcon className="w-5 h-5 text-[#E91E63]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#2E2E2E] text-sm">{resource.title}</h3>
                          <p className="text-[#666] text-xs">{resource.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Professional Help */}
            <div className="bg-white/90 rounded-3xl shadow-xl border-2 border-[#EEE] p-6">
              <h2 className="text-xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-3">
                <Brain className="w-6 h-6 text-[#9C27B0]" />
                Professional Help
              </h2>
              <div className="space-y-4">
                {data.professionalHelp.map((help, index) => {
                  const HelpIcon = help.icon;
                  return (
                    <div key={index} className="p-4 bg-[#F8F9FA] rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white rounded-lg">
                          <HelpIcon className="w-5 h-5 text-[#9C27B0]" />
                        </div>
                        <h3 className="font-semibold text-[#2E2E2E] text-sm">{help.title}</h3>
                      </div>
                      <p className="text-[#666] text-xs mb-3">{help.description}</p>
                      {help.contact && (
                        <button className="text-xs text-[#E91E63] hover:text-[#C2185B] font-medium">
                          {help.contact}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-gradient-to-br from-[#F44336]/10 to-[#E53935]/10 rounded-3xl border-2 border-[#F44336]/20 p-6">
              <h2 className="text-xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-3">
                <Phone className="w-6 h-6 text-[#F44336]" />
                Emergency Contacts
              </h2>
              <div className="space-y-4">
                {data.emergencyContacts.map((contact, index) => (
                  <div key={index} className="p-4 bg-white/80 rounded-xl border border-[#F44336]/20">
                    <h3 className="font-semibold text-[#2E2E2E] text-sm mb-2">{contact.name}</h3>
                    <p className="text-[#F44336] font-bold text-lg mb-1">{contact.number}</p>
                    <p className="text-[#666] text-xs">{contact.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Trackers */}
            <div className="bg-white/90 rounded-3xl shadow-xl border-2 border-[#EEE] p-6">
              <h2 className="text-xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-[#4CAF50]" />
                Track Your Progress
              </h2>
              <div className="space-y-4">
                {data.progressTrackers.map((tracker, index) => {
                  const TrackerIcon = tracker.icon;
                  return (
                    <div key={index} className="p-4 bg-[#F8F9FA] rounded-xl hover:bg-[#E9ECEF] transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          <TrackerIcon className="w-5 h-5 text-[#4CAF50]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#2E2E2E] text-sm">{tracker.name}</h3>
                          <p className="text-[#666] text-xs">{tracker.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Activities */}
            <div className="bg-white/90 rounded-3xl shadow-xl border-2 border-[#EEE] p-6">
              <h2 className="text-xl font-bold text-[#2E2E2E] mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-[#FF9800]" />
                Recommended Activities
              </h2>
              <div className="space-y-4">
                {data.recommendedActivities.map((activity, index) => {
                  const ActivityIcon = activity.icon;
                  return (
                    <div key={index} className="p-4 bg-[#F8F9FA] rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white rounded-lg">
                          <ActivityIcon className="w-5 h-5 text-[#FF9800]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#2E2E2E] text-sm">{activity.name}</h3>
                          <p className="text-[#666] text-xs">{activity.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#666]">
                        <Clock className="w-3 h-3" />
                        <span>{activity.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/90 rounded-3xl shadow-xl border-2 border-[#EEE] p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#2E2E2E] mb-6">Ready to Get Support?</h2>
            <p className="text-[#555] text-lg mb-8 max-w-2xl mx-auto">
              You don't have to face this alone. Connect with others who understand your journey and find the support you deserve.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="px-8 py-4 bg-gradient-to-r from-[#E91E63] to-[#9C27B0] text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Explore All Categories
              </Link>
              <button className="px-8 py-4 bg-white border-2 border-[#E91E63] text-[#E91E63] font-semibold rounded-full hover:bg-[#E91E63] hover:text-white transition-all duration-300">
                Find a Therapist
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

