import Link from "next/link";
import type { CommunityTopic } from "@/app/community/data";

export default function CommunityCard({ topic }: { topic: CommunityTopic }) {
  const Icon = topic.Icon;
  return (
    <Link href={`/community/${topic.id}`} className="group">
      <div className={`rounded-2xl ${topic.colors.bg} border border-white/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}> 
        <div className={`h-1 w-full ${topic.colors.top}`} />
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <Icon className={`w-10 h-10 ${topic.colors.icon}`} />
          </div>
          <h3 className="text-lg font-semibold text-[#111]">{topic.name}</h3>
          <p className="text-sm text-[#333] mt-2">{topic.tagline}</p>
          <span className="mt-4 inline-block text-sm text-[#111] border-b border-transparent group-hover:border-[#111]">
            Join Chatroom →
          </span>
        </div>
      </div>
    </Link>
  );
}


