import { Template, Category } from '@/types'

// 카테고리 목록
export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All', nameKo: '전체', icon: '🎨', sortOrder: 0 },
  { id: 'animals', name: 'Animals', nameKo: '동물', icon: '🐱', sortOrder: 1 },
  { id: 'flowers', name: 'Flowers', nameKo: '꽃', icon: '🌸', sortOrder: 2 },
  { id: 'landscape', name: 'Landscape', nameKo: '풍경', icon: '🏔️', sortOrder: 3 },
  { id: 'pattern', name: 'Pattern', nameKo: '패턴', icon: '🔷', sortOrder: 4 },
  { id: 'food', name: 'Food', nameKo: '음식', icon: '🍎', sortOrder: 5 },
]

// 샘플 템플릿 1: 간단한 꽃 (쉬움)
export const TEMPLATE_FLOWER: Template = {
  id: 'flower-simple',
  title: '귀여운 꽃',
  categoryId: 'flowers',
  difficulty: 'easy',
  colorCount: 5,
  regionCount: 13,
  estimatedTime: 5,
  thumbnailUrl: '',
  usageCount: 150,
  createdAt: '2026-01-23',
  colorPalette: [
    { number: 1, hex: '#E53935', name: '빨강', totalRegions: 5 },
    { number: 2, hex: '#FFEB3B', name: '노랑', totalRegions: 1 },
    { number: 3, hex: '#4CAF50', name: '초록', totalRegions: 3 },
    { number: 4, hex: '#8D6E63', name: '갈색', totalRegions: 1 },
    { number: 5, hex: '#81D4FA', name: '하늘', totalRegions: 3 },
  ],
  templateData: {
    viewBox: '0 0 300 300',
    regions: [
      // 꽃잎 5개 (빨강)
      { id: 'petal-1', colorNumber: 1, path: 'M150,80 Q180,50 150,20 Q120,50 150,80 Z', labelX: 150, labelY: 50 },
      { id: 'petal-2', colorNumber: 1, path: 'M180,110 Q220,90 210,50 Q180,70 180,110 Z', labelX: 195, labelY: 80 },
      { id: 'petal-3', colorNumber: 1, path: 'M170,150 Q210,160 220,120 Q185,115 170,150 Z', labelX: 195, labelY: 135 },
      { id: 'petal-4', colorNumber: 1, path: 'M130,150 Q90,160 80,120 Q115,115 130,150 Z', labelX: 105, labelY: 135 },
      { id: 'petal-5', colorNumber: 1, path: 'M120,110 Q80,90 90,50 Q120,70 120,110 Z', labelX: 105, labelY: 80 },
      // 꽃 중심 (노랑)
      { id: 'center', colorNumber: 2, path: 'M150,130 m-25,0 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0', labelX: 150, labelY: 130 },
      // 줄기 (초록)
      { id: 'stem', colorNumber: 3, path: 'M145,155 L145,250 L155,250 L155,155 Z', labelX: 150, labelY: 200 },
      // 잎 2개 (초록)
      { id: 'leaf-1', colorNumber: 3, path: 'M145,200 Q100,180 90,210 Q120,220 145,200 Z', labelX: 115, labelY: 205 },
      { id: 'leaf-2', colorNumber: 3, path: 'M155,220 Q200,200 210,230 Q180,240 155,220 Z', labelX: 185, labelY: 220 },
      // 화분 (갈색)
      { id: 'pot', colorNumber: 4, path: 'M110,250 L190,250 L180,290 L120,290 Z', labelX: 150, labelY: 270 },
      // 배경 구름 3개 (하늘)
      { id: 'cloud-1', colorNumber: 5, path: 'M40,40 Q30,20 50,20 Q70,10 80,30 Q90,20 100,35 Q90,50 70,50 Q50,55 40,40 Z', labelX: 65, labelY: 35 },
      { id: 'cloud-2', colorNumber: 5, path: 'M200,30 Q190,15 210,15 Q225,5 235,20 Q250,10 255,30 Q245,45 225,45 Q205,50 200,30 Z', labelX: 225, labelY: 30 },
      { id: 'cloud-3', colorNumber: 5, path: 'M230,80 Q220,65 240,65 Q255,55 265,70 Q275,60 280,75 Q270,90 250,90 Q230,95 230,80 Z', labelX: 250, labelY: 77 },
    ],
  },
}

// 샘플 템플릿 2: 귀여운 고양이 (보통)
export const TEMPLATE_CAT: Template = {
  id: 'cat-simple',
  title: '졸린 고양이',
  categoryId: 'animals',
  difficulty: 'medium',
  colorCount: 6,
  regionCount: 15,
  estimatedTime: 10,
  thumbnailUrl: '',
  usageCount: 230,
  createdAt: '2026-01-23',
  colorPalette: [
    { number: 1, hex: '#FF9800', name: '주황', totalRegions: 4 },
    { number: 2, hex: '#FFCC80', name: '살구', totalRegions: 3 },
    { number: 3, hex: '#F48FB1', name: '분홍', totalRegions: 3 },
    { number: 4, hex: '#000000', name: '검정', totalRegions: 3 },
    { number: 5, hex: '#FFFFFF', name: '흰색', totalRegions: 1 },
    { number: 6, hex: '#81D4FA', name: '하늘', totalRegions: 1 },
  ],
  templateData: {
    viewBox: '0 0 300 300',
    regions: [
      // 얼굴 (주황)
      { id: 'face', colorNumber: 1, path: 'M150,200 Q80,200 80,140 Q80,80 150,80 Q220,80 220,140 Q220,200 150,200 Z', labelX: 150, labelY: 140 },
      // 왼쪽 귀 (주황)
      { id: 'ear-left', colorNumber: 1, path: 'M90,90 L70,40 L110,70 Z', labelX: 90, labelY: 65 },
      // 오른쪽 귀 (주황)
      { id: 'ear-right', colorNumber: 1, path: 'M210,90 L230,40 L190,70 Z', labelX: 210, labelY: 65 },
      // 몸통 (주황)
      { id: 'body', colorNumber: 1, path: 'M100,200 Q80,250 100,280 L200,280 Q220,250 200,200 Z', labelX: 150, labelY: 245 },
      // 배 (살구)
      { id: 'belly', colorNumber: 2, path: 'M130,210 Q120,250 140,270 L160,270 Q180,250 170,210 Z', labelX: 150, labelY: 240 },
      // 왼쪽 볼 (살구)
      { id: 'cheek-left', colorNumber: 2, path: 'M100,150 Q85,145 85,160 Q85,175 100,170 Q110,165 100,150 Z', labelX: 95, labelY: 160 },
      // 오른쪽 볼 (살구)
      { id: 'cheek-right', colorNumber: 2, path: 'M200,150 Q215,145 215,160 Q215,175 200,170 Q190,165 200,150 Z', labelX: 205, labelY: 160 },
      // 코 (분홍)
      { id: 'nose', colorNumber: 3, path: 'M150,155 L143,168 L157,168 Z', labelX: 150, labelY: 162 },
      // 왼쪽 귀 안쪽 (분홍)
      { id: 'ear-inner-left', colorNumber: 3, path: 'M88,82 L78,52 L102,72 Z', labelX: 88, labelY: 68 },
      // 오른쪽 귀 안쪽 (분홍)
      { id: 'ear-inner-right', colorNumber: 3, path: 'M212,82 L222,52 L198,72 Z', labelX: 212, labelY: 68 },
      // 왼쪽 눈 (검정)
      { id: 'eye-left', colorNumber: 4, path: 'M120,130 Q115,120 125,120 Q135,120 130,130 Q125,135 120,130 Z', labelX: 125, labelY: 127 },
      // 오른쪽 눈 (검정)
      { id: 'eye-right', colorNumber: 4, path: 'M170,130 Q175,120 185,120 Q180,125 180,130 Q175,135 170,130 Z', labelX: 175, labelY: 127 },
      // 수염 자리 (검정)
      { id: 'whiskers', colorNumber: 4, path: 'M130,175 L70,165 M130,180 L75,185 M170,175 L230,165 M170,180 L225,185', labelX: 150, labelY: 178 },
      // 꼬리 (흰색)
      { id: 'tail', colorNumber: 5, path: 'M220,260 Q260,240 250,200 Q245,210 230,230 Q220,245 220,260 Z', labelX: 240, labelY: 230 },
      // 배경 (하늘)
      { id: 'background', colorNumber: 6, path: 'M10,10 L290,10 L290,290 L10,290 Z M150,200 Q80,200 80,140 Q80,80 150,80 Q220,80 220,140 Q220,200 150,200 M70,40 L110,70 L90,90 Z M230,40 L190,70 L210,90 Z M100,200 Q80,250 100,280 L200,280 Q220,250 200,200 Z', labelX: 40, labelY: 40 },
    ],
  },
}

// 샘플 템플릿 3: 무지개 하트 (쉬움)
export const TEMPLATE_HEART: Template = {
  id: 'rainbow-heart',
  title: '무지개 하트',
  categoryId: 'pattern',
  difficulty: 'easy',
  colorCount: 7,
  regionCount: 7,
  estimatedTime: 3,
  thumbnailUrl: '',
  usageCount: 320,
  createdAt: '2026-01-23',
  colorPalette: [
    { number: 1, hex: '#E53935', name: '빨강', totalRegions: 1 },
    { number: 2, hex: '#FF9800', name: '주황', totalRegions: 1 },
    { number: 3, hex: '#FFEB3B', name: '노랑', totalRegions: 1 },
    { number: 4, hex: '#4CAF50', name: '초록', totalRegions: 1 },
    { number: 5, hex: '#2196F3', name: '파랑', totalRegions: 1 },
    { number: 6, hex: '#3F51B5', name: '남색', totalRegions: 1 },
    { number: 7, hex: '#9C27B0', name: '보라', totalRegions: 1 },
  ],
  templateData: {
    viewBox: '0 0 300 300',
    regions: [
      // 가장 바깥 하트 (빨강)
      { id: 'heart-1', colorNumber: 1, path: 'M150,270 C50,180 20,100 80,60 C120,35 150,60 150,80 C150,60 180,35 220,60 C280,100 250,180 150,270 Z M150,240 C70,165 50,105 95,75 C125,55 150,75 150,90 C150,75 175,55 205,75 C250,105 230,165 150,240 Z', labelX: 60, labelY: 90 },
      // 하트 2 (주황)
      { id: 'heart-2', colorNumber: 2, path: 'M150,240 C70,165 50,105 95,75 C125,55 150,75 150,90 C150,75 175,55 205,75 C250,105 230,165 150,240 Z M150,210 C85,150 70,105 105,85 C130,70 150,85 150,95 C150,85 170,70 195,85 C230,105 215,150 150,210 Z', labelX: 80, labelY: 105 },
      // 하트 3 (노랑)
      { id: 'heart-3', colorNumber: 3, path: 'M150,210 C85,150 70,105 105,85 C130,70 150,85 150,95 C150,85 170,70 195,85 C230,105 215,150 150,210 Z M150,180 C100,135 90,105 115,90 C135,80 150,90 150,100 C150,90 165,80 185,90 C210,105 200,135 150,180 Z', labelX: 100, labelY: 115 },
      // 하트 4 (초록)
      { id: 'heart-4', colorNumber: 4, path: 'M150,180 C100,135 90,105 115,90 C135,80 150,90 150,100 C150,90 165,80 185,90 C210,105 200,135 150,180 Z M150,155 C115,125 105,105 125,95 C140,88 150,95 150,102 C150,95 160,88 175,95 C195,105 185,125 150,155 Z', labelX: 115, labelY: 120 },
      // 하트 5 (파랑)
      { id: 'heart-5', colorNumber: 5, path: 'M150,155 C115,125 105,105 125,95 C140,88 150,95 150,102 C150,95 160,88 175,95 C195,105 185,125 150,155 Z M150,135 C125,115 120,102 135,95 C143,91 150,96 150,100 C150,96 157,91 165,95 C180,102 175,115 150,135 Z', labelX: 130, labelY: 115 },
      // 하트 6 (남색)
      { id: 'heart-6', colorNumber: 6, path: 'M150,135 C125,115 120,102 135,95 C143,91 150,96 150,100 C150,96 157,91 165,95 C180,102 175,115 150,135 Z M150,118 C135,108 132,100 142,96 C147,94 150,97 150,99 C150,97 153,94 158,96 C168,100 165,108 150,118 Z', labelX: 140, labelY: 108 },
      // 가장 안쪽 하트 (보라)
      { id: 'heart-7', colorNumber: 7, path: 'M150,118 C135,108 132,100 142,96 C147,94 150,97 150,99 C150,97 153,94 158,96 C168,100 165,108 150,118 Z', labelX: 150, labelY: 105 },
    ],
  },
}

// 샘플 템플릿 4: 사과 (쉬움 - 시니어 추천)
export const TEMPLATE_APPLE: Template = {
  id: 'apple-simple',
  title: '맛있는 사과',
  categoryId: 'food',
  difficulty: 'easy',
  colorCount: 4,
  regionCount: 6,
  estimatedTime: 3,
  thumbnailUrl: '',
  usageCount: 450,
  createdAt: '2026-01-23',
  colorPalette: [
    { number: 1, hex: '#E53935', name: '빨강', totalRegions: 1 },
    { number: 2, hex: '#4CAF50', name: '초록', totalRegions: 2 },
    { number: 3, hex: '#8D6E63', name: '갈색', totalRegions: 1 },
    { number: 4, hex: '#FFEB3B', name: '노랑', totalRegions: 2 },
  ],
  templateData: {
    viewBox: '0 0 300 300',
    regions: [
      // 사과 몸통 (빨강)
      { id: 'apple-body', colorNumber: 1, path: 'M150,260 C80,260 40,200 50,140 C55,100 90,70 150,70 C210,70 245,100 250,140 C260,200 220,260 150,260 Z', labelX: 150, labelY: 170 },
      // 잎 (초록)
      { id: 'leaf', colorNumber: 2, path: 'M155,70 Q180,40 210,50 Q190,70 170,65 Q160,68 155,70 Z', labelX: 180, labelY: 55 },
      // 줄기 (갈색)
      { id: 'stem', colorNumber: 3, path: 'M145,70 L145,40 Q150,35 155,40 L155,70 Z', labelX: 150, labelY: 55 },
      // 하이라이트 1 (노랑 - 반짝임)
      { id: 'highlight-1', colorNumber: 4, path: 'M100,120 Q90,110 95,100 Q105,95 110,105 Q115,115 100,120 Z', labelX: 102, labelY: 110 },
      // 하이라이트 2 (노랑 - 반짝임)
      { id: 'highlight-2', colorNumber: 4, path: 'M85,145 Q80,140 82,135 Q88,132 92,138 Q95,145 85,145 Z', labelX: 87, labelY: 140 },
      // 또 다른 잎 (초록)
      { id: 'leaf-2', colorNumber: 2, path: 'M145,68 Q130,50 100,55 Q115,70 135,67 Q142,68 145,68 Z', labelX: 122, labelY: 60 },
    ],
  },
}

// 전체 템플릿 목록
export const SAMPLE_TEMPLATES: Template[] = [
  TEMPLATE_APPLE,
  TEMPLATE_FLOWER,
  TEMPLATE_HEART,
  TEMPLATE_CAT,
]

// ID로 템플릿 찾기
export function getTemplateById(id: string): Template | undefined {
  return SAMPLE_TEMPLATES.find(t => t.id === id)
}

// 카테고리로 템플릿 필터링
export function getTemplatesByCategory(categoryId: string): Template[] {
  if (categoryId === 'all') return SAMPLE_TEMPLATES
  return SAMPLE_TEMPLATES.filter(t => t.categoryId === categoryId)
}

// 난이도로 템플릿 필터링
export function getTemplatesByDifficulty(difficulty: Template['difficulty']): Template[] {
  return SAMPLE_TEMPLATES.filter(t => t.difficulty === difficulty)
}
