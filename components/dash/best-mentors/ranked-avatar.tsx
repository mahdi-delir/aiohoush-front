"use client";

import Image from "next/image";
import { useState } from "react";

const tones = {
  gold: "from-amber-200 to-amber-500 text-amber-950 ring-amber-300/30",
  silver: "from-slate-200 to-slate-400 text-slate-900 ring-slate-300/20",
  bronze: "from-orange-200 to-orange-400 text-orange-950 ring-orange-300/20",
  green: "from-approve-bg to-element-bg text-approve ring-primary-green/20",
};
const sizes = {
  small: "size-11 text-sm",
  medium: "size-14 text-lg sm:size-20 sm:text-xl",
  large: "size-16 text-xl sm:size-24 sm:text-2xl",
};

export default function RankedAvatar({
  name,
  src,
  tone = "green",
  size = "small",
}: {
  name: string;
  src: string | null;
  tone?: keyof typeof tones;
  size?: keyof typeof sizes;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join(" ");

  return (
    <span
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-linear-to-br font-bold ring-4 ${tones[tone]} ${sizes[size]}`}
    >
      {src && !failed ? (
        <Image
          // عکس از دامنهٔ API می‌آید و در remotePatterns نیست.
          unoptimized
          src={src}
          alt={`عکس ${name}`}
          fill
          sizes={size === "large" ? "96px" : size === "medium" ? "80px" : "44px"}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{initials || "؟"}</span>
      )}
    </span>
  );
}
