import { superValidate } from "sveltekit-superforms";
import type { PageLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { applicationValidator } from "@root/lib/validator/application-validator"

export const load:PageLoad = async()=>{
    return {
        form: await superValidate(zod(applicationValidator))
    }
}
