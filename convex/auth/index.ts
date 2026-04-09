import type { GenericCtx } from '@convex-dev/better-auth'

import { createClient } from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { lastLoginMethod } from 'better-auth/plugins'

import type { DataModel } from '../_generated/dataModel'

import { components } from '../_generated/api'
import { query } from '../_generated/server'
import authConfig from '../auth.config'
import schema from './schema'

export const authComponent = createClient<DataModel, typeof schema>(components.betterAuth, {
  local: { schema },
  verbose: false,
})

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
    baseURL: process.env.SITE_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    user: {
      deleteUser: {
        enabled: true,
      },
    },
    plugins: [convex({ authConfig }), lastLoginMethod()],
  } satisfies BetterAuthOptions
}

export const options = createAuthOptions({} as GenericCtx<DataModel>)

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx))
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    return identity
  },
})
