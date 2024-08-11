// Add necessary tables to this file.
// They will automatically get picked up during deploy migrate step.

// 👇See below for an example of a `wallpapers` table

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, uuid, smallint, varchar, date } from "drizzle-orm/pg-core";

export const wallpapers = pgTable("wallpapers", {
  id: uuid("id").defaultRandom().primaryKey(),
  fileName: varchar("file_name", { length: 2048 }).notNull(),
  url: varchar("url", { length: 2048 }).notNull(),
  originalUrl: varchar("original_url", { length: 2048 }).notNull(),
  isMobile: smallint("is_mobile").notNull(), // 0: false, 1: true
  createdAt: date("created_at", { mode: "string" }).notNull(),
  updatedAt: date("updated_at", { mode: "string" }),
});

export type Wallpaper = InferSelectModel<typeof wallpapers>;
export type NewWallpaper = InferInsertModel<typeof wallpapers>;
