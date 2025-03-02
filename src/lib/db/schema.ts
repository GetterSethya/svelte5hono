import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { APPLICATION_STATUS_KEY } from '../constant.js'

export const userTable = sqliteTable('users', {
	id: integer().primaryKey({ autoIncrement: true }),
	created_at: integer()
		.notNull()
		.$defaultFn(() => Date.now()),
	updated_at: integer()
		.notNull()
		.$defaultFn(() => Date.now()),

	email: text().notNull().unique(),
	name: text().notNull(),
})

export type User = typeof userTable.$inferSelect

export const authTable = sqliteTable('authentications', {
	id: integer().primaryKey({ autoIncrement: true }),
	created_at: integer()
		.notNull()
		.$defaultFn(() => Date.now()),
	updated_at: integer()
		.notNull()
		.$defaultFn(() => Date.now()),

	user: integer().references(() => userTable.id, { onDelete: 'cascade' }),
	hash_password: text().notNull(),
	refresh_token: text(),
})

export type Authentication = typeof authTable.$inferSelect

export const companyTable = sqliteTable('companies', {
	id: integer().primaryKey({ autoIncrement: true }),
	created_at: integer()
		.notNull()
		.$defaultFn(() => Date.now()),
	updated_at: integer()
		.notNull()
		.$defaultFn(() => Date.now()),

	user: integer().references(() => userTable.id, { onDelete: 'cascade' }),
	name: text().notNull(),
	address: text(),
})

export type Company = typeof companyTable.$inferSelect

export const applicationTable = sqliteTable('applications', {
	id: integer().primaryKey({ autoIncrement: true }),
	created_at: integer()
		.notNull()
		.$defaultFn(() => Date.now()),
	updated_at: integer()
		.notNull()
		.$defaultFn(() => Date.now()),

	user: integer().references(() => userTable.id, { onDelete: 'cascade' }),
	company: integer().references(() => companyTable.id, {
		onDelete: 'set null',
	}),
	position: text(),
	status: text().notNull().$type<(typeof APPLICATION_STATUS_KEY)[number]>(),
	notes: text(),
})

export type Application = typeof applicationTable.$inferSelect
