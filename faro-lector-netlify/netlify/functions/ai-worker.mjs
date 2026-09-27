// Faro Lector · Función en segundo plano que consulta a Claude (Anthropic)
// Elaborado y diseñado por Ing. Cristóbal Apolinar
import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";

const envGet = (k) => {
  try { if (globalThis.Netlify && Netlify.env && Netlify.env.get) { const v = Netlify.env.get(k); if (v != null && v !== "") return v; } } catch {}
  return process.env[k];
};
const MODELS = {
  quick: () => envGet("CLAUDE_MODEL_QUICK") || "claude-haiku-4-5-20251001",
  default: () => envGet("CLAUDE_MODEL") || "claude-sonnet-5",
  complex: () => envGet("CLAUDE_MODEL_COMPLEX") || "claude-opus-5-5"
};

export default async (req) => {
  const secret = envGet("SESSION_SECRET") || "";
  const want = createHash("sha256").update("worker:" + secret).digest("hex");
  if (!secret || req.headers.get("x-faro-worker") !== want) return new Response("forbidden", { status: 403 });
  let id = "";
  try { id = String((await req.json()).id || "").slice(0, 40); } catch { return; }
  const blobs = getStore({ name: "faro-lector", consistency: "strong" });
  const job = await blobs.get("job/" + id, { type: "json" });
  if (!job || job.status !== "pending") return;
  job.status = "running";
  await blobs.setJSON("job/" + id, job);
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 240000);
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: ctl.signal,
      headers: { "content-type": "application/json", "x-api-key": envGet("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: (MODELS[job.tier] || MODELS.default)(), max_tokens: Math.min(job.maxTokens || 3000, 8000), messages: [{ role: "user", content: job.prompt }] })
    });
    clearTimeout(timer);
    if (!r.ok) throw new Error("Anthropic " + r.status + ": " + (await r.text()).slice(0, 200));
    const d = await r.json();
    job.text = (d.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
    job.status = "done";
  } catch (e) {
    job.status = "error";
    job.error = String((e && e.message) || e).slice(0, 300);
  }
  delete job.prompt;
  await blobs.setJSON("job/" + id, job);
};

export const config = { path: "/_faro-ai-worker", background: true };
