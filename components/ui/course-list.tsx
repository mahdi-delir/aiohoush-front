import { CourseInfo, CourseList } from "@/types/course";
import Image from "next/image";
import { useRouter } from "next/navigation";

type CourseListProp = {
  title: string;
  courses: CourseInfo[];
};

export default function CourseListC({ title, courses }: CourseListProp) {
  const router = useRouter();

  function handleCourseSelect(slug: string) {
    if (!slug) return;
    router.push(`/dashboard/courses/${slug}`);
  }

  return (
    <section>
      <h2 className="font-bold text-xl">{title}</h2>
      <ul>
        {courses.map((item) => {
          return (
            <li
              key={item.id}
              className="bg-card-bg my-4 rounded-square h-36"
              onClick={() => handleCourseSelect(item.slug)}
            >
              <div className="p-4 flex justify-between h-full">
                <div className="w-2/3 flex flex-col justify-center gap-2">
                  <h2 className="font-bold text-xl">{item.title}</h2>
                  <p>
                    {item.duration} {item.level}
                  </p>
                </div>
                <div className="relative overflow-hidden max-w-1/3 bg-element-bg rounded-icon aspect-square">
                  <Image
                    src={item.cover}
                    fill
                    alt={item.title}
                    className="object-cover"
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
