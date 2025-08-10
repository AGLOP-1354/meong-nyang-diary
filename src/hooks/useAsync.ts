import { useCallback, useEffect, useRef, useState } from 'react'

type AsyncState<T> = {
  data: T | null
  error: unknown
  loading: boolean
}

export function useAsync<T>(asyncFn: () => Promise<T>, deps: unknown[] = []) {
  const mountedRef = useRef(true)
  const [state, setState] = useState<AsyncState<T>>({ data: null, error: null, loading: false })

  const run = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const result = await asyncFn()
      if (mountedRef.current) setState({ data: result, error: null, loading: false })
      return result
    } catch (err) {
      if (mountedRef.current) setState({ data: null, error: err, loading: false })
      throw err
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return { ...state, run, reload: run }
}
