import Link from "next/link";
import { communityTopics } from "@/app/community/data";

export default function Sidebar({ current }: { current: string }) {
  return (
    <aside className="w-full md:w-64 bg-white/70 backdrop-blur border-r border-[#EEE] p-4 md:p-6">
      <h3 className="text-sm font-semibold text-[#666] mb-3">Communities</h3>
      <nav className="space-y-2">
        {communityTopics.map((t) => (
          <Link
            key={t.id}
            href={`/community/${t.id}`}
            className={`block rounded-xl px-3 py-2 text-sm border transition-colors ${
              current === t.id ? "bg-[#FFF2EA] border-[#FFD9C9] text-[#111]" : "bg-white/60 border-[#F1F1F1] hover:bg-white"
            }`}
          >
            {t.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}


