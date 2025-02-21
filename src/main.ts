import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { userController } from './lib/controller/user-controller.js'
import { authController } from './lib/controller/auth-controller.js'
import 'dotenv/config'
import { companyController } from './lib/controller/company-controller.js'

const api = new Hono()
	// /api/user
	.route('/user', userController)
	// /api/auth
	.route('/auth', authController)
	// /api/company
	.route('/company', companyController)

const app = new Hono()
	//
	.use('*', serveStatic({ root: './src/static' }))
	.route('/api', api)

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
	fetch: app.fetch,
	port,
})
