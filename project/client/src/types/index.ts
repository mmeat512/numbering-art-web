// Template Types
export interface Template {
  id: string
  title: string
  categoryId: string
  difficulty: 'easy' | 'medium' | 'hard'
  imageUrl: string
  thumbnailUrl: string
  usageCount: number
  createdAt: string
}

export interface Category {
  id: string
  name: string
  nameKo: string
  icon: string
  sortOrder: number
}

// Artwork Types
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

export interface ColoredRegion {
  x: number
  y: number
  color: string
  timestamp: number
}

// Color Palette Types
export interface PaletteColor {
  id: string
  name: string
  nameKo: string
  hex: string
}

// Canvas Types
export interface CanvasState {
  zoom: number
  panX: number
  panY: number
  mode: 'color' | 'pan'
}

export interface HistoryEntry {
  coloredData: ColoredRegion[]
  timestamp: number
}

// Settings Types
export interface UserSettings {
  fontSize: 'normal' | 'large' | 'extra-large'
  highContrast: boolean
  showColorNames: boolean
  confirmBeforeColor: boolean
  autoSaveInterval: number
}

// Default color palette (24 colors)
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
