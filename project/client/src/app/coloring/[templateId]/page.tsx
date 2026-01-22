'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ColoringCanvas, ColorPalette, Toolbar } from '@/components/canvas'
import type { ColoringCanvasRef } from '@/components/canvas/ColoringCanvas'
import { ColoredRegion } from '@/types'
import {
  saveDraft,
  getDraft,
  saveArtwork,
  createThumbnail,
  canvasToDataUrl,
} from '@/lib/db'

// 자동 저장 간격 (밀리초)
const AUTO_SAVE_INTERVAL = 30000 // 30초

export default function ColoringPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.templateId as string

  const canvasRef = useRef<ColoringCanvasRef>(null)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [isSaving, setIsSaving] = useState(false)
  const [showPalette, setShowPalette] = useState(true)
  const [coloredRegions, setColoredRegions] = useState<ColoredRegion[]>([])
  const [savedCanvasDataUrl, setSavedCanvasDataUrl] = useState<string | undefined>(undefined)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isCanvasReady, setIsCanvasReady] = useState(false)

  // 드래프트 로드
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const draft = await getDraft(templateId)
        if (draft) {
          if (draft.coloredRegions.length > 0) {
            setColoredRegions(draft.coloredRegions)
          }
          // 저장된 캔버스 이미지가 있으면 설정
          if (draft.canvasDataUrl) {
            setSavedCanvasDataUrl(draft.canvasDataUrl)
            toast.info('이전 작업을 불러왔습니다.')
          }
        }
      } catch (error) {
        console.error('Failed to load draft:', error)
      }
    }

    loadDraft()
  }, [templateId])

  // 자동 저장 설정
  useEffect(() => {
    if (!hasUnsavedChanges || !isCanvasReady) return

    autoSaveTimerRef.current = setInterval(async () => {
      try {
        const canvasDataUrl = canvasRef.current?.getDataUrl() || undefined
        await saveDraft({
          id: templateId,
          templateId,
          coloredRegions,
          canvasDataUrl,
          updatedAt: Date.now(),
        })
        // Auto-save completed
      } catch (error) {
        console.error('Auto-save failed:', error)
      }
    }, AUTO_SAVE_INTERVAL)

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [templateId, coloredRegions, hasUnsavedChanges, isCanvasReady])

  // 페이지 이탈 시 저장
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && isCanvasReady) {
        // 이탈 전 드래프트 저장 시도
        try {
          const canvasDataUrl = canvasRef.current?.getDataUrl() || undefined
          await saveDraft({
            id: templateId,
            templateId,
            coloredRegions,
            canvasDataUrl,
            updatedAt: Date.now(),
          })
        } catch (error) {
          console.error('Failed to save on unload:', error)
        }
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges, isCanvasReady, templateId, coloredRegions])

  const handleColorChange = useCallback((data: ColoredRegion[]) => {
    setColoredRegions(data)
    setHasUnsavedChanges(true)
  }, [])

  const handleCanvasReady = useCallback(() => {
    setIsCanvasReady(true)
  }, [])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      const canvas = canvasRef.current?.getCanvas()
      if (!canvas) {
        throw new Error('Canvas not available')
      }

      const canvasDataUrl = canvasToDataUrl(canvas)
      const thumbnailDataUrl = createThumbnail(canvas)

      // IndexedDB에 저장
      await saveArtwork({
        id: `artwork-${templateId}-${Date.now()}`,
        templateId,
        title: `작품 ${new Date().toLocaleDateString('ko-KR')}`,
        thumbnailDataUrl,
        canvasDataUrl,
        coloredRegions,
        progress: calculateProgress(coloredRegions),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isSynced: false,
      })

      // 드래프트도 업데이트
      await saveDraft({
        id: templateId,
        templateId,
        coloredRegions,
        canvasDataUrl,
        updatedAt: Date.now(),
      })

      setHasUnsavedChanges(false)
      toast.success('작품이 저장되었습니다!')
    } catch (error) {
      console.error('Save failed:', error)
      toast.error('저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSaving(false)
    }
  }, [templateId, coloredRegions])

  const handleZoomIn = useCallback(() => {
    canvasRef.current?.zoomIn()
  }, [])

  const handleZoomOut = useCallback(() => {
    canvasRef.current?.zoomOut()
  }, [])

  const handleResetZoom = useCallback(() => {
    canvasRef.current?.resetZoom()
  }, [])

  const handleHelp = useCallback(() => {
    toast.info(
      <div className="space-y-2">
        <p className="font-semibold">사용 방법</p>
        <ul className="list-disc pl-4 text-sm">
          <li>색상을 선택하고 원하는 영역을 터치하세요</li>
          <li>두 손가락으로 확대/축소할 수 있어요</li>
          <li>한 손가락으로 드래그하면 이동해요</li>
          <li>실수했다면 되돌리기 버튼을 눌러주세요</li>
        </ul>
      </div>,
      { duration: 5000 }
    )
  }, [])

  const handleBack = useCallback(async () => {
    if (hasUnsavedChanges && isCanvasReady) {
      // 뒤로가기 전 자동 저장
      try {
        const canvasDataUrl = canvasRef.current?.getDataUrl() || undefined
        await saveDraft({
          id: templateId,
          templateId,
          coloredRegions,
          canvasDataUrl,
          updatedAt: Date.now(),
        })
        toast.success('작업이 자동 저장되었습니다.')
      } catch (error) {
        console.error('Failed to save before leaving:', error)
      }
    }
    router.back()
  }, [router, hasUnsavedChanges, isCanvasReady, templateId, coloredRegions])

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between border-b px-4 py-3 safe-area-top">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="touch-target-lg"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">컬러링</h1>
          {hasUnsavedChanges && (
            <span className="h-2 w-2 rounded-full bg-orange-500" title="저장되지 않음" />
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleResetZoom}
          className="touch-target-lg"
          aria-label="줌 초기화"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </header>

      {/* 캔버스 영역 */}
      <div className="flex-1 overflow-hidden">
        <ColoringCanvas
          ref={canvasRef}
          templateUrl={undefined} // TODO: Load from template
          initialCanvasDataUrl={savedCanvasDataUrl}
          initialData={coloredRegions}
          onColorChange={handleColorChange}
          onCanvasReady={handleCanvasReady}
          className="h-full w-full"
        />
      </div>

      {/* 툴바 */}
      <div className="px-4 py-2">
        <Toolbar
          onSave={handleSave}
          onHelp={handleHelp}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          isSaving={isSaving}
        />
      </div>

      {/* 색상 팔레트 */}
      {showPalette && (
        <div className="border-t bg-background px-4 py-4 safe-area-bottom">
          <ColorPalette compact />
        </div>
      )}

      {/* 팔레트 토글 버튼 */}
      <button
        onClick={() => setShowPalette(!showPalette)}
        className="absolute bottom-32 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground shadow-lg transition-transform active:scale-95"
        aria-label={showPalette ? '팔레트 숨기기' : '팔레트 보기'}
      >
        🎨
      </button>
    </div>
  )
}

/**
 * 진행률 계산 (간단한 추정)
 */
function calculateProgress(regions: ColoredRegion[]): number {
  // 실제로는 템플릿의 총 영역 수와 비교해야 함
  // 여기서는 간단히 색칠 횟수 기반으로 추정
  const estimatedTotalRegions = 20
  return Math.min(Math.round((regions.length / estimatedTotalRegions) * 100), 100)
}
