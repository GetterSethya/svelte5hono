import { and, asc, count, desc, eq, like, type AnyColumn } from 'drizzle-orm'
import { companyTable, type Company } from '../db/schema.js'
import { db } from '../drizzle.js'
import type {
	AsyncBaseRepository,
	CreateArgs,
	DeleteArgs,
	FindByIdArgs,
	ListArgs,
	ListReturn,
	UpdateArgs,
} from './base-repository.js'
import { LIMIT } from '../constant.js'

export interface CompanyEntity extends Company {}
export class CompanyRepository implements AsyncBaseRepository<CompanyEntity> {
	public async create(args: CreateArgs<CompanyEntity>): Promise<CompanyEntity> {
		const [company] = await db
			.insert(companyTable)
			.values({ ...args.item })
			.returning()
		return company
	}

	public async findById(args: FindByIdArgs): Promise<CompanyEntity | null> {
		const company = await db
			.select()
			.from(companyTable)
			.where(
				and(
					//
					eq(companyTable.id, args.id),
					eq(companyTable.user, args.userId)
				)
			)
			.limit(1)
		if (company.length === 0) return null

		return company[0]
	}
	public async list(args: ListArgs): Promise<ListReturn<CompanyEntity>> {
		const companies = await db
			.select()
			.from(companyTable)
			.where(
				and(
					//
					args.q ? like(companyTable.name, `%${args.q}%`) : undefined,
					eq(companyTable.user, args.userId)
				)
			)
			.limit(args.limit || LIMIT)
			.offset(((args.page || 1) - 1) * (args.limit || LIMIT) || 0)
			.orderBy(
				args.order === 'ASC'
					? asc(companyTable[args.sort as keyof typeof companyTable] as AnyColumn)
					: desc(companyTable[args.sort as keyof typeof companyTable] as AnyColumn)
			)

		const [companyCount] = await db.select({ totalItems: count() }).from(companyTable)

		return { items: companies, meta: { totalItems: companyCount.totalItems } }
	}
	public async update(args: UpdateArgs<CompanyEntity>): Promise<CompanyEntity> {
		const [updatedCompany] = await db
			.update(companyTable)
			.set({ ...args.item })
			.where(
				and(
					//
					eq(companyTable.id, args.id),
					eq(companyTable.user, args.userId)
				)
			)
			.returning()

		return updatedCompany
	}

	public async delete(args: DeleteArgs): Promise<boolean> {
		try {
			await db.delete(companyTable).where(
				and(
					//
					eq(companyTable.id, args.id),
					eq(companyTable.user, args.userId)
				)
			)
			return true
		} catch (error) {
			console.error(error)
			return false
		}
	}
}
