import { z } from 'zod'
import { APPLICATION_STATUS_KEY } from '../constant.js'

export const applicationValidator = z.object({
	company: z.coerce.number({ message: 'invalid company id' }).positive({ message: 'invalid company id' }),
	position: z.string({ message: 'position cant be blank' }).min(1, { message: 'position cant be blank' }),
	status: z.enum(APPLICATION_STATUS_KEY).default('sent'),
	notes: z.string({ message: 'invalid notes type' }),
})
