import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cron } from "@elysiajs/cron";

const app = new Elysia()
  .use(swagger())
  .group("/api", (app) =>
    app.get("/", () => {
      return "Hello World!";
    })
  )
  .use(
    cron({
      name: "heartbeat",
      pattern: "0 * * * *",
      run() {
        console.log("Heartbeat");
      },
    })
  )
  .listen(process.env.PORT ?? 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
