import { z } from 'zod'

export type ModelsGetParametersCategory = z.infer<typeof ModelsGetParametersCategory>
export const ModelsGetParametersCategory = z.union([
  z.literal('programming'),
  z.literal('roleplay'),
  z.literal('marketing'),
  z.literal('marketing/seo'),
  z.literal('technology'),
  z.literal('science'),
  z.literal('translation'),
  z.literal('legal'),
  z.literal('finance'),
  z.literal('health'),
  z.literal('trivia'),
  z.literal('academia'),
])

export const ModelsGetQueryParams = z
  .object({
    category: ModelsGetParametersCategory.optional(),
  })
  .default({})

export type ModelsGetQueryParams = z.infer<typeof ModelsGetQueryParams>

export type InputModality = z.infer<typeof InputModality>
export const InputModality = z.union([
  z.literal('text'),
  z.literal('image'),
  z.literal('file'),
  z.literal('audio'),
  z.literal('video'),
])

export type ModelArchitectureInstructType = z.infer<typeof ModelArchitectureInstructType>
export const ModelArchitectureInstructType = z.union([
  z.literal('none'),
  z.literal('airoboros'),
  z.literal('alpaca'),
  z.literal('alpaca-modif'),
  z.literal('chatml'),
  z.literal('claude'),
  z.literal('code-llama'),
  z.literal('gemma'),
  z.literal('llama2'),
  z.literal('llama3'),
  z.literal('mistral'),
  z.literal('nemotron'),
  z.literal('neural'),
  z.literal('openchat'),
  z.literal('phi3'),
  z.literal('rwkv'),
  z.literal('vicuna'),
  z.literal('zephyr'),
  z.literal('deepseek-r1'),
  z.literal('deepseek-v3.1'),
  z.literal('qwq'),
  z.literal('qwen3'),
])

export type OutputModality = z.infer<typeof OutputModality>
export const OutputModality = z.union([
  z.literal('text'),
  z.literal('image'),
  z.literal('embeddings'),
  z.literal('audio'),
  z.literal('video'),
  z.literal('rerank'),
])

export type ModelGroup = z.infer<typeof ModelGroup>
export const ModelGroup = z.union([
  z.literal('Router'),
  z.literal('Media'),
  z.literal('Other'),
  z.literal('GPT'),
  z.literal('Claude'),
  z.literal('Gemini'),
  z.literal('Gemma'),
  z.literal('Grok'),
  z.literal('Cohere'),
  z.literal('Nova'),
  z.literal('Qwen'),
  z.literal('Yi'),
  z.literal('DeepSeek'),
  z.literal('Mistral'),
  z.literal('Llama2'),
  z.literal('Llama3'),
  z.literal('Llama4'),
  z.literal('PaLM'),
  z.literal('RWKV'),
  z.literal('Qwen3'),
])

export type ModelArchitecture = z.infer<typeof ModelArchitecture>
export const ModelArchitecture = z.object({
  input_modalities: z.array(InputModality),
  instruct_type: z.union([ModelArchitectureInstructType, z.null()]).optional(),
  modality: z.union([z.string(), z.null()]),
  output_modalities: z.array(OutputModality),
  tokenizer: ModelGroup.optional(),
})

export type DefaultParameters = z.infer<typeof DefaultParameters>
export const DefaultParameters = z.object({
  frequency_penalty: z.number().nullable().optional(),
  presence_penalty: z.number().nullable().optional(),
  repetition_penalty: z.number().nullable().optional(),
  temperature: z.number().nullable().optional(),
  top_k: z.number().nullable().optional(),
  top_p: z.number().nullable().optional(),
})

export type ModelLinks = z.infer<typeof ModelLinks>
export const ModelLinks = z.object({
  details: z.string(),
})

export type PerRequestLimits = z.infer<typeof PerRequestLimits>
export const PerRequestLimits = z.object({
  completion_tokens: z.number(),
  prompt_tokens: z.number(),
})

export type PublicPricing = z.infer<typeof PublicPricing>
export const PublicPricing = z.object({
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

export type Parameter = z.infer<typeof Parameter>
export const Parameter = z.union([
  z.literal('temperature'),
  z.literal('top_p'),
  z.literal('top_k'),
  z.literal('min_p'),
  z.literal('top_a'),
  z.literal('frequency_penalty'),
  z.literal('presence_penalty'),
  z.literal('repetition_penalty'),
  z.literal('max_tokens'),
  z.literal('max_completion_tokens'),
  z.literal('logit_bias'),
  z.literal('logprobs'),
  z.literal('top_logprobs'),
  z.literal('seed'),
  z.literal('response_format'),
  z.literal('structured_outputs'),
  z.literal('stop'),
  z.literal('tools'),
  z.literal('tool_choice'),
  z.literal('parallel_tool_calls'),
  z.literal('include_reasoning'),
  z.literal('reasoning'),
  z.literal('reasoning_effort'),
  z.literal('web_search_options'),
  z.literal('verbosity'),
])

export type TopProviderInfo = z.infer<typeof TopProviderInfo>
export const TopProviderInfo = z.object({
  context_length: z.number().nullable().optional(),
  is_moderated: z.boolean(),
  max_completion_tokens: z.number().nullable().optional(),
})

export type Model = z.infer<typeof Model>
export const Model = z.object({
  architecture: ModelArchitecture,
  canonical_slug: z.string(),
  context_length: z.number().nullable(),
  created: z.number(),
  default_parameters: DefaultParameters,
  description: z.string().optional(),
  expiration_date: z.string().nullable().optional(),
  hugging_face_id: z.string().nullable().optional(),
  id: z.string(),
  knowledge_cutoff: z.string().nullable().optional(),
  links: ModelLinks,
  name: z.string(),
  per_request_limits: PerRequestLimits.nullable(),
  pricing: PublicPricing,
  supported_parameters: z.array(Parameter),
  top_provider: TopProviderInfo,
})

export type ModelsListResponseData = z.infer<typeof ModelsListResponseData>
export const ModelsListResponseData = z.array(Model)

export type ModelsListResponse = z.infer<typeof ModelsListResponse>
export const ModelsListResponse = z.object({
  data: ModelsListResponseData,
})
