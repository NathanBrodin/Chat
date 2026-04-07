import { createServerFn } from '@tanstack/react-start'

import { getToken } from './auth-server'

export const getAuth = createServerFn({ method: 'GET' }).handler(async () => {
  return await getToken()
})
