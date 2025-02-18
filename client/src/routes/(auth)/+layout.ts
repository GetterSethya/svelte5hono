import type { LayoutLoad } from "./$types";
import { goto } from "$app/navigation";
import { JWT } from "@/jwt";

export const load:LayoutLoad = async()=>{
    const accessToken = localStorage.getItem(JWT.ACCESS_TOKEN)
    if (accessToken) {
        goto("/")
        return
    }
}
