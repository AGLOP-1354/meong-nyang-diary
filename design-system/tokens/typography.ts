/**
 * 멍냥일기 Typography Tokens
 *
 * Font: Pretendard
 */

export const typography = {
  // Font Family
  fontFamily: {
    primary: 'Pretendard',
    secondary: 'Pretendard',
  },

  // Font Size
  fontSize: {
    // Display (대형 제목)
    displayLg: 32,
    displayMd: 28,
    displaySm: 24,

    // Heading (제목)
    h1: 24,
    h2: 22,
    h3: 20,
    h4: 18,

    // Body (본문)
    bodyLg: 18,
    bodyMd: 16, // 기본
    bodySm: 14,

    // Caption (캡션)
    captionLg: 14,
    captionMd: 13,
    captionSm: 12,

    // Tiny (아주 작은 텍스트)
    tiny: 11,
  },

  // Font Weight
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  // Line Height
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.02,
    normal: 0,
    wide: 0.02,
  },
} as const;

export type TypographyTokens = typeof typography;
