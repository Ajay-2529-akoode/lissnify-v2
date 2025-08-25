import CommunityCard from "@/Components/CommunityCard";
import { communityTopics } from "./data";

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5]">
      <section className="container mx-auto px-6 py-16 max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold text-[#111] mb-3">Community</h1>
        <p className="text-[#333] mb-10">Join supportive group chatrooms by topic.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {communityTopics.map((t) => (
            <CommunityCard key={t.id} topic={t} />
          ))}
        </div>
      </section>
    </main>
  );
}


