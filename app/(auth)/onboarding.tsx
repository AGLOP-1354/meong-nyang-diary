/**
 * 멍냥일기 온보딩 화면
 */

import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme, SafeAreaWrapper, Display, Body, Button } from '@/design-system';
import { Logo } from '@/components/common/Logo';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  emoji: string;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    emoji: 'logo', // 로고 사용
    title: '멍냥일기',
    description: '우리 집 최애의 매일을\n자동으로 정리하고 공유해요',
  },
  {
    id: 2,
    emoji: '📅',
    title: '자동 정리',
    description: '입양일 기준으로 날짜별로\n사진을 자동으로 정리해드려요',
  },
  {
    id: 3,
    emoji: '👨‍👩‍👧‍👦',
    title: '가족 공유',
    description: '온 가족이 함께\n반려동물의 성장을 기록하고 공유해요',
  },
  {
    id: 4,
    emoji: '🎬',
    title: '성장 영상',
    description: '월별 사진을 자동으로 편집하여\n성장 영상을 만들어드려요',
  },
];

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentSlide + 1) * width,
        animated: true,
      });
    } else {
      // 마지막 슬라이드에서 프로필 등록으로 이동
      router.push('/(auth)/profile');
    }
  };

  const skipOnboarding = () => {
    router.push('/(auth)/profile');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    scrollContainer: {
      flex: 1,
    },
    slide: {
      width,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing[8],
    },
    emojiContainer: {
      width: 140,
      height: 140,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary[50],
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing[8],
      ...theme.shadows.md,
    },
    emoji: {
      fontSize: 72,
    },
    title: {
      textAlign: 'center',
      marginBottom: theme.spacing[4],
    },
    description: {
      textAlign: 'center',
      lineHeight: 28,
    },
    footer: {
      paddingHorizontal: theme.spacing[6],
      paddingBottom: theme.spacing[8],
      gap: theme.spacing[4],
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[4],
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.neutral[300],
    },
    activeDot: {
      width: 24,
      backgroundColor: theme.colors.primary[500],
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing[3],
    },
  });

  return (
    <SafeAreaWrapper style={styles.container}>
      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollContainer}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.emojiContainer}>
              {slide.emoji === 'logo' ? (
                <Logo size={80} />
              ) : (
                <Text style={styles.emoji}>{slide.emoji}</Text>
              )}
            </View>
            <Display size="lg" weight="bold" color={theme.colors.neutral[800]} style={styles.title}>
              {slide.title}
            </Display>
            <Body size="lg" color={theme.colors.neutral[600]} style={styles.description}>
              {slide.description}
            </Body>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Pagination */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View key={index} style={[styles.dot, currentSlide === index && styles.activeDot]} />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button onPress={skipOnboarding} variant="secondary" style={{ flex: 1 }}>
            건너뛰기
          </Button>
          <Button onPress={goToNextSlide} variant="primary" style={{ flex: 1 }}>
            {currentSlide === slides.length - 1 ? '시작하기' : '다음'}
          </Button>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
