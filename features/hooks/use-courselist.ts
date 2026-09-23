import { useQuery } from "@tanstack/react-query";
import { getCourseList } from "../api/get-courseList";

export function useCourseList(category: string){
    return useQuery({
        queryFn: () => getCourseList(category),
        queryKey: ['courseList', category]
    })
}