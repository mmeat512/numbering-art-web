# Supabase 데이터베이스 스키마

## 개요

Paint by Numbers 관리자 페이지를 위한 Supabase 데이터베이스 테이블 정의입니다.

---

## 테이블 구조

### 1. categories (카테고리)

```sql
-- 카테고리 테이블 생성
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(10),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);
CREATE INDEX idx_categories_is_active ON categories(is_active);

-- RLS 정책 설정
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 읽기 정책 (모든 사용자)
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  USING (is_active = true);

-- 관리자 전체 접근 정책 (서비스 역할)
CREATE POLICY "Service role has full access to categories"
  ON categories FOR ALL
  USING (auth.role() = 'service_role');

-- 기본 카테고리 데이터 삽입
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
  ('동물', 'animals', '귀여운 동물들', '🐱', 1),
  ('꽃', 'flowers', '아름다운 꽃들', '🌸', 2),
  ('풍경', 'landscape', '자연 풍경', '🏔️', 3),
  ('패턴', 'pattern', '다양한 패턴', '🔷', 4),
  ('음식', 'food', '맛있는 음식', '🍎', 5);
```

### 2. templates (템플릿)

```sql
-- 템플릿 테이블 생성
CREATE TABLE templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  description TEXT,
  color_count INTEGER DEFAULT 0,
  region_count INTEGER DEFAULT 0,
  estimated_time INTEGER DEFAULT 30, -- 분 단위
  thumbnail_url TEXT,
  template_data JSONB, -- SVG 영역 데이터
  color_palette JSONB, -- 색상 팔레트 데이터
  usage_count INTEGER DEFAULT 0,
  average_completion_time INTEGER, -- 초 단위
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_templates_category_id ON templates(category_id);
CREATE INDEX idx_templates_difficulty ON templates(difficulty);
CREATE INDEX idx_templates_is_active ON templates(is_active);
CREATE INDEX idx_templates_usage_count ON templates(usage_count DESC);
CREATE INDEX idx_templates_created_at ON templates(created_at DESC);

-- RLS 정책 설정
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- 읽기 정책 (모든 사용자)
CREATE POLICY "Anyone can read active templates"
  ON templates FOR SELECT
  USING (is_active = true);

-- 관리자 전체 접근 정책
CREATE POLICY "Service role has full access to templates"
  ON templates FOR ALL
  USING (auth.role() = 'service_role');
```

### 3. user_progress (사용자 진행 상황)

```sql
-- 사용자 진행 상황 테이블
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- 익명 사용자의 경우 로컬 UUID
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  filled_regions JSONB DEFAULT '[]'::jsonb,
  progress DECIMAL(5,2) DEFAULT 0, -- 0-100
  mistakes_count INTEGER DEFAULT 0,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_completed BOOLEAN DEFAULT false,
  completion_time INTEGER, -- 초 단위
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_template_id ON user_progress(template_id);
CREATE INDEX idx_user_progress_is_completed ON user_progress(is_completed);

-- RLS 정책
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own progress"
  ON user_progress FOR ALL
  USING (true); -- 익명 사용자 허용
```

### 4. completed_artworks (완성된 작품)

```sql
-- 완성된 작품 테이블
CREATE TABLE completed_artworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  template_title VARCHAR(200),
  thumbnail_data_url TEXT,
  image_url TEXT,
  completion_time INTEGER NOT NULL, -- 초 단위
  accuracy DECIMAL(5,2) NOT NULL, -- 0-100
  mistakes_count INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_completed_artworks_user_id ON completed_artworks(user_id);
CREATE INDEX idx_completed_artworks_template_id ON completed_artworks(template_id);
CREATE INDEX idx_completed_artworks_completed_at ON completed_artworks(completed_at DESC);

-- RLS 정책
ALTER TABLE completed_artworks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own artworks"
  ON completed_artworks FOR ALL
  USING (true);
```

### 5. admin_activity_logs (관리자 활동 로그)

```sql
-- 관리자 활동 로그 테이블
CREATE TABLE admin_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete'
  resource_type VARCHAR(50) NOT NULL, -- 'template', 'category'
  resource_id UUID,
  resource_title VARCHAR(200),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);
CREATE INDEX idx_admin_activity_logs_resource_type ON admin_activity_logs(resource_type);

-- RLS 정책
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage admin logs"
  ON admin_activity_logs FOR ALL
  USING (auth.role() = 'service_role');
```

---

## Storage Buckets

```sql
-- Storage 버킷 생성 (Supabase Dashboard에서 수행)

-- 1. templates 버킷 (템플릿 이미지)
-- 경로: templates/
-- Public: true

-- 2. artworks 버킷 (사용자 완성 작품)
-- 경로: artworks/{user_id}/
-- Public: true

-- 3. thumbnails 버킷 (썸네일)
-- 경로: thumbnails/{user_id}/
-- Public: true
```

### Storage 정책

```sql
-- templates 버킷 읽기 정책
CREATE POLICY "Public read for templates"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'templates');

-- templates 버킷 쓰기 정책 (서비스 역할만)
CREATE POLICY "Service role can upload templates"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'templates'
    AND auth.role() = 'service_role'
  );

-- artworks 버킷 정책
CREATE POLICY "Anyone can read artworks"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'artworks');

CREATE POLICY "Anyone can upload artworks"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'artworks');
```

---

## 함수 및 트리거

### 자동 updated_at 업데이트

```sql
-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 적용
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 템플릿 사용 횟수 증가 함수

```sql
CREATE OR REPLACE FUNCTION increment_template_usage(template_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE templates
  SET usage_count = usage_count + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;
```

### 카테고리별 템플릿 수 계산 뷰

```sql
CREATE OR REPLACE VIEW category_template_counts AS
SELECT
  c.id,
  c.name,
  c.slug,
  COUNT(t.id) AS template_count
FROM categories c
LEFT JOIN templates t ON c.id = t.category_id AND t.is_active = true
GROUP BY c.id, c.name, c.slug;
```

---

## 초기화 스크립트 (전체)

위의 모든 쿼리를 순서대로 실행하거나, Supabase SQL Editor에서 한 번에 실행하세요.

```sql
-- 1. 테이블 생성 (categories → templates → user_progress → completed_artworks → admin_activity_logs)
-- 2. 인덱스 생성
-- 3. RLS 정책 설정
-- 4. 함수 및 트리거 생성
-- 5. 초기 데이터 삽입
-- 6. Storage 버킷 생성 (Dashboard에서)
```

---

## 마이그레이션 순서

1. Supabase Dashboard에서 새 프로젝트 생성
2. SQL Editor에서 테이블 생성 쿼리 실행
3. Storage 버킷 생성 (templates, artworks, thumbnails)
4. 환경 변수 설정 (`.env.local`)
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. 앱에서 테스트
