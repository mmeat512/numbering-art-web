'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Palette, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TemplateCard } from '@/components/templates'
import { SAMPLE_TEMPLATES } from '@/data/templates'
import { getCompletedTemplateIds, getArtworksByTemplate, getAllArtworks, LocalArtwork } from '@/lib/db/indexedDB'
import { FilledRegion } from '@/types'

// 인기순으로 정렬된 템플릿 (상위 3개)
const recommendedTemplates = [...SAMPLE_TEMPLATES]
  .sort((a, b) => b.usageCount - a.usageCount)
  .slice(0, 3)

export default function HomePage() {
  const [completedTemplates, setCompletedTemplates] = useState<Set<string>>(new Set())
  const [completedArtworks, setCompletedArtworks] = useState<Map<string, Map<string, FilledRegion>>>(new Map())
  const [recentArtworks, setRecentArtworks] = useState<LocalArtwork[]>([])

  // 완료된 템플릿 정보 및 최근 작업 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        // 완료된 템플릿 로드
        const completedIds = await getCompletedTemplateIds()
        setCompletedTemplates(completedIds)

        // 완료된 템플릿의 색칠 데이터 로드
        const artworksMap = new Map<string, Map<string, FilledRegion>>()
        for (const templateId of completedIds) {
          const artworks = await getArtworksByTemplate(templateId)
          const completedArtwork = artworks.find(a => a.progress >= 100) as (LocalArtwork & { _filledRegions?: FilledRegion[] }) | undefined
          if (completedArtwork?._filledRegions) {
            const filledMap = new Map<string, FilledRegion>()
            completedArtwork._filledRegions.forEach(fr => filledMap.set(fr.regionId, fr))
            artworksMap.set(templateId, filledMap)
          }
        }
        setCompletedArtworks(artworksMap)

        // 최근 작업 로드 (최대 3개)
        const allArtworks = await getAllArtworks()
        setRecentArtworks(allArtworks.slice(0, 3))
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }
    loadData()
  }, [])

  return (
    <div className="container space-y-8 px-4 py-6">
      {/* 환영 메시지 */}
      <section className="text-center">
        <h1 className="text-2xl font-bold">안녕하세요! 👋</h1>
        <p className="mt-2 text-muted-foreground">
          오늘도 즐거운 컬러링 시간 되세요
        </p>
      </section>

      {/* 빠른 시작 */}
      <section>
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-primary/20 p-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">오늘의 추천</h2>
              <p className="text-sm text-muted-foreground">
                새로운 템플릿으로 시작해보세요
              </p>
            </div>
            <Button asChild className="touch-target-lg">
              <Link href="/templates">
                시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* 추천 템플릿 */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">인기 템플릿</h2>
          <Button variant="ghost" asChild className="text-sm">
            <Link href="/templates">
              더보기
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {recommendedTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              size="md"
              isCompleted={completedTemplates.has(template.id)}
              filledRegions={completedArtworks.get(template.id)}
            />
          ))}
        </div>
      </section>

      {/* 최근 작업 */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              최근 작업
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentArtworks.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {recentArtworks.map((artwork) => {
                  const template = SAMPLE_TEMPLATES.find(t => t.id === artwork.templateId)
                  if (!template) return null
                  const filledRegions = (artwork as LocalArtwork & { _filledRegions?: FilledRegion[] })._filledRegions
                  const filledMap = filledRegions
                    ? new Map(filledRegions.map(fr => [fr.regionId, fr]))
                    : undefined
                  return (
                    <Link
                      key={artwork.id}
                      href={`/coloring/${artwork.templateId}?artworkId=${artwork.id}`}
                      className="block"
                    >
                      <Card className="overflow-hidden transition-transform hover:scale-105">
                        <CardContent className="p-0">
                          <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 p-2">
                            {template.templateData && (
                              <svg
                                viewBox={template.templateData.viewBox}
                                className="h-full w-full"
                              >
                                {template.templateData.regions.map((region) => {
                                  const filled = filledMap?.get(region.id)
                                  const colorInfo = filled?.isCorrect
                                    ? template.colorPalette.find(c => c.number === filled.colorNumber)
                                    : null
                                  return (
                                    <path
                                      key={region.id}
                                      d={region.path}
                                      fill={colorInfo?.hex || 'white'}
                                      stroke="#CBD5E1"
                                      strokeWidth="1"
                                    />
                                  )
                                })}
                              </svg>
                            )}
                            {/* 진행률 표시 */}
                            <div className="absolute bottom-2 left-2 right-2 bg-black/60 rounded-full px-2 py-1">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-white rounded-full"
                                    style={{ width: `${artwork.progress}%` }}
                                  />
                                </div>
                                <span className="text-xs text-white font-medium">
                                  {artwork.progress}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="p-2">
                            <p className="text-sm font-medium truncate">{artwork.title}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="rounded-full bg-muted p-6">
                  <Palette className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">아직 작업한 작품이 없어요</p>
                  <p className="text-sm text-muted-foreground">
                    템플릿을 선택해서 첫 작품을 만들어보세요!
                  </p>
                </div>
                <Button asChild className="touch-target-lg">
                  <Link href="/templates">템플릿 둘러보기</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
