import { Hono } from 'hono'
import { UserRepository } from '../repository/user-repository.js'
import { z } from 'zod'
import { appValidator } from '../middleware/app-validator.js'
import { appResponse } from '../core/response.js'
import { jwtMiddleware } from '../middleware/jwt.js'

const idSchema = z.object({
	id: z.coerce.number({ message: 'invalid path parameter' }),
})

export const userController = new Hono()
	//
	.use('*', jwtMiddleware)
	.get('/id/:id', appValidator('param', idSchema), async (c) => {
		const userRepo = new UserRepository()
		const params = c.req.valid('param')
		const user = await userRepo.findById({ id: params.id })
		return appResponse(c, 'success', 200, user)
	})
	.get('/current_user', async (c) => {
		const accessToken = c.req.header('Authorization')!
		const userRepo = new UserRepository()
		try {
			const user = await userRepo.findByToken(accessToken)
			return appResponse(c, 'success', 200, user)
		} catch (error) {
			console.error(error)
			return appResponse(c, 'something went wrong', 500, null)
		}
	})
