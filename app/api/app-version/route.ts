import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let cached: string | null = null;

async function serverVersion(): Promise<string | null> {
  if (cached) return cached;

  try {
    cached = (await readFile(join(process.cwd(), ".next", "BUILD_ID"), "utf8")).trim() || null;
  } catch {
    cached = null;
  }

  return cached;
}

export async function GET() {
  return Response.json(
    { version: await serverVersion() },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
