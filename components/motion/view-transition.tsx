"use client";

import * as React from "react";
import type { ReactNode } from "react";

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
