import { page } from "$app/state";

export class SearchParams { 
    searchParams = () => new URLSearchParams(page.url.searchParams)
    
    public get page()  {
        return Number(this.searchParams().get("page")||"1")
    }

    public get limit()  {
        return Number(this.searchParams().get("limit")||"10")
    }

    public get sort()  {
        return this.searchParams().get("sort")||"created_at"
    }

    public get order()  {
        return this.searchParams().get("order")||"DESC"
    }

    public get search()  {
        return this.searchParams().get("q")||""
    }
    
}
