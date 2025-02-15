import { ACCESS_TOKEN } from "@/constant";
import type { LayoutLoad } from "./$types";
import { goto } from "$app/navigation";
import { Client } from "@/client";

export const load:LayoutLoad = async()=>{
    const accessToken = localStorage.getItem(ACCESS_TOKEN)
    if (!accessToken) {
        goto("/login")
        return
    }

    const currentUser = await Client.value.user.current_user.$get(undefined,{
        init:{headers:{Authorization:accessToken}}
    })

    const resData = await currentUser.json()
    if (!resData || !resData.result) return

    return {
        user:resData.result
    }
}
