import type { UserEntity } from "@root/lib/repository/user-repository";
import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";

export class LocalUser {
    static readonly key = Symbol("local-user")

    static setCtx(data:UserEntity|undefined){
        return setContext(this.key,writable(data))
    }

    static getCtx(){
        return getContext<ReturnType<typeof this.setCtx>>(this.key)
    }
}
