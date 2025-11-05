/**
 * 멍냥일기 반려동물 프로필 등록 화면
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useTheme, SafeAreaWrapper, Container, Heading, Body, Input, Button, Avatar, Card } from '@/design-system';

type PetType = 'dog' | 'cat';
type Gender = 'male' | 'female' | 'neutered_male' | 'neutered_female';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  // Form state
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<PetType | ''>('');
  const [breed, setBreed] = useState('');
  const [adoptionDate, setAdoptionDate] = useState<Date>(new Date());
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [gender, setGender] = useState<Gender | ''>('');
  const [weight, setWeight] = useState('');
  const [showAdoptionDatePicker, setShowAdoptionDatePicker] = useState(false);
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);

  // Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!petName.trim()) {
      newErrors.petName = '반려동물 이름을 입력해주세요';
    }

    if (!petType) {
      newErrors.petType = '강아지 또는 고양이를 선택해주세요';
    }

    if (!adoptionDate) {
      newErrors.adoptionDate = '입양일을 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('입력 오류', '필수 항목을 모두 입력해주세요.');
      return;
    }

    // TODO: API 호출하여 반려동물 프로필 저장
    console.log({
      petName,
      petType,
      breed,
      adoptionDate,
      birthDate,
      gender,
      weight,
    });

    // 메인 화면으로 이동
    router.replace('/(tabs)');
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    scrollContent: {
      paddingVertical: theme.spacing[6],
    },
    header: {
      marginBottom: theme.spacing[8],
    },
    title: {
      marginBottom: theme.spacing[2],
    },
    subtitle: {
      marginBottom: theme.spacing[4],
    },
    section: {
      marginBottom: theme.spacing[6],
    },
    sectionTitle: {
      marginBottom: theme.spacing[3],
    },
    required: {
      color: theme.colors.error.main,
    },
    petTypeContainer: {
      flexDirection: 'row',
      gap: theme.spacing[3],
    },
    petTypeButton: {
      flex: 1,
      paddingVertical: theme.spacing[4],
      borderRadius: theme.radius.lg,
      borderWidth: 2,
      borderColor: theme.colors.neutral[300],
      backgroundColor: theme.colors.background.secondary,
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    petTypeButtonActive: {
      borderColor: theme.colors.primary[500],
      backgroundColor: theme.colors.primary[50],
    },
    petTypeEmoji: {
      fontSize: 40,
    },
    genderContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[2],
    },
    genderButton: {
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      borderRadius: theme.radius.lg,
      borderWidth: 2,
      borderColor: theme.colors.neutral[300],
      backgroundColor: theme.colors.background.secondary,
    },
    genderButtonActive: {
      borderColor: theme.colors.primary[500],
      backgroundColor: theme.colors.primary[50],
    },
    dateButton: {
      paddingVertical: theme.spacing[3],
      paddingHorizontal: theme.spacing[4],
      borderRadius: theme.radius.md,
      borderWidth: 2,
      borderColor: theme.colors.neutral[300],
      backgroundColor: theme.colors.background.secondary,
    },
    dateButtonActive: {
      borderColor: theme.colors.primary[500],
    },
    errorText: {
      color: theme.colors.error.main,
      fontSize: theme.typography.fontSize.captionSm,
      marginTop: theme.spacing[1],
    },
    footer: {
      marginTop: theme.spacing[4],
      gap: theme.spacing[3],
    },
  });

  return (
    <SafeAreaWrapper style={styles.container}>
      <ScrollView>
        <Container style={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Heading level={1} style={styles.title}>
              우리 집 반려동물을
            </Heading>
            <Heading level={1} style={styles.title}>
              소개해주세요 🐾
            </Heading>
            <Body size="md" color={theme.colors.neutral[600]} style={styles.subtitle}>
              입양일을 기준으로 소중한 순간들을 정리해드릴게요
            </Body>
          </View>

          {/* 이름 (필수) */}
          <View style={styles.section}>
            <Heading level={4} style={styles.sectionTitle}>
              이름 <Text style={styles.required}>*</Text>
            </Heading>
            <Input
              placeholder="반려동물 이름을 입력하세요"
              value={petName}
              onChangeText={setPetName}
              error={errors.petName}
            />
          </View>

          {/* 종류 (필수) */}
          <View style={styles.section}>
            <Heading level={4} style={styles.sectionTitle}>
              종류 <Text style={styles.required}>*</Text>
            </Heading>
            <View style={styles.petTypeContainer}>
              <TouchableOpacity
                style={[styles.petTypeButton, petType === 'dog' && styles.petTypeButtonActive]}
                onPress={() => setPetType('dog')}
                activeOpacity={0.7}
              >
                <Text style={styles.petTypeEmoji}>🐶</Text>
                <Body weight="semibold">강아지</Body>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.petTypeButton, petType === 'cat' && styles.petTypeButtonActive]}
                onPress={() => setPetType('cat')}
                activeOpacity={0.7}
              >
                <Text style={styles.petTypeEmoji}>🐱</Text>
                <Body weight="semibold">고양이</Body>
              </TouchableOpacity>
            </View>
            {errors.petType && <Body style={styles.errorText}>{errors.petType}</Body>}
          </View>

          {/* 품종 (선택) */}
          <View style={styles.section}>
            <Heading level={4} style={styles.sectionTitle}>
              품종
            </Heading>
            <Input
              placeholder="예: 웰시코기, 스코티시폴드"
              value={breed}
              onChangeText={setBreed}
            />
          </View>

          {/* 입양일 (필수) */}
          <View style={styles.section}>
            <Heading level={4} style={styles.sectionTitle}>
              입양일 <Text style={styles.required}>*</Text>
            </Heading>
            <TouchableOpacity
              style={[styles.dateButton, adoptionDate && styles.dateButtonActive]}
              onPress={() => setShowAdoptionDatePicker(true)}
              activeOpacity={0.7}
            >
              <Body color={adoptionDate ? theme.colors.neutral[800] : theme.colors.neutral[500]}>
                {adoptionDate ? formatDate(adoptionDate) : '입양일을 선택하세요'}
              </Body>
            </TouchableOpacity>
            {errors.adoptionDate && <Body style={styles.errorText}>{errors.adoptionDate}</Body>}
          </View>

          {showAdoptionDatePicker && (
            <DateTimePicker
              value={adoptionDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowAdoptionDatePicker(false);
                if (selectedDate) {
                  setAdoptionDate(selectedDate);
                }
              }}
              maximumDate={new Date()}
            />
          )}

          {/* 생년월일 (선택) */}
          <View style={styles.section}>
            <Heading level={4} style={styles.sectionTitle}>
              생년월일
            </Heading>
            <TouchableOpacity
              style={[styles.dateButton, birthDate && styles.dateButtonActive]}
              onPress={() => setShowBirthDatePicker(true)}
              activeOpacity={0.7}
            >
              <Body color={birthDate ? theme.colors.neutral[800] : theme.colors.neutral[500]}>
                {birthDate ? formatDate(birthDate) : '생년월일을 선택하세요 (선택)'}
              </Body>
            </TouchableOpacity>
          </View>

          {showBirthDatePicker && (
            <DateTimePicker
              value={birthDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowBirthDatePicker(false);
                if (selectedDate) {
                  setBirthDate(selectedDate);
                }
              }}
              maximumDate={new Date()}
            />
          )}

          {/* 성별 (선택) */}
          <View style={styles.section}>
            <Heading level={4} style={styles.sectionTitle}>
              성별
            </Heading>
            <View style={styles.genderContainer}>
              {[
                { value: 'male', label: '남아' },
                { value: 'female', label: '여아' },
                { value: 'neutered_male', label: '중성화(남)' },
                { value: 'neutered_female', label: '중성화(여)' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.genderButton, gender === item.value && styles.genderButtonActive]}
                  onPress={() => setGender(item.value as Gender)}
                  activeOpacity={0.7}
                >
                  <Body weight={gender === item.value ? 'semibold' : 'regular'}>{item.label}</Body>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 몸무게 (선택) */}
          <View style={styles.section}>
            <Heading level={4} style={styles.sectionTitle}>
              몸무게
            </Heading>
            <Input
              placeholder="예: 5.5"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Button onPress={handleSubmit} variant="primary" size="large" fullWidth>
              시작하기
            </Button>
          </View>
        </Container>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
