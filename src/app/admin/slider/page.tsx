import { asc, eq } from "drizzle-orm";
import { AdminHeader } from "@/components/admin/admin-header";
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
      <AdminHeader title="Slider Management" />

      <div className="p-8 max-w-5xl mx-auto">
        <SliderManager initialPhotos={sliderPhotos} />
      </div>
    </div>
  );
}
