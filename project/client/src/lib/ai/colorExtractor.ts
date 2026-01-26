import sharp from 'sharp'
import quantize from 'quantize'

export interface ExtractedColor {
  r: number
  g: number
  b: number
  hex: string
  count: number
  percentage: number
}

export interface ColorExtractionResult {
  colors: ExtractedColor[]
  dominantColor: ExtractedColor
  totalPixels: number
}

/**
 * 이미지에서 주요 색상을 추출합니다.
 * K-means 기반 색상 양자화를 사용합니다.
 */
export async function extractColors(
  imageBuffer: Buffer,
  colorCount: number = 10
): Promise<ColorExtractionResult> {
  // 이미지 리사이즈 (성능 최적화)
  const resizedBuffer = await sharp(imageBuffer)
    .resize(200, 200, { fit: 'inside' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { data, info } = resizedBuffer
  const pixelCount = info.width * info.height

  // RGB 픽셀 배열 생성
  const pixels: [number, number, number][] = []
  for (let i = 0; i < data.length; i += 3) {
    pixels.push([data[i], data[i + 1], data[i + 2]])
  }

  // 색상 양자화
  const colorMap = quantize(pixels, colorCount)
  if (!colorMap) {
    throw new Error('색상 추출에 실패했습니다.')
  }

  const palette = colorMap.palette()

  // 각 색상의 빈도 계산
  const colorCounts = new Map<string, number>()
  for (const pixel of pixels) {
    const mapped = colorMap.map(pixel)
    if (mapped) {
      const key = `${mapped[0]},${mapped[1]},${mapped[2]}`
      colorCounts.set(key, (colorCounts.get(key) || 0) + 1)
    }
  }

  // 결과 생성
  const colors: ExtractedColor[] = palette.map((color) => {
    const [r, g, b] = color
    const key = `${r},${g},${b}`
    const count = colorCounts.get(key) || 0
    return {
      r,
      g,
      b,
      hex: rgbToHex(r, g, b),
      count,
      percentage: (count / pixelCount) * 100,
    }
  })

  // 빈도순 정렬
  colors.sort((a, b) => b.count - a.count)

  return {
    colors,
    dominantColor: colors[0],
    totalPixels: pixelCount,
  }
}

/**
 * RGB를 HEX로 변환
 */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

/**
 * 두 색상 간의 유사도를 계산합니다 (0-1, 1이 동일)
 */
export function colorSimilarity(
  c1: { r: number; g: number; b: number },
  c2: { r: number; g: number; b: number }
): number {
  const rDiff = c1.r - c2.r
  const gDiff = c1.g - c2.g
  const bDiff = c1.b - c2.b
  const distance = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff)
  // 최대 거리는 sqrt(255^2 * 3) = 441.67
  return 1 - distance / 441.67
}
