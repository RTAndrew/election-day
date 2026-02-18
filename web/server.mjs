/**
 * Production server for TanStack Start (SSR).
 * Converts Node HTTP to Fetch and runs the built server's fetch handler.
 * Serves static files from dist/client for /assets and other static paths.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const CLIENT_DIR = join(__dirname, "dist", "client");

const MIME = {
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".txt": "text/plain",
};

async function serveStatic(pathname) {
  const filePath = join(CLIENT_DIR, pathname.replace(/^\//, ""));
  if (!filePath.startsWith(CLIENT_DIR) || !existsSync(filePath)) return null;
  try {
    const content = await readFile(filePath);
    const mime = MIME[extname(pathname)] || "application/octet-stream";
    return new Response(content, {
      headers: { "Content-Type": mime },
    });
  } catch {
    return null;
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function getRequest(req) {
  const host = req.headers.host || "localhost:3000";
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const path = (req.url || "/").split("?")[0];
  const search = req.url && req.url.includes("?") ? "?" + req.url.split("?")[1] : "";
  const urlStr = `${protocol}://${host}${path}${search}`;
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v != null) headers.set(k.toLowerCase(), String(v));
  }
  let body = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const buf = await readBody(req);
    if (buf.length) body = buf;
  }
  return new Request(new URL(urlStr), {
    method: req.method,
    headers,
    body,
  });
}

async function writeResponse(res, response) {
  res.writeHead(response.status, Object.fromEntries(response.headers));
  if (response.body) {
    for await (const chunk of response.body) res.write(chunk);
  }
  res.end();
}

async function main() {
  const { default: server } = await import("./dist/server/server.js");
  const handler = server.fetch.bind(server);

  createServer(async (req, res) => {
    const pathname = new URL(req.url || "/", `http://${req.headers.host}`).pathname;
    // Serve static assets and known client files
    if (pathname.startsWith("/assets/") || pathname === "/favicon.ico" || pathname === "/robots.txt" || pathname === "/manifest.json") {
      const response = await serveStatic(pathname);
      if (response) {
        await writeResponse(res, response);
        return;
      }
    }
    try {
      const request = await getRequest(req);
      const response = await handler(request);
      await writeResponse(res, response);
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  }).listen(PORT, HOST, () => {
    console.log(`Server listening at http://${HOST}:${PORT}`);
  });
}

main();
