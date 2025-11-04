import AsyncStorage from '@react-native-async-storage/async-storage';

export const getItem = async <T>(key: string): Promise<T | null> => {
  const raw = await AsyncStorage.getItem(key);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
};

export const setItem = async <T>(key: string, value: T): Promise<void> => {
  const serialized = typeof value === 'string' ? (value as unknown as string) : JSON.stringify(value);
  await AsyncStorage.setItem(key, serialized);
};

export const removeItem = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};

export const mergeItem = async <T extends Record<string, unknown>>(key: string, partial: Partial<T>): Promise<void> => {
  const current = (await getItem<T>(key)) ?? ({} as T);
  await setItem<T>(key, { ...current, ...partial });
};
