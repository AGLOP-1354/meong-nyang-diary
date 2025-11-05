# 멍냥일기 로고 컴포넌트

## 📦 컴포넌트

### 1. Logo

카메라 + 강아지/고양이 로고 (SVG)

```tsx
import { Logo } from '@/components/common/Logo';

// 기본 사용
<Logo />

// 크기 조정
<Logo size={80} />

// 색상 지정
<Logo size={80} color="#FF9E80" />
```

**Props**:

- `size`: 로고 크기 (기본값: 80)
- `color`: 로고 색상 (기본값: theme.colors.primary[500])

---

### 2. LogoWithText

로고 + 배경이 있는 버전

```tsx
import { LogoWithText } from '@/components/common/Logo';

<LogoWithText size={120} />;
```

**Props**:

- `size`: 컨테이너 크기 (기본값: 80)

**특징**:

- 원형 배경 (코랄 50% 색상)
- 그림자 효과
- 중앙 정렬

---

### 3. AppIcon

앱 아이콘용 (그라디언트 지원)

```tsx
import { AppIcon } from '@/components/common/AppIcon';

// 그라디언트 버전 (기본)
<AppIcon size={120} />

// 단색 버전
<AppIcon size={120} gradient={false} />
```

**Props**:

- `size`: 아이콘 크기 (기본값: 120)
- `gradient`: 그라디언트 사용 여부 (기본값: true)

**특징**:

- 원형 배경
- 흰색 발바닥
- 그라디언트 (#FFB74D → #FF9E80)

---

## 🎨 로고 디자인

### 카메라 구성

```
    ┌──┐
    │  │          ← 카메라 상단 돌출부
┌───┴──┴────┐
│  ●      ▪  │    ← 플래시
│           │
│   ╭───╮   │
│   │🐶🐱│   │    ← 렌즈 안 강아지/고양이
│   ╰─♥─╯   │
└───────────┘
```

**구성 요소**:

- 카메라 본체 (둥근 모서리)
- 상단 돌출부 (뷰파인더)
- 플래시
- 중앙 렌즈 (흰색 원)
- 강아지 실루엣 (왼쪽)
- 고양이 실루엣 (오른쪽)
- 작은 하트 (중앙)

### 컬러

- **Primary**: `#FF9E80` (따뜻한 코랄)
- **Gradient Start**: `#FFB74D` (밝은 주황)
- **Gradient End**: `#FF9E80` (코랄)
- **Background**: `#FFF3E0` (코랄 50%)

---

## 📱 사용 예시

### 로그인 화면

```tsx
import { Logo } from '@/components/common/Logo';

<View style={styles.logoContainer}>
  <Logo size={70} />
</View>;
```

### 온보딩 화면

```tsx
import { Logo } from '@/components/common/Logo';

{
  slide.emoji === 'logo' ? <Logo size={80} /> : <Text style={styles.emoji}>{slide.emoji}</Text>;
}
```

### 스플래시 스크린

```tsx
import { AppIcon } from '@/components/common/AppIcon';

<View style={styles.splash}>
  <AppIcon size={150} />
</View>;
```

---

## 🖼️ 앱 아이콘 생성

### iOS 아이콘

필요한 크기:

- 1024x1024 (App Store)
- 180x180 (@3x)
- 120x120 (@2x)
- 60x60 (@1x)

### Android 아이콘

필요한 크기:

- 512x512 (Google Play)
- 192x192 (xxxhdpi)
- 144x144 (xxhdpi)
- 96x96 (xhdpi)
- 72x72 (hdpi)
- 48x48 (mdpi)

### 생성 방법

1. `AppIcon` 컴포넌트를 웹 브라우저에서 렌더링
2. SVG를 PNG로 export
3. 각 플랫폼별 크기로 리사이즈
4. `assets/` 폴더에 저장

---

## 🎯 디자인 가이드

### 사용 위치

- ✅ 로그인 화면
- ✅ 온보딩 첫 화면
- ✅ 스플래시 스크린
- ✅ 앱 아이콘
- ✅ 로딩 화면

### 사용 금지

- ❌ 너무 작은 크기 (24px 미만)
- ❌ 복잡한 배경 위
- ❌ 로고 왜곡 (비율 변경)

### 여백

- 최소 여백: 로고 크기의 20%
- 권장 여백: 로고 크기의 30%

---

## 🔧 커스터마이징

### 색상 변경

```tsx
// 테마 색상 사용 (권장)
<Logo color={theme.colors.primary[500]} />

// 직접 색상 지정
<Logo color="#FF6F00" />
```

### 크기 가이드

- **Small**: 40-60px (리스트 아이템)
- **Medium**: 70-100px (카드, 헤더)
- **Large**: 120-180px (온보딩, 스플래시)

---

## 📝 TODO

- [ ] PNG 앱 아이콘 export 자동화
- [ ] 다크모드 버전 로고
- [ ] 애니메이션 로고 (로딩용)
- [ ] 로고 변형 (강아지/고양이 버전)
