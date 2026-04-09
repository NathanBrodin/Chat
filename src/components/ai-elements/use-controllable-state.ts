import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A hook that manages controlled/uncontrolled state, replacing
 * `@radix-ui/react-use-controllable-state`.
 *
 * When `prop` is defined the component is controlled — the returned value
 * tracks `prop` and `onChange` is forwarded on set.
 * When `prop` is `undefined` the component is uncontrolled — local state
 * is used and `onChange` is still called as a notification.
 */
export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: {
  prop?: T
  defaultProp?: T
  onChange?: (value: T) => void
}): [T, (next: T | ((prev: T) => T)) => void] {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultProp as T)
  const isControlled = prop !== undefined
  const value = isControlled ? (prop as T) : uncontrolled

  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  })

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const nextValue = typeof next === 'function' ? (next as (prev: T) => T)(value) : next

      if (!isControlled) {
        setUncontrolled(nextValue)
      }

      onChangeRef.current?.(nextValue)
    },
    [isControlled, value],
  )

  return [value, setValue]
}
