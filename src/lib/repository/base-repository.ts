import type { ContentfulStatusCode } from 'hono/utils/http-status'
import type { OrderQuery } from '../constant.js'

export interface AsyncBaseRepository<Model> {
	create(args: CreateArgs<Model>): Promise<Model>
	findById(args: FindByIdArgs): Promise<Model | null>
	list(args: ListArgs): Promise<ListReturn<Model>>
	update(args: UpdateArgs<Model>): Promise<Model>
	delete(args: DeleteArgs): Promise<boolean>
}

export type FindByUser = {
	userId: number
}

export type ListReturn<Model> = { items: Model[]; meta: { totalItems: number } }

export type CreateArgs<Model> = {
	item: Omit<Model, 'id' | 'created_at' | 'updated_at'>
}

export type FindByIdArgs = {
	id: number
	userId: number
}

export type ListArgs = {
	sort: string
	order: OrderQuery
	q: string
	limit: number
	page: number
	[key: string]: any
}


export type UpdateArgs<Model> = {
	id: number
	userId: number
	item: Partial<Omit<Model, 'id'>>
}

export type DeleteArgs = {
	id: number
	userId: number
}

export class ErrorRepository extends Error {
	status: ContentfulStatusCode
	constructor(message: string, status: ContentfulStatusCode) {
		super(message)
		this.status = status
	}
}
