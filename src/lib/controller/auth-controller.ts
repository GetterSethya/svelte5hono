import { Hono } from 'hono'
import { appValidator } from '../middleware/app-validator.js'
import {
	jwtRefreshValidator,
	loginValidator,
	registerValidator,
} from '../validator/auth-validator.js'
import { AuthenticationRepository } from '../repository/auth-repository.js'
import { appResponse } from '../core/response.js'
import { ErrorRepository } from '../repository/base-repository.js'
import { env } from 'hono/adapter'
import type { ENV } from '../core/types.js'
import { JWT } from '../core/jwt.js'
import { z } from 'zod'
import { jwtMiddleware } from '../middleware/jwt.js'
import { UserRepository } from '../repository/user-repository.js'

const authRepo = new AuthenticationRepository()
export const authController = new Hono()
	//
	.post('/register', appValidator('form', registerValidator), async (c) => {
		const form = c.req.valid('form')
		try {
			const newUser = await authRepo.register(form)
			return appResponse(c, 'success', 201, newUser)
		} catch (error) {
			console.error(error)
			if (error instanceof ErrorRepository) {
				return appResponse(c, error.message, error.status, null)
			}

			return appResponse(c, 'something went wrong', 500, null)
		}
	})
	.post('/login', appValidator('form', loginValidator), async (c) => {
		const form = c.req.valid('form')
		try {
			const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = env<ENV>(c)
			const { accessToken, refreshToken } = await authRepo.login({
				email: form.email,
				password: form.password,
				accessSecret: JWT_ACCESS_SECRET,
				refreshSecret: JWT_REFRESH_SECRET,
			})

			return appResponse(c, 'success', 200, {
				access_token: accessToken,
				refresh_token: refreshToken,
			})
		} catch (error) {
			console.error(error)

			if (error instanceof ErrorRepository) {
				return appResponse(c, error.message, error.status, null)
			}

			return appResponse(c, 'something went wrong', 500, null)
		}
	})
	.post(
		'/refresh',
		jwtMiddleware,
		appValidator('form', jwtRefreshValidator),
		async (c) => {
			const form = c.req.valid('form')
			try {
				const jwtClaims = JWT.decode(form.refreshToken)
				if (!jwtClaims.sub)
					return appResponse(c, 'invalid refresh token', 400, null)

				const userId = z.coerce.number().parse(jwtClaims.sub)
				const auth = await authRepo.findByUser({ userId })
				if (!auth)
					return appResponse(c, 'invalid refresh token', 400, null)

				if (auth.refresh_token === form.refreshToken) {
					const { JWT_REFRESH_SECRET, JWT_ACCESS_SECRET } =
						env<ENV>(c)
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
			} catch (error) {
				console.error(error)
				if (error instanceof ErrorRepository) {
					return appResponse(c, error.message, error.status, null)
				}

				return appResponse(c, 'something went wrong', 500, null)
			}
		}
	)
	.post('/logout', jwtMiddleware, async (c) => {
		const userRepo = new UserRepository()
		try {
			const user = await userRepo.findByToken(
				c.req.header('Authorization') || ''
			)
			if (!user) return appResponse(c, 'not found', 404, null)

			const auth = await authRepo.findByUser({ userId: user.id })
			if (!auth) return appResponse(c, 'not found', 404, null)

			await authRepo.update({
				id: auth.id,
				userId: user.id,
				item: { ...auth, refresh_token: null },
			})

			return appResponse(c, 'success', 200, null)
		} catch (error) {
			console.error(error)
			if (error instanceof ErrorRepository) {
				return appResponse(c, error.message, error.status, null)
			}

			return appResponse(c, 'something went wrong', 500, null)
		}
	})
