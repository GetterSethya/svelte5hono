import { superValidate } from "sveltekit-superforms";
import type { PageLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { updatePasswordValidator } from "@root/lib/validator/auth-validator";

export const load :PageLoad =async()=>{
    return {
        form:await superValidate(zod(updatePasswordValidator))
    }
}
