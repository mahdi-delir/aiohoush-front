import type { InputHTMLAttributes, PropsWithChildren } from "react";
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
    className={cn("bg-card-bg rounded-icon px-2", className)}
    {...props}
    />
  );
}
