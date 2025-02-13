import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export function appResponse<T>(
	c: Context,
	message: string,
	status: ContentfulStatusCode,
	result: T
) {
	return c.json({ message, result }, status)
}
