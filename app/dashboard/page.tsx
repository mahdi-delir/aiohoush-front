import MainItems from "@/components/dash/dashboard/main-items";
import Image from "next/image";
import ad from '@/public/pictures/C0BA7AEC-D3F4-4883-A70E-98FCD8568319.png'
import Hero from "@/components/dash/dashboard/hero";
export default function Dashboard() {
    return (
        <div className="flex flex-col gap-4">
            <Hero />
            <MainItems />
            <section className="w-full h-56 rounded-square overflow-hidden">
                <Image src={ad} alt="ad" className="h-full"/>
            </section>
        </div>
    )
}