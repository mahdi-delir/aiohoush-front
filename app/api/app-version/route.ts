import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let cached: string | null = null;

/*
 * نسخهٔ build فعلی سرور؛ اپ‌های باز با نسخهٔ خودشان مقایسه می‌کنند.
 * از فایل BUILD_ID خوانده می‌شود تا با اجرای دوبارهٔ next.config هنگام
 * next start عوض نشود.
 */
async function serverVersion(): Promise<string | null> {
  if (cached) return cached;

  // در next dev ممکن است BUILD_ID قدیمیِ یک build قبلی روی دیسک باشد.
  if (process.env.NODE_ENV !== "production") {
    return process.env.NEXT_PUBLIC_APP_VERSION ?? null;
  }

  try {
    cached = (await readFile(join(process.cwd(), ".next", "BUILD_ID"), "utf8")).trim();
  } catch {
    cached = process.env.NEXT_PUBLIC_APP_VERSION ?? null;
  }

  return cached;
}

export async function GET() {
  return Response.json(
    { version: await serverVersion() },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
