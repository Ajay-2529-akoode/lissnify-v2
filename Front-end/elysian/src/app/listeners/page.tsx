import CategoryCard from "@/Components/CategoryCard";
import { categories } from "./data";

export default function ListenersLandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FFB88C] to-[#FFF8B5]">
      <section className="container mx-auto px-6 py-16 max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-bold text-[#111] mb-10">Find a Listener by Category</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} href={`/listeners/${cat.id}`} />
          ))}
        </div>
      </section>
    </main>
  );
}


