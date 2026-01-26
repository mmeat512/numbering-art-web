import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin 경로에 대한 접근 제어
  if (pathname.startsWith('/admin')) {
    // 쿠키에서 인증 상태 확인
    const adminAuth = request.cookies.get('admin_auth')

    // 인증되지 않은 경우 설정 페이지로 리다이렉트
    if (!adminAuth || adminAuth.value !== 'true') {
      return NextResponse.redirect(new URL('/settings', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
