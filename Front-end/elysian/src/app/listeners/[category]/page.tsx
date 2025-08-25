import { notFound } from "next/navigation";
import ListenerCard from "@/Components/ListenerCard";
import { categories, listeners } from "../data";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export default function ListenerCategoryPage({ params }: { params: { category: string } }) {
  const category = categories.find((c) => c.id === params.category);
  if (!category) return notFound();

  const filtered = listeners.filter((l) => l.category.toLowerCase().includes(category.title.split(" ")[0].toLowerCase()));

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5]">
      <section className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#111]">Listeners for {category.title}</h1>
          <p className="text-[#333] mt-2">Compassionate peers ready to listen.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.length === 0 ? (
            <p className="text-[#222]">No listeners yet for this category. Check back soon.</p>
          ) : (
            filtered.map((l) => <ListenerCard key={l.id} listener={l} />)
          )}
        </div>
      </section>
    </main>
  );
}


