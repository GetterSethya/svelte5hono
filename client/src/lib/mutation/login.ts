import type { Client } from "@/client"
import { ResponseError } from "@/utils"
import type { loginValidator } from "@root/lib/validator/auth-validator"
import { createMutation } from "@tanstack/svelte-query"
import { toast } from "svelte-sonner"
import type { z } from "zod"

export const loginMutation = (client:ReturnType<typeof Client.getCtx>)=>createMutation({
    mutationFn:async(data:z.infer<typeof loginValidator>)=>{
        const response = await client.authentication.login.$post({
            form: data
        },)

        const resData = await response.json()

        if (response.status !== 200) {
            throw new ResponseError(
                response.status,
                null,
                resData.message??"Login Failed"
            )
            
        }

        if (!resData.result) {
            throw new ResponseError(
                response.status,
                resData.result,
                resData.message??"Login Failed"
            )
            
        }

        return resData.result
    },
    onError: (error)=>{
        if (error instanceof ResponseError) {
            toast.error(error.message)
            return
        }
        toast.error("something went wrong")
    }
})
