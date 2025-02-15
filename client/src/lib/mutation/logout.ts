import type { Client } from "@/client";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constant";
import { createMutation } from "@tanstack/svelte-query";

export const logoutMutation = (client:ReturnType<typeof Client.getCtx>)=>createMutation({
mutationFn:async(args?:undefined)=>{
        const response = await client.authentication.logout.$post(undefined,{
            init:{headers:{Authorization:localStorage.getItem(ACCESS_TOKEN)!}}
        })
        localStorage.removeItem(ACCESS_TOKEN)
        localStorage.removeItem(REFRESH_TOKEN)

        return response.json()
    }
})
