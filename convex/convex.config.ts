import agent from '@convex-dev/agent/convex.config'
import betterAuth from '@convex-dev/better-auth/convex.config'
import polar from '@convex-dev/polar/convex.config.js'
import rateLimiter from '@convex-dev/rate-limiter/convex.config'
import { defineApp } from 'convex/server'

const app = defineApp()
app.use(betterAuth, { name: 'auth' })
app.use(agent)
app.use(rateLimiter)
app.use(polar)

export default app
