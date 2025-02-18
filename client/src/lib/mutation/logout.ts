import type { Client } from "@/client";
import { JWT } from "@/jwt";
import { createMutation } from "@tanstack/svelte-query";

export const logoutMutation = (client:ReturnType<typeof Client.getCtx>)=>createMutation({
mutationFn:async(args?:undefined)=>{
        const response = await client.authentication.logout.$post(undefined,{
            init:{headers:{Authorization:localStorage.getItem(JWT.ACCESS_TOKEN)!}}
        })
        localStorage.removeItem(JWT.ACCESS_TOKEN)
        localStorage.removeItem(JWT.REFRESH_TOKEN)

        return response.json()
    }
})
