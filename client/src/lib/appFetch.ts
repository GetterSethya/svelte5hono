import { goto } from "$app/navigation";
import { JWT } from "./jwt";
import { AuthenticationError } from "./utils";

export async function appFetch(input:URL|RequestInfo, init?:RequestInit|undefined, fetcher?:typeof fetch){
    const jwt = new JWT()
    console.log("run appfetch")

    if (!jwt.validateAccess()) {
        console.log("token tidak validm, mecoba refresh")
        if (!jwt.validateRefresh()) {
            localStorage.removeItem(JWT.ACCESS_TOKEN)
            localStorage.removeItem(JWT.REFRESH_TOKEN)
            goto("/login")

            throw new AuthenticationError("invalid jwt token")
        }

        await jwt.getNewJWT()

        if (!init) init= {}
        if (!init.headers) init.headers = new Headers()


        if (!JWT.access) throw new AuthenticationError("invalid token")

        const newHeader = new Headers(init.headers)
        newHeader.set("Authorization",JWT.access)
        init.headers = newHeader
        return fetcher?await fetcher(input,init): await fetch(input,init)
    }


    console.log("access token ok")
    return fetcher? await fetcher(input,init): await fetch(input, init)
}
