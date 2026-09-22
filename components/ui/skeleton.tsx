import { cn } from "@/lib/utils";

type SkeletonProps = React.ComponentProps<"div">;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse bg-white/10", className)} {...props} />
  );
}
