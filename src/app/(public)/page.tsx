import { asc, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { HomeSlider } from "@/components/home-slider";
import { db } from "@/db";
import { albums, categories, homeSlider } from "@/db/schema";

export default async function HomePage() {
  const sliderImages = await db.query.homeSlider.findMany({
    orderBy: [asc(homeSlider.position)],
  });

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
    .where(eq(albums.isDraft, false))
    .orderBy(desc(albums.createdAt))
    .limit(3);

  return (
    <>
      <HomeSlider images={sliderImages} />

      {/* Featured Collections Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col items-center mb-16 relative">
          <div className="absolute -top-10 text-[120px] font-bold text-slate-100 dark:text-slate-800/50 opacity-50 pointer-events-none select-none z-0 tracking-tighter">
            WORKS
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2 relative z-10">
            Featured Collections
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic relative z-10">
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
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-4 bg-slate-100 dark:bg-slate-800">
                  {album.coverImageUrl ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ease-out"
                      style={{
                        backgroundImage: `url('${album.coverImageUrl}')`,
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                      No Cover
                    </div>
                  )}
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 rounded-xl pointer-events-none" />
                </div>
                <h4 className="text-lg font-bold tracking-tight mb-1 group-hover:text-primary transition-colors">
                  {album.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{album.categoryName}</p>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-slate-500 text-sm">
              More works coming soon.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
