/**
 * 멍냥일기 Avatar Component
 */

import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageSourcePropType } from 'react-native';
import { useTheme } from '../theme';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type PetType = 'dog' | 'cat' | 'none';

interface AvatarProps {
  source: ImageSourcePropType;
  size?: AvatarSize;
  petType?: PetType;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({ source, size = 'md', petType = 'none', style }) => {
  const { theme } = useTheme();

  const getAvatarSize = (): number => {
    switch (size) {
      case 'sm':
        return 32;
      case 'md':
        return 40;
      case 'lg':
        return 56;
      case 'xl':
        return 80;
      default:
        return 40;
    }
  };

  const getBorderColor = (): string => {
    switch (petType) {
      case 'dog':
        return theme.colors.accent.dogLight;
      case 'cat':
        return theme.colors.accent.catLight;
      default:
        return theme.colors.neutral.white;
    }
  };

  const avatarSize = getAvatarSize();
  const borderColor = getBorderColor();

  const containerStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: theme.radius.full,
    borderWidth: 2,
    borderColor,
    ...theme.shadows.sm,
    overflow: 'hidden',
    ...style,
  };

  const imageStyle: ViewStyle = {
    width: '100%',
    height: '100%',
  };

  return (
    <View style={containerStyle}>
      <Image source={source} style={imageStyle} resizeMode="cover" />
    </View>
  );
};
