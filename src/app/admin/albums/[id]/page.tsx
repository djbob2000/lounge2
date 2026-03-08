import { asc, eq } from "drizzle-orm";

import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { PhotoManager } from "@/components/admin/photo-manager";
import { db } from "@/db";
import { albums, photos } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminAlbumPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const albumId = params.id;

  const album = await db.query.albums.findFirst({
    where: eq(albums.id, albumId),
  });

  if (!album) return notFound();

  const allPhotos = await db.query.photos.findMany({
    where: eq(photos.albumId, albumId),
    orderBy: [asc(photos.position)],
  });

  return (
    <div className="w-full">
      <AdminHeader title={`Album / ${album.title}`} backHref="/admin/albums" />

      <div className="p-8 max-w-6xl mx-auto">
        <PhotoManager
          albumId={album.id}
          currentCoverKey={album.coverImageKey}
          initialPhotos={allPhotos}
        />
      </div>
    </div>
  );
}
