import { experimental_createWebFetchTool as createWebFetchTool } from "@ai-sdk/tool-web-fetch"

// Fetched pages are untrusted, but the tool only makes GET requests, rejects
// credentials, blocks private/reserved addresses on every redirect and DNS
// resolution, and caps response size. Set `requireUrlInUserMessage: true` if
// this deployment ever exposes private data to the model.
export const webFetch = createWebFetchTool()
