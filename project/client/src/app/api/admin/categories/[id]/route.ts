import { NextRequest, NextResponse } from 'next/server'

// 인증 확인 헬퍼
function checkAuth(request: NextRequest) {
  const adminAuth = request.cookies.get('admin_auth')
  return adminAuth && adminAuth.value === 'true'
}

// GET - 단일 카테고리 조회
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
    // 임시 응답
    return NextResponse.json({
      success: true,
      data: {
        id,
        name: 'Sample Category',
        slug: 'sample',
        templateCount: 0,
      },
    })
  } catch (error) {
    console.error('GET category error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// PATCH - 카테고리 수정
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

    return NextResponse.json({
      success: true,
      data: {
        id,
        ...body,
        updatedAt: new Date().toISOString(),
      },
      message: '카테고리가 수정되었습니다.',
    })
  } catch (error) {
    console.error('PATCH category error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE - 카테고리 삭제
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
    // 템플릿이 있는 카테고리는 삭제 불가 체크

    return NextResponse.json({
      success: true,
      message: '카테고리가 삭제되었습니다.',
    })
  } catch (error) {
    console.error('DELETE category error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
