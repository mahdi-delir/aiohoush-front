"use client";

import { useEffect, useState } from "react";

import { LOGO_PATHS, LOGO_VIEWBOX } from "./splash-logo-paths";

const MIN_VISIBLE_MS = 1200;
const FADE_MS = 400;

export default function SplashScreen() {
  const [phase, setPhase] = useState<"visible" | "leaving" | "gone">("visible");

  useEffect(() => {
    if (document.documentElement.getAttribute("data-splash") === "off") {
      setPhase("gone");
      return;
    }

    const wait = Math.max(0, MIN_VISIBLE_MS - performance.now());
    const leave = window.setTimeout(() => setPhase("leaving"), wait);
    const remove = window.setTimeout(() => {
      setPhase("gone");
      document.documentElement.setAttribute("data-splash", "off");
    }, wait + FADE_MS);

    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(remove);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      id="app-splash"
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-[#0a0a0a] transition-opacity duration-400 motion-reduce:transition-none ${
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <svg
        viewBox={LOGO_VIEWBOX}
        className="w-28 motion-safe:animate-[splash-in_700ms_ease-out_both]"
        fill="#00b78e"
        stroke="#22d0a6"
        strokeWidth={0.77}
      >
        {LOGO_PATHS.map((d) => (
          <path key={d.slice(0, 16)} d={d} />
        ))}
      </svg>
      <span className="text-3xl font-extrabold text-white motion-safe:animate-[splash-in_700ms_120ms_ease-out_both]">
        آیوهوش
      </span>
    </div>
  );
}
