import * as Jose from "jose"
import { AuthenticationError } from "./utils"
import { Client } from "./client"
import { goto } from "$app/navigation"

export type GetNewJWTArgs = {
    onFailed: () => void
}

export class JWT {
    public static ACCESS_TOKEN = "access_token"
    public static REFRESH_TOKEN = "refresh_token"

    
    public static get access()  {
        return localStorage.getItem(JWT.ACCESS_TOKEN)
    }

    public static get refresh()  {
        return localStorage.getItem(JWT.REFRESH_TOKEN)
    }
    
    public validateRefresh(){
        if (!JWT.refresh) return null

        const decodedRefresh = Jose.decodeJwt(JWT.refresh)
        if (!decodedRefresh.exp) return null

        return decodedRefresh.exp > Date.now() / 1000
    }

    public validateAccess(){
        if (!JWT.access) return null
        const decodedAccess = Jose.decodeJwt(JWT.access)
        if (!decodedAccess.exp) return null

        return decodedAccess.exp > Date.now() / 1000
    }

    public async getNewJWT(args?:Partial<GetNewJWTArgs>){
        if (!JWT.refresh) throw new AuthenticationError("invalid/missing refresh token")

        const response = await Client.value.authentication.refresh.$post({
            form:{
                refreshToken: JWT.refresh
            }
        },
            {
                init:{headers:{Authorization:JWT.access!}}
            })

        const {result} = await response.json()

        if (response.status !== 200 || !result) {
            localStorage.removeItem(JWT.ACCESS_TOKEN)
            localStorage.removeItem(JWT.REFRESH_TOKEN)
            if (args?.onFailed) {
                args.onFailed()
                goto("/login")
            }

            throw new AuthenticationError("invalid token")
        }

        localStorage.setItem(JWT.ACCESS_TOKEN, result.access_token)
        localStorage.setItem(JWT.REFRESH_TOKEN, result.refresh_token)
    } 
}


