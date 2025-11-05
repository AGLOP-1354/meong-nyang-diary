/**
 * 멍냥일기 Button Component
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      small: {
        paddingVertical: theme.spacing[2],
        paddingHorizontal: theme.spacing[4],
      },
      medium: {
        paddingVertical: theme.spacing[3],
        paddingHorizontal: theme.spacing[6],
      },
      large: {
        paddingVertical: theme.spacing[4],
        paddingHorizontal: theme.spacing[8],
      },
    };

    // Variant
    let variantStyle: ViewStyle = {};
    if (disabled) {
      variantStyle = {
        backgroundColor: theme.colors.neutral[300],
        ...theme.shadows.sm,
      };
    } else {
      switch (variant) {
        case 'primary':
          variantStyle = {
            backgroundColor: theme.colors.primary[500],
            ...theme.shadows.sm,
          };
          break;
        case 'secondary':
          variantStyle = {
            backgroundColor: theme.colors.background.secondary,
            borderWidth: 2,
            borderColor: theme.colors.primary[500],
          };
          break;
        case 'text':
          variantStyle = {
            backgroundColor: 'transparent',
          };
          break;
      }
    }

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyle,
      ...(fullWidth && { width: '100%' }),
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles: Record<ButtonSize, TextStyle> = {
      small: {
        fontSize: theme.typography.fontSize.bodySm,
      },
      medium: {
        fontSize: theme.typography.fontSize.bodyMd,
      },
      large: {
        fontSize: theme.typography.fontSize.bodyLg,
      },
    };

    let variantStyle: TextStyle = {};
    if (disabled) {
      variantStyle = {
        color: theme.colors.neutral[500],
      };
    } else {
      switch (variant) {
        case 'primary':
          variantStyle = {
            color: theme.colors.neutral.white,
          };
          break;
        case 'secondary':
        case 'text':
          variantStyle = {
            color: theme.colors.primary[500],
          };
          break;
      }
    }

    return {
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: theme.typography.fontWeight.semibold,
      ...sizeStyles[size],
      ...variantStyle,
    };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={getButtonStyle()}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? theme.colors.neutral.white : theme.colors.primary[500]} />
      ) : (
        <Text style={getTextStyle()}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};
