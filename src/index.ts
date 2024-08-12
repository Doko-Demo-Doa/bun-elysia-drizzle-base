import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cron, Patterns } from "@elysiajs/cron";
import { inArray } from "drizzle-orm";
import * as R from "remeda";
import { startParsingAndDownload } from "./crons/downloader";
import { db } from "./db";
import { wallpapers } from "./db/schema";
import { getDesktopLinks } from "./crons/parser";

const app = new Elysia()
  .use(swagger())
  .use(
    cron({
      name: "heartbeat",
      pattern: Patterns.everyHours(),
      run() {
        console.log("Starting crawling...");
        startParsingAndDownload();
      },
    })
  )
  .group("/api", (app) =>
    app.get("/", async () => {
      const desktopLinks = await getDesktopLinks();

      // Check for existing links
      const query = await db
        .select()
        .from(wallpapers)
        .where(inArray(wallpapers.originalUrl, desktopLinks));

      const diff = R.difference(
        desktopLinks,
        query.map((q) => q.originalUrl)
      );
      return diff;
    })
  )
  .listen(process.env.PORT ?? 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
