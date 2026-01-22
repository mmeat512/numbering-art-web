'use client'

import { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { useColorStore } from '@/store/useColorStore'
import { useHistoryStore } from '@/store/useHistoryStore'
import { floodFill, GestureHandler } from '@/lib/canvas'
import { ColoredRegion } from '@/types'

interface ColoringCanvasProps {
  templateUrl?: string
  initialCanvasDataUrl?: string // 저장된 캔버스 이미지 복원용
  initialData?: ColoredRegion[]
  onColorChange?: (data: ColoredRegion[]) => void
  onCanvasReady?: () => void
  className?: string
}

export interface ColoringCanvasRef {
  getCanvas: () => HTMLCanvasElement | null
  getDataUrl: () => string | null
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
}

interface Transform {
  scale: number
  translateX: number
  translateY: number
}

const MIN_SCALE = 0.5
const MAX_SCALE = 4
const ZOOM_STEP = 0.25

export const ColoringCanvas = forwardRef<ColoringCanvasRef, ColoringCanvasProps>(
  function ColoringCanvas(
    { templateUrl, initialCanvasDataUrl, initialData = [], onColorChange, onCanvasReady, className },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const templateImageRef = useRef<HTMLImageElement | null>(null)
    const savedImageRef = useRef<HTMLImageElement | null>(null)
    const gestureHandlerRef = useRef<GestureHandler | null>(null)
    const isRestoredRef = useRef(false)

    const [isLoading, setIsLoading] = useState(true)
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
    const [transform, setTransform] = useState<Transform>({
      scale: 1,
      translateX: 0,
      translateY: 0,
    })

    const { selectedColor, addRecentColor } = useColorStore()
    const { pushHistory, currentData, setCurrentData } = useHistoryStore()

    // 외부에서 접근 가능한 메서드 노출
    useImperativeHandle(ref, () => ({
      getCanvas: () => offscreenCanvasRef.current,
      getDataUrl: () => offscreenCanvasRef.current?.toDataURL('image/webp', 0.9) || null,
      zoomIn: () => handleZoom(ZOOM_STEP),
      zoomOut: () => handleZoom(-ZOOM_STEP),
      resetZoom: () => setTransform({ scale: 1, translateX: 0, translateY: 0 }),
    }))

    // 줌 핸들러
    const handleZoom = useCallback((delta: number) => {
      setTransform((prev) => ({
        ...prev,
        scale: Math.min(Math.max(prev.scale + delta, MIN_SCALE), MAX_SCALE),
      }))
    }, [])

    // Canvas 크기 설정
    useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const updateSize = () => {
        const rect = container.getBoundingClientRect()
        const size = Math.min(rect.width - 32, rect.height - 32, 600)
        setCanvasSize({ width: size, height: size })
      }

      updateSize()
      window.addEventListener('resize', updateSize)
      return () => window.removeEventListener('resize', updateSize)
    }, [])

    // 오프스크린 캔버스 초기화
    useEffect(() => {
      if (canvasSize.width === 0) return

      if (!offscreenCanvasRef.current) {
        offscreenCanvasRef.current = document.createElement('canvas')
      }

      const offscreen = offscreenCanvasRef.current
      offscreen.width = canvasSize.width
      offscreen.height = canvasSize.height

      const ctx = offscreen.getContext('2d', { willReadFrequently: true })
      if (ctx) {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, offscreen.width, offscreen.height)
      }
    }, [canvasSize])

    // 저장된 캔버스 이미지 로드 (복원용)
    useEffect(() => {
      if (!initialCanvasDataUrl || isRestoredRef.current) return

      const img = new Image()
      img.onload = () => {
        savedImageRef.current = img
        isRestoredRef.current = true
      }
      img.src = initialCanvasDataUrl
    }, [initialCanvasDataUrl])

    // 템플릿 이미지 로드
    useEffect(() => {
      if (!templateUrl) {
        setIsLoading(false)
        drawTestPattern()
        return
      }

      setIsLoading(true)
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        templateImageRef.current = img
        setIsLoading(false)
        drawTemplate()
      }

      img.onerror = () => {
        setIsLoading(false)
        drawTestPattern()
      }

      img.src = templateUrl
    }, [templateUrl])

    // 초기 데이터 설정
    useEffect(() => {
      if (initialData.length > 0) {
        setCurrentData(initialData)
      }
    }, [initialData, setCurrentData])

    // 템플릿 그리기
    const drawTemplate = useCallback(() => {
      const offscreen = offscreenCanvasRef.current
      const img = templateImageRef.current
      if (!offscreen || !img) return

      const ctx = offscreen.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, offscreen.width, offscreen.height)
      ctx.drawImage(img, 0, 0, offscreen.width, offscreen.height)

      renderToDisplay()
    }, [])

    // 테스트 패턴 그리기
    const drawTestPattern = useCallback(() => {
      const offscreen = offscreenCanvasRef.current
      if (!offscreen) return

      const ctx = offscreen.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      const width = offscreen.width
      const height = offscreen.height

      // 흰색 배경
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, width, height)

      // 외곽선 스타일
      ctx.strokeStyle = '#333333'
      ctx.lineWidth = 3

      // 원
      ctx.beginPath()
      ctx.arc(width / 4, height / 4, 70, 0, Math.PI * 2)
      ctx.stroke()

      // 사각형
      ctx.strokeRect(width / 2 + 20, height / 4 - 60, 120, 120)

      // 삼각형
      ctx.beginPath()
      ctx.moveTo(width / 4, height / 2 + 40)
      ctx.lineTo(width / 4 - 70, height / 2 + 150)
      ctx.lineTo(width / 4 + 70, height / 2 + 150)
      ctx.closePath()
      ctx.stroke()

      // 별
      const cx = width / 2 + 80
      const cy = height / 2 + 100
      const spikes = 5
      const outerRadius = 60
      const innerRadius = 30

      ctx.beginPath()
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const angle = (i * Math.PI) / spikes - Math.PI / 2
        const x = cx + Math.cos(angle) * radius
        const y = cy + Math.sin(angle) * radius
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()
      ctx.stroke()

      // 하트
      const hx = width / 4 - 20
      const hy = height * 0.75

      ctx.beginPath()
      ctx.moveTo(hx, hy)
      ctx.bezierCurveTo(hx - 50, hy - 40, hx - 50, hy + 30, hx, hy + 60)
      ctx.bezierCurveTo(hx + 50, hy + 30, hx + 50, hy - 40, hx, hy)
      ctx.stroke()

      renderToDisplay()
    }, [])

    // 화면에 렌더링
    const renderToDisplay = useCallback(() => {
      const canvas = canvasRef.current
      const offscreen = offscreenCanvasRef.current
      if (!canvas || !offscreen) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // 캔버스 클리어
      ctx.fillStyle = '#f5f5f5'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Transform 적용
      ctx.save()
      ctx.translate(
        canvas.width / 2 + transform.translateX,
        canvas.height / 2 + transform.translateY
      )
      ctx.scale(transform.scale, transform.scale)
      ctx.translate(-offscreen.width / 2, -offscreen.height / 2)

      // 오프스크린 캔버스 그리기
      ctx.drawImage(offscreen, 0, 0)

      ctx.restore()
    }, [transform])

    // transform 변경 시 렌더링
    useEffect(() => {
      renderToDisplay()
    }, [transform, renderToDisplay])

    // 저장된 캔버스 복원
    const restoreSavedCanvas = useCallback(() => {
      const offscreen = offscreenCanvasRef.current
      const savedImg = savedImageRef.current
      if (!offscreen || !savedImg) return false

      const ctx = offscreen.getContext('2d', { willReadFrequently: true })
      if (!ctx) return false

      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, offscreen.width, offscreen.height)
      ctx.drawImage(savedImg, 0, 0, offscreen.width, offscreen.height)
      renderToDisplay()
      onCanvasReady?.()
      return true
    }, [renderToDisplay, onCanvasReady])

    // 캔버스 사이즈 변경 시 렌더링
    useEffect(() => {
      if (canvasSize.width > 0) {
        // 저장된 이미지가 있으면 먼저 복원 시도
        if (savedImageRef.current && restoreSavedCanvas()) {
          return
        }

        // 저장된 이미지가 없으면 템플릿 또는 테스트 패턴
        if (templateImageRef.current) {
          drawTemplate()
        } else {
          drawTestPattern()
        }
        onCanvasReady?.()
      }
    }, [canvasSize, drawTemplate, drawTestPattern, restoreSavedCanvas, onCanvasReady])

    // 제스처 핸들러 설정
    useEffect(() => {
      const container = containerRef.current
      if (!container) return

      gestureHandlerRef.current = new GestureHandler(container, {
        minScale: MIN_SCALE,
        maxScale: MAX_SCALE,
        onTap: (x, y) => {
          handleCanvasTap(x, y)
        },
        onPan: (deltaX, deltaY) => {
          setTransform((prev) => ({
            ...prev,
            translateX: prev.translateX + deltaX,
            translateY: prev.translateY + deltaY,
          }))
        },
        onZoom: (scale) => {
          setTransform((prev) => ({
            ...prev,
            scale: Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE),
          }))
        },
      })

      return () => {
        gestureHandlerRef.current?.destroy()
      }
    }, [])

    // 탭 이벤트 처리 (Flood Fill)
    const handleCanvasTap = useCallback(
      (clientX: number, clientY: number) => {
        const canvas = canvasRef.current
        const offscreen = offscreenCanvasRef.current
        if (!canvas || !offscreen) return

        const rect = canvas.getBoundingClientRect()

        // 화면 좌표를 오프스크린 캔버스 좌표로 변환
        const displayX = clientX - rect.left
        const displayY = clientY - rect.top

        // Transform 역변환
        const centerX = canvas.width / 2 + transform.translateX
        const centerY = canvas.height / 2 + transform.translateY

        const x = Math.floor(
          (displayX - centerX) / transform.scale + offscreen.width / 2
        )
        const y = Math.floor(
          (displayY - centerY) / transform.scale + offscreen.height / 2
        )

        // 범위 체크
        if (x < 0 || x >= offscreen.width || y < 0 || y >= offscreen.height) {
          return
        }

        // Flood Fill 실행
        const ctx = offscreen.getContext('2d', { willReadFrequently: true })
        if (!ctx) return

        floodFill(ctx, x, y, selectedColor.hex, {
          tolerance: 32,
          preserveOutline: true,
          outlineThreshold: 60,
        })

        // 히스토리에 추가
        const newRegion: ColoredRegion = {
          x,
          y,
          color: selectedColor.hex,
          timestamp: Date.now(),
        }

        const newData = [...currentData, newRegion]
        pushHistory(newData)
        onColorChange?.(newData)

        // 최근 사용 색상에 추가
        addRecentColor(selectedColor)

        // 화면 업데이트
        renderToDisplay()
      },
      [
        selectedColor,
        currentData,
        transform,
        pushHistory,
        onColorChange,
        addRecentColor,
        renderToDisplay,
      ]
    )

    return (
      <div
        ref={containerRef}
        className={cn(
          'relative flex items-center justify-center overflow-hidden bg-muted/30',
          className
        )}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">로딩 중...</p>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={canvasSize.width || 400}
          height={canvasSize.height || 400}
          className="rounded-lg border-2 border-border bg-white shadow-lg"
          style={{
            width: canvasSize.width || 400,
            height: canvasSize.height || 400,
            touchAction: 'none',
            cursor: 'crosshair',
          }}
        />

        {/* 줌 레벨 표시 */}
        {transform.scale !== 1 && (
          <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
            {Math.round(transform.scale * 100)}%
          </div>
        )}
      </div>
    )
  }
)
