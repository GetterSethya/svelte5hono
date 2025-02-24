import { type ClassValue, clsx } from 'clsx';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export class ResponseError<Result extends unknown> extends Error {
	status: number;
	results: Result;

	constructor(status: number, results: Result, message: string) {
		super(message);
		this.results = results;
		this.status = status;
	}
}

export class AuthenticationError extends Error {}

export type FlyAndScaleParams= {
    y:number,
    x:number,
    start:number,
    duration:number
}

export const flyAndScale = (node:Element, params:FlyAndScaleParams={
    y:-8,
    x:0,
    start:0.95,
    duration:150
}):TransitionConfig=>{

    const style = getComputedStyle(node)
    const transform = style.transform === "none"?'':style.transform

    const scaleConversion = (valueA:number,scaleA:[number,number], scaleB:[number,number])=>{
        const [minA, maxA] = scaleA
        const [minB,maxB] = scaleB

        const percentage = (valueA-minA)/(maxA - minA)
        const valueB = percentage * (maxB-minB) + minB
        return valueB
    }

    const styleToString = (style:Record<string,number|string|undefined>)=>{
        return Object.keys(style).reduce((str,key)=>{
            if (style[key] === undefined) return str
            return str+`${key}:${style[key]};`
        },"")
    }

    return {
        duration:params.duration??200,
        delay:0,
        css:(t)=>{
            const y = scaleConversion(t,[0,1],[params.y ?? 20, 0])
            const x = scaleConversion(t,[0,1],[params.x ?? 0, 0])
            const scale = scaleConversion(t,[0,1],[params.start??0.95,1])

            return styleToString({
                transform:`${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                opacity: t
            })
        },
        easing:cubicOut
    }

}

export const idDateFormat = Intl.DateTimeFormat("id-ID",{
    dateStyle: "short"
})

export const idTimeFormat = Intl.DateTimeFormat("id-ID",{
    hour12: false,
    timeStyle: "medium"
})

export const idDateTimeFormat = Intl.DateTimeFormat("id-ID",{
    hour12: false,
    timeStyle: "long",
    dateStyle: "medium"
})
