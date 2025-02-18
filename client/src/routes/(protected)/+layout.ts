import type { LayoutLoad } from "./$types";
import { goto } from "$app/navigation";
import { Client } from "@/client";
import { JWT } from "@/jwt";
import { appFetch } from "@/appFetch";

export const load:LayoutLoad = async({fetch})=>{
    const accessToken = localStorage.getItem(JWT.ACCESS_TOKEN)
    if (!accessToken) {
        goto("/login")
        return
    }

    const currentUser = await Client.value.user.current_user.$get(undefined,{
        init:{headers:{Authorization:accessToken}},
        fetch:(input:URL|RequestInfo,init?:RequestInit|undefined)=> appFetch(input,init,fetch)
    })

    const resData = await currentUser.json()
    if (!resData || !resData.result) return

    return {
        user:resData.result
    }
}
