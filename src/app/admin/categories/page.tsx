import { asc } from "drizzle-orm";
import { AdminHeader } from "@/components/admin/admin-header";
import { CategoryManager } from "@/components/admin/category-manager";
import { db } from "@/db";
import { categories } from "@/db/schema";

export default async function AdminCategoriesPage() {
  const allCategories = await db.query.categories.findMany({
    orderBy: [asc(categories.position)],
  });

  return (
    <div className="w-full">
      <AdminHeader title="Categories Management" />

      <div className="p-8 max-w-5xl mx-auto">
        <CategoryManager initialCategories={allCategories} />
      </div>
    </div>
  );
}
