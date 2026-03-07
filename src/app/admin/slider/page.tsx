import { asc, eq } from "drizzle-orm";
import { SliderManager } from "@/components/admin/slider-manager";
import { db } from "@/db";
import { photos } from "@/db/schema";

export const metadata = {
  title: "Slider Management",
};

export default async function SliderPage() {
  const sliderPhotos = await db.query.photos.findMany({
    where: eq(photos.isSliderImage, true),
    orderBy: [asc(photos.sliderPosition), asc(photos.createdAt)],
  });

  return (
    <div className="w-full">
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold tracking-tight">Slider Management</h2>
        </div>
      </header>

      <div className="p-8 max-w-5xl mx-auto">
        <SliderManager initialPhotos={sliderPhotos} />
      </div>
    </div>
  );
}
