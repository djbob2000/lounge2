import { asc } from "drizzle-orm";
import { AlbumManager } from "@/components/admin/album-manager";
import { db } from "@/db";
import { categories } from "@/db/schema";

// We need server-side rendering for the latest records since it's an admin dashboard
export const dynamic = "force-dynamic";

export default async function AdminAlbumsPage() {
  const allCategories = await db.query.categories.findMany({
    orderBy: [asc(categories.position)],
  });

  const allAlbums = await db.query.albums.findMany();

  return (
    <div className="w-full">
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold tracking-tight">Albums Management</h2>
        </div>
      </header>

      <div className="p-8 max-w-5xl mx-auto">
        <AlbumManager initialAlbums={allAlbums} categories={allCategories} />
      </div>
    </div>
  );
}
