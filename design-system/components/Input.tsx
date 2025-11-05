/**
 * 멍냥일기 Input Component
 */

import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { useTheme } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  disabled = false,
  containerStyle,
  style,
  ...textInputProps
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getInputStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      fontSize: theme.typography.fontSize.bodyMd,
      fontFamily: theme.typography.fontFamily.primary,
      borderWidth: 2,
    };

    let stateStyle: ViewStyle = {};
    if (disabled) {
      stateStyle = {
        backgroundColor: theme.colors.neutral[200],
        borderColor: 'transparent',
        color: theme.colors.neutral[500],
      };
    } else if (error) {
      stateStyle = {
        backgroundColor: theme.colors.background.secondary,
        borderColor: theme.colors.error.main,
      };
    } else if (isFocused) {
      stateStyle = {
        backgroundColor: theme.colors.background.secondary,
        borderColor: theme.colors.primary[500],
      };
    } else {
      stateStyle = {
        backgroundColor: theme.colors.neutral[100],
        borderColor: 'transparent',
      };
    }

    return {
      ...baseStyle,
      ...stateStyle,
    };
  };

  const labelStyle: TextStyle = {
    fontSize: theme.typography.fontSize.bodySm,
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing[2],
  };

  const errorStyle: TextStyle = {
    fontSize: theme.typography.fontSize.captionSm,
    fontFamily: theme.typography.fontFamily.primary,
    color: theme.colors.error.main,
    marginTop: theme.spacing[1],
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <TextInput
        {...textInputProps}
        style={[getInputStyle(), style]}
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={theme.colors.neutral[500]}
      />
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
};
