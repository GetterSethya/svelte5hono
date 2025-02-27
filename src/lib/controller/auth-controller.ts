import { Hono } from 'hono'
import { appValidator } from '../middleware/app-validator.js'
import {
	jwtRefreshValidator,
	loginValidator,
	registerValidator,
	updatePasswordValidator,
} from '../validator/auth-validator.js'
import { appResponse } from '../core/response.js'
import { ErrorRepository } from '../repository/base-repository.js'
import { env } from 'hono/adapter'
import type { ENV } from '../core/types.js'
import { JWT } from '../core/jwt.js'
import { z } from 'zod'
import { jwtMiddleware } from '../middleware/jwt.js'
import { repositoryMiddleware } from '../middleware/repository.js'
import { hash, verify } from '@node-rs/argon2'

export const authController = new Hono()
	//
	.use('*', repositoryMiddleware)
	.patch('/password', jwtMiddleware, appValidator('form', updatePasswordValidator), async (c) => {
		const authRepo = c.get('authRepo')
		const user = c.get('user')
		const form = c.req.valid('form')

		const currentAuth = await authRepo.findByUser({ userId: user.id })
		if (!currentAuth) return appResponse(c, 'user password is wrong/invalid', 400, null)

		const validCurrentPassword = await verify(currentAuth.hash_password, form.currentPassword)
		if (!validCurrentPassword) return appResponse(c, 'user password is wrong/invalid', 400, null)

		const newPasswordHash = await hash(form.newPassword)
		await authRepo.update({ id: currentAuth.id, item: { hash_password: newPasswordHash }, userId: user.id })
		return appResponse(c, 'success', 200, true)
	})
	.post('/register', appValidator('form', registerValidator), async (c) => {
		const form = c.req.valid('form')
		const authRepo = c.get('authRepo')
		const newUser = await authRepo.register(form)
		return appResponse(c, 'success', 201, newUser)
	})
	.post('/login', appValidator('form', loginValidator), async (c) => {
		const form = c.req.valid('form')
		const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = env<ENV>(c)
		const { accessToken, refreshToken } = await c.get('authRepo').login({
			email: form.email,
			password: form.password,
			accessSecret: JWT_ACCESS_SECRET,
			refreshSecret: JWT_REFRESH_SECRET,
		})

		return appResponse(c, 'success', 200, {
			access_token: accessToken,
			refresh_token: refreshToken,
		})
	})
	.post('/refresh', appValidator('form', jwtRefreshValidator), async (c) => {
		const form = c.req.valid('form')
		const authRepo = c.get('authRepo')
		const jwtClaims = JWT.decode(form.refreshToken)
		if (!jwtClaims.sub) return appResponse(c, 'invalid refresh token', 400, null)

		const userId = z.coerce.number().parse(jwtClaims.sub)
		const auth = await authRepo.findByUser({ userId })
		if (!auth) return appResponse(c, 'invalid refresh token', 400, null)

		if (auth.refresh_token === form.refreshToken) {
			const { JWT_REFRESH_SECRET, JWT_ACCESS_SECRET } = env<ENV>(c)
			const jwt = new JWT(JWT_ACCESS_SECRET, JWT_REFRESH_SECRET)
			const accessToken = await jwt.createAccess(userId)
			const refreshToken = await jwt.createRefresh(userId)

			await authRepo.update({
				id: auth.id,
				userId,
				item: { ...auth, refresh_token: refreshToken },
			})

			return appResponse(c, 'success', 200, {
				access_token: accessToken,
				refresh_token: refreshToken,
			})
		}

		return appResponse(c, 'invalid refresh token', 400, null)
	})
	.post('/logout', jwtMiddleware, async (c) => {
		const user = c.get('user')
		const authRepo = c.get('authRepo')
		const auth = await authRepo.findByUser({ userId: user.id })
		if (!auth) return appResponse(c, 'not found', 404, null)

		await authRepo.update({
			id: auth.id,
			userId: user.id,
			item: { ...auth, refresh_token: null },
		})

		return appResponse(c, 'success', 200, null)
	})
	.onError((error, c) => {
		console.error(error)
		if (error instanceof ErrorRepository) {
			return appResponse(c, error.message, error.status, null)
		}

		return appResponse(c, 'something went wrong', 500, null)
	})
