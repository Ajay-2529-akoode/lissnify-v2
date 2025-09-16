"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

type Message = {
  id: string;
  role: "seeker" | "listener";
  username: string;
  avatar: string;
  text: string;
  createdAt: number;
};

export default function ChatRoom({ topic }: { topic: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const channel = useMemo(() => new BroadcastChannel(`community:${topic}`), [topic]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MessageEvent<Message>) => {
      setMessages((prev) => [...prev, e.data]);
    };
    channel.addEventListener("message", handler);
    return () => channel.removeEventListener("message", handler);
  }, [channel]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  function send() {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: crypto.randomUUID(),
      role: Math.random() > 0.5 ? "seeker" : "listener",
      username: Math.random() > 0.5 ? "Seeker" : "Listener",
      avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70) + 1}`,
      text: input.trim(),
      createdAt: Date.now(),
    };
    channel.postMessage(newMsg);
    setInput("");
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-4 md:p-6 bg-white/60 rounded-2xl border border-[#EEE]">
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} username={m.username} avatar={m.avatar} text={m.text} />)
        )}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a supportive message..."
          className="flex-1 rounded-full border border-[#E5E7EB] px-4 py-3 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#FF8C5A]"
        />
        <button onClick={send} className="px-5 py-3 rounded-full bg-[#FF8C5A] text-white font-semibold hover:bg-[#e67848] transition">
          Send
        </button>
      </div>
    </div>
  );
}


