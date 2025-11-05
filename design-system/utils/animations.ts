/**
 * 멍냥일기 Animations
 *
 * React Native Reanimated를 사용한 애니메이션 유틸리티
 */

import { withSpring, withTiming, Easing } from 'react-native-reanimated';

/**
 * Animation Timing
 */
export const timing = {
  fast: 150,
  base: 250,
  slow: 350,
};

/**
 * Easing Functions
 */
export const easings = {
  easeInOut: Easing.inOut(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeIn: Easing.in(Easing.ease),
  linear: Easing.linear,
};

/**
 * Spring Configurations
 */
export const springs = {
  gentle: {
    damping: 20,
    stiffness: 90,
    mass: 1,
  },
  bouncy: {
    damping: 10,
    stiffness: 100,
    mass: 1,
  },
  stiff: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
};

/**
 * Animation Presets
 */
export const animations = {
  fadeIn: (duration = timing.base) =>
    withTiming(1, {
      duration,
      easing: easings.easeOut,
    }),

  fadeOut: (duration = timing.base) =>
    withTiming(0, {
      duration,
      easing: easings.easeIn,
    }),

  slideUp: (duration = timing.base) =>
    withTiming(0, {
      duration,
      easing: easings.easeOut,
    }),

  slideDown: (toValue: number, duration = timing.base) =>
    withTiming(toValue, {
      duration,
      easing: easings.easeOut,
    }),

  scale: (toValue = 1, duration = timing.fast) =>
    withSpring(toValue, springs.gentle),

  heartBeat: () =>
    withSpring(1.2, {
      damping: 2,
      stiffness: 100,
    }),
};

/**
 * Animation Helpers
 */
export const createSpringAnimation = (toValue: number, config = springs.gentle) => {
  return withSpring(toValue, config);
};

export const createTimingAnimation = (toValue: number, duration = timing.base, easing = easings.easeInOut) => {
  return withTiming(toValue, { duration, easing });
};
