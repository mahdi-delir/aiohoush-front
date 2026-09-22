import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
const buttonVariants = {
  variant: {
    primary: "bg-primary-green text-black",
    secondary: "bg-primary-green/30 text-white",
    danger: "bg-danger text-white",
    ghost: "",
    outline: "",
  },
  size: {
    sm: "h-9 px-3.5 text-sm rounded-xl",
    md: "h-10 px-4 text-lg rounded-2xl",
    lg: "h-11 px-4.5 text-2xl font-semibold rounded-3xl",
    xl: "h-12 px-5 text-3xl font-bold rounded-4xl",
  },
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        "w-full",
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
