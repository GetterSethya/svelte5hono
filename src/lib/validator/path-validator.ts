import { z } from 'zod'
import { LIMIT, ORDER, SORT, type OrderQuery } from '../constant.js'

export const idValidator = z.object({
	id: z.coerce.number(),
})

export const queryUrlValidator = z.object({
	q: z.string().default(''),
	page: z.coerce.number().default(1),
	limit: z.coerce.number().default(LIMIT),
	sort: z.string().default(SORT),
	order: z
		.string()
		.default(ORDER)
		.transform((d) => d as OrderQuery),
})
