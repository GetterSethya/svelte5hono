import { z } from 'zod'

export const registerValidator = z
	.object({
		email: z
			.string({ message: 'email is invalid' })
			.email({ message: 'email is invalid' }),
		name: z
			.string({ message: 'name cant be blank' })
			.min(1, { message: 'name cant be blank' }),
		password: z
			.string({ message: 'password cant be blank' })
			.min(8, { message: 'Password is too short' }),
		passwordConfirm: z
			.string({ message: 'password confirm cant be blank' })
			.min(8, { message: 'Password confirm is too short' }),
	})
	.refine(
		(ctx) => {
			if (ctx.password !== ctx.passwordConfirm) return false
			return true
		},
		{ message: 'confirm password is not valid', path: ['passwordConfirm'] }
	)

export const loginValidator = z.object({
	email: z
		.string({ message: 'email is invalid' })
		.email({ message: 'email is invalid' }),
	password: z
		.string({ message: 'password cant be blank' })
		.min(8, { message: 'Password is too short' }),
})

export const jwtRefreshValidator = z.object({
	refreshToken: z.string({ message: 'invalid refresh token' }),
})
