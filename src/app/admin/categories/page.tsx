import { asc } from "drizzle-orm";
import { AdminHeader } from "@/components/admin/admin-header";
import { CategoryManager } from "@/components/admin/category-manager";
import { db } from "@/db";
import { albums, categories } from "@/db/schema";

export default async function AdminCategoriesPage() {
  const allCategories = await db.query.categories.findMany({
    orderBy: [asc(categories.position)],
  });

  const allAlbums = await db.query.albums.findMany({
    orderBy: [asc(albums.position)],
  });

  const categoriesWithAlbums = allCategories.map((category) => ({
    ...category,
    albums: allAlbums.filter((album) => album.categoryId === category.id),
  }));

  return (
    <div className="w-full">
      <AdminHeader title="Categories Management" />

      <div className="p-8 max-w-5xl mx-auto">
        <CategoryManager initialCategories={categoriesWithAlbums} />
      </div>
    </div>
  );
}
