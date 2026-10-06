import type { ProjectStatus } from "@/types/project";

export const IMAGE_MAX_BYTES = 3 * 1024 * 1024;
export const ZIP_MAX_BYTES = 20 * 1024 * 1024;
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

export const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-approve";

export const statusStyles: Record<ProjectStatus, string> = {
  pending: "bg-amber-300/15 text-amber-300",
  approved: "bg-approve-bg text-approve",
  rejected: "bg-red-400/15 text-red-300",
};

export function formatSize(bytes: number) {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toLocaleString("fa-IR", { maximumFractionDigits: 1 })} مگابایت`;
  return `${Math.max(1, Math.round(bytes / 1024)).toLocaleString("fa-IR")} کیلوبایت`;
}

/** فقط https؛ برای GitHub فقط github.com. */
export function safeLink(value: string | null, github = false): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (github && !["github.com", "www.github.com"].includes(url.hostname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

/** آدرس دانلود zip از طریق BFF */
export function projectFileUrl(fileId: number) {
  return `/api/projects/files/${fileId}`;
}

export function checkImage(file: File): string | null {
  if (!IMAGE_ACCEPT.split(",").includes(file.type)) {
    return `«${file.name}»: فقط تصاویر JPG، PNG و WEBP پذیرفته می‌شوند.`;
  }
  if (file.size > IMAGE_MAX_BYTES) {
    return `«${file.name}»: حجم هر عکس حداکثر ۳ مگابایت است.`;
  }
  return null;
}

export function checkZip(file: File): string | null {
  if (!file.name.toLowerCase().endsWith(".zip")) {
    return `«${file.name}»: فایل پروژه باید zip باشد.`;
  }
  if (file.size > ZIP_MAX_BYTES) {
    return `«${file.name}»: حجم هر فایل حداکثر ۲۰ مگابایت است.`;
  }
  return null;
}

interface ApiBody<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

/** درخواست به BFF؛ خطا (HTTP یا success=false) به‌صورت Error با پیام سرور. */
export async function projectRequest<T = unknown>(
  url: string,
  init: RequestInit = {},
  fallback = "درخواست با خطا مواجه شد.",
): Promise<{ data: T | undefined; message: string }> {
  const response = await fetch(url, { credentials: "same-origin", ...init });
  const body = (await response.json().catch(() => null)) as ApiBody<T> | null;

  if (!response.ok || !body?.success) {
    throw new Error(body?.message || fallback);
  }

  return { data: body.data, message: body.message ?? "" };
}

/**
 * آپلود با نمایش پیشرفت (fetch پیشرفت آپلود ندارد).
 */
export function uploadWithProgress<T = unknown>(
  url: string,
  formData: FormData,
  onProgress: (percent: number) => void,
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.withCredentials = true;
    xhr.responseType = "json";

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      const body = xhr.response as ApiBody<T> | null;
      if (xhr.status >= 200 && xhr.status < 300 && body?.success) {
        resolve(body.data);
      } else {
        reject(new Error(body?.message || "آپلود فایل با خطا مواجه شد."));
      }
    };

    xhr.onerror = () => reject(new Error("ارتباط قطع شد؛ دوباره تلاش کنید."));
    xhr.send(formData);
  });
}
