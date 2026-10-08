"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Input from "@/components/ui/text-input";

const DELAY_MS = 350;

export default function CourseSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlSearch);
  const pushed = useRef(urlSearch.trim());

  useEffect(() => {
    if (urlSearch.trim() !== pushed.current) {
      pushed.current = urlSearch.trim();
      setValue(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    const search = value.trim();
    if (search === pushed.current) return;

    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      pushed.current = search;

      if (search) {
        params.set("q", search);
        params.delete("category");
      } else {
        params.delete("q");
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [value]);

  return (
    <form role="search" onSubmit={(event) => event.preventDefault()}>
      <Input
        type="search"
        enterKeyHint="search"
        aria-label="جست‌وجو در دوره‌ها"
        placeholder="جست‌وجو در دوره‌ها"
        value={value}
        maxLength={100}
        onChange={(event) => setValue(event.target.value)}
      />
    </form>
  );
}
