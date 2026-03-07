"use server";

import { db } from "@/db";
import { albums } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { deletePublicFile } from "./upload";

export async function createAlbum(
  categoryId: string,
  title: string,
  slug: string,
) {
  try {
    const existing = await db.query.albums.findMany({
      where: eq(albums.categoryId, categoryId),
    });
    await db.insert(albums).values({
      categoryId,
      title,
      slug,
      position: existing.length,
    });
    revalidatePath("/admin/albums");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create album or slug exists" };
  }
}

export async function updateAlbum(
  id: string,
  categoryId: string,
  title: string,
  slug: string,
) {
  try {
    await db
      .update(albums)
      .set({ categoryId, title, slug })
      .where(eq(albums.id, id));
    revalidatePath("/admin/albums");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update album" };
  }
}

export async function toggleAlbumDraft(id: string, isDraft: boolean) {
  try {
    await db.update(albums).set({ isDraft }).where(eq(albums.id, id));
    revalidatePath("/admin/albums");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update draft status" };
  }
}

export async function deleteAlbum(id: string) {
  try {
    const album = await db.query.albums.findFirst({ where: eq(albums.id, id) });
    if (album?.coverImageKey) {
      await deletePublicFile(album.coverImageKey);
    }
    // Delete action should cascade photos in DB (due to foreign key constraint),
    // but we would hypothetically need to iterate photos and delete them from R2
    await db.delete(albums).where(eq(albums.id, id));
    revalidatePath("/admin/albums");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete album" };
  }
}

export async function reorderAlbums(
  updates: { id: string; position: number }[],
) {
  try {
    for (const update of updates) {
      await db
        .update(albums)
        .set({ position: update.position })
        .where(eq(albums.id, update.id));
    }
    revalidatePath("/admin/albums");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to reorder albums" };
  }
}
