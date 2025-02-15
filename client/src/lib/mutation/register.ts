import type { Client } from "@/client";
import type { registerValidator } from "@root/lib/validator/auth-validator";
import { createMutation } from "@tanstack/svelte-query";
import type { z } from "zod";
import { ResponseError } from "$lib/utils"
import { toast } from "svelte-sonner"

export const registerMutation = (client:ReturnType<typeof Client.getCtx>)=>createMutation({
    mutationFn:async(data:z.infer<typeof registerValidator>)=>{
        const response = await client.authentication.register.$post({
            form: data
        })

        const resData = await response.json()

        if (response.status !== 201) {
            throw new ResponseError(
                response.status,
                null,
                resData.message??"Register Failed"
            )
            
        }

        if (!resData.result) {
            throw new ResponseError(
                response.status,
                resData.result,
                resData.message??"Register Failed"
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
