# 멍냥일기 Backend Architecture (Supabase)

> 마지막 업데이트: 2025년 11월 5일
> 버전: v0.1.0-alpha
> 상태: 설계 단계

---

## 📋 목차

1. [개요](#개요)
2. [기술 스택](#기술-스택)
3. [데이터베이스 스키마](#데이터베이스-스키마)
4. [Supabase Storage 구조](#supabase-storage-구조)
5. [Row Level Security (RLS) 정책](#row-level-security-rls-정책)
6. [API 엔드포인트](#api-엔드포인트)
7. [인증 흐름](#인증-흐름)
8. [실시간 기능](#실시간-기능)
9. [성능 최적화](#성능-최적화)
10. [배포 및 환경 설정](#배포-및-환경-설정)

---

## 개요

### 아키텍처 설계 원칙

1. **가족 중심 데이터 구조**: 여러 사용자가 하나의 반려동물 데이터를 안전하게 공유
2. **권한 기반 접근 제어**: 관리자/가족/읽기 전용 권한 구분
3. **확장 가능한 구조**: 다반려 가구, 여러 가족 그룹 지원
4. **보안 최우선**: RLS를 통한 데이터 격리, 프라이버시 보호
5. **성능 최적화**: 적절한 인덱싱, 쿼리 최적화, 캐싱 전략

### 핵심 데이터 플로우

```
사용자 인증 (Supabase Auth - Kakao/Google/Apple)
    ↓
프로필 생성 (profiles 테이블)
    ↓
반려동물 등록 (pets 테이블)
    ↓
가족 초대 (pet_members 테이블에 관계 추가)
    ↓
사진 업로드 (Storage → photos 테이블)
    ↓
가족 상호작용 (댓글, 좋아요)
    ↓
자동 기념일 생성 (milestones 테이블)
```

---

## 기술 스택

### Backend
- **Database**: Supabase (PostgreSQL 15)
- **Authentication**: Supabase Auth
  - Social OAuth: Kakao, Google, Apple
  - JWT 기반 인증
- **Storage**: Supabase Storage
  - 사진, 동영상, 프로필 이미지
- **Real-time**: Supabase Realtime
  - 댓글, 좋아요 실시간 업데이트
- **Edge Functions**: Supabase Edge Functions (Deno)
  - 영상 생성, 이미지 처리, 알림 발송

### 보안
- Row Level Security (RLS)
- API Key 관리
- CORS 설정
- Rate Limiting

### 모니터링
- Supabase Dashboard
- Sentry (에러 트래킹)
- LogRocket (사용자 행동 분석)

---

## 데이터베이스 스키마

### ERD 개요

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   profiles  │───────│ pet_members  │───────│    pets     │
│             │ 1:N   │              │ N:1   │             │
└─────────────┘       └──────────────┘       └─────────────┘
                              │                      │
                              │                      │ 1:N
                              │                      ↓
                              │              ┌─────────────┐
                              │              │   photos    │
                              │              └─────────────┘
                              │                      │
                              │                      │ 1:N
                              │              ┌───────┴───────┐
                              │              ↓               ↓
                              │      ┌──────────────┐ ┌──────────────┐
                              │      │photo_comments│ │ photo_likes  │
                              │      └──────────────┘ └──────────────┘
                              │
                              │ 1:N
                              ↓
                      ┌──────────────┐
                      │  milestones  │
                      └──────────────┘
```

---

### 1. `profiles` 테이블

**목적**: Supabase Auth의 users 확장, 사용자 프로필 정보

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,

  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_sign_in_at TIMESTAMPTZ,

  -- 알림 설정
  push_enabled BOOLEAN DEFAULT TRUE,
  email_enabled BOOLEAN DEFAULT TRUE,

  -- 앱 설정
  dark_mode BOOLEAN DEFAULT FALSE,
  language TEXT DEFAULT 'ko',

  CONSTRAINT profiles_display_name_length CHECK (char_length(display_name) >= 1)
);

-- 인덱스
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- Updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 자신의 프로필만 읽기/수정 가능
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

---

### 2. `pets` 테이블

**목적**: 반려동물 기본 정보

```sql
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 기본 정보
  name TEXT NOT NULL,
  profile_image_url TEXT,
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat', 'other')),
  breed TEXT,

  -- 중요 날짜
  adoption_date DATE NOT NULL, -- 가장 중요! D-day 계산 기준
  birth_date DATE,

  -- 추가 정보
  gender TEXT CHECK (gender IN ('male', 'female', 'neutered_male', 'neutered_female')),
  weight_kg NUMERIC(5, 2),

  -- 소유자 (펫을 처음 등록한 사람)
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE, -- Soft delete
  deleted_at TIMESTAMPTZ,

  CONSTRAINT pets_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 50),
  CONSTRAINT pets_adoption_date_valid CHECK (adoption_date <= CURRENT_DATE),
  CONSTRAINT pets_birth_date_valid CHECK (birth_date IS NULL OR birth_date <= CURRENT_DATE)
);

-- 인덱스
CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_pets_adoption_date ON pets(adoption_date);
CREATE INDEX idx_pets_created_at ON pets(created_at);
CREATE INDEX idx_pets_is_deleted ON pets(is_deleted) WHERE is_deleted = FALSE;

-- Updated_at 트리거
CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON pets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 해당 펫의 멤버만 조회 가능
CREATE POLICY "Members can view their pets"
  ON pets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pet_members
      WHERE pet_members.pet_id = pets.id
        AND pet_members.user_id = auth.uid()
        AND pet_members.status = 'active'
    )
  );

-- 소유자만 수정/삭제 가능
CREATE POLICY "Owners can update their pets"
  ON pets FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their pets"
  ON pets FOR DELETE
  USING (owner_id = auth.uid());

-- 인증된 사용자는 펫 생성 가능
CREATE POLICY "Authenticated users can create pets"
  ON pets FOR INSERT
  WITH CHECK (auth.uid() = owner_id);
```

---

### 3. `pet_members` 테이블

**목적**: 펫과 사용자의 다대다 관계, 가족 구성원 관리, 권한 설정

```sql
CREATE TYPE member_role AS ENUM ('admin', 'family', 'viewer');
CREATE TYPE member_status AS ENUM ('active', 'invited', 'declined', 'removed');

CREATE TABLE pet_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 관계
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- 권한
  role member_role NOT NULL DEFAULT 'family',
  -- admin: 모든 권한 (펫 삭제, 멤버 관리)
  -- family: 사진 업로드, 댓글, 좋아요
  -- viewer: 읽기 전용

  -- 상태
  status member_status NOT NULL DEFAULT 'active',

  -- 초대 정보
  invited_by UUID REFERENCES profiles(id),
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ,

  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 제약 조건: 한 사용자는 한 펫에 한 번만 등록
  UNIQUE(pet_id, user_id)
);

-- 인덱스
CREATE INDEX idx_pet_members_pet_id ON pet_members(pet_id);
CREATE INDEX idx_pet_members_user_id ON pet_members(user_id);
CREATE INDEX idx_pet_members_role ON pet_members(role);
CREATE INDEX idx_pet_members_status ON pet_members(status);
CREATE INDEX idx_pet_members_composite ON pet_members(pet_id, user_id, status);

-- Updated_at 트리거
CREATE TRIGGER update_pet_members_updated_at
  BEFORE UPDATE ON pet_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 펫 생성 시 소유자를 자동으로 admin으로 추가하는 트리거
CREATE OR REPLACE FUNCTION add_owner_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO pet_members (pet_id, user_id, role, status, joined_at)
  VALUES (NEW.id, NEW.owner_id, 'admin', 'active', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_pet_owner_as_member
  AFTER INSERT ON pets
  FOR EACH ROW
  EXECUTE FUNCTION add_owner_as_admin();

-- RLS 활성화
ALTER TABLE pet_members ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Members can view pet members"
  ON pet_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pet_members pm
      WHERE pm.pet_id = pet_members.pet_id
        AND pm.user_id = auth.uid()
        AND pm.status = 'active'
    )
  );

-- Admin만 멤버 추가/수정/삭제 가능
CREATE POLICY "Admins can manage members"
  ON pet_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pet_members pm
      WHERE pm.pet_id = pet_members.pet_id
        AND pm.user_id = auth.uid()
        AND pm.role = 'admin'
        AND pm.status = 'active'
    )
  );
```

---

### 4. `photos` 테이블

**목적**: 사진 정보 및 메타데이터

```sql
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 관계
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- 파일 정보
  storage_path TEXT NOT NULL, -- Supabase Storage 경로
  file_name TEXT NOT NULL,
  file_size_bytes BIGINT,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,

  -- 촬영 정보
  taken_at TIMESTAMPTZ NOT NULL, -- 사진 촬영 시간 (EXIF 또는 업로드 시간)
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 위치 정보 (선택)
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  location_name TEXT, -- 예: "서울숲", "우리 집"

  -- 캡션
  caption TEXT,

  -- D-day 정보 (캐싱 목적, pets.adoption_date 기준 계산)
  days_since_adoption INTEGER, -- NULL이면 자동 계산

  -- 통계
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,

  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,

  CONSTRAINT photos_caption_length CHECK (caption IS NULL OR char_length(caption) <= 500)
);

-- 인덱스
CREATE INDEX idx_photos_pet_id ON photos(pet_id);
CREATE INDEX idx_photos_uploaded_by ON photos(uploaded_by);
CREATE INDEX idx_photos_taken_at ON photos(taken_at DESC);
CREATE INDEX idx_photos_uploaded_at ON photos(uploaded_at DESC);
CREATE INDEX idx_photos_pet_taken ON photos(pet_id, taken_at DESC);
CREATE INDEX idx_photos_is_deleted ON photos(is_deleted) WHERE is_deleted = FALSE;

-- Updated_at 트리거
CREATE TRIGGER update_photos_updated_at
  BEFORE UPDATE ON photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- days_since_adoption 자동 계산 트리거
CREATE OR REPLACE FUNCTION calculate_days_since_adoption()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.days_since_adoption IS NULL THEN
    SELECT DATE_PART('day', NEW.taken_at::DATE - pets.adoption_date)
    INTO NEW.days_since_adoption
    FROM pets
    WHERE pets.id = NEW.pet_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_photo_days
  BEFORE INSERT OR UPDATE ON photos
  FOR EACH ROW
  EXECUTE FUNCTION calculate_days_since_adoption();

-- RLS 활성화
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 해당 펫의 멤버만 조회 가능
CREATE POLICY "Members can view photos"
  ON photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pet_members
      WHERE pet_members.pet_id = photos.pet_id
        AND pet_members.user_id = auth.uid()
        AND pet_members.status = 'active'
    )
  );

-- Family 이상 권한: 사진 업로드 가능
CREATE POLICY "Family members can upload photos"
  ON photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pet_members
      WHERE pet_members.pet_id = photos.pet_id
        AND pet_members.user_id = auth.uid()
        AND pet_members.role IN ('admin', 'family')
        AND pet_members.status = 'active'
    )
    AND uploaded_by = auth.uid()
  );

-- 본인이 업로드한 사진만 수정/삭제 가능
CREATE POLICY "Users can update own photos"
  ON photos FOR UPDATE
  USING (uploaded_by = auth.uid());

CREATE POLICY "Users can delete own photos"
  ON photos FOR DELETE
  USING (uploaded_by = auth.uid());
```

---

### 5. `photo_likes` 테이블

**목적**: 사진 좋아요

```sql
CREATE TABLE photo_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 관계
  photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 제약: 한 사용자는 한 사진에 한 번만 좋아요
  UNIQUE(photo_id, user_id)
);

-- 인덱스
CREATE INDEX idx_photo_likes_photo_id ON photo_likes(photo_id);
CREATE INDEX idx_photo_likes_user_id ON photo_likes(user_id);
CREATE INDEX idx_photo_likes_created_at ON photo_likes(created_at DESC);

-- 좋아요 추가 시 photos.likes_count 증가
CREATE OR REPLACE FUNCTION increment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE photos
  SET likes_count = likes_count + 1
  WHERE id = NEW.photo_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_photo_likes
  AFTER INSERT ON photo_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_likes_count();

-- 좋아요 삭제 시 photos.likes_count 감소
CREATE OR REPLACE FUNCTION decrement_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE photos
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = OLD.photo_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrement_photo_likes
  AFTER DELETE ON photo_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_likes_count();

-- RLS 활성화
ALTER TABLE photo_likes ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Members can view likes"
  ON photo_likes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM photos
      INNER JOIN pet_members ON photos.pet_id = pet_members.pet_id
      WHERE photos.id = photo_likes.photo_id
        AND pet_members.user_id = auth.uid()
        AND pet_members.status = 'active'
    )
  );

-- Family 이상: 좋아요 추가/삭제 가능
CREATE POLICY "Family members can like photos"
  ON photo_likes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM photos
      INNER JOIN pet_members ON photos.pet_id = pet_members.pet_id
      WHERE photos.id = photo_likes.photo_id
        AND pet_members.user_id = auth.uid()
        AND pet_members.role IN ('admin', 'family')
        AND pet_members.status = 'active'
    )
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can remove own likes"
  ON photo_likes FOR DELETE
  USING (user_id = auth.uid());
```

---

### 6. `photo_comments` 테이블

**목적**: 사진 댓글

```sql
CREATE TABLE photo_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 관계
  photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- 댓글 내용
  content TEXT NOT NULL,

  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE, -- Soft delete
  deleted_at TIMESTAMPTZ,

  CONSTRAINT comments_content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 1000)
);

-- 인덱스
CREATE INDEX idx_photo_comments_photo_id ON photo_comments(photo_id);
CREATE INDEX idx_photo_comments_user_id ON photo_comments(user_id);
CREATE INDEX idx_photo_comments_created_at ON photo_comments(created_at DESC);
CREATE INDEX idx_photo_comments_is_deleted ON photo_comments(is_deleted) WHERE is_deleted = FALSE;

-- Updated_at 트리거
CREATE TRIGGER update_photo_comments_updated_at
  BEFORE UPDATE ON photo_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 댓글 수정 시 is_edited 자동 설정
CREATE OR REPLACE FUNCTION mark_comment_as_edited()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.content IS DISTINCT FROM NEW.content THEN
    NEW.is_edited = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mark_edited_comment
  BEFORE UPDATE ON photo_comments
  FOR EACH ROW
  EXECUTE FUNCTION mark_comment_as_edited();

-- 댓글 추가 시 photos.comments_count 증가
CREATE OR REPLACE FUNCTION increment_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE photos
  SET comments_count = comments_count + 1
  WHERE id = NEW.photo_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_photo_comments
  AFTER INSERT ON photo_comments
  FOR EACH ROW
  EXECUTE FUNCTION increment_comments_count();

-- 댓글 삭제 시 photos.comments_count 감소
CREATE OR REPLACE FUNCTION decrement_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE photos
  SET comments_count = GREATEST(comments_count - 1, 0)
  WHERE id = OLD.photo_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrement_photo_comments
  AFTER DELETE ON photo_comments
  FOR EACH ROW
  EXECUTE FUNCTION decrement_comments_count();

-- RLS 활성화
ALTER TABLE photo_comments ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Members can view comments"
  ON photo_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM photos
      INNER JOIN pet_members ON photos.pet_id = pet_members.pet_id
      WHERE photos.id = photo_comments.photo_id
        AND pet_members.user_id = auth.uid()
        AND pet_members.status = 'active'
    )
    AND is_deleted = FALSE
  );

-- Family 이상: 댓글 작성 가능
CREATE POLICY "Family members can comment"
  ON photo_comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM photos
      INNER JOIN pet_members ON photos.pet_id = pet_members.pet_id
      WHERE photos.id = photo_comments.photo_id
        AND pet_members.user_id = auth.uid()
        AND pet_members.role IN ('admin', 'family')
        AND pet_members.status = 'active'
    )
    AND user_id = auth.uid()
  );

-- 본인 댓글만 수정/삭제 가능
CREATE POLICY "Users can update own comments"
  ON photo_comments FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own comments"
  ON photo_comments FOR DELETE
  USING (user_id = auth.uid());
```

---

### 7. `milestones` 테이블

**목적**: 자동 생성되는 기념일 (D+100, 1살 등)

```sql
CREATE TYPE milestone_type AS ENUM ('day_100', 'day_200', 'day_300', 'day_365', 'birthday', 'adoption_anniversary', 'custom');

CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 관계
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,

  -- 기념일 정보
  type milestone_type NOT NULL,
  title TEXT NOT NULL, -- 예: "보리 입양 100일", "보리 1살"
  description TEXT,
  milestone_date DATE NOT NULL,
  days_count INTEGER, -- D+100, D+365 등

  -- 자동 생성 여부
  is_auto_generated BOOLEAN DEFAULT TRUE,

  -- 알림 설정
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_sent_at TIMESTAMPTZ,

  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_milestones_pet_id ON milestones(pet_id);
CREATE INDEX idx_milestones_milestone_date ON milestones(milestone_date);
CREATE INDEX idx_milestones_type ON milestones(type);
CREATE INDEX idx_milestones_notification ON milestones(notification_sent, milestone_date) WHERE notification_sent = FALSE;

-- Updated_at 트리거
CREATE TRIGGER update_milestones_updated_at
  BEFORE UPDATE ON milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 펫 생성 시 주요 기념일 자동 생성 함수
CREATE OR REPLACE FUNCTION create_pet_milestones()
RETURNS TRIGGER AS $$
BEGIN
  -- D+100
  INSERT INTO milestones (pet_id, type, title, milestone_date, days_count)
  VALUES (NEW.id, 'day_100', NEW.name || ' 입양 100일', NEW.adoption_date + INTERVAL '100 days', 100);

  -- D+200
  INSERT INTO milestones (pet_id, type, title, milestone_date, days_count)
  VALUES (NEW.id, 'day_200', NEW.name || ' 입양 200일', NEW.adoption_date + INTERVAL '200 days', 200);

  -- D+365 (1주년)
  INSERT INTO milestones (pet_id, type, title, milestone_date, days_count)
  VALUES (NEW.id, 'day_365', NEW.name || ' 입양 1주년', NEW.adoption_date + INTERVAL '365 days', 365);

  -- 생일이 있으면 매년 생일 추가 (향후 5년치)
  IF NEW.birth_date IS NOT NULL THEN
    FOR i IN 0..5 LOOP
      INSERT INTO milestones (pet_id, type, title, milestone_date)
      VALUES (NEW.id, 'birthday', NEW.name || '의 생일', NEW.birth_date + (i || ' years')::INTERVAL);
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_milestones_on_pet_creation
  AFTER INSERT ON pets
  FOR EACH ROW
  EXECUTE FUNCTION create_pet_milestones();

-- RLS 활성화
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Members can view milestones"
  ON milestones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pet_members
      WHERE pet_members.pet_id = milestones.pet_id
        AND pet_members.user_id = auth.uid()
        AND pet_members.status = 'active'
    )
  );

-- Admin만 커스텀 기념일 추가/수정/삭제 가능
CREATE POLICY "Admins can manage milestones"
  ON milestones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pet_members
      WHERE pet_members.pet_id = milestones.pet_id
        AND pet_members.user_id = auth.uid()
        AND pet_members.role = 'admin'
        AND pet_members.status = 'active'
    )
  );
```

---

### 8. `videos` 테이블 (Phase 2)

**목적**: 자동 생성된 성장 영상

```sql
CREATE TYPE video_type AS ENUM ('monthly', 'custom', 'timelapse');
CREATE TYPE video_status AS ENUM ('pending', 'processing', 'completed', 'failed');

CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 관계
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id), -- NULL이면 자동 생성

  -- 영상 정보
  type video_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  storage_path TEXT, -- 완성된 영상 경로
  thumbnail_path TEXT,

  -- 영상 메타데이터
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  photo_count INTEGER, -- 사용된 사진 수

  -- 기간
  start_date DATE,
  end_date DATE,

  -- 상태
  status video_status DEFAULT 'pending',
  processing_started_at TIMESTAMPTZ,
  processing_completed_at TIMESTAMPTZ,
  error_message TEXT,

  -- 통계
  view_count INTEGER DEFAULT 0,

  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT videos_title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 100)
);

-- 인덱스
CREATE INDEX idx_videos_pet_id ON videos(pet_id);
CREATE INDEX idx_videos_type ON videos(type);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);

-- Updated_at 트리거
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Members can view videos"
  ON videos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pet_members
      WHERE pet_members.pet_id = videos.pet_id
        AND pet_members.user_id = auth.uid()
        AND pet_members.status = 'active'
    )
  );
```

---

### 9. `health_records` 테이블 (Phase 2)

**목적**: 건강 기록 (예방접종, 병원 방문)

```sql
CREATE TYPE health_record_type AS ENUM ('vaccination', 'hospital_visit', 'medication', 'weight', 'other');

CREATE TABLE health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 관계
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  recorded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- 기록 정보
  type health_record_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  record_date DATE NOT NULL,

  -- 예방접종 전용
  vaccine_name TEXT,
  next_vaccination_date DATE,

  -- 병원 방문 전용
  hospital_name TEXT,
  veterinarian_name TEXT,
  diagnosis TEXT,

  -- 약 복용 전용
  medication_name TEXT,
  dosage TEXT,
  frequency TEXT,
  start_date DATE,
  end_date DATE,

  -- 몸무게 전용
  weight_kg NUMERIC(5, 2),

  -- 첨부 파일
  attachment_urls TEXT[], -- 처방전, 검사 결과 등

  -- 메타데이터
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_health_records_pet_id ON health_records(pet_id);
CREATE INDEX idx_health_records_type ON health_records(type);
CREATE INDEX idx_health_records_record_date ON health_records(record_date DESC);

-- Updated_at 트리거
CREATE TRIGGER update_health_records_updated_at
  BEFORE UPDATE ON health_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Members can view health records"
  ON health_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pet_members
      WHERE pet_members.pet_id = health_records.pet_id
        AND pet_members.user_id = auth.uid()
        AND pet_members.status = 'active'
    )
  );

-- Family 이상: 건강 기록 추가 가능
CREATE POLICY "Family members can add health records"
  ON health_records FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pet_members
      WHERE pet_members.pet_id = health_records.pet_id
        AND pet_members.user_id = auth.uid()
        AND pet_members.role IN ('admin', 'family')
        AND pet_members.status = 'active'
    )
    AND recorded_by = auth.uid()
  );

-- 본인이 기록한 것만 수정/삭제 가능
CREATE POLICY "Users can update own health records"
  ON health_records FOR UPDATE
  USING (recorded_by = auth.uid());

CREATE POLICY "Users can delete own health records"
  ON health_records FOR DELETE
  USING (recorded_by = auth.uid());
```

---

## Supabase Storage 구조

### Buckets

#### 1. `photos` 버킷
- **목적**: 사진 저장
- **권한**: Private (RLS로 제어)
- **경로 구조**: `{pet_id}/{year}/{month}/{filename}`
  - 예: `550e8400-e29b-41d4-a716-446655440000/2025/11/IMG_1234.jpg`
- **파일 제한**:
  - 최대 파일 크기: 10MB
  - 허용 형식: `image/jpeg`, `image/png`, `image/webp`, `image/heic`

#### 2. `profile-images` 버킷
- **목적**: 사용자 및 펫 프로필 이미지
- **권한**: Private (RLS로 제어)
- **경로 구조**:
  - 사용자: `users/{user_id}/avatar.jpg`
  - 펫: `pets/{pet_id}/profile.jpg`
- **파일 제한**:
  - 최대 파일 크기: 5MB
  - 허용 형식: `image/jpeg`, `image/png`, `image/webp`

#### 3. `videos` 버킷 (Phase 2)
- **목적**: 성장 영상 저장
- **권한**: Private (RLS로 제어)
- **경로 구조**: `{pet_id}/{video_id}.mp4`
- **파일 제한**:
  - 최대 파일 크기: 100MB
  - 허용 형식: `video/mp4`, `video/quicktime`

#### 4. `thumbnails` 버킷
- **목적**: 사진/영상 썸네일 (자동 생성)
- **권한**: Private (RLS로 제어)
- **경로 구조**:
  - 사진: `photos/{photo_id}_thumb.jpg`
  - 영상: `videos/{video_id}_thumb.jpg`

---

### Storage RLS 정책

```sql
-- photos 버킷: 해당 펫의 멤버만 접근
CREATE POLICY "Members can view pet photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'photos' AND
  EXISTS (
    SELECT 1 FROM photos
    INNER JOIN pet_members ON photos.pet_id = pet_members.pet_id
    WHERE storage.objects.name LIKE photos.pet_id::TEXT || '%'
      AND pet_members.user_id = auth.uid()
      AND pet_members.status = 'active'
  )
);

-- photos 버킷: Family 이상 권한으로 업로드 가능
CREATE POLICY "Family members can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'photos' AND
  EXISTS (
    SELECT 1 FROM pet_members
    WHERE storage.objects.name LIKE pet_members.pet_id::TEXT || '%'
      AND pet_members.user_id = auth.uid()
      AND pet_members.role IN ('admin', 'family')
      AND pet_members.status = 'active'
  )
);

-- profile-images 버킷: 본인 프로필만 수정
CREATE POLICY "Users can manage own profile image"
ON storage.objects FOR ALL
USING (
  bucket_id = 'profile-images' AND
  storage.objects.name LIKE 'users/' || auth.uid()::TEXT || '%'
);

-- profile-images 버킷: Admin만 펫 프로필 수정
CREATE POLICY "Admins can manage pet profile images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'profile-images' AND
  storage.objects.name LIKE 'pets/%' AND
  EXISTS (
    SELECT 1 FROM pets
    INNER JOIN pet_members ON pets.id = pet_members.pet_id
    WHERE storage.objects.name LIKE 'pets/' || pets.id::TEXT || '%'
      AND pet_members.user_id = auth.uid()
      AND pet_members.role = 'admin'
      AND pet_members.status = 'active'
  )
);
```

---

## Row Level Security (RLS) 정책

### RLS 설계 원칙

1. **기본 거부 (Deny by Default)**: 모든 테이블에 RLS 활성화
2. **최소 권한 원칙**: 필요한 권한만 부여
3. **역할 기반 접근 제어**: admin/family/viewer 구분
4. **가족 그룹 격리**: 다른 펫의 데이터는 절대 접근 불가
5. **성능 고려**: 복잡한 JOIN은 인덱스 활용

### 권한 매트릭스

| 테이블 | Viewer | Family | Admin | Owner |
|--------|--------|--------|-------|-------|
| pets (읽기) | ✅ | ✅ | ✅ | ✅ |
| pets (수정) | ❌ | ❌ | ✅ | ✅ |
| pets (삭제) | ❌ | ❌ | ❌ | ✅ |
| photos (읽기) | ✅ | ✅ | ✅ | ✅ |
| photos (업로드) | ❌ | ✅ | ✅ | ✅ |
| photos (삭제) | ❌ | 본인만 | 본인만 | 본인만 |
| comments (읽기) | ✅ | ✅ | ✅ | ✅ |
| comments (작성) | ❌ | ✅ | ✅ | ✅ |
| comments (수정/삭제) | ❌ | 본인만 | 본인만 | 본인만 |
| likes (읽기) | ✅ | ✅ | ✅ | ✅ |
| likes (추가/삭제) | ❌ | ✅ | ✅ | ✅ |
| pet_members (읽기) | ✅ | ✅ | ✅ | ✅ |
| pet_members (관리) | ❌ | ❌ | ✅ | ✅ |

---

## API 엔드포인트

### Supabase Client 사용 예시

#### 1. 펫 목록 조회

```typescript
// 내가 속한 모든 펫 조회 (RLS 자동 적용)
const { data: pets, error } = await supabase
  .from('pets')
  .select(`
    *,
    pet_members!inner(role, status),
    photos(count)
  `)
  .eq('is_deleted', false)
  .eq('pet_members.user_id', userId)
  .eq('pet_members.status', 'active')
  .order('created_at', { ascending: false });
```

#### 2. 특정 날짜의 사진 조회

```typescript
// 2025-11-05 사진 조회
const { data: photos, error } = await supabase
  .from('photos')
  .select(`
    *,
    uploaded_by:profiles(id, display_name, avatar_url),
    likes:photo_likes(count),
    comments:photo_comments(count)
  `)
  .eq('pet_id', petId)
  .gte('taken_at', '2025-11-05T00:00:00Z')
  .lt('taken_at', '2025-11-06T00:00:00Z')
  .eq('is_deleted', false)
  .order('taken_at', { ascending: true });
```

#### 3. 사진 업로드

```typescript
// 1. Storage에 파일 업로드
const filePath = `${petId}/${year}/${month}/${fileName}`;
const { data: fileData, error: uploadError } = await supabase
  .storage
  .from('photos')
  .upload(filePath, file, {
    cacheControl: '3600',
    upsert: false
  });

// 2. photos 테이블에 메타데이터 저장
const { data: photo, error: dbError } = await supabase
  .from('photos')
  .insert({
    pet_id: petId,
    uploaded_by: userId,
    storage_path: filePath,
    file_name: fileName,
    file_size_bytes: file.size,
    mime_type: file.type,
    taken_at: takenAt,
    caption: caption
  })
  .select()
  .single();
```

#### 4. 댓글 추가

```typescript
const { data: comment, error } = await supabase
  .from('photo_comments')
  .insert({
    photo_id: photoId,
    user_id: userId,
    content: commentText
  })
  .select(`
    *,
    user:profiles(id, display_name, avatar_url)
  `)
  .single();
```

#### 5. 좋아요 토글

```typescript
// 이미 좋아요 했는지 확인
const { data: existingLike } = await supabase
  .from('photo_likes')
  .select('id')
  .eq('photo_id', photoId)
  .eq('user_id', userId)
  .single();

if (existingLike) {
  // 좋아요 취소
  await supabase
    .from('photo_likes')
    .delete()
    .eq('id', existingLike.id);
} else {
  // 좋아요 추가
  await supabase
    .from('photo_likes')
    .insert({
      photo_id: photoId,
      user_id: userId
    });
}
```

#### 6. 가족 초대

```typescript
// 1. 초대할 사용자 검색 (이메일)
const { data: invitee } = await supabase
  .from('profiles')
  .select('id, email, display_name')
  .eq('email', inviteEmail)
  .single();

// 2. pet_members에 추가
const { data: member, error } = await supabase
  .from('pet_members')
  .insert({
    pet_id: petId,
    user_id: invitee.id,
    role: 'family',
    status: 'invited',
    invited_by: currentUserId,
    invited_at: new Date().toISOString()
  })
  .select()
  .single();

// 3. 푸시 알림 발송 (Edge Function)
await supabase.functions.invoke('send-invitation-notification', {
  body: { memberId: member.id }
});
```

---

## 인증 흐름

### Supabase Auth 설정

#### 1. 소셜 로그인 Provider 설정

**Kakao**:
```env
KAKAO_CLIENT_ID=your_kakao_rest_api_key
KAKAO_CLIENT_SECRET=your_kakao_client_secret
KAKAO_REDIRECT_URI=https://your-project.supabase.co/auth/v1/callback
```

**Google**:
```env
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Apple**:
```env
APPLE_CLIENT_ID=your_apple_service_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY=your_apple_private_key
```

#### 2. 인증 플로우

```typescript
// Kakao 로그인
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'kakao',
  options: {
    redirectTo: 'myapp://auth/callback'
  }
});

// Google 로그인
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'myapp://auth/callback'
  }
});

// Apple 로그인
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'apple',
  options: {
    redirectTo: 'myapp://auth/callback'
  }
});
```

#### 3. 프로필 자동 생성 (Database Webhook)

```sql
-- auth.users에 사용자 생성 시 profiles 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

#### 4. 세션 관리

```typescript
// 세션 가져오기
const { data: { session }, error } = await supabase.auth.getSession();

// 세션 리스너
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // 로그인 성공
    console.log('User signed in:', session.user);
  } else if (event === 'SIGNED_OUT') {
    // 로그아웃
    console.log('User signed out');
  }
});

// 로그아웃
await supabase.auth.signOut();
```

---

## 실시간 기능

### Supabase Realtime 구독

#### 1. 댓글 실시간 업데이트

```typescript
// 특정 사진의 댓글 구독
const channel = supabase
  .channel('photo-comments')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'photo_comments',
      filter: `photo_id=eq.${photoId}`
    },
    (payload) => {
      console.log('New comment:', payload.new);
      // UI 업데이트
    }
  )
  .subscribe();

// 구독 해제
channel.unsubscribe();
```

#### 2. 좋아요 실시간 업데이트

```typescript
const channel = supabase
  .channel('photo-likes')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, DELETE 모두
      schema: 'public',
      table: 'photo_likes',
      filter: `photo_id=eq.${photoId}`
    },
    (payload) => {
      if (payload.eventType === 'INSERT') {
        console.log('New like:', payload.new);
      } else if (payload.eventType === 'DELETE') {
        console.log('Like removed:', payload.old);
      }
      // UI 업데이트
    }
  )
  .subscribe();
```

#### 3. 새 사진 업로드 알림

```typescript
// 특정 펫의 새 사진 구독
const channel = supabase
  .channel('pet-photos')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'photos',
      filter: `pet_id=eq.${petId}`
    },
    (payload) => {
      console.log('New photo uploaded:', payload.new);
      // 푸시 알림 발송
    }
  )
  .subscribe();
```

---

## 성능 최적화

### 1. 인덱싱 전략

- **복합 인덱스**: 자주 함께 쿼리되는 컬럼
  - `idx_photos_pet_taken`: `(pet_id, taken_at DESC)` - 날짜별 사진 조회
  - `idx_pet_members_composite`: `(pet_id, user_id, status)` - 권한 체크

- **부분 인덱스**: 조건부 인덱스로 크기 감소
  - `idx_photos_is_deleted`: `WHERE is_deleted = FALSE`
  - `idx_milestones_notification`: `WHERE notification_sent = FALSE`

### 2. 쿼리 최적화

```sql
-- ❌ 나쁜 예: N+1 쿼리
SELECT * FROM photos WHERE pet_id = '...';
-- 각 photo마다 uploaded_by 조회

-- ✅ 좋은 예: JOIN으로 한 번에 조회
SELECT
  photos.*,
  profiles.display_name,
  profiles.avatar_url
FROM photos
INNER JOIN profiles ON photos.uploaded_by = profiles.id
WHERE photos.pet_id = '...'
  AND photos.is_deleted = FALSE
ORDER BY photos.taken_at DESC
LIMIT 50;
```

### 3. 캐싱 전략

- **Supabase Client 캐싱**:
  ```typescript
  // 5분 캐시
  const { data } = await supabase
    .from('pets')
    .select('*')
    .eq('id', petId)
    .single()
    .abortSignal(AbortSignal.timeout(5000));
  ```

- **React Query 사용**:
  ```typescript
  const { data: pet } = useQuery({
    queryKey: ['pet', petId],
    queryFn: () => fetchPet(petId),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000 // 10분
  });
  ```

### 4. 이미지 최적화

- **썸네일 자동 생성** (Edge Function):
  ```typescript
  // supabase/functions/generate-thumbnail/index.ts
  import { createClient } from '@supabase/supabase-js';
  import sharp from 'sharp';

  Deno.serve(async (req) => {
    const { photoPath } = await req.json();

    // 원본 이미지 다운로드
    const { data: originalFile } = await supabase
      .storage
      .from('photos')
      .download(photoPath);

    // 썸네일 생성 (300x300)
    const thumbnail = await sharp(originalFile)
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    // 썸네일 업로드
    const thumbnailPath = `thumbnails/${photoId}_thumb.jpg`;
    await supabase
      .storage
      .from('thumbnails')
      .upload(thumbnailPath, thumbnail);

    return new Response(JSON.stringify({ thumbnailPath }));
  });
  ```

### 5. 페이지네이션

```typescript
// Cursor-based pagination (무한 스크롤)
const PHOTOS_PER_PAGE = 20;

const { data: photos, error } = await supabase
  .from('photos')
  .select('*')
  .eq('pet_id', petId)
  .eq('is_deleted', false)
  .order('taken_at', { ascending: false })
  .range(offset, offset + PHOTOS_PER_PAGE - 1);
```

---

## 배포 및 환경 설정

### 1. 환경 변수

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (서버 전용)

# OAuth
KAKAO_CLIENT_ID=your_kakao_client_id
GOOGLE_CLIENT_ID=your_google_client_id
APPLE_CLIENT_ID=your_apple_client_id

# Storage
EXPO_PUBLIC_STORAGE_URL=https://your-project.supabase.co/storage/v1
```

### 2. Supabase CLI로 Migration 관리

```bash
# 초기화
supabase init

# 새 마이그레이션 생성
supabase migration new create_tables

# 로컬 DB에 적용
supabase db push

# 리모트 DB에 적용
supabase db push --db-url <your-db-url>

# 마이그레이션 롤백
supabase migration repair --status reverted <version>
```

### 3. 테이블 생성 순서

```sql
-- 1. profiles (auth.users 확장)
-- 2. pets
-- 3. pet_members (+ 트리거)
-- 4. photos
-- 5. photo_likes (+ 트리거)
-- 6. photo_comments (+ 트리거)
-- 7. milestones (+ 트리거)
-- 8. videos
-- 9. health_records
```

### 4. Storage Bucket 생성

```sql
-- Supabase Dashboard > Storage > New Bucket

-- 1. photos (Private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', false);

-- 2. profile-images (Private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', false);

-- 3. videos (Private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', false);

-- 4. thumbnails (Private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', false);
```

### 5. Edge Functions 배포

```bash
# 함수 생성
supabase functions new generate-thumbnail

# 로컬 테스트
supabase functions serve generate-thumbnail

# 배포
supabase functions deploy generate-thumbnail
```

---

## 다음 단계

### Phase 1 (MVP) - 우선순위 높음

1. ✅ DB 스키마 설계 완료
2. ⏳ Supabase 프로젝트 생성
3. ⏳ 테이블 마이그레이션 실행
4. ⏳ RLS 정책 테스트
5. ⏳ Storage 버킷 생성 및 정책 설정
6. ⏳ OAuth Provider 설정 (Kakao, Google, Apple)
7. ⏳ 프론트엔드 API 연동
8. ⏳ 사진 업로드 플로우 구현
9. ⏳ 실시간 댓글/좋아요 테스트

### Phase 2 - 우선순위 중간

1. ⏳ Edge Function: 썸네일 자동 생성
2. ⏳ Edge Function: 푸시 알림 발송
3. ⏳ Edge Function: 기념일 알림 (Cron Job)
4. ⏳ 성장 영상 자동 생성 (FFmpeg)
5. ⏳ 건강 기록 기능

### Phase 3 - 우선순위 낮음

1. ⏳ AI 얼굴 인식 (TensorFlow Lite)
2. ⏳ 타임랩스 영상
3. ⏳ 커뮤니티 기능
4. ⏳ 프린트 서비스 연동

---

## 부록

### A. 데이터 마이그레이션 스크립트

```sql
-- 전체 테이블 생성 스크립트 (순서대로 실행)
-- 이 스크립트는 Supabase SQL Editor에서 실행

BEGIN;

-- 1. profiles 테이블
-- (위 스키마 참조)

-- 2. pets 테이블
-- (위 스키마 참조)

-- 3. pet_members 테이블
-- (위 스키마 참조)

-- 4. photos 테이블
-- (위 스키마 참조)

-- 5. photo_likes 테이블
-- (위 스키마 참조)

-- 6. photo_comments 테이블
-- (위 스키마 참조)

-- 7. milestones 테이블
-- (위 스키마 참조)

-- 8. videos 테이블
-- (위 스키마 참조)

-- 9. health_records 테이블
-- (위 스키마 참조)

COMMIT;
```

### B. 샘플 데이터

```sql
-- 테스트용 샘플 데이터 생성
-- ⚠️ 프로덕션 환경에서는 사용 금지

-- 샘플 펫 생성
INSERT INTO pets (id, name, species, breed, adoption_date, owner_id)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  '보리',
  'dog',
  '웰시코기',
  '2023-01-15',
  auth.uid()
);

-- 샘플 사진 생성
INSERT INTO photos (pet_id, uploaded_by, storage_path, file_name, taken_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  auth.uid(),
  '550e8400-e29b-41d4-a716-446655440000/2025/11/sample.jpg',
  'sample.jpg',
  '2025-11-05 14:30:00'
);
```

### C. 유용한 쿼리

```sql
-- 1. 특정 사용자의 모든 펫 조회
SELECT
  pets.*,
  pet_members.role,
  COUNT(DISTINCT photos.id) as photo_count
FROM pets
INNER JOIN pet_members ON pets.id = pet_members.pet_id
LEFT JOIN photos ON pets.id = photos.pet_id AND photos.is_deleted = FALSE
WHERE pet_members.user_id = 'user_id_here'
  AND pet_members.status = 'active'
  AND pets.is_deleted = FALSE
GROUP BY pets.id, pet_members.role;

-- 2. 특정 펫의 월별 사진 통계
SELECT
  DATE_TRUNC('month', taken_at) as month,
  COUNT(*) as photo_count
FROM photos
WHERE pet_id = 'pet_id_here'
  AND is_deleted = FALSE
GROUP BY DATE_TRUNC('month', taken_at)
ORDER BY month DESC;

-- 3. 다가오는 기념일 조회
SELECT *
FROM milestones
WHERE pet_id = 'pet_id_here'
  AND milestone_date >= CURRENT_DATE
  AND milestone_date <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY milestone_date ASC;

-- 4. 가장 많은 좋아요를 받은 사진 Top 10
SELECT
  photos.*,
  photos.likes_count,
  profiles.display_name as uploader_name
FROM photos
INNER JOIN profiles ON photos.uploaded_by = profiles.id
WHERE photos.pet_id = 'pet_id_here'
  AND photos.is_deleted = FALSE
ORDER BY photos.likes_count DESC
LIMIT 10;
```

---

**문서 끝**
