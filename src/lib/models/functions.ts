import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

// ─── Schemas ──────────────────────────────────────────────────────────────────

const ModelGroupSchema = z.enum([
  'Router',
  'Media',
  'Other',
  'GPT',
  'Claude',
  'Gemini',
  'Grok',
  'Cohere',
  'Nova',
  'Qwen',
  'Yi',
  'DeepSeek',
  'Mistral',
  'Llama2',
  'Llama3',
  'Llama4',
  'PaLM',
  'RWKV',
  'Qwen3',
])

const ModelArchitectureInstructTypeSchema = z.enum([
  'none',
  'airoboros',
  'alpaca',
  'alpaca-modif',
  'chatml',
  'claude',
  'code-llama',
  'gemma',
  'llama2',
  'llama3',
  'mistral',
  'nemotron',
  'neural',
  'openchat',
  'phi3',
  'rwkv',
  'vicuna',
  'zephyr',
  'deepseek-r1',
  'deepseek-v3.1',
  'qwq',
  'qwen3',
])

const InputModalitySchema = z.enum(['text', 'image', 'file', 'audio', 'video'])
const OutputModalitySchema = z.enum(['text', 'image', 'embeddings'])

const ParameterSchema = z.enum([
  'temperature',
  'top_p',
  'top_k',
  'min_p',
  'top_a',
  'frequency_penalty',
  'presence_penalty',
  'repetition_penalty',
  'max_tokens',
  'logit_bias',
  'logprobs',
  'top_logprobs',
  'seed',
  'response_format',
  'structured_outputs',
  'stop',
  'tools',
  'tool_choice',
  'parallel_tool_calls',
  'include_reasoning',
  'reasoning',
  'reasoning_effort',
  'web_search_options',
  'verbosity',
])

const ModelCategorySchema = z.enum([
  'programming',
  'roleplay',
  'marketing',
  'marketing/seo',
  'technology',
  'science',
  'translation',
  'legal',
  'finance',
  'health',
  'trivia',
  'academia',
])

const PublicPricingSchema = z.object({
  prompt: z.string(),
  completion: z.string(),
  request: z.string().optional(),
  image: z.string().optional(),
  image_token: z.string().optional(),
  image_output: z.string().optional(),
  audio: z.string().optional(),
  input_audio_cache: z.string().optional(),
  web_search: z.string().optional(),
  internal_reasoning: z.string().optional(),
  input_cache_read: z.string().optional(),
  input_cache_write: z.string().optional(),
  discount: z.number().optional(),
})

const ModelArchitectureSchema = z.object({
  tokenizer: ModelGroupSchema.optional(),
  instruct_type: ModelArchitectureInstructTypeSchema.nullable(),
  modality: z.string().nullable(),
  input_modalities: z.array(InputModalitySchema),
  output_modalities: z.array(OutputModalitySchema),
})

const TopProviderInfoSchema = z.object({
  context_length: z.number().nullable(),
  max_completion_tokens: z.number().nullable().optional(),
  is_moderated: z.boolean(),
})

const PerRequestLimitsSchema = z.object({
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
})

const DefaultParametersSchema = z.object({
  temperature: z.number().nullable().optional(),
  top_p: z.number().nullable().optional(),
  frequency_penalty: z.number().nullable().optional(),
})

const ModelSchema = z.object({
  id: z.string(),
  canonical_slug: z.string(),
  hugging_face_id: z.string().nullable().optional(),
  name: z.string(),
  created: z.number(),
  description: z.string().optional(),
  pricing: PublicPricingSchema,
  context_length: z.number().nullable(),
  architecture: ModelArchitectureSchema,
  top_provider: TopProviderInfoSchema,
  per_request_limits: PerRequestLimitsSchema,
  supported_parameters: z.array(ParameterSchema),
  default_parameters: DefaultParametersSchema,
  expiration_date: z.string().nullable().optional(),
})

const ModelsListResponseSchema = z.object({
  data: z.array(ModelSchema),
})

const GetModelsParamsSchema = z
  .object({
    category: ModelCategorySchema.optional(),
    supported_parameters: z.union([ParameterSchema, z.array(ParameterSchema)]).optional(),
  })
  .default({})

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type ModelGroup = z.infer<typeof ModelGroupSchema>
export type ModelArchitectureInstructType = z.infer<typeof ModelArchitectureInstructTypeSchema>
export type InputModality = z.infer<typeof InputModalitySchema>
export type OutputModality = z.infer<typeof OutputModalitySchema>
export type Parameter = z.infer<typeof ParameterSchema>
export type ModelCategory = z.infer<typeof ModelCategorySchema>
export type PublicPricing = z.infer<typeof PublicPricingSchema>
export type ModelArchitecture = z.infer<typeof ModelArchitectureSchema>
export type TopProviderInfo = z.infer<typeof TopProviderInfoSchema>
export type PerRequestLimits = z.infer<typeof PerRequestLimitsSchema>
export type DefaultParameters = z.infer<typeof DefaultParametersSchema>
export type Model = z.infer<typeof ModelSchema>
export type ModelsListResponse = z.infer<typeof ModelsListResponseSchema>
export type GetModelsParams = z.infer<typeof GetModelsParamsSchema>

// ─── Server Function ──────────────────────────────────────────────────────────

export const getModels = createServerFn({ method: 'GET' })
  .inputValidator((data) => GetModelsParamsSchema.parse(data))
  .handler(async ({ data }): Promise<ModelsListResponse> => {
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
    const parsedResult = ModelsListResponseSchema.safeParse(json)

    if (!parsedResult.success) {
      // console.warn('OpenRouter Schema Mismatch:', JSON.stringify(parsedResult.error, null, 2))
      return json as ModelsListResponse
    }

    return parsedResult.data
  })
