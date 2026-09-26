import { api } from "./axios";

export const MAX_UPLOAD_FILE_BYTES = 5_000_000;

export interface UploadTarget {
  url: string;
  fileField: string;
  fields?: Record<string, string>;
}

interface UploadFilesOptions extends UploadTarget {
  files: readonly File[];
  signal?: AbortSignal;
  onProgress?: (percent: number | null) => void;
}

export async function uploadFiles<T = unknown>({
  url,
  fileField,
  fields,
  files,
  signal,
  onProgress,
}: UploadFilesOptions): Promise<T> {
  if (!url.trim() || !fileField.trim()) {
    throw new Error("آدرس آپلود و فایل برای آپلود الزامی است.");
  }
  if (!files.length) throw new Error("فایلی برای آپلود انتخاب نشده است.");
  if (files.some((file) => file.size > MAX_UPLOAD_FILE_BYTES)) {
    throw new Error("حجم هر فایل نبایت بیشتر از 5 مگابایت باشد.");
  }
  if (fields && Object.prototype.hasOwnProperty.call(fields, fileField)) {
    throw new Error("File field must not collide with metadata fields");
  }

  const body = new FormData();
  for (const [key, value] of Object.entries(fields ?? {})) {
    body.append(key, value);
  }
  for (const file of files) body.append(fileField, file, file.name);

  const response = await api.post<T>(url, body, {
    adapter: "xhr",
    signal,
    onUploadProgress: ({ loaded, total }) => {
      onProgress?.(
        total && total > 0
          ? Math.min(100, Math.max(), Math.floor((loaded / total) * 100))
          : null,
      );
    },
  });
  return response.data;
}
