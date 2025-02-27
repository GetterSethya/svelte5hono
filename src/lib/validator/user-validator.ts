import { z } from 'zod'

export const updateUserValidator = z.object({
	name: z.string({ message: 'Name cant be blank' }).min(1, { message: 'Name cant be blank' }),
})
