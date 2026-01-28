# PNG → SVG 자동 변환 파이프라인 계획

## 목표
PNG 이미지를 업로드하면 자동으로 SVG 템플릿으로 변환하여 색칠 가능한 Template 객체 생성

---

## 기술 스택 선택

### 옵션 비교

| 방식 | 라이브러리 | 장점 | 단점 |
|------|-----------|------|------|
| **Potrace** | potrace, svg-pathify | 빠름, 가벼움 | 흑백 전용, 영역 분리 어려움 |
| **OpenCV.js** | opencv.js | 윤곽선 추출 정확 | 브라우저에서 무거움 |
| **Sharp + Potrace** | sharp, potrace | 서버 사이드, 안정적 | Node.js 전용 |
| **Vectorizer API** | 외부 API | 고품질 | 비용 발생, 의존성 |

### 권장: Sharp + Potrace (서버 사이드)

컬러링북 스타일 이미지에 최적화된 파이프라인:

```
PNG 업로드
    ↓
[1] Sharp로 이미지 전처리
    - 그레이스케일 변환
    - 대비 강화
    - 노이즈 제거
    ↓
[2] 색상 영역 분리
    - 색상 양자화 (Color Quantization)
    - 각 색상별 마스크 생성
    ↓
[3] Potrace로 벡터화
    - 각 마스크 → SVG Path 변환
    - Path 단순화 (Douglas-Peucker)
    ↓
[4] Template 객체 생성
    - regions 배열 생성
    - colorPalette 생성
    - labelX/Y 자동 계산
    ↓
[5] 저장
    - templates.ts에 추가 또는
    - DB에 저장
```

---

## 구현 단계

### Phase 1: 기본 변환 API
**파일**: `/app/api/admin/convert-template/route.ts`

```typescript
// 1. PNG 업로드 받기
// 2. Sharp로 전처리
// 3. 색상 추출 및 영역 분리
// 4. Potrace로 SVG Path 생성
// 5. Template 객체 반환
```

**필요 패키지**:
```bash
npm install sharp potrace @aspect-ratio/core
```

### Phase 2: 색상 양자화
- K-means 클러스터링으로 주요 색상 추출
- 각 색상별 마스크 이미지 생성

### Phase 3: Path 최적화
- Douglas-Peucker 알고리즘으로 포인트 수 감소
- 작은 영역 필터링 (최소 면적 설정)
- 숫자 라벨 위치 자동 계산 (중심점)

### Phase 4: 관리자 UI
- PNG 업로드 폼
- 미리보기 (변환된 SVG)
- 색상 팔레트 편집
- 저장/게시

---

## 파일 구조

```
src/
├── app/api/admin/
│   └── convert-template/
│       └── route.ts          # PNG → SVG 변환 API
├── lib/
│   └── image-to-svg/
│       ├── index.ts          # 메인 변환 로직
│       ├── colorQuantize.ts  # 색상 양자화
│       ├── traceToPath.ts    # Potrace 래퍼
│       └── pathOptimize.ts   # Path 최적화
└── app/admin/templates/
    └── new/
        └── page.tsx          # 업로드 UI (수정)
```

---

## API 설계

### POST /api/admin/convert-template

**Request**:
```typescript
{
  file: File (PNG/JPG)
  options?: {
    maxColors: number      // 기본 10
    minRegionArea: number  // 최소 영역 크기 (px)
    simplifyTolerance: number // Path 단순화 정도
  }
}
```

**Response**:
```typescript
{
  success: true,
  template: {
    colorPalette: NumberedColor[],
    templateData: {
      viewBox: string,
      regions: Region[]
    },
    previewSvg: string  // SVG 문자열 (미리보기용)
  }
}
```

---

## 예상 소요 시간

| 단계 | 작업 | 예상 |
|------|------|------|
| Phase 1 | 기본 변환 API | 1일 |
| Phase 2 | 색상 양자화 | 0.5일 |
| Phase 3 | Path 최적화 | 0.5일 |
| Phase 4 | 관리자 UI | 0.5일 |
| 테스트 | 다양한 이미지 테스트 | 0.5일 |

**총: 3일**

---

## 대안: 클라이언트 사이드 변환

서버 부하를 줄이려면 Web Worker + WASM 사용 가능:
- potrace-wasm
- opencv.js (WASM 버전)

단점: 초기 로딩 시간 증가, 브라우저 호환성

---

## 다음 단계

1. 필요 패키지 설치
2. 변환 API 기본 구조 생성
3. `floral-garden.png`로 테스트
4. 관리자 UI 연동

**진행할까요?**
