import { eq } from 'drizzle-orm'
import { userTable, type User } from '../db/schema.js'
import { db } from '../drizzle.js'
import {
	ErrorRepository,
	type AsyncBaseRepository,
	type DeleteArgs,
	type FindByIdArgs,
	type UpdateArgs,
} from './base-repository.js'
import { JWT } from '../core/jwt.js'

export interface UserEntity extends User {}

export class UserRepository
	implements Omit<AsyncBaseRepository<UserEntity>, 'create' | 'list'>
{
	async findByToken(accessToken: string) {
		try {
			const jwtClaims = JWT.decode(accessToken)
			const userId = jwtClaims.sub
			if (!userId)
				throw new ErrorRepository('invalid/missing user id', 400)

			return await this.findById({ id: Number(userId) })
		} catch (error) {
			console.error(error)
			return null
		}
	}

	async findById(
		args: Omit<FindByIdArgs, 'userId'>
	): Promise<UserEntity | null> {
		const user = await db
			.select()
			.from(userTable)
			.where(eq(userTable.id, args.id))
			.limit(1)

		if (user.length === 0) return null

		return user[0]
	}

	async update(args: UpdateArgs<UserEntity>): Promise<UserEntity> {
		const [user] = await db
			.update(userTable)
			.set({ ...args.item })
			.where(eq(userTable.id, args.id))
			.returning()

		return user
	}

	async delete(args: DeleteArgs): Promise<boolean> {
		try {
			await db.delete(userTable).where(eq(userTable.id, args.id))
			return true
		} catch (error) {
			return false
		}
	}
}
