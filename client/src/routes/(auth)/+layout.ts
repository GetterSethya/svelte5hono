import { ACCESS_TOKEN } from "@/constant";
import type { LayoutLoad } from "./$types";
import { goto } from "$app/navigation";

export const load:LayoutLoad = async()=>{
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    if (accessToken) {
        goto("/")
        return
    }
}
