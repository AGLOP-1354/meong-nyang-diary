# 멍냥일기 로고 사용 가이드

## 🎨 로고 개요

멍냥일기 로고는 **발바닥** 모티브를 사용합니다.

- 강아지와 고양이 모두를 상징
- 따뜻하고 친근한 느낌
- 코랄 컬러 (#FF9E80) 사용

---

## 📦 컴포넌트 종류

### 1. **Logo** - 기본 SVG 로고

```tsx
import { Logo } from '@/components/common/Logo';

<Logo size={80} color="#FF9E80" />;
```

**사용처**:

- 로그인 화면
- 온보딩 화면
- 헤더
- 로딩 스피너

### 2. **LogoWithText** - 배경 + 로고

```tsx
import { LogoWithText } from '@/components/common/Logo';

<LogoWithText size={120} />;
```

**특징**:

- 원형 배경 (코랄 50%)
- 그림자 효과
- 중앙 정렬

### 3. **AppIcon** - 앱 아이콘용

```tsx
import { AppIcon } from '@/components/common/AppIcon';

<AppIcon size={120} gradient={true} />;
```

**특징**:

- 원형 배경 (그라디언트)
- 흰색 발바닥
- 앱 아이콘 생성용

---

## 🎯 크기 가이드

| 용도          | 크기      | 예시            |
| ------------- | --------- | --------------- |
| 탭바 아이콘   | 24-28px   | 하단 네비게이션 |
| 리스트 아이템 | 40-60px   | 설정 화면       |
| 카드/헤더     | 70-100px  | 로그인 화면     |
| 온보딩        | 120-140px | 온보딩 슬라이드 |
| 스플래시      | 150-200px | 앱 시작 화면    |

---

## 🌈 색상 사용

### Primary (기본)

```tsx
<Logo color="#FF9E80" /> // 코랄
```

### 강아지 버전

```tsx
<Logo color="#FF6F00" /> // 주황
```

### 고양이 버전

```tsx
<Logo color="#8E24AA" /> // 보라
```

### 다크모드

```tsx
<Logo color="#FFB085" /> // 밝은 코랄
```

---

## ✅ DO - 올바른 사용

- ✅ 충분한 여백 확보 (최소 20%)
- ✅ 깔끔한 단색 배경 위에 배치
- ✅ 정확한 비율 유지
- ✅ 테마 컬러 사용

## ❌ DON'T - 잘못된 사용

- ❌ 로고 왜곡 (비율 변경 금지)
- ❌ 복잡한 패턴 배경 위
- ❌ 24px 미만으로 축소
- ❌ 임의의 색상 사용
- ❌ 로고 회전/기울임

---

## 📱 플랫폼별 사용

### iOS

- App Icon: 1024x1024
- Splash Screen: 2048x2732 (iPad Pro)
- 3x: 180x180
- 2x: 120x120

### Android

- Launcher Icon: 512x512
- Splash Screen: 1920x1080
- xxxhdpi: 192x192
- xxhdpi: 144x144

---

## 🎬 애니메이션

### 로딩 스피너

```tsx
import { LoadingSpinner } from '@/design-system';

<LoadingSpinner size={60} />;
```

**효과**:

- 펄스 애니메이션 (확대/축소)
- 부드러운 이징

### 로딩 오버레이

```tsx
import { LoadingOverlay } from '@/design-system';

<LoadingOverlay visible={isLoading} />;
```

---

## 🖼️ Export 가이드

### PNG 생성 (앱 아이콘용)

1. 웹 브라우저에서 AppIcon 렌더링
2. Chrome DevTools → Elements → SVG 우클릭
3. "Copy element" 선택
4. SVG to PNG 변환 도구 사용
5. 필요한 크기로 리사이즈

### SVG 최적화

```bash
# SVGO 사용
npx svgo icon.svg -o icon.optimized.svg
```

---

## 📂 파일 구조

```
components/common/
├── Logo.tsx          # 기본 로고 + LogoWithText
├── AppIcon.tsx       # 앱 아이콘용 로고
├── index.ts          # Export
├── README.md         # 사용법
└── LOGO_GUIDE.md     # 이 문서

design-system/components/
└── LoadingSpinner.tsx # 로딩 애니메이션
```

---

## 🔧 커스터마이징 예시

### 테마 컬러 연동

```tsx
import { useTheme } from '@/design-system';

function MyComponent() {
  const { theme } = useTheme();

  return <Logo size={80} color={theme.colors.primary[500]} />;
}
```

### 조건부 색상

```tsx
<Logo size={80} color={petType === 'dog' ? theme.colors.accent.dog : theme.colors.accent.cat} />
```

---

## 📝 향후 계획

- [ ] 강아지/고양이 별도 로고
- [ ] 계절별 테마 로고 (크리스마스, 설날 등)
- [ ] 애니메이션 강화 (로티 파일)
- [ ] 다크모드 전용 로고
- [ ] 3D 로고 버전
