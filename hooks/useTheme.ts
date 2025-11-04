import { useColorScheme } from 'react-native';

import { getThemeByScheme, type Theme } from '@/constants/theme';

export const useTheme = (): { theme: Theme; isDark: boolean } => {
  const scheme = useColorScheme();
  const theme = getThemeByScheme(scheme);
  return { theme, isDark: scheme === 'dark' };
};
