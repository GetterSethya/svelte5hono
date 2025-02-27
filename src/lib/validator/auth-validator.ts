import { z } from 'zod'

export const registerValidator = z
	.object({
		email: z.string({ message: 'email is invalid' }).email({ message: 'email is invalid' }),
		name: z.string({ message: 'name cant be blank' }).min(1, { message: 'name cant be blank' }),
		password: z.string({ message: 'password cant be blank' }).min(8, { message: 'password is too short' }),
		passwordConfirm: z
			.string({ message: 'password confirm cant be blank' })
			.min(8, { message: 'password confirm is too short' }),
	})
	.refine(
		(ctx) => {
			if (ctx.password !== ctx.passwordConfirm) return false
			return true
		},
		{ message: 'confirm password is not valid', path: ['passwordConfirm'] }
	)

export const loginValidator = z.object({
	email: z.string({ message: 'email is invalid' }).email({ message: 'email is invalid' }),
	password: z.string({ message: 'password cant be blank' }).min(8, { message: 'password is too short' }),
})

export const jwtRefreshValidator = z.object({
	refreshToken: z.string({ message: 'invalid refresh token' }),
})

export const updatePasswordValidator = z
	.object({
		//
		newPassword: z
			.string({ message: 'New password cant be blank' })
			.min(8, { message: 'New password is too short' }),
		currentPassword: z
			.string({ message: 'Current password cant be blank' })
			.min(8, { message: 'Current password is too short' }),
		passwordConfirm: z
			.string({ message: 'Confirm password cant be blank' })
			.min(8, { message: 'Confirm password is too short' }),
	})
	.refine((ctx) => ctx.newPassword !== ctx.currentPassword, {
		message: 'New password must be different from the current password',
		path: ['newPassword'],
	})
	.refine((ctx) => ctx.newPassword ===ctx.passwordConfirm, {
		message: 'Confirm password must match the new password',
		path: ['passwordConfirm'],
	})
