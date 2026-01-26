'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import type { AdminCategory } from '@/types'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.data)
      } else {
        toast.error('카테고리를 불러올 수 없습니다.')
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('서버 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  })

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
      })
    } else {
      setEditingCategory(null)
      setFormData({ name: '', slug: '', description: '' })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    setFormData({ name: '', slug: '', description: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.slug) {
      toast.error('이름과 슬러그는 필수입니다.')
      return
    }

    try {
      if (editingCategory) {
        // 수정
        const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          toast.success('카테고리가 수정되었습니다.')
          fetchCategories()
        } else {
          toast.error('카테고리 수정에 실패했습니다.')
        }
      } else {
        // 생성
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          toast.success('카테고리가 추가되었습니다.')
          fetchCategories()
        } else {
          const data = await response.json()
          toast.error(data.error || '카테고리 추가에 실패했습니다.')
        }
      }

      handleCloseModal()
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('서버 오류가 발생했습니다.')
    }
  }

  const handleDelete = async (id: string, name: string, templateCount: number) => {
    if (templateCount > 0) {
      toast.error(`이 카테고리에는 ${templateCount}개의 템플릿이 있어 삭제할 수 없습니다.`)
      return
    }

    if (!confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('카테고리가 삭제되었습니다.')
        fetchCategories()
      } else {
        toast.error('카테고리 삭제에 실패했습니다.')
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
          <h1 className="text-3xl font-bold">카테고리 관리</h1>
          <p className="text-muted-foreground mt-2">
            템플릿 카테고리를 추가하거나 수정합니다
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          새 카테고리 추가
        </Button>
      </div>

      {/* 카테고리 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>전체 카테고리 ({categories.length}개)</CardTitle>
          <CardDescription>
            등록된 모든 카테고리를 확인하고 관리할 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">등록된 카테고리가 없습니다.</p>
              <Button
                onClick={() => handleOpenModal()}
                className="mt-4"
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                첫 카테고리 추가하기
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium w-12">순서</th>
                    <th className="pb-3 text-left font-medium">이름</th>
                    <th className="pb-3 text-left font-medium">슬러그</th>
                    <th className="pb-3 text-left font-medium">설명</th>
                    <th className="pb-3 text-left font-medium">템플릿 수</th>
                    <th className="pb-3 text-right font-medium">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {categories
                    .sort((a, b) => a.order - b.order)
                    .map((category) => (
                      <tr key={category.id} className="border-b last:border-0">
                        <td className="py-4">
                          <button className="cursor-move text-muted-foreground hover:text-foreground">
                            <GripVertical className="h-5 w-5" />
                          </button>
                        </td>
                        <td className="py-4 font-medium">{category.name}</td>
                        <td className="py-4 text-muted-foreground font-mono text-sm">
                          {category.slug}
                        </td>
                        <td className="py-4 text-muted-foreground max-w-md truncate">
                          {category.description || '-'}
                        </td>
                        <td className="py-4 text-muted-foreground">
                          {category.templateCount}개
                        </td>
                        <td className="py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenModal(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleDelete(category.id, category.name, category.templateCount)
                              }
                              disabled={category.templateCount > 0}
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

      {/* 추가/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? '카테고리 수정' : '새 카테고리 추가'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 이름 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="예: 동물"
                  className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* 슬러그 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  슬러그 *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="예: animals"
                  className="w-full rounded-lg border px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  pattern="[a-z0-9-]+"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  소문자, 숫자, 하이픈만 사용 가능
                </p>
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  설명 (선택)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="카테고리에 대한 간단한 설명"
                  rows={3}
                  className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button type="submit" className="flex-1">
                  {editingCategory ? '수정' : '추가'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
