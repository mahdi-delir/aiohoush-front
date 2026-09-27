const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  timeZone: "Asia/Tehran",
  year: "numeric", month: "long", day: "numeric",
  hour: "2-digit", minute: "2-digit",
});

export function formatHomeworkDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "تاریخ نامعتبر" : formatter.format(date);
}

// URLs must come from the authenticated backend. Reject executable URL schemes.
export function getHomeworkAttachmentUrl(value: string | null): string | null {
  if (!value) return null;
  const url = value.trim();
  if (/[\u0000-\u0020\\]/.test(url)) return null;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : null;
  } catch {
    return null;
  }
}
