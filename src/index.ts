import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cron, Patterns } from "@elysiajs/cron";
import { inArray, notInArray } from "drizzle-orm";
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
        console.log("Heartbeat");
      },
    })
  )
  .group("/api", (app) =>
    app.get("/", async () => {
      const desktopLinks = await getDesktopLinks();
      const query = await db
        .select()
        .from(wallpapers)
        .where(notInArray(wallpapers.originalUrl, desktopLinks));

      return query;
    })
  )
  .listen(process.env.PORT ?? 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

// startParsingAndDownload();
