'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { TemplateCard, CategoryFilter } from '@/components/templates'
import { Category, Template } from '@/types'

// 임시 카테고리 데이터
const categories: Category[] = [
  { id: 'mandala', name: 'Mandala', nameKo: '만다라', icon: '🔮', sortOrder: 1 },
  { id: 'animals', name: 'Animals', nameKo: '동물', icon: '🐱', sortOrder: 2 },
  { id: 'flowers', name: 'Flowers', nameKo: '꽃', icon: '🌸', sortOrder: 3 },
  { id: 'traditional', name: 'Traditional', nameKo: '전통', icon: '🏮', sortOrder: 4 },
  { id: 'landscape', name: 'Landscape', nameKo: '풍경', icon: '🏔️', sortOrder: 5 },
  { id: 'abstract', name: 'Abstract', nameKo: '추상', icon: '🎨', sortOrder: 6 },
]

// 임시 템플릿 데이터
const allTemplates: Template[] = [
  {
    id: '1',
    title: '봄 꽃 만다라',
    categoryId: 'mandala',
    difficulty: 'easy',
    imageUrl: '',
    thumbnailUrl: '',
    usageCount: 150,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '전통 문양',
    categoryId: 'traditional',
    difficulty: 'medium',
    imageUrl: '',
    thumbnailUrl: '',
    usageCount: 120,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '귀여운 고양이',
    categoryId: 'animals',
    difficulty: 'easy',
    imageUrl: '',
    thumbnailUrl: '',
    usageCount: 200,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: '장미 정원',
    categoryId: 'flowers',
    difficulty: 'medium',
    imageUrl: '',
    thumbnailUrl: '',
    usageCount: 180,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: '산과 호수',
    categoryId: 'landscape',
    difficulty: 'hard',
    imageUrl: '',
    thumbnailUrl: '',
    usageCount: 90,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: '기하학 패턴',
    categoryId: 'abstract',
    difficulty: 'medium',
    imageUrl: '',
    thumbnailUrl: '',
    usageCount: 110,
    createdAt: new Date().toISOString(),
  },
]

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTemplates = allTemplates.filter((template) => {
    const matchesCategory =
      !selectedCategory || template.categoryId === selectedCategory
    const matchesSearch =
      !searchQuery ||
      template.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container space-y-6 px-4 py-6">
      {/* 검색 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="템플릿 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border bg-background px-10 py-3 text-base outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 touch-target"
        />
      </div>

      {/* 카테고리 필터 */}
      <CategoryFilter
        categories={categories}
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* 템플릿 그리드 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {/* 결과 없음 */}
      {filteredTemplates.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-lg font-medium">검색 결과가 없어요</p>
          <p className="text-sm text-muted-foreground">
            다른 검색어나 카테고리를 선택해보세요
          </p>
        </div>
      )}
    </div>
  )
}
