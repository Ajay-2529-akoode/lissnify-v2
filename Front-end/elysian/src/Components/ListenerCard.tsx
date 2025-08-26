type Listener = {
  id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  badge?: string;
};

export type { Listener };

export default function ListenerCard({ listener }: { listener: Listener }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#EEE] p-5">
      <div className="flex items-center gap-4">
        <img
          src={listener.image}
          alt={listener.name}
          className="w-14 h-14 rounded-full object-cover border border-[#EEE]"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[#111]">{listener.name}</h3>
            {listener.badge && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF0E8] text-[#FF8C5A] border border-[#FFD8C7]">
                {listener.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-[#666] mt-0.5">{listener.category}</p>
        </div>
      </div>
      <p className="text-sm text-[#222] mt-4 leading-relaxed line-clamp-3">
        {listener.description}
      </p>
    </div>
  );
}


