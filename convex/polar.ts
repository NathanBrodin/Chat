import { Polar } from '@convex-dev/polar'

import type { DataModel } from './_generated/dataModel'

import { api, components } from './_generated/api'

const products = {
  free: 'b27b5253-5487-489b-987e-81b95293e031',
  plus: 'fd72b2eb-35dc-41cf-90a0-830450873822',
  max: '83ae7b13-487a-4f5b-a226-748fa749a26e',
}

export const polar: Polar<DataModel, typeof products> = new Polar(components.polar, {
  products,
  getUserInfo: async (ctx): Promise<{ userId: string; email: string }> => {
    const user = await ctx.runQuery(api.auth.index.getCurrentUser)

    if (user === null) {
      throw new Error('User must be authenticated to access Polar')
    }

    return {
      userId: user._id,
      email: user.email,
    }
  },
})

export const {
  changeCurrentSubscription,
  cancelCurrentSubscription,
  getConfiguredProducts,
  listAllProducts,
  listAllSubscriptions,
  generateCheckoutLink,
  generateCustomerPortalUrl,
} = polar.api()
