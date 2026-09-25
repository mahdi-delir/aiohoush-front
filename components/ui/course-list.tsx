import { CourseList } from "@/types/course";
import Image from "next/image";
import { useRouter } from "next/navigation";

type CourseListProp = {
  title: string;
  list: CourseList;
};

export default function CourseListC({ title, list }: CourseListProp) {
  const router = useRouter();

  function handleCourseSelect(slug: string) {
    if (!slug) return;
    router.push(`/dashboard/courses/${slug}`);
  }

  return (
    <section>
      <h2 className="font-bold text-xl">{title}</h2>
      <ul>
        {list.courses.map((item) => {
          return (
            <li
              key={item.id}
              className="bg-card-bg my-4 rounded-square h-36"
              onClick={() => handleCourseSelect(item.slug)}
            >
              <div className="p-4 flex justify-between h-full">
                <div className="w-2/3">
                  <h2 className="font-bold text-xl">{item.title}</h2>
                  <p>
                    {item.duration} {item.level}
                  </p>
                </div>
                <div className="overflow-hidden flex justify-center items-center min-h-full w-1/3 bg-element-bg rounded-square">
                  <Image
                    src={item.cover}
                    width={100}
                    height={100}
                    alt={item.title}
                    className="w-full h-full"
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
