import { env } from 'hono/adapter'
import type { ENV } from '../core/types.js'
import { JWT } from '../core/jwt.js'
import { appResponse } from '../core/response.js'
import { createMiddleware } from 'hono/factory'
import { UserRepository, type UserEntity } from '../repository/user-repository.js'

type JWTMiddleware = {
	Variables: {
		user: UserEntity
	}
}

export const jwtMiddleware = createMiddleware<JWTMiddleware>(async (c, next) => {
	const method = c.req.method.toLowerCase()
	if (method === 'options') {
		await next()
		return
	}

	const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = env<ENV>(c)
	const jwt = new JWT(JWT_ACCESS_SECRET, JWT_REFRESH_SECRET)
	const authHeader = c.req.header('Authorization') || ''
	const validAccess = await jwt.validateAccess(authHeader)
	const userId = parseInt(validAccess?.payload.sub || '')

	if (validAccess && !Number.isNaN(userId)) {
		const user = await new UserRepository().findById({ id: userId })
		if (!user) throw new Error('user jwt invalid')

		c.set('user', user)
		await next()
	} else {
		c.res = appResponse(c, 'unauthorize', 401, null)
	}
})
