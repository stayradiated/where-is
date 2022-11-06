type CacheGetOptions<T> = {
  key: string
  ignoreCache?: boolean
  getValue: () => Promise<T>
}

type Cache = {
  get: <T>(options: CacheGetOptions<T>) => Promise<T>
}

const createCache = (): Cache => {
  const cache = new Map<string, unknown>()

  const object: Cache = {
    async get<T>(options: CacheGetOptions<T>) {
      const { key, ignoreCache, getValue } = options

      if (cache.has(key) && !ignoreCache) {
        return cache.get(key) as T
      }

      const value = await getValue()
      cache.set(key, value)
      return value
    },
  }

  return object
}

declare global {
  var __cache: Cache | undefined
}

let cache: Cache

// If (process.env.NODE_ENV === "development") {
//   cache = createCache()
// }

if (!global.__cache) {
  global.__cache = createCache()
}

cache = global.__cache

export { cache }