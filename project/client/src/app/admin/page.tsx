'use client'

import { useEffect, useState } from 'react'
import { FileImage, FolderTree, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AdminStats } from '@/types'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalTemplates: 0,
    activeTemplates: 0,
    totalCategories: 0,
    recentActivity: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="text-muted-foreground mt-2">
          템플릿과 카테고리를 관리하세요
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">전체 템플릿</CardTitle>
            <FileImage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTemplates}</div>
            <p className="text-xs text-muted-foreground mt-1">
              등록된 모든 템플릿
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">활성 템플릿</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTemplates}</div>
            <p className="text-xs text-muted-foreground mt-1">
              현재 사용 중인 템플릿
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">카테고리</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground mt-1">
              등록된 카테고리
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">최근 활동</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground mt-1">
              최근 7일간 업데이트
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 빠른 액션 */}
      <Card>
        <CardHeader>
          <CardTitle>빠른 시작</CardTitle>
          <CardDescription>
            자주 사용하는 기능에 빠르게 접근하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="/admin/templates/new"
              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileImage className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">새 템플릿 추가</h3>
                <p className="text-sm text-muted-foreground">
                  새로운 컬러링 템플릿을 등록합니다
                </p>
              </div>
            </a>

            <a
              href="/admin/categories"
              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FolderTree className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">카테고리 관리</h3>
                <p className="text-sm text-muted-foreground">
                  템플릿 카테고리를 추가하거나 수정합니다
                </p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
