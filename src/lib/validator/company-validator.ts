import { z } from 'zod'

export const companyValidator = z.object({
	name: z.string({ message: 'Company name cant be blank' }).min(1, { message: 'Company name cant be blank' }),
	address: z.string().optional().nullable(),
})
