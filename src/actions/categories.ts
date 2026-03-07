"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createCategory(name: string, slug: string) {
  try {
    const all = await db.query.categories.findMany();
    await db.insert(categories).values({
      name,
      slug,
      position: all.length,
    });
    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Failed to create category or slug exists",
    };
  }
}

export async function updateCategory(id: string, name: string, slug: string) {
  try {
    await db
      .update(categories)
      .set({ name, slug })
      .where(eq(categories.id, id));
    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete category" };
  }
}

export async function reorderCategories(
  updates: { id: string; position: number }[],
) {
  try {
    for (const update of updates) {
      await db
        .update(categories)
        .set({ position: update.position })
        .where(eq(categories.id, update.id));
    }
    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to reorder categories" };
  }
}
