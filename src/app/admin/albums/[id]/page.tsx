import { asc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
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
      <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/albums"
            className="p-2 -ml-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-lg font-semibold tracking-tight">Album / {album.title}</h2>
        </div>
      </header>

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
