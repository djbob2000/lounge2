import { asc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoViewer } from "@/components/photo-viewer";
import { db } from "@/db";
import { albums, categories, photos } from "@/db/schema";

export async function generateStaticParams() {
  const albumsWithCats = await db
    .select({
      albumSlug: albums.slug,
      categorySlug: categories.slug,
    })
    .from(albums)
    .innerJoin(categories, eq(albums.categoryId, categories.id));

  return albumsWithCats.map((item) => ({
    categorySlug: item.categorySlug,
    albumSlug: item.albumSlug,
  }));
}

export default async function AlbumPage(props: {
  params: Promise<{ categorySlug: string; albumSlug: string }>;
}) {
  const params = await props.params;
  const album = await db.query.albums.findFirst({
    where: eq(albums.slug, params.albumSlug),
  });

  if (!album) return notFound();

  const category = await db.query.categories.findFirst({
    where: eq(categories.id, album.categoryId),
  });

  if (!category || category.slug !== params.categorySlug) return notFound();

  const albumPhotos = await db.query.photos.findMany({
    where: eq(photos.albumId, album.id),
    orderBy: [asc(photos.position)],
  });

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <Link
          href={`/${category.slug}`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors tracking-widest uppercase mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {category.name}
        </Link>
        <div className="flex flex-col mb-16 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
            {album.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm tracking-widest uppercase">
            {albumPhotos.length} {albumPhotos.length === 1 ? "Shot" : "Shots"}
          </p>
        </div>
      </div>

      {albumPhotos.length > 0 ? (
        <div className="w-full max-w-[1920px] mx-auto group">
          <PhotoViewer photos={albumPhotos.map((p) => ({ id: p.id, url: p.url }))} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-32 text-center text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
          <p className="tracking-widest uppercase text-sm">This collection is empty.</p>
        </div>
      )}
    </div>
  );
}
