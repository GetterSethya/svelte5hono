import { Hono } from 'hono'
import { jwtMiddleware } from '../middleware/jwt.js'
import { repositoryMiddleware } from '../middleware/repository.js'
import { appValidator } from '../middleware/app-validator.js'
import { applicationValidator } from '../validator/application-validator.js'
import { idValidator, queryUrlValidator } from '../validator/path-validator.js'
import { ErrorRepository } from '../repository/base-repository.js'
import { appResponse } from '../core/response.js'

export const applicationController = new Hono()
	//
	.use('*', jwtMiddleware)
	.use('*', repositoryMiddleware)
	.post('/', appValidator('form', applicationValidator), async (c) => {
		const form = c.req.valid('form')
		const user = c.get('user')
		const applicationRepo = c.get('applicationRepo')
		const application = await applicationRepo.create({
			item: {
				...form,
				user: user.id,
			},
		})

		return appResponse(c, 'success', 201, application)
	})
	.get('/', appValidator('query', queryUrlValidator), async (c) => {
		const { limit, page, q, sort, order } = c.req.valid('query')
		const user = c.get('user')
		const applicationRepo = c.get('applicationRepo')
		const applications = await applicationRepo.list({ order, sort, limit, q, page, user: user.id })
		return appResponse(c, 'success', 200, applications)
	})
	.patch('/id/:id', appValidator('param', idValidator), appValidator('form', applicationValidator), async (c) => {
		const user = c.get('user')
		const applicationRepo = c.get('applicationRepo')
		const form = c.req.valid('form')
		const params = c.req.valid('param')
		const updated = await applicationRepo.update({ id: params.id, userId: user.id, item: form })
		return appResponse(c, 'success', 200, updated)
	})
	.delete('/id/:id', appValidator('param', idValidator), async (c) => {
		const user = c.get('user')
		const applicationRepo = c.get('applicationRepo')
		const params = c.req.valid('param')
		const deleted = await applicationRepo.delete({ id: params.id, userId: user.id })
		return appResponse(c, 'deleted', 200, deleted)
	})
	.get('/id/:id', appValidator('param', idValidator), async (c) => {
		const user = c.get('user')
		const applicationRepo = c.get('applicationRepo')
		const params = c.req.valid('param')
		const application = await applicationRepo.findById({ id: params.id, userId: user.id })
		return appResponse(c, 'success', 200, application)
	})
	.onError((error, c) => {
		console.error(error)
		if (error instanceof ErrorRepository) {
			return appResponse(c, error.message, error.status, null)
		}

		return appResponse(c, 'something went wrong', 500, null)
	})
