import { cn } from "@/lib/utils";

export default function StatusBar({
  percent,
  className,
  label = "پیشرفت",
}: {
  percent: number | null;
  className?: string;
  label?: string;
}) {
  const value =
    percent !== null && Number.isFinite(percent)
      ? Math.min(100, Math.max(0, percent))
      : undefined;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={cn(
        "w-full h-1.5 rounded-full bg-white/10 overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-primary-green motion-safe:transition-[width] duration-200",
          value === undefined && "motion-safe:animate-pulse",
        )}
        style={{ width: value === undefined ? "100%" : `${value}%` }}
      />
    </div>
  );
}
