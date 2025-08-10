export type Procedure = (...args: unknown[]) => unknown

export function debounce<TArgs extends unknown[]>(fn: (...args: TArgs) => void, delayMs: number) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function debounced(this: unknown, ...args: TArgs) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, delayMs)
  }
}

export function throttle<TArgs extends unknown[]>(fn: (...args: TArgs) => void, intervalMs: number) {
  let lastExec = 0
  let pending: TArgs | null = null
  let scheduled = false

  const invoke = (context: unknown, args: TArgs) => {
    lastExec = Date.now()
    fn.apply(context, args)
  }

  return function throttled(this: unknown, ...args: TArgs) {
    const now = Date.now()
    const remaining = intervalMs - (now - lastExec)

    if (remaining <= 0) {
      scheduled = false
      pending = null
      invoke(this, args)
    } else {
      pending = args
      if (!scheduled) {
        scheduled = true
        setTimeout(() => {
          scheduled = false
          if (pending) {
            invoke(this, pending)
            pending = null
          }
        }, remaining)
      }
    }
  }
}

export function once<TArgs extends unknown[], TReturn>(fn: (...args: TArgs) => TReturn) {
  let called = false
  let result: TReturn
  return (...args: TArgs) => {
    if (!called) {
      called = true
      result = fn(...args)
    }
    return result!
  }
}

export function memoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keyFn: (...args: TArgs) => string = (...a) => JSON.stringify(a),
) {
  const cache = new Map<string, TReturn>()
  return (...args: TArgs): TReturn => {
    const key = keyFn(...args)
    if (cache.has(key)) return cache.get(key) as TReturn
    const value = fn(...args)
    cache.set(key, value)
    return value
  }
}

export const noop = () => {}
export const identity = <T>(value: T) => value
