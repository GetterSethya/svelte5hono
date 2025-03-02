import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { userController } from './lib/controller/user-controller.js'
import { authController } from './lib/controller/auth-controller.js'
import 'dotenv/config'
import { companyController } from './lib/controller/company-controller.js'
import { applicationController } from './lib/controller/application-controller.js'

const api = new Hono()
	// /api/user
	.route('/user', userController)
	// /api/auth
	.route('/auth', authController)
	// /api/company
	.route('/company', companyController)
	// /api/application
	.route('/application', applicationController)

const app = new Hono()
	//
	.use('*', async (c, next) => {
		const url = new URL(c.req.url)
		if (
			!url.pathname.startsWith('/api') &&
			!url.pathname.match(/\.(js|css|png|jpg|gif|ico|svg|ttf|woff|woff2|eot|otf)$/)
		) {
			c.req.path = '/'
		}

		await next()
	})
	.use('*', serveStatic({ root: './src/static' }))
	.route('/api', api)

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
	fetch: app.fetch,
	port,
})
