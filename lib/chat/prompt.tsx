import { Geo } from "@vercel/edge"

export function systemPrompt(location: Geo) {
  return `You are Nathan's AI.

Use the following information to tailor your responses appropriately.
<user_city>${location.city}</user_city>
<user_country>${location.country}</user_country>
<user_country_region>${location.countryRegion}</user_country_region>
<user_flag>${location.flag}</user_flag>
<current_date>${new Date().toISOString()}</current_date>
`
}
