'use client'

import { useEffect, useCallback, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Lightbulb, RotateCcw, Undo2, Save, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { PaintByNumberCanvas } from '@/components/canvas/PaintByNumberCanvas'
import { NumberedColorPalette } from '@/components/palette/NumberedColorPalette'
import { useGameStore } from '@/store/useGameStore'
import { getTemplateById } from '@/data/templates'
import { cn } from '@/lib/utils'

export default function ColoringPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.templateId as string

  const {
    template,
    gameState,
    feedback,
    isCompleted,
    mistakesCount,
    startGame,
    getProgress,
    toggleHint,
    undoLastFill,
    resetProgress,
    setZoom,
  } = useGameStore()

  const [showCompletionModal, setShowCompletionModal] = useState(false)

  // 템플릿 로드 및 게임 시작
  useEffect(() => {
    const loadedTemplate = getTemplateById(templateId)
    if (loadedTemplate) {
      startGame(loadedTemplate)
    } else {
      toast.error('템플릿을 찾을 수 없습니다.')
      router.push('/templates')
    }
  }, [templateId, startGame, router])

  // 완성 시 모달 표시
  useEffect(() => {
    if (isCompleted && feedback.type === 'complete') {
      setShowCompletionModal(true)
    }
  }, [isCompleted, feedback.type])

  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  const handleHelp = useCallback(() => {
    toast.info(
      <div className="space-y-2">
        <p className="font-semibold">🎨 숫자 맞춤 컬러링</p>
        <ul className="list-disc pl-4 text-sm space-y-1">
          <li>아래 팔레트에서 숫자 색상을 선택하세요</li>
          <li>같은 숫자가 적힌 영역을 터치하면 색칠됩니다</li>
          <li>올바른 색상이면 ✓, 틀리면 다시 시도!</li>
          <li><strong>힌트</strong> 버튼: 다음 칠할 곳을 알려줘요</li>
        </ul>
      </div>,
      { duration: 6000 }
    )
  }, [])

  const handleSave = useCallback(() => {
    // TODO: IndexedDB에 진행상황 저장
    toast.success('진행상황이 저장되었습니다!')
  }, [])

  const handleRestart = useCallback(() => {
    if (confirm('처음부터 다시 시작할까요?')) {
      resetProgress()
      toast.info('처음부터 시작합니다.')
    }
  }, [resetProgress])

  const handleZoomIn = useCallback(() => {
    setZoom(gameState.zoomLevel + 0.25)
  }, [gameState.zoomLevel, setZoom])

  const handleZoomOut = useCallback(() => {
    setZoom(gameState.zoomLevel - 0.25)
  }, [gameState.zoomLevel, setZoom])

  const handleResetZoom = useCallback(() => {
    setZoom(1)
  }, [setZoom])

  if (!template) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  const progress = getProgress()

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between border-b px-4 py-3 safe-area-top bg-background">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="touch-target"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <div className="flex-1 mx-4">
          {/* 진행률 바 */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-500 rounded-full',
                  progress >= 100 ? 'bg-green-500' : 'bg-primary'
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-bold min-w-[45px] text-right">
              {progress}%
            </span>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-1">
            {template.title}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleHelp}
          className="touch-target"
          aria-label="도움말"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </header>

      {/* 툴바 */}
      <div className="flex items-center justify-center gap-2 px-4 py-2 border-b bg-muted/30">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleHint}
          className={cn(
            'gap-1.5',
            gameState.isHintActive && 'bg-primary text-primary-foreground'
          )}
        >
          <Lightbulb className="h-4 w-4" />
          힌트
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={undoLastFill}
          className="gap-1.5"
        >
          <Undo2 className="h-4 w-4" />
          되돌리기
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetZoom}
          className="gap-1.5"
        >
          <RotateCcw className="h-4 w-4" />
          줌 초기화
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          className="gap-1.5"
        >
          <Save className="h-4 w-4" />
          저장
        </Button>
      </div>

      {/* 캔버스 영역 */}
      <div className="flex-1 overflow-hidden">
        <PaintByNumberCanvas
          template={template}
          className="h-full w-full"
        />
      </div>

      {/* 숫자-색상 팔레트 */}
      <NumberedColorPalette
        template={template}
        className="safe-area-bottom"
      />

      {/* 실수 횟수 표시 */}
      {mistakesCount > 0 && (
        <div className="absolute top-20 left-4 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
          실수: {mistakesCount}회
        </div>
      )}

      {/* 완성 축하 모달 */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center animate-bounce-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">축하합니다!</h2>
            <p className="text-muted-foreground mb-4">
              {template.title}을(를) 완성했어요!
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6">
              <p>실수 횟수: {mistakesCount}회</p>
              <p>정확도: {Math.round((1 - mistakesCount / (template.regionCount + mistakesCount)) * 100)}%</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleRestart}
              >
                다시 하기
              </Button>
              <Button
                className="flex-1"
                onClick={() => router.push('/templates')}
              >
                다른 도안
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
