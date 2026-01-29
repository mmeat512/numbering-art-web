import { GoogleGenerativeAI } from '@google/generative-ai'

// Gemini API 클라이언트 초기화
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export interface GenerateImageOptions {
  style: 'simple' | 'medium' | 'complex'
  difficulty: 'easy' | 'medium' | 'hard'
  aspectRatio?: '1:1' | '4:3' | '3:4' | '16:9'
}

export interface GeneratedImage {
  base64: string
  mimeType: string
}

export interface GenerateImageResult {
  success: boolean
  images: GeneratedImage[]
  error?: string
}

// 스타일별 프롬프트 가이드
const STYLE_GUIDES = {
  simple: 'very simple shapes, minimal details, thick black outlines, cartoon-like',
  medium: 'moderate detail, clear black outlines, distinct regions, balanced complexity',
  complex: 'detailed illustration, fine black outlines, many regions, intricate patterns',
}

// 난이도별 프롬프트 가이드
const DIFFICULTY_GUIDES = {
  easy: '5-10 distinct coloring regions, large areas, simple shapes',
  medium: '15-25 distinct coloring regions, medium-sized areas',
  hard: '30-50 distinct coloring regions, small detailed areas',
}

/**
 * 컬러링북 이미지 생성을 위한 최적화된 프롬프트를 생성합니다.
 */
export function buildColoringPrompt(
  userPrompt: string,
  options: GenerateImageOptions
): string {
  const styleGuide = STYLE_GUIDES[options.style]
  const difficultyGuide = DIFFICULTY_GUIDES[options.difficulty]

  return `Create a coloring book page illustration of: ${userPrompt}

Style requirements:
- ${styleGuide}
- Pure white background
- Black line art only, no colors filled in
- No shading, no gradients
- Clean, closed contours suitable for coloring
- ${difficultyGuide}
- Suitable for digital coloring app
- High contrast black lines on white background`
}

/**
 * Gemini API를 사용하여 컬러링북 이미지를 생성합니다.
 */
export async function generateColoringImage(
  prompt: string,
  options: GenerateImageOptions
): Promise<GenerateImageResult> {
  try {
    // API 키 확인
    if (!process.env.GOOGLE_AI_API_KEY) {
      return {
        success: false,
        images: [],
        error: 'GOOGLE_AI_API_KEY 환경 변수가 설정되지 않았습니다.',
      }
    }

    // 최적화된 프롬프트 생성
    const optimizedPrompt = buildColoringPrompt(prompt, options)

    // Gemini 이미지 생성용 모델 사용
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-image',
    })

    // 이미지 생성 요청
    const images: GeneratedImage[] = []

    try {
      // 여러 이미지 생성을 위해 순차 요청
      for (let i = 0; i < 4; i++) {
        const result = await model.generateContent({
          contents: [{
            role: 'user',
            parts: [{ text: optimizedPrompt }]
          }],
          generationConfig: {
            // @ts-expect-error - responseModalities는 이미지 생성 모델에서 지원
            responseModalities: ['IMAGE', 'TEXT'],
          }
        })
        
        const response = result.response

        // 이미지 데이터 추출
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            images.push({
              base64: part.inlineData.data,
              mimeType: part.inlineData.mimeType || 'image/png',
            })
            break // 이미지 하나만 추출
          }
        }
      }
    } catch (err) {
      console.error('Image generation error:', err)
    }

    if (images.length === 0) {
      return {
        success: false,
        images: [],
        error: '이미지 생성에 실패했습니다. 다시 시도해주세요.',
      }
    }

    return {
      success: true,
      images,
    }
  } catch (error) {
    console.error('AI image generation error:', error)
    return {
      success: false,
      images: [],
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    }
  }
}

/**
 * Imagen 3 API를 사용하여 이미지를 생성합니다.
 * 참고: Imagen 3는 별도의 API 엔드포인트를 사용합니다.
 */
export async function generateWithImagen(
  prompt: string,
  options: GenerateImageOptions
): Promise<GenerateImageResult> {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      return {
        success: false,
        images: [],
        error: 'GOOGLE_AI_API_KEY 환경 변수가 설정되지 않았습니다.',
      }
    }

    const optimizedPrompt = buildColoringPrompt(prompt, options)

    // Imagen 3 모델 사용
    const model = genAI.getGenerativeModel({
      model: 'imagen-3.0-generate-002',
    })

    // @ts-expect-error - generateImages는 Imagen 모델에서 지원
    const result = await model.generateImages({
      prompt: optimizedPrompt,
      numberOfImages: 4,
      aspectRatio: options.aspectRatio || '1:1',
      safetyFilterLevel: 'block_few',
    })

    const images: GeneratedImage[] = ((result as { images?: { data: string }[] }).images || []).map((img) => ({
      base64: img.data,
      mimeType: 'image/png',
    }))

    return {
      success: true,
      images,
    }
  } catch (error) {
    console.error('Imagen generation error:', error)
    // Imagen 실패 시 Gemini로 폴백
    return generateColoringImage(prompt, options)
  }
}
