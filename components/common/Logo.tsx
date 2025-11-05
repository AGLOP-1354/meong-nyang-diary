/**
 * 멍냥일기 로고 - 카메라 + 강아지/고양이
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useTheme } from '@/design-system';

interface LogoProps {
  size?: number;
  color?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 80, color }) => {
  const { theme } = useTheme();
  const logoColor = color || theme.colors.primary[500];

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        {/* 카메라 본체 */}
        <Rect
          x="20"
          y="35"
          width="80"
          height="60"
          rx="12"
          fill={logoColor}
        />

        {/* 카메라 상단 돌출부 */}
        <Rect
          x="35"
          y="25"
          width="20"
          height="15"
          rx="4"
          fill={logoColor}
        />

        {/* 플래시 */}
        <Rect
          x="75"
          y="28"
          width="8"
          height="8"
          rx="2"
          fill={logoColor}
        />

        {/* 렌즈 원 (흰색 배경) */}
        <Circle
          cx="60"
          cy="65"
          r="22"
          fill="white"
        />

        {/* 강아지 실루엣 (왼쪽) */}
        <Path
          d="M 48 58
             C 48 58 45 56 43 58
             C 41 60 41 62 43 64
             L 43 72
             C 43 72 45 68 48 68
             L 48 58 Z"
          fill={logoColor}
        />

        {/* 강아지 귀 */}
        <Path
          d="M 43 56
             C 43 56 40 54 39 56
             L 41 60
             L 43 58 Z"
          fill={logoColor}
        />

        {/* 고양이 실루엣 (오른쪽) */}
        <Path
          d="M 72 58
             C 72 58 75 56 77 58
             C 79 60 79 62 77 64
             L 77 72
             C 77 72 75 68 72 68
             L 72 58 Z"
          fill={logoColor}
        />

        {/* 고양이 귀 */}
        <Path
          d="M 77 56
             C 77 56 80 54 81 56
             L 79 60
             L 77 58 Z"
          fill={logoColor}
        />

        {/* 중앙 하트 (선택적) */}
        <Path
          d="M 60 62
             C 60 62 58 60 56 61
             C 54 62 54 64 56 65
             L 60 68
             L 64 65
             C 66 64 66 62 64 61
             C 62 60 60 62 60 62 Z"
          fill="white"
        />
      </Svg>
    </View>
  );
};

interface LogoWithTextProps {
  size?: number;
}

export const LogoWithText: React.FC<LogoWithTextProps> = ({ size = 80 }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      gap: theme.spacing[3],
    },
    logoContainer: {
      width: size,
      height: size,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary[50],
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.md,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo size={size * 0.6} />
      </View>
    </View>
  );
};
