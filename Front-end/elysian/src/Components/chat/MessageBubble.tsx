type Props = {
  role: "seeker" | "listener";
  username: string;
  avatar: string;
  text: string;
  time?: string;
};

export default function MessageBubble({ role, username, avatar, text, time }: Props) {
  const isSeeker = role === "seeker";
  return (
    <div className="flex items-start gap-3">
      <img src={avatar} alt={username} className="w-9 h-9 rounded-full border border-[#EEE] object-cover" />
      <div>
        <div className="text-xs text-[#666] mb-1">
          <span className="font-semibold text-[#111] mr-2">{username}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${isSeeker ? "bg-[#FFE7D9] text-[#C75B39]" : "bg-[#E6F5EA] text-[#2B7A46]"}`}>
            {isSeeker ? "Seeker" : "Listener"}
          </span>
          {time && <span className="ml-2">{time}</span>}
        </div>
        <div className={`max-w-[48rem] rounded-2xl px-4 py-2 shadow-sm border ${isSeeker ? "bg-[#FFF2EA] border-[#FFD9C9]" : "bg-[#F2FBF5] border-[#CFEBD8]"}`}>
          <p className="text-sm text-[#1a1a1a] leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}


