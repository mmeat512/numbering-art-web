'use client'

import { Undo2, Redo2, Save, HelpCircle, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useHistoryStore } from '@/store/useHistoryStore'

interface ToolbarProps {
  onSave?: () => void
  onHelp?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  isSaving?: boolean
}

export function Toolbar({
  onSave,
  onHelp,
  onZoomIn,
  onZoomOut,
  isSaving = false,
}: ToolbarProps) {
  const { undo, redo, canUndo, canRedo } = useHistoryStore()

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-background/95 p-2 shadow-lg backdrop-blur">
      {/* 왼쪽 도구 */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => undo()}
          disabled={!canUndo()}
          className="touch-target-lg"
          aria-label="되돌리기"
        >
          <Undo2 className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => redo()}
          disabled={!canRedo()}
          className="touch-target-lg"
          aria-label="다시 실행"
        >
          <Redo2 className="h-6 w-6" />
        </Button>
      </div>

      {/* 중앙 도구 - 줌 */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomOut}
          className="touch-target-lg"
          aria-label="축소"
        >
          <ZoomOut className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomIn}
          className="touch-target-lg"
          aria-label="확대"
        >
          <ZoomIn className="h-6 w-6" />
        </Button>
      </div>

      {/* 오른쪽 도구 */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onHelp}
          className="touch-target-lg"
          aria-label="도움말"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={onSave}
          disabled={isSaving}
          className="touch-target-lg"
          aria-label="저장"
        >
          {isSaving ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <Save className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  )
}
