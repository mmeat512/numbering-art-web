# 관리자 페이지 향후 작업 목록

## 개요

Paint by Numbers 관리자 페이지의 개선 및 버그 수정 작업 목록입니다.

---

## 1. AI 템플릿 생성 기능

### 목표
사용자가 업로드한 이미지를 AI로 분석하여 자동으로 Paint by Numbers 템플릿을 생성합니다.

### 구현 내용

#### 1.1 이미지 업로드 및 전처리
- [ ] 이미지 업로드 UI 추가 (`/admin/templates/new`)
- [ ] 이미지 크기 조정 (최대 800x800px)
- [ ] 이미지 포맷 변환 (WebP/PNG)

#### 1.2 AI 색상 추출 및 영역 분할
- [ ] 색상 클러스터링 알고리즘 적용 (K-means 또는 Color Quantization)
- [ ] 사용자 설정 가능한 색상 수 (5-30개)
- [ ] 영역 경계 감지 및 SVG Path 생성
- [ ] 각 영역에 색상 번호 자동 할당

#### 1.3 API 엔드포인트
```typescript
// POST /api/admin/templates/generate
{
  imageUrl: string,
  colorCount: number,     // 5-30
  difficulty: 'easy' | 'medium' | 'hard',
  smoothing: number,      // 0-1 (영역 경계 부드러움)
}
```

#### 1.4 예상 라이브러리
- **색상 추출**: `color-thief`, `quantize`
- **이미지 처리**: `sharp`, `canvas`
- **SVG 생성**: `potrace`, `svg-path-commander`
- **AI 서비스 (선택)**: OpenAI Vision API, Replicate

#### 1.5 워크플로우
```
1. 이미지 업로드
   ↓
2. 색상 수 및 난이도 선택
   ↓
3. AI 처리 (10-30초)
   ↓
4. 미리보기 및 조정
   ↓
5. 저장
```

#### 1.6 파일 위치
- `/src/app/api/admin/templates/generate/route.ts`
- `/src/lib/ai/templateGenerator.ts`
- `/src/lib/ai/colorExtractor.ts`
- `/src/lib/ai/regionDetector.ts`

---

## 2. 카테고리 이슈 수정

### 2.1 순서 변경 (드래그 앤 드롭)

#### 현재 문제
- 카테고리 순서 변경 UI가 있지만 실제 동작하지 않음
- `GripVertical` 아이콘만 표시되고 드래그 기능 없음

#### 해결 방법
```bash
# 라이브러리 설치
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

#### 구현 내용
- [ ] `@dnd-kit/sortable` 라이브러리 적용
- [ ] 드래그 시작/종료 시 시각적 피드백
- [ ] 순서 변경 후 API 호출 (`PATCH /api/admin/categories/reorder`)
- [ ] 순서 저장 후 Toast 알림

#### 코드 변경 파일
- `/src/app/admin/categories/page.tsx`
- `/src/app/api/admin/categories/reorder/route.ts` (신규)

#### API 엔드포인트
```typescript
// PATCH /api/admin/categories/reorder
{
  orderedIds: string[]  // 순서대로 정렬된 카테고리 ID 배열
}
```

### 2.2 카테고리별 템플릿 설정

#### 현재 문제
- 템플릿 추가/수정 시 카테고리 선택은 가능하나 하드코딩된 옵션만 표시
- 실제 카테고리 데이터와 동기화되지 않음

#### 해결 방법
- [ ] 템플릿 폼에서 카테고리 API 호출하여 동적 옵션 생성
- [ ] 카테고리가 없는 경우 안내 메시지 표시
- [ ] 카테고리 추가 바로가기 링크 제공

#### 코드 변경 파일
- `/src/app/admin/templates/new/page.tsx`
- `/src/app/admin/templates/[id]/edit/page.tsx`

#### 변경 코드 예시
```tsx
// 기존 (하드코딩)
<option value="animals">동물</option>
<option value="nature">자연</option>

// 변경 (동적)
const [categories, setCategories] = useState([])

useEffect(() => {
  fetch('/api/admin/categories')
    .then(res => res.json())
    .then(data => setCategories(data.data))
}, [])

{categories.map(cat => (
  <option key={cat.id} value={cat.id}>{cat.name}</option>
))}
```

---

## 3. 템플릿 이슈 수정

### 3.1 이미지 업로드 에러 수정

#### 현재 문제
- 템플릿 추가 버튼 클릭 시 이미지 업로드 에러 발생
- Supabase Storage 버킷 설정 또는 권한 문제 추정

#### 원인 분석
1. **Storage 버킷 미생성**: `templates` 버킷이 Supabase에 없음
2. **RLS 정책 미설정**: 업로드 권한이 없음
3. **파일 경로 오류**: 중복 경로 (`templates/templates/`)

#### 해결 방법

##### Step 1: Supabase Dashboard에서 버킷 생성
```
1. Supabase Dashboard → Storage
2. "New bucket" 클릭
3. Name: templates
4. Public bucket: ON
5. Create bucket
```

##### Step 2: Storage 정책 추가
```sql
-- templates 버킷 읽기 정책
CREATE POLICY "Public read for templates"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'templates');

-- templates 버킷 업로드 정책
CREATE POLICY "Anyone can upload to templates"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'templates');

-- templates 버킷 삭제 정책
CREATE POLICY "Anyone can delete from templates"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'templates');
```

##### Step 3: 코드 수정
```typescript
// /src/app/api/admin/upload/route.ts

// 변경 전
const filePath = `templates/${fileName}`

// 변경 후 (중복 경로 제거)
const filePath = fileName
```

#### 코드 변경 파일
- `/src/app/api/admin/upload/route.ts`

---

## 4. 대시보드 사이드바 Active 상태 수정

### 현재 문제
- 다른 탭(템플릿 관리, 카테고리 관리)으로 이동해도 대시보드가 항상 active 상태
- 현재 경로와 nav item href 비교 로직 오류

#### 원인 분석
현재 코드:
```tsx
const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
```

`/admin` 경로의 경우:
- `/admin/templates`도 `/admin`으로 시작하므로 항상 active

#### 해결 방법
```tsx
// /src/components/admin/AdminSidebar.tsx

// 변경 전
const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

// 변경 후
const isActive =
  item.href === '/admin'
    ? pathname === '/admin'
    : pathname === item.href || pathname?.startsWith(item.href + '/')
```

#### 코드 변경 파일
- `/src/components/admin/AdminSidebar.tsx`

---

## 5. 추가 개선 사항 (우선순위 낮음)

### 5.1 템플릿 미리보기 기능
- [ ] 템플릿 목록에서 클릭 시 미리보기 모달
- [ ] SVG 렌더링으로 실제 컬러링 화면 미리보기

### 5.2 벌크 작업 기능
- [ ] 여러 템플릿 일괄 삭제
- [ ] 여러 템플릿 카테고리 일괄 변경
- [ ] 체크박스 선택 UI

### 5.3 검색 및 필터 개선
- [ ] 카테고리별 필터
- [ ] 난이도별 필터
- [ ] 날짜 범위 필터
- [ ] 정렬 옵션 (사용량, 생성일, 이름)

### 5.4 통계 대시보드 개선
- [ ] 차트 추가 (Chart.js 또는 Recharts)
- [ ] 기간별 통계 (일간/주간/월간)
- [ ] 인기 템플릿 TOP 10
- [ ] 사용자 활동 그래프

### 5.5 관리자 인증 강화
- [ ] Supabase Auth 연동
- [ ] 세션 만료 시간 설정
- [ ] 로그인 시도 제한
- [ ] 활동 로그 기록

---

## 작업 우선순위

| 순위 | 작업 | 중요도 | 난이도 |
|------|------|--------|--------|
| 1 | 3.1 이미지 업로드 에러 수정 | 🔴 높음 | 쉬움 |
| 2 | 4. 사이드바 Active 상태 수정 | 🔴 높음 | 쉬움 |
| 3 | 2.2 카테고리별 템플릿 설정 | 🟡 중간 | 쉬움 |
| 4 | 2.1 카테고리 순서 변경 | 🟡 중간 | 보통 |
| 5 | 1. AI 템플릿 생성 | 🟢 낮음 | 어려움 |

---

## 관련 파일 목록

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx              # 대시보드
│   │   ├── layout.tsx            # 레이아웃
│   │   ├── templates/
│   │   │   ├── page.tsx          # 템플릿 목록
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # 템플릿 추가 ⚠️
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx  # 템플릿 수정 ⚠️
│   │   └── categories/
│   │       └── page.tsx          # 카테고리 관리 ⚠️
│   └── api/
│       └── admin/
│           ├── upload/
│           │   └── route.ts      # 업로드 API ⚠️
│           ├── templates/
│           │   ├── route.ts
│           │   ├── [id]/
│           │   │   └── route.ts
│           │   └── generate/     # AI 생성 (신규)
│           │       └── route.ts
│           ├── categories/
│           │   ├── route.ts
│           │   ├── [id]/
│           │   │   └── route.ts
│           │   └── reorder/      # 순서 변경 (신규)
│           │       └── route.ts
│           └── stats/
│               └── route.ts
├── components/
│   └── admin/
│       └── AdminSidebar.tsx      # 사이드바 ⚠️
└── lib/
    └── ai/                       # AI 기능 (신규)
        ├── templateGenerator.ts
        ├── colorExtractor.ts
        └── regionDetector.ts
```

⚠️ = 수정 필요

---

## 참고 자료

- [dnd-kit 공식 문서](https://dndkit.com/)
- [Supabase Storage 가이드](https://supabase.com/docs/guides/storage)
- [Color Quantization 알고리즘](https://en.wikipedia.org/wiki/Color_quantization)
- [Potrace - Bitmap to Vector](http://potrace.sourceforge.net/)
