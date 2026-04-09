import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-9e4d84c0/health", (c) => {
  return c.json({ status: "ok" });
});

// GET all data
app.get("/make-server-9e4d84c0/data", async (c) => {
  try {
    const [assignments, quizzes, grades] = await kv.mget([
      "school:assignments",
      "school:quizzes",
      "school:grades",
    ]);
    return c.json({
      assignments: assignments ?? [],
      quizzes: quizzes ?? [],
      grades: grades ?? [],
    });
  } catch (e) {
    console.log("Error fetching data:", e);
    return c.json({ error: String(e) }, 500);
  }
});

// PUT save all data
app.put("/make-server-9e4d84c0/data", async (c) => {
  try {
    const { assignments, quizzes, grades } = await c.req.json();
    await kv.mset(
      ["school:assignments", "school:quizzes", "school:grades"],
      [assignments, quizzes, grades]
    );
    return c.json({ ok: true });
  } catch (e) {
    console.log("Error saving data:", e);
    return c.json({ error: String(e) }, 500);
  }
});

Deno.serve(app.fetch);