import { Hono } from 'hono'
import { jwtMiddleware } from '../middleware/jwt.js'
import { appValidator } from '../middleware/app-validator.js'
import { companyValidator } from '../validator/company-validator.js'
import { appResponse } from '../core/response.js'
import { ErrorRepository } from '../repository/base-repository.js'
import { idValidator, queryUrlValidator } from '../validator/path-validator.js'
import { repositoryMiddleware } from '../middleware/repository.js'

export const companyController = new Hono()
	//
	.use('*', jwtMiddleware)
	.use('*', repositoryMiddleware)
	.post('/', appValidator('form', companyValidator), async (c) => {
		const form = c.req.valid('form')
		const user = c.get('user')
		const companyRepo = c.get('companyRepo')

		const company = await companyRepo.create({
			item: {
				...form,
				address: form.address || null,
				user: user.id,
			},
		})

		return appResponse(c, 'success', 201, company)
	})
	.get('/id/:id', appValidator('param', idValidator), async (c) => {
		const params = c.req.valid('param')
		const user = c.get('user')
		const companyRepo = c.get('companyRepo')

		const company = await companyRepo.findById({ id: params.id, userId: user.id })
		if (!company) return appResponse(c, 'not found', 404, null)
		return appResponse(c, 'success', 200, company)
	})
	.get('/', appValidator('query', queryUrlValidator), async (c) => {
		const { sort, order, page, limit, q } = c.req.valid('query')
		const user = c.get('user')
		const companyRepo = c.get('companyRepo')

		const companies = await companyRepo.list({
			limit,
			page,
			order,
			sort,
			q,
			userId: user.id,
		})

		return appResponse(c, 'success', 200, companies)
	})
	.patch('/id/:id', appValidator('param', idValidator), appValidator('form', companyValidator), async (c) => {
		const params = c.req.valid('param')
		const form = c.req.valid('form')
		const user = c.get('user')
		const companyRepo = c.get('companyRepo')

		const updated = await companyRepo.update({ id: params.id, userId: user.id, item: form })
		return appResponse(c, 'success', 200, updated)
	})
	.delete('/id/:id', appValidator('param', idValidator), async (c) => {
		const params = c.req.valid('param')
		const user = c.get('user')
		const companyRepo = c.get('companyRepo')

		const deleted = await companyRepo.delete({ userId: user.id, id: params.id })
		return appResponse(c, 'success', 200, deleted)
	})
	.onError((err, c) => {
		if (err instanceof ErrorRepository) {
			return appResponse(c, err.message, err.status, null)
		}

		return appResponse(c, 'Something went wrong', 500, null)
	})
