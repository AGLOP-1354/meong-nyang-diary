export const isEmail = (value: string) =>
  /^[\w.!#$%&'*+/=?`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/.test(
    value,
  )

export const isPhone = (value: string) => /^(\+?82|0)(10|11|16|17|18|19)\d{7,8}$/.test(value.replace(/\D/g, ''))

export const isUrl = (value: string) =>
  /^(https?:)\/\/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#\[\]@!$&'()*+,;=.]+$/.test(value)

export const isNotEmpty = (value: unknown) =>
  !(value === undefined || value === null || (typeof value === 'string' && value.trim() === ''))

export function validateObject<T extends Record<string, unknown>>(
  obj: T,
  rules: Partial<Record<keyof T, (value: unknown) => boolean>>,
) {
  const errors: Partial<Record<keyof T, string>> = {}
  for (const key in rules) {
    const validator = rules[key]
    if (!validator) continue
    const isValid = validator(obj[key])
    if (!isValid) errors[key] = String(key)
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
