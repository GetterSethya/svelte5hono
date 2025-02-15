import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export class ResponseError<Result extends unknown> extends Error {
    status:number;
    results:Result;

    constructor(status:number,results:Result,message:string){
        super(message)
        this.results=results
        this.status=status
    }
}
