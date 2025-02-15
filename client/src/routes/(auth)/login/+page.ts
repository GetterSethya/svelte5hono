import { loginValidator } from "@root/lib/validator/auth-validator"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

export const load = async()=>{
    return {
        form: await superValidate(zod(loginValidator))
    }
}
