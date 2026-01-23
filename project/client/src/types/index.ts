// ============================================
// Paint by Numbers - 숫자 맞춤 컬러링 타입 정의
// ============================================

// 영역 정의 (SVG path 기반)
export interface Region {
  id: string
  colorNumber: number // 정답 색상 번호 (1, 2, 3...)
  path: string // SVG path 데이터
  labelX: number // 숫자 표시 X 좌표
  labelY: number // 숫자 표시 Y 좌표
}

// 숫자-색상 매핑
export interface NumberedColor {
  number: number // 1, 2, 3...
  hex: string // 색상 코드
  name: string // 색상 이름 (한글)
  totalRegions: number // 이 색상으로 칠할 총 영역 수
}

// 템플릿 데이터 구조
export interface TemplateData {
  viewBox: string // SVG viewBox (예: "0 0 400 400")
  regions: Region[]
}

// Template 타입 (새 구조)
export interface Template {
  id: string
  title: string
  categoryId: string
  difficulty: 'easy' | 'medium' | 'hard'
  colorCount: number // 색상 개수 (5-30)
  regionCount: number // 총 영역 개수
  estimatedTime: number // 예상 완성 시간 (분)
  thumbnailUrl: string
  templateData: TemplateData // 영역-숫자 매핑
  colorPalette: NumberedColor[] // 숫자-색상 매핑
  usageCount: number
  averageCompletionTime?: number // 평균 완성 시간 (초)
  createdAt: string
}

// 카테고리
export interface Category {
  id: string
  name: string
  nameKo: string
  icon: string
  sortOrder: number
}

// 칠해진 영역 상태
export interface FilledRegion {
  regionId: string
  colorNumber: number // 사용자가 칠한 색상 번호
  isCorrect: boolean // 정답 여부
  filledAt: number // 타임스탬프
}

// 사용자 진행 상황
export interface UserProgress {
  id: string
  templateId: string
  filledRegions: FilledRegion[]
  progress: number // 0-100 (올바르게 칠한 비율)
  mistakesCount: number // 실수 횟수
  startTime: number
  lastUpdatedAt: number
  isCompleted: boolean
  completionTime?: number // 완성 시간 (초)
}

// 완성된 작품
export interface CompletedArtwork {
  id: string
  templateId: string
  templateTitle: string
  thumbnailDataUrl: string
  completionTime: number // 소요 시간 (초)
  accuracy: number // 정확도 (0-100)
  mistakesCount: number
  score: number // 점수
  completedAt: number
}

// 게임 상태
export interface GameState {
  selectedColorNumber: number | null // 현재 선택된 색상 번호
  isHintActive: boolean // 힌트 활성화 여부
  hintRegionId: string | null // 힌트로 표시중인 영역
  showNumbers: boolean // 숫자 표시 여부 (칠한 영역은 숨김)
  zoomLevel: number
  panX: number
  panY: number
}

// 피드백 타입
export type FeedbackType = 'correct' | 'incorrect' | 'complete' | null

// 피드백 상태
export interface FeedbackState {
  type: FeedbackType
  regionId: string | null
  message: string | null
}

// Canvas Types
export interface CanvasState {
  zoom: number
  panX: number
  panY: number
  mode: 'color' | 'pan'
}

// History Entry (Undo/Redo용)
export interface HistoryEntry {
  filledRegions: FilledRegion[]
  timestamp: number
}

// Settings Types
export interface UserSettings {
  fontSize: 'normal' | 'large' | 'extra-large'
  highContrast: boolean
  showColorNames: boolean
  autoHideNumbers: boolean // 칠한 영역 숫자 자동 숨김
  autoSaveInterval: number
  soundEnabled: boolean // 효과음 활성화
}

// ============================================
// 레거시 호환성을 위한 타입 (점진적 마이그레이션)
// ============================================

// 기존 ColoredRegion (IndexedDB 호환)
export interface ColoredRegion {
  x: number
  y: number
  color: string
  timestamp: number
}

// 기존 UserArtwork (IndexedDB 호환)
export interface UserArtwork {
  id: string
  templateId: string
  coloredData: ColoredRegion[]
  progress: number
  isCompleted: boolean
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

// 기존 PaletteColor (레거시)
export interface PaletteColor {
  id: string
  name: string
  nameKo: string
  hex: string
}

// ============================================
// 기본 색상 팔레트 (숫자 기반)
// ============================================

export const DEFAULT_NUMBERED_COLORS: NumberedColor[] = [
  { number: 1, hex: '#E53935', name: '빨강', totalRegions: 0 },
  { number: 2, hex: '#FF9800', name: '주황', totalRegions: 0 },
  { number: 3, hex: '#FFEB3B', name: '노랑', totalRegions: 0 },
  { number: 4, hex: '#4CAF50', name: '초록', totalRegions: 0 },
  { number: 5, hex: '#2196F3', name: '파랑', totalRegions: 0 },
  { number: 6, hex: '#9C27B0', name: '보라', totalRegions: 0 },
  { number: 7, hex: '#795548', name: '갈색', totalRegions: 0 },
  { number: 8, hex: '#607D8B', name: '회색', totalRegions: 0 },
  { number: 9, hex: '#000000', name: '검정', totalRegions: 0 },
  { number: 10, hex: '#FFFFFF', name: '흰색', totalRegions: 0 },
  { number: 11, hex: '#F48FB1', name: '분홍', totalRegions: 0 },
  { number: 12, hex: '#81D4FA', name: '하늘', totalRegions: 0 },
  { number: 13, hex: '#A5D6A7', name: '연두', totalRegions: 0 },
  { number: 14, hex: '#FFCC80', name: '살구', totalRegions: 0 },
  { number: 15, hex: '#CE93D8', name: '연보라', totalRegions: 0 },
]

// 레거시 팔레트 (이전 버전 호환)
export const DEFAULT_PALETTE: PaletteColor[] = [
  { id: 'red', name: 'Red', nameKo: '빨강', hex: '#E53935' },
  { id: 'pink', name: 'Pink', nameKo: '분홍', hex: '#EC407A' },
  { id: 'purple', name: 'Purple', nameKo: '보라', hex: '#AB47BC' },
  { id: 'deep-purple', name: 'Deep Purple', nameKo: '진보라', hex: '#7E57C2' },
  { id: 'indigo', name: 'Indigo', nameKo: '남색', hex: '#5C6BC0' },
  { id: 'blue', name: 'Blue', nameKo: '파랑', hex: '#42A5F5' },
  { id: 'light-blue', name: 'Light Blue', nameKo: '하늘색', hex: '#29B6F6' },
  { id: 'cyan', name: 'Cyan', nameKo: '청록', hex: '#26C6DA' },
  { id: 'teal', name: 'Teal', nameKo: '청록색', hex: '#26A69A' },
  { id: 'green', name: 'Green', nameKo: '초록', hex: '#66BB6A' },
  { id: 'light-green', name: 'Light Green', nameKo: '연두', hex: '#9CCC65' },
  { id: 'lime', name: 'Lime', nameKo: '라임', hex: '#D4E157' },
  { id: 'yellow', name: 'Yellow', nameKo: '노랑', hex: '#FFEE58' },
  { id: 'amber', name: 'Amber', nameKo: '호박색', hex: '#FFCA28' },
  { id: 'orange', name: 'Orange', nameKo: '주황', hex: '#FFA726' },
  { id: 'deep-orange', name: 'Deep Orange', nameKo: '진주황', hex: '#FF7043' },
  { id: 'brown', name: 'Brown', nameKo: '갈색', hex: '#8D6E63' },
  { id: 'grey', name: 'Grey', nameKo: '회색', hex: '#BDBDBD' },
  { id: 'blue-grey', name: 'Blue Grey', nameKo: '청회색', hex: '#78909C' },
  { id: 'white', name: 'White', nameKo: '흰색', hex: '#FFFFFF' },
  { id: 'black', name: 'Black', nameKo: '검정', hex: '#212121' },
  { id: 'beige', name: 'Beige', nameKo: '베이지', hex: '#F5F5DC' },
  { id: 'navy', name: 'Navy', nameKo: '네이비', hex: '#1A237E' },
  { id: 'gold', name: 'Gold', nameKo: '금색', hex: '#FFD700' },
]
