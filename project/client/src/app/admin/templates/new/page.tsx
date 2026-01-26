'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
}

export default function NewTemplatePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    description: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setCategoriesLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.categoryId) {
      toast.error('제목과 카테고리는 필수입니다.')
      return
    }

    if (!imageFile) {
      toast.error('이미지를 업로드해주세요.')
      return
    }

    try {
      // 1. 이미지 업로드
      const uploadFormData = new FormData()
      uploadFormData.append('file', imageFile)

      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        toast.error('이미지 업로드에 실패했습니다.')
        return
      }

      const uploadData = await uploadResponse.json()

      // 2. 템플릿 생성
      const templateResponse = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          thumbnailUrl: uploadData.url,
        }),
      })

      if (templateResponse.ok) {
        toast.success('템플릿이 추가되었습니다.')
        router.push('/admin/templates')
      } else {
        toast.error('템플릿 생성에 실패했습니다.')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('서버 오류가 발생했습니다.')
    }
  }

  return (
    <div className="container mx-auto p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          돌아가기
        </Button>
        <h1 className="text-3xl font-bold">새 템플릿 추가</h1>
        <p className="text-muted-foreground mt-2">
          새로운 컬러링 템플릿을 등록합니다
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 왼쪽: 폼 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
                <CardDescription>템플릿의 기본 정보를 입력하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 제목 */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    제목 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="템플릿 제목을 입력하세요"
                    className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* 카테고리 */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    카테고리 *
                  </label>
                  {categoriesLoading ? (
                    <div className="w-full rounded-lg border px-4 py-2 text-muted-foreground">
                      로딩 중...
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="space-y-2">
                      <div className="w-full rounded-lg border px-4 py-2 text-muted-foreground bg-muted/30">
                        등록된 카테고리가 없습니다
                      </div>
                      <Link
                        href="/admin/categories"
                        className="text-sm text-primary hover:underline"
                      >
                        카테고리 추가하러 가기
                      </Link>
                    </div>
                  ) : (
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">선택하세요</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* 난이도 */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    난이도
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: 'easy' as const, label: '쉬움' },
                      { value: 'medium' as const, label: '보통' },
                      { value: 'hard' as const, label: '어려움' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="difficulty"
                          value={option.value}
                          checked={formData.difficulty === option.value}
                          onChange={(e) =>
                            setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })
                          }
                          className="h-4 w-4"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 설명 */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    설명 (선택)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="템플릿에 대한 설명을 입력하세요"
                    rows={4}
                    className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 이미지 업로드 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>이미지 업로드</CardTitle>
                <CardDescription>
                  PNG 또는 JPG 파일 (최대 5MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 업로드 영역 */}
                  <label
                    htmlFor="image-upload"
                    className="flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 transition-colors hover:border-primary"
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-[280px] rounded-lg object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 font-medium">이미지를 선택하세요</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          클릭하여 파일을 선택하거나 드래그하세요
                        </p>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {imageFile && (
                    <div className="text-sm text-muted-foreground">
                      선택된 파일: {imageFile.name}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            취소
          </Button>
          <Button type="submit">
            템플릿 추가
          </Button>
        </div>
      </form>
    </div>
  )
}
