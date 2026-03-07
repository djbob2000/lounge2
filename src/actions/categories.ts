"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { categories } from "@/db/schema";

export async function createCategory(name: string, slug: string, showInMenu: boolean = true) {
  try {
    const all = await db.query.categories.findMany();
    const [inserted] = await db
      .insert(categories)
      .values({
        name,
        slug,
        showInMenu,
        position: all.length,
      })
      .returning();
    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");
    return { success: true, category: inserted };
  } catch {
    return {
      success: false,
      error: "Failed to create category or slug exists",
    };
  }
}

export async function updateCategory(id: string, name: string, slug: string, showInMenu: boolean) {
  try {
    await db.update(categories).set({ name, slug, showInMenu }).where(eq(categories.id, id));
    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete category" };
  }
}

export async function reorderCategories(updates: { id: string; position: number }[]) {
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
  } catch {
    return { success: false, error: "Failed to reorder categories" };
  }
}
