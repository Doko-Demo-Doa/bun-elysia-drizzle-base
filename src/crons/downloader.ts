import { UTApi } from "uploadthing/server";
import { unlinkSync } from "node:fs";
import { getDesktopLinks } from "./parser";
import { db } from "../db";
import { wallpapers, type NewWallpaper } from "../db/schema";

export const utapi = new UTApi();

export async function startParsingAndDownload() {
  const desktopLinks = await getDesktopLinks();
  for (const link of desktopLinks) {
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
