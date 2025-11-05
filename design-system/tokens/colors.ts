/**
 * 멍냥일기 Color Tokens
 *
 * PRD 기반 컬러 시스템
 * - Primary: 따뜻한 코랄 (#FF9E80) - 강아지 발바닥 연상
 * - Secondary: 부드러운 연두 (#A5D6A7) - 자연, 평화
 * - Accent: 강아지(주황), 고양이(보라) 구분
 */

export const colors = {
  // Primary Colors (코랄)
  primary: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9E80', // Main Primary
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },

  // Secondary Colors (연두)
  secondary: {
    50: '#F1F8E9',
    100: '#DCEDC8',
    200: '#C5E1A5',
    300: '#AED581',
    400: '#9CCC65',
    500: '#A5D6A7', // Main Secondary
    600: '#7CB342',
    700: '#689F38',
    800: '#558B2F',
    900: '#33691E',
  },

  // Accent Colors (반려동물 구분)
  accent: {
    dog: '#FF6F00', // 강아지 (주황)
    dogLight: '#FFA726',
    dogDark: '#E65100',
    cat: '#8E24AA', // 고양이 (보라)
    catLight: '#AB47BC',
    catDark: '#6A1B9A',
  },

  // Neutral Colors (회색 스케일)
  neutral: {
    white: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    black: '#000000',
  },

  // Background Colors
  background: {
    primary: '#FFF9F5', // 아이보리 배경
    secondary: '#FFFFFF', // 카드 배경
    tertiary: '#F5F5F5', // 섹션 구분 배경
  },

  // Semantic Colors
  success: {
    light: '#C8E6C9',
    main: '#4CAF50',
    dark: '#388E3C',
  },
  error: {
    light: '#FFCDD2',
    main: '#F44336',
    dark: '#D32F2F',
  },
  warning: {
    light: '#FFE082',
    main: '#FFC107',
    dark: '#FFA000',
  },
  info: {
    light: '#B3E5FC',
    main: '#03A9F4',
    dark: '#0288D1',
  },
} as const;

// 다크모드 색상
export const darkColors = {
  // Background (다크모드)
  background: {
    primary: '#121212',
    secondary: '#1E1E1E',
    tertiary: '#2C2C2C',
  },

  // Neutral (다크모드)
  neutral: {
    white: '#FFFFFF',
    50: '#2C2C2C',
    100: '#3A3A3A',
    200: '#3A3A3A',
    300: '#4A4A4A',
    400: '#6A6A6A',
    500: '#9E9E9E',
    600: '#B0B0B0',
    700: '#C0C0C0',
    800: '#E0E0E0',
    900: '#F0F0F0',
    black: '#000000',
  },

  // Primary (약간 밝게)
  primary: {
    ...colors.primary,
    500: '#FFB085',
  },
} as const;

export type ColorTokens = typeof colors;
