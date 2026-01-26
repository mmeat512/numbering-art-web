import { NextRequest, NextResponse } from 'next/server'
import type { AdminCategory } from '@/types'

// 인증 확인 헬퍼
function checkAuth(request: NextRequest) {
  const adminAuth = request.cookies.get('admin_auth')
  return adminAuth && adminAuth.value === 'true'
}

// 임시 메모리 스토어 (TODO: 실제 데이터베이스로 교체)
const mockCategories: AdminCategory[] = [
  {
    id: '1',
    name: '동물',
    slug: 'animals',
    description: '귀여운 동물들',
    templateCount: 5,
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: '자연',
    slug: 'nature',
    description: '아름다운 자연 풍경',
    templateCount: 3,
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: '음식',
    slug: 'food',
    description: '맛있는 음식들',
    templateCount: 2,
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: '사물',
    slug: 'objects',
    description: '일상의 사물들',
    templateCount: 4,
    order: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// GET - 카테고리 목록 조회
export async function GET(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { error: '인증되지 않은 요청입니다.' },
        { status: 401 }
      )
    }

    // TODO: 실제 데이터베이스에서 가져오기
    const categories = mockCategories.sort((a, b) => a.order - b.order)

    return NextResponse.json({
      success: true,
      data: categories,
      total: categories.length,
    })
  } catch (error) {
    console.error('GET categories error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// POST - 새 카테고리 생성
export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { error: '인증되지 않은 요청입니다.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, slug, description } = body

    // 유효성 검사
    if (!name || !slug) {
      return NextResponse.json(
        { error: '이름과 슬러그는 필수입니다.' },
        { status: 400 }
      )
    }

    // 슬러그 중복 확인
    const existingCategory = mockCategories.find((c) => c.slug === slug)
    if (existingCategory) {
      return NextResponse.json(
        { error: '이미 존재하는 슬러그입니다.' },
        { status: 400 }
      )
    }

    // TODO: 실제 데이터베이스에 저장
    const newCategory: AdminCategory = {
      id: `category-${Date.now()}`,
      name,
      slug,
      description,
      templateCount: 0,
      order: mockCategories.length + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockCategories.push(newCategory)

    return NextResponse.json({
      success: true,
      data: newCategory,
      message: '카테고리가 생성되었습니다.',
    })
  } catch (error) {
    console.error('POST category error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
