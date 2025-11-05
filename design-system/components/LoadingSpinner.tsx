/**
 * 멍냥일기 로딩 스피너
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import { Logo } from '@/components/common/Logo';

interface LoadingSpinnerProps {
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 60 }) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // 펄스 애니메이션
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // 회전 애니메이션 (옵션)
    // rotation.value = withRepeat(
    //   withTiming(360, { duration: 2000, easing: Easing.linear }),
    //   -1,
    //   false
    // );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    };
  });

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Logo size={size} />
      </Animated.View>
    </View>
  );
};

interface LoadingOverlayProps {
  visible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
  const { theme } = useTheme();

  if (!visible) return null;

  const styles = StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    content: {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing[8],
      borderRadius: theme.radius.xl,
      ...theme.shadows['2xl'],
    },
  });

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <LoadingSpinner size={80} />
      </View>
    </View>
  );
};
