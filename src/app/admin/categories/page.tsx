import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";
import { CategoryManager } from "@/components/admin/category-manager";

export default async function AdminCategoriesPage() {
  const allCategories = await db.query.categories.findMany({
    orderBy: [asc(categories.position)],
  });

  return (
    <div className="w-full">
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Categories Management
          </h2>
        </div>
      </header>

      <div className="p-8 max-w-5xl mx-auto">
        <CategoryManager initialCategories={allCategories} />
      </div>
    </div>
  );
}
