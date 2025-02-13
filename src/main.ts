import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { userController } from './lib/controller/user-controller.js'
import { authController } from './lib/controller/auth-controller.js'
import 'dotenv/config'

const app = new Hono()
	//
	.use('*', serveStatic({ root: './src/static' }))
	.route('/user', userController)
	.route('/auth', authController)

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
	fetch: app.fetch,
	port,
})
