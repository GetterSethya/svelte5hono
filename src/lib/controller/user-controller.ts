import { Hono } from 'hono'
import { z } from 'zod'
import { appValidator } from '../middleware/app-validator.js'
import { appResponse } from '../core/response.js'
import { jwtMiddleware } from '../middleware/jwt.js'
import { ErrorRepository } from '../repository/base-repository.js'
import { repositoryMiddleware } from '../middleware/repository.js'

const idSchema = z.object({
	id: z.coerce.number({ message: 'invalid path parameter' }),
})

export const userController = new Hono()
	//
	.use('*', jwtMiddleware)
	.use('*', repositoryMiddleware)
	.get('/id/:id', appValidator('param', idSchema), async (c) => {
		const userRepo = c.get('userRepo')
		const params = c.req.valid('param')
		const user = await userRepo.findById({ id: params.id })
		return appResponse(c, 'success', 200, user)
	})
	.get('/current_user', async (c) => {
		const user = c.get('user')
		return appResponse(c, 'success', 200, user)
	})
	.onError((error, c) => {
		console.error(error)
		if (error instanceof ErrorRepository) {
			return appResponse(c, error.message, error.status, null)
		}

		return appResponse(c, 'something went wrong', 500, null)
	})
