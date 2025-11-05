/**
 * 멍냥일기 Badge Component
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../theme';

export type BadgeVariant = 'default' | 'dday' | 'new';

interface BadgeProps {
  children: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', style }) => {
  const { theme } = useTheme();

  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingVertical: theme.spacing[1],
      paddingHorizontal: theme.spacing[3],
      borderRadius: theme.radius.full,
      alignSelf: 'flex-start',
    };

    let variantStyle: ViewStyle = {};
    switch (variant) {
      case 'default':
        variantStyle = {
          backgroundColor: theme.colors.primary[100],
        };
        break;
      case 'dday':
        variantStyle = {
          backgroundColor: theme.colors.secondary[100],
        };
        break;
      case 'new':
        variantStyle = {
          backgroundColor: theme.colors.error.main,
        };
        break;
    }

    return {
      ...baseStyle,
      ...variantStyle,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    let color: string;
    switch (variant) {
      case 'default':
        color = theme.colors.primary[700];
        break;
      case 'dday':
        color = theme.colors.secondary[700];
        break;
      case 'new':
        color = theme.colors.neutral.white;
        break;
      default:
        color = theme.colors.primary[700];
    }

    return {
      fontSize: theme.typography.fontSize.captionSm,
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: theme.typography.fontWeight.semibold,
      color,
    };
  };

  return (
    <View style={getBadgeStyle()}>
      <Text style={getTextStyle()}>{children}</Text>
    </View>
  );
};
