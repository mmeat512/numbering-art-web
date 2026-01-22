'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useColorStore } from '@/store/useColorStore'
import { useHistoryStore } from '@/store/useHistoryStore'
import { ColoredRegion } from '@/types'

interface ColoringCanvasProps {
  templateUrl?: string
  initialData?: ColoredRegion[]
  onColorChange?: (data: ColoredRegion[]) => void
  className?: string
}

interface Point {
  x: number
  y: number
}

export function ColoringCanvas({
  templateUrl,
  initialData = [],
  onColorChange,
  className,
}: ColoringCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const templateImageRef = useRef<HTMLImageElement | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  const { selectedColor } = useColorStore()
  const { pushHistory, currentData, setCurrentData } = useHistoryStore()

  // Canvas 초기화
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      const size = Math.min(rect.width, rect.height - 100)
      setCanvasSize({ width: size, height: size })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // 템플릿 이미지 로드
  useEffect(() => {
    if (!templateUrl) {
      setIsLoading(false)
      return
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      templateImageRef.current = img
      setIsLoading(false)
      renderCanvas()
    }
    img.onerror = () => {
      setIsLoading(false)
    }
    img.src = templateUrl
  }, [templateUrl])

  // 초기 데이터 설정
  useEffect(() => {
    if (initialData.length > 0) {
      setCurrentData(initialData)
    }
  }, [initialData, setCurrentData])

  // Canvas 렌더링
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw template image
    if (templateImageRef.current) {
      ctx.drawImage(
        templateImageRef.current,
        0,
        0,
        canvas.width,
        canvas.height
      )
    } else {
      // 테스트용 기본 그리드 패턴
      drawTestPattern(ctx, canvas.width, canvas.height)
    }

    // Draw colored regions
    currentData.forEach((region) => {
      ctx.fillStyle = region.color
      ctx.beginPath()
      ctx.arc(region.x, region.y, 5, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [currentData])

  // Canvas 사이즈 변경 시 렌더링
  useEffect(() => {
    if (canvasSize.width > 0 && canvasSize.height > 0) {
      renderCanvas()
    }
  }, [canvasSize, renderCanvas])

  // currentData 변경 시 렌더링
  useEffect(() => {
    renderCanvas()
  }, [currentData, renderCanvas])

  // 터치/클릭 이벤트 핸들러
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      let clientX: number, clientY: number

      if ('touches' in e) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = e.clientX
        clientY = e.clientY
      }

      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      const x = Math.floor((clientX - rect.left) * scaleX)
      const y = Math.floor((clientY - rect.top) * scaleY)

      const newRegion: ColoredRegion = {
        x,
        y,
        color: selectedColor.hex,
        timestamp: Date.now(),
      }

      const newData = [...currentData, newRegion]
      pushHistory(newData)
      onColorChange?.(newData)

      // 즉시 렌더링
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = selectedColor.hex
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    },
    [selectedColor, currentData, pushHistory, onColorChange]
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex items-center justify-center bg-muted/50',
        className
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={canvasSize.width || 400}
        height={canvasSize.height || 400}
        onClick={handleCanvasClick}
        onTouchStart={handleCanvasClick}
        className="touch-none rounded-lg border bg-white shadow-lg"
        style={{
          width: canvasSize.width || 400,
          height: canvasSize.height || 400,
        }}
      />
    </div>
  )
}

// 테스트용 패턴 그리기
function drawTestPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const cellSize = 50
  ctx.strokeStyle = '#E0E0E0'
  ctx.lineWidth = 1

  // 그리드
  for (let x = 0; x <= width; x += cellSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = 0; y <= height; y += cellSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  // 예시 도형들
  ctx.strokeStyle = '#333333'
  ctx.lineWidth = 2

  // 원
  ctx.beginPath()
  ctx.arc(width / 4, height / 4, 60, 0, Math.PI * 2)
  ctx.stroke()

  // 사각형
  ctx.strokeRect(width / 2 + 20, height / 4 - 50, 100, 100)

  // 삼각형
  ctx.beginPath()
  ctx.moveTo(width / 4, height / 2 + 50)
  ctx.lineTo(width / 4 - 60, height / 2 + 150)
  ctx.lineTo(width / 4 + 60, height / 2 + 150)
  ctx.closePath()
  ctx.stroke()

  // 하트
  ctx.beginPath()
  const hx = width / 2 + 70
  const hy = height / 2 + 80
  ctx.moveTo(hx, hy + 20)
  ctx.bezierCurveTo(hx, hy, hx - 40, hy, hx - 40, hy + 30)
  ctx.bezierCurveTo(hx - 40, hy + 50, hx, hy + 70, hx, hy + 70)
  ctx.bezierCurveTo(hx, hy + 70, hx + 40, hy + 50, hx + 40, hy + 30)
  ctx.bezierCurveTo(hx + 40, hy, hx, hy, hx, hy + 20)
  ctx.stroke()
}
