'use client'

import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FileImage, FolderTree, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdminStore } from '@/store/useAdminStore'
import { toast } from 'sonner'

const navItems = [
  {
    title: '대시보드',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: '템플릿 관리',
    href: '/admin/templates',
    icon: FileImage,
  },
  {
    title: '카테고리 관리',
    href: '/admin/categories',
    icon: FolderTree,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAdminStore()

  const handleLogout = () => {
    logout()
    toast.success('로그아웃되었습니다.')
    router.push('/settings')
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/30">
      {/* 로고 영역 */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">관리자 페이지</h1>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname === item.href || pathname?.startsWith(item.href + '/')

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </button>
          )
        })}
      </nav>

      {/* 로그아웃 버튼 */}
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">로그아웃</span>
        </button>
      </div>
    </div>
  )
}
