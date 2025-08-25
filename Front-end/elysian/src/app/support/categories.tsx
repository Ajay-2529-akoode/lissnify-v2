import { 
  Heart, Users, Briefcase, Brain, Frown, AlertTriangle,
  MessageCircle, Phone, Calendar, Users2, Shield, Target,
  TrendingUp, Clock, Star, TreePine, Palette, Dumbbell,
  Headphones, HeartHandshake, Wind, Waves, Sun,
  Mountain, Flower, Bird, Fish, PawPrint,
  Rainbow, Sparkles
} from "lucide-react";
import type { ComponentType } from "react";

export type SupportCategory = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  supportText: string;
  encouragement: string;
  gradient: string;
  glowColor: string;
  borderColor: string;
  bgAccent: string;
  Icon: ComponentType<{ className?: string }>;
  longDescription: string[];
  symptoms: string[];
  copingStrategies: {
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
  }[];
  communityResources: {
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    link?: string;
  }[];
  professionalHelp: {
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    contact?: string;
  }[];
  emergencyContacts: {
    name: string;
    number: string;
    description: string;
  }[];
  personalStories: {
    title: string;
    excerpt: string;
    author: string;
    age: number;
    location: string;
  }[];
  dailyAffirmations: string[];
  progressTrackers: {
    name: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
  }[];
  recommendedActivities: {
    name: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    duration: string;
  }[];
};

export const supportCategories: SupportCategory[] = [
  {
    id: "breakup",
    title: "Breakup Recovery",
    subtitle: "1 out of every 4 people",
    description: "has faced a breakup",
    supportText: "It's okay to face a breakup",
    encouragement: "You're not alone!",
    Icon: Heart,
    gradient: "from-[#E91E63] via-[#F06292] to-[#FF5722]",
    glowColor: "shadow-[#E91E63]/30",
    borderColor: "border-[#E91E63]/30",
    bgAccent: "bg-[#E91E63]/10",
    longDescription: [
      "Breakups can shake our sense of identity and safety. It is normal to feel grief, anger, relief, or confusion—all at once.",
      "Take your time to heal. Reflect, lean on trusted people, and rebuild routines that nourish you.",
      "Remember: healing isn't linear. Some days you'll feel strong, others you'll feel fragile. Both are valid."
    ],
    symptoms: [
      "Intense sadness and grief",
      "Anger and resentment",
      "Loneliness and isolation",
      "Loss of appetite or overeating",
      "Difficulty sleeping",
      "Low self-esteem",
      "Anxiety about the future",
      "Physical symptoms like chest pain"
    ],
    copingStrategies: [
      {
        title: "Self-Care Rituals",
        description: "Create daily routines that make you feel good - bubble baths, walks, favorite meals",
        icon: Heart
      },
      {
        title: "Express Your Feelings",
        description: "Write in a journal, paint, or talk to trusted friends about your emotions",
        icon: Palette
      },
      {
        title: "Physical Activity",
        description: "Exercise releases endorphins and helps process emotions",
        icon: Dumbbell
      },
      {
        title: "Mindfulness Practice",
        description: "Meditation and deep breathing can help ground you in the present",
        icon: TreePine
      }
    ],
    communityResources: [
      {
        title: "Breakup Support Groups",
        description: "Connect with others who understand your journey",
        icon: Users2,
        link: "#"
      },
      {
        title: "Online Forums",
        description: "Anonymous spaces to share and receive support",
        icon: MessageCircle,
        link: "#"
      },
      {
        title: "Recovery Workshops",
        description: "Structured programs to rebuild confidence",
        icon: Calendar,
        link: "#"
      }
    ],
    professionalHelp: [
      {
        title: "Individual Therapy",
        description: "One-on-one sessions to process emotions and develop coping skills",
        icon: Brain,
        contact: "Find a therapist in your area"
      },
      {
        title: "Group Therapy",
        description: "Share experiences and learn from others in similar situations",
        icon: Users,
        contact: "Ask your therapist about group options"
      }
    ],
    emergencyContacts: [
      {
        name: "Crisis Text Line",
        number: "Text HOME to 741741",
        description: "24/7 crisis support via text"
      },
      {
        name: "National Suicide Prevention Lifeline",
        number: "988",
        description: "24/7 crisis support and suicide prevention"
      }
    ],
    personalStories: [
      {
        title: "Finding Myself Again",
        excerpt: "After my breakup, I felt like I lost my identity. But slowly, I rediscovered who I am without that relationship...",
        author: "Sarah",
        age: 28,
        location: "New York"
      },
      {
        title: "The Power of Time",
        excerpt: "They say time heals all wounds. While that's not entirely true, time does give you perspective...",
        author: "Michael",
        age: 32,
        location: "California"
      }
    ],
    dailyAffirmations: [
      "I am worthy of love and respect",
      "My feelings are valid and temporary",
      "I am growing stronger every day",
      "I deserve happiness and peace",
      "My future is bright and full of possibilities"
    ],
    progressTrackers: [
      {
        name: "Mood Tracker",
        description: "Monitor your emotional ups and downs",
        icon: TrendingUp
      },
      {
        name: "Self-Care Checklist",
        description: "Track daily self-care activities",
        icon: Heart
      },
      {
        name: "Goals Journal",
        description: "Set and track personal growth goals",
        icon: Target
      }
    ],
    recommendedActivities: [
      {
        name: "Nature Walks",
        description: "Connect with nature to find peace",
        icon: TreePine,
        duration: "30-60 minutes"
      },
      {
        name: "Creative Expression",
        description: "Express emotions through art or writing",
        icon: Palette,
        duration: "45 minutes"
      },
      {
        name: "Social Connection",
        description: "Reach out to friends and family",
        icon: Users,
        duration: "1-2 hours"
      }
    ]
  },
  {
    id: "relationship",
    title: "Relationship Issues",
    subtitle: "1 out of every 3 people",
    description: "is facing relationship challenges",
    supportText: "It's okay to have relationship issues",
    encouragement: "You're not alone!",
    Icon: Users,
    gradient: "from-[#9C27B0] via-[#BA68C8] to-[#673AB7]",
    glowColor: "shadow-[#9C27B0]/30",
    borderColor: "border-[#9C27B0]/30",
    bgAccent: "bg-[#9C27B0]/10",
    longDescription: [
      "Relationships take work. Communication gaps, mismatched needs, and trust concerns are common and workable.",
      "Practice compassionate honesty and set healthy boundaries while seeking mutual understanding.",
      "Every relationship has challenges - what matters is how you face them together."
    ],
    symptoms: [
      "Frequent arguments and misunderstandings",
      "Lack of communication",
      "Trust issues and jealousy",
      "Emotional distance",
      "Different values or goals",
      "Lack of intimacy",
      "Feeling unheard or invalidated",
      "Constant stress about the relationship"
    ],
    copingStrategies: [
      {
        title: "Active Listening",
        description: "Practice truly hearing your partner without planning your response",
        icon: Headphones
      },
      {
        title: "Boundary Setting",
        description: "Learn to say no and communicate your needs clearly",
        icon: Shield
      },
      {
        title: "Quality Time",
        description: "Schedule regular date nights and meaningful conversations",
        icon: Calendar
      },
      {
        title: "Individual Growth",
        description: "Work on yourself while working on the relationship",
        icon: TrendingUp
      }
    ],
    communityResources: [
      {
        title: "Couples Workshops",
        description: "Learn communication and conflict resolution skills",
        icon: Users2,
        link: "#"
      },
      {
        title: "Relationship Forums",
        description: "Get advice from others facing similar challenges",
        icon: MessageCircle,
        link: "#"
      },
      {
        title: "Support Groups",
        description: "Connect with others working on their relationships",
        icon: HeartHandshake,
        link: "#"
      }
    ],
    professionalHelp: [
      {
        title: "Couples Therapy",
        description: "Work through issues together with a professional",
        icon: Users,
        contact: "Find a couples therapist"
      },
      {
        title: "Individual Therapy",
        description: "Address personal issues affecting the relationship",
        icon: Brain,
        contact: "Find an individual therapist"
      }
    ],
    emergencyContacts: [
      {
        name: "Relationship Crisis Line",
        number: "1-800-799-SAFE",
        description: "Domestic violence and relationship crisis support"
      }
    ],
    personalStories: [
      {
        title: "Learning to Communicate",
        excerpt: "We were constantly fighting because neither of us knew how to express our needs...",
        author: "Emma",
        age: 31,
        location: "Texas"
      },
      {
        title: "Rebuilding Trust",
        excerpt: "After the affair, I didn't think we could ever recover. But with hard work...",
        author: "David",
        age: 35,
        location: "Florida"
      }
    ],
    dailyAffirmations: [
      "I am worthy of a healthy relationship",
      "Communication is a skill I can improve",
      "My needs and feelings matter",
      "I can set boundaries with love",
      "Every challenge is an opportunity to grow"
    ],
    progressTrackers: [
      {
        name: "Communication Log",
        description: "Track positive and difficult conversations",
        icon: MessageCircle
      },
      {
        name: "Quality Time Tracker",
        description: "Monitor time spent connecting with partner",
        icon: Calendar
      },
      {
        name: "Conflict Resolution",
        description: "Track how conflicts are resolved",
        icon: Shield
      }
    ],
    recommendedActivities: [
      {
        name: "Weekly Check-ins",
        description: "Regular relationship status conversations",
        icon: Calendar,
        duration: "30 minutes"
      },
      {
        name: "Shared Hobbies",
        description: "Find activities you both enjoy",
        icon: Heart,
        duration: "1-2 hours"
      },
      {
        name: "Gratitude Practice",
        description: "Express appreciation daily",
        icon: Star,
        duration: "5 minutes"
      }
    ]
  },
  {
    id: "loneliness",
    title: "Loneliness & Isolation",
    subtitle: "1 out of every 2 people",
    description: "has faced loneliness",
    supportText: "It's okay to feel lonely",
    encouragement: "You're not alone!",
    Icon: Frown,
    gradient: "from-[#4CAF50] via-[#66BB6A] to-[#81C784]",
    glowColor: "shadow-[#4CAF50]/30",
    borderColor: "border-[#4CAF50]/30",
    bgAccent: "bg-[#4CAF50]/10",
    longDescription: [
      "Loneliness isn't just about being alone—it can appear even when surrounded by people.",
      "Building small, consistent connections and joining communities can help restore a sense of belonging.",
      "Loneliness is a signal that you need more meaningful connections, not a sign of failure."
    ],
    symptoms: [
      "Feeling disconnected from others",
      "Social anxiety and withdrawal",
      "Difficulty making friends",
      "Feeling misunderstood",
      "Low energy and motivation",
      "Sleep problems",
      "Changes in appetite",
      "Feeling invisible or unimportant"
    ],
    copingStrategies: [
      {
        title: "Small Social Steps",
        description: "Start with brief interactions and gradually increase social time",
        icon: Users
      },
      {
        title: "Join Communities",
        description: "Find groups based on your interests or hobbies",
        icon: Users2
      },
      {
        title: "Volunteer",
        description: "Help others while building connections",
        icon: HeartHandshake
      },
      {
        title: "Self-Compassion",
        description: "Be kind to yourself about feeling lonely",
        icon: Heart
      }
    ],
    communityResources: [
      {
        title: "Interest-Based Groups",
        description: "Find people who share your hobbies",
        icon: Users2,
        link: "#"
      },
      {
        title: "Volunteer Opportunities",
        description: "Connect through helping others",
        icon: HeartHandshake,
        link: "#"
      },
      {
        title: "Social Skills Workshops",
        description: "Learn to build and maintain friendships",
        icon: Users,
        link: "#"
      }
    ],
    professionalHelp: [
      {
        title: "Social Skills Therapy",
        description: "Work on building confidence in social situations",
        icon: Brain,
        contact: "Find a therapist specializing in social skills"
      },
      {
        title: "Group Therapy",
        description: "Practice social skills in a safe environment",
        icon: Users,
        contact: "Ask about group therapy options"
      }
    ],
    emergencyContacts: [
      {
        name: "Crisis Text Line",
        number: "Text HOME to 741741",
        description: "24/7 crisis support via text"
      }
    ],
    personalStories: [
      {
        title: "Finding My Tribe",
        excerpt: "I moved to a new city and felt completely alone. Then I joined a book club...",
        author: "Lisa",
        age: 26,
        location: "Colorado"
      },
      {
        title: "Learning to Connect",
        excerpt: "Social anxiety made me avoid people, but therapy taught me...",
        author: "James",
        age: 29,
        location: "Washington"
      }
    ],
    dailyAffirmations: [
      "I am worthy of connection and friendship",
      "My loneliness is temporary and manageable",
      "I can take small steps toward connection",
      "I have valuable qualities to offer others",
      "Building relationships takes time and patience"
    ],
    progressTrackers: [
      {
        name: "Social Interaction Tracker",
        description: "Monitor daily social interactions",
        icon: Users
      },
      {
        name: "Community Involvement",
        description: "Track participation in groups or activities",
        icon: Users2
      },
      {
        name: "Friendship Goals",
        description: "Set and track social connection goals",
        icon: Target
      }
    ],
    recommendedActivities: [
      {
        name: "Join Online Communities",
        description: "Start with virtual connections",
        icon: MessageCircle,
        duration: "30 minutes daily"
      },
      {
        name: "Attend Local Events",
        description: "Check community calendars for activities",
        icon: Calendar,
        duration: "2-3 hours weekly"
      },
      {
        name: "Reach Out to Old Friends",
        description: "Reconnect with people from your past",
        icon: Phone,
        duration: "15 minutes"
      }
    ]
  },
  {
    id: "career",
    title: "Career Stress & Burnout",
    subtitle: "1 out of every 3 people",
    description: "is struggling with career stress",
    supportText: "It's okay to feel overwhelmed about career",
    encouragement: "You're not alone!",
    Icon: Briefcase,
    gradient: "from-[#FF9800] via-[#FFB74D] to-[#F57C00]",
    glowColor: "shadow-[#FF9800]/30",
    borderColor: "border-[#FF9800]/30",
    bgAccent: "bg-[#FF9800]/10",
    longDescription: [
      "Workload, uncertainty, and expectations can become heavy.",
      "Clarify priorities, protect rest, and seek support for sustainable growth.",
      "Your career should support your life, not consume it."
    ],
    symptoms: [
      "Constant exhaustion and fatigue",
      "Difficulty concentrating",
      "Irritability and mood swings",
      "Physical symptoms like headaches",
      "Loss of motivation and passion",
      "Sleep problems",
      "Increased cynicism",
      "Decreased productivity"
    ],
    copingStrategies: [
      {
        title: "Set Boundaries",
        description: "Learn to say no and protect your personal time",
        icon: Shield
      },
      {
        title: "Time Management",
        description: "Prioritize tasks and avoid overcommitment",
        icon: Clock
      },
      {
        title: "Stress Relief",
        description: "Regular exercise, meditation, and hobbies",
        icon: TreePine
      },
      {
        title: "Seek Support",
        description: "Talk to mentors, colleagues, or professionals",
        icon: Users
      }
    ],
    communityResources: [
      {
        title: "Professional Networks",
        description: "Connect with others in your field",
        icon: Users2,
        link: "#"
      },
      {
        title: "Career Coaching",
        description: "Get guidance on career decisions",
        icon: Target,
        link: "#"
      },
      {
        title: "Work-Life Balance Groups",
        description: "Learn strategies for better balance",
        icon: Clock,
        link: "#"
      }
    ],
    professionalHelp: [
      {
        title: "Career Counselor",
        description: "Get guidance on career decisions and transitions",
        icon: Target,
        contact: "Find a career counselor"
      },
      {
        title: "Therapist",
        description: "Address stress, anxiety, and burnout",
        icon: Brain,
        contact: "Find a therapist"
      }
    ],
    emergencyContacts: [
      {
        name: "Employee Assistance Program",
        number: "Check with your HR department",
        description: "Workplace mental health support"
      }
    ],
    personalStories: [
      {
        title: "From Burnout to Balance",
        excerpt: "I was working 80 hours a week and completely exhausted. Then I learned...",
        author: "Alex",
        age: 34,
        location: "Illinois"
      },
      {
        title: "Finding My Passion Again",
        excerpt: "I lost my love for my career due to stress. Here's how I rediscovered it...",
        author: "Maria",
        age: 31,
        location: "Oregon"
      }
    ],
    dailyAffirmations: [
      "I am capable and competent",
      "My worth is not defined by my productivity",
      "I deserve a healthy work-life balance",
      "I can set boundaries and say no",
      "My career should support my wellbeing"
    ],
    progressTrackers: [
      {
        name: "Work-Life Balance",
        description: "Track hours worked vs. personal time",
        icon: Clock
      },
      {
        name: "Stress Level Monitor",
        description: "Daily stress and energy tracking",
        icon: TrendingUp
      },
      {
        name: "Boundary Setting",
        description: "Track when you successfully set limits",
        icon: Shield
      }
    ],
    recommendedActivities: [
      {
        name: "Mindful Breaks",
        description: "Take regular breaks during work",
        icon: Clock,
        duration: "5-10 minutes every hour"
      },
      {
        name: "Hobby Time",
        description: "Engage in activities unrelated to work",
        icon: Palette,
        duration: "1-2 hours daily"
      },
      {
        name: "Physical Activity",
        description: "Exercise to reduce stress",
        icon: Dumbbell,
        duration: "30 minutes daily"
      }
    ]
  },
  {
    id: "anxiety",
    title: "Anxiety & Panic",
    subtitle: "1 out of every 5 people",
    description: "experiences anxiety",
    supportText: "It's okay to feel anxious",
    encouragement: "You're not alone!",
    Icon: Brain,
    gradient: "from-[#3F51B5] via-[#5C6BC0] to-[#7986CB]",
    glowColor: "shadow-[#3F51B5]/30",
    borderColor: "border-[#3F51B5]/30",
    bgAccent: "bg-[#3F51B5]/10",
    longDescription: [
      "Anxiety is a protective system that sometimes overfires.",
      "Grounding skills, movement, and gentle exposure can help retrain the nervous system.",
      "Anxiety doesn't define you - it's just one part of your experience."
    ],
    symptoms: [
      "Excessive worry and fear",
      "Rapid heartbeat and sweating",
      "Difficulty breathing",
      "Restlessness and tension",
      "Sleep problems",
      "Difficulty concentrating",
      "Physical symptoms like nausea",
      "Avoidance of anxiety-provoking situations"
    ],
    copingStrategies: [
      {
        title: "Deep Breathing",
        description: "Practice 4-7-8 breathing to calm your nervous system",
        icon: Wind
      },
      {
        title: "Grounding Techniques",
        description: "Use your senses to stay present in the moment",
        icon: TreePine
      },
      {
        title: "Progressive Relaxation",
        description: "Tense and release muscle groups systematically",
        icon: Waves
      },
      {
        title: "Mindfulness",
        description: "Focus on the present without judgment",
        icon: Sun
      }
    ],
    communityResources: [
      {
        title: "Anxiety Support Groups",
        description: "Connect with others managing anxiety",
        icon: Users2,
        link: "#"
      },
      {
        title: "Meditation Classes",
        description: "Learn mindfulness and relaxation techniques",
        icon: TreePine,
        link: "#"
      },
      {
        title: "Online Forums",
        description: "Share experiences and coping strategies",
        icon: MessageCircle,
        link: "#"
      }
    ],
    professionalHelp: [
      {
        title: "Cognitive Behavioral Therapy",
        description: "Learn to identify and change anxious thoughts",
        icon: Brain,
        contact: "Find a CBT therapist"
      },
      {
        title: "Medication Management",
        description: "Consider medication if therapy alone isn't enough",
        icon: Shield,
        contact: "Consult with a psychiatrist"
      }
    ],
    emergencyContacts: [
      {
        name: "Crisis Text Line",
        number: "Text HOME to 741741",
        description: "24/7 crisis support via text"
      },
      {
        name: "Emergency Services",
        number: "911",
        description: "For severe panic attacks or medical emergencies"
      }
    ],
    personalStories: [
      {
        title: "Learning to Breathe",
        excerpt: "My anxiety was so bad I couldn't leave the house. Then I learned breathing techniques...",
        author: "Rachel",
        age: 27,
        location: "Michigan"
      },
      {
        title: "Facing My Fears",
        excerpt: "I used to avoid everything that made me anxious. Now I'm learning to...",
        author: "Tom",
        age: 33,
        location: "Arizona"
      }
    ],
    dailyAffirmations: [
      "I am safe in this moment",
      "My anxiety is temporary and manageable",
      "I can handle whatever comes my way",
      "I am stronger than my anxiety",
      "Each breath brings me closer to calm"
    ],
    progressTrackers: [
      {
        name: "Anxiety Level Tracker",
        description: "Monitor daily anxiety levels",
        icon: TrendingUp
      },
      {
        name: "Coping Skills Practice",
        description: "Track use of anxiety management techniques",
        icon: Shield
      },
      {
        name: "Exposure Progress",
        description: "Record steps taken toward facing fears",
        icon: Target
      }
    ],
    recommendedActivities: [
      {
        name: "Daily Meditation",
        description: "Practice mindfulness and relaxation",
        icon: TreePine,
        duration: "10-20 minutes"
      },
      {
        name: "Gentle Exercise",
        description: "Yoga, walking, or swimming",
        icon: Waves,
        duration: "30 minutes"
      },
      {
        name: "Creative Expression",
        description: "Art, music, or writing to process emotions",
        icon: Palette,
        duration: "45 minutes"
      }
    ]
  },
  {
    id: "depression",
    title: "Depression & Low Mood",
    subtitle: "1 out of every 6 people",
    description: "battles with depression",
    supportText: "It's okay to feel depressed",
    encouragement: "You're not alone!",
    Icon: Frown,
    gradient: "from-[#607D8B] via-[#78909C] to-[#90A4AE]",
    glowColor: "shadow-[#607D8B]/30",
    borderColor: "border-[#607D8B]/30",
    bgAccent: "bg-[#607D8B]/10",
    longDescription: [
      "Depression can dim energy, hope, and motivation.",
      "Tiny, doable actions and compassionate structure are powerful steps forward.",
      "Depression is treatable, and recovery is possible."
    ],
    symptoms: [
      "Persistent sadness and hopelessness",
      "Loss of interest in activities",
      "Changes in sleep and appetite",
      "Low energy and fatigue",
      "Difficulty concentrating",
      "Feelings of worthlessness",
      "Thoughts of death or suicide",
      "Physical symptoms like aches and pains"
    ],
    copingStrategies: [
      {
        title: "Small Steps",
        description: "Break tasks into tiny, manageable pieces",
        icon: Target
      },
      {
        title: "Routine Building",
        description: "Create structure even when motivation is low",
        icon: Clock
      },
      {
        title: "Social Connection",
        description: "Reach out to trusted friends and family",
        icon: Users
      },
      {
        title: "Physical Activity",
        description: "Start with gentle movement like walking",
        icon: TreePine
      }
    ],
    communityResources: [
      {
        title: "Depression Support Groups",
        description: "Connect with others who understand",
        icon: Users2,
        link: "#"
      },
      {
        title: "Wellness Activities",
        description: "Join gentle exercise or art groups",
        icon: Heart,
        link: "#"
      },
      {
        title: "Online Communities",
        description: "24/7 support and connection",
        icon: MessageCircle,
        link: "#"
      }
    ],
    professionalHelp: [
      {
        title: "Therapy",
        description: "Talk therapy can help process emotions and develop coping skills",
        icon: Brain,
        contact: "Find a therapist"
      },
      {
        title: "Medication",
        description: "Antidepressants can help restore chemical balance",
        icon: Shield,
        contact: "Consult with a psychiatrist"
      }
    ],
    emergencyContacts: [
      {
        name: "National Suicide Prevention Lifeline",
        number: "988",
        description: "24/7 crisis support and suicide prevention"
      },
      {
        name: "Crisis Text Line",
        number: "Text HOME to 741741",
        description: "24/7 crisis support via text"
      }
    ],
    personalStories: [
      {
        title: "Finding Light in Darkness",
        excerpt: "I was in such a dark place I couldn't see a way out. But with help...",
        author: "Jennifer",
        age: 30,
        location: "Ohio"
      },
      {
        title: "One Day at a Time",
        excerpt: "Recovery wasn't linear, but each small step forward mattered...",
        author: "Chris",
        age: 28,
        location: "Georgia"
      }
    ],
    dailyAffirmations: [
      "I am doing the best I can",
      "My feelings are valid and temporary",
      "I am worthy of help and support",
      "Recovery is possible",
      "Small steps forward are still progress"
    ],
    progressTrackers: [
      {
        name: "Mood Tracker",
        description: "Monitor daily mood and energy levels",
        icon: TrendingUp
      },
      {
        name: "Activity Log",
        description: "Track daily activities and accomplishments",
        icon: Calendar
      },
      {
        name: "Self-Care Checklist",
        description: "Monitor self-care activities",
        icon: Heart
      }
    ],
    recommendedActivities: [
      {
        name: "Gentle Walks",
        description: "Start with short walks outdoors",
        icon: TreePine,
        duration: "15-30 minutes"
      },
      {
        name: "Creative Expression",
        description: "Simple art, music, or writing",
        icon: Palette,
        duration: "20-30 minutes"
      },
      {
        name: "Social Connection",
        description: "Brief calls or texts to loved ones",
        icon: Phone,
        duration: "10-15 minutes"
      }
    ]
  },
  {
    id: "suicidal",
    title: "Suicidal Thoughts & Crisis",
    subtitle: "1 out of every 10 people",
    description: "has experienced suicidal thoughts",
    supportText: "It's okay to have these thoughts - reach out",
    encouragement: "You're not alone!",
    Icon: AlertTriangle,
    gradient: "from-[#F44336] via-[#EF5350] to-[#E53935]",
    glowColor: "shadow-[#F44336]/30",
    borderColor: "border-[#F44336]/30",
    bgAccent: "bg-[#F44336]/10",
    longDescription: [
      "If you're in immediate danger, contact local emergency services or a crisis hotline right now.",
      "You are worthy of care. Sharing what you're carrying can reduce the weight.",
      "Suicidal thoughts are often a sign of extreme emotional pain, not a character flaw."
    ],
    symptoms: [
      "Thoughts of ending your life",
      "Feeling like others would be better off without you",
      "Making plans or preparations",
      "Giving away possessions",
      "Saying goodbye to loved ones",
      "Increased substance use",
      "Withdrawal from others",
      "Sudden mood improvement (may indicate decision made)"
    ],
    copingStrategies: [
      {
        title: "Immediate Safety",
        description: "Remove access to means and call for help",
        icon: Shield
      },
      {
        title: "Crisis Hotlines",
        description: "Call or text crisis support lines immediately",
        icon: Phone
      },
      {
        title: "Reach Out",
        description: "Contact trusted friends, family, or professionals",
        icon: Users
      },
      {
        title: "Distraction Techniques",
        description: "Use activities to get through difficult moments",
        icon: Palette
      }
    ],
    communityResources: [
      {
        title: "Crisis Support Groups",
        description: "Connect with others in crisis",
        icon: Users2,
        link: "#"
      },
      {
        title: "Safety Planning",
        description: "Learn to create crisis safety plans",
        icon: Shield,
        link: "#"
      },
      {
        title: "Peer Support",
        description: "Talk to others who have been there",
        icon: HeartHandshake,
        link: "#"
      }
    ],
    professionalHelp: [
      {
        title: "Crisis Intervention",
        description: "Immediate professional help for crisis situations",
        icon: Shield,
        contact: "Call 988 or go to emergency room"
      },
      {
        title: "Intensive Therapy",
        description: "Regular therapy sessions to address underlying issues",
        icon: Brain,
        contact: "Find a crisis-trained therapist"
      }
    ],
    emergencyContacts: [
      {
        name: "National Suicide Prevention Lifeline",
        number: "988",
        description: "24/7 crisis support and suicide prevention"
      },
      {
        name: "Crisis Text Line",
        number: "Text HOME to 741741",
        description: "24/7 crisis support via text"
      },
      {
        name: "Emergency Services",
        number: "911",
        description: "For immediate life-threatening situations"
      }
    ],
    personalStories: [
      {
        title: "Finding Hope Again",
        excerpt: "I was at my lowest point and couldn't see a way out. But reaching out for help...",
        author: "Anonymous",
        age: 25,
        location: "Anonymous"
      },
      {
        title: "The Other Side of Crisis",
        excerpt: "I never thought I'd feel joy again, but with treatment and support...",
        author: "Anonymous",
        age: 29,
        location: "Anonymous"
      }
    ],
    dailyAffirmations: [
      "I am worthy of life and love",
      "My pain is temporary",
      "Help is available",
      "I don't have to face this alone",
      "My life has value and meaning"
    ],
    progressTrackers: [
      {
        name: "Safety Plan",
        description: "Track use of crisis safety plan",
        icon: Shield
      },
      {
        name: "Crisis Triggers",
        description: "Monitor what triggers suicidal thoughts",
        icon: AlertTriangle
      },
      {
        name: "Coping Skills",
        description: "Track use of crisis coping strategies",
        icon: Heart
      }
    ],
    recommendedActivities: [
      {
        name: "Safety Planning",
        description: "Create and review crisis safety plan",
        icon: Shield,
        duration: "30 minutes weekly"
      },
      {
        name: "Crisis Distraction",
        description: "Have list of activities for difficult moments",
        icon: Palette,
        duration: "As needed"
      },
      {
        name: "Connection Building",
        description: "Build support network before crisis",
        icon: Users,
        duration: "Ongoing"
      }
    ]
  },
  {
    id: "trauma",
    title: "Trauma & PTSD",
    subtitle: "1 out of every 4 people",
    description: "has experienced trauma",
    supportText: "It's okay to seek help for trauma",
    encouragement: "You're not alone!",
    Icon: Heart,
    gradient: "from-[#FF8F00] via-[#FFB300] to-[#FFA000]",
    glowColor: "shadow-[#FF8F00]/30",
    borderColor: "border-[#FF8F00]/30",
    bgAccent: "bg-[#FF8F00]/10",
    longDescription: [
      "Trauma impacts the body and mind in protective ways that can linger.",
      "Safety, stabilization, and compassionate support can help you process and integrate.",
      "Healing from trauma is possible, and you don't have to do it alone."
    ],
    symptoms: [
      "Intrusive memories and flashbacks",
      "Nightmares and sleep problems",
      "Hypervigilance and startle response",
      "Avoidance of trauma reminders",
      "Emotional numbness",
      "Difficulty trusting others",
      "Physical symptoms like tension",
      "Changes in mood and behavior"
    ],
    copingStrategies: [
      {
        title: "Grounding Techniques",
        description: "Use your senses to stay present and safe",
        icon: TreePine
      },
      {
        title: "Safe Space Visualization",
        description: "Create mental images of safety and comfort",
        icon: Mountain
      },
      {
        title: "Body Awareness",
        description: "Learn to recognize and release tension",
        icon: Waves
      },
      {
        title: "Self-Soothing",
        description: "Develop comforting rituals and activities",
        icon: Heart
      }
    ],
    communityResources: [
      {
        title: "Trauma Support Groups",
        description: "Connect with others healing from trauma",
        icon: Users2,
        link: "#"
      },
      {
        title: "Trauma-Informed Yoga",
        description: "Gentle movement and body awareness",
        icon: TreePine,
        link: "#"
      },
      {
        title: "Peer Support",
        description: "Talk to others with similar experiences",
        icon: HeartHandshake,
        link: "#"
      }
    ],
    professionalHelp: [
      {
        title: "Trauma Therapy",
        description: "Specialized therapy for trauma processing",
        icon: Brain,
        contact: "Find a trauma-informed therapist"
      },
      {
        title: "EMDR Therapy",
        description: "Eye Movement Desensitization and Reprocessing",
        icon: Shield,
        contact: "Find an EMDR therapist"
      }
    ],
    emergencyContacts: [
      {
        name: "Crisis Text Line",
        number: "Text HOME to 741741",
        description: "24/7 crisis support via text"
      },
      {
        name: "RAINN Hotline",
        number: "1-800-656-HOPE",
        description: "Sexual assault and trauma support"
      }
    ],
    personalStories: [
      {
        title: "Finding Safety Again",
        excerpt: "After the accident, I felt like I'd never feel safe again. But with therapy...",
        author: "Anonymous",
        age: 27,
        location: "Anonymous"
      },
      {
        title: "Processing the Past",
        excerpt: "I carried my childhood trauma for years before I realized I could heal...",
        author: "Anonymous",
        age: 34,
        location: "Anonymous"
      }
    ],
    dailyAffirmations: [
      "I am safe in this moment",
      "My trauma doesn't define me",
      "I am healing and growing stronger",
      "I deserve peace and safety",
      "My body and mind are working to protect me"
    ],
    progressTrackers: [
      {
        name: "Trigger Awareness",
        description: "Track trauma triggers and responses",
        icon: AlertTriangle
      },
      {
        name: "Grounding Practice",
        description: "Monitor use of grounding techniques",
        icon: TreePine
      },
      {
        name: "Safety Building",
        description: "Track steps toward feeling safer",
        icon: Shield
      }
    ],
    recommendedActivities: [
      {
        name: "Gentle Movement",
        description: "Yoga, walking, or swimming",
        icon: TreePine,
        duration: "20-30 minutes"
      },
      {
        name: "Creative Expression",
        description: "Art, writing, or music therapy",
        icon: Palette,
        duration: "30-45 minutes"
      },
      {
        name: "Nature Connection",
        description: "Spend time outdoors in safe spaces",
        icon: Mountain,
        duration: "1 hour"
      }
    ]
  }
];

export const getCategoryById = (id: string) =>
  supportCategories.find((c) => c.id === id);

export const allCategoryIds = () => supportCategories.map((c) => ({ category: c.id }));

