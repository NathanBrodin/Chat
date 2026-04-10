import { createServerFn } from '@tanstack/react-start'

import { ModelsGetQueryParams, ModelsListResponse, ModelsListResponseData } from './types'

export const getModels = createServerFn({ method: 'GET' })
  .inputValidator((data) => ModelsGetQueryParams.parse(data))
  .handler(async ({ data }): Promise<ModelsListResponseData> => {
    const { category, supported_parameters } = data
    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY must be defined')
    }

    const url = new URL('https://openrouter.ai/api/v1/models')

    if (category) {
      url.searchParams.set('category', category)
    }

    if (supported_parameters) {
      const params = Array.isArray(supported_parameters)
        ? supported_parameters.join(',')
        : supported_parameters
      url.searchParams.set('supported_parameters', params)
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
    }

    const json = await response.json()
    const parsedResult = ModelsListResponse.safeParse(json)

    if (!parsedResult.success) {
      // console.warn('OpenRouter Schema Mismatch:', JSON.stringify(parsedResult.error, null, 2))
      return json.data as ModelsListResponseData
    }

    return parsedResult.data.data
  })
