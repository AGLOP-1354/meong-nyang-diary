# 디자인 시스템 마이그레이션 가이드

기존 `constants/theme.ts`에서 새로운 디자인 시스템으로 마이그레이션하는 가이드입니다.

## 🔍 영향을 받는 파일

다음 파일들이 기존 theme을 사용하고 있습니다:

1. `app/(tabs)/box/[folderId].tsx`
2. `app/(auth)/index.tsx`
3. `components/box/BoxLinkItem.tsx`
4. `components/box/BoxHeader.tsx`
5. `components/box/BoxChildItem.tsx`
6. `components/auth/authScreenStyles.ts`
7. `hooks/useTheme.ts`

## 📝 마이그레이션 단계

### 1. hooks/useTheme.ts 업데이트

기존:

```tsx
import { getThemeByScheme, type Theme } from '@/constants/theme';
```

새로운 방식:

```tsx
import { useTheme } from '@/design-system';

// 컴포넌트에서 사용
const { theme, mode } = useTheme();
```

### 2. 컬러 매핑

기존 theme과 새로운 디자인 시스템의 컬러 매핑:

| 기존 (constants/theme.ts) | 새로운 (design-system)              |
| ------------------------- | ----------------------------------- |
| `surfaceDefault`          | `theme.colors.background.secondary` |
| `surfaceDefault2`         | `theme.colors.background.tertiary`  |
| `surfacePrimary`          | `theme.colors.primary[500]`         |
| `borderDefault`           | `theme.colors.neutral[200]`         |
| `textColorDefault`        | `theme.colors.neutral[800]`         |
| `textColorSecondary`      | `theme.colors.neutral[600]`         |
| `textColorPrimary`        | `theme.colors.primary[500]`         |
| `iconColorDefault`        | `theme.colors.neutral[800]`         |
| `iconColorPrimary`        | `theme.colors.primary[500]`         |
| `buttonPrimarySurface`    | `theme.colors.primary[500]`         |

### 3. 컴포넌트 예제

#### Before (기존)

```tsx
import { lightTheme } from '@/constants/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: lightTheme.surfaceDefault,
    borderColor: lightTheme.borderDefault,
  },
  text: {
    color: lightTheme.textColorDefault,
  },
});
```

#### After (새로운 방식)

```tsx
import { useTheme } from '@/design-system';

function MyComponent() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.secondary,
      borderColor: theme.colors.neutral[200],
    },
    text: {
      color: theme.colors.neutral[800],
    },
  });

  return ...;
}
```

#### 더 나은 방법 (디자인 시스템 컴포넌트 사용)

```tsx
import { Card, Body, useTheme } from '@/design-system';

function MyComponent() {
  const { theme } = useTheme();

  return (
    <Card>
      <Body>텍스트 내용</Body>
    </Card>
  );
}
```

### 4. 파일별 마이그레이션 예시

#### app/(auth)/index.tsx

```tsx
// Before
import { getThemeByScheme } from '@/constants/theme';
const theme = getThemeByScheme(colorScheme);

// After
import { useTheme } from '@/design-system';
const { theme } = useTheme();
```

#### components/auth/authScreenStyles.ts

```tsx
// Before
import { type Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.surfaceDefault,
    },
  });

// After
import { type Theme } from '@/design-system';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.secondary,
    },
  });
```

## 🎯 권장 마이그레이션 순서

1. **hooks/useTheme.ts** - 새로운 디자인 시스템의 useTheme으로 교체
2. **app/\_layout.tsx** - ThemeProvider 추가
3. **각 화면 파일들** - useTheme hook 사용으로 변경
4. **컴포넌트 파일들** - 디자인 시스템 컴포넌트로 교체 (선택사항)

## 🚀 빠른 시작

1. `app/_layout.tsx`에 ThemeProvider 추가:

```tsx
import { ThemeProvider } from '@/design-system';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}
```

2. 기존 파일들을 하나씩 마이그레이션

3. 모든 파일 마이그레이션 완료 후 `constants/theme.ts.old` 삭제

## 💡 팁

- 디자인 시스템의 공통 컴포넌트(Button, Card, Input 등)를 적극 활용하세요
- 색상을 직접 지정하는 대신 디자인 토큰을 사용하세요
- 샘플 파일(`design-system/examples/SampleScreen.tsx`)을 참고하세요

## ❓ 문제 해결

### "useTheme must be used within a ThemeProvider" 에러

→ `app/_layout.tsx`에 ThemeProvider가 추가되었는지 확인하세요

### 색상이 이상하게 보임

→ 컬러 매핑 테이블을 참고하여 올바른 색상 토큰을 사용하고 있는지 확인하세요

### 다크모드가 작동하지 않음

→ 새로운 디자인 시스템은 자동으로 시스템 다크모드를 지원합니다. `useTheme`에서 `mode`를 확인하세요
