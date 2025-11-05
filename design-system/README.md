# 멍냥일기 디자인 시스템

반려동물과의 소중한 순간을 담는 따뜻하고 친근한 디자인 시스템

## 📦 설치

디자인 시스템은 프로젝트 내부에 포함되어 있습니다.

```tsx
import { ThemeProvider, useTheme, Button, Card } from '@/design-system';
```

## 🎨 디자인 원칙

1. **사진이 주인공**: 텍스트보다 사진을 크고 많이 배치
2. **따뜻하고 포근한 톤**: 부드러운 코랄, 연두 색상으로 편안함 전달
3. **가족 중심**: 여러 사람이 함께 사용하는 앱
4. **추억 보관함**: 소중한 순간을 안전하게 보관하는 느낌

## 🚀 사용법

### 1. ThemeProvider 설정

앱의 최상위에 `ThemeProvider`를 추가하세요.

```tsx
import { ThemeProvider } from '@/design-system';

export default function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. useTheme Hook 사용

```tsx
import { useTheme } from '@/design-system';

function MyComponent() {
  const { theme, mode, toggleMode } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.neutral[800] }}>Hello</Text>
    </View>
  );
}
```

### 3. 컴포넌트 사용

#### Button

```tsx
import { Button } from '@/design-system';

<Button onPress={() => {}} variant="primary" size="medium">
  클릭하세요
</Button>;
```

**Props:**

- `variant`: `'primary' | 'secondary' | 'text'`
- `size`: `'small' | 'medium' | 'large'`
- `disabled`: `boolean`
- `loading`: `boolean`
- `fullWidth`: `boolean`

#### Card

```tsx
import { Card, PhotoCard } from '@/design-system';

<Card padding={16}>
  <Text>카드 내용</Text>
</Card>

<PhotoCard>
  <Image source={...} />
</PhotoCard>
```

#### Input

```tsx
import { Input } from '@/design-system';

<Input
  label="이름"
  placeholder="반려동물 이름을 입력하세요"
  error="필수 입력 항목입니다"
  value={value}
  onChangeText={setValue}
/>;
```

#### Badge

```tsx
import { Badge } from '@/design-system';

<Badge variant="default">기본</Badge>
<Badge variant="dday">D+100</Badge>
<Badge variant="new">NEW</Badge>
```

#### Avatar

```tsx
import { Avatar } from '@/design-system';

<Avatar
  source={{ uri: 'https://...' }}
  size="md"
  petType="dog" // 'dog' | 'cat' | 'none'
/>;
```

### 4. 레이아웃 컴포넌트

#### Container

```tsx
import { Container } from '@/design-system';

<Container padding={true}>
  <YourContent />
</Container>;
```

#### Grid / PhotoGrid

```tsx
import { PhotoGrid } from '@/design-system';

<PhotoGrid columns={2} gap={8}>
  <Image source={...} />
  <Image source={...} />
  <Image source={...} />
</PhotoGrid>
```

### 5. Typography

```tsx
import { Display, Heading, Body, Caption } from '@/design-system';

<Display size="lg">대형 제목</Display>
<Heading level={1}>제목 1</Heading>
<Body size="md">본문 텍스트</Body>
<Caption size="sm">작은 캡션</Caption>
```

## 🎨 디자인 토큰

### Colors

```tsx
theme.colors.primary[500]; // #FF9E80 (메인 코랄)
theme.colors.secondary[500]; // #A5D6A7 (메인 연두)
theme.colors.accent.dog; // #FF6F00 (강아지 색상)
theme.colors.accent.cat; // #8E24AA (고양이 색상)
theme.colors.background.primary; // #FFF9F5 (아이보리 배경)
theme.colors.neutral[800]; // #424242 (텍스트 색상)
```

### Typography

```tsx
theme.typography.fontSize.h1; // 24
theme.typography.fontSize.bodyMd; // 16
theme.typography.fontWeight.semibold; // '600'
```

### Spacing

```tsx
theme.spacing[1]; // 4px
theme.spacing[2]; // 8px
theme.spacing[4]; // 16px
theme.spacing[6]; // 24px
```

### Radius

```tsx
theme.radius.sm; // 4
theme.radius.md; // 8
theme.radius.lg; // 12
theme.radius.full; // 9999
```

### Shadows

```tsx
theme.shadows.sm; // 낮은 그림자
theme.shadows.md; // 기본 카드 그림자
theme.shadows.lg; // 호버 상태 그림자
```

## 🌙 다크모드

다크모드는 자동으로 시스템 설정을 따릅니다.

```tsx
const { mode, setMode, toggleMode } = useTheme();

// 수동으로 변경
setMode('dark');

// 토글
toggleMode();
```

## 📝 예제

### 사진 카드 목록

```tsx
import { PhotoGrid, PhotoCard } from '@/design-system';

function PhotoList({ photos }) {
  return (
    <PhotoGrid columns={2} gap={8}>
      {photos.map((photo) => (
        <PhotoCard key={photo.id}>
          <Image source={{ uri: photo.url }} style={{ aspectRatio: 1 }} />
        </PhotoCard>
      ))}
    </PhotoGrid>
  );
}
```

### 프로필 카드

```tsx
import { Card, Avatar, Heading, Body } from '@/design-system';

function ProfileCard({ pet }) {
  return (
    <Card>
      <Avatar source={{ uri: pet.photo }} size="xl" petType="dog" />
      <Heading level={2}>{pet.name}</Heading>
      <Body size="sm">{pet.breed}</Body>
    </Card>
  );
}
```

## 📚 참고

- PRD: `/require/prd.md`
- 디자인 가이드: `/require/design.md`
