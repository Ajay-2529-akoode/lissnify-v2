import { notFound } from "next/navigation";
import { communityTopics } from "../data";
import Sidebar from "@/Components/chat/Sidebar";
import ChatRoom from "@/Components/chat/ChatRoom";

export function generateStaticParams() {
  return communityTopics.map((t) => ({ topic: t.id }));
}

export default function CommunityTopicPage({ params }: { params: { topic: string } }) {
  const topic = communityTopics.find((t) => t.id === params.topic);
  if (!topic) return notFound();

  const Icon = topic.Icon;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5]">
      <section className="container mx-auto px-6 py-10 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar current={topic.id} />
          <div className="flex-1">
            <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/40 p-6 mb-4 flex items-center gap-3">
              <Icon className={`w-7 h-7 ${topic.colors.icon}`} />
              <div>
                <h1 className="text-2xl font-bold text-[#111]">{topic.name}</h1>
                <p className="text-sm text-[#444]">{topic.tagline}</p>
              </div>
            </div>
            <ChatRoom topic={topic.id} />
          </div>
        </div>
      </section>
    </main>
  );
}


