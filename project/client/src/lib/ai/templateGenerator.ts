import sharp from 'sharp'
import { extractColors, type ExtractedColor } from './colorExtractor'

export interface GenerateOptions {
  colorCount: number // 5-30
  difficulty: 'easy' | 'medium' | 'hard'
  smoothing: number // 0-1 (영역 경계 부드러움)
}

export interface GeneratedTemplate {
  width: number
  height: number
  colors: ExtractedColor[]
  regions: Region[]
  previewImageBase64: string
}

export interface Region {
  id: number
  colorIndex: number
  color: ExtractedColor
  pixelCount: number
}

const DIFFICULTY_SETTINGS = {
  easy: { minColorCount: 5, maxColorCount: 10 },
  medium: { minColorCount: 10, maxColorCount: 20 },
  hard: { minColorCount: 20, maxColorCount: 30 },
}

/**
 * 이미지에서 Paint by Numbers 템플릿을 생성합니다.
 */
export async function generateTemplate(
  imageBuffer: Buffer,
  options: GenerateOptions
): Promise<GeneratedTemplate> {
  const { colorCount, difficulty, smoothing } = options

  // 난이도에 따른 색상 수 조정
  const settings = DIFFICULTY_SETTINGS[difficulty]
  const adjustedColorCount = Math.max(
    settings.minColorCount,
    Math.min(settings.maxColorCount, colorCount)
  )

  // 이미지 메타데이터 가져오기
  const metadata = await sharp(imageBuffer).metadata()
  const width = metadata.width || 800
  const height = metadata.height || 800

  // 최대 크기 제한 (800x800)
  const maxSize = 800
  const scale = Math.min(1, maxSize / Math.max(width, height))
  const targetWidth = Math.round(width * scale)
  const targetHeight = Math.round(height * scale)

  // 이미지 리사이즈 및 전처리
  let processedBuffer = await sharp(imageBuffer)
    .resize(targetWidth, targetHeight, { fit: 'inside' })
    .toBuffer()

  // 스무딩 적용 (영역 경계 부드럽게)
  if (smoothing > 0) {
    const blurRadius = Math.round(smoothing * 3) + 1
    processedBuffer = await sharp(processedBuffer)
      .blur(blurRadius)
      .toBuffer()
  }

  // 색상 추출
  const colorResult = await extractColors(processedBuffer, adjustedColorCount)

  // 색상 양자화된 이미지 생성 (미리보기용)
  const quantizedBuffer = await createQuantizedImage(
    processedBuffer,
    colorResult.colors,
    targetWidth,
    targetHeight
  )

  // Base64 미리보기 이미지 생성
  const previewImageBase64 = await sharp(quantizedBuffer)
    .png()
    .toBuffer()
    .then((buf) => `data:image/png;base64,${buf.toString('base64')}`)

  // 영역 생성 (간단한 구현)
  const regions: Region[] = colorResult.colors.map((color, index) => ({
    id: index + 1,
    colorIndex: index,
    color,
    pixelCount: color.count,
  }))

  return {
    width: targetWidth,
    height: targetHeight,
    colors: colorResult.colors,
    regions,
    previewImageBase64,
  }
}

/**
 * 색상 양자화된 이미지를 생성합니다.
 */
async function createQuantizedImage(
  imageBuffer: Buffer,
  palette: ExtractedColor[],
  width: number,
  height: number
): Promise<Buffer> {
  const { data } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true })

  const outputData = Buffer.alloc(data.length)

  // 각 픽셀을 가장 가까운 팔레트 색상으로 매핑
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    const nearestColor = findNearestColor({ r, g, b }, palette)
    outputData[i] = nearestColor.r
    outputData[i + 1] = nearestColor.g
    outputData[i + 2] = nearestColor.b
  }

  return sharp(outputData, {
    raw: { width, height, channels: 3 },
  })
    .png()
    .toBuffer()
}

/**
 * 가장 가까운 팔레트 색상을 찾습니다.
 */
function findNearestColor(
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
