# AI 템플릿 생성 시스템

## 목표
1. **AI 이미지 생성**: Gemini/Imagen으로 컬러링북 이미지 자동 생성
2. **SVG 변환**: PNG → SVG 템플릿 자동 변환
3. **관리자 UI**: 원클릭 템플릿 생성

---

## 전체 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│              관리자 페이지 (/admin/templates/new)                 │
│                                                                  │
│   생성 방식:  [AI 생성]  [이미지 업로드]  [URL 입력]               │
└─────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  AI 이미지 생성   │  │  이미지 업로드   │  │   URL 입력      │
│  (Gemini/Imagen) │  │  (PNG/JPG)      │  │  (외부 이미지)   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PNG → SVG 변환                                │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │ 색상 추출    │ → │ 윤곽선 추출  │ → │ SVG Path    │        │
│  │ (K-means)   │    │ (Potrace)   │    │ 생성        │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    미리보기 & 수정 & 저장                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: AI 이미지 생성 (Gemini/Imagen)

### 기술 스택
| 서비스 | 용도 | 비용 |
|--------|------|------|
| **Imagen 3** | 이미지 생성 | $0.03/장 (무료 티어 있음) |
| **Gemini 2.0 Flash** | 이미지 생성 (대안) | API 요금 |

### API 구현

```typescript
// /app/api/admin/generate-image/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  const { prompt, style, difficulty } = await request.json();

  // 컬러링북 최적화 프롬프트
  const optimizedPrompt = buildColoringPrompt(prompt, style, difficulty);

  // Imagen 3로 이미지 생성
  const model = genAI.getGenerativeModel({ model: "imagen-3.0-generate-002" });

  const result = await model.generateImages({
    prompt: optimizedPrompt,
    numberOfImages: 4,
    aspectRatio: "1:1",
    safetyFilterLevel: "block_few",
  });

  return NextResponse.json({
    success: true,
    images: result.images.map(img => img.base64),
  });
}

function buildColoringPrompt(
  userPrompt: string,
  style: 'simple' | 'medium' | 'complex',
  difficulty: 'easy' | 'medium' | 'hard'
): string {
  const styleGuide = {
    simple: 'very simple shapes, minimal details, thick black outlines',
    medium: 'moderate detail, clear black outlines, distinct regions',
    complex: 'detailed illustration, fine black outlines, many regions'
  };

  const difficultyGuide = {
    easy: '5-10 distinct coloring regions, large areas',
    medium: '15-25 distinct coloring regions, medium areas',
    hard: '30-50 distinct coloring regions, small detailed areas'
  };

  return `${userPrompt}, coloring book page style, ${styleGuide[style]},
          white background, no shading, no gradients, no colors filled in,
          black and white line art, ${difficultyGuide[difficulty]},
          suitable for digital coloring app`;
}
```

### 관리자 UI (이미지 생성)

```typescript
// /app/admin/templates/new/page.tsx
'use client'

import { useState } from 'react'

export default function NewTemplatePage() {
  const [step, setStep] = useState<'generate' | 'convert' | 'edit' | 'save'>('generate')
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState<'simple' | 'medium' | 'complex'>('medium')
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/admin/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, difficulty: 'medium' })
      })
      const data = await res.json()
      setGeneratedImages(data.images)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      {step === 'generate' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">AI 템플릿 생성</h1>

          {/* 프롬프트 입력 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              어떤 그림을 만들까요?
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="예: 귀여운 고양이, 아름다운 꽃, 바다 풍경..."
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* 스타일 선택 */}
          <div>
            <label className="block text-sm font-medium mb-2">스타일</label>
            <div className="flex gap-4">
              {(['simple', 'medium', 'complex'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-4 py-2 rounded-lg border ${
                    style === s ? 'bg-primary text-white' : ''
                  }`}
                >
                  {s === 'simple' ? '심플' : s === 'medium' ? '보통' : '복잡'}
                </button>
              ))}
            </div>
          </div>

          {/* 생성 버튼 */}
          <button
            onClick={handleGenerate}
            disabled={!prompt || isGenerating}
            className="w-full py-3 bg-primary text-white rounded-lg disabled:opacity-50"
          >
            {isGenerating ? '생성 중... (10-20초)' : '이미지 생성하기'}
          </button>

          {/* 생성된 이미지 선택 */}
          {generatedImages.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {generatedImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                    selectedImage === img ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img src={`data:image/png;base64,${img}`} alt={`옵션 ${i + 1}`} />
                </div>
              ))}
            </div>
          )}

          {/* 다음 단계 */}
          {selectedImage && (
            <button
              onClick={() => setStep('convert')}
              className="w-full py-3 bg-green-600 text-white rounded-lg"
            >
              선택한 이미지로 템플릿 만들기
            </button>
          )}
        </div>
      )}

      {/* Step 2, 3, 4는 기존 변환/편집/저장 로직 */}
    </div>
  )
}
```

---

## Phase 2: PNG → SVG 변환 (Potrace)

### 기술 스택 (Node.js)
| 패키지 | 용도 |
|--------|------|
| **sharp** | 이미지 전처리 |
| **potrace** | 비트맵 → SVG 변환 |
| **color-thief-node** | 색상 추출 |

### 설치
```bash
cd project/client
npm install sharp potrace color-thief-node
```

### 변환 API

```typescript
// /app/api/admin/convert-template/route.ts
import sharp from 'sharp'
import potrace from 'potrace'
import ColorThief from 'color-thief-node'

export async function POST(request: NextRequest) {
  const { image, options } = await request.json()

  // 1. Base64 → Buffer
  const imageBuffer = Buffer.from(image, 'base64')

  // 2. 이미지 전처리 (Sharp)
  const processed = await sharp(imageBuffer)
    .resize(1024, 1024, { fit: 'inside' })
    .normalize()  // 대비 강화
    .toBuffer()

  // 3. 색상 추출
  const colors = await extractColors(processed, options.colorCount || 10)

  // 4. 각 색상별로 마스크 생성 및 SVG 변환
  const regions = await Promise.all(
    colors.map((color, index) =>
      createRegionFromColor(processed, color, index + 1)
    )
  )

  // 5. Template 객체 생성
  const template = {
    colorPalette: colors.map((c, i) => ({
      number: i + 1,
      hex: rgbToHex(c),
      name: `색상 ${i + 1}`,
      totalRegions: regions.filter(r => r.colorNumber === i + 1).length
    })),
    templateData: {
      viewBox: '0 0 1024 1024',
      regions: regions.flat()
    }
  }

  return NextResponse.json({ success: true, template })
}

async function extractColors(imageBuffer: Buffer, count: number) {
  const palette = await ColorThief.getPalette(imageBuffer, count)
  return palette
}

async function createRegionFromColor(
  imageBuffer: Buffer,
  targetColor: [number, number, number],
  colorNumber: number
): Promise<Region[]> {
  // 1. 해당 색상 영역만 추출 (마스크)
  const mask = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true })

  // 2. 색상 매칭으로 마스크 생성
  const maskBuffer = createColorMask(mask.data, mask.info, targetColor)

  // 3. Potrace로 SVG Path 생성
  return new Promise((resolve) => {
    potrace.trace(maskBuffer, {
      threshold: 128,
      turdSize: 100,  // 최소 영역 크기
      optTolerance: 0.2  // Path 단순화
    }, (err, svg) => {
      if (err) return resolve([])

      // SVG에서 path 추출
      const paths = extractPathsFromSvg(svg)
      const regions = paths.map((path, i) => ({
        id: `region-${colorNumber}-${i}`,
        colorNumber,
        path,
        labelX: calculateCentroid(path).x,
        labelY: calculateCentroid(path).y
      }))

      resolve(regions)
    })
  })
}
```

---

## Phase 3: SAM 지원 (선택사항, 나중에)

일반 사진 → 컬러링북 변환이 필요할 때 추가

```
project/maker/           # Python FastAPI 서버
├── app/
│   └── services/
│       └── segmentation.py  # SAM 모델
```

---

## 관리자 UI 전체 플로우

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: 생성 방식 선택                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ AI 생성     │  │ 파일 업로드  │  │ URL 입력    │            │
│  │ (추천)      │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: AI 이미지 생성 (AI 선택 시)                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  프롬프트: [귀여운 강아지가 공놀이 하는 모습]                 │   │
│  │                                                          │   │
│  │  스타일: ○ 심플  ● 보통  ○ 복잡                           │   │
│  │  난이도: ○ 쉬움  ● 보통  ○ 어려움                         │   │
│  │                                                          │   │
│  │  [이미지 생성] (10-20초)                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  생성된 이미지 (4개 중 선택):                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                  │
│  │   ✓    │ │        │ │        │ │        │                  │
│  └────────┘ └────────┘ └────────┘ └────────┘                  │
│                                                                  │
│  [다시 생성]  [선택한 이미지로 진행 →]                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: SVG 변환 & 미리보기                                     │
│  ┌────────────────────┐  ┌────────────────────────────────┐    │
│  │                    │  │  변환 옵션:                      │    │
│  │   [SVG 미리보기]    │  │  - 색상 수: [10] ▼              │    │
│  │                    │  │  - 최소 영역: [100px]           │    │
│  │   클릭하여         │  │  - Path 단순화: [중간]          │    │
│  │   영역 확인        │  │                                │    │
│  │                    │  │  [다시 변환]                    │    │
│  └────────────────────┘  └────────────────────────────────┘    │
│                                                                  │
│  감지된 영역: 45개  |  색상: 10개                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: 메타데이터 입력                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  제목: [귀여운 강아지]                                     │   │
│  │  카테고리: [동물 ▼]                                       │   │
│  │  난이도: ● 쉬움  ○ 보통  ○ 어려움 (자동 추천: 보통)        │   │
│  │                                                          │   │
│  │  색상 이름 편집:                                          │   │
│  │  1. [갈색] ■  2. [흰색] ■  3. [검정] ■  ...              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 5: 저장                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  [임시 저장]        [게시하기]                            │   │
│  │                                                          │   │
│  │  → 썸네일 자동 생성                                       │   │
│  │  → DB 저장 또는 templates.ts 업데이트                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 파일 구조

```
project/client/
├── app/
│   ├── api/admin/
│   │   ├── generate-image/      # AI 이미지 생성
│   │   │   └── route.ts
│   │   ├── convert-template/    # PNG → SVG 변환
│   │   │   └── route.ts
│   │   └── templates/           # 템플릿 CRUD (기존)
│   │       └── route.ts
│   └── admin/templates/
│       ├── page.tsx             # 템플릿 목록 (기존)
│       └── new/
│           └── page.tsx         # 새 템플릿 생성 (수정)
├── lib/
│   └── template-generator/
│       ├── index.ts             # 메인 로직
│       ├── imageGenerator.ts    # Gemini/Imagen 연동
│       ├── colorExtractor.ts    # 색상 추출
│       └── svgConverter.ts      # Potrace 래퍼
```

---

## 환경 변수

```bash
# .env.local
GOOGLE_AI_API_KEY=your_gemini_api_key
```

---

## 비용 예측

| 항목 | 월 100개 템플릿 생성 시 |
|------|----------------------|
| Imagen 3 (4장/템플릿) | $12/월 또는 무료 티어 |
| Vercel (서버) | $0~20/월 |
| **총** | **$12~32/월** |

---

## 구현 우선순위

| Phase | 기능 | 예상 시간 |
|-------|------|----------|
| **1** | PNG 업로드 → SVG 변환 (Potrace) | 1일 |
| **2** | AI 이미지 생성 (Gemini/Imagen) | 0.5일 |
| **3** | 관리자 UI (전체 플로우) | 1일 |
| **4** | 테스트 & 최적화 | 0.5일 |

**총: 3일**

---

## 다음 단계

1. [ ] Sharp, Potrace 패키지 설치
2. [ ] PNG → SVG 변환 API 구현
3. [ ] Gemini/Imagen 이미지 생성 API 구현
4. [ ] 관리자 UI 구현
5. [ ] `floral-garden.png`로 테스트
6. [ ] 전체 플로우 테스트

**진행할까요?**
