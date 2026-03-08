"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

export async function updateSettingsAction(data: {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  behanceUrl: string | null;
}) {
  try {
    // Check if settings record exists (it uses a fixed id "site_config")
    const existing = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.id, "site_config"),
    });

    if (existing) {
      await db
        .update(siteSettings)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.id, "site_config"));
    } else {
      await db.insert(siteSettings).values({
        id: "site_config",
        ...data,
        updatedAt: new Date(),
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function getSettingsAction() {
  try {
    const settings = await db.query.siteSettings.findFirst({
      where: eq(siteSettings.id, "site_config"),
    });

    if (!settings) {
      // Default initial values
      return {
        siteName: "",
        siteDescription: "",
        contactEmail: "",
        instagramUrl: null,
        facebookUrl: null,
        behanceUrl: null,
      };
    }

    return settings;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return null;
  }
}
