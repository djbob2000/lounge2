import { asc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { albums, categories } from "@/db/schema";

export async function generateStaticParams() {
  const allCategories = await db.query.categories.findMany();
  return allCategories.map((cat) => ({
    categorySlug: cat.slug,
  }));
}

export default async function CategoryPage(props: { params: Promise<{ categorySlug: string }> }) {
  const params = await props.params;
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, params.categorySlug),
  });

  if (!category) return notFound();

  const categoryAlbums = await db.query.albums.findMany({
    where: eq(albums.categoryId, category.id),
    orderBy: [asc(albums.position)],
  });

  const publishedAlbums = categoryAlbums.filter((a) => !a.isHidden);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen">
      <div className="flex flex-col items-center mb-16 relative">
        <Link
          href="/"
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors hover:-translate-x-1 decoration-transparent"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Back</span>
        </Link>
        <div className="absolute -top-10 text-[120px] font-bold text-muted/30 opacity-50 pointer-events-none select-none z-0 tracking-tighter uppercase whitespace-nowrap overflow-hidden max-w-full">
          {category.name}
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2 relative z-10">
          {category.name}
        </h2>
        <p className="text-muted-foreground text-sm italic relative z-10">
          {publishedAlbums.length} {publishedAlbums.length === 1 ? "collection" : "collections"}
        </p>
      </div>

      {publishedAlbums.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {publishedAlbums.map((album) => (
            <Link
              key={album.id}
              href={`/${category.slug}/${album.slug}`}
              className="group block cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden mb-6 bg-muted rounded-none shadow-sm dark:shadow-none hover:shadow-xl transition-shadow duration-500">
                {album.coverImageUrl ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-105 ease-out"
                    style={{ backgroundImage: `url('${album.coverImageUrl}')` }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-medium tracking-widest uppercase text-xs">
                    No Cover
                  </div>
                )}
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">
                  {album.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-32 border border-dashed border-border bg-muted/20 text-muted-foreground tracking-widest uppercase text-sm">
          No collections published yet
        </div>
      )}
    </div>
  );
}
