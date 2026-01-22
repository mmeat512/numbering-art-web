'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ColoringCanvas, ColorPalette, Toolbar } from '@/components/canvas'
import { ColoredRegion } from '@/types'

export default function ColoringPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.templateId as string

  const [isSaving, setIsSaving] = useState(false)
  const [showPalette, setShowPalette] = useState(true)

  const handleColorChange = useCallback((data: ColoredRegion[]) => {
    // 자동 저장 로직 (IndexedDB)
    // TODO: Implement auto-save
  }, [])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      // TODO: Implement save to IndexedDB and Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('작품이 저장되었습니다!')
    } catch {
      toast.error('저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSaving(false)
    }
  }, [])

  const handleHelp = useCallback(() => {
    toast.info('색상을 선택하고 원하는 영역을 터치하세요!')
  }, [])

  const handleBack = useCallback(() => {
    router.back()
  }, [router])

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
        <h1 className="text-lg font-semibold">컬러링</h1>
        <div className="w-12" /> {/* Spacer for alignment */}
      </header>

      {/* 캔버스 영역 */}
      <div className="flex-1 overflow-hidden">
        <ColoringCanvas
          templateUrl={undefined} // TODO: Load from template
          onColorChange={handleColorChange}
          className="h-full w-full"
        />
      </div>

      {/* 툴바 */}
      <div className="px-4 py-2">
        <Toolbar
          onSave={handleSave}
          onHelp={handleHelp}
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
        className="absolute bottom-32 right-4 rounded-full bg-primary p-3 text-primary-foreground shadow-lg touch-target-lg"
        aria-label={showPalette ? '팔레트 숨기기' : '팔레트 보기'}
      >
        🎨
      </button>
    </div>
  )
}
