import { defineConfig } from 'drizzle-kit'
export default defineConfig({
	out: './drizzle',
	schema: './src/lib/db/schema.ts',
	dialect: 'sqlite',
	dbCredentials: {
		url: './src/lib/db/dev.db',
	},
})
