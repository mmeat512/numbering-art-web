import { NextRequest, NextResponse } from 'next/server'
import { SAMPLE_TEMPLATES } from '@/data/templates'

// 인증 확인 헬퍼
function checkAuth(request: NextRequest) {
  const adminAuth = request.cookies.get('admin_auth')
  return adminAuth && adminAuth.value === 'true'
}

// GET - 단일 템플릿 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { error: '인증되지 않은 요청입니다.' },
        { status: 401 }
      )
    }

    const { id } = await params

    // TODO: 실제 데이터베이스에서 가져오기
    const templates = SAMPLE_TEMPLATES
    const template = templates.find((t) => t.id === id)

    if (!template) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: template,
    })
  } catch (error) {
    console.error('GET template error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// PATCH - 템플릿 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { error: '인증되지 않은 요청입니다.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // TODO: 실제 데이터베이스에서 업데이트
    const templates = SAMPLE_TEMPLATES
    const template = templates.find((t) => t.id === id)

    if (!template) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const updatedTemplate = {
      ...template,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: updatedTemplate,
      message: '템플릿이 수정되었습니다.',
    })
  } catch (error) {
    console.error('PATCH template error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE - 템플릿 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { error: '인증되지 않은 요청입니다.' },
        { status: 401 }
      )
    }

    const { id } = await params

    // TODO: 실제 데이터베이스에서 삭제
    const templates = SAMPLE_TEMPLATES
    const template = templates.find((t) => t.id === id)

    if (!template) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // TODO: 관련 이미지도 삭제 (Supabase Storage)

    return NextResponse.json({
      success: true,
      message: '템플릿이 삭제되었습니다.',
    })
  } catch (error) {
    console.error('DELETE template error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
