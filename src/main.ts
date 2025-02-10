import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'

const app = new Hono()
	.use('*', serveStatic({ root: './src/static' }))
	//
	.get('/user/:name', (c) => {
		const params = c.req.param()
		return c.text(`Hello ${params.name}`)
	})

	// get,post,patch,put,delete
	.all('/account', (c) => {
		return c.json({ hello: 'hello from all' })
	})

	.post('/id/:id', (c) => {
		const params = c.req.param()
		return c.text('Hello Mom 💖!')
	})

	.patch('/', (c) => {
		return c.text('Hello Mom 💖!')
	})
	.put('/', (c) => {
		return c.text('Hello Mom 💖!')
	})

	.delete('/', (c) => {
		return c.text('Hello Mom 💖!')
	})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
	fetch: app.fetch,
	port,
})
