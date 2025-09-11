import { Heart, Users, Briefcase, Brain, Frown, AlertTriangle } from "lucide-react";
import type { Category } from "@/Components/CategoryCard";
import type { Listener } from "@/Components/ListenerCard";

export const categories: Category[] = [
  {
    id: "1",
    title: "Breakup",
    subtitle:  "Going through heartbreak? Let someone help you heal and move forward.",
    supportText: "Healing takes time, and that's okay",
    Icon: Heart,
    iconSrc: "/CategoryIcon/breakup.png",
    colors: { bg: "bg-[#FFF7E9]", borderTop: "bg-[#FFD39B]", icon: "text-[#FF9800]" },
  },
  {
    id: "2",
    title: "Relationship Issues",
    subtitle: "Navigating relationship challenges? Get guidance from experienced listeners.",
    supportText: "Healthy relationships are possible",
    Icon: Users,
    iconSrc: "/CategoryIcon/relationshipIssue.png",
    colors: { bg: "bg-[#FFF7E9]", borderTop: "bg-[#FFD39B]", icon: "text-[#FF9800]" },
  },
  // {
  //   id: "divorce",
  //   title: "Divorce",
  //   subtitle: "Navigating relationship challenges? Get guidance from experienced listeners.",
  //   supportText: "It's okay to have Divorce.",
  //   Icon: Users,
  //   iconSrc: "/CategoryIcon/divorce.png",
  //   colors: { bg: "bg-[#FFF7E9]", borderTop: "bg-[#FFD39B]", icon: "text-[#FF9800]"  },
  // },
  {
    id: "3",
    title: "Loneliness",
    subtitle: "Feeling isolated and disconnected? You're not alone in feeling alone. Don't Worry.",
    supportText: "Connection is just a conversation away",
    Icon: Frown,
    iconSrc: "/CategoryIcon/loneliness.png",
    colors: { bg: "bg-[#FFF7E9]", borderTop: "bg-[#FFD39B]", icon: "text-[#FF9800]" },
  },
  {
    id: "4",
    title: "Career Stress",
    subtitle: "Feeling overwhelmed by life's pressures? Find support and coping strategies.",
    supportText: "You don't have to carry it alone",
    Icon: Briefcase,
    iconSrc: "/CategoryIcon/careerStress.png",
    colors: { bg: "bg-[#FFF7E9]", borderTop: "bg-[#FFD39B]", icon: "text-[#FF9800]" },
  },
  {
    id: "5",
    title: "Anxiety",
    subtitle: "Feeling overwhelmed by worry and fear? Connect with someone who understands.",
    supportText: "You're stronger than your anxiety",
    Icon: Brain,
    iconSrc: "/CategoryIcon/anxiety.png",
    colors: { bg: "bg-[#FFF7E9]", borderTop: "bg-[#FFD39B]", icon: "text-[#FF9800]" },
  },
  {
    id: "6",
    title: "Depression",
    subtitle: "Does your life feel impossible & hopeless? You don't have to manage it alone.",
    supportText: "It's okay to feel depressed",
    Icon: Frown,
    iconSrc: "/CategoryIcon/depression.png",
    colors: { bg: "bg-[#FFF7E9]", borderTop: "bg-[#FFD39B]", icon: "text-[#FF9800]" },
  },
  {
    id: "7",
    title: "Suicidal Thoughts",
    subtitle:  "Struggling with self-worth? Discover your value with compassionate support.",
    supportText: "You are worthy of love and respect",
    Icon: AlertTriangle,
    iconSrc: "/CategoryIcon/suicide.png",
    colors: { bg: "bg-[#FFF7E9]", borderTop: "bg-[#FFD39B]", icon: "text-[#FF9800]" },
  },
  {
    id: "8",
    title: "Trauma",
    subtitle:  "Struggling with self-worth? Discover your value with compassionate support.",
    supportText: "It's okay to seek help for trauma",
    Icon: Heart,
    iconSrc: "/CategoryIcon/trauma.png",
    colors: { bg: "bg-[#FFF7E9]", borderTop: "bg-[#FFD39B]", icon: "text-[#FF9800]" },
  },
  
];

export const listeners: Listener[] = [
  {
    id: "l1",
    name: "Aarav Mehta",
    image: "https://i.pravatar.cc/100?img=12",
    category: "Breakup",
    description: "Been through a tough breakup myself. I can listen without judgment and help you navigate the waves.",
    badge: "Experienced",
  },
  {
    id: "l2",
    name: "Sana Kapoor",
    image: "https://i.pravatar.cc/100?img=32",
    category: "Relationship",
    description: "Communication, boundaries, and trust are my focus areas. Happy to support couples or individuals.",
    badge: "Verified",
  },
  {
    id: "l3",
    name: "Kabir Singh",
    image: "https://i.pravatar.cc/100?img=21",
    category: "Career",
    description: "Ex-startup PM who burned out and rebuilt. I can help with stress, prioritization, and clarity.",
  },
  {
    id: "l4",
    name: "Isha Verma",
    image: "https://i.pravatar.cc/100?img=45",
    category: "Anxiety",
    description: "Mindfulness-first listener. Practical tools for grounding and gentle exposure.",
    badge: "Experienced",
  },
  {
    id: "l5",
    name: "Rohan Das",
    image: "https://i.pravatar.cc/100?img=15",
    category: "Depression",
    description: "I show up consistently and help you build tiny steps that compound.",
  },
  {
    id: "l6",
    name: "Maya Rao",
    image: "https://i.pravatar.cc/100?img=5",
    category: "Loneliness",
    description: "If you feel invisible, I get it. We'll find ways to connect and feel seen again.",
  },
  {
    id: "l7",
    name: "Ankit Sharma",
    image: "https://i.pravatar.cc/100?img=7",
    category: "Trauma",
    description: "Trauma-aware support with an emphasis on safety and stability. I am not a therapist.",
    badge: "Verified",
  },
  {
    id: "l8",
    name: "Zoya Khan",
    image: "https://i.pravatar.cc/100?img=18",
    category: "Suicidal Thoughts",
    description: "If you're in crisis, call local emergency services. I can sit with you through tough moments.",
  },
  {
    id: "l9",
    name: "Zoya Khan",
    image: "https://i.pravatar.cc/100?img=18",
    category: "Divorce",
    description: "If you're in crisis, call local emergency services. I can sit with you through tough moments.",
  },
];

// Enhanced listener data with additional fields for the new card design
export const enhancedListeners = [
  {
    id: "l1",
    name: "Aarav Mehta",
    image: "https://i.pravatar.cc/100?img=12",
    category: "Breakup",
    description: "Been through a tough breakup myself. I can listen without judgment and help you navigate the waves.",
    badge: "Experienced",
    rating: 4.8,
    tags: ["Breakup", "Relationships", "Healing"],
    languages: ["English", "Hindi"]
  },
  {
    id: "l2",
    name: "Sana Kapoor",
    image: "https://i.pravatar.cc/100?img=32",
    category: "Relationship",
    description: "Communication, boundaries, and trust are my focus areas. Happy to support couples or individuals.",
    badge: "Verified",
    rating: 4.9,
    tags: ["Relationships", "Communication", "Trust"],
    languages: ["English", "Hindi", "Punjabi"]
  },
  {
    id: "l3",
    name: "Kabir Singh",
    image: "https://i.pravatar.cc/100?img=21",
    category: "Career",
    description: "Ex-startup PM who burned out and rebuilt. I can help with stress, prioritization, and clarity.",
    rating: 4.7,
    tags: ["Career", "Stress", "Productivity"],
    languages: ["English", "Hindi"]
  },
  {
    id: "l4",
    name: "Isha Verma",
    image: "https://i.pravatar.cc/100?img=45",
    category: "Anxiety",
    description: "Mindfulness-first listener. Practical tools for grounding and gentle exposure.",
    badge: "Experienced",
    rating: 4.9,
    tags: ["Anxiety", "Mindfulness", "Coping"],
    languages: ["English", "Hindi", "Tamil"]
  },
  {
    id: "l5",
    name: "Rohan Das",
    image: "https://i.pravatar.cc/100?img=15",
    category: "Depression",
    description: "I show up consistently and help you build tiny steps that compound.",
    rating: 4.6,
    tags: ["Depression", "Motivation", "Support"],
    languages: ["English", "Bengali"]
  },
  {
    id: "l6",
    name: "Maya Rao",
    image: "https://i.pravatar.cc/100?img=5",
    category: "Loneliness",
    description: "If you feel invisible, I get it. We'll find ways to connect and feel seen again.",
    rating: 4.8,
    tags: ["Loneliness", "Connection", "Social"],
    languages: ["English", "Telugu"]
  },
  {
    id: "l7",
    name: "Ankit Sharma",
    image: "https://i.pravatar.cc/100?img=7",
    category: "Trauma",
    description: "Trauma-aware support with an emphasis on safety and stability. I am not a therapist.",
    badge: "Verified",
    rating: 4.9,
    tags: ["Trauma", "Safety", "Recovery"],
    languages: ["English", "Hindi"]
  },
  {
    id: "l8",
    name: "Zoya Khan",
    image: "https://i.pravatar.cc/100?img=18",
    category: "Suicidal Thoughts",
    description: "If you're in crisis, call local emergency services. I can sit with you through tough moments.",
    rating: 4.7,
    tags: ["Crisis", "Support", "Safety"],
    languages: ["English", "Urdu"]
  },
  {
    id: "l9",
    name: "Priya Patel",
    image: "https://i.pravatar.cc/100?img=18",
    category: "Divorce",
    description: "Navigating divorce can be overwhelming. I'm here to listen and support you through this transition.",
    rating: 4.8,
    tags: ["Divorce", "Family", "Transition"],
    languages: ["English", "Gujarati"]
  },
];


