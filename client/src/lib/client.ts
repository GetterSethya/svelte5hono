import { hc } from "hono/client"
import type{ authController} from"@root/lib/controller/auth-controller"
import type{ userController} from"@root/lib/controller/user-controller"
import { getContext, setContext } from "svelte"

export class Client {
    static readonly key = Symbol('client')
    static readonly value = {
        user:hc<typeof userController>("/api/user"),
        authentication:hc<typeof authController>("/api/auth")
    }

    static setCtx(){
        return setContext(Client.key,Client.value)
    }

    static getCtx(){
        return getContext<ReturnType<typeof this.setCtx>>(Client.key)
    }

}
