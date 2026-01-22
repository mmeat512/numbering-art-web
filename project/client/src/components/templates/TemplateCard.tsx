'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Template } from '@/types'

interface TemplateCardProps {
  template: Template
  size?: 'sm' | 'md' | 'lg'
}

const difficultyLabels = {
  easy: { text: '쉬움', color: 'bg-green-100 text-green-800' },
  medium: { text: '보통', color: 'bg-yellow-100 text-yellow-800' },
  hard: { text: '어려움', color: 'bg-red-100 text-red-800' },
}

const sizeClasses = {
  sm: 'w-32 h-32',
  md: 'w-40 h-40',
  lg: 'w-48 h-48',
}

export function TemplateCard({ template, size = 'md' }: TemplateCardProps) {
  const difficulty = difficultyLabels[template.difficulty]

  return (
    <Link href={`/coloring/${template.id}`} className="block">
      <Card className="overflow-hidden transition-transform hover:scale-105 active:scale-95 touch-target">
        <CardContent className="p-0">
          <div className={cn('relative', sizeClasses[size])}>
            {template.thumbnailUrl ? (
              <Image
                src={template.thumbnailUrl}
                alt={template.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <span className="text-muted-foreground">이미지 없음</span>
              </div>
            )}
            <div
              className={cn(
                'absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium',
                difficulty.color
              )}
            >
              {difficulty.text}
            </div>
          </div>
          <div className="p-3">
            <h3 className="truncate text-sm font-medium">{template.title}</h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
