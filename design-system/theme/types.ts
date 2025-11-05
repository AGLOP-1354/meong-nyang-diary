/**
 * 멍냥일기 Theme Types
 */

import { colors, darkColors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing } from '../tokens/spacing';
import { shadows } from '../tokens/shadows';
import { radius } from '../tokens/radius';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacing;
  shadows: typeof shadows;
  radius: typeof radius;
}

export const lightTheme: Theme = {
  mode: 'light',
  colors,
  typography,
  spacing,
  shadows,
  radius,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    ...colors,
    background: darkColors.background,
    neutral: darkColors.neutral,
    primary: darkColors.primary,
  },
  typography,
  spacing,
  shadows,
  radius,
};
