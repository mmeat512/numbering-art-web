'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { useAdminStore } from '@/store/useAdminStore'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAdminStore()

  useEffect(() => {
    // 인증 상태 확인
    const isAuth = checkAuth()
    if (!isAuth) {
      router.push('/settings')
    }
  }, [checkAuth, router])

  // 인증되지 않은 경우 아무것도 렌더링하지 않음
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
