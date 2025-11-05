/**
 * 멍냥일기 앱 아이콘 - 카메라 버전
 */

import React from 'react';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

interface AppIconProps {
  size?: number;
  gradient?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({ size = 120, gradient = false }) => {
  const backgroundColor = gradient ? 'url(#bgGradient)' : '#FF9E80';
  const iconColor = '#FFFFFF';

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {gradient && (
        <Defs>
          <LinearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFB74D" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FF9E80" stopOpacity="1" />
          </LinearGradient>
        </Defs>
      )}

      {/* 배경 원 */}
      <Circle cx="60" cy="60" r="58" fill={backgroundColor} />

      {/* 카메라 본체 */}
      <Rect
        x="25"
        y="40"
        width="70"
        height="52"
        rx="10"
        fill={iconColor}
      />

      {/* 카메라 상단 돌출부 */}
      <Rect
        x="38"
        y="32"
        width="18"
        height="12"
        rx="3"
        fill={iconColor}
      />

      {/* 플래시 */}
      <Rect
        x="70"
        y="35"
        width="7"
        height="7"
        rx="2"
        fill={iconColor}
      />

      {/* 렌즈 원 */}
      <Circle
        cx="60"
        cy="66"
        r="20"
        fill={backgroundColor}
      />

      {/* 강아지 실루엣 */}
      <Path
        d="M 50 60
           C 50 60 47 58 45 60
           C 43 62 43 64 45 66
           L 45 73
           C 45 73 47 70 50 70
           L 50 60 Z"
        fill={iconColor}
      />

      {/* 강아지 귀 */}
      <Path
        d="M 45 58
           C 45 58 42 56 41 58
           L 43 62
           L 45 60 Z"
        fill={iconColor}
      />

      {/* 고양이 실루엣 */}
      <Path
        d="M 70 60
           C 70 60 73 58 75 60
           C 77 62 77 64 75 66
           L 75 73
           C 75 73 73 70 70 70
           L 70 60 Z"
        fill={iconColor}
      />

      {/* 고양이 귀 */}
      <Path
        d="M 75 58
           C 75 58 78 56 79 58
           L 77 62
           L 75 60 Z"
        fill={iconColor}
      />

      {/* 중앙 하트 */}
      <Path
        d="M 60 64
           C 60 64 58 62 56 63
           C 54 64 54 66 56 67
           L 60 70
           L 64 67
           C 66 66 66 64 64 63
           C 62 62 60 64 60 64 Z"
        fill={iconColor}
      />
    </Svg>
  );
};
