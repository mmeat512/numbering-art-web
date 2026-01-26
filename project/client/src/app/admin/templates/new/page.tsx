'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
}

interface GeneratedColor {
  index: number
  hex: string
  percentage: number
}

interface GenerationResult {
  width: number
  height: number
  colorCount: number
  colors: GeneratedColor[]
  regionCount: number
  previewImage: string
}

type TabType = 'manual' | 'ai'

export default function NewTemplatePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('manual')
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

  // AI 생성 관련 상태
  const [aiColorCount, setAiColorCount] = useState(10)
  const [aiSmoothing, setAiSmoothing] = useState(0.3)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null)

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
      setGenerationResult(null)
    }
  }

  const handleGenerate = async () => {
    if (!imageFile) {
      toast.error('이미지를 먼저 업로드해주세요.')
      return
    }

    setIsGenerating(true)
    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('colorCount', aiColorCount.toString())
      formData.append('difficulty', 'medium')
      formData.append('smoothing', aiSmoothing.toString())

      const response = await fetch('/api/admin/templates/generate', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '생성에 실패했습니다.')
      }

      const data = await response.json()
      setGenerationResult(data.data)
      toast.success('템플릿이 생성되었습니다!')
    } catch (error) {
      console.error('Generation error:', error)
      toast.error(error instanceof Error ? error.message : '템플릿 생성에 실패했습니다.')
    } finally {
      setIsGenerating(false)
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
          colorCount: generationResult?.colorCount,
          regionCount: generationResult?.regionCount,
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

      {/* 탭 */}
      <div className="mb-6 flex gap-2 border-b">
        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'manual'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Upload className="inline-block mr-2 h-4 w-4" />
          수동 업로드
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'ai'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className="inline-block mr-2 h-4 w-4" />
          AI 생성
        </button>
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

            {/* AI 설정 (AI 탭일 때만 표시) */}
            {activeTab === 'ai' && (
              <Card>
                <CardHeader>
                  <CardTitle>AI 생성 설정</CardTitle>
                  <CardDescription>색상 추출 및 영역 분할 옵션</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 색상 수 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      색상 수: {aiColorCount}개
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={aiColorCount}
                      onChange={(e) => setAiColorCount(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5 (쉬움)</span>
                      <span>30 (어려움)</span>
                    </div>
                  </div>

                  {/* 스무딩 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      영역 부드러움: {Math.round(aiSmoothing * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={aiSmoothing * 100}
                      onChange={(e) => setAiSmoothing(parseInt(e.target.value) / 100)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>선명함</span>
                      <span>부드러움</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!imageFile || isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        생성 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        템플릿 생성
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 오른쪽: 이미지 업로드 / 미리보기 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'manual' ? '이미지 업로드' : '원본 이미지'}
                </CardTitle>
                <CardDescription>
                  PNG 또는 JPG 파일 (최대 {activeTab === 'ai' ? '10' : '5'}MB)
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

            {/* AI 생성 결과 미리보기 */}
            {activeTab === 'ai' && generationResult && (
              <Card>
                <CardHeader>
                  <CardTitle>생성 결과</CardTitle>
                  <CardDescription>
                    {generationResult.colorCount}색, {generationResult.regionCount}개 영역
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 미리보기 이미지 */}
                  <div className="rounded-lg overflow-hidden border">
                    <img
                      src={generationResult.previewImage}
                      alt="Generated preview"
                      className="w-full"
                    />
                  </div>

                  {/* 색상 팔레트 */}
                  <div>
                    <p className="text-sm font-medium mb-2">색상 팔레트</p>
                    <div className="flex flex-wrap gap-2">
                      {generationResult.colors.map((color) => (
                        <div
                          key={color.index}
                          className="flex items-center gap-2 rounded-lg border px-2 py-1"
                        >
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-xs font-mono">
                            {color.index}. {color.hex}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({color.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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
