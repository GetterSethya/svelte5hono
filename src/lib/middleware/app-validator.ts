import { zValidator } from '@hono/zod-validator'
import { appResponse } from '../core/response.js'
import type { ValidationTargets } from 'hono'
import type { ZodTypeDef } from 'zod'

export function appValidator<
	Target extends keyof ValidationTargets,
	Output = any,
	Def extends ZodTypeDef = ZodTypeDef,
	Input = Output,
>(target: Target, schema: Zod.Schema<Output, Def, Input>) {
	return zValidator(target, schema, (result, c) => {
		const { data, ...rest } = result
		if (!result.success) {
			return appResponse(c, 'invalid input', 400, { ...rest })
		}
	})
}
