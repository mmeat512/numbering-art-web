'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { TemplateCard, CategoryFilter } from '@/components/templates'
import { CATEGORIES, SAMPLE_TEMPLATES } from '@/data/templates'

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTemplates = SAMPLE_TEMPLATES.filter((template) => {
    const matchesCategory =
      !selectedCategory || selectedCategory === 'all' || template.categoryId === selectedCategory
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
        categories={CATEGORIES}
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
