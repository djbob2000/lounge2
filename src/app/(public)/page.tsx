import { asc, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { HomeSlider } from "@/components/home-slider";
import { db } from "@/db";
import { albums, categories, photos } from "@/db/schema";

export default async function HomePage() {
  const sliderImages = await db.query.photos.findMany({
    where: eq(photos.isSliderImage, true),
    orderBy: [asc(photos.sliderPosition), asc(photos.createdAt)],
  });

  const formattedImages = sliderImages.map((p) => ({
    id: p.id,
    url: p.url,
    title: null,
  }));

  const featuredAlbums = await db
    .select({
      id: albums.id,
      title: albums.title,
      slug: albums.slug,
      coverImageUrl: albums.coverImageUrl,
      categorySlug: categories.slug,
      categoryName: categories.name,
    })
    .from(albums)
    .innerJoin(categories, eq(albums.categoryId, categories.id))
    .where(eq(albums.isHidden, false))
    .orderBy(desc(albums.createdAt))
    .limit(3);

  return (
    <>
      <HomeSlider images={formattedImages} />

      {/* Featured Collections Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col items-center mb-16 relative">
          <div className="absolute -top-10 text-[120px] font-bold text-muted/30 opacity-50 pointer-events-none select-none z-0 tracking-tighter uppercase whitespace-nowrap">
            WORKS
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2 relative z-10">
            Featured Collections
          </h3>
          <p className="text-muted-foreground text-sm italic relative z-10">
            Curated moments across landscapes and portraits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredAlbums.length > 0 ? (
            featuredAlbums.map((album) => (
              <Link
                key={album.id}
                href={`/${album.categorySlug}/${album.slug}`}
                className="group cursor-pointer block focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-xl"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-4 bg-muted animate-pulse">
                  {album.coverImageUrl ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ease-out"
                      style={{
                        backgroundImage: `url('${album.coverImageUrl}')`,
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                      No Cover
                    </div>
                  )}
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 rounded-xl pointer-events-none" />
                </div>
                <h4 className="text-lg font-bold tracking-tight mb-1 group-hover:text-primary transition-colors">
                  {album.title}
                </h4>
                <p className="text-sm text-muted-foreground">{album.categoryName}</p>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-muted-foreground text-sm italic">
              More works coming soon.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
