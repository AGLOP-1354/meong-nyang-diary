# 멍냥일기 Design System

> 반려동물과의 소중한 순간을 담는 따뜻하고 친근한 디자인 시스템

---

## 📋 목차

1. [디자인 원칙](#디자인-원칙)
2. [디자인 토큰](#디자인-토큰)
3. [컴포넌트 가이드](#컴포넌트-가이드)
4. [레이아웃 시스템](#레이아웃-시스템)
5. [아이콘 가이드](#아이콘-가이드)
6. [애니메이션](#애니메이션)
7. [다크모드](#다크모드)

---

## 디자인 원칙

### 1. 사진이 주인공

- 텍스트보다 사진을 크고 많이 배치
- 화이트 스페이스로 사진이 돋보이게
- 불필요한 장식 요소 최소화

### 2. 따뜻하고 포근한 톤

- 부드러운 코랄, 연두 색상으로 편안함 전달
- 둥근 모서리로 친근함 표현
- 반려동물에 대한 사랑과 애정이 느껴지는 감성

### 3. 가족 중심

- 여러 사람이 함께 사용하는 앱
- 누구나 쉽게 이해할 수 있는 직관적 UI
- 세대를 아우르는 접근성

### 4. 추억 보관함

- 소중한 순간을 안전하게 보관하는 느낌
- 앨범, 다이어리 메타포 활용
- 오래 보관하고 싶은 클래식한 디자인

---

## 디자인 토큰

### Color Tokens

#### Primary Colors

```css
--color-primary-50: #fff3e0; /* 가장 연한 코랄 */
--color-primary-100: #ffe0b2;
--color-primary-200: #ffcc80;
--color-primary-300: #ffb74d;
--color-primary-400: #ffa726;
--color-primary-500: #ff9e80; /* 메인 코랄 (Primary) */
--color-primary-600: #fb8c00;
--color-primary-700: #f57c00;
--color-primary-800: #ef6c00;
--color-primary-900: #e65100; /* 가장 진한 코랄 */
```

#### Secondary Colors

```css
--color-secondary-50: #f1f8e9; /* 가장 연한 연두 */
--color-secondary-100: #dcedc8;
--color-secondary-200: #c5e1a5;
--color-secondary-300: #aed581;
--color-secondary-400: #9ccc65;
--color-secondary-500: #a5d6a7; /* 메인 연두 (Secondary) */
--color-secondary-600: #7cb342;
--color-secondary-700: #689f38;
--color-secondary-800: #558b2f;
--color-secondary-900: #33691e; /* 가장 진한 연두 */
```

#### Accent Colors (반려동물 구분)

```css
/* 강아지 액센트 */
--color-dog: #ff6f00; /* 주황 */
--color-dog-light: #ffa726;
--color-dog-dark: #e65100;

/* 고양이 액센트 */
--color-cat: #8e24aa; /* 보라 */
--color-cat-light: #ab47bc;
--color-cat-dark: #6a1b9a;
```

#### Neutral Colors

```css
--color-white: #ffffff;
--color-gray-50: #fafafa;
--color-gray-100: #f5f5f5;
--color-gray-200: #eeeeee;
--color-gray-300: #e0e0e0;
--color-gray-400: #bdbdbd;
--color-gray-500: #9e9e9e; /* Text Secondary */
--color-gray-600: #757575;
--color-gray-700: #616161;
--color-gray-800: #424242; /* Text Primary */
--color-gray-900: #212121;
--color-black: #000000;
```

#### Background Colors

```css
--color-bg-primary: #fff9f5; /* 아이보리 배경 */
--color-bg-secondary: #ffffff; /* 카드 배경 */
--color-bg-tertiary: #f5f5f5; /* 섹션 구분 배경 */
```

#### Semantic Colors

```css
/* Success */
--color-success-light: #c8e6c9;
--color-success: #4caf50;
--color-success-dark: #388e3c;

/* Error */
--color-error-light: #ffcdd2;
--color-error: #f44336;
--color-error-dark: #d32f2f;

/* Warning */
--color-warning-light: #ffe082;
--color-warning: #ffc107;
--color-warning-dark: #ffa000;

/* Info */
--color-info-light: #b3e5fc;
--color-info: #03a9f4;
--color-info-dark: #0288d1;
```

---

### Typography Tokens

#### Font Family

```css
--font-primary: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
--font-secondary: 'Pretendard', sans-serif; /* 동일하게 설정 */
```

#### Font Size

```css
/* Display (대형 제목) */
--font-size-display-lg: 32px; /* 2rem */
--font-size-display-md: 28px; /* 1.75rem */
--font-size-display-sm: 24px; /* 1.5rem */

/* Heading (제목) */
--font-size-h1: 24px; /* 1.5rem */
--font-size-h2: 22px; /* 1.375rem */
--font-size-h3: 20px; /* 1.25rem */
--font-size-h4: 18px; /* 1.125rem */

/* Body (본문) */
--font-size-body-lg: 18px; /* 1.125rem */
--font-size-body-md: 16px; /* 1rem - 기본 */
--font-size-body-sm: 14px; /* 0.875rem */

/* Caption (캡션) */
--font-size-caption-lg: 14px; /* 0.875rem */
--font-size-caption-md: 13px; /* 0.8125rem */
--font-size-caption-sm: 12px; /* 0.75rem */

/* Tiny (아주 작은 텍스트) */
--font-size-tiny: 11px; /* 0.6875rem */
```

#### Font Weight

```css
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

#### Line Height

```css
--line-height-tight: 1.2; /* 제목용 */
--line-height-normal: 1.5; /* 본문용 */
--line-height-relaxed: 1.6; /* 긴 텍스트용 */
--line-height-loose: 1.8; /* 여유로운 간격 */
```

#### Letter Spacing

```css
--letter-spacing-tight: -0.02em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.02em;
```

---

### Spacing Tokens

```css
--spacing-0: 0px;
--spacing-1: 4px; /* 0.25rem */
--spacing-2: 8px; /* 0.5rem */
--spacing-3: 12px; /* 0.75rem */
--spacing-4: 16px; /* 1rem */
--spacing-5: 20px; /* 1.25rem */
--spacing-6: 24px; /* 1.5rem */
--spacing-7: 28px; /* 1.75rem */
--spacing-8: 32px; /* 2rem */
--spacing-9: 36px; /* 2.25rem */
--spacing-10: 40px; /* 2.5rem */
--spacing-12: 48px; /* 3rem */
--spacing-14: 56px; /* 3.5rem */
--spacing-16: 64px; /* 4rem */
--spacing-20: 80px; /* 5rem */
--spacing-24: 96px; /* 6rem */
```

#### Spacing Usage Guide

- **Component 내부 padding**: 12px, 16px, 20px
- **요소 간 간격**: 8px, 12px, 16px
- **섹션 간 간격**: 24px, 32px, 40px
- **화면 좌우 여백**: 16px (모바일), 24px (태블릿)

---

### Border Radius Tokens

```css
--radius-none: 0px;
--radius-sm: 4px; /* 작은 요소 (버튼, 태그) */
--radius-md: 8px; /* 중간 요소 (카드) */
--radius-lg: 12px; /* 큰 요소 (모달) */
--radius-xl: 16px; /* 매우 큰 요소 */
--radius-2xl: 20px; /* 특별한 강조 */
--radius-3xl: 24px; /* 최대 둥근 모서리 */
--radius-full: 9999px; /* 완전한 원 (프로필, 아바타) */
```

---

### Shadow Tokens

```css
/* Elevation 1 (낮은 레벨) */
--shadow-sm: 0px 1px 2px rgba(0, 0, 0, 0.05);

/* Elevation 2 (기본 카드) */
--shadow-md: 0px 2px 4px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.06);

/* Elevation 3 (호버 상태) */
--shadow-lg: 0px 4px 8px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.08);

/* Elevation 4 (모달, 드롭다운) */
--shadow-xl: 0px 8px 16px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.1);

/* Elevation 5 (최상위 레이어) */
--shadow-2xl: 0px 16px 32px rgba(0, 0, 0, 0.15), 0px 8px 16px rgba(0, 0, 0, 0.12);

/* Inner Shadow (입력 필드) */
--shadow-inner: inset 0px 2px 4px rgba(0, 0, 0, 0.06);

/* Colored Shadow (강조용) */
--shadow-primary: 0px 4px 12px rgba(255, 158, 128, 0.3);
--shadow-secondary: 0px 4px 12px rgba(165, 214, 167, 0.3);
```

---

### Z-Index Tokens

```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

---

## 컴포넌트 가이드

### Button

#### Primary Button

```css
/* 기본 상태 */
background: var(--color-primary-500);
color: var(--color-white);
padding: 12px 24px;
border-radius: var(--radius-lg);
font-size: var(--font-size-body-md);
font-weight: var(--font-weight-semibold);
box-shadow: var(--shadow-sm);

/* 호버 상태 */
background: var(--color-primary-600);
box-shadow: var(--shadow-md);

/* 눌림 상태 */
background: var(--color-primary-700);
box-shadow: var(--shadow-sm);
transform: translateY(1px);

/* 비활성 상태 */
background: var(--color-gray-300);
color: var(--color-gray-500);
cursor: not-allowed;
box-shadow: none;
```

#### Secondary Button

```css
/* 기본 상태 */
background: var(--color-white);
color: var(--color-primary-500);
border: 2px solid var(--color-primary-500);
padding: 12px 24px;
border-radius: var(--radius-lg);

/* 호버 상태 */
background: var(--color-primary-50);
```

#### Text Button

```css
background: transparent;
color: var(--color-primary-500);
padding: 8px 16px;
font-weight: var(--font-weight-medium);
```

#### Button Sizes

```css
/* Small */
padding: 8px 16px;
font-size: var(--font-size-body-sm);

/* Medium (기본) */
padding: 12px 24px;
font-size: var(--font-size-body-md);

/* Large */
padding: 16px 32px;
font-size: var(--font-size-body-lg);

/* Full Width */
width: 100%;
```

---

### Card

```css
/* 기본 카드 */
background: var(--color-bg-secondary);
border-radius: var(--radius-lg);
padding: var(--spacing-4);
box-shadow: var(--shadow-md);

/* 사진 카드 */
background: var(--color-bg-secondary);
border-radius: var(--radius-lg);
overflow: hidden;
box-shadow: var(--shadow-md);

/* 카드 내부 구조 */
.card-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.card-content {
  padding: var(--spacing-3);
}

.card-footer {
  padding: var(--spacing-3);
  border-top: 1px solid var(--color-gray-200);
}
```

---

### Input Field

```css
/* 기본 입력 필드 */
background: var(--color-gray-100);
border: 2px solid transparent;
border-radius: var(--radius-md);
padding: 12px 16px;
font-size: var(--font-size-body-md);
color: var(--color-gray-800);

/* 포커스 상태 */
background: var(--color-white);
border-color: var(--color-primary-500);
box-shadow: 0px 0px 0px 4px rgba(255, 158, 128, 0.1);

/* 에러 상태 */
border-color: var(--color-error);
box-shadow: 0px 0px 0px 4px rgba(244, 67, 54, 0.1);

/* 비활성 상태 */
background: var(--color-gray-200);
color: var(--color-gray-500);
cursor: not-allowed;
```

---

### Badge (디데이, 상태 표시)

```css
/* 기본 배지 */
background: var(--color-primary-100);
color: var(--color-primary-700);
padding: 4px 12px;
border-radius: var(--radius-full);
font-size: var(--font-size-caption-sm);
font-weight: var(--font-weight-semibold);

/* 디데이 배지 (D+100 등) */
background: var(--color-secondary-100);
color: var(--color-secondary-700);

/* 새 콘텐츠 배지 */
background: var(--color-error);
color: var(--color-white);
```

---

### Avatar (프로필 사진)

```css
/* 기본 아바타 */
width: 40px;
height: 40px;
border-radius: var(--radius-full);
border: 2px solid var(--color-white);
box-shadow: var(--shadow-sm);

/* 크기 변형 */
.avatar-sm {
  width: 32px;
  height: 32px;
}
.avatar-md {
  width: 40px;
  height: 40px;
}
.avatar-lg {
  width: 56px;
  height: 56px;
}
.avatar-xl {
  width: 80px;
  height: 80px;
}

/* 강아지 아바타 */
border-color: var(--color-dog-light);

/* 고양이 아바타 */
border-color: var(--color-cat-light);
```

---

### Modal

```css
/* 모달 오버레이 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: var(--z-modal-backdrop);
  backdrop-filter: blur(4px);
}

/* 모달 컨테이너 */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-2xl);
  z-index: var(--z-modal);
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

/* 모달 헤더 */
.modal-header {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-4);
}

/* 모달 푸터 */
.modal-footer {
  display: flex;
  gap: var(--spacing-3);
  margin-top: var(--spacing-6);
  justify-content: flex-end;
}
```

---

### Bottom Sheet (모바일)

```css
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-white);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: var(--spacing-4) var(--spacing-4) var(--spacing-6);
  box-shadow: var(--shadow-2xl);
  z-index: var(--z-modal);
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
}

/* 열림 상태 */
.bottom-sheet.open {
  transform: translateY(0);
}

/* 핸들 (드래그 인디케이터) */
.bottom-sheet-handle {
  width: 40px;
  height: 4px;
  background: var(--color-gray-300);
  border-radius: var(--radius-full);
  margin: 0 auto var(--spacing-4);
}
```

---

### Tabs

```css
/* 탭 컨테이너 */
.tabs {
  display: flex;
  border-bottom: 2px solid var(--color-gray-200);
  gap: var(--spacing-4);
}

/* 탭 아이템 */
.tab {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-body-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.2s;
}

/* 활성 탭 */
.tab.active {
  color: var(--color-primary-500);
  border-bottom-color: var(--color-primary-500);
  font-weight: var(--font-weight-semibold);
}

/* 호버 상태 */
.tab:hover {
  color: var(--color-primary-400);
}
```

---

## 레이아웃 시스템

### Grid System

```css
/* 사진 그리드 (2열) */
.photo-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-2);
}

/* 사진 그리드 (3열) */
.photo-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-2);
}

/* 반응형 그리드 */
@media (min-width: 768px) {
  .photo-grid-responsive {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Container

```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

/* 최대 너비 제한 (태블릿 이상) */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding: 0 var(--spacing-6);
  }
}
```

### Safe Area (노치 대응)

```css
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## 아이콘 가이드

### 아이콘 스타일

- **스타일**: Line (Outline) 방식
- **두께**: 2px stroke
- **모서리**: Rounded
- **크기**: 20px, 24px, 32px

### 주요 아이콘 목록

```
홈: house
캘린더: calendar
업로드: camera-plus
가족: users
설정: settings
좋아요(빈): heart
좋아요(찬): heart-filled
댓글: message-circle
공유: share
다운로드: download
편집: edit
삭제: trash
더보기: dots-vertical
닫기: x
뒤로: arrow-left
앞으로: arrow-right
위: chevron-up
아래: chevron-down
체크: check
플러스: plus
마이너스: minus
검색: search
알림: bell
강아지: dog (custom)
고양이: cat (custom)
발바닥: paw (custom)
```

### 아이콘 사용 예시

```jsx
/* Small (20px) - 버튼 내부, 리스트 */
<Icon name="heart" size={20} />

/* Medium (24px) - 기본, 네비게이션 */
<Icon name="camera" size={24} />

/* Large (32px) - 강조, 빈 상태 */
<Icon name="paw" size={32} />
```

---

## 애니메이션

### Transition Tokens

```css
--transition-fast: 150ms ease-in-out;
--transition-base: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;
```

### 자주 사용하는 애니메이션

#### Fade In

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn var(--transition-base);
}
```

#### Slide Up

```css
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-up {
  animation: slideUp var(--transition-base);
}
```

#### Scale (좋아요 버튼)

```css
@keyframes heartBeat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.heart-beat {
  animation: heartBeat 0.3s ease-in-out;
}
```

#### Loading Spinner

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

---

## 다크모드

### 다크모드 컬러 토큰

```css
/* 다크모드 활성화 시 */
[data-theme='dark'] {
  /* Background */
  --color-bg-primary: #121212;
  --color-bg-secondary: #1e1e1e;
  --color-bg-tertiary: #2c2c2c;

  /* Text */
  --color-gray-800: #e0e0e0;
  --color-gray-500: #9e9e9e;

  /* Primary (약간 밝게) */
  --color-primary-500: #ffb085;

  /* Borders */
  --color-gray-200: #3a3a3a;
  --color-gray-300: #4a4a4a;

  /* Shadows (더 진하게) */
  --shadow-md: 0px 2px 8px rgba(0, 0, 0, 0.4);
}
```

---

## 브레이크포인트

```css
/* Mobile First */
--breakpoint-sm: 640px; /* 모바일 가로 */
--breakpoint-md: 768px; /* 태블릿 세로 */
--breakpoint-lg: 1024px; /* 태블릿 가로, 작은 노트북 */
--breakpoint-xl: 1280px; /* 데스크톱 */

/* 미디어 쿼리 예시 */
@media (min-width: 768px) {
  /* 태블릿 이상 */
}
```

---

## 접근성 가이드

### 최소 터치 영역

- 모든 인터랙티브 요소는 최소 44x44pt (iOS), 48x48dp (Android)

### 색상 대비

- 일반 텍스트: 최소 4.5:1
- 큰 텍스트 (18px 이상): 최소 3:1
- UI 컴포넌트: 최소 3:1

### 포커스 표시

```css
*:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

---

## 파일 구조 (참고)

```
/design
  /tokens
    colors.json
    typography.json
    spacing.json
  /components
    Button.md
    Card.md
    Input.md
  /assets
    /icons
    /illustrations
  design.md (이 문서)
```

---

## 변경 이력

| 버전 | 날짜       | 변경 내용 | 작성자 |
| ---- | ---------- | --------- | ------ |
| 1.0  | 2025.11.04 | 초안 작성 | 기획자 |

---

**최종 수정일**: 2025년 11월 4일  
**문서 상태**: 검토 완료
