import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type LiquidBgProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export default function LiquidBg({
  children,
  className,
  ...props
}: LiquidBgProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-md backdrop-saturate-150 shadow-2xl rounded-icon [corner-shape:squircle] bg-linear-to-br from-white/15 to-transparent",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}