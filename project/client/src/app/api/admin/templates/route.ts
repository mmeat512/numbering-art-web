import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SAMPLE_TEMPLATES } from '@/data/templates'
import type { Template } from '@/types'

// 인증 확인 헬퍼
function checkAuth(request: NextRequest) {
  const adminAuth = request.cookies.get('admin_auth')
  return adminAuth && adminAuth.value === 'true'
}

// GET - 템플릿 목록 조회
export async function GET(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { error: '인증되지 않은 요청입니다.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const difficulty = searchParams.get('difficulty')
    const search = searchParams.get('search')

    // TODO: 실제 데이터베이스에서 가져오기
    let templates = SAMPLE_TEMPLATES

    // 필터링
    if (categoryId) {
      templates = templates.filter((t) => t.categoryId === categoryId)
    }
    if (difficulty) {
      templates = templates.filter((t) => t.difficulty === difficulty)
    }
    if (search) {
      templates = templates.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      data: templates,
      total: templates.length,
    })
  } catch (error) {
    console.error('GET templates error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// POST - 새 템플릿 생성
export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { error: '인증되지 않은 요청입니다.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, categoryId, difficulty, description, thumbnailUrl } = body

    // 유효성 검사
    if (!title || !categoryId || !difficulty || !thumbnailUrl) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 실제 데이터베이스에 저장
    const supabase = await createClient()
    
    // snake_case로 변환하여 저장
    const { data: newTemplate, error } = await supabase
      .from('templates')
      .insert({
        title,
        category_id: categoryId,
        difficulty,
        description,
        thumbnail_url: thumbnailUrl,
        color_count: 10,
        region_count: 50,
        estimated_time: 30,
        template_data: {
          viewBox: '0 0 400 400',
          regions: [],
        },
        color_palette: [],
      })
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      return NextResponse.json(
        { error: '데이터베이스 저장에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newTemplate,
      message: '템플릿이 생성되었습니다.',
    })
  } catch (error) {
    console.error('POST template error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
