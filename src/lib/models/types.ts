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
    supported_parameters: z.string().optional(),
    output_modalities: z.string().optional(),
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
  instruct_type: z
    .union([z.union([ModelArchitectureInstructType, z.null()]), z.undefined()])
    .optional(),
  modality: z.union([z.string(), z.null()]),
  output_modalities: z.array(OutputModality),
  tokenizer: z.union([ModelGroup, z.undefined()]).optional(),
})

export type DefaultParameters = z.infer<typeof DefaultParameters>
export const DefaultParameters = z.object({
  frequency_penalty: z.number().optional(),
  presence_penalty: z.number().optional(),
  repetition_penalty: z.number().optional(),
  temperature: z.number().optional(),
  top_k: z.union([z.number(), z.null()]).optional(),
  top_p: z.number().optional(),
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

export type PublicPricingAudio = z.infer<typeof PublicPricingAudio>
export const PublicPricingAudio = z.object({})

export type PublicPricingAudioOutput = z.infer<typeof PublicPricingAudioOutput>
export const PublicPricingAudioOutput = z.object({})

export type PublicPricingCompletion = z.infer<typeof PublicPricingCompletion>
export const PublicPricingCompletion = z.object({})

export type PublicPricingImage = z.infer<typeof PublicPricingImage>
export const PublicPricingImage = z.object({})

export type PublicPricingImageOutput = z.infer<typeof PublicPricingImageOutput>
export const PublicPricingImageOutput = z.object({})

export type PublicPricingImageToken = z.infer<typeof PublicPricingImageToken>
export const PublicPricingImageToken = z.object({})

export type PublicPricingInputAudioCache = z.infer<typeof PublicPricingInputAudioCache>
export const PublicPricingInputAudioCache = z.object({})

export type PublicPricingInputCacheRead = z.infer<typeof PublicPricingInputCacheRead>
export const PublicPricingInputCacheRead = z.object({})

export type PublicPricingInputCacheWrite = z.infer<typeof PublicPricingInputCacheWrite>
export const PublicPricingInputCacheWrite = z.object({})

export type PublicPricingInternalReasoning = z.infer<typeof PublicPricingInternalReasoning>
export const PublicPricingInternalReasoning = z.object({})

export type PublicPricingPrompt = z.infer<typeof PublicPricingPrompt>
export const PublicPricingPrompt = z.object({})

export type PublicPricingRequest = z.infer<typeof PublicPricingRequest>
export const PublicPricingRequest = z.object({})

export type PublicPricingWebSearch = z.infer<typeof PublicPricingWebSearch>
export const PublicPricingWebSearch = z.object({})

export type PublicPricing = z.infer<typeof PublicPricing>
export const PublicPricing = z.object({
  audio: z.union([PublicPricingAudio, z.undefined()]).optional(),
  audio_output: z.union([PublicPricingAudioOutput, z.undefined()]).optional(),
  completion: PublicPricingCompletion,
  discount: z.union([z.number(), z.undefined()]).optional(),
  image: z.union([PublicPricingImage, z.undefined()]).optional(),
  image_output: z.union([PublicPricingImageOutput, z.undefined()]).optional(),
  image_token: z.union([PublicPricingImageToken, z.undefined()]).optional(),
  input_audio_cache: z.union([PublicPricingInputAudioCache, z.undefined()]).optional(),
  input_cache_read: z.union([PublicPricingInputCacheRead, z.undefined()]).optional(),
  input_cache_write: z.union([PublicPricingInputCacheWrite, z.undefined()]).optional(),
  internal_reasoning: z.union([PublicPricingInternalReasoning, z.undefined()]).optional(),
  prompt: PublicPricingPrompt,
  request: z.union([PublicPricingRequest, z.undefined()]).optional(),
  web_search: z.union([PublicPricingWebSearch, z.undefined()]).optional(),
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
  context_length: z.union([z.number(), z.undefined()]).optional(),
  is_moderated: z.boolean(),
  max_completion_tokens: z.union([z.number(), z.undefined()]).optional(),
})

export type Model = z.infer<typeof Model>
export const Model = z.object({
  architecture: ModelArchitecture,
  canonical_slug: z.string(),
  context_length: z.number(),
  created: z.number(),
  default_parameters: DefaultParameters,
  description: z.union([z.string(), z.undefined()]).optional(),
  expiration_date: z.union([z.union([z.string(), z.null()]), z.undefined()]).optional(),
  hugging_face_id: z.union([z.union([z.string(), z.null()]), z.undefined()]).optional(),
  id: z.string(),
  knowledge_cutoff: z.union([z.union([z.string(), z.null()]), z.undefined()]).optional(),
  links: ModelLinks,
  name: z.string(),
  per_request_limits: PerRequestLimits,
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
