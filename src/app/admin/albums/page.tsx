import { asc } from "drizzle-orm";
import { AdminHeader } from "@/components/admin/admin-header";
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
      <AdminHeader title="Albums Management" />

      <div className="p-8 max-w-5xl mx-auto">
        <AlbumManager initialAlbums={allAlbums} categories={allCategories} />
      </div>
    </div>
  );
}
