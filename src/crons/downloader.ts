import { UTApi } from "uploadthing/server";
import { unlinkSync } from "node:fs";
import { difference } from "remeda";

import { getDesktopLinks } from "./parser";
import { db } from "../db";
import { wallpapers, type NewWallpaper } from "../db/schema";
import { inArray } from "drizzle-orm";

export const utapi = new UTApi();

export async function startParsingAndDownload() {
  const desktopLinks = await getDesktopLinks();

  const query = await db
    .select()
    .from(wallpapers)
    .where(inArray(wallpapers.originalUrl, desktopLinks));

  // Only get links in desktopLinks that are not in the database
  const diff = difference(
    desktopLinks,
    query.map((q) => q.originalUrl)
  );

  if (diff.length) {
    console.info("New links found: ", diff);
  }

  for (const link of diff) {
    // Download file
    const result = await fetch(link);
    const path = `./temp/${extractFileNameFromUrl(link)}`;
    await Bun.write(path, result);
    const fileM = Bun.file(path);

    // Upload
    const uploadedFile = await utapi.uploadFiles(
      new File([fileM], extractFileNameFromUrl(link) || "")
    );

    const newWallpaper: NewWallpaper = {
      createdAt: new Date().toUTCString(),
      fileName: extractFileNameFromUrl(link) || "",
      isMobile: 0,
      originalUrl: link,
      url: uploadedFile.data?.url || "",
    };
    await db.insert(wallpapers).values(newWallpaper);

    unlinkSync(path);
  }
}

function extractFileNameFromUrl(url: string) {
  return url.split("/").pop();
}
