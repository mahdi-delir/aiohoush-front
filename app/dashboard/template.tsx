import type { ReactNode } from "react";

import { ViewTransition } from "@/components/motion/view-transition";

export default function DashboardTemplate({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
