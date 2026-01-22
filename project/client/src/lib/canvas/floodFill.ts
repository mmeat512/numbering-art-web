'use client'

/**
 * Flood Fill Algorithm (Scanline approach)
 * 시니어 친화적 컬러링 앱을 위한 최적화된 플러드 필 알고리즘
 * - 메모리 효율적인 스캔라인 방식
 * - 색상 허용 범위(tolerance)로 안티앨리어싱 처리
 * - 경계선 보존
 */

export interface FloodFillOptions {
  tolerance?: number // 색상 허용 범위 (0-255), 기본값 32
  preserveOutline?: boolean // 검정 외곽선 보존 여부
  outlineThreshold?: number // 외곽선으로 판단할 밝기 임계값
}

interface Point {
  x: number
  y: number
}

interface RGBA {
  r: number
  g: number
  b: number
  a: number
}

/**
 * 캔버스에 플러드 필 적용
 */
export function floodFill(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColor: string,
  options: FloodFillOptions = {}
): void {
  const { tolerance = 32, preserveOutline = true, outlineThreshold = 50 } = options

  const canvas = ctx.canvas
  const width = canvas.width
  const height = canvas.height

  // 시작점이 캔버스 범위 내인지 확인
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
    return
  }

  // 이미지 데이터 가져오기
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  // 채울 색상 파싱
  const fillRGBA = hexToRGBA(fillColor)

  // 시작점의 색상 가져오기
  const startIdx = (startY * width + startX) * 4
  const startColor: RGBA = {
    r: data[startIdx],
    g: data[startIdx + 1],
    b: data[startIdx + 2],
    a: data[startIdx + 3],
  }

  // 시작점이 외곽선이면 채우지 않음
  if (preserveOutline && isOutline(startColor, outlineThreshold)) {
    return
  }

  // 이미 같은 색이면 채우지 않음
  if (colorsMatch(startColor, fillRGBA, 0)) {
    return
  }

  // 방문 체크 배열 (비트 배열로 메모리 절약)
  const visited = new Uint8Array(width * height)

  // 스캔라인 플러드 필
  const stack: Point[] = [{ x: startX, y: startY }]

  while (stack.length > 0) {
    const { x, y } = stack.pop()!
    const idx = y * width + x

    // 이미 방문했으면 스킵
    if (visited[idx]) continue

    // 범위 체크
    if (x < 0 || x >= width || y < 0 || y >= height) continue

    const pixelIdx = idx * 4
    const pixelColor: RGBA = {
      r: data[pixelIdx],
      g: data[pixelIdx + 1],
      b: data[pixelIdx + 2],
      a: data[pixelIdx + 3],
    }

    // 외곽선이면 스킵
    if (preserveOutline && isOutline(pixelColor, outlineThreshold)) continue

    // 색상이 일치하지 않으면 스킵
    if (!colorsMatch(startColor, pixelColor, tolerance)) continue

    // 방문 표시
    visited[idx] = 1

    // 왼쪽으로 확장
    let leftX = x
    while (leftX > 0) {
      const leftIdx = (y * width + (leftX - 1)) * 4
      const leftColor: RGBA = {
        r: data[leftIdx],
        g: data[leftIdx + 1],
        b: data[leftIdx + 2],
        a: data[leftIdx + 3],
      }

      if (preserveOutline && isOutline(leftColor, outlineThreshold)) break
      if (!colorsMatch(startColor, leftColor, tolerance)) break
      if (visited[y * width + leftX - 1]) break

      leftX--
      visited[y * width + leftX] = 1
    }

    // 오른쪽으로 확장
    let rightX = x
    while (rightX < width - 1) {
      const rightIdx = (y * width + (rightX + 1)) * 4
      const rightColor: RGBA = {
        r: data[rightIdx],
        g: data[rightIdx + 1],
        b: data[rightIdx + 2],
        a: data[rightIdx + 3],
      }

      if (preserveOutline && isOutline(rightColor, outlineThreshold)) break
      if (!colorsMatch(startColor, rightColor, tolerance)) break
      if (visited[y * width + rightX + 1]) break

      rightX++
      visited[y * width + rightX] = 1
    }

    // 현재 라인 채우기
    for (let fx = leftX; fx <= rightX; fx++) {
      const fillIdx = (y * width + fx) * 4
      data[fillIdx] = fillRGBA.r
      data[fillIdx + 1] = fillRGBA.g
      data[fillIdx + 2] = fillRGBA.b
      data[fillIdx + 3] = fillRGBA.a
    }

    // 위아래 라인 스캔
    if (y > 0) {
      for (let sx = leftX; sx <= rightX; sx++) {
        if (!visited[(y - 1) * width + sx]) {
          stack.push({ x: sx, y: y - 1 })
        }
      }
    }

    if (y < height - 1) {
      for (let sx = leftX; sx <= rightX; sx++) {
        if (!visited[(y + 1) * width + sx]) {
          stack.push({ x: sx, y: y + 1 })
        }
      }
    }
  }

  // 이미지 데이터 적용
  ctx.putImageData(imageData, 0, 0)
}

/**
 * HEX 색상을 RGBA로 변환
 */
export function hexToRGBA(hex: string): RGBA {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    return { r: 0, g: 0, b: 0, a: 255 }
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: 255,
  }
}

/**
 * RGBA를 HEX로 변환
 */
export function rgbaToHex(rgba: RGBA): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}`
}

/**
 * 두 색상이 허용 범위 내에서 일치하는지 확인
 */
function colorsMatch(color1: RGBA, color2: RGBA, tolerance: number): boolean {
  return (
    Math.abs(color1.r - color2.r) <= tolerance &&
    Math.abs(color1.g - color2.g) <= tolerance &&
    Math.abs(color1.b - color2.b) <= tolerance &&
    Math.abs(color1.a - color2.a) <= tolerance
  )
}

/**
 * 픽셀이 외곽선인지 확인 (어두운 색상)
 */
function isOutline(color: RGBA, threshold: number): boolean {
  // 밝기 계산 (YIQ 공식)
  const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000
  return brightness < threshold && color.a > 200
}

/**
 * 캔버스의 특정 위치 색상 가져오기
 */
export function getPixelColor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
): RGBA {
  const pixel = ctx.getImageData(x, y, 1, 1).data
  return {
    r: pixel[0],
    g: pixel[1],
    b: pixel[2],
    a: pixel[3],
  }
}
