import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Better Auth Tables (Auto-generated)
export * from "./auth-schema";

// App Tables

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  position: integer("position").notNull().default(0),
  showInMenu: boolean("showInMenu").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const albums = pgTable("albums", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("categoryId")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  coverImageUrl: text("coverImageUrl"),
  coverImageKey: text("coverImageKey"),
  isHidden: boolean("isHidden").notNull().default(false),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const photos = pgTable("photos", {
  id: uuid("id").defaultRandom().primaryKey(),
  albumId: uuid("albumId")
    .notNull()
    .references(() => albums.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  r2Key: text("r2Key").notNull(),
  isSliderImage: boolean("isSliderImage").notNull().default(false),
  position: integer("position").notNull().default(0),
  sliderPosition: integer("sliderPosition").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("site_config"),
  siteName: text("siteName").notNull().default(""),
  siteDescription: text("siteDescription").notNull().default(""),
  contactEmail: text("contactEmail").notNull().default(""),
  instagramUrl: text("instagramUrl"),
  facebookUrl: text("facebookUrl"),
  behanceUrl: text("behanceUrl"),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
