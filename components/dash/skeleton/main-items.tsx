
import { Skeleton } from "@/components/ui/skeleton";

export default function MainItemsSkeleton() {
  return (
    <section className="grid grid-cols-4 gap-2">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="flex aspect-square w-full flex-col items-center justify-center gap-2"
        >
          <Skeleton className="size-16 rounded-xl" />

          <Skeleton className="h-4 w-16 rounded-sm" />
        </div>
      ))}
    </section>
  );
}