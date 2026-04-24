import { httpRouter } from 'convex/server'

import { authComponent, createAuth } from './auth'
import { polar } from './polar'

const http = httpRouter()

authComponent.registerRoutes(http, createAuth)
polar.registerRoutes(http)

export default http
