'use client'

import Link from 'next/link'
import { Palette, Grid3X3, Clock, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Template, FilledRegion } from '@/types'

interface TemplateCardProps {
  template: Template
  size?: 'sm' | 'md' | 'lg'
  isCompleted?: boolean
  filledRegions?: Map<string, FilledRegion>
}

const difficultyLabels = {
  easy: { text: '쉬움', color: 'bg-green-100 text-green-800' },
  medium: { text: '보통', color: 'bg-yellow-100 text-yellow-800' },
  hard: { text: '어려움', color: 'bg-red-100 text-red-800' },
}

const sizeClasses = {
  sm: 'w-full',
  md: 'w-full',
  lg: 'w-full',
}

export function TemplateCard({ template, size = 'md', isCompleted = false, filledRegions }: TemplateCardProps) {
  const difficulty = difficultyLabels[template.difficulty]

  // 완료된 경우 색상 가져오기
  const getRegionColor = (regionId: string, defaultColor: string = 'white'): string => {
    if (!isCompleted || !filledRegions) return defaultColor
    const filled = filledRegions.get(regionId)
    if (filled?.isCorrect) {
      const colorInfo = template.colorPalette.find(c => c.number === filled.colorNumber)
      return colorInfo?.hex || defaultColor
    }
    return defaultColor
  }

  return (
    <Link href={`/coloring/${template.id}`} className="block">
      <Card className={cn(
        "overflow-hidden transition-transform hover:scale-105 active:scale-95 touch-target",
        isCompleted && "ring-2 ring-green-500 ring-offset-2"
      )}>
        <CardContent className="p-0">
          {/* 썸네일 / SVG 미리보기 */}
          <div className={cn('relative aspect-square', sizeClasses[size])}>
            {template.thumbnailUrl && !isCompleted ? (
              <img
                src={template.thumbnailUrl}
                alt={template.title}
                className="h-full w-full object-cover"
              />
            ) : template.templateData ? (
              // SVG 미리보기 (완료 시 색칠된 상태, 미완료 시 윤곽선만)
              <div className={cn(
                "flex h-full w-full items-center justify-center p-1",
                isCompleted
                  ? "bg-gradient-to-br from-green-50 to-emerald-50"
                  : "bg-gradient-to-br from-slate-50 to-slate-100"
              )}>
                <svg
                  viewBox={template.templateData.viewBox}
                  className="h-full w-full"
                >
                  {template.templateData.regions.map((region) => {
                    const fillColor = isCompleted
                      ? getRegionColor(region.id, template.colorPalette.find(c => c.number === region.colorNumber)?.hex || 'white')
                      : 'white'
                    return (
                      <path
                        key={region.id}
                        d={region.path}
                        fill={fillColor}
                        stroke={isCompleted ? "#10B981" : "#CBD5E1"}
                        strokeWidth={isCompleted ? "1" : "2"}
                      />
                    )
                  })}
                </svg>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <span className="text-muted-foreground text-sm">이미지 없음</span>
              </div>
            )}

            {/* 완료 배지 */}
            {isCompleted && (
              <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
                <CheckCircle2 className="h-3 w-3" />
                완료
              </div>
            )}

            {/* 난이도 배지 */}
            <div
              className={cn(
                'absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium shadow-sm',
                difficulty.color
              )}
            >
              {difficulty.text}
            </div>
          </div>

          {/* 정보 영역 */}
          <div className="p-3 space-y-2">
            <h3 className="truncate text-sm font-medium">{template.title}</h3>

            {/* 템플릿 정보 */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {/* 색상 수 */}
              <div className="flex items-center gap-1" title="색상 수">
                <Palette className="h-3.5 w-3.5" />
                <span>{template.colorCount}</span>
              </div>
              {/* 영역 수 */}
              <div className="flex items-center gap-1" title="영역 수">
                <Grid3X3 className="h-3.5 w-3.5" />
                <span>{template.regionCount}</span>
              </div>
              {/* 예상 시간 */}
              <div className="flex items-center gap-1" title="예상 소요 시간">
                <Clock className="h-3.5 w-3.5" />
                <span>{template.estimatedTime}분</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
