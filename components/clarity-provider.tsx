"use client";

import { useEffect } from "react";
import { initClarity } from "@/lib/clarity";

export default function ClarityProvider() {
  useEffect(() => {
    initClarity();
  }, []);

  return null;
}