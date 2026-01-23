'use client'

import { useCallback } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGameStore } from '@/store/useGameStore'
import { Template, NumberedColor } from '@/types'

interface NumberedColorPaletteProps {
  template: Template
  className?: string
}

export function NumberedColorPalette({ template, className }: NumberedColorPaletteProps) {
  const {
    gameState,
    setSelectedColor,
    getRemainingCount,
  } = useGameStore()

  const handleColorSelect = useCallback((colorNumber: number) => {
    setSelectedColor(colorNumber)
  }, [setSelectedColor])

  return (
    <div className={cn('bg-card border-t', className)}>
      {/* 팔레트 헤더 */}
      <div className="px-4 py-2 border-b bg-muted/30">
        <p className="text-sm text-muted-foreground text-center">
          숫자에 맞는 색상을 선택하세요
        </p>
      </div>

      {/* 색상 버튼 목록 */}
      <div className="p-3">
        <div className="flex flex-wrap justify-center gap-2">
          {template.colorPalette.map((color) => (
            <ColorButton
              key={color.number}
              color={color}
              isSelected={gameState.selectedColorNumber === color.number}
              remainingCount={getRemainingCount(color.number)}
              onClick={() => handleColorSelect(color.number)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface ColorButtonProps {
  color: NumberedColor
  isSelected: boolean
  remainingCount: number
  onClick: () => void
}

function ColorButton({ color, isSelected, remainingCount, onClick }: ColorButtonProps) {
  const isCompleted = remainingCount === 0

  return (
    <button
      onClick={onClick}
      disabled={isCompleted}
      className={cn(
        'relative flex flex-col items-center justify-center',
        'min-w-[70px] h-[70px] rounded-xl',
        'border-2 transition-all duration-200',
        'touch-target',
        isSelected && 'ring-4 ring-primary ring-offset-2 scale-105',
        isCompleted && 'opacity-50 cursor-not-allowed',
        !isSelected && !isCompleted && 'hover:scale-105 hover:shadow-md',
      )}
      style={{
        backgroundColor: color.hex,
        borderColor: isSelected ? 'var(--primary)' : getBorderColor(color.hex),
      }}
    >
      {/* 숫자 */}
      <span
        className={cn(
          'text-xl font-bold',
          isCompleted && 'line-through'
        )}
        style={{ color: getContrastColor(color.hex) }}
      >
        {color.number}
      </span>

      {/* 색상 이름 */}
      <span
        className="text-xs font-medium mt-0.5"
        style={{ color: getContrastColor(color.hex) }}
      >
        {color.name}
      </span>

      {/* 남은 개수 */}
      {!isCompleted && (
        <span
          className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center rounded-full bg-black/70 text-white text-xs font-bold px-1"
        >
          {remainingCount}
        </span>
      )}

      {/* 완료 체크 표시 */}
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
          <Check className="h-8 w-8 text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  )
}

// 배경색에 따른 텍스트 색상 결정
function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // 밝기 계산 (YIQ 공식)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness > 128 ? '#333333' : '#FFFFFF'
}

// 테두리 색상 결정
function getBorderColor(hexColor: string): string {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // 더 어두운 색상으로 테두리
  const darken = (value: number) => Math.max(0, value - 40)

  return `rgb(${darken(r)}, ${darken(g)}, ${darken(b)})`
}
