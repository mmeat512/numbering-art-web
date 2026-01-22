# 컬러링 앱 관리자 페이지 PRD

## 1. 제품 개요

### 1.1 프로젝트 이름

**컬러링 앱 관리자 대시보드** (Coloring App Admin Dashboard)

### 1.2 프로젝트 목적

컬러링 앱의 템플릿(도안), 카테고리, 사용자 데이터를 효율적으로 관리할 수 있는 관리자 전용 웹 인터페이스를 제공합니다.

### 1.3 핵심 가치 제안

- 코드 수정 없이 템플릿 추가/수정/삭제
- 직관적인 드래그 앤 드롭 이미지 업로드
- 템플릿 미리보기 및 테스트 기능
- 실시간 사용자 통계 확인
- 카테고리 및 난이도 관리

---

## 2. 사용자

### 2.1 주요 사용자

- **앱 운영자**: 템플릿 추가, 콘텐츠 관리
- **디자이너**: 템플릿 업로드 및 검수
- **데이터 분석가**: 사용자 통계 확인 (선택)

### 2.2 사용자 페르소나

#### 페르소나 1: 운영자 영희 (32세)

- 매주 새로운 템플릿 5-10개 업로드
- 사용자 피드백 기반 인기 템플릿 파악 필요
- 기술적 지식은 제한적 (개발자 아님)
- 빠르고 직관적인 인터페이스 선호

---

## 3. 핵심 기능

### 3.1 MVP 필수 기능

#### 3.1.1 인증 및 권한 관리

- **로그인**: Supabase Auth (이메일/비밀번호)
- **권한 체크**:
  - admin 역할만 접근 가능
  - Supabase Row Level Security로 보안
- **세션 관리**: 자동 로그아웃 (24시간)

**데이터베이스 스키마:**

```sql
-- users 테이블 확장 (Supabase auth.users)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS 정책
CREATE POLICY "Only admins can access admin functions"
  ON templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

#### 3.1.2 템플릿 관리

##### A. 템플릿 목록 (List View)

- **기능**:
  - 모든 템플릿 테이블 형식으로 표시
  - 썸네일 미리보기
  - 검색 (제목, 카테고리)
  - 필터링 (카테고리, 난이도, 상태)
  - 정렬 (최신순, 인기순, 제목순)
  - 페이지네이션 (20개씩)

- **표시 정보**:
  - 썸네일 이미지
  - 제목
  - 카테고리
  - 난이도
  - 사용 횟수
  - 생성일
  - 상태 (활성/비활성)
  - 액션 버튼 (수정, 삭제, 미리보기)

##### B. 템플릿 추가 (Create)

- **폼 필드**:
  - 제목 (필수, 최대 100자)
  - 카테고리 선택 (드롭다운)
  - 난이도 선택 (쉬움/보통/어려움)
  - 템플릿 이미지 업로드 (필수)
    - 드래그 앤 드롭 지원
    - 이미지 형식: PNG, JPG (투명 배경 PNG 권장)
    - 최대 크기: 5MB
    - 권장 해상도: 1024x1024px 이상
  - 썸네일 이미지 (선택, 자동 생성 옵션)
  - 설명/태그 (선택, 최대 500자)
  - 상태 (활성/비활성)

- **이미지 처리**:
  - 자동 리사이징 (최대 2048x2048)
  - WebP 변환 (성능 최적화)
  - 썸네일 자동 생성 (400x400)
  - Supabase Storage 업로드

- **유효성 검사**:
  - 필수 필드 체크
  - 이미지 형식 및 크기 검증
  - 중복 제목 체크

##### C. 템플릿 수정 (Update)

- 기존 데이터 불러오기
- 모든 필드 수정 가능
- 이미지 교체 가능 (기존 이미지 삭제 옵션)
- 수정 이력 저장 (updated_at)

##### D. 템플릿 삭제 (Delete)

- 소프트 삭제 (is_deleted 플래그)
- 삭제 확인 모달
- 삭제 시 Supabase Storage 이미지도 삭제 옵션
- 실제 사용자가 사용 중인 템플릿은 삭제 경고

##### E. 템플릿 미리보기

- 실제 앱과 동일한 캔버스로 테스트
- Flood Fill 작동 확인
- 모바일/데스크톱 뷰 전환

#### 3.1.3 카테고리 관리

##### A. 카테고리 CRUD

- **목록**: 모든 카테고리 표시
  - 카테고리명
  - 아이콘/이미지
  - 정렬 순서
  - 템플릿 수
  - 액션 (수정, 삭제)

- **추가**:
  - 카테고리명 (필수)
  - 아이콘 업로드 또는 이모지 선택
  - 정렬 순서 (숫자)
  - 설명

- **수정**: 모든 필드 수정 가능
- **삭제**:
  - 해당 카테고리 템플릿 있으면 경고
  - 강제 삭제 시 템플릿은 "미분류"로 이동

##### B. 카테고리 순서 변경

- 드래그 앤 드롭으로 순서 변경
- 변경 사항 즉시 저장

#### 3.1.4 대시보드 (선택사항, Post-MVP)

##### 주요 통계

- **템플릿 통계**:
  - 총 템플릿 수
  - 활성 템플릿 수
  - 카테고리별 템플릿 수
- **사용자 통계**:
  - 총 사용자 수 (향후)
  - 완성작 수
  - 인기 템플릿 Top 10
- **최근 활동**:
  - 최근 추가된 템플릿 5개
  - 최근 업데이트 5개

### 3.2 향후 추가 기능 (Post-MVP)

#### 3.2.1 일괄 업로드

- CSV/JSON 파일로 여러 템플릿 정보 업로드
- ZIP 파일로 이미지 일괄 업로드
- 자동 매칭 및 처리

#### 3.2.2 템플릿 자동 생성 (AI)

- 이미지 업로드 시 자동으로 컬러링 영역 분할
- Edge Functions + AI 모델 활용
- 수동 보정 가능

#### 3.2.3 사용자 관리

- 사용자 목록
- 사용자별 작품 확인
- 문제 사용자 차단

#### 3.2.4 분석 및 리포트

- 템플릿별 상세 통계
- 카테고리별 인기도 분석
- 완성률 통계
- CSV 내보내기

#### 3.2.5 버전 관리

- 템플릿 수정 이력
- 이전 버전으로 복구
- 변경 사항 비교

---

## 4. 기술 스택

### 4.1 프론트엔드

- **프레임워크**: Next.js 14 (App Router)
  - 메인 앱과 동일한 프로젝트 내 `/admin` 라우트
- **언어**: TypeScript
- **UI 라이브러리**:
  - Tailwind CSS
  - shadcn/ui (Table, Form, Dialog 등)
  - React Hook Form (폼 관리)
  - Zod (유효성 검사)
- **파일 업로드**:
  - react-dropzone (드래그 앤 드롭)
  - 이미지 크롭: react-image-crop (선택)
- **테이블**:
  - @tanstack/react-table (정렬, 필터, 페이지네이션)
- **차트** (선택, Post-MVP):
  - recharts 또는 Chart.js

### 4.2 백엔드

- **데이터베이스**: Supabase PostgreSQL (기존과 동일)
- **스토리지**: Supabase Storage
- **인증**: Supabase Auth
- **이미지 처리**:
  - Sharp (Next.js API Route에서 리사이징)
  - 또는 Supabase Edge Functions

### 4.3 보안

- **인증**: Supabase Auth (이메일/비밀번호)
- **권한**: Row Level Security (RLS)
- **CSRF 보호**: Next.js 기본 제공
- **파일 업로드 제한**:
  - 파일 타입 화이트리스트
  - 파일 크기 제한
  - 바이러스 스캔 (선택, Post-MVP)

---

## 5. 데이터베이스 스키마

### 5.1 테이블 확장

```sql
-- 기존 templates 테이블에 필드 추가
ALTER TABLE templates
ADD COLUMN description TEXT,
ADD COLUMN tags TEXT[],
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN created_by UUID REFERENCES auth.users(id),
ADD COLUMN updated_by UUID REFERENCES auth.users(id);

-- 템플릿 수정 이력 테이블 (Post-MVP)
CREATE TABLE template_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES templates(id),
  action TEXT CHECK (action IN ('create', 'update', 'delete')),
  changed_by UUID REFERENCES auth.users(id),
  changes JSONB, -- 변경 내용
  created_at TIMESTAMP DEFAULT NOW()
);

-- 카테고리 테이블 확장
ALTER TABLE categories
ADD COLUMN description TEXT,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
```

### 5.2 인덱스 추가

```sql
-- 검색 성능 최적화
CREATE INDEX idx_templates_title ON templates(title);
CREATE INDEX idx_templates_category ON templates(category_id);
CREATE INDEX idx_templates_created_at ON templates(created_at DESC);
CREATE INDEX idx_templates_usage_count ON templates(usage_count DESC);
CREATE INDEX idx_templates_is_active ON templates(is_active);
```

---

## 6. 화면 구성 (Wireframe)

### 6.1 주요 화면

#### 로그인 화면 (`/admin/login`)

- 간단한 이메일/비밀번호 폼
- "로그인" 버튼
- 에러 메시지 표시

#### 대시보드 (`/admin`)

- 좌측: 사이드바 네비게이션
  - 대시보드 (홈)
  - 템플릿 관리
  - 카테고리 관리
  - 통계 (선택)
- 우측: 메인 컨텐츠 영역
  - 주요 통계 카드 (템플릿 수, 사용자 수 등)
  - 최근 활동
  - 빠른 액션 버튼

#### 템플릿 목록 (`/admin/templates`)

- 상단:
  - 검색 바
  - 필터 (카테고리, 난이도, 상태)
  - "새 템플릿 추가" 버튼
- 중앙:
  - 테이블 형식
  - 각 행: 썸네일, 제목, 카테고리, 난이도, 사용 횟수, 액션 버튼
- 하단:
  - 페이지네이션

#### 템플릿 추가/수정 (`/admin/templates/new`, `/admin/templates/[id]/edit`)

- 2단 레이아웃:
  - 좌측: 폼 필드
    - 제목 입력
    - 카테고리 선택
    - 난이도 선택
    - 이미지 업로드 영역 (드래그 앤 드롭)
    - 설명/태그
  - 우측: 미리보기
    - 업로드된 이미지 표시
    - 썸네일 미리보기
- 하단:
  - "저장" 버튼
  - "취소" 버튼

#### 카테고리 관리 (`/admin/categories`)

- 테이블 형식
- 드래그 앤 드롭으로 순서 변경
- 인라인 편집 또는 모달

---

## 7. 사용자 플로우

### 7.1 템플릿 추가 플로우

```
로그인 → 템플릿 관리 → "새 템플릿 추가" 클릭
→ 폼 작성 (제목, 카테고리, 난이도)
→ 이미지 드래그 앤 드롭 업로드
→ 자동으로 썸네일 생성 및 미리보기
→ "저장" 클릭
→ Supabase 업로드 (이미지 + 데이터)
→ 성공 메시지 → 템플릿 목록으로 리다이렉트
```

### 7.2 템플릿 수정 플로우

```
템플릿 목록 → "수정" 버튼 클릭
→ 기존 데이터 로드
→ 필드 수정
→ 이미지 교체 (선택)
→ "저장" 클릭
→ 업데이트 완료 → 목록으로 리다이렉트
```

### 7.3 템플릿 삭제 플로우

```
템플릿 목록 → "삭제" 버튼 클릭
→ 확인 모달 ("정말 삭제하시겠습니까?")
→ "확인" 클릭
→ is_deleted = true 업데이트
→ 성공 메시지 → 목록 새로고침
```

---

## 8. 비기능 요구사항

### 8.1 성능

- **페이지 로드**: 2초 이내
- **이미지 업로드**: 5MB 이미지 10초 이내 처리
- **테이블 렌더링**: 100개 항목 1초 이내
- **검색/필터**: 즉시 반응 (디바운싱 300ms)

### 8.2 보안

- **인증**: JWT 토큰 기반, 24시간 만료
- **HTTPS**: 필수
- **파일 업로드**:
  - 화이트리스트: .png, .jpg, .jpeg만 허용
  - 파일 크기 제한: 5MB
  - 파일명 새니타이즈 (특수문자 제거)
- **SQL Injection 방지**: Supabase 클라이언트 자동 처리
- **XSS 방지**: React 기본 이스케이핑

### 8.3 사용성

- **반응형**: 데스크톱 최적화 (모바일은 선택)
- **에러 핸들링**: 모든 에러 명확한 메시지 표시
- **로딩 상태**: 모든 비동기 작업에 로딩 인디케이터
- **성공 피드백**: Toast 알림 또는 인라인 메시지

### 8.4 접근성

- **키보드 네비게이션**: Tab으로 모든 요소 접근 가능
- **스크린 리더**: ARIA 레이블 적용
- **색상 대비**: WCAG AA 준수

---

## 9. 프로젝트 일정

### Phase 1: MVP 개발 (2주, 26시간)

**Week 1 (13시간):**

- **평일 (5시간)**: 인증 및 기본 구조
  - 관리자 로그인 페이지 (2시간)
  - 권한 체크 미들웨어 (2시간)
  - 사이드바 레이아웃 (1시간)
- **주말 (8시간)**: 템플릿 목록 및 추가
  - 템플릿 목록 테이블 (3시간)
  - 검색/필터 기능 (2시간)
  - 템플릿 추가 폼 (3시간)

**Week 2 (13시간):**

- **평일 (5시간)**: 이미지 업로드 및 CRUD
  - 드래그 앤 드롭 업로드 (2시간)
  - 이미지 리사이징 (2시간)
  - 템플릿 수정/삭제 (1시간)
- **주말 (8시간)**: 카테고리 관리 및 테스트
  - 카테고리 CRUD (3시간)
  - 미리보기 기능 (2시간)
  - 버그 수정 및 테스트 (3시간)

### Phase 2: 개선 (선택, 1주)

- 대시보드 통계
- 일괄 업로드
- UI/UX 개선

---

## 10. 리스크 및 제약사항

### 10.1 기술적 리스크

- **이미지 처리 성능**: 대용량 이미지 업로드 시 시간 소요
  - **완화**: 클라이언트 사이드에서 사전 리사이징, 로딩 인디케이터
- **파일 업로드 실패**: 네트워크 불안정
  - **완화**: 재시도 로직, 명확한 에러 메시지

### 10.2 보안 리스크

- **무단 접근**: 관리자 페이지 노출
  - **완화**: RLS + 미들웨어 이중 체크, IP 화이트리스트 (선택)
- **악성 파일 업로드**: 이미지로 위장한 악성 파일
  - **완화**: MIME 타입 검증, 파일 확장자 체크

### 10.3 운영 리스크

- **실수로 템플릿 삭제**: 데이터 손실
  - **완화**: 소프트 삭제, 복구 기능 (30일 보관)

---

## 11. 성공 지표 (KPI)

### 11.1 효율성 지표

- **템플릿 추가 시간**: 평균 5분 이내
- **에러 발생률**: 업로드 실패 < 5%
- **관리자 만족도**: 사용 편의성 설문 > 4.0/5.0

### 11.2 기술 지표

- **페이지 로드 시간**: < 2초
- **업로드 성공률**: > 95%
- **가동시간**: > 99%

---

## 12. 구현 예시 코드

### 12.1 폴더 구조

```
app/
├─ admin/
│  ├─ layout.tsx          # 관리자 레이아웃
│  ├─ page.tsx            # 대시보드
│  ├─ login/
│  │  └─ page.tsx         # 로그인
│  ├─ templates/
│  │  ├─ page.tsx         # 템플릿 목록
│  │  ├─ new/
│  │  │  └─ page.tsx      # 템플릿 추가
│  │  └─ [id]/
│  │     └─ edit/
│  │        └─ page.tsx   # 템플릿 수정
│  └─ categories/
│     └─ page.tsx         # 카테고리 관리
├─ api/
│  └─ admin/
│     ├─ templates/
│     │  └─ route.ts      # 템플릿 CRUD API
│     └─ upload/
│        └─ route.ts      # 이미지 업로드 API
components/
└─ admin/
   ├─ TemplateForm.tsx
   ├─ TemplateTable.tsx
   ├─ ImageUpload.tsx
   └─ Sidebar.tsx
```

### 12.2 템플릿 폼 컴포넌트 예시

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDropzone } from 'react-dropzone';

const templateSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다').max(100),
  category_id: z.string().uuid('카테고리를 선택해주세요'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  description: z.string().max(500).optional(),
  is_active: z.boolean().default(true),
});

type TemplateFormData = z.infer<typeof templateSchema>;

export function TemplateForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: async (acceptedFiles) => {
      // 파일 업로드 처리
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      // 업로드된 URL 저장
    },
  });

  const onSubmit = async (data: TemplateFormData) => {
    // Supabase에 템플릿 저장
    const { error } = await supabase
      .from('templates')
      .insert({
        ...data,
        image_url: uploadedImageUrl,
        thumbnail_url: uploadedThumbnailUrl,
      });

    if (!error) {
      // 성공 처리
      router.push('/admin/templates');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 제목 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          제목 *
        </label>
        <input
          {...register('title')}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="템플릿 제목을 입력하세요"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* 카테고리 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          카테고리 *
        </label>
        <select
          {...register('category_id')}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">선택하세요</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* 난이도 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          난이도 *
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input {...register('difficulty')} type="radio" value="easy" />
            <span className="ml-2">쉬움</span>
          </label>
          <label className="flex items-center">
            <input {...register('difficulty')} type="radio" value="medium" />
            <span className="ml-2">보통</span>
          </label>
          <label className="flex items-center">
            <input {...register('difficulty')} type="radio" value="hard" />
            <span className="ml-2">어려움</span>
          </label>
        </div>
      </div>

      {/* 이미지 업로드 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          템플릿 이미지 *
        </label>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          `}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>이미지를 여기에 놓으세요...</p>
          ) : (
            <div>
              <p>이미지를 드래그하거나 클릭하여 선택하세요</p>
              <p className="text-sm text-gray-500 mt-2">
                PNG, JPG (최대 5MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          저장
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50"
        >
          취소
        </button>
      </div>
    </form>
  );
}
```

### 12.3 이미지 업로드 API Route

```typescript
// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // 관리자 권한 체크
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (role?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 파일 업로드 처리
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // 이미지 리사이징 (Sharp)
  const buffer = await file.arrayBuffer();
  const resizedImage = await sharp(Buffer.from(buffer))
    .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90 })
    .toBuffer();

  // 썸네일 생성
  const thumbnail = await sharp(Buffer.from(buffer))
    .resize(400, 400, { fit: 'cover' })
    .webp({ quality: 80 })
    .toBuffer();

  // Supabase Storage 업로드
  const fileName = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}.webp`;
  const thumbnailName = `${Date.now()}-thumb-${file.name.replace(/\.[^/.]+$/, '')}.webp`;

  const { data: imageData, error: imageError } = await supabase.storage
    .from('templates')
    .upload(fileName, resizedImage, {
      contentType: 'image/webp',
    });

  const { data: thumbData, error: thumbError } = await supabase.storage
    .from('templates')
    .upload(thumbnailName, thumbnail, {
      contentType: 'image/webp',
    });

  if (imageError || thumbError) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }

  // 공개 URL 반환
  const {
    data: { publicUrl: imageUrl },
  } = supabase.storage.from('templates').getPublicUrl(fileName);

  const {
    data: { publicUrl: thumbnailUrl },
  } = supabase.storage.from('templates').getPublicUrl(thumbnailName);

  return NextResponse.json({
    imageUrl,
    thumbnailUrl,
  });
}
```

---

## 13. 추가 고려사항

### 13.1 백업 및 복구

- Supabase 자동 백업 활용
- 중요 템플릿은 별도 백업 (선택)

### 13.2 모니터링

- Sentry로 에러 추적
- Supabase Dashboard로 쿼리 성능 모니터링

### 13.3 문서화

- 관리자 사용 매뉴얼 작성
- 스크린샷 포함 가이드

---

## 14. 문서 변경 이력

| 버전 | 날짜       | 작성자 | 변경 내용 |
| ---- | ---------- | ------ | --------- |
| 1.0  | 2026-01-22 | Yeon   | 초안 작성 |

---

## 부록

### A. 참고 자료

- Next.js API Routes 가이드
- Supabase Storage 문서
- React Hook Form 문서
- Sharp 이미지 처리 라이브러리
- shadcn/ui 컴포넌트

### B. 용어 정의

- **RLS (Row Level Security)**: PostgreSQL의 행 단위 보안 기능
- **Sharp**: Node.js 이미지 처리 라이브러리
- **Soft Delete**: 데이터를 실제로 삭제하지 않고 플래그로 표시
- **WebP**: Google이 개발한 차세대 이미지 포맷 (PNG/JPG보다 작은 용량)
