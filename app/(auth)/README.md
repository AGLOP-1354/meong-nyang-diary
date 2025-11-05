# 멍냥일기 인증 화면

PRD 기반으로 재작성된 인증 및 온보딩 화면입니다.

## 📱 화면 구성

### 1. index.tsx - 로그인 화면

**경로**: `/(auth)/`

**기능**:

- 소셜 로그인 (카카오, 구글, 애플)
- 멍냥일기 브랜딩 (발바닥 🐾 로고)
- "우리 집 최애의 매일을 기록해요" 메시지

**디자인**:

- 디자인 시스템 적용 (코랄 컬러, 부드러운 느낌)
- 소셜 로그인 버튼 스타일링

**플로우**:

```
로그인 성공 → 메인 화면 (/(tabs)/)
※ 첫 로그인 시 온보딩 및 프로필 등록 추가 예정
```

---

### 2. onboarding.tsx - 온보딩 슬라이드

**경로**: `/(auth)/onboarding`

**기능**:

- 4개의 소개 슬라이드
  1. 멍냥일기 소개
  2. 자동 정리 기능
  3. 가족 공유 기능
  4. 성장 영상 기능
- 페이지 인디케이터
- 건너뛰기 / 다음 버튼

**디자인**:

- 각 슬라이드별 이모지 + 제목 + 설명
- 스와이프로 넘기기 가능
- 따뜻한 코랄 배경

**플로우**:

```
온보딩 완료 → 프로필 등록 (/(auth)/profile)
건너뛰기 → 프로필 등록 (/(auth)/profile)
```

---

### 3. profile.tsx - 반려동물 프로필 등록

**경로**: `/(auth)/profile`

**기능**:

- 반려동물 정보 입력 폼
  - **필수**: 이름, 종류(강아지/고양이), 입양일
  - **선택**: 품종, 생년월일, 성별, 몸무게
- 입력 폼 유효성 검증
- 날짜 선택 (DateTimePicker)

**디자인**:

- 섹션별 입력 필드
- 강아지/고양이 선택 버튼 (이모지 + 텍스트)
- 성별 선택 칩 (남아, 여아, 중성화)

**플로우**:

```
프로필 등록 완료 → 메인 화면 (/(tabs)/)
```

---

## 🎨 디자인 시스템 적용

모든 화면에서 새로운 디자인 시스템을 사용합니다:

```tsx
import {
  useTheme,
  SafeAreaWrapper,
  Container,
  Display,
  Heading,
  Body,
  Button,
  Input,
  // ...
} from '@/design-system';
```

### 주요 컬러

- Primary: `#FF9E80` (따뜻한 코랄)
- Secondary: `#A5D6A7` (부드러운 연두)
- Background: `#FFF9F5` (아이보리)

---

## 🔧 필수 패키지

다음 패키지가 추가되었습니다:

```bash
pnpm install
```

- `@react-native-community/datetimepicker`: 날짜 선택
- `expo-image-picker`: 프로필 사진 업로드 (향후 사용)

---

## 🚀 개발 가이드

### 로그인 플로우 확장

첫 로그인 시 온보딩을 보여주려면 `index.tsx`를 수정하세요:

```tsx
// app/(auth)/index.tsx
const handleKakaoLogin = async () => {
  // ... 로그인 로직

  if (userResult.success && userResult.user) {
    // 첫 로그인인지 확인
    const isFirstLogin = !userResult.user.hasCompletedOnboarding;

    if (isFirstLogin) {
      router.push('/(auth)/onboarding');
    } else {
      login(userResult.user);
    }
  }
};
```

### 프로필 저장 API 연동

`profile.tsx`의 `handleSubmit` 함수를 수정하세요:

```tsx
const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    // API 호출
    const result = await petApi.createProfile({
      name: petName,
      type: petType,
      breed,
      adoptionDate,
      birthDate,
      gender,
      weight: weight ? parseFloat(weight) : undefined,
    });

    if (result.success) {
      router.replace('/(tabs)');
    }
  } catch (error) {
    Alert.alert('오류', '프로필 등록에 실패했습니다.');
  }
};
```

---

## 📝 TODO

- [ ] 첫 로그인 시 온보딩 플로우 추가
- [ ] 프로필 사진 업로드 기능 추가
- [ ] 품종 선택 드롭다운/모달 구현
- [ ] 반려동물 여러 마리 등록 기능
- [ ] 프로필 수정 화면
- [ ] 로딩 상태 개선 (스켈레톤 UI)

---

## 🎯 PRD 체크리스트

- [x] 소셜 로그인 (카카오, 구글, 애플)
- [x] 온보딩 슬라이드 (4개)
- [x] 반려동물 프로필 등록
- [x] 디자인 시스템 적용
- [ ] 프로필 사진 업로드
- [ ] 품종 선택 드롭다운
- [ ] 다반려가구 지원
