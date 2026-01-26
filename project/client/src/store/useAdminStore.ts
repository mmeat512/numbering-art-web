import { create } from 'zustand'

const ADMIN_PASSWORD = '170512'
const ADMIN_AUTH_KEY = 'admin_authenticated'
const ADMIN_COOKIE_NAME = 'admin_auth'

interface AdminStore {
  // 인증 상태
  isAuthenticated: boolean

  // 인증 액션
  authenticate: (password: string) => boolean
  logout: () => void
  checkAuth: () => boolean
}

// 쿠키 설정 함수
function setAdminCookie(value: boolean) {
  if (typeof document !== 'undefined') {
    if (value) {
      // 세션 쿠키로 설정 (브라우저 종료 시 삭제)
      document.cookie = `${ADMIN_COOKIE_NAME}=true; path=/; SameSite=Strict`
    } else {
      // 쿠키 삭제
      document.cookie = `${ADMIN_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
  }
}

// 쿠키 확인 함수
function getAdminCookie(): boolean {
  if (typeof document !== 'undefined') {
    return document.cookie.includes(`${ADMIN_COOKIE_NAME}=true`)
  }
  return false
}

export const useAdminStore = create<AdminStore>((set) => ({
  isAuthenticated: false,

  // 비밀번호 확인 및 인증
  authenticate: (password: string) => {
    if (password === ADMIN_PASSWORD) {
      // sessionStorage에 인증 상태 저장 (브라우저 종료 시 자동 삭제)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true')
      }
      // 쿠키도 설정 (middleware에서 확인용)
      setAdminCookie(true)
      set({ isAuthenticated: true })
      return true
    }
    return false
  },

  // 로그아웃
  logout: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(ADMIN_AUTH_KEY)
    }
    setAdminCookie(false)
    set({ isAuthenticated: false })
  },

  // 인증 상태 확인 (페이지 로드 시)
  checkAuth: () => {
    if (typeof window !== 'undefined') {
      const isSessionAuth = sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true'
      const isCookieAuth = getAdminCookie()
      const isAuth = isSessionAuth && isCookieAuth
      set({ isAuthenticated: isAuth })
      return isAuth
    }
    return false
  },
}))
