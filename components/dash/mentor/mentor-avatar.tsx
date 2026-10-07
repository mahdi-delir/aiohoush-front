"use client";

import Image from "next/image";
import { useState } from "react";

export default function MentorAvatar({ src, name }: { src: string | null; name: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="relative size-28 shrink-0 overflow-hidden rounded-full bg-element-bg ring-8 ring-card-bg"
    >
      {src && !failed ? (
        <Image
          src={src}
          alt={`عکس پروفایل ${name}`}
          fill
          sizes="112px"
          unoptimized
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          role="img"
          aria-label={`عکس پروفایل ${name} در دسترس نیست`}
          className="grid size-full place-items-center text-3xl font-bold text-approve"
        >
          {name.trim().slice(0, 1) || "؟"}
        </span>
      )}
    </div>
  );
}
