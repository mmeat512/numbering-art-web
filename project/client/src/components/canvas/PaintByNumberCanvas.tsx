'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useGameStore, useSelectedColorInfo } from '@/store/useGameStore'
import { Template, Region } from '@/types'

interface PaintByNumberCanvasProps {
  template: Template
  className?: string
}

export function PaintByNumberCanvas({ template, className }: PaintByNumberCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const {
    gameState,
    filledRegions,
    feedback,
    fillRegion,
    isRegionFilled,
    getCorrectColor,
    setZoom,
    setPan,
  } = useGameStore()

  const selectedColorInfo = useSelectedColorInfo()

  // 컨테이너 크기 감지
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      const size = Math.min(rect.width - 16, rect.height - 16, 500)
      setContainerSize({ width: size, height: size })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // 영역 클릭 핸들러
  const handleRegionClick = useCallback((region: Region) => {
    const { selectedColorNumber } = gameState
    if (selectedColorNumber === null) return

    // 이미 올바르게 칠해진 영역인지 확인
    if (isRegionFilled(region.id)) return

    // 정답 확인
    const isCorrect = region.colorNumber === selectedColorNumber
    fillRegion(region.id, selectedColorNumber, isCorrect)
  }, [gameState, fillRegion, isRegionFilled])

  // 영역 색상 결정
  const getRegionFill = useCallback((region: Region): string => {
    const filled = filledRegions.get(region.id)

    if (filled?.isCorrect) {
      // 정답으로 칠해진 영역: 해당 색상
      const color = template.colorPalette.find(c => c.number === region.colorNumber)
      return color?.hex ?? '#FFFFFF'
    }

    // 아직 안 칠해진 영역: 흰색
    return '#FFFFFF'
  }, [filledRegions, template.colorPalette])

  // 피드백 애니메이션 클래스
  const getFeedbackClass = useCallback((regionId: string): string => {
    if (feedback.regionId !== regionId) return ''

    if (feedback.type === 'correct') {
      return 'animate-pulse'
    }
    if (feedback.type === 'incorrect') {
      return 'animate-shake'
    }
    return ''
  }, [feedback])

  // 힌트 표시 여부
  const isHintRegion = useCallback((regionId: string): boolean => {
    return gameState.isHintActive && gameState.hintRegionId === regionId
  }, [gameState.isHintActive, gameState.hintRegionId])

  // 숫자 표시 여부 결정
  const shouldShowNumber = useCallback((region: Region): boolean => {
    // 이미 칠해진 영역은 숫자 숨김
    if (isRegionFilled(region.id)) return false
    return gameState.showNumbers
  }, [isRegionFilled, gameState.showNumbers])

  // 휠 줌 처리
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom(gameState.zoomLevel + delta)
  }, [gameState.zoomLevel, setZoom])

  if (containerSize.width === 0) {
    return (
      <div ref={containerRef} className={cn('flex-1 flex items-center justify-center', className)}>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-muted/30',
        className
      )}
      onWheel={handleWheel}
    >
      <div
        className="relative rounded-lg border-2 border-border bg-white shadow-lg overflow-hidden"
        style={{
          width: containerSize.width,
          height: containerSize.height,
          transform: `scale(${gameState.zoomLevel}) translate(${gameState.panX}px, ${gameState.panY}px)`,
          transformOrigin: 'center center',
        }}
      >
        <svg
          ref={svgRef}
          viewBox={template.templateData.viewBox}
          className="w-full h-full"
          style={{ touchAction: 'none' }}
        >
          {/* 모든 영역 렌더링 */}
          {template.templateData.regions.map((region) => (
            <g key={region.id}>
              {/* 영역 path */}
              <path
                d={region.path}
                fill={getRegionFill(region)}
                stroke="#333333"
                strokeWidth="1.5"
                className={cn(
                  'cursor-pointer transition-all duration-200',
                  getFeedbackClass(region.id),
                  isHintRegion(region.id) && 'animate-pulse stroke-primary stroke-[3]',
                  !isRegionFilled(region.id) && 'hover:opacity-80'
                )}
                onClick={() => handleRegionClick(region)}
              />

              {/* 숫자 표시 */}
              {shouldShowNumber(region) && (
                <text
                  x={region.labelX}
                  y={region.labelY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#333333"
                  className="pointer-events-none select-none"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {region.colorNumber}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* 줌 레벨 표시 */}
      {gameState.zoomLevel !== 1 && (
        <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
          {Math.round(gameState.zoomLevel * 100)}%
        </div>
      )}

      {/* 선택된 색상 표시 */}
      {selectedColorInfo && (
        <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 shadow-md">
          <div
            className="h-6 w-6 rounded-full border-2 border-gray-300"
            style={{ backgroundColor: selectedColorInfo.hex }}
          />
          <span className="text-sm font-medium">
            {selectedColorInfo.number}. {selectedColorInfo.name}
          </span>
        </div>
      )}

      {/* 피드백 메시지 */}
      {feedback.type && feedback.message && (
        <div
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'rounded-xl px-6 py-3 text-lg font-bold shadow-lg',
            'animate-bounce-in',
            feedback.type === 'correct' && 'bg-green-500 text-white',
            feedback.type === 'incorrect' && 'bg-red-500 text-white',
            feedback.type === 'complete' && 'bg-yellow-400 text-black text-2xl'
          )}
        >
          {feedback.message}
        </div>
      )}
    </div>
  )
}
