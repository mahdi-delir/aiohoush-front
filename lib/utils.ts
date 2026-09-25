import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import localFont from "next/font/local";
import { api } from "./axios";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const darbare = localFont({
  src: "../public/fonts/darbarehVFWebVF.woff2",
  display: "swap",
  variable: "--font-darbare",
});


export const downloadFile = async (
  url: string,
  fileName?: string
) => {
  const response = await api.get(url, {
    responseType: "blob",
  });

  const blobUrl = URL.createObjectURL(response.data);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName || "file";

  link.click();

  URL.revokeObjectURL(blobUrl);
};