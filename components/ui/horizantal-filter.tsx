import type { CategoryItem } from "@/types/category";
import Image, { ImageProps } from "next/image";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LiquidBg from "./liquid-bg";

interface categoryListProps {
  categories: CategoryItem[];
  title?: string;
  icons: Record<string, ImageProps["src"]>;
  selectedFilter?: string;
}

export function HorizentalFilter({
  categories,
  title,
  icons,
}: categoryListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedFilter = searchParams?.get("category");

  function handleCategorySelect(category: CategoryItem) {
    const params = new URLSearchParams(searchParams);
    params.set("category", category.slug);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <section>
      {title && <h3 className="font-bold mb-4">{title}</h3>}
      <div className="flex gap-4 overflow-x-auto scrollbar-none">
        {categories.map((category) => {
          const isSelected = category.slug === selectedFilter;
          return (
            <button
              type="button"
              className="flex flex-col items-center  min-w-20"
              onClick={() => handleCategorySelect(category)}
              key={category.id}
            >
              <LiquidBg
                className={`p-2 transition-all ${isSelected ? "bg-primary-green" : ""}`}
              >
                <Image
                  alt={category.title}
                  src={icons[category.icon]}
                  width={40}
                  height={40}
                />
              </LiquidBg>
              <span className="text-center text-xs mt-2">{category.title}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
