import type { Context } from 'hono'
import { env } from 'hono/adapter'
import type { BlankEnv, Next } from 'hono/types'
import type { ENV } from '../core/types.js'
import { JWT } from '../core/jwt.js'
import { appResponse } from '../core/response.js'

export const jwtMiddleware = async (
	c: Context<BlankEnv, '*', {}>,
	next: Next
) => {
	const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = env<ENV>(c)
	const jwt = new JWT(JWT_ACCESS_SECRET, JWT_REFRESH_SECRET)
	const valid = await jwt.validateAccess(c.req.header('Authorization') || '')

	if (valid) {
		await next()
	} else {
		c.res = appResponse(c, 'unauthorize', 401, null)
	}
}
