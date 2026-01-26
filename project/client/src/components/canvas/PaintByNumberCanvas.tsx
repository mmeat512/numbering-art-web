'use client'

import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useGameStore, useSelectedColorInfo } from '@/store/useGameStore'
import { Template, Region } from '@/types'

interface PaintByNumberCanvasProps {
  template: Template
  className?: string
}

// SVG path에서 영역 특성을 분석하는 함수
interface PathAnalysis {
  boundingBox: { width: number; height: number; area: number }
  pathComplexity: number  // path 포인트 수
  estimatedThickness: number  // 추정 두께 (링 형태 감지용)
  isRingShape: boolean  // 링/띠 형태 여부
}

function analyzePathData(pathData: string): PathAnalysis {
  // path 데이터에서 숫자만 추출
  const numbers = pathData.match(/-?\d+\.?\d*/g)
  if (!numbers || numbers.length < 4) {
    return {
      boundingBox: { width: 50, height: 50, area: 2500 },
      pathComplexity: 0,
      estimatedThickness: 50,
      isRingShape: false,
    }
  }

  const coords: number[] = numbers.map(Number)
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  // 바운딩 박스 계산
  for (let i = 0; i < coords.length - 1; i += 2) {
    const x = coords[i]
    const y = coords[i + 1]

    if (!isNaN(x) && !isNaN(y)) {
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }
  }

  const width = maxX - minX
  const height = maxY - minY
  const boundingBoxArea = width * height

  // path 복잡도 (포인트 수)
  const pathComplexity = coords.length / 2

  // path 둘레 추정 (연속된 점들 간의 거리 합)
  let estimatedPerimeter = 0
  for (let i = 0; i < coords.length - 3; i += 2) {
    const x1 = coords[i]
    const y1 = coords[i + 1]
    const x2 = coords[i + 2]
    const y2 = coords[i + 3]

    if (!isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
      estimatedPerimeter += Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    }
  }

  // 링/띠 형태 감지: 둘레가 길고 면적이 작은 경우
  // 원형의 경우: 둘레 = 2*π*r, 면적 = π*r^2 → 둘레^2/면적 = 4*π ≈ 12.57
  // 띠 형태는 이 비율이 훨씬 높음 (둘레가 면적에 비해 큼)
  const perimeterToAreaRatio = boundingBoxArea > 0
    ? (estimatedPerimeter * estimatedPerimeter) / boundingBoxArea
    : 0

  // 링 형태 감지: 복잡한 path(많은 포인트)가 큰 바운딩박스를 가지는 경우
  // 또는 둘레 대비 면적 비율이 높은 경우
  const complexityPerArea = boundingBoxArea > 0 ? pathComplexity / Math.sqrt(boundingBoxArea) : 0
  const isRingShape = perimeterToAreaRatio > 50 || complexityPerArea > 0.5

  // 추정 두께: 바운딩박스 면적을 둘레로 나눔 (링 형태의 경우 실제 띠 두께 추정)
  const estimatedThickness = estimatedPerimeter > 0
    ? Math.min(width, height, boundingBoxArea / estimatedPerimeter * 2)
    : Math.min(width, height)

  return {
    boundingBox: { width, height, area: boundingBoxArea },
    pathComplexity,
    estimatedThickness,
    isRingShape,
  }
}

// 영역 크기에 따른 폰트 크기 계산
function calculateFontSize(pathData: string, viewBox: string): number {
  const analysis = analyzePathData(pathData)
  const { boundingBox, estimatedThickness, isRingShape } = analysis

  // viewBox에서 전체 크기 파싱
  const viewBoxParts = viewBox.split(' ').map(Number)
  const viewBoxWidth = viewBoxParts[2] || 400
  const viewBoxHeight = viewBoxParts[3] || 400

  // 최소/최대 폰트 크기 (viewBox 기준)
  const MIN_FONT_SIZE = 6
  const MAX_FONT_SIZE = 16

  // 링/띠 형태인 경우 추정 두께를 기준으로 폰트 크기 결정
  if (isRingShape) {
    // 두께의 60%를 최대 폰트 크기로 설정 (여백 확보)
    const maxFontByThickness = estimatedThickness * 0.6

    if (maxFontByThickness < 8) return MIN_FONT_SIZE
    if (maxFontByThickness < 10) return 7
    if (maxFontByThickness < 14) return 8
    if (maxFontByThickness < 18) return 10
    if (maxFontByThickness < 24) return 12
    return Math.min(14, MAX_FONT_SIZE)
  }

  // 일반 영역: 최소 차원 기준으로 폰트 크기 결정
  const minDimension = Math.min(boundingBox.width, boundingBox.height)

  // viewBox 대비 상대적 크기
  const relativeDimension = minDimension / Math.min(viewBoxWidth, viewBoxHeight)

  if (relativeDimension < 0.05 || minDimension < 15) return MIN_FONT_SIZE
  if (relativeDimension < 0.08 || minDimension < 25) return 8
  if (relativeDimension < 0.12 || minDimension < 35) return 10
  if (relativeDimension < 0.18 || minDimension < 50) return 12
  if (relativeDimension < 0.25 || minDimension < 70) return 14

  return MAX_FONT_SIZE
}

export function PaintByNumberCanvas({ template, className }: PaintByNumberCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  // 터치 줌 상태
  const touchStateRef = useRef<{
    initialDistance: number | null
    initialZoom: number
    lastTouchCount: number
  }>({
    initialDistance: null,
    initialZoom: 1,
    lastTouchCount: 0,
  })

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

  // 각 영역의 폰트 크기를 미리 계산 (메모이제이션)
  const regionFontSizes = useMemo(() => {
    const sizes = new Map<string, number>()
    const viewBox = template.templateData.viewBox

    template.templateData.regions.forEach((region) => {
      const fontSize = calculateFontSize(region.path, viewBox)
      sizes.set(region.id, fontSize)
    })

    return sizes
  }, [template.templateData.regions, template.templateData.viewBox])

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

  // 두 터치 포인트 간의 거리 계산
  const getTouchDistance = useCallback((touches: React.TouchList): number => {
    if (touches.length < 2) return 0
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  // 터치 시작 핸들러
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // 핀치 줌 시작
      const distance = getTouchDistance(e.touches)
      touchStateRef.current = {
        initialDistance: distance,
        initialZoom: gameState.zoomLevel,
        lastTouchCount: 2,
      }
    } else {
      touchStateRef.current.lastTouchCount = e.touches.length
    }
  }, [gameState.zoomLevel, getTouchDistance])

  // 터치 이동 핸들러 (핀치 줌)
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStateRef.current.initialDistance !== null) {
      e.preventDefault()
      const currentDistance = getTouchDistance(e.touches)
      const scale = currentDistance / touchStateRef.current.initialDistance
      const newZoom = touchStateRef.current.initialZoom * scale
      setZoom(newZoom)
    }
  }, [getTouchDistance, setZoom])

  // 터치 종료 핸들러
  const handleTouchEnd = useCallback(() => {
    touchStateRef.current = {
      initialDistance: null,
      initialZoom: gameState.zoomLevel,
      lastTouchCount: 0,
    }
  }, [gameState.zoomLevel])

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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
                  fontSize={regionFontSizes.get(region.id) || 14}
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
