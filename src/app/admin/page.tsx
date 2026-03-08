import { eq } from "drizzle-orm";
import { Image as ImageIcon, Layers, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { Logo } from "@/components/logo";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

export default async function AdminDashboardPage() {
  const settings = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.id, "site_config"),
  });

  const siteName = settings?.siteName || "Elena Marinych";

  // Simple counts
  const categoryCount = await db.query.categories.findMany().then((c) => c.length);
  const albumCount = await db.query.albums.findMany().then((a) => a.length);
  const sliderCount = await db.query.photos
    .findMany({ where: (p, { eq }) => eq(p.isSliderImage, true) })
    .then((s) => s.length);

  return (
    <div className="w-full">
      <AdminHeader>
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer outline-none">
          <div className="text-primary transform transition-transform group-hover:scale-110 duration-500 ease-out">
            <Logo className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xs font-black tracking-[0.2em] group-hover:text-primary transition-colors duration-300 leading-none">
              {siteName}
            </h1>
            <div className="h-[1px] w-4 bg-primary/40 mt-1 transition-all duration-500 group-hover:w-full group-hover:bg-primary"></div>
          </div>
        </Link>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest hidden sm:block">
          Dashboard Overview
        </h2>
      </AdminHeader>

      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-bold">Welcome back</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Here is a quick overview of your portfolio. Use the sidebar to manage content.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/categories"
            className="p-6 bg-card text-card-foreground border border-border rounded-2xl flex flex-col gap-2 shadow-sm hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Total Categories
              </span>
              <Layers className="w-4 h-4 text-primary" />
            </div>
            <span className="text-3xl font-bold">{categoryCount}</span>
          </Link>

          <Link
            href="/admin/albums"
            className="p-6 bg-card text-card-foreground border border-border rounded-2xl flex flex-col gap-2 shadow-sm hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Total Albums
              </span>
              <ImageIcon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-3xl font-bold">{albumCount}</span>
          </Link>

          <Link
            href="/admin/slider"
            className="p-6 bg-card text-card-foreground border border-border rounded-2xl flex flex-col gap-2 shadow-sm hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Slider Images
              </span>
              <MonitorPlay className="w-4 h-4 text-primary" />
            </div>
            <span className="text-3xl font-bold">{sliderCount}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
