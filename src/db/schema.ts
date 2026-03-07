import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Better Auth Tables
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  expiresAt: timestamp("expiresAt"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// App Tables

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  position: integer("position").notNull().default(0),
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
  isDraft: boolean("isDraft").notNull().default(true),
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
  position: integer("position").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const homeSlider = pgTable("home_slider", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: text("url").notNull(),
  r2Key: text("r2Key").notNull(),
  title: text("title"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
