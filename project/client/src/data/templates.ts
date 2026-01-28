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

// 샘플 템플릿 5: 꽃 정원 패턴 (어려움)
export const TEMPLATE_FLORAL_GARDEN: Template = {
  id: 'floral-garden',
  title: '꽃 정원',
  categoryId: 'flowers',
  difficulty: 'hard',
  colorCount: 10,
  regionCount: 45,
  estimatedTime: 30,
  thumbnailUrl: '/templates/floral-garden.png',
  usageCount: 0,
  createdAt: '2026-01-28',
  colorPalette: [
    { number: 1, hex: '#E57373', name: '연한 빨강', totalRegions: 6 }, // 양귀비 꽃잎
    { number: 2, hex: '#C62828', name: '진한 빨강', totalRegions: 3 }, // 양귀비 중심
    { number: 3, hex: '#FFFFFF', name: '흰색', totalRegions: 8 }, // 데이지 꽃잎
    { number: 4, hex: '#FDD835', name: '노랑', totalRegions: 4 }, // 데이지 중심
    { number: 5, hex: '#9575CD', name: '연보라', totalRegions: 4 }, // 엉겅퀴 꽃
    { number: 6, hex: '#4A148C', name: '진보라', totalRegions: 2 }, // 엉겅퀴 받침
    { number: 7, hex: '#66BB6A', name: '연두', totalRegions: 8 }, // 잎사귀
    { number: 8, hex: '#2E7D32', name: '진초록', totalRegions: 6 }, // 줄기/덩굴
    { number: 9, hex: '#A5D6A7', name: '민트', totalRegions: 2 }, // 고사리
    { number: 10, hex: '#FFECB3', name: '크림', totalRegions: 2 }, // 배경 장식
  ],
  templateData: {
    viewBox: '0 0 400 500',
    regions: [
      // 양귀비 꽃 1 (왼쪽 상단)
      { id: 'poppy1-petal1', colorNumber: 1, path: 'M80,120 Q60,80 80,50 Q100,80 80,120 Z', labelX: 80, labelY: 85 },
      { id: 'poppy1-petal2', colorNumber: 1, path: 'M80,120 Q40,100 30,70 Q60,90 80,120 Z', labelX: 55, labelY: 95 },
      { id: 'poppy1-petal3', colorNumber: 1, path: 'M80,120 Q120,100 130,70 Q100,90 80,120 Z', labelX: 105, labelY: 95 },
      { id: 'poppy1-center', colorNumber: 2, path: 'M80,120 m-12,0 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0', labelX: 80, labelY: 120 },

      // 양귀비 꽃 2 (중앙)
      { id: 'poppy2-petal1', colorNumber: 1, path: 'M200,200 Q175,150 200,110 Q225,150 200,200 Z', labelX: 200, labelY: 155 },
      { id: 'poppy2-petal2', colorNumber: 1, path: 'M200,200 Q150,175 140,140 Q170,165 200,200 Z', labelX: 165, labelY: 170 },
      { id: 'poppy2-petal3', colorNumber: 1, path: 'M200,200 Q250,175 260,140 Q230,165 200,200 Z', labelX: 235, labelY: 170 },
      { id: 'poppy2-center', colorNumber: 2, path: 'M200,200 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0', labelX: 200, labelY: 200 },

      // 양귀비 꽃 3 (오른쪽 하단)
      { id: 'poppy3-petal1', colorNumber: 1, path: 'M320,380 Q295,335 320,300 Q345,335 320,380 Z', labelX: 320, labelY: 340 },
      { id: 'poppy3-center', colorNumber: 2, path: 'M320,380 m-12,0 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0', labelX: 320, labelY: 380 },

      // 데이지 꽃 1 (오른쪽 상단)
      { id: 'daisy1-petal1', colorNumber: 3, path: 'M320,80 Q330,50 320,30 Q310,50 320,80 Z', labelX: 320, labelY: 55 },
      { id: 'daisy1-petal2', colorNumber: 3, path: 'M320,80 Q350,70 360,50 Q340,65 320,80 Z', labelX: 340, labelY: 65 },
      { id: 'daisy1-petal3', colorNumber: 3, path: 'M320,80 Q290,70 280,50 Q300,65 320,80 Z', labelX: 300, labelY: 65 },
      { id: 'daisy1-petal4', colorNumber: 3, path: 'M320,80 Q350,90 370,80 Q350,85 320,80 Z', labelX: 345, labelY: 82 },
      { id: 'daisy1-petal5', colorNumber: 3, path: 'M320,80 Q290,90 270,80 Q290,85 320,80 Z', labelX: 295, labelY: 82 },
      { id: 'daisy1-center', colorNumber: 4, path: 'M320,80 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0', labelX: 320, labelY: 80 },

      // 데이지 꽃 2 (왼쪽 중앙)
      { id: 'daisy2-petal1', colorNumber: 3, path: 'M70,280 Q80,250 70,230 Q60,250 70,280 Z', labelX: 70, labelY: 255 },
      { id: 'daisy2-petal2', colorNumber: 3, path: 'M70,280 Q100,270 110,250 Q90,265 70,280 Z', labelX: 90, labelY: 265 },
      { id: 'daisy2-petal3', colorNumber: 3, path: 'M70,280 Q40,270 30,250 Q50,265 70,280 Z', labelX: 50, labelY: 265 },
      { id: 'daisy2-center', colorNumber: 4, path: 'M70,280 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0', labelX: 70, labelY: 280 },

      // 데이지 꽃 3 (하단 중앙)
      { id: 'daisy3-petal1', colorNumber: 3, path: 'M180,430 Q190,400 180,380 Q170,400 180,430 Z', labelX: 180, labelY: 405 },
      { id: 'daisy3-petal2', colorNumber: 3, path: 'M180,430 Q210,420 220,400 Q200,415 180,430 Z', labelX: 200, labelY: 415 },
      { id: 'daisy3-petal3', colorNumber: 3, path: 'M180,430 Q150,420 140,400 Q160,415 180,430 Z', labelX: 160, labelY: 415 },
      { id: 'daisy3-center', colorNumber: 4, path: 'M180,430 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0', labelX: 180, labelY: 430 },

      // 작은 데이지 (오른쪽 중앙)
      { id: 'daisy4-center', colorNumber: 4, path: 'M350,250 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0', labelX: 350, labelY: 250 },

      // 엉겅퀴 꽃 1 (상단 중앙)
      { id: 'thistle1-flower', colorNumber: 5, path: 'M160,60 Q145,30 160,10 Q175,30 160,60 Q180,40 170,20 Q150,40 160,60 Z', labelX: 160, labelY: 35 },
      { id: 'thistle1-base', colorNumber: 6, path: 'M160,60 Q150,70 155,80 Q165,80 170,70 Q160,60 160,60 Z', labelX: 160, labelY: 70 },

      // 엉겅퀴 꽃 2 (오른쪽)
      { id: 'thistle2-flower', colorNumber: 5, path: 'M370,150 Q355,120 370,100 Q385,120 370,150 Q390,130 380,110 Q360,130 370,150 Z', labelX: 370, labelY: 125 },
      { id: 'thistle2-base', colorNumber: 6, path: 'M370,150 Q360,160 365,170 Q375,170 380,160 Q370,150 370,150 Z', labelX: 370, labelY: 160 },

      // 엉겅퀴 꽃 3 (왼쪽 하단)
      { id: 'thistle3-flower', colorNumber: 5, path: 'M50,400 Q35,370 50,350 Q65,370 50,400 Z', labelX: 50, labelY: 375 },

      // 엉겅퀴 꽃 4 (상단 오른쪽)
      { id: 'thistle4-flower', colorNumber: 5, path: 'M280,30 Q270,15 280,5 Q290,15 280,30 Z', labelX: 280, labelY: 17 },

      // 잎사귀들
      { id: 'leaf1', colorNumber: 7, path: 'M100,180 Q70,160 60,200 Q80,190 100,180 Z', labelX: 80, labelY: 180 },
      { id: 'leaf2', colorNumber: 7, path: 'M150,280 Q130,260 110,290 Q130,285 150,280 Z', labelX: 130, labelY: 275 },
      { id: 'leaf3', colorNumber: 7, path: 'M250,300 Q280,280 290,320 Q270,310 250,300 Z', labelX: 270, labelY: 300 },
      { id: 'leaf4', colorNumber: 7, path: 'M300,200 Q330,180 340,220 Q320,210 300,200 Z', labelX: 320, labelY: 200 },
      { id: 'leaf5', colorNumber: 7, path: 'M120,380 Q90,360 80,400 Q100,390 120,380 Z', labelX: 100, labelY: 380 },
      { id: 'leaf6', colorNumber: 7, path: 'M240,100 Q260,80 280,110 Q260,105 240,100 Z', labelX: 260, labelY: 95 },
      { id: 'leaf7', colorNumber: 7, path: 'M30,150 Q10,130 20,170 Q25,160 30,150 Z', labelX: 20, labelY: 150 },
      { id: 'leaf8', colorNumber: 7, path: 'M380,320 Q360,300 350,340 Q365,330 380,320 Z', labelX: 365, labelY: 320 },

      // 줄기/덩굴
      { id: 'stem1', colorNumber: 8, path: 'M80,130 Q90,180 70,230 Q65,180 80,130 Z', labelX: 78, labelY: 180 },
      { id: 'stem2', colorNumber: 8, path: 'M200,220 Q180,280 150,320 Q175,280 200,220 Z', labelX: 175, labelY: 270 },
      { id: 'stem3', colorNumber: 8, path: 'M320,100 Q340,160 350,220 Q335,160 320,100 Z', labelX: 335, labelY: 160 },
      { id: 'vine1', colorNumber: 8, path: 'M50,450 Q100,430 150,450 Q200,470 250,450 Q200,465 150,445 Q100,425 50,450 Z', labelX: 150, labelY: 450 },
      { id: 'vine2', colorNumber: 8, path: 'M250,450 Q300,430 350,450 Q300,445 250,450 Z', labelX: 300, labelY: 445 },
      { id: 'stem4', colorNumber: 8, path: 'M160,80 Q155,120 160,160 Q165,120 160,80 Z', labelX: 160, labelY: 120 },

      // 고사리 잎
      { id: 'fern1', colorNumber: 9, path: 'M30,350 Q20,320 40,300 Q35,325 30,350 Q50,330 60,310 Q45,335 30,350 Z', labelX: 40, labelY: 325 },
      { id: 'fern2', colorNumber: 9, path: 'M370,420 Q380,390 360,370 Q365,395 370,420 Q350,400 340,380 Q355,405 370,420 Z', labelX: 360, labelY: 395 },

      // 배경 장식 소용돌이
      { id: 'swirl1', colorNumber: 10, path: 'M20,50 Q40,30 60,50 Q40,60 20,50 Z', labelX: 40, labelY: 47 },
      { id: 'swirl2', colorNumber: 10, path: 'M380,480 Q360,460 380,440 Q390,460 380,480 Z', labelX: 380, labelY: 460 },
    ],
  },
}

// 샘플 템플릿 6: 만다라 패턴 (어려움)
export const TEMPLATE_MANDALA: Template = {
  id: 'mandala-flower',
  title: '연꽃 만다라',
  categoryId: 'pattern',
  difficulty: 'hard',
  colorCount: 8,
  regionCount: 33,
  estimatedTime: 25,
  thumbnailUrl: '',
  usageCount: 180,
  createdAt: '2026-01-27',
  colorPalette: [
    { number: 1, hex: '#9C27B0', name: '보라', totalRegions: 8 },
    { number: 2, hex: '#E91E63', name: '분홍', totalRegions: 8 },
    { number: 3, hex: '#FF9800', name: '주황', totalRegions: 4 },
    { number: 4, hex: '#FFEB3B', name: '노랑', totalRegions: 4 },
    { number: 5, hex: '#4CAF50', name: '초록', totalRegions: 4 },
    { number: 6, hex: '#2196F3', name: '파랑', totalRegions: 2 },
    { number: 7, hex: '#F44336', name: '빨강', totalRegions: 1 },
    { number: 8, hex: '#FFFFFF', name: '흰색', totalRegions: 2 },
  ],
  templateData: {
    viewBox: '0 0 300 300',
    regions: [
      // 중심 원 (빨강)
      { id: 'center', colorNumber: 7, path: 'M150,150 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0', labelX: 150, labelY: 150 },
      // 내부 꽃잎 8개 (노랑)
      { id: 'inner-petal-1', colorNumber: 4, path: 'M150,135 Q160,115 150,95 Q140,115 150,135 Z', labelX: 150, labelY: 115 },
      { id: 'inner-petal-2', colorNumber: 4, path: 'M165,150 Q185,140 205,150 Q185,160 165,150 Z', labelX: 185, labelY: 150 },
      { id: 'inner-petal-3', colorNumber: 4, path: 'M150,165 Q160,185 150,205 Q140,185 150,165 Z', labelX: 150, labelY: 185 },
      { id: 'inner-petal-4', colorNumber: 4, path: 'M135,150 Q115,140 95,150 Q115,160 135,150 Z', labelX: 115, labelY: 150 },
      // 중간 꽃잎 8개 (분홍)
      { id: 'mid-petal-1', colorNumber: 2, path: 'M150,90 Q170,70 150,50 Q130,70 150,90 Z', labelX: 150, labelY: 70 },
      { id: 'mid-petal-2', colorNumber: 2, path: 'M192,108 Q222,98 232,68 Q202,78 192,108 Z', labelX: 212, labelY: 88 },
      { id: 'mid-petal-3', colorNumber: 2, path: 'M210,150 Q230,130 250,150 Q230,170 210,150 Z', labelX: 230, labelY: 150 },
      { id: 'mid-petal-4', colorNumber: 2, path: 'M192,192 Q222,202 232,232 Q202,222 192,192 Z', labelX: 212, labelY: 212 },
      { id: 'mid-petal-5', colorNumber: 2, path: 'M150,210 Q170,230 150,250 Q130,230 150,210 Z', labelX: 150, labelY: 230 },
      { id: 'mid-petal-6', colorNumber: 2, path: 'M108,192 Q78,202 68,232 Q98,222 108,192 Z', labelX: 88, labelY: 212 },
      { id: 'mid-petal-7', colorNumber: 2, path: 'M90,150 Q70,130 50,150 Q70,170 90,150 Z', labelX: 70, labelY: 150 },
      { id: 'mid-petal-8', colorNumber: 2, path: 'M108,108 Q78,98 68,68 Q98,78 108,108 Z', labelX: 88, labelY: 88 },
      // 외부 꽃잎 8개 (보라)
      { id: 'outer-petal-1', colorNumber: 1, path: 'M150,45 Q175,25 150,5 Q125,25 150,45 Z', labelX: 150, labelY: 25 },
      { id: 'outer-petal-2', colorNumber: 1, path: 'M224,76 Q259,56 274,26 Q239,46 224,76 Z', labelX: 249, labelY: 51 },
      { id: 'outer-petal-3', colorNumber: 1, path: 'M255,150 Q275,125 295,150 Q275,175 255,150 Z', labelX: 275, labelY: 150 },
      { id: 'outer-petal-4', colorNumber: 1, path: 'M224,224 Q259,244 274,274 Q239,254 224,224 Z', labelX: 249, labelY: 249 },
      { id: 'outer-petal-5', colorNumber: 1, path: 'M150,255 Q175,275 150,295 Q125,275 150,255 Z', labelX: 150, labelY: 275 },
      { id: 'outer-petal-6', colorNumber: 1, path: 'M76,224 Q41,244 26,274 Q61,254 76,224 Z', labelX: 51, labelY: 249 },
      { id: 'outer-petal-7', colorNumber: 1, path: 'M45,150 Q25,125 5,150 Q25,175 45,150 Z', labelX: 25, labelY: 150 },
      { id: 'outer-petal-8', colorNumber: 1, path: 'M76,76 Q41,56 26,26 Q61,46 76,76 Z', labelX: 51, labelY: 51 },
      // 장식 원 4개 (주황)
      { id: 'deco-circle-1', colorNumber: 3, path: 'M150,65 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0', labelX: 150, labelY: 65 },
      { id: 'deco-circle-2', colorNumber: 3, path: 'M235,150 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0', labelX: 235, labelY: 150 },
      { id: 'deco-circle-3', colorNumber: 3, path: 'M150,235 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0', labelX: 150, labelY: 235 },
      { id: 'deco-circle-4', colorNumber: 3, path: 'M65,150 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0', labelX: 65, labelY: 150 },
      // 대각선 장식 4개 (초록)
      { id: 'deco-leaf-1', colorNumber: 5, path: 'M200,100 Q210,90 205,80 Q195,85 200,100 Z', labelX: 202, labelY: 90 },
      { id: 'deco-leaf-2', colorNumber: 5, path: 'M200,200 Q210,210 205,220 Q195,215 200,200 Z', labelX: 202, labelY: 210 },
      { id: 'deco-leaf-3', colorNumber: 5, path: 'M100,200 Q90,210 95,220 Q105,215 100,200 Z', labelX: 98, labelY: 210 },
      { id: 'deco-leaf-4', colorNumber: 5, path: 'M100,100 Q90,90 95,80 Q105,85 100,100 Z', labelX: 98, labelY: 90 },
      // 외곽 링 (파랑)
      { id: 'outer-ring-top', colorNumber: 6, path: 'M150,20 Q80,20 40,60 Q80,50 150,50 Q220,50 260,60 Q220,20 150,20 Z', labelX: 150, labelY: 35 },
      { id: 'outer-ring-bottom', colorNumber: 6, path: 'M150,280 Q80,280 40,240 Q80,250 150,250 Q220,250 260,240 Q220,280 150,280 Z', labelX: 150, labelY: 265 },
      // 모서리 장식 (흰색)
      { id: 'corner-1', colorNumber: 8, path: 'M30,30 Q45,20 60,30 Q45,40 30,30 Z', labelX: 45, labelY: 30 },
      { id: 'corner-2', colorNumber: 8, path: 'M270,270 Q255,280 240,270 Q255,260 270,270 Z', labelX: 255, labelY: 270 },
    ],
  },
}

// 전체 템플릿 목록
export const SAMPLE_TEMPLATES: Template[] = [
  TEMPLATE_APPLE,
  TEMPLATE_FLOWER,
  TEMPLATE_HEART,
  TEMPLATE_CAT,
  TEMPLATE_FLORAL_GARDEN,
  TEMPLATE_MANDALA,
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
