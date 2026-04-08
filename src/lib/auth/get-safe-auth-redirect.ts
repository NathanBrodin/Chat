const DEFAULT_AUTH_REDIRECT = '/'

export function getSafeAuthRedirect(redirect: unknown): string {
  if (typeof redirect !== 'string') {
    return DEFAULT_AUTH_REDIRECT
  }

  if (!redirect.startsWith('/') || redirect.startsWith('//')) {
    return DEFAULT_AUTH_REDIRECT
  }

  return redirect
}
