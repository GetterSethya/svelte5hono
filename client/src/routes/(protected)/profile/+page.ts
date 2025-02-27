import { superValidate } from "sveltekit-superforms";
import type { PageLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { updateUserValidator } from "@root/lib/validator/user-validator";

export const load:PageLoad = async()=>{
    return {
        form:await superValidate(zod(updateUserValidator))
    }
}
