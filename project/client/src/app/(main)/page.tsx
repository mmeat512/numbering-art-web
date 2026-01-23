import Link from 'next/link'
import { ArrowRight, Palette, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TemplateCard } from '@/components/templates'
import { SAMPLE_TEMPLATES } from '@/data/templates'

// 인기순으로 정렬된 템플릿 (상위 3개)
const recommendedTemplates = [...SAMPLE_TEMPLATES]
  .sort((a, b) => b.usageCount - a.usageCount)
  .slice(0, 3)

export default function HomePage() {
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
            <TemplateCard key={template.id} template={template} size="md" />
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
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
