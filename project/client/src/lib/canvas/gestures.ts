'use client'

/**
 * Touch Gesture Handling
 * 시니어 친화적 터치 제스처 유틸리티
 * - 핀치 줌 (두 손가락)
 * - 팬 (한 손가락 드래그)
 * - 탭 (터치 후 바로 뗌)
 */

export interface GestureState {
  scale: number
  translateX: number
  translateY: number
  isDragging: boolean
  isPinching: boolean
}

export interface GestureConfig {
  minScale?: number
  maxScale?: number
  onTap?: (x: number, y: number) => void
  onPan?: (deltaX: number, deltaY: number) => void
  onZoom?: (scale: number, centerX: number, centerY: number) => void
  onGestureStart?: () => void
  onGestureEnd?: () => void
}

interface TouchPoint {
  x: number
  y: number
  id: number
}

const DEFAULT_CONFIG: Required<Omit<GestureConfig, 'onTap' | 'onPan' | 'onZoom' | 'onGestureStart' | 'onGestureEnd'>> = {
  minScale: 0.5,
  maxScale: 4,
}

/**
 * 제스처 핸들러 클래스
 */
export class GestureHandler {
  private element: HTMLElement
  private config: GestureConfig
  private state: GestureState

  private touchPoints: Map<number, TouchPoint> = new Map()
  private lastTouchTime = 0
  private lastTapPosition: { x: number; y: number } | null = null
  private initialPinchDistance = 0
  private initialScale = 1
  private lastPanPosition: { x: number; y: number } | null = null

  // 탭 감지를 위한 설정
  private readonly TAP_THRESHOLD = 10 // 픽셀
  private readonly TAP_TIMEOUT = 300 // 밀리초
  private tapStartPosition: { x: number; y: number } | null = null
  private tapStartTime = 0

  constructor(element: HTMLElement, config: GestureConfig = {}) {
    this.element = element
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.state = {
      scale: 1,
      translateX: 0,
      translateY: 0,
      isDragging: false,
      isPinching: false,
    }

    this.bindEvents()
  }

  private bindEvents(): void {
    this.element.addEventListener('touchstart', this.handleTouchStart, { passive: false })
    this.element.addEventListener('touchmove', this.handleTouchMove, { passive: false })
    this.element.addEventListener('touchend', this.handleTouchEnd, { passive: false })
    this.element.addEventListener('touchcancel', this.handleTouchEnd, { passive: false })

    // 마우스 이벤트도 지원 (데스크톱)
    this.element.addEventListener('mousedown', this.handleMouseDown)
    this.element.addEventListener('mousemove', this.handleMouseMove)
    this.element.addEventListener('mouseup', this.handleMouseUp)
    this.element.addEventListener('mouseleave', this.handleMouseUp)
    this.element.addEventListener('wheel', this.handleWheel, { passive: false })
  }

  private handleTouchStart = (e: TouchEvent): void => {
    e.preventDefault()

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      this.touchPoints.set(touch.identifier, {
        x: touch.clientX,
        y: touch.clientY,
        id: touch.identifier,
      })
    }

    if (this.touchPoints.size === 1) {
      // 단일 터치 - 탭 또는 팬 시작
      const touch = e.changedTouches[0]
      this.tapStartPosition = { x: touch.clientX, y: touch.clientY }
      this.tapStartTime = Date.now()
      this.lastPanPosition = { x: touch.clientX, y: touch.clientY }
      this.state.isDragging = true
      this.config.onGestureStart?.()
    } else if (this.touchPoints.size === 2) {
      // 두 손가락 - 핀치 줌 시작
      this.state.isPinching = true
      this.state.isDragging = false
      this.initialPinchDistance = this.getPinchDistance()
      this.initialScale = this.state.scale
    }
  }

  private handleTouchMove = (e: TouchEvent): void => {
    e.preventDefault()

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      this.touchPoints.set(touch.identifier, {
        x: touch.clientX,
        y: touch.clientY,
        id: touch.identifier,
      })
    }

    if (this.state.isPinching && this.touchPoints.size === 2) {
      // 핀치 줌 처리
      const newDistance = this.getPinchDistance()
      const scaleChange = newDistance / this.initialPinchDistance
      const newScale = Math.min(
        Math.max(this.initialScale * scaleChange, this.config.minScale!),
        this.config.maxScale!
      )

      const center = this.getPinchCenter()
      this.state.scale = newScale
      this.config.onZoom?.(newScale, center.x, center.y)
    } else if (this.state.isDragging && this.touchPoints.size === 1) {
      // 팬 처리
      const touch = e.changedTouches[0]
      if (this.lastPanPosition) {
        const deltaX = touch.clientX - this.lastPanPosition.x
        const deltaY = touch.clientY - this.lastPanPosition.y

        this.state.translateX += deltaX
        this.state.translateY += deltaY
        this.config.onPan?.(deltaX, deltaY)
      }
      this.lastPanPosition = { x: touch.clientX, y: touch.clientY }
    }
  }

  private handleTouchEnd = (e: TouchEvent): void => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i]
      this.touchPoints.delete(touch.identifier)
    }

    // 탭 감지
    if (this.touchPoints.size === 0 && this.tapStartPosition) {
      const touch = e.changedTouches[0]
      const elapsed = Date.now() - this.tapStartTime
      const distance = Math.sqrt(
        Math.pow(touch.clientX - this.tapStartPosition.x, 2) +
        Math.pow(touch.clientY - this.tapStartPosition.y, 2)
      )

      if (elapsed < this.TAP_TIMEOUT && distance < this.TAP_THRESHOLD) {
        // 유효한 탭
        const rect = this.element.getBoundingClientRect()
        const x = touch.clientX - rect.left
        const y = touch.clientY - rect.top
        this.config.onTap?.(x, y)
      }
    }

    if (this.touchPoints.size === 0) {
      this.state.isDragging = false
      this.state.isPinching = false
      this.lastPanPosition = null
      this.tapStartPosition = null
      this.config.onGestureEnd?.()
    } else if (this.touchPoints.size === 1) {
      // 한 손가락만 남음 - 팬으로 전환
      this.state.isPinching = false
      this.state.isDragging = true
      const point = Array.from(this.touchPoints.values())[0]
      this.lastPanPosition = { x: point.x, y: point.y }
    }
  }

  private handleMouseDown = (e: MouseEvent): void => {
    if (e.button !== 0) return // 왼쪽 버튼만

    this.tapStartPosition = { x: e.clientX, y: e.clientY }
    this.tapStartTime = Date.now()
    this.lastPanPosition = { x: e.clientX, y: e.clientY }
    this.state.isDragging = true
    this.config.onGestureStart?.()
  }

  private handleMouseMove = (e: MouseEvent): void => {
    if (!this.state.isDragging || !this.lastPanPosition) return

    const deltaX = e.clientX - this.lastPanPosition.x
    const deltaY = e.clientY - this.lastPanPosition.y

    this.state.translateX += deltaX
    this.state.translateY += deltaY
    this.config.onPan?.(deltaX, deltaY)

    this.lastPanPosition = { x: e.clientX, y: e.clientY }
  }

  private handleMouseUp = (e: MouseEvent): void => {
    if (this.tapStartPosition) {
      const elapsed = Date.now() - this.tapStartTime
      const distance = Math.sqrt(
        Math.pow(e.clientX - this.tapStartPosition.x, 2) +
        Math.pow(e.clientY - this.tapStartPosition.y, 2)
      )

      if (elapsed < this.TAP_TIMEOUT && distance < this.TAP_THRESHOLD) {
        const rect = this.element.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        this.config.onTap?.(x, y)
      }
    }

    this.state.isDragging = false
    this.lastPanPosition = null
    this.tapStartPosition = null
    this.config.onGestureEnd?.()
  }

  private handleWheel = (e: WheelEvent): void => {
    e.preventDefault()

    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.min(
      Math.max(this.state.scale * delta, this.config.minScale!),
      this.config.maxScale!
    )

    const rect = this.element.getBoundingClientRect()
    const centerX = e.clientX - rect.left
    const centerY = e.clientY - rect.top

    this.state.scale = newScale
    this.config.onZoom?.(newScale, centerX, centerY)
  }

  private getPinchDistance(): number {
    const points = Array.from(this.touchPoints.values())
    if (points.length < 2) return 0

    const dx = points[0].x - points[1].x
    const dy = points[0].y - points[1].y
    return Math.sqrt(dx * dx + dy * dy)
  }

  private getPinchCenter(): { x: number; y: number } {
    const points = Array.from(this.touchPoints.values())
    if (points.length < 2) {
      return { x: 0, y: 0 }
    }

    const rect = this.element.getBoundingClientRect()
    return {
      x: (points[0].x + points[1].x) / 2 - rect.left,
      y: (points[0].y + points[1].y) / 2 - rect.top,
    }
  }

  public getState(): GestureState {
    return { ...this.state }
  }

  public setState(state: Partial<GestureState>): void {
    this.state = { ...this.state, ...state }
  }

  public reset(): void {
    this.state = {
      scale: 1,
      translateX: 0,
      translateY: 0,
      isDragging: false,
      isPinching: false,
    }
  }

  public destroy(): void {
    this.element.removeEventListener('touchstart', this.handleTouchStart)
    this.element.removeEventListener('touchmove', this.handleTouchMove)
    this.element.removeEventListener('touchend', this.handleTouchEnd)
    this.element.removeEventListener('touchcancel', this.handleTouchEnd)
    this.element.removeEventListener('mousedown', this.handleMouseDown)
    this.element.removeEventListener('mousemove', this.handleMouseMove)
    this.element.removeEventListener('mouseup', this.handleMouseUp)
    this.element.removeEventListener('mouseleave', this.handleMouseUp)
    this.element.removeEventListener('wheel', this.handleWheel)
  }
}

/**
 * React Hook용 제스처 핸들러 생성
 */
export function createGestureHandler(
  element: HTMLElement | null,
  config: GestureConfig
): GestureHandler | null {
  if (!element) return null
  return new GestureHandler(element, config)
}
