"use client"

import Button from "@/components/ui/button";
import { Video } from "@/components/ui/video";
import { useGetVideo } from "@/features/hooks/use-video";

type EpisodContentProps = {
    id: string;
}

export default function EpisodContent({id}: EpisodContentProps){
    const {data: res, isPending, isError} = useGetVideo(id);
      if (isPending) {
    return <p>در حال دریافت اطلاعات دوره...</p>;
  }

  if (isError && !res) {
    return <p>دریافت اطلاعات دوره با خطا مواجه شد.</p>;
  }

  if (!res) {
    return <p>دوره پیدا نشد.</p>;
  }
  const video = res.data
    return (
        <div className="flex flex-col gap-8">
            <section className="flex justify-between">
                <Button className="max-w-fit" size="sm" variant="secondary">
                    جلسه قبل
                </Button>   


                <Button className="max-w-fit" size="sm" variant="secondary">
                    جلسه بعد
                </Button>

            </section>

            <section>
                <Video item={video}/>
            </section>
        </div>
    )
}