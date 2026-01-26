'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import type { Template } from '@/types'

export default function TemplatesListPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.data)
      } else {
        toast.error('템플릿을 불러올 수 없습니다.')
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
      toast.error('서버 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 템플릿을 삭제하시겠습니까?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/templates/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('템플릿이 삭제되었습니다.')
        fetchTemplates() // 목록 새로고침
      } else {
        toast.error('삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('서버 오류가 발생했습니다.')
    }
  }

  return (
    <div className="container mx-auto p-6">
      {/* 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">템플릿 관리</h1>
          <p className="text-muted-foreground mt-2">
            컬러링 템플릿을 추가하거나 수정합니다
          </p>
        </div>
        <Button onClick={() => router.push('/admin/templates/new')}>
          <Plus className="mr-2 h-4 w-4" />
          새 템플릿 추가
        </Button>
      </div>

      {/* 검색 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="템플릿 제목으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border bg-background px-10 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* 템플릿 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>전체 템플릿 ({filteredTemplates.length}개)</CardTitle>
          <CardDescription>
            등록된 모든 템플릿을 확인하고 관리할 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? '검색 결과가 없습니다.' : '등록된 템플릿이 없습니다.'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => router.push('/admin/templates/new')}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  첫 템플릿 추가하기
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium">썸네일</th>
                    <th className="pb-3 text-left font-medium">제목</th>
                    <th className="pb-3 text-left font-medium">카테고리</th>
                    <th className="pb-3 text-left font-medium">난이도</th>
                    <th className="pb-3 text-left font-medium">색상 수</th>
                    <th className="pb-3 text-left font-medium">사용 횟수</th>
                    <th className="pb-3 text-right font-medium">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTemplates.map((template) => (
                    <tr key={template.id} className="border-b last:border-0">
                      <td className="py-4">
                        <img
                          src={template.thumbnailUrl}
                          alt={template.title}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      </td>
                      <td className="py-4 font-medium">{template.title}</td>
                      <td className="py-4 text-muted-foreground">{template.categoryId}</td>
                      <td className="py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            template.difficulty === 'easy'
                              ? 'bg-green-100 text-green-700'
                              : template.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {template.difficulty === 'easy'
                            ? '쉬움'
                            : template.difficulty === 'medium'
                            ? '보통'
                            : '어려움'}
                        </span>
                      </td>
                      <td className="py-4 text-muted-foreground">{template.colorCount}개</td>
                      <td className="py-4 text-muted-foreground">{template.usageCount}회</td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/admin/templates/${template.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(template.id, template.title)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
