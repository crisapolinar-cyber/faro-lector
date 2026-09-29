// Faro Lector · API segura (Netlify Functions + Netlify Blobs)
// Elaborado y diseñado por Ing. Cristóbal Apolinar
import { getStore } from "@netlify/blobs";
import { webcrypto, createHash } from "node:crypto";
import { createApi } from "./lib/core.mjs";
import diag from "./lib/diag.mjs";
import analysisHtml from "./lib/analysis.mjs";

if (!globalThis.crypto) globalThis.crypto = webcrypto;

const envGet = (k) => {
  try { if (globalThis.Netlify && Netlify.env && Netlify.env.get) { const v = Netlify.env.get(k); if (v != null && v !== "") return v; } } catch {}
  return process.env[k];
};
const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" }
});

let api = null;
let origin = "";
function getApi() {
  if (api) return api;
  const blobs = getStore({ name: "faro-lector", consistency: "strong" });
  const store = {
    get: (k) => blobs.get(k, { type: "json" }),
    set: (k, v) => blobs.setJSON(k, v),
    del: (k) => blobs.delete(k),
    list: async (p) => (await blobs.list({ prefix: p })).blobs.map((b) => b.key)
  };
  const secret = envGet("SESSION_SECRET") || "";
  const workerKey = createHash("sha256").update("worker:" + secret).digest("hex");
  api = createApi({
    store, diag, analysisHtml,
    env: { SESSION_SECRET: secret, ADMIN_SETUP_CODE: envGet("ADMIN_SETUP_CODE") },
    // La consulta a Claude se ejecuta en una función en segundo plano (hasta 15 min)
    queueAi: envGet("ANTHROPIC_API_KEY") ? async (id) => {
      const r = await fetch(new URL("/_faro-ai-worker", origin), {
        method: "POST",
        headers: { "content-type": "application/json", "x-faro-worker": workerKey },
        body: JSON.stringify({ id })
      });
      if (r.status >= 400) throw new Error("worker " + r.status);
    } : null
  });
  return api;
}

export default async (req, context) => {
  const url = new URL(req.url);
  origin = url.origin;
  const path = url.pathname.replace(/^\/api/, "") || "/";
  let body = null;
  if (req.method === "POST") {
    const reqOrigin = req.headers.get("origin");
    if (reqOrigin && reqOrigin !== url.origin) return json(403, { error: "origin", message: "Origen no permitido." });
    const txt = await req.text();
    if (txt.length > 200000) return json(413, { error: "size", message: "Solicitud demasiado grande." });
    try { body = txt ? JSON.parse(txt) : {}; } catch { return json(400, { error: "json", message: "Solicitud no válida." }); }
  } else if (req.method !== "GET") {
    return json(405, { error: "method", message: "Método no permitido." });
  }
  try {
    const headers = Object.fromEntries(req.headers);
    const ip = (context && context.ip) || req.headers.get("x-nf-client-connection-ip") || "0.0.0.0";
    const r = await getApi().handle({ method: req.method, path, body, headers, ip });
    if (r.status >= 500) console.error("[faro] respuesta", r.status, path, r.body && r.body.error);
    return json(r.status, r.body);
  } catch (e) {
    console.error("[faro] falla no controlada en", path, e && (e.stack || e.message || e));
    api = null; // reinicia la conexión con el almacenamiento en la siguiente solicitud
    return json(500, { error: "server", message: "El servidor tuvo una falla momentánea. Vuelve a intentar." });
  }
};

export const config = { path: "/api/*" };
