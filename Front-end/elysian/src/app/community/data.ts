import { Heart, Briefcase, Brain, Frown, Users } from "lucide-react";
import type { ComponentType } from "react";

export type CommunityTopic = {
  id: string;
  name: string;
  tagline: string;
  Icon: ComponentType<{ className?: string }>;
  colors: {
    bg: string;
    top: string;
    icon: string;
  };
};

export const communityTopics: CommunityTopic[] = [
  {
    id: "breakup",
    name: "Breakup Support",
    tagline: "You’re not alone in this journey",
    Icon: Heart,
    colors: { bg: "bg-[#FFF4F6]", top: "bg-[#FFB3C6]", icon: "text-[#E91E63]" },
  },
  {
    id: "career",
    name: "Career Stress",
    tagline: "Navigate pressure with clarity",
    Icon: Briefcase,
    colors: { bg: "bg-[#FFF7E9]", top: "bg-[#FFD39B]", icon: "text-[#FF9800]" },
  },
  {
    id: "anxiety",
    name: "Anxiety Circle",
    tagline: "Grounding, breathing, support",
    Icon: Brain,
    colors: { bg: "bg-[#F0F3FF]", top: "bg-[#B7C3FF]", icon: "text-[#3F51B5]" },
  },
  {
    id: "depression",
    name: "Depression Support",
    tagline: "Tiny steps forward together",
    Icon: Frown,
    colors: { bg: "bg-[#F5F7F8]", top: "bg-[#B5C2C9]", icon: "text-[#607D8B]" },
  },
  {
    id: "loneliness",
    name: "Loneliness",
    tagline: "Find belonging and connection",
    Icon: Users,
    colors: { bg: "bg-[#F1FFF4]", top: "bg-[#A6E7C5]", icon: "text-[#4CAF50]" },
  },
];


