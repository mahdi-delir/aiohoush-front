"use client";

import * as React from "react";
import type { ReactNode } from "react";

/*
 * React <ViewTransition> (روش پیشنهادی مستندات Next.js 16 برای انیمیشن
 * جابه‌جایی صفحه‌ها؛ روی View Transitions API خود مرورگر کار می‌کند).
 *
 * App Router از نسخهٔ canary خود React استفاده می‌کند که این کامپوننت را
 * دارد، ولی تایپ‌های @types/react نصب‌شده ممکن است هنوز آن را نشناسند؛
 * برای همین از طریق این wrapper استفاده می‌شود. اگر در دسترس نبود، فقط
 * محتوا بدون انیمیشن نمایش داده می‌شود.
 */
type TransitionClass = string | Record<string, string>;

export interface ViewTransitionProps {
  children: ReactNode;
  name?: string;
  enter?: TransitionClass;
  exit?: TransitionClass;
  update?: TransitionClass;
  share?: TransitionClass;
  default?: TransitionClass;
}

const NativeViewTransition = (
  React as unknown as {
    ViewTransition?: React.ComponentType<ViewTransitionProps>;
  }
).ViewTransition;

export function ViewTransition(props: ViewTransitionProps) {
  if (!NativeViewTransition) return <>{props.children}</>;
  return <NativeViewTransition {...props} />;
}
