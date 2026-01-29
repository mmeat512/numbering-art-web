import { NextRequest, NextResponse } from 'next/server'
import { generateTemplate, type GenerateOptions } from '@/lib/ai/templateGenerator'

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

    const formData = await request.formData()
    const file = formData.get('file') as File
    const colorCount = parseInt(formData.get('colorCount') as string) || 10
    const difficulty = (formData.get('difficulty') as string) || 'medium'
    const smoothing = parseFloat(formData.get('smoothing') as string) || 0.3

    if (!file) {
      return NextResponse.json(
        { error: '이미지 파일이 필요합니다.' },
        { status: 400 }
      )
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '이미지 파일만 업로드할 수 있습니다.' },
        { status: 400 }
      )
    }

    // 파일 크기 검증 (10MB)
    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: '파일 크기는 10MB를 초과할 수 없습니다.' },
        { status: 400 }
      )
    }

    // 옵션 검증
    if (colorCount < 5 || colorCount > 30) {
      return NextResponse.json(
        { error: '색상 수는 5-30 사이여야 합니다.' },
        { status: 400 }
      )
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json(
        { error: '유효하지 않은 난이도입니다.' },
        { status: 400 }
      )
    }

    // 이미지 버퍼 변환
    const arrayBuffer = await file.arrayBuffer()
    const imageBuffer = Buffer.from(arrayBuffer)

    // 템플릿 생성
    const options: GenerateOptions = {
      colorCount,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      smoothing: Math.max(0, Math.min(1, smoothing)),
    }

    const template = await generateTemplate(imageBuffer, options)

    return NextResponse.json({
      success: true,
      data: {
        width: template.width,
        height: template.height,
        colorCount: template.colors.length,
        colors: template.colors.map((c, i) => ({
          index: i + 1,
          hex: c.hex,
          percentage: Math.round(c.percentage * 10) / 10,
        })),
        regionCount: template.templateData?.regions.length || template.regions.length,
        previewImage: template.previewImageBase64,
        // 새로운 SVG 템플릿 데이터
        templateData: template.templateData,
        colorPalette: template.colorPalette,
      },
    })

  } catch (error) {
    console.error('Template generation error:', error)
    return NextResponse.json(
      { error: '템플릿 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}
