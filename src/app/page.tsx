import { asc, eq } from "drizzle-orm";
import { Facebook, Globe, Instagram } from "lucide-react";
import Link from "next/link";
import { HomeSlider } from "@/components/home-slider";
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { db } from "@/db";
import { categories, photos, siteSettings } from "@/db/schema";

export default async function Home() {
  const sliderPhotos = await db.query.photos.findMany({
    where: eq(photos.isSliderImage, true),
    orderBy: [asc(photos.position)],
  });

  const allCategories = await db.query.categories.findMany({
    where: eq(categories.showInMenu, true),
    orderBy: [asc(categories.position)],
  });

  const settings = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.id, "site_config"),
  });

  const siteName = settings?.siteName || "Elena Marinych";

  const formattedImages = sliderPhotos.map((p) => ({
    id: p.id,
    url: p.url,
    title: null,
  }));

  return (
    <div className="bg-background text-foreground font-display min-h-screen transition-colors duration-700 ease-in-out">
      {/* Header Section: Logo and Navigation */}
      <header className="relative flex flex-col items-center pt-12 pb-8 px-6 bg-background transition-colors duration-700 ease-in-out">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        {/* Elegant Centered Logo */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <div className="text-primary transition-colors duration-700">
            <Logo className="w-16 h-16" />
          </div>
          <h1 className="font-display text-4xl font-black tracking-widest text-foreground transition-colors duration-700">
            {siteName}
          </h1>
          <div className="h-px w-12 bg-primary mt-1 opacity-40 transition-colors duration-700"></div>
        </div>
        {/* Navigation Menu */}
        <nav className="flex flex-wrap justify-center gap-8 md:gap-12 border-t border-b border-border py-6 w-full max-w-4xl transition-colors duration-700 ease-in-out">
          {allCategories.map((cat) => (
            <Link
              key={cat.id}
              className="text-sm font-medium tracking-widest uppercase hover:text-primary transition-colors duration-300"
              href={`/${cat.slug}`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </header>

      {/* Hero Slider Section */}
      <main className="w-full relative z-10">
        <HomeSlider images={formattedImages} />

        {/* Featured Collections Grid */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col items-center mb-16">
            <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors duration-700 mb-2">
              Featured Collections
            </h3>
            <p className="text-muted-foreground transition-colors duration-700 text-sm italic">
              Explore the gallery
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {allCategories.slice(0, 3).map((cat) => (
              <Link key={cat.id} href={`/${cat.slug}`} className="group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-4 bg-muted">
                  {/* Since categories don't have images yet, we just show a subtle background or the name */}
                  <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-muted/50 transition-colors group-hover:bg-muted opacity-40 group-hover:opacity-60">
                    <span className="text-xs font-bold uppercase tracking-widest">{cat.name}</span>
                  </div>
                </div>
                <h4 className="text-lg font-bold tracking-tight mb-1">{cat.name}</h4>
                <p className="text-sm text-muted-foreground transition-colors duration-700">
                  View collection
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-background border-t border-border py-16 px-6 transition-colors duration-700 ease-in-out">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Social Icons */}
          <div className="flex gap-8 mb-10">
            {settings?.instagramUrl && (
              <Link
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </Link>
            )}
            {settings?.facebookUrl && (
              <Link
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </Link>
            )}
            {settings?.behanceUrl && (
              <Link
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                href={settings.behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Behance"
              >
                <Globe className="w-6 h-6" />
              </Link>
            )}
          </div>
          {/* Copyright */}
          <p className="text-muted-foreground transition-colors duration-700 text-sm tracking-widest">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
