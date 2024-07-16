export async function minDelay<T>(promise: Promise<T>, ms: number) {
  let delay = new Promise((resolve) => setTimeout(resolve, ms))
  let [p] = await Promise.all([promise, delay])

  return p
}
