import type { GiftCategoryResponse } from "@/types/category";

export const mockGiftCat: GiftCategoryResponse = {
  data: [
    {
      id: 1,
      title: "شروع برنامه نویسی",
      icon: "start",
      slug: "programming-start",
    },
    { 
      id: 2,
      title: "طراحی گوگل",
      icon: "google",
      slug: "google"
    },
    { 
      id: 3,
      title: "رزومه شخصی",
      icon: "resume",
      slug: "resume"
    },
    { 
      id: 4,
      title: "طراحی ماشین حساب",
      icon: "calc",
      slug: "calculator"
    },
    { 
      id: 5,
      title: "قندخون با AI",
      icon: "diabetes",
      slug: "diabetes"
    },
  ],
};
