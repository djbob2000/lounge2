"use server";

import { db } from "@/db";
import { homeSlider } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { deletePublicFile } from "./upload";

export async function addSliderPhoto(
  url: string,
  r2Key: string,
  title?: string,
) {
  try {
    const existing = await db.query.homeSlider.findMany();
    await db.insert(homeSlider).values({
      url,
      r2Key,
      title: title || null,
      position: existing.length,
    });
    revalidatePath("/admin/slider");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to add slider photo" };
  }
}

export async function removeSliderPhoto(id: string, r2Key: string) {
  try {
    await deletePublicFile(r2Key);
    await db.delete(homeSlider).where(eq(homeSlider.id, id));

    revalidatePath("/admin/slider");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to remove slider photo" };
  }
}

export async function updateSliderTitle(id: string, title: string) {
  try {
    await db.update(homeSlider).set({ title }).where(eq(homeSlider.id, id));
    revalidatePath("/admin/slider");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update slider title" };
  }
}

export async function reorderSliderPhotos(
  updates: { id: string; position: number }[],
) {
  try {
    for (const update of updates) {
      await db
        .update(homeSlider)
        .set({ position: update.position })
        .where(eq(homeSlider.id, update.id));
    }
    revalidatePath("/admin/slider");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to reorder slider photos" };
  }
}
