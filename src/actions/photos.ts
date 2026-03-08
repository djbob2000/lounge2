"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { albums, photos } from "@/db/schema";
import { deletePublicFile } from "./upload";

export async function savePhotoToDb(albumId: string, url: string, r2Key: string) {
  try {
    const existing = await db.query.photos.findMany({
      where: eq(photos.albumId, albumId),
    });
    await db.insert(photos).values({
      albumId,
      url,
      r2Key,
      position: existing.length,
    });
    revalidatePath(`/admin/albums/${albumId}`);
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save photo" };
  }
}

export async function deletePhotoDb(id: string, r2Key: string, albumId: string) {
  try {
    // Delete from Cloudflare R2
    await deletePublicFile(r2Key);
    // Delete from Database
    await db.delete(photos).where(eq(photos.id, id));

    // Check if this photo was the cover
    const album = await db.query.albums.findFirst({
      where: eq(albums.id, albumId),
    });
    if (album?.coverImageKey === r2Key) {
      await db
        .update(albums)
        .set({ coverImageKey: null, coverImageUrl: null })
        .where(eq(albums.id, albumId));
    }

    revalidatePath(`/admin/albums/${albumId}`);
    revalidatePath("/admin/albums");
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete photo" };
  }
}

export async function setAlbumCover(albumId: string, url: string, r2Key: string) {
  try {
    await db
      .update(albums)
      .set({ coverImageUrl: url, coverImageKey: r2Key })
      .where(eq(albums.id, albumId));
    revalidatePath(`/admin/albums/${albumId}`);
    revalidatePath("/admin/albums");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to set cover" };
  }
}

export async function reorderPhotos(updates: { id: string; position: number }[], albumId: string) {
  try {
    for (const update of updates) {
      await db.update(photos).set({ position: update.position }).where(eq(photos.id, update.id));
    }
    revalidatePath(`/admin/albums/${albumId}`);
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to reorder photos" };
  }
}

export async function reorderSliderPhotos(updates: { id: string; sliderPosition: number }[]) {
  try {
    for (const update of updates) {
      await db
        .update(photos)
        .set({ sliderPosition: update.sliderPosition })
        .where(eq(photos.id, update.id));
    }
    revalidatePath("/admin/slider");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to reorder slider photos" };
  }
}

export async function togglePhotoSlider(id: string, isSliderImage: boolean, albumId?: string) {
  try {
    // When adding to slider, we might want to put them at the end.
    // However, just defaulting to 0 or whatever current sliderPosition is fine
    // because we can reorder them in the slider manager.
    await db.update(photos).set({ isSliderImage }).where(eq(photos.id, id));
    if (albumId) {
      revalidatePath(`/admin/albums/${albumId}`);
    }
    revalidatePath("/admin/slider");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to toggle slider image status" };
  }
}

export async function updatePhotoDescription(
  id: string,
  description: string | null,
  albumId?: string,
) {
  try {
    await db.update(photos).set({ description }).where(eq(photos.id, id));
    if (albumId) {
      revalidatePath(`/admin/albums/${albumId}`);
    }
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update photo description" };
  }
}
