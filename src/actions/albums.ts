"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { albums, photos } from "@/db/schema";
import { deletePublicFile } from "./upload";

export async function createAlbum(
  categoryId: string,
  title: string,
  slug: string,
  description: string | null = null,
) {
  try {
    const existing = await db.query.albums.findMany({
      where: eq(albums.categoryId, categoryId),
    });
    const [newAlbum] = await db
      .insert(albums)
      .values({
        categoryId,
        title,
        slug,
        description,
        position: existing.length,
      })
      .returning();
    revalidatePath("/admin/albums");
    revalidatePath("/", "layout");
    return { success: true, album: newAlbum };
  } catch {
    return { success: false, error: "Failed to create album or slug exists" };
  }
}

export async function updateAlbum(
  id: string,
  categoryId: string,
  title: string,
  slug: string,
  description: string | null = null,
) {
  try {
    await db.update(albums).set({ categoryId, title, slug, description }).where(eq(albums.id, id));
    revalidatePath("/admin/albums");
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update album" };
  }
}

export async function toggleAlbumHidden(id: string, isHidden: boolean) {
  try {
    await db.update(albums).set({ isHidden }).where(eq(albums.id, id));
    revalidatePath("/admin/albums");
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update hidden status" };
  }
}

export async function deleteAlbum(id: string) {
  try {
    const album = await db.query.albums.findFirst({
      where: eq(albums.id, id),
    });

    if (album?.coverImageKey) {
      await deletePublicFile(album.coverImageKey);
    }

    const albumPhotos = await db.query.photos.findMany({
      where: eq(photos.albumId, id),
    });

    for (const photo of albumPhotos) {
      if (photo.r2Key) {
        await deletePublicFile(photo.r2Key);
      }
    }

    await db.delete(albums).where(eq(albums.id, id));
    revalidatePath("/admin/albums");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete album" };
  }
}

export async function reorderAlbums(updates: { id: string; position: number }[]) {
  try {
    for (const update of updates) {
      await db.update(albums).set({ position: update.position }).where(eq(albums.id, update.id));
    }
    revalidatePath("/admin/albums");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to reorder albums" };
  }
}
