import { and, eq } from 'drizzle-orm'
import { authTable, userTable, type Authentication } from '../db/schema.js'
import { db } from '../drizzle.js'
import {
	ErrorRepository,
	type AsyncBaseRepository,
	type CreateArgs,
	type DeleteArgs,
	type FindByIdArgs,
	type FindByUser,
	type UpdateArgs,
} from './base-repository.js'
import type { z } from 'zod'
import type { registerValidator } from '../validator/auth-validator.js'
import { hash, verify } from '@node-rs/argon2'
import { JWT } from '../core/jwt.js'

export interface AuthEntity extends Authentication {}

export type LoginArgs = {
	email: string
	password: string
	accessSecret: string
	refreshSecret: string
}

export type RegisterArgs = Omit<
	z.infer<typeof registerValidator>,
	'passwordConfirm'
>

export class AuthenticationRepository
	implements Omit<AsyncBaseRepository<AuthEntity>, 'list'>
{
	async register(args: RegisterArgs) {
		const registerTx = await db.transaction(async (tx) => {
			// cek apakah email sudah digunakan
			const existingUser = await tx
				.select()
				.from(userTable)
				.where(eq(userTable.email, args.email))

			if (existingUser.length > 0)
				throw new ErrorRepository('email already used', 400)

			// create hash password
			const hashPassword = await hash(args.password)

			// create user
			const user = await tx
				.insert(userTable)
				.values({ name: args.name, email: args.email })
				.returning()

			if (user.length === 0)
				throw new ErrorRepository(
					'failed registering user, something went wrong',
					500
				)

			const auth = await tx
				.insert(authTable)
				.values({ user: user[0].id, hash_password: hashPassword })
				.returning()

			if (auth.length === 0)
				throw new ErrorRepository(
					'failed registering user, something went wrong',
					500
				)

			return user[0]
		})

		return registerTx
	}

	async login(args: LoginArgs) {
		const loginTx = await db.transaction(async (tx) => {
			const user = await tx
				.select()
				.from(userTable)
				.where(eq(userTable.email, args.email))
				.limit(1)
			if (user.length === 0)
				throw new ErrorRepository('email/password is wrong', 400)

			const auth = await tx
				.select()
				.from(authTable)
				.where(eq(authTable.user, user[0].id))
				.limit(1)
			if (auth.length === 0)
				throw new ErrorRepository('email/password is wrong', 400)

			// validate password
			const validPassword = await verify(
				auth[0].hash_password,
				args.password
			)

			if (!validPassword)
				throw new ErrorRepository('email/password is wrong', 500)

			// semua sudah valid

			const jwt = new JWT(args.accessSecret, args.refreshSecret)
			const accessToken = await jwt.createAccess(user[0].id)
			const refreshToken = await jwt.createRefresh(user[0].id)

			const updatedAuth = await tx
				.update(authTable)
				.set({ refresh_token: refreshToken })
				.returning()

			if (updatedAuth.length === 0)
				throw new ErrorRepository('something went wrong', 500)

			return { accessToken, refreshToken }
		})

		return loginTx
	}

	async findByUser(args: FindByUser) {
		const auth = await db
			.select()
			.from(authTable)
			.where(eq(authTable.user, args.userId))
			.limit(1)
		if (auth.length === 0) return null

		return auth[0]
	}

	async create(args: CreateArgs<AuthEntity>): Promise<AuthEntity> {
		const [auth] = await db
			.insert(authTable)
			.values({ ...args.item })
			.returning()
		return auth
	}

	async findById(args: FindByIdArgs): Promise<AuthEntity | null> {
		const auth = await db
			.select()
			.from(authTable)
			.where(
				and(
					//
					eq(authTable.id, args.id),
					eq(authTable.user, args.userId)
				)
			)
			.limit(1)

		if (auth.length === 0) return null

		return auth[0]
	}

	async update(args: UpdateArgs<AuthEntity>): Promise<AuthEntity> {
		const [updated] = await db
			.update(authTable)
			.set({ ...args.item })
			.where(
				and(
					//
					eq(authTable.id, args.id),
					eq(authTable.user, args.userId)
				)
			)
			.returning()

		return updated
	}

	async delete(args: DeleteArgs): Promise<boolean> {
		try {
			await db.delete(authTable).where(
				and(
					//
					eq(authTable.id, args.id),
					eq(authTable.user, args.userId)
				)
			)
			return true
		} catch (error) {
			console.error(error)
			return false
		}
	}
}
