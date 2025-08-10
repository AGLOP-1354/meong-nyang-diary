import AsyncStorage from '@react-native-async-storage/async-storage'

export async function getItem<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key)
  if (raw == null) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return raw as unknown as T
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  const serialized = typeof value === 'string' ? (value as unknown as string) : JSON.stringify(value)
  await AsyncStorage.setItem(key, serialized)
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key)
}

export async function mergeItem<T extends Record<string, unknown>>(key: string, partial: Partial<T>): Promise<void> {
  const current = (await getItem<T>(key)) ?? ({} as T)
  await setItem<T>(key, { ...current, ...partial })
}
