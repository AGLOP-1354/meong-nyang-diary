import { useColorScheme } from 'react-native'

export function useTheme() {
  const scheme = useColorScheme()
  const isDark = scheme === 'dark'
  return { isDark, colorScheme: scheme }
}
