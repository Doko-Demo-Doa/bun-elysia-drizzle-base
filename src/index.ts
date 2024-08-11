import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cron, Patterns } from "@elysiajs/cron";
import { startParsingAndDownload } from "./crons/downloader";

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
    app.get("/", () => {
      return "Hello World!";
    })
  )
  .listen(process.env.PORT ?? 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

// startParsingAndDownload();
