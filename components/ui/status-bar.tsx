import { cn } from "@/lib/utils";

export default function StatusBar({
  percent,
  className,
}: {
  percent: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full h-1.5 rounded-full bg-white/10 overflow-hidden",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-primary-green transition-all duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
