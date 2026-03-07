import { db } from "@/db";
import { homeSlider } from "@/db/schema";
import { asc } from "drizzle-orm";
import { SliderManager } from "@/components/admin/slider-manager";

export const dynamic = "force-dynamic";

export default async function AdminSliderPage() {
  const images = await db.query.homeSlider.findMany({
    orderBy: [asc(homeSlider.position)],
  });

  return (
    <div className="w-full">
      <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Home Slider Configuration
          </h2>
        </div>
      </header>

      <div className="p-8 max-w-6xl mx-auto">
        <SliderManager initialImages={images} />
      </div>
    </div>
  );
}
