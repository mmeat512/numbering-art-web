import { NextRequest, NextResponse } from 'next/server'
import {
  generateColoringImage,
  generateWithImagen,
  type GenerateImageOptions,
} from '@/lib/ai/imageGenerator'

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const adminAuth = request.cookies.get('admin_auth')
    if (!adminAuth || adminAuth.value !== 'true') {
      return NextResponse.json(
        { error: '인증되지 않은 요청입니다.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { prompt, style, difficulty, useImagen } = body

    // 유효성 검사
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: '프롬프트가 필요합니다.' },
        { status: 400 }
      )
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: '프롬프트는 500자 이하여야 합니다.' },
        { status: 400 }
      )
    }

    const validStyles = ['simple', 'medium', 'complex']
    if (!validStyles.includes(style)) {
      return NextResponse.json(
        { error: '유효하지 않은 스타일입니다.' },
        { status: 400 }
      )
    }

    const validDifficulties = ['easy', 'medium', 'hard']
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { error: '유효하지 않은 난이도입니다.' },
        { status: 400 }
      )
    }

    const options: GenerateImageOptions = {
      style: style as 'simple' | 'medium' | 'complex',
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      aspectRatio: '1:1',
    }

    // Imagen 또는 Gemini로 이미지 생성
    const result = useImagen
      ? await generateWithImagen(prompt, options)
      : await generateColoringImage(prompt, options)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || '이미지 생성에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        images: result.images.map((img, index) => ({
          id: `generated-${Date.now()}-${index}`,
          base64: img.base64,
          mimeType: img.mimeType,
          dataUrl: `data:${img.mimeType};base64,${img.base64}`,
        })),
        prompt,
        style,
        difficulty,
      },
    })
  } catch (error) {
    console.error('AI image generation error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
