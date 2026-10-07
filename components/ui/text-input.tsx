import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const inputVariants = {
  variant: {
    search: "bg-blue",

  },
} as const;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: keyof typeof inputVariants.variant;
}

export default function Input({ variant, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "bg-card-bg rounded-icon py-3 px-4 text-base w-full",
        className,
      )}
      {...props}
    />
  );
}
