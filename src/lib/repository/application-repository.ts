import { and, asc, count, desc, eq, like, type AnyColumn } from 'drizzle-orm'
import { applicationTable, companyTable, userTable, type Application } from '../db/schema.js'
import { db } from '../drizzle.js'
import type {
	AsyncBaseRepository,
	CreateArgs,
	DeleteArgs,
	FindByIdArgs,
	ListArgs,
	UpdateArgs,
} from './base-repository.js'
import { LIMIT } from '../constant.js'

export interface ApplicationEntity extends Application {}
export class ApplicationRepository implements Omit<AsyncBaseRepository<ApplicationEntity>, 'list' | 'findById'> {
	async create(args: CreateArgs<ApplicationEntity>): Promise<ApplicationEntity> {
		const [application] = await db.insert(applicationTable).values(args.item).returning()
		return application
	}

	async findById(args: FindByIdArgs) {
		const application = await db
			.select()
			.from(applicationTable)
			.leftJoin(companyTable, eq(companyTable.id, applicationTable.company))
			.where(
				and(
					//
					eq(applicationTable.id, args.id),
					eq(applicationTable.user, args.userId)
				)
			)
			.limit(1)

		if (application.length === 0) return null
		return application[0]
	}

	async list(args: ListArgs) {
		const applications = await db
			.select()
			.from(applicationTable)
			.leftJoin(companyTable, eq(companyTable.id, applicationTable.company))
			.leftJoin(userTable, eq(userTable.id, applicationTable.user))
			.where(
				and(
					//
					args.q ? like(companyTable.name, `%${args.q}%`) : undefined,
					eq(applicationTable.user, args.user)
				)
			)
			.limit(args.limit || LIMIT)
			.offset(((args.page || 1) - 1) * (args.limit || LIMIT) || 0)
			.orderBy(
				args.order === 'ASC'
					? asc(applicationTable[args.sort as keyof typeof applicationTable] as AnyColumn)
					: desc(applicationTable[args.sort as keyof typeof applicationTable] as AnyColumn)
			)

		const [applicationCount] = await db.select({ totalItems: count() }).from(applicationTable)

		return { items: applications, meta: { totalItems: applicationCount.totalItems } }
	}

	async update(args: UpdateArgs<ApplicationEntity>): Promise<ApplicationEntity> {
		const [updated] = await db
			.update(applicationTable)
			.set({ ...args.item })
			.where(
				and(
					//
					eq(applicationTable.id, args.id),
					eq(applicationTable.user, args.userId)
				)
			)
			.returning()

		return updated
	}

	async delete(args: DeleteArgs): Promise<boolean> {
		try {
			await db.delete(applicationTable).where(
				and(
					//
					eq(applicationTable.id, args.id),
					eq(applicationTable.user, args.userId)
				)
			)
			return true
		} catch (error) {
			console.error()
			return false
		}
	}
}
