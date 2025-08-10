# 🚀 Expo Start Kit

React Native Expo 프로젝트를 빠르게 시작할 수 있는 완전한 시작 키트입니다.

## ✅ 완료된 설정들

### 📦 개발 도구

- **TypeScript** - 타입 안정성을 위한 설정 완료
- **ESLint** - 코드 품질 관리 및 일관성 유지
- **Prettier** - 코드 포맷팅 자동화
- **Path Alias** - `@/` 경로 별칭 설정 완료

### 🏗️ 프로젝트 구조

```
src/
├── components/        # 재사용 가능한 컴포넌트들
│   ├── ui/           # 기본 UI 컴포넌트들 (Button, Input, Card, Text, LoadingSpinner)
│   └── common/       # 공통 컴포넌트들 (SafeAreaView, Screen, Header)
├── screens/          # 화면 컴포넌트들 (HomeScreen, SettingsScreen)
├── navigation/       # 네비게이션 설정 (RootNavigator, TabNavigator)
├── hooks/            # 커스텀 훅들 (useTheme, useAsyncStorage)
├── utils/            # 유틸리티 함수들 (format, validation, storage)
├── constants/        # 상수들 (colors, typography, layout, api)
├── types/            # TypeScript 타입 정의 (navigation, api, user)
├── stores/           # 상태 관리 (useUserStore, useThemeStore)
└── services/         # API 및 서비스 (api, storage)
```

### 🎨 테마 시스템

- **다크/라이트 모드** 지원
- **시스템 설정 자동 감지**
- **색상 팔레트** 체계적 관리
- **타이포그래피** 시스템 구축
- **레이아웃 상수** 정의

### 🧩 UI 컴포넌트

- **Button** - 다양한 스타일 변형 지원
- **Input** - 아이콘, 에러 처리, 패스워드 토글 기능
- **Card** - 그림자 및 패딩 설정 가능
- **Text** - 타이포그래피 시스템 연동
- **LoadingSpinner** - 로딩 상태 표시
- **SafeAreaView** - 안전 영역 처리
- **Screen** - 스크롤, 새로고침 지원 화면 래퍼
- **Header** - 네비게이션 헤더

### 🧭 네비게이션

- **React Navigation v7** 설정 완료
- **Bottom Tab Navigation** 구현
- **Stack Navigation** 구현
- **TypeScript 타입** 완전 지원

### 📦 상태 관리

- **Zustand** - 간단하고 효율적인 상태 관리
- **AsyncStorage 연동** - 데이터 영속성
- **사용자 상태** 관리
- **테마 상태** 관리

### 🌐 API 클라이언트

- **타입 안전한 HTTP 클라이언트**
- **에러 처리** 및 재시도 로직
- **토큰 관리** 자동화
- **Request/Response 인터셉터** 준비

### 🛠️ 유틸리티 함수들

- **포맷팅** - 날짜, 숫자, 문자열 포맷팅
- **유효성 검사** - 이메일, 패스워드, 폼 검증
- **스토리지** - AsyncStorage 래퍼 함수들

### 📱 기본 화면들

- **홈 화면** - 웰컴 메시지 및 기능 소개
- **설정 화면** - 테마 변경 및 각종 설정

## 🚀 시작하기

### 1. 패키지 설치

```bash
pnpm install
```

### 2. 개발 서버 실행

```bash
pnpm start
```

### 3. 플랫폼별 실행

```bash
# iOS
pnpm ios

# Android
pnpm android

# Web
pnpm web
```

## 📝 개발 스크립트

```bash
# 린트 검사
pnpm lint

# 린트 자동 수정
pnpm lint:fix

# 코드 포맷팅
pnpm format

# TypeScript 타입 검사
pnpm type-check

# 테스트
pnpm test
```

## 🔐 커밋 훅

이 저장소는 Husky + lint-staged를 사용합니다. 설치 후 자동으로 활성화되며, 커밋 시 린트/포맷이 자동 실행됩니다.

```bash
pnpm prepare
```

## 🔧 에디터 설정

모든 에디터에서 일관된 코드 스타일을 위해 `.editorconfig`를 제공합니다. VSCode를 사용한다면 다음 플러그인을 권장합니다.

- ESLint
- Prettier

## 🎯 다음 단계

이제 다음과 같은 작업을 진행할 수 있습니다:

1. **환경 변수 설정** - `.env.example`을 참고하여 `.env` 파일 생성
2. **API 엔드포인트 연결** - `src/constants/api.ts`에서 실제 API URL 설정
3. **추가 화면 개발** - `src/screens/`에 새로운 화면 추가
4. **인증 시스템** - 로그인/회원가입 기능 구현
5. **푸시 알림** - Expo Notifications 설정
6. **앱 스토어 배포** - EAS Build 설정

## 📚 기술 스택

- **React Native** - 크로스 플랫폼 모바일 앱 개발
- **Expo** - 개발 및 배포 플랫폼
- **TypeScript** - 정적 타입 검사
- **React Navigation** - 네비게이션 라이브러리
- **Zustand** - 상태 관리
- **React Query** - 서버 상태 관리
- **AsyncStorage** - 로컬 데이터 저장
- **React Native Reanimated** - 애니메이션
- **React Native Gesture Handler** - 제스처 처리

## 📄 라이선스

MIT License

---

**Happy Coding! 🎉**

이 start-kit을 기반으로 멋진 앱을 만들어보세요!
