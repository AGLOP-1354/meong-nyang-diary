/**
 * 멍냥일기 Spacing Tokens
 *
 * 4px 기반 스페이싱 시스템
 */

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

/**
 * Spacing Usage Guide:
 * - Component 내부 padding: 12px, 16px, 20px
 * - 요소 간 간격: 8px, 12px, 16px
 * - 섹션 간 간격: 24px, 32px, 40px
 * - 화면 좌우 여백: 16px (모바일), 24px (태블릿)
 */

export type SpacingTokens = typeof spacing;
