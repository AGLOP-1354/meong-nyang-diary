/**
 * 멍냥일기 Typography Component
 */

import React, { ReactNode } from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../theme';

export type TypographyVariant =
  | 'displayLg'
  | 'displayMd'
  | 'displaySm'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'bodyLg'
  | 'bodyMd'
  | 'bodySm'
  | 'captionLg'
  | 'captionMd'
  | 'captionSm'
  | 'tiny';

export type TypographyWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

interface TypographyProps {
  children: ReactNode;
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  color?: string;
  align?: TypographyAlign;
  numberOfLines?: number;
  style?: TextStyle;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'bodyMd',
  weight = 'regular',
  color,
  align = 'left',
  numberOfLines,
  style,
}) => {
  const { theme } = useTheme();

  const getTextStyle = (): TextStyle => {
    const fontSize = theme.typography.fontSize[variant];
    const fontWeight = theme.typography.fontWeight[weight];
    const textColor = color || theme.colors.neutral[800];

    return {
      fontSize,
      fontWeight,
      color: textColor,
      textAlign: align,
      fontFamily: theme.typography.fontFamily.primary,
      ...style,
    };
  };

  return (
    <RNText style={getTextStyle()} numberOfLines={numberOfLines}>
      {children}
    </RNText>
  );
};

// Convenience components
export const Display: React.FC<Omit<TypographyProps, 'variant'> & { size?: 'lg' | 'md' | 'sm' }> = ({
  size = 'md',
  ...props
}) => {
  const variant: TypographyVariant = size === 'lg' ? 'displayLg' : size === 'md' ? 'displayMd' : 'displaySm';
  return <Typography variant={variant} weight="bold" {...props} />;
};

export const Heading: React.FC<Omit<TypographyProps, 'variant'> & { level?: 1 | 2 | 3 | 4 }> = ({
  level = 1,
  ...props
}) => {
  const variant: TypographyVariant = `h${level}` as TypographyVariant;
  return <Typography variant={variant} weight="semibold" {...props} />;
};

export const Body: React.FC<Omit<TypographyProps, 'variant'> & { size?: 'lg' | 'md' | 'sm' }> = ({
  size = 'md',
  ...props
}) => {
  const variant: TypographyVariant = size === 'lg' ? 'bodyLg' : size === 'md' ? 'bodyMd' : 'bodySm';
  return <Typography variant={variant} {...props} />;
};

export const Caption: React.FC<Omit<TypographyProps, 'variant'> & { size?: 'lg' | 'md' | 'sm' }> = ({
  size = 'md',
  ...props
}) => {
  const variant: TypographyVariant = size === 'lg' ? 'captionLg' : size === 'md' ? 'captionMd' : 'captionSm';
  return <Typography variant={variant} {...props} />;
};
