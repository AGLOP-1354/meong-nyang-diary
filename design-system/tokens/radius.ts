/**
 * 멍냥일기 Border Radius Tokens
 */

export const radius = {
  none: 0,
  sm: 4, // 작은 요소 (버튼, 태그)
  md: 8, // 중간 요소 (카드)
  lg: 12, // 큰 요소 (모달)
  xl: 16, // 매우 큰 요소
  '2xl': 20, // 특별한 강조
  '3xl': 24, // 최대 둥근 모서리
  full: 9999, // 완전한 원 (프로필, 아바타)
} as const;

export type RadiusTokens = typeof radius;
