import { NextRequest, NextResponse } from 'next/server'
import { SAMPLE_TEMPLATES } from '@/data/templates'
import type { AdminStats } from '@/types'

// 인증 확인 헬퍼
function checkAuth(request: NextRequest) {
  const adminAuth = request.cookies.get('admin_auth')
  return adminAuth && adminAuth.value === 'true'
}

// GET - 대시보드 통계 조회
export async function GET(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { error: '인증되지 않은 요청입니다.' },
        { status: 401 }
      )
    }

    // TODO: 실제 데이터베이스에서 통계 가져오기
    const templates = SAMPLE_TEMPLATES

    const stats: AdminStats = {
      totalTemplates: templates.length,
      activeTemplates: templates.length, // TODO: isActive 필터
      totalCategories: 4, // TODO: 실제 카테고리 수
      recentActivity: 12, // TODO: 최근 7일간 업데이트 수
      totalUsers: 0, // TODO: 사용자 수
      completedArtworks: 0, // TODO: 완성된 작품 수
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('GET stats error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
