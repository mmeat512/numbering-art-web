import sharp from 'sharp'
import { ExtractedColor } from './colorExtractor'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const potrace = require('potrace')


export interface SvgRegion {
  id: string
  colorNumber: number
  path: string
  labelX: number
  labelY: number
}

export interface SvgTemplate {
  viewBox: string
  width: number
  height: number
  regions: SvgRegion[]
}

export interface ConvertOptions {
  turdSize?: number      // 최소 영역 크기 (픽셀), 기본값: 100
  optTolerance?: number  // path 단순화 정도 (0-1), 기본값: 0.2
  threshold?: number     // 이진화 임계값 (0-255), 기본값: 128
}

const DEFAULT_OPTIONS: Required<ConvertOptions> = {
  turdSize: 100,
  optTolerance: 0.2,
  threshold: 128,
}

/**
 * 이미지를 SVG 템플릿으로 변환합니다.
 * 각 색상별로 마스크를 생성하고 Potrace로 path를 추출합니다.
 */
export async function convertToSvg(
  imageBuffer: Buffer,
  palette: ExtractedColor[],
  width: number,
  height: number,
  options: ConvertOptions = {}
): Promise<SvgTemplate> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // 이미지 raw 데이터 추출
  const { data } = await sharp(imageBuffer)
    .resize(width, height, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  // 각 색상별로 마스크 생성 및 SVG path 추출
  const regionsPromises = palette.map((color, colorIndex) =>
    createRegionsFromColor(data, width, height, color, colorIndex + 1, palette, opts)
  )

  const regionsArrays = await Promise.all(regionsPromises)
  const regions = regionsArrays.flat()

  return {
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
    regions,
  }
}

/**
 * 특정 색상에 해당하는 영역들을 추출합니다.
 */
async function createRegionsFromColor(
  imageData: Buffer,
  width: number,
  height: number,
  targetColor: ExtractedColor,
  colorNumber: number,
  palette: ExtractedColor[],
  options: Required<ConvertOptions>
): Promise<SvgRegion[]> {
  // 1. 해당 색상에 해당하는 픽셀만 흰색, 나머지는 검정색인 마스크 생성
  const maskBuffer = createColorMask(imageData, width, height, targetColor, palette)

  // 2. Potrace로 SVG path 추출
  const svgString = await traceImage(maskBuffer, width, height, options)

  // 3. SVG에서 path 추출
  const paths = extractPathsFromSvg(svgString)

  // 4. 각 path에 대해 Region 생성
  return paths.map((path, index) => {
    const centroid = calculatePathCentroid(path, width, height)
    return {
      id: `region-${colorNumber}-${index + 1}`,
      colorNumber,
      path,
      labelX: centroid.x,
      labelY: centroid.y,
    }
  })
}

/**
 * 특정 색상에 해당하는 픽셀만 흰색으로 표시하는 마스크를 생성합니다.
 */
function createColorMask(
  imageData: Buffer,
  width: number,
  height: number,
  targetColor: ExtractedColor,
  palette: ExtractedColor[]
): Buffer {
  const maskData = Buffer.alloc(width * height)

  for (let i = 0; i < imageData.length; i += 3) {
    const pixelIndex = i / 3
    const r = imageData[i]
    const g = imageData[i + 1]
    const b = imageData[i + 2]

    // 가장 가까운 팔레트 색상 찾기
    const nearestColor = findNearestPaletteColor({ r, g, b }, palette)

    // 타겟 색상과 일치하면 흰색(255), 아니면 검정(0)
    if (nearestColor.hex === targetColor.hex) {
      maskData[pixelIndex] = 255
    } else {
      maskData[pixelIndex] = 0
    }
  }

  return maskData
}

/**
 * 가장 가까운 팔레트 색상을 찾습니다.
 */
function findNearestPaletteColor(
  pixel: { r: number; g: number; b: number },
  palette: ExtractedColor[]
): ExtractedColor {
  let minDistance = Infinity
  let nearestColor = palette[0]

  for (const color of palette) {
    const distance =
      Math.pow(pixel.r - color.r, 2) +
      Math.pow(pixel.g - color.g, 2) +
      Math.pow(pixel.b - color.b, 2)

    if (distance < minDistance) {
      minDistance = distance
      nearestColor = color
    }
  }

  return nearestColor
}

/**
 * Potrace를 사용하여 마스크 이미지를 SVG로 변환합니다.
 */
async function traceImage(
  maskData: Buffer,
  width: number,
  height: number,
  options: Required<ConvertOptions>
): Promise<string> {
  // grayscale PNG로 변환
  const pngBuffer = await sharp(maskData, {
    raw: { width, height, channels: 1 },
  })
    .png()
    .toBuffer()

  return new Promise((resolve, reject) => {
    // Potrace 클래스를 사용하여 변환
    const tracer = new potrace.Potrace()
    tracer.setParameters({
      threshold: options.threshold,
      turdSize: options.turdSize,
      optTolerance: options.optTolerance,
    })
    tracer.loadImage(pngBuffer, (err: Error | null) => {
      if (err) {
        reject(err)
      } else {
        resolve(tracer.getSVG())
      }
    })
  })
}


/**
 * SVG 문자열에서 path 요소들을 추출합니다.
 */
function extractPathsFromSvg(svgString: string): string[] {
  const paths: string[] = []
  // path d 속성 추출 정규식
  const pathRegex = /d="([^"]+)"/g
  let match

  while ((match = pathRegex.exec(svgString)) !== null) {
    const pathData = match[1]
    // 빈 path 또는 너무 짧은 path 제외
    if (pathData && pathData.length > 10) {
      paths.push(pathData)
    }
  }

  return paths
}

/**
 * SVG path의 중심점(centroid)을 계산합니다.
 * 간단한 방법: path의 bounding box 중심 사용
 */
function calculatePathCentroid(
  pathData: string,
  viewWidth: number,
  viewHeight: number
): { x: number; y: number } {
  // path에서 좌표 추출
  const coordRegex = /([ML])\s*(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)/gi
  const coords: { x: number; y: number }[] = []
  let match

  while ((match = coordRegex.exec(pathData)) !== null) {
    coords.push({
      x: parseFloat(match[2]),
      y: parseFloat(match[3]),
    })
  }

  if (coords.length === 0) {
    // 좌표를 찾지 못한 경우 중앙 반환
    return { x: viewWidth / 2, y: viewHeight / 2 }
  }

  // Bounding box 계산
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity

  for (const coord of coords) {
    minX = Math.min(minX, coord.x)
    maxX = Math.max(maxX, coord.x)
    minY = Math.min(minY, coord.y)
    maxY = Math.max(maxY, coord.y)
  }

  // 중심점 반환
  return {
    x: Math.round((minX + maxX) / 2),
    y: Math.round((minY + maxY) / 2),
  }
}
