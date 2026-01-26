import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: NextRequest) {
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
    const { orderedIds } = body

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: '순서 정보가 올바르지 않습니다.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 각 카테고리의 order 업데이트
    const updates = orderedIds.map((id, index) =>
      supabase
        .from('categories')
        .update({ order: index })
        .eq('id', id)
    )

    const results = await Promise.all(updates)

    // 에러 확인
    const errors = results.filter(result => result.error)
    if (errors.length > 0) {
      console.error('Reorder errors:', errors)
      return NextResponse.json(
        { error: '일부 카테고리 순서 변경에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '카테고리 순서가 변경되었습니다.',
    })
  } catch (error) {
    console.error('Reorder exception:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
