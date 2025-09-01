import Link from "next/link";

export default function SeekerPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5]">
      <section className="container mx-auto px-6 py-16 max-w-5xl">
        <div className="rounded-3xl bg-white/90 shadow-xl border border-white/40 p-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E2E2E] mb-6">Seek Support</h1>
          <p className="text-[#555] text-lg leading-relaxed mb-8">
            You are not alone. Explore categories that match what you are going through and
            connect with resources and people who understand.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/support/breakup"
              className="px-5 py-3 rounded-full bg-[#E91E63] text-white font-semibold hover:opacity-90 transition"
            >
              I’m dealing with a breakup
            </Link>
            <Link
              href="/support/relationship"
              className="px-5 py-3 rounded-full bg-[#9C27B0] text-white font-semibold hover:opacity-90 transition"
            >
              Relationship issues
            </Link>
            <Link
              href="/support/anxiety"
              className="px-5 py-3 rounded-full bg-[#3F51B5] text-white font-semibold hover:opacity-90 transition"
            >
              Anxiety
            </Link>
            <Link
              href="/support/depression"
              className="px-5 py-3 rounded-full bg-[#607D8B] text-white font-semibold hover:opacity-90 transition"
            >
              Depression
            </Link>
          </div>

          <div className="mt-10">
            <Link href="/" className="text-[#2E2E2E] underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}


