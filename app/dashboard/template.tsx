import type { ReactNode } from "react";

import { ViewTransition } from "@/components/motion/view-transition";

/*
 * template (برخلاف layout) با هر جابه‌جایی صفحه از نو mount می‌شود؛ پس
 * ViewTransition این‌جا برای صفحهٔ قبلی exit و برای صفحهٔ جدید enter
 * اجرا می‌کند. کلاس‌های انیمیشن در app/globals.css هستند.
 */
export default function DashboardTemplate({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
