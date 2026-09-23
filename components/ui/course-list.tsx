import { CourseListItem } from "@/types/course-list";
import Image from "next/image";

type CourseListProp = {
  title: string;
  list: CourseListItem[];
};

export default function CourseList({ title, list }: CourseListProp) {
  return (
    <section>
      <h2>{title}</h2>
      <ul>
        {list.map((item) => {
          return (
            <li key={item.id} className="bg-card-bg my-4 rounded-square h-36">
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
