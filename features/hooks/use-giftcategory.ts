import { useQuery } from "@tanstack/react-query";
import { getGiftCat } from "../api/get-giftcategory";

export function useGetGiftCategory(){
    return useQuery({
        queryKey: ['giftCategory'],
        queryFn: getGiftCat
    })
}