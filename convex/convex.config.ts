import agent from '@convex-dev/agent/convex.config'
import betterAuth from '@convex-dev/better-auth/convex.config'
import rateLimiter from '@convex-dev/rate-limiter/convex.config'
import { defineApp } from 'convex/server'

const app = defineApp()
app.use(betterAuth, { name: 'auth' })
app.use(agent)
app.use(rateLimiter)

export default app
