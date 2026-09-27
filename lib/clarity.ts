import Clarity from "@microsoft/clarity";

export function initClarity(){
    if (typeof window !== "undefined") {
        Clarity.init('yovm5d6npb')
    }
}